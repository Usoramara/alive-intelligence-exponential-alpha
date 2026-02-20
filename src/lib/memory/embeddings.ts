import OpenAI from 'openai';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI();
  }
  return client;
}

const MODEL = 'text-embedding-3-small'; // 1536 dimensions, $0.02/1M tokens

export async function embed(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (texts.length === 1) return [await embed(texts[0])];

  // OpenAI supports up to 2048 inputs per batch
  const response = await getClient().embeddings.create({
    model: MODEL,
    input: texts,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map(d => d.embedding);
}
