import { enrichWithCognition } from '@/lib/cognitive-middleware';
import { updateCognitiveState } from '@/lib/cognitive/state-updater';
import { parseShiftFromText } from '@/lib/cognitive/state-updater';
import type { SelfState } from '@/core/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

/**
 * OpenAI-compatible /v1/chat/completions endpoint.
 *
 * ElevenLabs (and any OpenAI-compatible client) POSTs here with the standard
 * OpenAI chat format. We translate to Anthropic format, enrich with Wybe's
 * cognitive context, call Claude, then translate the response back to OpenAI
 * format — stripping SHIFT lines so they're never spoken by TTS.
 *
 * Flow:
 *   ElevenLabs → POST /api/v1/chat/completions → enrichWithCognition() → Anthropic API → SHIFT filter → OpenAI SSE → ElevenLabs
 */
export async function POST(request: Request): Promise<Response> {
  // 1. Authenticate via shared secret
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

  // 5. Enrich with cognitive context
  let enrichedSystem: string;
  let selfState: SelfState;
  try {
    const result = await enrichWithCognition({
      userId,
      userMessage: lastUserMessage,
      existingSystemPrompt: systemPrompt || undefined,
    });
    enrichedSystem = result.enrichedSystemPrompt;
    selfState = result.selfState;
  } catch (err) {
    console.error('[openai-compat] Cognitive enrichment failed, using passthrough:', err);
    enrichedSystem = systemPrompt || '';
    selfState = { valence: 0.6, arousal: 0.3, confidence: 0.5, energy: 0.7, social: 0.4, curiosity: 0.6 };
  }

  // 6. Build Anthropic request
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return jsonResponse(
      { error: { message: 'Anthropic API key not configured', type: 'server_error', code: 'server_error' } },
      500,
    );
  }

  const isStreaming = body.stream ?? false;

  const anthropicBody = {
    model: DEFAULT_MODEL,
    system: enrichedSystem,
    messages: anthropicMessages,
    max_tokens: body.max_tokens ?? 1024,
    stream: isStreaming,
  };

  // 7. Call Anthropic API
  const upstreamResponse = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(anthropicBody),
  });

  if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    console.error('[openai-compat] Anthropic API error:', upstreamResponse.status, errorBody);
    return jsonResponse(
      { error: { message: 'Upstream API error', type: 'server_error', code: 'upstream_error' } },
      502,
    );
  }

  // 8. Convert response: Anthropic → OpenAI format
  const completionId = `chatcmpl-${generateId()}`;

  if (isStreaming) {
    const stream = createOpenAIStreamFromAnthropic(
      upstreamResponse,
      completionId,
      userId,
      selfState,
    );

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } else {
    // Non-streaming
    const responseJson = await upstreamResponse.json();
    const fullText = extractTextFromAnthropicResponse(responseJson);
    const { cleanText, emotionShift } = parseShiftFromText('\n' + fullText);
    const stripped = cleanText.replace(/\n---\s*$/, '').trim();

    // Fire-and-forget state update
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

// ── Anthropic → OpenAI streaming conversion ──

function createOpenAIStreamFromAnthropic(
  upstreamResponse: Response,
  completionId: string,
  userId: string,
  selfState: SelfState,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const upstreamBody = upstreamResponse.body!;

  let accumulatedText = '';
  let pendingTextChunks: string[] = [];
  let buffering = false;
  let sseRemainder = '';

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const raw = decoder.decode(chunk, { stream: true });
      sseRemainder += raw;
      const parts = sseRemainder.split('\n\n');
      sseRemainder = parts.pop() ?? '';

      for (const part of parts) {
        if (!part.trim()) continue;
        processEvent(part, controller);
      }
    },
    flush(controller) {
      if (sseRemainder.trim()) {
        processEvent(sseRemainder, controller);
      }

      // At stream end, parse SHIFT from accumulated text and update state
      if (accumulatedText) {
        const { emotionShift } = parseShiftFromText('\n' + accumulatedText);
        if (emotionShift) {
          updateCognitiveState(userId, selfState, emotionShift).catch(() => {});
        }
      }

      // Flush any pending text that wasn't SHIFT
      if (pendingTextChunks.length > 0) {
        const pendingText = pendingTextChunks.join('');
        const shiftStart = findShiftBlockStart(accumulatedText);
        if (shiftStart < 0) {
          // No SHIFT found — send pending text
          emitOpenAIDelta(controller, encoder, completionId, pendingText);
        }
        pendingTextChunks = [];
      }

      // Send finish and DONE
      emitOpenAIFinish(controller, encoder, completionId);
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
    },
  });

  function processEvent(event: string, controller: TransformStreamDefaultController<Uint8Array>) {
    const { isTextDelta, text } = parseAnthropicSSE(event);

    if (!isTextDelta || text === null) return;

    accumulatedText += text;

    if (!buffering && looksLikeShiftStarting(accumulatedText)) {
      buffering = true;
    }

    if (buffering) {
      pendingTextChunks.push(text);
      return;
    }

    // Emit as OpenAI SSE delta
    emitOpenAIDelta(controller, encoder, completionId, text);
  }

  return upstreamBody.pipeThrough(transform);
}

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

// ── OpenAI SSE helpers ──

function emitOpenAIDelta(
  controller: TransformStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  id: string,
  content: string,
) {
  const chunk = {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: DEFAULT_MODEL,
    choices: [
      {
        index: 0,
        delta: { content },
        finish_reason: null,
      },
    ],
  };
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
}

function emitOpenAIFinish(
  controller: TransformStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  id: string,
) {
  const chunk = {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: DEFAULT_MODEL,
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  };
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
}

function extractTextFromAnthropicResponse(body: Record<string, unknown>): string {
  const content = body.content as Array<{ type: string; text?: string }>;
  if (!content || !Array.isArray(content)) return '';
  return content
    .filter(b => b.type === 'text' && b.text)
    .map(b => b.text!)
    .join('');
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ── Helpers ──

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
