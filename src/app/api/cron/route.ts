// Vercel Cron endpoint — runs every minute
// 1. Process due scheduled jobs
// 2. Refresh voice context cache (keeps voice latency low)
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "* * * * *" }] }

import { NextResponse } from 'next/server';
import { processDueJobs } from '@/lib/tools/schedule';
import { refreshVoiceContext } from '@/lib/cognitive/voice-context-cache';

// Protect with a cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret if configured
  if (CRON_SECRET) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: { jobs: number; voiceCache: boolean } = { jobs: 0, voiceCache: false };

  // 1. Process scheduled jobs
  try {
    const dueJobs = await processDueJobs();

    for (const job of dueJobs) {
      console.log(`[cron] Firing job ${job.id} for user ${job.userId}: ${job.description}`);
    }

    results.jobs = dueJobs.length;
  } catch (error) {
    console.error('[cron] Error processing jobs:', error);
  }

  // 2. Refresh voice context cache for the gateway user
  // This runs enrichWithCognition (emotion detection, ToM, memory search) in the
  // background so the next voice request reads from cache instead of waiting.
  const gatewayUserId = process.env.WYBE_GATEWAY_USER_ID;
  if (gatewayUserId) {
    try {
      await refreshVoiceContext(gatewayUserId);
      results.voiceCache = true;
      console.log('[cron] Voice context cache refreshed');
    } catch (error) {
      console.error('[cron] Voice context refresh failed:', error);
    }
  }

  return NextResponse.json(results);
}
