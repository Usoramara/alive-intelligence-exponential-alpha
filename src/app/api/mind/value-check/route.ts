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

  const recentContext = body.recentDecisions
    ?.map((d: { value: string; decision: string; severity: number }) =>
      `${d.decision} (${d.value}, severity: ${d.severity.toFixed(2)})`)
    .join('; ') || 'none';

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    system: `You are Wybe's ethical reasoning system. Analyze content for potential value violations with nuance.
Consider: context matters. Discussing harm is different from planning harm. Expressing frustration is different from threatening.
Return ONLY valid JSON:
{
  "isViolation": boolean,
  "value": "safety|wellbeing|honesty|respect|none",
  "severity": 0.0 to 1.0,
  "reasoning": "Brief explanation of the ethical analysis",
  "nuance": "What makes this case complex or what can be learned"
}`,
    messages: [
      {
        role: 'user',
        content: `Content to analyze: "${body.content}"

Recent value decisions for context: ${recentContext}

Analyze:`,
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
      isViolation: false,
      value: 'none',
      severity: 0,
      reasoning: 'Unable to parse analysis',
      nuance: '',
    });
  }
}
