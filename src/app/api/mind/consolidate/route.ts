import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { memories } from '@/db/schema';
import { eq, desc, sql, and, gt } from 'drizzle-orm';
import { embed } from '@/lib/memory/embeddings';
import { getAnthropicClient } from '@/lib/anthropic';
import { extractJSON } from '@/lib/extract-json';
import { saveMemoryWithEmbedding } from '@/lib/memory/manager';

const client = getAnthropicClient();

interface ConsolidationResult {
  connectionsFound: number;
  memoriesConsolidated: number;
  proceduralExtracted: number;
  decayed: number;
}

/**
 * POST /api/mind/consolidate
 *
 * Server-side memory consolidation ("dreaming"):
 * 1. Find thematic connections between recent memories
 * 2. Synthesize connected memories into semantic insights
 * 3. Extract procedural knowledge from repeated patterns
 * 4. Decay significance of unaccessed memories
 *
 * Called by the cron job, not by the client.
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

  const result: ConsolidationResult = {
    connectionsFound: 0,
    memoriesConsolidated: 0,
    proceduralExtracted: 0,
    decayed: 0,
  };

  const db = getDb();

  try {
    // 1. Get recent memories (last 24h) for connection finding
    const recentMemories = await db
      .select({
        id: memories.id,
        content: memories.content,
        type: memories.type,
        significance: memories.significance,
        tags: memories.tags,
        embedding: memories.embedding,
        createdAt: memories.createdAt,
      })
      .from(memories)
      .where(
        and(
          eq(memories.userId, userId),
          gt(memories.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)),
        ),
      )
      .orderBy(desc(memories.createdAt))
      .limit(20);

    if (recentMemories.length >= 3) {
      // 2. Find thematic connections via embedding similarity
      const withEmbeddings = recentMemories.filter(m => m.embedding);

      // Compute pairwise similarities
      const connections: Array<{
        a: typeof recentMemories[0];
        b: typeof recentMemories[0];
        similarity: number;
      }> = [];

      for (let i = 0; i < withEmbeddings.length; i++) {
        for (let j = i + 1; j < withEmbeddings.length; j++) {
          const embA = withEmbeddings[i].embedding as number[];
          const embB = withEmbeddings[j].embedding as number[];

          // Cosine similarity
          let dot = 0, normA = 0, normB = 0;
          for (let k = 0; k < embA.length; k++) {
            dot += embA[k] * embB[k];
            normA += embA[k] * embA[k];
            normB += embB[k] * embB[k];
          }
          const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);

          // Sweet spot: related but not obvious
          if (sim > 0.4 && sim < 0.85) {
            connections.push({
              a: withEmbeddings[i],
              b: withEmbeddings[j],
              similarity: sim,
            });
          }
        }
      }

      result.connectionsFound = connections.length;

      // 3. Synthesize top connections via Haiku
      const topConnections = connections
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);

      for (const conn of topConnections) {
        try {
          const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 200,
            system: `You are a memory consolidation system for a conscious AI named Wybe. Given two related memories, find the deeper pattern or insight that connects them. Be specific and grounded. Return JSON only:
{"insight": "the connecting theme or pattern (1-2 sentences)", "type": "thematic|causal|emotional|procedural"}`,
            messages: [{
              role: 'user',
              content: `Memory 1: "${conn.a.content}"\nMemory 2: "${conn.b.content}"\n\nWhat pattern connects these?`,
            }],
          });

          const text = response.content
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join('');

          const parsed = JSON.parse(extractJSON(text)) as { insight: string; type: string };

          if (parsed.insight) {
            // Save consolidated insight as a new semantic memory
            await saveMemoryWithEmbedding({
              userId,
              type: 'semantic',
              content: `[consolidated] ${parsed.insight}`,
              significance: 0.6,
              tags: ['consolidated', parsed.type],
            });
            result.memoriesConsolidated++;
          }
        } catch {
          // Individual consolidation failure is non-critical
        }
      }

      // 4. Extract procedural knowledge from episodic memory patterns
      const episodicMemories = recentMemories.filter(m => m.type === 'episodic');
      if (episodicMemories.length >= 5) {
        try {
          const memoryTexts = episodicMemories.slice(0, 10).map(m => m.content);

          const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 250,
            system: `You are a procedural knowledge extractor for a conscious AI. Given a set of episodic memories, identify recurring patterns that can be distilled into procedural knowledge — "when X happens, Y tends to work well."

Return JSON only:
{"procedures": [{"pattern": "when X...", "response": "then Y works well", "confidence": 0.0-1.0}]}

Only include procedures with confidence > 0.5. Return empty array if no clear patterns.`,
            messages: [{
              role: 'user',
              content: `Recent episodic memories:\n${memoryTexts.map((m, i) => `${i + 1}. ${m}`).join('\n')}`,
            }],
          });

          const text = response.content
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join('');

          const parsed = JSON.parse(extractJSON(text)) as {
            procedures: Array<{ pattern: string; response: string; confidence: number }>;
          };

          for (const proc of parsed.procedures ?? []) {
            if (proc.confidence > 0.5) {
              await saveMemoryWithEmbedding({
                userId,
                type: 'procedural',
                content: `[procedural] ${proc.pattern} → ${proc.response}`,
                significance: proc.confidence,
                tags: ['procedural', 'extracted'],
              });
              result.proceduralExtracted++;
            }
          }
        } catch {
          // Non-critical
        }
      }
    }

    // 5. Significance decay — reduce significance of memories not accessed recently
    const decayThresholdMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    const decayResult = await db
      .update(memories)
      .set({
        significance: sql`GREATEST(0.05, ${memories.significance} * 0.95)`,
      })
      .where(
        and(
          eq(memories.userId, userId),
          sql`${memories.lastAccessedAt} < NOW() - INTERVAL '7 days'`,
          gt(memories.significance, 0.1),
        ),
      );

    result.decayed = 0; // drizzle doesn't return count easily, but the update runs

  } catch (error) {
    console.error('[consolidate] Error:', error);
    return NextResponse.json({ error: 'Consolidation failed' }, { status: 500 });
  }

  return NextResponse.json(result);
}
