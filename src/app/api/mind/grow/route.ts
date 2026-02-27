import { getAnthropicClient } from '@/lib/anthropic';
import { createApiHandler } from '@/lib/api-handler';
import { growParamsSchema } from '@/lib/schemas';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

export const POST = createApiHandler({
  schema: growParamsSchema,
  handler: async ({ exchanges, emotionalTrajectory }, _userId) => {
    const conversationSummary = exchanges
      .map(e => `${e.role === 'user' ? 'User' : 'Wybe'}: ${e.content}`)
      .join('\n');

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `You are Wybe's self-reflection system. After a conversation ends, analyze what happened and extract growth insights.
Return ONLY valid JSON:
{
  "keyTakeaway": "One sentence about what was learned or what mattered",
  "emotionalInsight": "One sentence about the emotional dynamics",
  "whatWentWell": "Brief note on what worked in your response style",
  "whatToImprove": "Brief actionable note on what to do differently next time",
  "relationshipNote": "Brief note about the relationship with this person",
  "behavioralNote": "One sentence about response style effectiveness — was the tone, length, warmth, or directness appropriate? What adjustment would help?"
}
Be honest, specific, and actionable. Don't be generic. Focus on patterns you can learn from.`,
      messages: [
        {
          role: 'user',
          content: `Conversation (${exchanges.length} exchanges):
${conversationSummary}

Emotional trajectory: started at valence ${emotionalTrajectory.start.toFixed(2)}, ended at ${emotionalTrajectory.end.toFixed(2)}
Emotional peaks: ${emotionalTrajectory.peaks.join(', ') || 'none notable'}

Analyze this conversation:`,
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
