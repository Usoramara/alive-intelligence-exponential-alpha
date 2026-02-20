import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUsageSummary } from '@/lib/tracked-anthropic';

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await getUsageSummary(userId);
    return NextResponse.json(summary);
  } catch {
    // Database not available yet — return placeholder
    return NextResponse.json({
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      costCents: 0,
      monthlyLimit: 500_000,
      remaining: 500_000,
      tier: 'free',
    });
  }
}
