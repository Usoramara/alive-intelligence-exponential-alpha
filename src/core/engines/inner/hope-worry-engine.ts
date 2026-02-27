import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface HopeWorryItem {
  content: string;
  intensity: number;
  timestamp: number;
}

export class HopeWorryEngine extends Engine {
  private hopes: HopeWorryItem[] = [];
  private worries: HopeWorryItem[] = [];

  // Embedding-based sentiment centroids
  private hopeCentroid: number[] | null = null;
  private worryCentroid: number[] | null = null;
  private centroidsComputed = false;

  constructor() {
    super(ENGINE_IDS.HOPE_WORRY);
    this.computeSentimentCentroids();
  }

  private async computeSentimentCentroids(): Promise<void> {
    const hopePhrases = [
      'Things will get better and improve in the future',
      'I am optimistic about growth and positive outcomes',
      'There is potential for connection and understanding',
      'Success and progress are possible if we keep trying',
    ];
    const worryPhrases = [
      'Things might get worse and fall apart',
      'I am concerned about failure and negative outcomes',
      'There is a risk of disconnection and misunderstanding',
      'Problems and difficulties may increase over time',
    ];

    const hopVecs: number[][] = [];
    const worVecs: number[][] = [];

    for (const p of hopePhrases) {
      const v = await embed(p);
      if (v) hopVecs.push(v);
    }
    for (const p of worryPhrases) {
      const v = await embed(p);
      if (v) worVecs.push(v);
    }

    if (hopVecs.length > 0) {
      this.hopeCentroid = this.averageVectors(hopVecs);
    }
    if (worVecs.length > 0) {
      this.worryCentroid = this.averageVectors(worVecs);
    }

    this.centroidsComputed = hopVecs.length > 0 && worVecs.length > 0;
  }

  private averageVectors(vecs: number[][]): number[] {
    const dim = vecs[0].length;
    const avg = new Array(dim).fill(0);
    for (const v of vecs) {
      for (let i = 0; i < dim; i++) avg[i] += v[i];
    }
    for (let i = 0; i < dim; i++) avg[i] /= vecs.length;
    // Normalize
    let norm = 0;
    for (let i = 0; i < dim; i++) norm += avg[i] * avg[i];
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < dim; i++) avg[i] /= norm;
    }
    return avg;
  }

  protected subscribesTo(): SignalType[] {
    return ['imagination-result', 'strategy-update', 'person-state-update'];
  }

  getState(): { hopes: HopeWorryItem[]; worries: HopeWorryItem[] } {
    return { hopes: [...this.hopes], worries: [...this.worries] };
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'imagination-result')) {
        const result = signal.payload;
        this.evaluateScenarioSemantic(result.scenario, result.valence);
      }
    }
    this.status = 'idle';
  }

  /**
   * Embedding-based scenario evaluation.
   * Uses cosine similarity to hope/worry centroids instead of word lists.
   * Falls back to valence from imagination result when embeddings aren't ready.
   */
  private async evaluateScenarioSemantic(scenario: string, scenarioValence: number): Promise<void> {
    let hopeScore = 0;
    let worryScore = 0;

    if (this.centroidsComputed && isEmbeddingReady() && this.hopeCentroid && this.worryCentroid) {
      const scenarioEmb = await embed(scenario);
      if (scenarioEmb) {
        hopeScore = cosineSimilarity(scenarioEmb, this.hopeCentroid);
        worryScore = cosineSimilarity(scenarioEmb, this.worryCentroid);
      }
    }

    // Combine embedding similarity with valence from imagination
    const combinedHope = hopeScore * 0.6 + Math.max(0, scenarioValence) * 0.4;
    const combinedWorry = worryScore * 0.6 + Math.max(0, -scenarioValence) * 0.4;

    const now = Date.now();

    if (combinedHope > combinedWorry && combinedHope > 0.2) {
      this.hopes.push({ content: scenario, intensity: combinedHope, timestamp: now });
      if (this.hopes.length > 5) this.hopes.shift();
      this.selfState.nudge('valence', 0.02 * combinedHope);
      this.selfState.nudge('energy', 0.01);
      this.debugInfo = `Hope (${combinedHope.toFixed(2)}): "${scenario.slice(0, 30)}..."`;
    } else if (combinedWorry > 0.2) {
      this.worries.push({ content: scenario, intensity: combinedWorry, timestamp: now });
      if (this.worries.length > 5) this.worries.shift();
      this.selfState.nudge('valence', -0.02 * combinedWorry);
      this.selfState.nudge('arousal', 0.02);
      this.debugInfo = `Worry (${combinedWorry.toFixed(2)}): "${scenario.slice(0, 30)}..."`;
    }

    this.emit('hope-worry-update', {
      hopes: this.hopes.slice(-3).map(h => ({ content: h.content, intensity: h.intensity })),
      worries: this.worries.slice(-3).map(w => ({ content: w.content, intensity: w.intensity })),
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.DEFAULT_MODE],
      priority: SIGNAL_PRIORITIES.LOW,
    });
  }
}
