import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { behavioralPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const [prefs] = await db
    .select()
    .from(behavioralPreferences)
    .where(eq(behavioralPreferences.userId, userId));

  if (!prefs) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    preferredLength: prefs.preferredLength,
    mirroringIntensity: prefs.mirroringIntensity,
    humorFrequency: prefs.humorFrequency,
    warmthLevel: prefs.warmthLevel,
    directness: prefs.directness,
    sampleCount: prefs.sampleCount,
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const db = getDb();

  await db
    .insert(behavioralPreferences)
    .values({
      userId,
      preferredLength: body.preferredLength ?? 0.5,
      mirroringIntensity: body.mirroringIntensity ?? 0.5,
      humorFrequency: body.humorFrequency ?? 0.3,
      warmthLevel: body.warmthLevel ?? 0.5,
      directness: body.directness ?? 0.5,
      sampleCount: body.sampleCount ?? 0,
    })
    .onConflictDoUpdate({
      target: behavioralPreferences.userId,
      set: {
        preferredLength: body.preferredLength,
        mirroringIntensity: body.mirroringIntensity,
        humorFrequency: body.humorFrequency,
        warmthLevel: body.warmthLevel,
        directness: body.directness,
        sampleCount: body.sampleCount,
        lastUpdatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
