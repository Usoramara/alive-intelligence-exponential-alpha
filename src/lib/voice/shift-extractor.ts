import { getAnthropicClient } from '@/lib/anthropic';
import { extractJSON } from '@/lib/extract-json';
import { updateCognitiveState } from '@/lib/cognitive/state-updater';
import { getDb } from '@/db';
import { cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { SelfState } from '@/core/types';

const DEFAULT_STATE: SelfState = {
  valence: 0.6, arousal: 0.3, confidence: 0.5,
  energy: 0.7, social: 0.4, curiosity: 0.6,
};

/**
 * Extract emotion shift from a voice exchange asynchronously.
 *
 * The voice prompt strips SHIFT instructions (to prevent Claude saying
 * "SHIFT: {...}" aloud). Instead, we extract emotion shifts post-hoc
 * by asking Haiku to analyze the exchange and return shift deltas.
 *
 * Then we apply the shift to the user's cognitive state, making voice
 * evolve the intelligence identically to chat.
 */
export async function extractVoiceShift(params: {
  userId: string;
  userMessage: string;
  assistantResponse: string;
}): Promise<Partial<SelfState> | null> {
  const { userId, userMessage, assistantResponse } = params;

  if (!userMessage.trim() || !assistantResponse.trim()) return null;

  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: `You analyze voice conversations and determine how they shift the AI's emotional state.
Given a user message and assistant response, return ONLY valid JSON with emotion shift deltas:
{"valence": 0.0, "arousal": 0.0, "confidence": 0.0, "energy": 0.0, "social": 0.0, "curiosity": 0.0}

Each value is a delta (change) ranging from -0.5 to 0.5:
- valence: mood shift (negative events → negative, joy → positive)
- arousal: alertness change (calm topics → negative, exciting → positive)
- confidence: certainty change (confusion → negative, clarity → positive)
- energy: energy change (draining topics → negative, energizing → positive)
- social: social engagement change (connection → positive, disconnection → negative)
- curiosity: interest change (boring → negative, fascinating → positive)

Only include dimensions that actually shifted. Omit unchanged dimensions.`,
    messages: [
      {
        role: 'user',
        content: `User said: "${userMessage}"\n\nAssistant responded: "${assistantResponse}"`,
      },
    ],
  });

  const responseText = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  let shift: Partial<SelfState>;
  try {
    shift = JSON.parse(extractJSON(responseText));
  } catch {
    console.warn('[voice-shift] Failed to parse Haiku response:', responseText);
    return null;
  }

  // Load current state and apply shift
  let currentState = DEFAULT_STATE;
  try {
    const db = getDb();
    const [state] = await db
      .select()
      .from(cognitiveStates)
      .where(eq(cognitiveStates.userId, userId));

    if (state) {
      currentState = {
        valence: state.valence,
        arousal: state.arousal,
        confidence: state.confidence,
        energy: state.energy,
        social: state.social,
        curiosity: state.curiosity,
      };
    }
  } catch {
    // Use default state
  }

  // Apply shift via existing cognitive state updater
  await updateCognitiveState(userId, currentState, shift);

  console.log('[voice-shift] Emotion shift applied:', shift);
  return shift;
}
