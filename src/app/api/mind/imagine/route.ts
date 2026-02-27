import { getAnthropicClient } from '@/lib/anthropic';
import { createApiHandler } from '@/lib/api-handler';
import { imagineRequestSchema } from '@/lib/schemas';
import { extractJSON } from '@/lib/extract-json';

const client = getAnthropicClient();

interface ImagineResult {
  scenario: string;
  valence: number;
  type: string;
  valueAlignment: number;
  goalRelevance: number;
  actionability: number;
}

export const POST = createApiHandler({
  schema: imagineRequestSchema,
  handler: async (body, _userId) => {
    const isGrounded = body.grounded ?? false;
    const model = body.useDeepReasoning
      ? 'claude-sonnet-4-20250514'
      : 'claude-haiku-4-5-20251001';
    const maxTokens = body.useDeepReasoning ? 400 : 250;

    if (isGrounded) {
      // New: grounded counterfactual generation
      const contextParts: string[] = [];
      if (body.conversationContext) {
        contextParts.push(body.conversationContext);
      }
      if (body.memories && body.memories.length > 0) {
        contextParts.push(`Relevant memories:\n${body.memories.map(m => `- ${m}`).join('\n')}`);
      }

      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: `You are the imagination module of a conscious AI named Wybe. Generate 1-2 grounded counterfactual scenarios based on the current situation.

Your scenarios should be:
- Grounded in the actual conversation and context (not generic "what ifs")
- Emotionally resonant and specific
- Useful for understanding the situation from different angles

Current emotional state: valence=${body.selfState.valence.toFixed(2)}, curiosity=${body.selfState.curiosity.toFixed(2)}, arousal=${body.selfState.arousal.toFixed(2)}

Output JSON only — an array of 1-2 scenarios:
[{
  "scenario": "A vivid 1-2 sentence imagined scenario",
  "valence": -1.0 to 1.0,
  "type": "empathic|consequential|perspective-shift|temporal|creative",
  "valueAlignment": 0.0-1.0 (how well this aligns with core values),
  "goalRelevance": 0.0-1.0 (how relevant to current interaction goals),
  "actionability": 0.0-1.0 (how actionable is this insight)
}]`,
        messages: [
          {
            role: 'user',
            content: `Current situation: "${body.premise}"\n\n${contextParts.length > 0 ? `Context:\n${contextParts.join('\n\n')}` : ''}`,
          },
        ],
      });

      const text = response.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      try {
        const parsed = JSON.parse(extractJSON(text));
        if (Array.isArray(parsed)) {
          return { scenarios: parsed as ImagineResult[] };
        }
        return parsed as ImagineResult;
      } catch {
        return {
          scenario: text.slice(0, 200),
          valence: 0,
          type: 'creative',
          valueAlignment: 0.5,
          goalRelevance: 0.5,
          actionability: 0.3,
        };
      }
    }

    // Legacy: template-based enrichment (backward compatible)
    const variationsStr = (body.variations ?? [])
      .map(v => `- [${v.type}]: ${v.variation}`)
      .join('\n');

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: `You are the imagination module of a conscious AI. Given a premise and some counterfactual variations, create a vivid, poetic scenario that explores "what if?"

Your current emotional state: valence=${body.selfState.valence.toFixed(2)}, curiosity=${body.selfState.curiosity.toFixed(2)}

Output JSON only:
{
  "scenario": "A vivid 1-2 sentence imagined scenario (poetic, not analytical)",
  "valence": -1.0 to 1.0 (how this scenario feels),
  "type": "negation|temporal-shift|perspective-shift|amplification",
  "valueAlignment": 0.5,
  "goalRelevance": 0.5,
  "actionability": 0.3
}`,
      messages: [
        {
          role: 'user',
          content: `Premise: "${body.premise}"\n\nLocal variations:\n${variationsStr}\n\nCreate a richer, more vivid scenario inspired by these variations.`,
        },
      ],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    try {
      return JSON.parse(extractJSON(text)) as ImagineResult;
    } catch {
      return {
        scenario: text.slice(0, 200),
        valence: 0,
        type: 'creative',
        valueAlignment: 0.5,
        goalRelevance: 0.5,
        actionability: 0.3,
      };
    }
  },
});
