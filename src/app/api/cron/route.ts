// Vercel Cron endpoint — runs every minute to check for due scheduled jobs
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "* * * * *" }] }

import { NextResponse } from 'next/server';
import { processDueJobs } from '@/lib/tools/schedule';

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

  try {
    const dueJobs = await processDueJobs();

    if (dueJobs.length === 0) {
      return NextResponse.json({ processed: 0 });
    }

    // Process each due job by sending a notification
    // In the future, this could trigger channel messages or other actions
    for (const job of dueJobs) {
      console.log(`[cron] Firing job ${job.id} for user ${job.userId}: ${job.description}`);
      // TODO: Send notification via channel, push notification, or email
    }

    return NextResponse.json({ processed: dueJobs.length, jobs: dueJobs.map(j => j.id) });
  } catch (error) {
    console.error('[cron] Error processing jobs:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled jobs' },
      { status: 500 },
    );
  }
}
