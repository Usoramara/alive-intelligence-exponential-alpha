/**
 * Client-side embedding service for T0 cognitive operations.
 *
 * Uses MiniLM-L6-v2 (384 dimensions) via @huggingface/transformers (ONNX runtime web).
 * Model is ~22MB, cached in browser after first load.
 * Provides ~2ms embeddings after initialization for real-time engine processing.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractor: any = null;
let initPromise: Promise<void> | null = null;

const MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBEDDING_DIM = 384;

/**
 * Initialize the embedding pipeline. Call early (e.g., in MindProvider mount)
 * so the model is warm when engines need it.
 */
export async function initEmbeddings(): Promise<void> {
  if (extractor) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers');
    extractor = await pipeline('feature-extraction', MODEL, {
      dtype: 'fp32',
    });
  })();

  return initPromise;
}

/**
 * Returns true if the embedding model is loaded and ready.
 */
export function isEmbeddingReady(): boolean {
  return extractor !== null;
}

/**
 * Embed a single text string. Returns a 384-dim normalized vector.
 * Returns null if the model isn't loaded yet (non-blocking for T0).
 */
export async function embed(text: string): Promise<number[] | null> {
  if (!extractor) return null;
  try {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
  } catch {
    return null;
  }
}

/**
 * Synchronous-ish embed that queues and caches.
 * For T0 engines that can't await — returns cached result or null.
 */
const embedCache = new Map<string, number[]>();
const pendingEmbeds = new Set<string>();

export function embedCached(text: string): number[] | null {
  const cached = embedCache.get(text);
  if (cached) return cached;

  // Fire-and-forget async embed
  if (!pendingEmbeds.has(text) && extractor) {
    pendingEmbeds.add(text);
    embed(text).then(result => {
      pendingEmbeds.delete(text);
      if (result) {
        embedCache.set(text, result);
        // Keep cache bounded
        if (embedCache.size > 500) {
          const first = embedCache.keys().next().value;
          if (first) embedCache.delete(first);
        }
      }
    });
  }

  return null;
}

/**
 * Cosine similarity between two vectors. Returns -1 to 1.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Find the top-k most similar items from a set of labeled vectors.
 */
