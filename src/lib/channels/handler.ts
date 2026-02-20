/**
 * Server-side channel message handler.
 * Processes incoming channel messages through Wybe's cognitive pipeline
 * (think() with tools) and returns the response.
 *
 * Unlike the browser-based CognitiveLoop which runs at 60fps with
 * requestAnimationFrame, channel messages get a simpler single-pass
 * pipeline: think() → response. The full cognitive loop (35 engines,
 * inner thoughts, etc.) runs only in the browser.
 */

import { think, type ThinkParams } from '@/lib/claude';
import { getDb } from '@/db';
import { cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { IncomingMessage, OutgoingMessage, ChannelAdapter } from './adapter';

// Default self state for channel-only users
const DEFAULT_STATE = {
  valence: 0.6,
  arousal: 0.3,
  confidence: 0.5,
  energy: 0.7,
  social: 0.4,
  curiosity: 0.6,
};

// Per-user conversation history (in-memory, scoped to server lifetime)
const channelHistories = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

const MAX_HISTORY = 20;

/**
 * Process an incoming channel message through Wybe's think() pipeline.
 */
export async function handleChannelMessage(
  message: IncomingMessage,
  userId: string,
  adapter: ChannelAdapter,
): Promise<void> {
  // Get user's cognitive state
  let selfState = DEFAULT_STATE;
  try {
    const db = getDb();
    const [state] = await db
      .select()
      .from(cognitiveStates)
      .where(eq(cognitiveStates.userId, userId));
    if (state) {
      selfState = {
        valence: state.valence,
        arousal: state.arousal,
        confidence: state.confidence,
        energy: state.energy,
        social: state.social,
        curiosity: state.curiosity,
      };
    }
  } catch {
    // Database not available — use defaults
  }

  // Get or create conversation history for this channel user
  const historyKey = `${message.channelType}:${message.channelUserId}`;
  let history = channelHistories.get(historyKey) ?? [];

  // Add user message to history
  history.push({ role: 'user', content: message.text });
  if (history.length > MAX_HISTORY * 2) {
    history = history.slice(-MAX_HISTORY * 2);
  }
  channelHistories.set(historyKey, history);

  // Build think params
  const params: ThinkParams = {
    content: message.text,
    context: [`Channel: ${message.channelType}`],
    selfState,
    conversationHistory: history.slice(0, -1),
  };

  // Process through Wybe's cognitive pipeline
  const result = await think(params, undefined, userId);

  // Add assistant response to history
  history.push({ role: 'assistant', content: result.text });
  channelHistories.set(historyKey, history);

  // Update cognitive state if there was an emotion shift
  if (result.emotionShift) {
    try {
      const db = getDb();
      const newState = { ...selfState };
      for (const [key, value] of Object.entries(result.emotionShift)) {
        if (key in newState) {
          (newState as Record<string, number>)[key] = Math.max(-1, Math.min(1,
            (newState as Record<string, number>)[key] + (value as number)
          ));
        }
      }
      await db
        .insert(cognitiveStates)
        .values({ userId, ...newState })
        .onConflictDoUpdate({
          target: cognitiveStates.userId,
          set: { ...newState, updatedAt: new Date() },
        });
    } catch {
      // Non-critical — state update failure doesn't affect the response
    }
  }

  // Send response back through the channel
  const response: OutgoingMessage = {
    text: result.text,
    metadata: result.toolActivities ? { toolActivities: result.toolActivities } : undefined,
  };

  await adapter.sendMessage(message.channelUserId, response);
}
