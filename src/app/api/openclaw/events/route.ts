import { NextResponse } from 'next/server';
import { processOpenClawEvent, type OpenClawEvent } from '@/lib/openclaw-events';
import { z } from 'zod/v4';

const GATEWAY_API_KEY = process.env.WYBE_GATEWAY_API_KEY;

// ── Zod schemas per event type ──

const baseEventSchema = z.object({
  type: z.string(),
  source: z.string().optional(),
  content: z.string().optional(),
  channel: z.string().optional(),
  sessionKey: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const messageReceivedSchema = baseEventSchema.extend({
  type: z.literal('message.received'),
  content: z.string().min(1),
});

const agentCompleteSchema = baseEventSchema.extend({
  type: z.literal('agent.complete'),
  agentId: z.string().optional(),
});

const sessionSchema = baseEventSchema.extend({
  type: z.enum(['session.start', 'session.end']),
  sessionKey: z.string().optional(),
});

const channelSchema = baseEventSchema.extend({
  type: z.enum(['channel.connected', 'channel.disconnected']),
  channel: z.string(),
});

const toolSchema = baseEventSchema.extend({
  type: z.enum(['tool.call', 'tool.result']),
  metadata: z.object({
    toolName: z.string().optional(),
  }).passthrough().optional(),
});

const agentSchema = baseEventSchema.extend({
  type: z.enum(['agent.start', 'agent.error']),
  agentId: z.string().optional(),
});

const cronSchema = baseEventSchema.extend({
  type: z.literal('cron.fired'),
});

const nodeSchema = baseEventSchema.extend({
  type: z.enum(['node.connected', 'node.disconnected']),
});

/** Pick the right schema based on event type, or fall back to base */
function validateEvent(body: unknown): { success: true; data: OpenClawEvent } | { success: false; error: string } {
  // First check it's an object with a type
  const base = baseEventSchema.safeParse(body);
  if (!base.success) {
    return { success: false, error: z.prettifyError(base.error) };
  }

  const type = base.data.type;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let schema: z.ZodType<any> | null = null;

  switch (type) {
    case 'message.received':
      schema = messageReceivedSchema;
      break;
    case 'agent.complete':
      schema = agentCompleteSchema;
      break;
    case 'session.start':
    case 'session.end':
      schema = sessionSchema;
      break;
    case 'channel.connected':
    case 'channel.disconnected':
      schema = channelSchema;
      break;
    case 'tool.call':
    case 'tool.result':
      schema = toolSchema;
      break;
    case 'agent.start':
    case 'agent.error':
      schema = agentSchema;
      break;
    case 'cron.fired':
      schema = cronSchema;
      break;
    case 'node.connected':
    case 'node.disconnected':
      schema = nodeSchema;
      break;
    default:
      // Unknown event type — allow through with base validation
      return { success: true, data: base.data as OpenClawEvent };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return { success: false, error: z.prettifyError(result.error) };
  }

  return { success: true, data: result.data as OpenClawEvent };
}

export async function POST(request: Request) {
  // Verify auth
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!GATEWAY_API_KEY || apiKey !== GATEWAY_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = validateEvent(body);
  if (!validation.success) {
    return NextResponse.json({ error: `Validation failed: ${validation.error}` }, { status: 400 });
  }

  // Process asynchronously — return immediately
  processOpenClawEvent(validation.data).catch((err) => {
    console.error('[openclaw-events] processing error:', err);
  });

  return NextResponse.json({ ok: true });
}