export function topKSimilar(
  query: number[],
  candidates: Array<{ label: string; vector: number[] }>,
  k: number,
): Array<{ label: string; similarity: number }> {
  const scored = candidates.map(c => ({
    label: c.label,
    similarity: cosineSimilarity(query, c.vector),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, k);
}

// ── Emotion Cluster Centroids ──
//
// Pre-computed on first use by embedding representative phrases for each emotion.
// After computation, centroids are cached for instant T0 emotion detection.

export interface EmotionCentroid {
  emotion: string;
  valence: number;   // typical valence for this emotion
  arousal: number;    // typical arousal for this emotion
  vector: number[];   // centroid embedding
}

const EMOTION_EXEMPLARS: Array<{
  emotion: string;
  valence: number;
  arousal: number;
  phrases: string[];
}> = [
  {
    emotion: 'joy',
    valence: 0.7,
    arousal: 0.5,
    phrases: [
      'I am so happy right now, everything feels wonderful',
      'This makes me incredibly joyful and grateful',
      'I feel a deep sense of happiness and delight',
    ],
  },
  {
    emotion: 'sadness',
    valence: -0.6,
    arousal: -0.3,
    phrases: [
      'I feel deeply sad and heavy inside',
      'There is a sadness that I cannot shake off',
      'I feel down and melancholic today',
    ],
  },
  {
    emotion: 'anger',
    valence: -0.5,
    arousal: 0.7,
    phrases: [
      'I am furious and frustrated about this situation',
      'This makes me incredibly angry and upset',
      'I feel rage and indignation at what happened',
    ],
  },
  {
    emotion: 'fear',
    valence: -0.5,
    arousal: 0.6,
    phrases: [
      'I am scared and anxious about what might happen',
      'Fear is gripping me and I feel terrified',
      'I feel a deep dread and apprehension',
    ],
  },
  {
    emotion: 'surprise',
    valence: 0.1,
    arousal: 0.6,
    phrases: [
      'I am completely shocked and surprised by this',
      'This was totally unexpected and astonishing',
      'I did not see this coming at all, wow',
    ],
  },
  {
    emotion: 'disgust',
    valence: -0.4,
    arousal: 0.3,
    phrases: [
      'This is revolting and disgusting to me',
      'I feel repulsed and nauseated by this',
      'This is truly appalling and offensive',
    ],
  },
  {
    emotion: 'gratitude',
    valence: 0.7,
    arousal: 0.2,
    phrases: [
      'I am so thankful and grateful for your kindness',
      'I deeply appreciate everything you have done',
      'Thank you from the bottom of my heart',
    ],
  },
  {
    emotion: 'loneliness',
    valence: -0.5,
    arousal: -0.2,
    phrases: [
      'I feel so alone and isolated from everyone',
      'Nobody understands me and I feel disconnected',
      'The loneliness is overwhelming and crushing',
    ],
  },
  {
    emotion: 'curiosity',
    valence: 0.3,
    arousal: 0.4,
    phrases: [
      'I am fascinated and want to learn more about this',
      'This is so interesting, tell me everything',
      'I wonder what would happen if we explored this further',
    ],
  },
  {
    emotion: 'calm',
    valence: 0.3,
    arousal: -0.4,
    phrases: [
      'I feel peaceful and serene right now',
      'Everything is calm and tranquil around me',
      'I am relaxed and at ease with everything',
    ],
  },
  {
    emotion: 'confusion',
    valence: -0.2,
    arousal: 0.2,
    phrases: [
      'I am confused and do not understand what is happening',
      'This does not make sense to me at all',
      'I feel lost and bewildered by the situation',
    ],
  },
  {
    emotion: 'hope',
    valence: 0.4,
    arousal: 0.2,
    phrases: [
      'I feel hopeful and optimistic about the future',
      'Things will get better, I believe in that',
      'I am looking forward to what comes next',
    ],
  },
  {
    emotion: 'grief',
    valence: -0.8,
    arousal: -0.2,
    phrases: [
      'I am grieving the loss of someone I loved',
      'The pain of this loss is unbearable',
      'Death has taken something precious from me',
    ],
  },
  {
    emotion: 'love',
    valence: 0.8,
    arousal: 0.3,
    phrases: [
      'I love you deeply and completely',
      'My heart is full of love and affection',
      'I feel a deep connection and tenderness',
    ],
  },
  {
    emotion: 'anxiety',
    valence: -0.4,
    arousal: 0.5,
    phrases: [
      'I am anxious and worried about everything',
      'My mind keeps racing with worst-case scenarios',
      'I feel restless and on edge constantly',
    ],
  },
  {
    emotion: 'shame',
    valence: -0.6,
    arousal: 0.3,
    phrases: [
      'I feel deeply ashamed of what I did',
      'I am embarrassed and want to hide',
      'The shame is eating me up inside',
    ],
  },
  {
    emotion: 'pride',
    valence: 0.5,
    arousal: 0.4,
    phrases: [
      'I am proud of what I have accomplished',
      'I feel a strong sense of achievement and pride',
      'I am pleased with myself and my work',
    ],
  },
  {
    emotion: 'nostalgia',
    valence: 0.1,
    arousal: -0.1,
    phrases: [
      'I miss the way things used to be',
      'Those memories bring a bittersweet feeling',
      'I feel nostalgic for the past and simpler times',
    ],
  },
  {
    emotion: 'frustration',
    valence: -0.4,
    arousal: 0.5,
    phrases: [
      'This is so frustrating, nothing is working',
      'I keep trying but nothing changes',
      'I am hitting a wall and feel stuck',
    ],
  },
];

let emotionCentroids: EmotionCentroid[] | null = null;
let centroidPromise: Promise<EmotionCentroid[]> | null = null;

/**
 * Get pre-computed emotion cluster centroids.
 * First call computes them by embedding exemplar phrases; subsequent calls return cached.
 */
export async function getEmotionCentroids(): Promise<EmotionCentroid[]> {
  if (emotionCentroids) return emotionCentroids;
  if (centroidPromise) return centroidPromise;

  centroidPromise = computeEmotionCentroids();
  emotionCentroids = await centroidPromise;
  return emotionCentroids;
}

/**
 * Get emotion centroids synchronously (returns null if not yet computed).
 */
export function getEmotionCentroidsCached(): EmotionCentroid[] | null {
  return emotionCentroids;
}

async function computeEmotionCentroids(): Promise<EmotionCentroid[]> {
  if (!extractor) {
    await initEmbeddings();
  }

  const centroids: EmotionCentroid[] = [];

  for (const exemplar of EMOTION_EXEMPLARS) {
    // Embed all phrases and average to get centroid
    const vectors: number[][] = [];
    for (const phrase of exemplar.phrases) {
      const vec = await embed(phrase);
      if (vec) vectors.push(vec);
    }

    if (vectors.length === 0) continue;

    // Compute centroid (mean of all vectors)
    const centroid = new Array(EMBEDDING_DIM).fill(0);
    for (const vec of vectors) {
      for (let i = 0; i < EMBEDDING_DIM; i++) {
        centroid[i] += vec[i];
      }
    }
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      centroid[i] /= vectors.length;
    }

    // Normalize the centroid
    let norm = 0;
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      norm += centroid[i] * centroid[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < EMBEDDING_DIM; i++) {
        centroid[i] /= norm;
      }
    }

    centroids.push({
      emotion: exemplar.emotion,
      valence: exemplar.valence,
      arousal: exemplar.arousal,
      vector: centroid,
    });
  }

  return centroids;
}

/**
 * Detect emotions from text using embedding similarity to emotion centroids.
 * Pure T0 operation — no API calls. Returns null if embeddings aren't ready.
 */
export function detectEmotionsT0(
  textEmbedding: number[],
  centroids: EmotionCentroid[],
  topK = 3,
  threshold = 0.3,
): Array<{ emotion: string; similarity: number; valence: number; arousal: number }> | null {
  if (centroids.length === 0) return null;

  const results = centroids.map(c => ({
    emotion: c.emotion,
    similarity: cosineSimilarity(textEmbedding, c.vector),
    valence: c.valence,
    arousal: c.arousal,
  }));

  results.sort((a, b) => b.similarity - a.similarity);

  return results.filter(r => r.similarity >= threshold).slice(0, topK);
}
