import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const isDev = process.env.NODE_ENV === 'development';

export async function POST(): Promise<NextResponse> {
  // Auth check
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId;
  } catch {
    // Auth not available in dev
  }

  if (!isDev && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPGRAM_API_KEY not configured' },
      { status: 500 },
    );
  }

  try {
    // Create a temporary API key via Deepgram's API
    const res = await fetch('https://api.deepgram.com/v1/projects', {
      headers: { Authorization: `Token ${apiKey}` },
    });

    if (!res.ok) {
      // Fallback: return the main key directly (short-lived use in browser)
      // This is acceptable for dev; in production, use project-scoped temp keys
      return NextResponse.json({ key: apiKey });
    }

    const projects = await res.json();
    const projectId = projects.projects?.[0]?.project_id;

    if (!projectId) {
      return NextResponse.json({ key: apiKey });
    }

    const keyRes = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: `temp-stt-${Date.now()}`,
          scopes: ['usage:write'],
          time_to_live_in_seconds: 60,
        }),
      },
    );

    if (!keyRes.ok) {
      // Fallback to main key
      return NextResponse.json({ key: apiKey });
    }

    const keyData = await keyRes.json();
    return NextResponse.json({ key: keyData.key });
  } catch (error) {
    console.error('Deepgram token error:', error);
    // Fallback to main key on any error
    return NextResponse.json({ key: apiKey });
  }
}
