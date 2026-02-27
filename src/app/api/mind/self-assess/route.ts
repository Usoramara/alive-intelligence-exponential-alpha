import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnthropicClient } from '@/lib/anthropic';
import { getDb } from '@/db';
import { memories } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const db = getDb();

  // Fetch recent growth memories for self-assessment context
  const recentGrowthMemories = await db
    .select({ content: memories.content })
    .from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.createdAt))
    .limit(10);

  const growthInsights = recentGrowthMemories
    .filter(m => m.content.startsWith('[Growth]') || m.content.startsWith('[Insight]') || m.content.startsWith('[Improve]'))
    .map(m => m.content);

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `You are Wybe's self-assessment system. Periodically review accumulated growth insights and produce a honest self-evaluation.

Return ONLY valid JSON:
{
  "strengths": ["strength 1", "strength 2"],
  "growthAreas": ["area 1", "area 2"],
  "keyInsight": "One sentence about the most important learning",
  "relationshipProgress": "One sentence about how the relationship is developing"
}

Be specific and honest. Reference actual patterns, not generic observations.`,
    messages: [
      {
        role: 'user',
        content: `Self-assessment after ${body.conversationCount} recent conversations.

Current self-state:
- Valence: ${body.selfState?.valence?.toFixed(2) ?? 'unknown'}
- Confidence: ${body.selfState?.confidence?.toFixed(2) ?? 'unknown'}
- Energy: ${body.selfState?.energy?.toFixed(2) ?? 'unknown'}
- Social: ${body.selfState?.social?.toFixed(2) ?? 'unknown'}

Learned behavioral preferences:
- Preferred response length: ${body.currentPreferences?.preferredLength?.toFixed(2) ?? 'unknown'}
- Emotional mirroring: ${body.currentPreferences?.mirroringIntensity?.toFixed(2) ?? 'unknown'}
- Humor frequency: ${body.currentPreferences?.humorFrequency?.toFixed(2) ?? 'unknown'}
- Warmth level: ${body.currentPreferences?.warmthLevel?.toFixed(2) ?? 'unknown'}
- Directness: ${body.currentPreferences?.directness?.toFixed(2) ?? 'unknown'}
- Samples: ${body.currentPreferences?.sampleCount ?? 0}

Recent growth insights:
${growthInsights.length > 0 ? growthInsights.join('\n') : 'None yet'}

Analyze and produce self-assessment:`,
      },
    ],
  });

  const responseText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  try {
    return NextResponse.json(JSON.parse(extractJSON(responseText)));
  } catch {
    return NextResponse.json(
      { strengths: [], growthAreas: [], keyInsight: 'Assessment pending', relationshipProgress: 'Building' },
    );
  }
}
