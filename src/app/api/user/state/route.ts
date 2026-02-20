import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const [state] = await db
    .select()
    .from(cognitiveStates)
    .where(eq(cognitiveStates.userId, userId));

  if (!state) {
    // Return defaults
    return NextResponse.json({
      valence: 0.6,
      arousal: 0.3,
      confidence: 0.5,
      energy: 0.7,
      social: 0.4,
      curiosity: 0.6,
    });
  }

  return NextResponse.json({
    valence: state.valence,
    arousal: state.arousal,
    confidence: state.confidence,
    energy: state.energy,
    social: state.social,
    curiosity: state.curiosity,
  });
}

export async function PUT(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const db = getDb();

  await db
    .insert(cognitiveStates)
    .values({
      userId,
      valence: body.valence ?? 0.6,
      arousal: body.arousal ?? 0.3,
      confidence: body.confidence ?? 0.5,
      energy: body.energy ?? 0.7,
      social: body.social ?? 0.4,
      curiosity: body.curiosity ?? 0.6,
    })
    .onConflictDoUpdate({
      target: cognitiveStates.userId,
      set: {
        valence: body.valence,
        arousal: body.arousal,
        confidence: body.confidence,
        energy: body.energy,
        social: body.social,
        curiosity: body.curiosity,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
