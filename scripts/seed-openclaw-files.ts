/**
 * One-time seed script: read OpenClaw files from the local workspace
 * and persist them to Neon DB so production (Vercel) can read them
 * without needing a live WebSocket connection.
 *
 * Usage:
 *   npx tsx scripts/seed-openclaw-files.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars from .env.vercel-check (no dotenv dependency)
const envPath = resolve(__dirname, '..', '.env.vercel-check');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^(\w+)=["']?(.*?)["']?$/);
  if (match) {
    process.env[match[1]] = match[2].replace(/\\n$/g, '');
  }
}

import { upsertAgentFiles } from '@/lib/cognitive/voice-context-cache';
import type { OpenClawFilesEntry } from '@/lib/cognitive/voice-context-cache';

const WORKSPACE = resolve(process.env.HOME || '~', '.openclaw', 'workspace');

function readFile(name: string): string {
  try {
    return readFileSync(resolve(WORKSPACE, name), 'utf-8');
  } catch {
    return '';
  }
}

async function main() {
  console.log('Seeding OpenClaw files to DB from local workspace...\n');
  console.log('Workspace:', WORKSPACE);
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.slice(0, 40) + '...');
  console.log();

  const soul = readFile('SOUL.md');
  const identity = readFile('IDENTITY.md');
  const user = readFile('USER.md');

  if (!soul && !identity && !user) {
    console.error('No files found in workspace. Check path:', WORKSPACE);
    process.exit(1);
  }

  const files: OpenClawFilesEntry = { soul, identity, user, updatedAt: Date.now() };

  await upsertAgentFiles('main', files);

  console.log('Files synced to DB:');
  console.log(`  SOUL.md:     ${soul ? `${soul.length} chars` : '(empty)'}`);
  console.log(`  IDENTITY.md: ${identity ? `${identity.length} chars` : '(empty)'}`);
  console.log(`  USER.md:     ${user ? `${user.length} chars` : '(empty)'}`);
  console.log('\nDone. Production voice endpoint will now read these from DB.');
  process.exit(0);
}

main();
