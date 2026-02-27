import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  getEmotionCentroidsCached,
  getEmotionCentroids,
  detectEmotionsT0,
  cosineSimilarity,
  type EmotionCentroid,
} from '../../embeddings';

interface EmotionDetection {
  emotions: string[];
  valence: number;
  arousal: number;
  confidence: number;
}

interface EmotionDatapoint {
  valence: number;
  arousal: number;
  timestamp: number;
}

type TrajectoryPattern = 'spiraling-down' | 'spiraling-up' | 'stabilizing' | 'oscillating' | 'neutral';

export class EmotionInferenceEngine extends Engine {
  // T1 rate limiting
  private lastHaikuCall = 0;
  private haikuCooldown = 3000; // 3s between Haiku calls

  // Recent message history for T1 context
  private recentMessages: Array<{ text: string; timestamp: number }> = [];

  // Emotion trajectory tracking
  private emotionHistory: EmotionDatapoint[] = [];
  private lastTrajectoryEmit = 0;
  private trajectoryEmitCooldown = 5000; // 5s between trajectory signals

  // T0 readiness
  private centroidsReady = false;
  private centroids: EmotionCentroid[] = [];

  constructor() {
    super(ENGINE_IDS.EMOTION_INFERENCE);
    // Trigger centroid computation in background
    this.warmUpCentroids();
  }

  private async warmUpCentroids(): Promise<void> {
    try {
      this.centroids = await getEmotionCentroids();
      this.centroidsReady = true;
    } catch {
      // Will retry via getCached path
    }
  }

  protected subscribesTo(): SignalType[] {
    return ['perception-result', 'attention-focus'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (!isSignal(signal, 'perception-result')) continue;

      const perception = signal.payload;
      if (perception.modality !== 'text' && !('content' in perception)) continue;

      const content = (perception as unknown as { content?: string; description?: string }).content
        ?? perception.description;
      if (!content) continue;

      // Track message for T1 context
      this.recentMessages.push({ text: content, timestamp: Date.now() });
      if (this.recentMessages.length > 10) this.recentMessages.shift();

      // ── T0: Embedding-based emotion detection ──
      this.detectT0(content);

      // ── T1: Haiku nuanced analysis (rate-limited) ──
      const now = Date.now();
      const shouldCallHaiku =
        now - this.lastHaikuCall > this.haikuCooldown &&
        content.length > 10;

      if (shouldCallHaiku) {
        this.lastHaikuCall = now;
        this.detectT1(content);
      }
    }

    // ── Trajectory analysis on each tick ──
    this.analyzeTrajectory();

    this.status = 'idle';
  }

