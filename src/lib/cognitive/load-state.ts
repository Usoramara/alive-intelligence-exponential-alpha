import { getDb } from '@/db';
import { cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { SelfState } from '@/core/types';

const DEFAULT_STATE: SelfState = {
  valence: 0.6, arousal: 0.3, confidence: 0.5,
  energy: 0.7, social: 0.4, curiosity: 0.6,
};

/**
 * Load the current cognitive self-state from the DB.
 * Falls back to defaults if the DB is unavailable.
 */
export async function loadSelfState(userId: string): Promise<SelfState> {
  try {
    const db = getDb();
    const [state] = await db
      .select()
      .from(cognitiveStates)
      .where(eq(cognitiveStates.userId, userId));

    if (state) {
      return {
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
  return { ...DEFAULT_STATE };
}
