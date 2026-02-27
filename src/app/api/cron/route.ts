// Vercel Cron endpoint — runs every minute
// 1. Process due scheduled jobs
// 2. Refresh voice context cache (keeps voice latency low)
// 3. Process unprocessed voice turns
// 4. Memory consolidation (dreaming) — every 5 minutes
// 5. Autonomous reflection — every 10 minutes
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "* * * * *" }] }

import { NextResponse } from 'next/server';
import { processDueJobs } from '@/lib/tools/schedule';
import { refreshVoiceContext, refreshOpenClawFiles } from '@/lib/cognitive/voice-context-cache';
import { processUnprocessedVoiceTurns } from '@/lib/voice/enrichment-processor';

// Protect with a cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

// Track autonomous task intervals (in-memory — resets on cold start, which is fine)
let lastConsolidation = 0;
let lastReflection = 0;
const CONSOLIDATION_INTERVAL = 5 * 60 * 1000;   // 5 minutes
const REFLECTION_INTERVAL = 10 * 60 * 1000;      // 10 minutes

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret if configured
  if (CRON_SECRET) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: {
    jobs: number;
    voiceCache: boolean;
    openclawFiles: boolean;
    voiceEnrichment: { processed: number; memoriesCreated: number; researchQueries: number } | null;
    consolidation: unknown | null;
    reflection: unknown | null;
    proactiveReach: unknown | null;
  } = {
    jobs: 0, voiceCache: false, openclawFiles: false, voiceEnrichment: null,
    consolidation: null, reflection: null, proactiveReach: null,
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

    // 4. Memory consolidation (dreaming) — runs every 5 minutes
    const now = Date.now();
    if (now - lastConsolidation > CONSOLIDATION_INTERVAL) {
      lastConsolidation = now;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';

        const consolidateRes = await fetch(`${baseUrl}/api/mind/consolidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(CRON_SECRET ? { 'Authorization': `Bearer ${CRON_SECRET}` } : {}),
          },
          body: JSON.stringify({ userId: gatewayUserId }),
        });

        if (consolidateRes.ok) {
          results.consolidation = await consolidateRes.json();
          console.log('[cron] Memory consolidation:', results.consolidation);
        }
      } catch (err) {
        console.error('[cron] Memory consolidation failed:', err);
      }
    }

    // 5. Autonomous reflection — runs every 10 minutes
    if (now - lastReflection > REFLECTION_INTERVAL) {
      lastReflection = now;

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      const headers = {
        'Content-Type': 'application/json',
        ...(CRON_SECRET ? { 'Authorization': `Bearer ${CRON_SECRET}` } : {}),
      };

      // Run reflection and proactive reach in parallel
      const [reflectResult, proactiveResult] = await Promise.allSettled([
        fetch(`${baseUrl}/api/mind/autonomous-reflect`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId: gatewayUserId }),
        }).then(async r => r.ok ? r.json() : null),

        fetch(`${baseUrl}/api/mind/proactive-reach`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId: gatewayUserId }),
        }).then(async r => r.ok ? r.json() : null),
      ]);

      if (reflectResult.status === 'fulfilled' && reflectResult.value) {
        results.reflection = reflectResult.value;
        console.log('[cron] Autonomous reflection:', results.reflection);
      } else if (reflectResult.status === 'rejected') {
        console.error('[cron] Autonomous reflection failed:', reflectResult.reason);
      }

      if (proactiveResult.status === 'fulfilled' && proactiveResult.value) {
        results.proactiveReach = proactiveResult.value;
        console.log('[cron] Proactive reach:', results.proactiveReach);
      } else if (proactiveResult.status === 'rejected') {
        console.error('[cron] Proactive reach failed:', proactiveResult.reason);
      }
    }
  }

  return NextResponse.json(results);
}
