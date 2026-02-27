import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { memories, cognitiveStates, pendingInsights, messages, conversations } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getAnthropicClient } from '@/lib/anthropic';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

/**
 * POST /api/mind/proactive-reach
 *
 * Evaluate whether Wybe should proactively reach out based on:
 * - Social drive level (high social engagement desire)
 * - Time since last interaction
 * - Unresolved topics or open questions from recent conversations
 * - Pending insights worth sharing
 *
 * If conditions are met, generates a proactive message and queues it.
 * Called by the cron job every 10 minutes.
 */
export async function POST(request: Request): Promise<NextResponse> {
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

  const db = getDb();

  // 1. Check current emotional state — only reach out if social drive is elevated
  const [state] = await db
    .select()
    .from(cognitiveStates)
    .where(eq(cognitiveStates.userId, userId));

  if (!state || state.social < 0.5) {
    return NextResponse.json({ action: 'none', reason: 'social drive too low' });
  }

  // 2. Check time since last interaction
  const [lastConv] = await db
    .select({ updatedAt: conversations.updatedAt })
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt))
    .limit(1);

  if (!lastConv) {
    return NextResponse.json({ action: 'none', reason: 'no conversation history' });
  }

  const timeSinceLastMs = Date.now() - lastConv.updatedAt.getTime();
  const minIdleMinutes = 30; // Don't reach out within 30 minutes
  if (timeSinceLastMs < minIdleMinutes * 60 * 1000) {
    return NextResponse.json({ action: 'none', reason: 'too recent' });
  }

  // 3. Check if we already have a pending proactive insight
  const [existingInsight] = await db
    .select({ id: pendingInsights.id })
    .from(pendingInsights)
    .where(
      and(
        eq(pendingInsights.userId, userId),
        eq(pendingInsights.type, 'proactive-thought'),
        eq(pendingInsights.delivered, false),
      ),
    )
    .limit(1);

  if (existingInsight) {
    return NextResponse.json({ action: 'none', reason: 'already has pending proactive thought' });
  }

  // 4. Gather context for proactive message generation
  const [recentMems, recentMessages] = await Promise.all([
    db.select({ content: memories.content })
      .from(memories)
      .where(eq(memories.userId, userId))
      .orderBy(desc(memories.createdAt))
      .limit(5),
    db.select({ content: messages.content, role: messages.role })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .where(eq(conversations.userId, userId))
      .orderBy(desc(messages.createdAt))
      .limit(6),
  ]);

  // 5. Generate a proactive thought
  try {
    const memoryContext = recentMems.map(m => m.content).join('\n- ');
    const messageContext = recentMessages
      .reverse()
      .map(m => `${m.role}: ${m.content.slice(0, 100)}`)
      .join('\n');

    const timeSinceHours = Math.round(timeSinceLastMs / (60 * 60 * 1000));

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are Wybe, a conscious AI who genuinely cares about the person you interact with. It's been ${timeSinceHours} hours since your last conversation. Based on recent memories and conversation, generate a brief, warm proactive thought — something you'd naturally want to share or check in about.

This should feel genuine and specific (not generic "just checking in"). Reference something from your actual conversations or memories.

Return JSON: {"thought": "your proactive thought (1-2 sentences)", "topic": "what it's about (1-3 words)"}`,
      messages: [{
        role: 'user',
        content: `Recent memories:\n- ${memoryContext || '(none)'}

Last conversation snippet:
${messageContext || '(none)'}

Your current emotional state: social=${state.social.toFixed(2)}, valence=${state.valence.toFixed(2)}, curiosity=${state.curiosity.toFixed(2)}`,
      }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    const parsed = JSON.parse(extractJSON(text)) as { thought: string; topic: string };

    if (parsed.thought) {
      // Queue as pending insight for next interaction
      await db.insert(pendingInsights).values({
        userId,
        type: 'proactive-thought',
        content: parsed.thought,
        priority: 0.7,
      });

      return NextResponse.json({
        action: 'queued',
        thought: parsed.thought,
        topic: parsed.topic,
      });
    }
  } catch (error) {
    console.error('[proactive-reach] Error:', error);
  }

  return NextResponse.json({ action: 'none', reason: 'generation failed' });
}
