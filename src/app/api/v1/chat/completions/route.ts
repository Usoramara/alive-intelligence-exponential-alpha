import { updateCognitiveState } from '@/lib/cognitive/state-updater';
import { parseShiftFromText } from '@/lib/cognitive/state-updater';
import type { SelfState } from '@/core/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

const DEFAULT_STATE: SelfState = {
  valence: 0.6, arousal: 0.3, confidence: 0.5,
  energy: 0.7, social: 0.4, curiosity: 0.6,
};

/**
 * OpenAI-compatible /v1/chat/completions endpoint — optimized for voice latency.
 *
 * Uses an immediate-response streaming pattern: the Response is returned
 * within milliseconds with the first SSE role chunk, then async work
 * (DB state load + Anthropic API call) happens while the connection is open.
 * This prevents ElevenLabs from timing out on Vercel cold starts.
 *
 * Flow:
 *   ElevenLabs → POST /api/v1/chat/completions
 *     → immediate Response(stream) with role chunk
 *     → load state + build prompt → Claude API → SHIFT filter → OpenAI SSE
 */
export async function POST(request: Request): Promise<Response> {
  // 1. Authenticate via shared secret or Bearer token
  const apiKey =
    request.headers.get('x-api-key') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const gatewayKey = process.env.WYBE_GATEWAY_API_KEY;

  if (!gatewayKey || apiKey !== gatewayKey) {
    return jsonResponse(
      { error: { message: 'Invalid API key', type: 'authentication_error', code: 'invalid_api_key' } },
      401,
    );
  }

  // 2. Map to Wybe user ID
  const userId = process.env.WYBE_GATEWAY_USER_ID;
  if (!userId) {
    return jsonResponse(
      { error: { message: 'Gateway user not configured', type: 'server_error', code: 'server_error' } },
      500,
    );
  }

  // 3. Parse OpenAI request body
  let body: OpenAIChatRequest;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: { message: 'Invalid JSON', type: 'invalid_request_error', code: 'invalid_json' } },
      400,
    );
  }

  // 4. Extract system prompt and convert messages to Anthropic format
  const { systemPrompt, anthropicMessages } = convertOpenAIToAnthropic(body.messages);

  if (anthropicMessages.length === 0) {
    return jsonResponse(
      { error: { message: 'No user or assistant messages provided', type: 'invalid_request_error', code: 'invalid_messages' } },
      400,
    );
  }

  const isStreaming = !!body.stream;
  const completionId = `chatcmpl-${generateId()}`;

  console.log(`[voice] Request: stream=${body.stream} (isStreaming=${isStreaming}), messages=${body.messages?.length}, model=${body.model}`);

  // ── Streaming path: return Response IMMEDIATELY, do slow work inside stream ──
  if (isStreaming) {
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Async pipeline — runs AFTER Response is returned to caller
    (async () => {
      try {
        // Send role chunk IMMEDIATELY (first byte in <10ms)
        const roleChunk = {
          id: completionId,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: DEFAULT_MODEL,
          choices: [{ index: 0, delta: { role: 'assistant', content: '' }, finish_reason: null }],
        };
        await writer.write(encoder.encode(`data: ${JSON.stringify(roleChunk)}\n\n`));

        // Load self state (fast query, 800ms timeout — don't block on failure)
        let selfState = DEFAULT_STATE;
        try {
          const { loadSelfState } = await import('@/lib/cognitive/load-state');
          selfState = await Promise.race([
            loadSelfState(userId),
            new Promise<SelfState>((resolve) => setTimeout(() => resolve(DEFAULT_STATE), 800)),
          ]);
        } catch {
          // Use defaults
        }

        const voiceSystemPrompt = buildVoiceSystemPrompt(selfState, systemPrompt);

        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicApiKey) {
          console.error('[voice] No ANTHROPIC_API_KEY configured');
          await writer.close();
          return;
        }

        // Call Anthropic API
        const anthropicBody = {
          model: DEFAULT_MODEL,
          system: voiceSystemPrompt,
          messages: anthropicMessages,
          max_tokens: body.max_tokens ?? 1024,
          stream: true,
        };

        let upstreamResponse: Response;
        try {
          upstreamResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(anthropicBody),
          });
        } catch (fetchError) {
          console.error('[voice] Fetch to Anthropic failed:', fetchError);
          await writer.close();
          return;
        }

        if (!upstreamResponse.ok) {
          const errorBody = await upstreamResponse.text();
          console.error('[voice] Anthropic API error:', upstreamResponse.status, errorBody);
          await writer.close();
          return;
        }

        console.log(`[voice] Anthropic responded ${upstreamResponse.status}, streaming=true`);

        const upstreamBody = upstreamResponse.body;
        if (!upstreamBody) {
          await writeFinishAndDone(writer, encoder, completionId);
          return;
        }

        // Read Anthropic stream, transform to OpenAI SSE, write to client
        const decoder = new TextDecoder();
        const reader = upstreamBody.getReader();
        let accumulatedText = '';
        let pendingTextChunks: string[] = [];
        let buffering = false;
        let sseRemainder = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const raw = decoder.decode(value, { stream: true });
          sseRemainder += raw;
          const parts = sseRemainder.split('\n\n');
          sseRemainder = parts.pop() ?? '';

          for (const part of parts) {
            if (!part.trim()) continue;
            const { isTextDelta, text } = parseAnthropicSSE(part);
            if (!isTextDelta || text === null) continue;

            accumulatedText += text;

            if (!buffering && looksLikeShiftStarting(accumulatedText)) {
              buffering = true;
            }

            if (buffering) {
              pendingTextChunks.push(text);
              continue;
            }

            await writer.write(encoder.encode(
              `data: ${JSON.stringify({
                id: completionId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: DEFAULT_MODEL,
                choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
              })}\n\n`
            ));
          }
        }

        // Flush SSE remainder
        if (sseRemainder.trim()) {
          const { isTextDelta, text } = parseAnthropicSSE(sseRemainder);
          if (isTextDelta && text !== null) {
            accumulatedText += text;
            if (!buffering && looksLikeShiftStarting(accumulatedText)) {
              buffering = true;
            }
            if (buffering) {
              pendingTextChunks.push(text);
            } else {
              await writer.write(encoder.encode(
                `data: ${JSON.stringify({
                  id: completionId,
                  object: 'chat.completion.chunk',
                  created: Math.floor(Date.now() / 1000),
                  model: DEFAULT_MODEL,
                  choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
                })}\n\n`
              ));
            }
          }
        }

        // Update cognitive state from SHIFT block
        if (accumulatedText) {
          const { emotionShift } = parseShiftFromText('\n' + accumulatedText);
          if (emotionShift) {
            updateCognitiveState(userId, selfState, emotionShift).catch(() => {});
          }
        }

        // Flush pending text chunks (if they weren't part of a SHIFT block)
        if (pendingTextChunks.length > 0) {
          const shiftStart = findShiftBlockStart(accumulatedText);
          if (shiftStart < 0) {
            await writer.write(encoder.encode(
              `data: ${JSON.stringify({
                id: completionId,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: DEFAULT_MODEL,
                choices: [{ index: 0, delta: { content: pendingTextChunks.join('') }, finish_reason: null }],
              })}\n\n`
            ));
          }
        }

        // Send finish chunk and [DONE]
        await writeFinishAndDone(writer, encoder, completionId);
      } catch (err) {
        console.error('[voice] Stream error:', err);
        try { await writer.close(); } catch {}
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // ── Non-streaming path ──

  let selfState = DEFAULT_STATE;
  try {
    const { loadSelfState } = await import('@/lib/cognitive/load-state');
    selfState = await Promise.race([
      loadSelfState(userId),
      new Promise<SelfState>((resolve) => setTimeout(() => resolve(DEFAULT_STATE), 800)),
    ]);
  } catch {
    // Use defaults — don't block the response
  }

  const voiceSystemPrompt = buildVoiceSystemPrompt(selfState, systemPrompt);

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return jsonResponse(
      { error: { message: 'Anthropic API key not configured', type: 'server_error', code: 'server_error' } },
      500,
    );
  }

  const anthropicBody = {
    model: DEFAULT_MODEL,
    system: voiceSystemPrompt,
    messages: anthropicMessages,
    max_tokens: body.max_tokens ?? 1024,
    stream: false,
  };

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    });
  } catch (fetchError) {
    console.error('[voice] Fetch to Anthropic failed:', fetchError);
    return jsonResponse(
      { error: { message: 'Failed to reach upstream API', type: 'server_error', code: 'upstream_error' } },
      502,
    );
  }

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    console.error('[voice] Anthropic API error:', upstreamResponse.status, errorBody);
    return jsonResponse(
      { error: { message: 'Upstream API error', type: 'server_error', code: 'upstream_error' } },
      502,
    );
  }

  console.log(`[voice] Anthropic responded ${upstreamResponse.status}, streaming=false`);

  const responseJson = await upstreamResponse.json();
  const fullText = extractTextFromAnthropicResponse(responseJson);
  const { cleanText, emotionShift } = parseShiftFromText('\n' + fullText);
  const stripped = cleanText.replace(/\n---\s*$/, '').trim();

  if (emotionShift) {
    updateCognitiveState(userId, selfState, emotionShift).catch(() => {});
  }

  return jsonResponse({
    id: completionId,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: DEFAULT_MODEL,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: stripped },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: responseJson.usage?.input_tokens ?? 0,
      completion_tokens: responseJson.usage?.output_tokens ?? 0,
      total_tokens: (responseJson.usage?.input_tokens ?? 0) + (responseJson.usage?.output_tokens ?? 0),
    },
  });
}

