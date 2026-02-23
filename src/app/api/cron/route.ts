// Vercel Cron endpoint — runs every minute
// 1. Process due scheduled jobs
// 2. Refresh voice context cache (keeps voice latency low)
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "* * * * *" }] }

import { NextResponse } from 'next/server';
import { processDueJobs } from '@/lib/tools/schedule';
import { refreshVoiceContext, refreshOpenClawFiles } from '@/lib/cognitive/voice-context-cache';
import { processUnprocessedVoiceTurns } from '@/lib/voice/enrichment-processor';

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

  const results: { jobs: number; voiceCache: boolean; openclawFiles: boolean; voiceEnrichment: { processed: number; memoriesCreated: number; researchQueries: number } | null } = {
    jobs: 0, voiceCache: false, openclawFiles: false, voiceEnrichment: null,
  };

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

  // 2. Refresh voice context cache and OpenClaw files for the gateway user
  // Voice context: enrichWithCognition (emotion detection, ToM, memory search)
  // OpenClaw files: SOUL.md, IDENTITY.md, USER.md (personality/identity/user context)
  // Both run in parallel so they're warm before the next voice call.
  const gatewayUserId = process.env.WYBE_GATEWAY_USER_ID;
  if (gatewayUserId) {
    const [voiceResult, openclawResult] = await Promise.allSettled([
      refreshVoiceContext(gatewayUserId),
      refreshOpenClawFiles(),
    ]);

    if (voiceResult.status === 'fulfilled') {
      results.voiceCache = true;
      console.log('[cron] Voice context cache refreshed');
    } else {
      console.error('[cron] Voice context refresh failed:', voiceResult.reason);
    }

    if (openclawResult.status === 'fulfilled' && openclawResult.value !== null) {
      results.openclawFiles = true;
      console.log('[cron] OpenClaw files refreshed');
    } else if (openclawResult.status === 'rejected') {
      console.error('[cron] OpenClaw files refresh failed:', openclawResult.reason);
    }

    // 3. Process unprocessed voice turns (topic extraction, research, memory creation)
    try {
      const enrichResult = await processUnprocessedVoiceTurns(gatewayUserId);
      if (enrichResult.processed > 0) {
        results.voiceEnrichment = enrichResult;
        console.log(`[cron] Voice enrichment: ${enrichResult.processed} messages, ${enrichResult.memoriesCreated} memories`);
      }
    } catch (err) {
      console.error('[cron] Voice enrichment failed:', err);
    }
  }

  return NextResponse.json(results);
}
