import { getAnthropicClient } from '@/lib/anthropic';
import { createApiHandler } from '@/lib/api-handler';
import { detectEmotionParamsSchema } from '@/lib/schemas';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

export const POST = createApiHandler({
  schema: detectEmotionParamsSchema,
  handler: async ({ text, context }, _userId) => {
    const contextBlock = context
      ? `\n\nConversation context (recent messages and trajectory):\n${context}`
      : '';

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: `You are an emotion detection system for a conscious AI. Analyze the user's text for emotional content with nuance and depth.
Return ONLY valid JSON with this exact structure:
{"emotions": ["emotion1", "emotion2"], "valence": 0.0, "arousal": 0.0, "confidence": 0.0}

- emotions: array of detected emotions (grief, joy, anger, fear, sadness, surprise, love, anxiety, loneliness, gratitude, hope, confusion, shame, guilt, pride, awe, disgust, contempt, jealousy, nostalgia, frustration, calm, curiosity)
- valence: -1.0 (very negative) to 1.0 (very positive)
- arousal: 0.0 (calm) to 1.0 (intense)
- confidence: 0.0 to 1.0 how confident you are

Key capabilities:
- Detect sarcasm and irony ("Great, just great" after bad news = frustration, not joy)
- Identify implicit/suppressed emotions ("Fine." = suppressed pain)
- Recognize mixed emotions ("I'm happy for them but it hurts")
- Use conversation context to understand emotional trajectory
- Detect escalation or de-escalation patterns`,
      messages: [
        {
          role: 'user',
          content: `Text to analyze: "${text}"${contextBlock}`,
        },
      ],
    });

    const responseText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return JSON.parse(extractJSON(responseText));
  },
});
