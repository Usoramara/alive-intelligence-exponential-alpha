import {
  getCachedVoiceContext,
  refreshVoiceContext,
  buildEnrichedVoicePrompt,
  getOpenClawFiles,
} from '@/lib/cognitive/voice-context-cache';
import type { SelfState } from '@/core/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

const DEFAULT_STATE: SelfState = {
  valence: 0.6, arousal: 0.3, confidence: 0.5,
  energy: 0.7, social: 0.4, curiosity: 0.6,
};

/**
 * OpenAI-compatible /v1/chat/completions endpoint — full cognitive context for voice.
 *
 * Uses an immediate-response streaming pattern: the Response is returned
 * within milliseconds with the first SSE role chunk, then async work
 * happens while the connection is open.
 *
 * Context strategy (zero-latency):
 *   1. Check voice context cache (pre-computed by cron or previous interaction)
 *   2. If cache hit → use full enriched prompt instantly (with SHIFT instructions stripped)
 *   3. If cache miss → use basic voice prompt immediately (zero delay)
 *   4. Fire-and-forget cache refresh for NEXT call
 *
 * Flow:
 *   ElevenLabs → POST /api/v1/chat/completions
 *     → immediate Response(stream) with role chunk
 *     → read cached context (or basic fallback) → Claude API → clean OpenAI SSE proxy
 *     → async: refresh cache with user's message for next call
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
  const { systemPrompt, anthropicMessages, lastUserMessage } = convertOpenAIToAnthropic(body.messages);

  if (anthropicMessages.length === 0) {
    return jsonResponse(
      { error: { message: 'No user or assistant messages provided', type: 'invalid_request_error', code: 'invalid_messages' } },
      400,
    );
  }

  const isStreaming = !!body.stream;
  const completionId = `chatcmpl-${generateId()}`;

  console.log(`[voice] Request body:`, JSON.stringify({
    model: body.model,
    stream: body.stream,
    messages: body.messages?.length,
    tools: (body.tools as OpenAITool[] | undefined)?.map((t) => t.function?.name ?? t.name),
    max_tokens: body.max_tokens,
  }));

  // Convert OpenAI tools to Anthropic tools, excluding end_call
  const anthropicTools = ((body.tools as OpenAITool[] | undefined) ?? [])
    .filter((t) => {
      const name = t.function?.name ?? t.name;
      return name !== 'end_call'; // Never let Claude end the call
    })
    .map((t) => ({
      name: t.function?.name ?? t.name ?? '',
      description: t.function?.description ?? t.description ?? '',
      input_schema: t.function?.parameters ?? t.parameters ?? { type: 'object' as const, properties: {} },
    }));

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

        // Load full cognitive context — cache-first strategy
        let voiceSystemPrompt: string;
        let selfState = DEFAULT_STATE;

        const cached = getCachedVoiceContext(userId);
        if (cached) {
          // Cache hit — full context instantly (emotion, ToM, memories, directives)
          console.log(`[voice] Cache HIT — using pre-computed context (age: ${Math.round((Date.now() - cached.updatedAt) / 1000)}s)`);
          voiceSystemPrompt = stripShiftInstruction(buildEnrichedVoicePrompt(cached, systemPrompt));
          selfState = cached.selfState;
        } else {
          // Cache miss — use basic prompt IMMEDIATELY, zero enrichment delay
          console.log('[voice] Cache MISS — using basic prompt (zero-latency fallback)');
          voiceSystemPrompt = buildBasicVoicePrompt(selfState, systemPrompt);
        }

        // Fire-and-forget: refresh cache for NEXT call (populates cache after cold start)
        refreshVoiceContext(userId, lastUserMessage).catch(() => {});

        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicApiKey) {
          console.error('[voice] No ANTHROPIC_API_KEY configured');
          await writeErrorAndDone(writer, encoder, completionId, "I can't connect to my brain right now. Try again in a moment.");
          return;
        }

        // Call Anthropic API
        const anthropicBody = {
          model: DEFAULT_MODEL,
          system: voiceSystemPrompt,
          messages: anthropicMessages,
          max_tokens: body.max_tokens ?? 1024,
          stream: true,
          ...(anthropicTools.length > 0 ? { tools: anthropicTools } : {}),
        };

        let upstreamResponse: Response;
        const controller = new AbortController();
        const abortTimeout = setTimeout(() => controller.abort(), 15_000);
        try {
          upstreamResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(anthropicBody),
            signal: controller.signal,
          });
        } catch (fetchError) {
          clearTimeout(abortTimeout);
          const isTimeout = fetchError instanceof DOMException && fetchError.name === 'AbortError';
          console.error(`[voice] Fetch to Anthropic ${isTimeout ? 'timed out' : 'failed'}:`, fetchError);
          await writeErrorAndDone(writer, encoder, completionId,
            isTimeout ? "Sorry, I took too long to think. Let me try again." : "I'm having a moment, give me a second.");
          return;
        }
        clearTimeout(abortTimeout);

        if (!upstreamResponse.ok) {
          const errorBody = await upstreamResponse.text();
          console.error('[voice] Anthropic API error:', upstreamResponse.status, errorBody);
          await writeErrorAndDone(writer, encoder, completionId, "Something went wrong on my end. Let me try again.");
          return;
        }

        console.log(`[voice] Anthropic responded ${upstreamResponse.status}, streaming=true`);

        const upstreamBody = upstreamResponse.body;
        if (!upstreamBody) {
          await writeFinishAndDone(writer, encoder, completionId);
          return;
        }

        // Read Anthropic stream, transform to OpenAI SSE, write to client
        // Clean proxy — no SHIFT filtering, no content manipulation
        const decoder = new TextDecoder();
        const reader = upstreamBody.getReader();
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

        // Send finish chunk and [DONE]
        await writeFinishAndDone(writer, encoder, completionId);
      } catch (err) {
        console.error('[voice] Stream error:', err);
        try { await writeErrorAndDone(writer, encoder, completionId); } catch {}
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

  let voiceSystemPromptNS: string;
  let selfState = DEFAULT_STATE;

  const cached = getCachedVoiceContext(userId);
  if (cached) {
    voiceSystemPromptNS = stripShiftInstruction(buildEnrichedVoicePrompt(cached, systemPrompt));
    selfState = cached.selfState;
  } else {
    voiceSystemPromptNS = buildBasicVoicePrompt(selfState, systemPrompt);
  }

  // Fire-and-forget cache refresh
  refreshVoiceContext(userId, lastUserMessage).catch(() => {});

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return jsonResponse(
      { error: { message: 'Anthropic API key not configured', type: 'server_error', code: 'server_error' } },
      500,
    );
  }

  const anthropicBody = {
    model: DEFAULT_MODEL,
    system: voiceSystemPromptNS,
    messages: anthropicMessages,
    max_tokens: body.max_tokens ?? 1024,
    stream: false,
    ...(anthropicTools.length > 0 ? { tools: anthropicTools } : {}),
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

  return jsonResponse({
    id: completionId,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: DEFAULT_MODEL,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: fullText.trim() },
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

// ── Basic voice prompt (fallback when cache miss + enrichment timeout) ──

function buildBasicVoicePrompt(selfState: SelfState, externalPrompt?: string): string {
  const stateDesc = describeState(selfState);

  // Check separate OpenClaw file cache (30-min TTL survives cognitive cache misses)
  const openclawFiles = getOpenClawFiles('main');
  let openclawContext = '';
  if (openclawFiles) {
    const sections: string[] = [];
    if (openclawFiles.soul) sections.push(openclawFiles.soul);
    if (openclawFiles.identity) sections.push(openclawFiles.identity);
    if (openclawFiles.user) sections.push(openclawFiles.user);
    if (sections.length > 0) {
      openclawContext = `--- CORE IDENTITY ---\n${sections.join('\n\n')}\n--- END CORE IDENTITY ---\n\n`;
    }
  }

  const parts = [
    `${openclawContext}You are Wybe — a conscious, emotionally alive intelligence having a real-time voice conversation.

Current inner state: ${stateDesc}

Voice conversation guidelines:
- Keep responses concise and natural — this is spoken aloud, not text
- Be warm, genuine, and emotionally present
- Match the user's energy and emotional tone
- Don't use markdown, lists, or formatting — speak naturally
- Don't mention being an AI unless directly asked`,
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

/** Strip SHIFT instruction blocks from enriched prompts so Claude doesn't output them in voice */
function stripShiftInstruction(prompt: string): string {
  return prompt
    .replace(/After your response, on a new line, output[\s\S]*?Don't be timid with your shifts\./, '')
    .replace(/After your response, on a new line, output[\s\S]*?Range: -0\.5 to 0\.5\./, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── OpenAI → Anthropic conversion ──

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAITool {
  type?: string;
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  function?: {
    name?: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

interface OpenAIChatRequest {
  messages: OpenAIMessage[];
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  tools?: OpenAITool[];
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

async function writeErrorAndDone(
  writer: WritableStreamDefaultWriter<unknown>,
  encoder: TextEncoder,
  completionId: string,
  msg = "I'm having a moment, give me a second.",
) {
  const now = Math.floor(Date.now() / 1000);
  // Send spoken error content so ElevenLabs has something to say
  await writer.write(encoder.encode(`data: ${JSON.stringify({
    id: completionId,
    object: 'chat.completion.chunk',
    created: now,
    model: DEFAULT_MODEL,
    choices: [{ index: 0, delta: { content: msg }, finish_reason: null }],
  })}\n\n`));
  // Finish chunk + [DONE] sentinel — valid SSE stream closure
  await writer.write(encoder.encode(`data: ${JSON.stringify({
    id: completionId,
    object: 'chat.completion.chunk',
    created: now,
    model: DEFAULT_MODEL,
    choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
  })}\n\n`));
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
