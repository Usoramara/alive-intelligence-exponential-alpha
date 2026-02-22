import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

/** POST /api/openclaw/skills/install — Install a skill */
export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let body: { skill: string; version?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.skill) {
    return NextResponse.json({ error: 'Missing "skill" field' }, { status: 400 });
  }

  const result = await callOpenClaw('skills.install', { skill: body.skill, version: body.version });
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
