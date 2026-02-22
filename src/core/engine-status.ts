/**
 * Server-side engine status provider.
 *
 * The CognitiveLoop runs client-side (browser). On the server we maintain
 * a lightweight registry that tracks engine activity reported via the
 * signal bus or OpenClaw bridge events. When no real data is available
 * we fall back to state-derived heuristics (same as before but clearly
 * marked as inferred).
 */

import type { SelfState } from './types';
import type { EngineId } from './constants';
import { ENGINE_IDS } from './constants';

// ── Types ──

export interface EngineStatusEntry {
  id: string;
  active: boolean;
  load: number; // 0-1
  lastActivity: number; // epoch ms, 0 = never
  source: 'real' | 'inferred';
}

export interface SignalActivityEntry {
  id: string;
  from: string;
  to: string;
  type: string;
  timestamp: number;
  active: boolean;
}

// ── Registry (server singleton) ──

const engineActivity = new Map<string, { lastSeen: number; load: number }>();
const recentSignals: SignalActivityEntry[] = [];
const MAX_SIGNALS = 50;

/** Record engine heartbeat — called from bridge event handlers */
export function recordEngineActivity(engineId: string, load: number): void {
  engineActivity.set(engineId, { lastSeen: Date.now(), load: Math.max(0, Math.min(1, load)) });
}

/** Record a signal passing between engines */
export function recordSignalActivity(from: string, to: string, type: string): void {
  recentSignals.push({
    id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    from,
    to,
    type,
    timestamp: Date.now(),
    active: true,
  });
  if (recentSignals.length > MAX_SIGNALS) {
    recentSignals.splice(0, recentSignals.length - MAX_SIGNALS);
  }
}

// ── Public API ──

const ACTIVITY_STALE_MS = 60_000; // 1 minute

/** All canonical engine IDs for the status display */
const DISPLAY_ENGINES: EngineId[] = [
  ENGINE_IDS.TEXT_INPUT,
  ENGINE_IDS.PERCEPTION,
  ENGINE_IDS.MEMORY,
  ENGINE_IDS.ATTENTION,
  ENGINE_IDS.BINDER,
  ENGINE_IDS.ARBITER,
  ENGINE_IDS.METACOGNITION,
  ENGINE_IDS.EMOTION_INFERENCE,
  ENGINE_IDS.IMAGINATION,
  ENGINE_IDS.DEFAULT_MODE,
  ENGINE_IDS.EXPRESSION,
  ENGINE_IDS.VOICE,
];

/**
 * Build engine status list. Uses real activity data when available,
 * falls back to state-derived heuristics.
 */
export function getEngineSnapshots(selfState: SelfState): EngineStatusEntry[] {
  const now = Date.now();

  return DISPLAY_ENGINES.map((id) => {
    const activity = engineActivity.get(id);
    if (activity && now - activity.lastSeen < ACTIVITY_STALE_MS) {
      return {
        id,
        active: true,
        load: activity.load,
        lastActivity: activity.lastSeen,
        source: 'real' as const,
      };
    }

    // Infer from cognitive state (same logic as before, but marked)
    const inferred = inferEngineStatus(id, selfState);
    return {
      id,
      active: inferred.active,
      load: inferred.load,
      lastActivity: activity?.lastSeen ?? 0,
      source: 'inferred' as const,
    };
  });
}

/** Return recent signal activity, pruning entries older than 30s */
export function getRecentSignalActivity(): SignalActivityEntry[] {
  const cutoff = Date.now() - 30_000;
  // Prune old entries
  while (recentSignals.length > 0 && recentSignals[0].timestamp < cutoff) {
    recentSignals.shift();
  }
  return [...recentSignals];
}

// ── Heuristic inference (fallback) ──

function inferEngineStatus(id: EngineId, s: SelfState): { active: boolean; load: number } {
  switch (id) {
    case 'text-input':
      return { active: true, load: 0.5 };
    case 'perception':
      return { active: true, load: s.arousal };
    case 'memory':
      return { active: s.curiosity > 0.4, load: s.curiosity };
    case 'attention':
      return { active: s.arousal > 0.3, load: s.arousal };
    case 'binder':
      return { active: true, load: 0.4 };
    case 'arbiter':
      return { active: s.confidence > 0.4, load: s.confidence };
    case 'metacognition':
      return { active: s.curiosity > 0.5, load: s.curiosity * 0.8 };
    case 'emotion-inference':
      return { active: Math.abs(s.valence) > 0.2, load: Math.abs(s.valence) };
    case 'imagination':
      return { active: s.curiosity > 0.6, load: s.curiosity * 0.6 };
    case 'default-mode':
      return { active: s.arousal < 0.3, load: 1 - s.arousal };
    case 'expression':
      return { active: s.social > 0.3, load: s.social };
    case 'voice':
      return { active: s.social > 0.4, load: s.social * 0.8 };
    default:
      return { active: false, load: 0 };
  }
}