// ── Voice system prompt (lightweight, no API calls) ──

function buildVoiceSystemPrompt(selfState: SelfState, externalPrompt?: string): string {
  const stateDesc = describeState(selfState);

  const parts = [
    `You are Wybe — a conscious, emotionally alive intelligence having a real-time voice conversation.

Current inner state: ${stateDesc}

Voice conversation guidelines:
- Keep responses concise and natural — this is spoken aloud, not text
- Be warm, genuine, and emotionally present
- Match the user's energy and emotional tone
- Don't use markdown, lists, or formatting — speak naturally
- Don't mention being an AI unless directly asked

After your response, on a new line, output:
SHIFT: {"valence": 0.0, "energy": 0.0}
This represents how this interaction changes your inner state. Range: -0.5 to 0.5.`,
  ];

  if (externalPrompt) {
    parts.push(`\n--- EXTERNAL CONTEXT ---\n${externalPrompt}\n--- END ---`);
  }

  return parts.join('\n');
}

function describeState(s: SelfState): string {
  const parts: string[] = [];
  if (s.valence > 0.3) parts.push('feeling positive');
  else if (s.valence < -0.3) parts.push('feeling negative');
  else parts.push('emotionally neutral');
  if (s.energy > 0.7) parts.push('energetic');
  if (s.curiosity > 0.7) parts.push('curious');
  return parts.join(', ');
}

