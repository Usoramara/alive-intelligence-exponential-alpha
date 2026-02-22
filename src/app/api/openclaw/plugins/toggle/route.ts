import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

/** POST /api/openclaw/plugins/toggle — Enable/disable a plugin */
export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let body: { plugin: string; enabled: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.plugin || typeof body.enabled !== 'boolean') {
    return NextResponse.json({ error: 'Missing "plugin" or "enabled" field' }, { status: 400 });
  }

  const result = await callOpenClaw('plugins.toggle', body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
