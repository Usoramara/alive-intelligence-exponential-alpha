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

export class IntuitionEngine extends Engine {
  // Statistical tracking
  private messageLengths = createRollingStats(30);
  private emotionalValences = createRollingStats(30);
  private interMessageGaps = createRollingStats(20);
  private lastMessageTime = 0;

  // Embedding-based communication style tracking
  private styleEmbeddings: Array<{ embedding: number[]; timestamp: number }> = [];
  private styleShiftStats = createRollingStats(15); // Track inter-message embedding similarity

  // Pattern-based (secondary, lower weight)
  private anomalyPatterns: Array<{ pattern: RegExp; alert: string; weight: number }> = [
    { pattern: /\b(but|however|although|yet)\b.*\b(good|great|fine|ok)\b/i, alert: 'Contradiction — positive words with hedging', weight: 0.4 },
    { pattern: /\b(always|never|everyone|nobody)\b/i, alert: 'Absolute language — strong emotion or cognitive distortion', weight: 0.3 },
    { pattern: /\b(help|please|need|desperate)\b/i, alert: 'Request for help — elevated significance', weight: 0.5 },
    { pattern: /\?\s*\?|\!\s*\!/i, alert: 'Repeated punctuation — heightened expression', weight: 0.3 },
    { pattern: /\.{3,}/i, alert: 'Trailing off — hesitation or unspoken thoughts', weight: 0.2 },
  ];

  private recentContents: string[] = [];

  constructor() {
    super(ENGINE_IDS.INTUITION);
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

      // --- Pattern-based detection (secondary, lower confidence) ---
      for (const { pattern, alert, weight } of this.anomalyPatterns) {
        if (pattern.test(content)) {
          this.emitAnomaly(alert, weight * 0.6, 'pattern');
          break;
        }
      }

      // --- Semantic topic shift detection ---
      if (this.recentContents.length > 2) {
        this.detectTopicShiftSemantic(content);
      }
    }
    this.status = 'idle';
  }

  /**
   * T0: Detect subtle shifts in communication style via embeddings.
   * Tracks embedding similarity between consecutive messages.
   * A sudden drop in similarity suggests a style/tone change.
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

      // A significantly lower-than-normal similarity suggests a communication style shift
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
   * More reliable than word overlap for detecting genuine topic changes.
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
        return;
      }
    }

    // Fallback: word overlap
    if (this.topicShiftFallback(prev, content)) {
      this.selfState.nudge('curiosity', 0.03);
      this.emitAnomaly('Abrupt topic shift — something new emerged', 0.5, 'structural');
    }
  }

  private emitAnomaly(alert: string, confidence: number, source: 'statistical' | 'pattern' | 'structural'): void {
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

  private topicShiftFallback(prev: string, current: string): boolean {
    const prevWords = new Set(prev.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const currentWords = current.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (currentWords.length < 3) return false;
    const overlap = currentWords.filter(w => prevWords.has(w)).length;
    return overlap < 1;
  }
}