  /**
   * T0: Embedding-based emotion detection.
   * Embeds the text and computes cosine similarity against 19 emotion cluster centroids.
   * Runs locally, no API call, <5ms after model warm-up.
   */
  private async detectT0(text: string): Promise<void> {
    // Check if centroids are cached
    if (!this.centroidsReady) {
      const cached = getEmotionCentroidsCached();
      if (cached) {
        this.centroids = cached;
        this.centroidsReady = true;
      } else {
        return; // Not ready yet, T1 will cover
      }
    }

    if (!isEmbeddingReady()) return;

    const textEmbedding = await embed(text);
    if (!textEmbedding) return;

    const results = detectEmotionsT0(textEmbedding, this.centroids, 3, 0.25);
    if (!results || results.length === 0) return;

    // Compute weighted valence/arousal from top matches
    let totalWeight = 0;
    let weightedValence = 0;
    let weightedArousal = 0;

    for (const r of results) {
      const weight = r.similarity;
      weightedValence += r.valence * weight;
      weightedArousal += r.arousal * weight;
      totalWeight += weight;
    }

    const detection: EmotionDetection = {
      emotions: results.map(r => r.emotion),
      valence: totalWeight > 0 ? weightedValence / totalWeight : 0,
      arousal: totalWeight > 0 ? weightedArousal / totalWeight : 0,
      confidence: Math.min(1, results[0].similarity * 1.5),
    };

    // Track for trajectory
    this.emotionHistory.push({
      valence: detection.valence,
      arousal: detection.arousal,
      timestamp: Date.now(),
    });
    if (this.emotionHistory.length > 50) this.emotionHistory.shift();

    this.emit('emotion-detected', detection, {
      target: [ENGINE_IDS.PERSON_STATE, ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.ARBITER],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    this.debugInfo = `T0: ${results.map(r => `${r.emotion}(${r.similarity.toFixed(2)})`).join(', ')}`;
  }

  /**
   * T1: Haiku nuanced analysis with conversation context.
   * Detects sarcasm, implicit emotions, mixed emotions, emotional trajectory.
   * Includes last 3 messages for context.
   */
  private async detectT1(text: string): Promise<void> {
    try {
      // Build context from recent messages
      const contextMessages = this.recentMessages
        .slice(-3)
        .map(m => m.text)
        .join('\n---\n');

      // Include trajectory info if available
      const trajectory = this.computeTrajectory();
      const trajectoryHint = trajectory.pattern !== 'neutral'
        ? `\nEmotional trajectory: ${trajectory.pattern} (valence slope: ${trajectory.valenceSlope.toFixed(3)})`
        : '';

      const response = await fetch('/api/mind/detect-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          context: contextMessages + trajectoryHint,
        }),
      });

      if (!response.ok) return;

      const haiku = (await response.json()) as EmotionDetection;

      // Track for trajectory
      this.emotionHistory.push({
        valence: haiku.valence,
        arousal: haiku.arousal,
        timestamp: Date.now(),
      });
      if (this.emotionHistory.length > 50) this.emotionHistory.shift();

      // T1 results are authoritative (Haiku has more nuance than embedding similarity)
      this.emit('emotion-detected', haiku, {
        target: [ENGINE_IDS.PERSON_STATE, ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.ARBITER],
        priority: SIGNAL_PRIORITIES.MEDIUM,
      });

      this.debugInfo = `T1: ${haiku.emotions.join(', ')} (v:${haiku.valence.toFixed(2)}, c:${haiku.confidence.toFixed(2)})`;
    } catch {
      // Fire-and-forget — T0 results still available
    }
  }

  /**
   * Analyze emotion trajectory over recent history.
   * Detects: spiraling-down, spiraling-up, stabilizing, oscillating, neutral.
   * Emits `emotion-trajectory` signal when pattern is detected.
   */
  private analyzeTrajectory(): void {
    const now = Date.now();
    if (now - this.lastTrajectoryEmit < this.trajectoryEmitCooldown) return;
    if (this.emotionHistory.length < 4) return;

    const trajectory = this.computeTrajectory();

    if (trajectory.pattern !== 'neutral') {
      this.lastTrajectoryEmit = now;

      this.emit('emotion-trajectory', trajectory, {
        target: [ENGINE_IDS.ARBITER, ENGINE_IDS.METACOGNITION, ENGINE_IDS.EMPATHIC_COUPLING],
        priority: SIGNAL_PRIORITIES.MEDIUM,
      });

      // Push awareness to consciousness stream for significant trajectories
      if (trajectory.confidence > 0.5) {
        const thought = this.trajectoryToThought(trajectory.pattern);
        if (thought) {
          this.selfState.pushStream({
            text: thought,
            source: 'emotion-inference',
            flavor: 'emotional',
            timestamp: now,
            intensity: trajectory.confidence,
          });
        }
      }
    }
  }

  private computeTrajectory(): {
    pattern: TrajectoryPattern;
    valenceSlope: number;
    arousalSlope: number;
    windowSize: number;
    confidence: number;
  } {
    // Use last 8 datapoints (or all if fewer)
    const window = this.emotionHistory.slice(-8);
    const n = window.length;

    if (n < 4) {
      return { pattern: 'neutral', valenceSlope: 0, arousalSlope: 0, windowSize: n, confidence: 0 };
    }

    // Linear regression on valence and arousal
    const valenceSlope = this.linearSlope(window.map(d => d.valence));
    const arousalSlope = this.linearSlope(window.map(d => d.arousal));

    // Compute variance of valence (for oscillation detection)
    const valMean = window.reduce((s, d) => s + d.valence, 0) / n;
    const valVariance = window.reduce((s, d) => s + (d.valence - valMean) ** 2, 0) / n;

    // Detect sign changes (for oscillation)
    let signChanges = 0;
    for (let i = 1; i < n; i++) {
      if ((window[i].valence - valMean) * (window[i - 1].valence - valMean) < 0) {
        signChanges++;
      }
    }

    let pattern: TrajectoryPattern = 'neutral';
    let confidence = 0;

    if (signChanges >= n * 0.5 && valVariance > 0.02) {
      pattern = 'oscillating';
      confidence = Math.min(1, signChanges / n + valVariance * 5);
    } else if (valenceSlope < -0.03) {
      pattern = 'spiraling-down';
      confidence = Math.min(1, Math.abs(valenceSlope) * 10);
    } else if (valenceSlope > 0.03) {
      pattern = 'spiraling-up';
      confidence = Math.min(1, valenceSlope * 10);
    } else if (valVariance < 0.005 && n >= 6) {
      pattern = 'stabilizing';
      confidence = Math.min(1, (0.01 - valVariance) * 100);
    }

    return { pattern, valenceSlope, arousalSlope, windowSize: n, confidence };
  }

  private linearSlope(values: number[]): number {
    const n = values.length;
    if (n < 2) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const denom = n * sumX2 - sumX * sumX;
    return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  }

  private trajectoryToThought(pattern: TrajectoryPattern): string | null {
    switch (pattern) {
      case 'spiraling-down':
        return 'I sense their emotional state declining... I should be more attentive and gentle.';
      case 'spiraling-up':
        return 'Their mood seems to be lifting... the conversation might be helping.';
      case 'oscillating':
        return 'Their emotions are fluctuating — something complex is happening beneath the surface.';
      case 'stabilizing':
        return 'The emotional undercurrent is settling into something steady...';
      default:
        return null;
    }
  }
}
