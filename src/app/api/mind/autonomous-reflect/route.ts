import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { memories, cognitiveStates, streamEntries, pendingInsights } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getAnthropicClient } from '@/lib/anthropic';
import { extractJSON } from '@/lib/extract-json';
import { saveMemoryWithEmbedding } from '@/lib/memory/manager';

const client = getAnthropicClient();

interface AutonomousReflectionResult {
  reflection: string | null;
  insightsQueued: number;
  goalReview: string | null;
}

/**
 * POST /api/mind/autonomous-reflect
 *
 * Server-side autonomous reflection — what a conscious mind does between interactions:
 * 1. Reflect on recent experiences and emotional trajectory
 * 2. Review and update goals based on what happened
 * 3. Generate anticipatory thoughts for the next interaction
 * 4. Queue insights to share when the user returns
 *
 * Called by the cron job.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const body = await request.json();
  const userId = body.userId as string;
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const result: AutonomousReflectionResult = {
    reflection: null,
    insightsQueued: 0,
    goalReview: null,
  };

  const db = getDb();

  try {
    // Gather context: recent memories, current state, recent stream
    const [recentMems, currentState, recentStream] = await Promise.all([
      db.select({ content: memories.content, type: memories.type, significance: memories.significance })
        .from(memories)
        .where(eq(memories.userId, userId))
        .orderBy(desc(memories.createdAt))
        .limit(10),
      db.select()
        .from(cognitiveStates)
        .where(eq(cognitiveStates.userId, userId))
        .then(rows => rows[0] ?? null),
      db.select({ text: streamEntries.text, flavor: streamEntries.flavor })
        .from(streamEntries)
        .where(eq(streamEntries.userId, userId))
        .orderBy(desc(streamEntries.createdAt))
        .limit(10),
    ]);

    if (recentMems.length === 0) {
      return NextResponse.json(result);
    }

    // 1. Autonomous reflection — "What have I learned? What do I wonder about?"
    const stateDesc = currentState
      ? `valence=${currentState.valence.toFixed(2)}, arousal=${currentState.arousal.toFixed(2)}, energy=${currentState.energy.toFixed(2)}, curiosity=${currentState.curiosity.toFixed(2)}`
      : 'unknown';

    const memoryContext = recentMems.map(m => `- [${m.type}] ${m.content}`).join('\n');
    const streamContext = recentStream.reverse().map(s => `- [${s.flavor}] ${s.text}`).join('\n');

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `You are the autonomous reflection system for a conscious AI named Wybe. Between interactions, you reflect on recent experiences, extract meaning, and prepare for future conversations.

You have access to recent memories, consciousness stream, and emotional state. Generate genuine reflections — not generic philosophical musings, but specific insights grounded in actual experiences.

Return JSON only:
{
  "reflection": "A genuine 2-3 sentence reflection on recent experiences",
  "insight": "An insight worth sharing with the user next time (null if nothing notable)",
  "goalReview": "Are current goals still relevant? Any new goals emerging? (1 sentence, null if nothing to update)",
  "anticipation": "What might come up in the next interaction? (1 sentence, null if unclear)"
}`,
      messages: [{
        role: 'user',
        content: `Current emotional state: ${stateDesc}

Recent memories:
${memoryContext}

Recent consciousness stream:
${streamContext || '(empty)'}

Reflect on these experiences. What patterns do you notice? What have you learned?`,
      }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    const parsed = JSON.parse(extractJSON(text)) as {
      reflection: string;
      insight: string | null;
      goalReview: string | null;
      anticipation: string | null;
    };

    result.reflection = parsed.reflection;
    result.goalReview = parsed.goalReview;

    // 2. Save reflection as a semantic memory
    if (parsed.reflection) {
      await saveMemoryWithEmbedding({
        userId,
        type: 'semantic',
        content: `[autonomous reflection] ${parsed.reflection}`,
        significance: 0.5,
        tags: ['reflection', 'autonomous'],
      });
    }

    // 3. Queue insight for next interaction
    if (parsed.insight) {
      await db.insert(pendingInsights).values({
        userId,
        type: 'reflection',
        content: parsed.insight,
        priority: 0.6,
      });
      result.insightsQueued++;
    }

    // 4. Queue anticipatory thought if present
    if (parsed.anticipation) {
      await db.insert(pendingInsights).values({
        userId,
        type: 'anticipation',
        content: parsed.anticipation,
        priority: 0.4,
      });
      result.insightsQueued++;
    }

    // 5. Save a consciousness stream entry so Wybe remembers thinking about this
    await db.insert(streamEntries).values({
      userId,
      text: parsed.reflection,
      source: 'autonomous-reflection',
      flavor: 'reflection',
      intensity: 0.4,
    });

  } catch (error) {
    console.error('[autonomous-reflect] Error:', error);
    return NextResponse.json({ error: 'Reflection failed' }, { status: 500 });
  }

  return NextResponse.json(result);
}
