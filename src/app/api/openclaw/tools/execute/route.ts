import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { executeTool } from '@/lib/tools/executor';
import { tools } from '@/lib/tools/registry';

/**
 * POST /api/openclaw/tools/execute
 * Execute a Wybe tool on behalf of OpenClaw.
 *
 * Body: { tool: string, input: Record<string, unknown>, requestId?: string }
 */
export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let body: { tool: string; input: Record<string, unknown>; requestId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.tool || typeof body.tool !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid "tool" field' }, { status: 400 });
  }

  // Verify tool exists
  const toolDef = tools.find((t) => t.name === body.tool);
  if (!toolDef) {
    return NextResponse.json(
      { error: `Unknown tool: ${body.tool}`, available: tools.map((t) => t.name) },
      { status: 404 },
    );
  }

  const result = await executeTool({
    id: body.requestId || crypto.randomUUID(),
    name: body.tool,
    input: body.input || {},
    userId: auth.userId,
  });

  return NextResponse.json({
    requestId: body.requestId,
    tool: body.tool,
    result: result.content,
    is_error: result.is_error ?? false,
  });
}
