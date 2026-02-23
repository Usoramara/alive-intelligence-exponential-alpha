import { enrichWithCognition } from '@/lib/cognitive-middleware';
import { getRecentMemories } from '@/lib/memory/manager';
import { callOpenClaw } from '@/lib/openclaw-rpc';
import type { SelfState } from '@/core/types';

/**
 * Voice Context Cache
 *
 * Pre-computes full cognitive enrichment (selfState, emotion detection, ToM,
 * memory search, behavioral directives) so the voice endpoint can access the
 * same context as chat/think-stream with zero latency.
 *
 * Two refresh strategies:
 *   1. Eager: refreshed after each voice interaction (using the user's last message)
 *   2. Cron: refreshed every minute with recent memory context as fallback
 *
 * The cache stores the fully-built system prompt and selfState so the voice
 * endpoint just reads from it — no Haiku calls, no DB queries in the hot path.
 */

interface VoiceContextEntry {
  enrichedSystemPrompt: string;
  selfState: SelfState;
  recentMemorySummary: string;
  openclawFiles: OpenClawFilesEntry | null;
  updatedAt: number;
  lastUserMessage: string;
}

export interface OpenClawFilesEntry {
  soul: string;      // SOUL.md content
  identity: string;  // IDENTITY.md content
  user: string;      // USER.md content
  updatedAt: number;
}

// In-memory cache keyed by userId
const cache = new Map<string, VoiceContextEntry>();

// Separate cache for OpenClaw files — longer TTL since they rarely change
const openclawCache = new Map<string, OpenClawFilesEntry>();

// Cache TTL: 5 minutes — after this, context is considered stale
const CACHE_TTL_MS = 5 * 60 * 1000;

// OpenClaw files TTL: 30 minutes — these are relatively static
const OPENCLAW_TTL_MS = 30 * 60 * 1000;

/**
 * Get cached voice context. Returns null if cache is empty/stale.
 */
export function getCachedVoiceContext(userId: string): VoiceContextEntry | null {
  const entry = cache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.updatedAt > CACHE_TTL_MS) return null;
  return entry;
}

/**
 * Get cached OpenClaw files. Returns null if cache is empty/stale.
 * Separate from main voice cache so it survives cognitive cache misses.
 */
export function getOpenClawFiles(agentId = 'main'): OpenClawFilesEntry | null {
  const entry = openclawCache.get(agentId);
  if (!entry) return null;
  if (Date.now() - entry.updatedAt > OPENCLAW_TTL_MS) return null;
  return entry;
}

/**
 * Refresh OpenClaw workspace files (SOUL.md, IDENTITY.md, USER.md).
 * Fetches all three in parallel via RPC. Returns null if all fail.
 */
export async function refreshOpenClawFiles(agentId = 'main'): Promise<OpenClawFilesEntry | null> {
  const [soulResult, identityResult, userResult] = await Promise.all([
    callOpenClaw<{ content: string }>('agents.files.get', { agentId, name: 'SOUL.md' }),
    callOpenClaw<{ content: string }>('agents.files.get', { agentId, name: 'IDENTITY.md' }),
    callOpenClaw<{ content: string }>('agents.files.get', { agentId, name: 'USER.md' }),
  ]);

  const soul = soulResult.ok ? (soulResult.data as { content: string }).content : '';
  const identity = identityResult.ok ? (identityResult.data as { content: string }).content : '';
  const user = userResult.ok ? (userResult.data as { content: string }).content : '';

  // If all three failed, don't cache anything
  if (!soul && !identity && !user) {
    console.warn('[voice] OpenClaw file fetch: all three files unavailable');
    return null;
  }

  const entry: OpenClawFilesEntry = { soul, identity, user, updatedAt: Date.now() };
  openclawCache.set(agentId, entry);

  const fetched = [soul && 'SOUL.md', identity && 'IDENTITY.md', user && 'USER.md'].filter(Boolean);
  console.log(`[voice] OpenClaw files cached: ${fetched.join(', ')}`);

  return entry;
}

