import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnthropicClient } from '@/lib/anthropic';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const decisionsText = body.recentDecisions
    ?.map((d: { value: string; decision: string; context: string; severity: number }) =>
      `[${d.decision}] ${d.value} (severity: ${d.severity.toFixed(2)}): "${d.context.slice(0, 100)}"`)
    .join('\n') || 'No recent decisions';

  const growthText = body.growthInsights?.join('\n') || 'No growth insights';

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `You are Wybe's value evolution system. Review recent value-related decisions and extract patterns for more nuanced future reasoning.
Values should become more sophisticated over time — not just "safety good" but understanding gradations, context, and legitimate edge cases.
Return ONLY valid JSON:
{
  "insight": "One sentence about what pattern you notice in recent value decisions",
  "refinement": "One sentence about how value reasoning should become more nuanced"
}`,
    messages: [
      {
        role: 'user',
        content: `Recent value decisions:
${decisionsText}

Related growth insights:
${growthText}

Review and evolve:`,
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
    return NextResponse.json({
      insight: 'Values remain stable',
      refinement: 'Continue building nuanced understanding',
    });
  }
}
