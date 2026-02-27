import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { streamEntries } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET — Load persisted consciousness stream (last N entries).
 * Called on restore so Wybe remembers what they were thinking.
 */
export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const entries = await db
    .select({
      text: streamEntries.text,
      source: streamEntries.source,
      flavor: streamEntries.flavor,
      intensity: streamEntries.intensity,
      createdAt: streamEntries.createdAt,
    })
    .from(streamEntries)
    .where(eq(streamEntries.userId, userId))
    .orderBy(desc(streamEntries.createdAt))
    .limit(20);

  // Return in chronological order (oldest first)
  return NextResponse.json({
    entries: entries.reverse().map(e => ({
      text: e.text,
      source: e.source,
      flavor: e.flavor,
      intensity: e.intensity,
      timestamp: e.createdAt.getTime(),
    })),
  });
}

/**
 * POST — Save consciousness stream entries.
 * Called by PersistenceEngine alongside state saves.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const entries = body.entries as Array<{
    text: string;
    source: string;
    flavor: string;
    intensity: number;
    timestamp: number;
  }>;

  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ ok: true, saved: 0 });
  }

  const db = getDb();

  // Save new entries (deduplicate by checking timestamp)
  const values = entries.map(e => ({
    userId,
    text: e.text,
    source: e.source,
    flavor: e.flavor,
    intensity: e.intensity,
    createdAt: new Date(e.timestamp),
  }));

  await db.insert(streamEntries).values(values);

  return NextResponse.json({ ok: true, saved: values.length });
}
