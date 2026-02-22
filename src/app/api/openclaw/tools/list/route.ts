import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { tools } from '@/lib/tools/registry';

/**
 * GET /api/openclaw/tools/list
 * Returns all Wybe tools in OpenClaw-compatible format.
 */
export async function GET(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  // Map to OpenClaw format (name, description, parameters)
  const openclawTools = tools.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.input_schema,
    source: 'wybe-cognitive',
  }));

  return NextResponse.json({
    tools: openclawTools,
    count: openclawTools.length,
  });
}
