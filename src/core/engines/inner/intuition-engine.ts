import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface RollingStats {
  values: number[];
  mean: number;
  stdDev: number;
  maxSamples: number;
}

function createRollingStats(maxSamples = 30): RollingStats {
  return { values: [], mean: 0, stdDev: 0, maxSamples };
}

function pushStat(stats: RollingStats, value: number): void {
  stats.values.push(value);
  if (stats.values.length > stats.maxSamples) stats.values.shift();

  const n = stats.values.length;
  if (n < 2) {
    stats.mean = value;
    stats.stdDev = 0;
    return;
  }

  const sum = stats.values.reduce((a, b) => a + b, 0);
  stats.mean = sum / n;
  const variance = stats.values.reduce((a, v) => a + (v - stats.mean) ** 2, 0) / (n - 1);
  stats.stdDev = Math.sqrt(variance);
}

function zScore(stats: RollingStats, value: number): number {
  if (stats.stdDev < 0.001 || stats.values.length < 5) return 0;
  return (value - stats.mean) / stats.stdDev;
}

// Semantic intent categories for embedding-based detection
const INTENT_ANCHORS = {
  contradiction: [
    'I say I am fine but I actually feel terrible',
    'Everything is good but something feels wrong',
    'I am happy although I want to cry',
  ],
  absoluteThinking: [
    'Everything always goes wrong for me no matter what',
    'Nobody ever listens or cares about me',
    'I will never be good enough for anything',
  ],
  urgentNeed: [
    'I desperately need help with this right now',
    'Please I am struggling and need support urgently',
    'I cannot handle this alone anymore',
  ],
  hesitation: [
    'I am not sure how to say this but well...',
    'There is something I want to tell you... I just...',
    'Maybe this is silly but I keep thinking about...',
  ],
};

export class IntuitionEngine extends Engine {
  // Statistical tracking
  private messageLengths = createRollingStats(30);
  private emotionalValences = createRollingStats(30);
  private interMessageGaps = createRollingStats(20);
  private lastMessageTime = 0;

  // Embedding-based communication style tracking
  private styleEmbeddings: Array<{ embedding: number[]; timestamp: number }> = [];
  private styleShiftStats = createRollingStats(15);

  // Pre-computed intent centroids
  private intentCentroids: Array<{ name: string; alert: string; centroid: number[] }> = [];
  private centroidsComputed = false;

  private recentContents: string[] = [];

  constructor() {
    super(ENGINE_IDS.INTUITION);
    this.computeIntentCentroids();
  }

  /**
   * Pre-compute embedding centroids for semantic intent detection.
   * Replaces regex-based anomaly patterns with embedding similarity.
   */
  private async computeIntentCentroids(): Promise<void> {
    if (!isEmbeddingReady()) {
      setTimeout(() => this.computeIntentCentroids(), 5000);
      return;
    }

    const categories: Array<{ name: string; alert: string; anchors: string[] }> = [
      { name: 'contradiction', alert: 'Contradiction detected — words don\'t match underlying feeling', anchors: INTENT_ANCHORS.contradiction },
      { name: 'absoluteThinking', alert: 'Absolute thinking pattern — strong emotion or cognitive distortion', anchors: INTENT_ANCHORS.absoluteThinking },
      { name: 'urgentNeed', alert: 'Urgent need for help or support detected', anchors: INTENT_ANCHORS.urgentNeed },
      { name: 'hesitation', alert: 'Hesitation or unspoken thoughts — something beneath the surface', anchors: INTENT_ANCHORS.hesitation },
    ];

    for (const cat of categories) {
      const vectors: number[][] = [];
      for (const anchor of cat.anchors) {
        const v = await embed(anchor);
        if (v) vectors.push(v);
      }
      if (vectors.length === 0) continue;

      // Average to centroid
      const centroid = new Array(vectors[0].length).fill(0);
      for (const vec of vectors) {
        for (let i = 0; i < vec.length; i++) centroid[i] += vec[i];
      }
      for (let i = 0; i < centroid.length; i++) centroid[i] /= vectors.length;

      // Normalize
      let norm = 0;
      for (let i = 0; i < centroid.length; i++) norm += centroid[i] * centroid[i];
      norm = Math.sqrt(norm);
      if (norm > 0) {
        for (let i = 0; i < centroid.length; i++) centroid[i] /= norm;
      }

      this.intentCentroids.push({ name: cat.name, alert: cat.alert, centroid });
    }

    this.centroidsComputed = this.intentCentroids.length > 0;
  }

