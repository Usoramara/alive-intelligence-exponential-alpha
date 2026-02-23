/**
 * One-time seed script: fetch OpenClaw files from the local gateway
 * and persist them to Neon DB so production (Vercel) can read them
 * without needing a live WebSocket connection.
 *
 * Usage:
 *   npx tsx scripts/seed-openclaw-files.ts
 *
 * Requires:
 *   - DATABASE_URL in .env (or exported)
 *   - OPENCLAW_GATEWAY_URL + OPENCLAW_GATEWAY_TOKEN (local gateway running)
 */

import 'dotenv/config';
import { refreshOpenClawFiles, getOpenClawFiles } from '@/lib/cognitive/voice-context-cache';

async function main() {
  console.log('Seeding OpenClaw files to DB...\n');

  const result = await refreshOpenClawFiles('main');

  if (!result) {
    console.error('Failed — could not fetch files from gateway or DB.');
    console.error('Make sure the local OpenClaw gateway is running.');
    process.exit(1);
  }

  console.log('Files synced to DB:');
  console.log(`  SOUL.md:     ${result.soul ? `${result.soul.length} chars` : '(empty)'}`);
  console.log(`  IDENTITY.md: ${result.identity ? `${result.identity.length} chars` : '(empty)'}`);
  console.log(`  USER.md:     ${result.user ? `${result.user.length} chars` : '(empty)'}`);
  console.log('\nDone. Production voice endpoint will now read these from DB.');
}

main();
