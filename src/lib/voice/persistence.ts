import { getDb } from '@/db';
import { messages } from '@/db/schema';
import { getOrCreateVoiceSession, touchSession } from './session-tracker';
import { extractVoiceShift } from './shift-extractor';

/**
 * Persist a voice turn (user message + assistant response) to the database.
 *
 * Fire-and-forget — called after the voice stream completes so it never
 * blocks voice latency. Each sub-operation is independently try/catch wrapped.
 */
export async function persistVoiceTurn(params: {
  userId: string;
  userMessage: string;
  assistantResponse: string;
}): Promise<void> {
  const { userId, userMessage, assistantResponse } = params;

  if (!userMessage.trim() && !assistantResponse.trim()) return;

  let conversationId: string;

  // 1. Get or create voice session
  try {
    conversationId = await getOrCreateVoiceSession(userId);
  } catch (err) {
    console.error('[voice-persist] Failed to get/create session:', err);
    return; // Can't persist without a conversation
  }

  // 2. Insert user message
  try {
    const db = getDb();
    if (userMessage.trim()) {
      await db.insert(messages).values({
        conversationId,
        role: 'user',
        content: userMessage,
        enriched: false,
      });
    }
  } catch (err) {
    console.error('[voice-persist] Failed to insert user message:', err);
  }

  // 3. Insert assistant message
  try {
    const db = getDb();
    if (assistantResponse.trim()) {
      await db.insert(messages).values({
        conversationId,
        role: 'assistant',
        content: assistantResponse,
        enriched: false,
      });
    }
  } catch (err) {
    console.error('[voice-persist] Failed to insert assistant message:', err);
  }

  // 4. Touch session activity
  try {
    await touchSession(userId, conversationId);
  } catch {
    // Non-critical
  }

  // 5. SHIFT extraction (awaited so it completes within after() lifecycle)
  try {
    const shift = await extractVoiceShift({ userId, userMessage, assistantResponse });
    if (shift) {
      console.log(`[voice-persist] SHIFT applied:`, shift);
    }
  } catch (err) {
    console.error('[voice-persist] SHIFT extraction failed:', err);
  }

  console.log(`[voice-persist] Turn saved to conversation ${conversationId}`);
}
