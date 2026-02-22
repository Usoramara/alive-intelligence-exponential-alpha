/**
 * Bidirectional cron job bridge between Wybe and OpenClaw.
 *
 * - Gateway-routed jobs are forwarded to OpenClaw's cron system
 * - Cognitive-context jobs (like state decay) remain local
 * - Heartbeat sync keeps job state in sync
 */

import { callOpenClaw } from './openclaw-rpc';

interface CronJob {
  id: string;
  expression: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

/**
 * Forward a job to OpenClaw's cron system.
 * Returns the created job or null on failure.
 */
export async function forwardJobToOpenClaw(
  expression: string,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<CronJob | null> {
  const result = await callOpenClaw<CronJob>('cron.add', {
    expression,
    action,
    metadata,
  });

  if (result.ok) return result.data;
  console.error('[cron-bridge] Failed to forward job:', result.error.message);
  return null;
}

/**
 * Sync job status from OpenClaw.
 */
export async function syncCronJobs(): Promise<CronJob[]> {
  const result = await callOpenClaw<{ jobs: CronJob[] }>('cron.list');
  if (result.ok && Array.isArray(result.data?.jobs)) {
    return result.data.jobs;
  }
  return [];
}

/**
 * Remove a job from OpenClaw's cron system.
 */
export async function removeOpenClawJob(jobId: string): Promise<boolean> {
  const result = await callOpenClaw('cron.remove', { id: jobId });
  return result.ok;
}