  protected subscribesTo(): SignalType[] {
    return ['perception-result', 'bound-representation', 'emotion-detected'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        pushStat(this.emotionalValences, emotions.valence);
        const vZ = zScore(this.emotionalValences, emotions.valence);
        if (Math.abs(vZ) > 2) {
          this.emitAnomaly(
            vZ > 0 ? 'Sudden emotional uplift — unusual positivity' : 'Sudden emotional drop — unusual negativity',
            Math.min(1, Math.abs(vZ) / 4),
            'statistical',
          );
        }
        continue;
      }

      const content = this.extractContent(signal);
      if (!content) continue;

      this.recentContents.push(content);
      if (this.recentContents.length > 20) this.recentContents.shift();

      const now = Date.now();

      // --- Statistical anomaly detection ---
      pushStat(this.messageLengths, content.length);
      const lengthZ = zScore(this.messageLengths, content.length);
      if (Math.abs(lengthZ) > 2) {
        this.emitAnomaly(
          lengthZ > 0
            ? 'Unusually long message — they have a lot to express'
            : 'Unusually short message — possible withdrawal or tension',
          Math.min(1, Math.abs(lengthZ) / 4),
          'statistical',
        );
      }

      if (this.lastMessageTime > 0) {
        const gap = now - this.lastMessageTime;
        pushStat(this.interMessageGaps, gap);
        const gapZ = zScore(this.interMessageGaps, gap);
        if (Math.abs(gapZ) > 2) {
          this.emitAnomaly(
            gapZ > 0
              ? 'Long pause before responding — possible deliberation or discomfort'
              : 'Rapid-fire messaging — heightened engagement or urgency',
            Math.min(1, Math.abs(gapZ) / 4),
            'statistical',
          );
        }
      }
      this.lastMessageTime = now;

      // --- Embedding-based communication style shift detection ---
      this.detectStyleShift(content);

      // --- Embedding-based intent detection (replaces regex patterns) ---
      this.detectSemanticIntents(content);

      // --- Semantic topic shift detection ---
      if (this.recentContents.length > 2) {
        this.detectTopicShiftSemantic(content);
      }
    }
    this.status = 'idle';
  }

  /**
   * T0: Detect semantic intents via embedding similarity to intent centroids.
   * Replaces regex-based anomaly patterns with genuine semantic understanding.
   */
  private async detectSemanticIntents(content: string): Promise<void> {
    if (!this.centroidsComputed || !isEmbeddingReady()) return;

    const emb = await embed(content);
    if (!emb) return;

    for (const intent of this.intentCentroids) {
      const similarity = cosineSimilarity(emb, intent.centroid);

      // Different thresholds per intent category
      let threshold = 0.4;
      let weight = 0.5;

      if (intent.name === 'urgentNeed') {
        threshold = 0.35; // Lower threshold — don't miss urgent needs
        weight = 0.8;
      } else if (intent.name === 'contradiction') {
        threshold = 0.42;
        weight = 0.6;
      } else if (intent.name === 'hesitation') {
        threshold = 0.4;
        weight = 0.4;
      }

      if (similarity > threshold) {
        this.emitAnomaly(
          intent.alert,
          Math.min(1, similarity * weight * 2),
          'structural',
        );
        break; // Only emit one intent per message
      }
    }
  }

  /**
   * T0: Detect subtle shifts in communication style via embeddings.
   */
  private async detectStyleShift(content: string): Promise<void> {
    if (!isEmbeddingReady()) return;

    const emb = await embed(content);
    if (!emb) return;

    if (this.styleEmbeddings.length > 0) {
      const prev = this.styleEmbeddings[this.styleEmbeddings.length - 1];
      const similarity = cosineSimilarity(prev.embedding, emb);

      pushStat(this.styleShiftStats, similarity);
      const simZ = zScore(this.styleShiftStats, similarity);

      if (simZ < -2 && this.styleShiftStats.values.length >= 5) {
        this.emitAnomaly(
          'Communication style shift detected — tone or approach has changed subtly',
          Math.min(1, Math.abs(simZ) / 4),
          'structural',
        );
      }
    }

    this.styleEmbeddings.push({ embedding: emb, timestamp: Date.now() });
    if (this.styleEmbeddings.length > 15) {
      this.styleEmbeddings.shift();
    }
  }

  /**
   * Semantic topic shift detection using embeddings.
   */
  private async detectTopicShiftSemantic(content: string): Promise<void> {
    if (this.recentContents.length < 2) return;
    const prev = this.recentContents[this.recentContents.length - 2];

    if (isEmbeddingReady()) {
      const [prevEmb, currEmb] = await Promise.all([embed(prev), embed(content)]);
      if (prevEmb && currEmb) {
        const similarity = cosineSimilarity(prevEmb, currEmb);
        if (similarity < 0.25) {
          this.selfState.nudge('curiosity', 0.03);
          this.emitAnomaly('Abrupt topic shift — something new emerged', 0.5, 'structural');
        }
      }
    }
  }

  private emitAnomaly(alert: string, confidence: number, source: 'statistical' | 'structural'): void {
    this.emit('intuition-alert', {
      message: alert,
      confidence,
      basis: source,
    }, {
      target: [ENGINE_IDS.ATTENTION, ENGINE_IDS.ARBITER],
      priority: confidence > 0.7 ? SIGNAL_PRIORITIES.MEDIUM : SIGNAL_PRIORITIES.LOW,
    });

    this.selfState.nudge('curiosity', 0.03 * confidence);
    this.selfState.nudge('arousal', 0.02 * confidence);

    this.debugInfo = `Intuition [${source}]: ${alert.slice(0, 40)} (${(confidence * 100).toFixed(0)}%)`;
  }

  private extractContent(signal: Signal): string | null {
    const payload = signal.payload as Record<string, unknown>;
    if (typeof payload.content === 'string') return payload.content;
    if (typeof payload.text === 'string') return payload.text;
    return null;
  }
}
