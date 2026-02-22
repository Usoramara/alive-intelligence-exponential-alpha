import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) return NextResponse.json({ error: auth.error }, { status: 401 });
  let body: { deviceId: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.deviceId) return NextResponse.json({ error: 'Missing "deviceId"' }, { status: 400 });
  const result = await callOpenClaw('device.reject', { deviceId: body.deviceId });
  if (!result.ok) return NextResponse.json({ error: result.error.message }, { status: 502 });
  return NextResponse.json(result.data);
}
