import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

/** GET /api/openclaw/skills/bins — List available skill bins */
export async function GET(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const result = await callOpenClaw('skills.bins');
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
