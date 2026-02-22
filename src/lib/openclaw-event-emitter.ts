/**
 * Bidirectional event emitter — pushes cognitive state and body feedback
 * TO the OpenClaw gateway via the bridge.
 *
 * Debounced to at most 1 event per second per event type to avoid flooding.
 */

import { getOpenClawBridge } from './openclaw-bridge';
import type { SelfState } from '@/core/types';

// ── Debounce tracking ──

const lastEmitTimes = new Map<string, number>();
const MIN_INTERVAL_MS = 1_000;

function shouldEmit(eventType: string): boolean {
  const now = Date.now();
  const last = lastEmitTimes.get(eventType) ?? 0;
  if (now - last < MIN_INTERVAL_MS) return false;
  lastEmitTimes.set(eventType, now);
  return true;
}

// ── Emit helpers ──

function emitEvent(event: string, payload: unknown): void {
  try {
    const bridge = getOpenClawBridge();
    const status = bridge.getStatus();
    if (!status.connected) return;

    bridge.call('events.emit', { event, payload }, 3_000).catch((err) => {
      console.debug(`[event-emitter] failed to emit ${event}:`, err instanceof Error ? err.message : err);
    });
  } catch {
    // Bridge not available
  }
}

// ── Public API ──

/** Notify OpenClaw of a cognitive state change */
export function emitCognitiveStateChange(userId: string, state: SelfState): void {
  if (!shouldEmit(`cognitive.${userId}`)) return;
  emitEvent('cognitive.state_changed', {
    userId,
    state,
    timestamp: Date.now(),
  });
}

/** Notify OpenClaw of an emotion detection result */
export function emitEmotionDetected(
  userId: string,
  emotions: { emotions: string[]; valence: number; arousal: number },
): void {
  if (!shouldEmit(`emotion.${userId}`)) return;
  emitEvent('cognitive.emotion_detected', {
    userId,
    emotions,
    timestamp: Date.now(),
  });
}

/** Notify OpenClaw of a tool execution result */
export function emitToolResult(
  userId: string,
  toolName: string,
  success: boolean,
): void {
  if (!shouldEmit(`tool.${userId}.${toolName}`)) return;
  emitEvent('cognitive.tool_result', {
    userId,
    toolName,
    success,
    timestamp: Date.now(),
  });
}

/** Notify OpenClaw of a body feedback event (expression, voice, etc.) */
export function emitBodyFeedback(
  userId: string,
  feedbackType: string,
  data: unknown,
): void {
  if (!shouldEmit(`body.${userId}.${feedbackType}`)) return;
  emitEvent('cognitive.body_feedback', {
    userId,
    feedbackType,
    data,
    timestamp: Date.now(),
  });
}

/** Notify OpenClaw of a memory write event */
export function emitMemoryWritten(
  userId: string,
  memoryType: string,
  significance: number,
): void {
  if (!shouldEmit(`memory.${userId}`)) return;
  emitEvent('cognitive.memory_written', {
    userId,
    memoryType,
    significance,
    timestamp: Date.now(),
  });
}
