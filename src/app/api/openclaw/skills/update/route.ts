import { NextResponse } from 'next/server';
import { validateOpenClawAuth } from '@/lib/openclaw-auth';
import { callOpenClaw } from '@/lib/openclaw-rpc';

/** POST /api/openclaw/skills/update — Update a skill */
export async function POST(request: Request) {
  const auth = validateOpenClawAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let body: { skill: string; enabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.skill) {
    return NextResponse.json({ error: 'Missing "skill" field' }, { status: 400 });
  }

  const result = await callOpenClaw('skills.update', body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error.message }, { status: 502 });
  }

  return NextResponse.json(result.data);
}