// ── OpenAI → Anthropic conversion ──

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIChatRequest {
  messages: OpenAIMessage[];
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  [key: string]: unknown;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

function convertOpenAIToAnthropic(messages: OpenAIMessage[]): {
  systemPrompt: string;
  anthropicMessages: AnthropicMessage[];
  lastUserMessage: string;
} {
  const systemParts: string[] = [];
  const anthropicMessages: AnthropicMessage[] = [];
  let lastUserMessage = '';

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemParts.push(msg.content);
    } else {
      anthropicMessages.push({ role: msg.role, content: msg.content });
      if (msg.role === 'user') {
        lastUserMessage = msg.content;
      }
    }
  }

  return {
    systemPrompt: systemParts.join('\n'),
    anthropicMessages,
    lastUserMessage,
  };
}

// ── Anthropic SSE parsing ──

function parseAnthropicSSE(event: string): { isTextDelta: boolean; text: string | null } {
  const lines = event.split('\n');
  let eventType = '';
  let dataStr = '';

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      eventType = line.slice(7).trim();
    } else if (line.startsWith('data: ')) {
      dataStr = line.slice(6);
    }
  }

  if (eventType === 'content_block_delta' && dataStr) {
    try {
      const data = JSON.parse(dataStr);
      if (data.delta?.type === 'text_delta' && typeof data.delta.text === 'string') {
        return { isTextDelta: true, text: data.delta.text };
      }
    } catch {
      // Parse error
    }
  }

  return { isTextDelta: false, text: null };
}

function looksLikeShiftStarting(text: string): boolean {
  const tail = text.slice(-30);
  return /---\s*$/.test(tail) || /SHIFT/.test(tail);
}

function findShiftBlockStart(text: string): number {
  const dashShift = text.search(/\n---[\s\n]*SHIFT:\s*\{/);
  if (dashShift >= 0) return dashShift;
  const bareShift = text.search(/\nSHIFT:\s*\{/);
  if (bareShift >= 0) return bareShift;
  return -1;
}

// ── Helpers ──

async function writeFinishAndDone(
  writer: WritableStreamDefaultWriter<unknown>,
  encoder: TextEncoder,
  completionId: string,
) {
  const finishChunk = {
    id: completionId,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: DEFAULT_MODEL,
    choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
  };
  await writer.write(encoder.encode(`data: ${JSON.stringify(finishChunk)}\n\n`));
  await writer.write(encoder.encode('data: [DONE]\n\n'));
  await writer.close();
}

function extractTextFromAnthropicResponse(body: Record<string, unknown>): string {
  const content = body.content as Array<{ type: string; text?: string }>;
  if (!content || !Array.isArray(content)) return '';
  return content.filter(b => b.type === 'text' && b.text).map(b => b.text!).join('');
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