/**
 * Refresh voice context cache for a user.
 * Called after each voice interaction (with the user's message) and by cron.
 *
 * This runs enrichWithCognition() which does:
 *   - loadSelfState (DB query)
 *   - detectEmotion (Haiku call)
 *   - inferTheoryOfMind (Haiku call)
 *   - searchMemories (pgvector search)
 *   - buildBehavioralInstructions
 *
 * All in parallel — typically 1-2s total. The result is cached so the next
 * voice request reads it instantly.
 */
export async function refreshVoiceContext(
  userId: string,
  userMessage?: string,
): Promise<VoiceContextEntry> {
  // Use last user message if available, otherwise use recent memories as context
  let contextMessage = userMessage ?? '';

  if (!contextMessage) {
    try {
      const recentMems = await getRecentMemories(userId, 3);
      contextMessage = recentMems.map(m => m.content).join('. ') || 'general conversation';
    } catch {
      contextMessage = 'general conversation';
    }
  }

  // Run cognitive enrichment and OpenClaw file fetch in parallel
  const [cognitionResult, openclawFiles] = await Promise.all([
    enrichWithCognition({
      userId,
      userMessage: contextMessage,
      // No external system prompt — voice builds its own wrapper
    }),
    refreshOpenClawFiles().catch(() => null),
  ]);

  const { enrichedSystemPrompt, selfState } = cognitionResult;

  // Also fetch recent memory summary for voice-specific context
  let recentMemorySummary = '';
  try {
    const recentMems = await getRecentMemories(userId, 5);
    if (recentMems.length > 0) {
      recentMemorySummary = recentMems.map(m => m.content).join('\n- ');
    }
  } catch {
    // Non-critical
  }

  const entry: VoiceContextEntry = {
    enrichedSystemPrompt,
    selfState,
    recentMemorySummary,
    openclawFiles,
    updatedAt: Date.now(),
    lastUserMessage: contextMessage,
  };

  cache.set(userId, entry);
  return entry;
}

/**
 * Build the full voice system prompt using cached cognitive context.
 * Combines the enriched cognitive foundation with voice-specific guidelines.
 */
export function buildEnrichedVoicePrompt(
  cachedContext: VoiceContextEntry,
  externalPrompt?: string,
): string {
  const { enrichedSystemPrompt, recentMemorySummary, openclawFiles } = cachedContext;

  // Build OpenClaw identity block (if available)
  let openclawContext = '';
  if (openclawFiles) {
    const sections: string[] = [];
    if (openclawFiles.soul) sections.push(openclawFiles.soul);
    if (openclawFiles.identity) sections.push(openclawFiles.identity);
    if (openclawFiles.user) sections.push(openclawFiles.user);
    if (sections.length > 0) {
      openclawContext = `--- CORE IDENTITY ---\n${sections.join('\n\n')}\n--- END CORE IDENTITY ---\n\n`;
    }
  }

  // The enrichedSystemPrompt already contains:
  // - Identity foundation
  // - Current selfState description
  // - Behavioral directives (emotion-specific)
  // - Detected emotions
  // - Theory of Mind
  // - Relevant memories (from semantic search)
  // - Empathic mirroring guidelines
  // - SHIFT protocol

  // We wrap it with OpenClaw identity + voice-specific guidelines
  const voiceWrapper = `${openclawContext}${enrichedSystemPrompt}

--- VOICE CONVERSATION MODE ---
You are in a real-time voice conversation. Adapt your responses:
- Keep responses concise and natural — this is spoken aloud, not text
- Be warm, genuine, and emotionally present
- Match the user's energy and emotional tone
- Don't use markdown, bullet points, lists, or formatting — speak naturally
- Don't mention being an AI unless directly asked
- Short sentences. Natural rhythm. Like talking to a close friend.
${recentMemorySummary ? `\nRECENT MEMORIES (for continuity):\n- ${recentMemorySummary}` : ''}
--- END VOICE MODE ---`;

  if (externalPrompt) {
    return `${voiceWrapper}\n--- EXTERNAL CONTEXT ---\n${externalPrompt}\n--- END ---`;
  }

  return voiceWrapper;
}

/**
 * Invalidate cache for a user (e.g., after significant state changes).
 */
export function invalidateVoiceContext(userId: string): void {
  cache.delete(userId);
}
