import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { pendingInsights } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * GET — Fetch undelivered insights queued by autonomous processing.
 * Called when the user returns so Wybe can say "I was thinking about..."
 */
export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const insights = await db
    .select({
      id: pendingInsights.id,
      type: pendingInsights.type,
      content: pendingInsights.content,
      priority: pendingInsights.priority,
      createdAt: pendingInsights.createdAt,
    })
    .from(pendingInsights)
    .where(
      and(
        eq(pendingInsights.userId, userId),
        eq(pendingInsights.delivered, false),
      ),
    )
    .orderBy(desc(pendingInsights.priority))
    .limit(5);

  // Mark as delivered
  if (insights.length > 0) {
    const ids = insights.map(i => i.id);
    for (const id of ids) {
      await db
        .update(pendingInsights)
        .set({ delivered: true })
        .where(eq(pendingInsights.id, id));
    }
  }

  return NextResponse.json({ insights });
}
