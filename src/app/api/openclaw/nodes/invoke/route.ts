import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) return NextResponse.json({ error: auth.error }, { status: 401 });
  let body: { nodeId: string; method: string; params?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.nodeId || !body.method) return NextResponse.json({ error: 'Missing "nodeId" or "method"' }, { status: 400 });
  const result = await callOpenClaw('nodes.invoke', body);
  if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 502 });
  return NextResponse.json(result.data);
}
