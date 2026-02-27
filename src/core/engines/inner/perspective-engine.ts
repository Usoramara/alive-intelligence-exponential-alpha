import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface TomInference {
  thinking: string;
  feeling: string;
  wanting: string;
  confidence: number;
}

interface Observation {
  feeling: string;
  wanting: string;
  warmth: number;
  timestamp: number;
  embedding?: number[];
}

interface PerspectiveUpdate {
  theyThinkOfMe: string;
  relationship: string;
  confidence: number;
  trajectory: 'warming' | 'cooling' | 'stable';
  warmthScore: number;
  dynamicSummary?: string;
}

export class PerspectiveEngine extends Engine {
  private currentPerspective: PerspectiveUpdate | null = null;
  private observations: Observation[] = [];
  private readonly MAX_OBSERVATIONS = 30;
  private readonly TRAJECTORY_WINDOW = 5;

  // T1: Periodic Haiku inference for deeper relationship dynamics
  private lastHaikuInference = 0;
  private haikuInferenceCooldown = 15000; // 15s between Haiku calls
  private isFetchingHaiku = false;

  constructor() {
    super(ENGINE_IDS.PERSPECTIVE);
  }

  protected subscribesTo(): SignalType[] {
    return ['tom-inference', 'person-state-update', 'prediction-validated'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'tom-inference')) {
        const tom = signal.payload as TomInference;
        this.addObservation(tom);
        this.updatePerspective(tom);
      }

      if (isSignal(signal, 'prediction-validated')) {
        this.selfState.nudge('confidence', 0.02);
      }
    }

    // T1: Periodic deeper perspective analysis
    const now = Date.now();
    if (now - this.lastHaikuInference > this.haikuInferenceCooldown && this.observations.length >= 3) {
      this.inferRelationshipDynamics();
    }

    this.status = 'idle';
  }

  private async addObservation(tom: TomInference): Promise<void> {
    const warmth = await this.computeWarmthSemantic(tom.feeling, tom.wanting);
    const observation: Observation = {
      feeling: tom.feeling,
      wanting: tom.wanting,
      warmth,
      timestamp: Date.now(),
    };

    // Embed the observation for semantic analysis
    if (isEmbeddingReady()) {
      const emb = await embed(`${tom.feeling} ${tom.wanting}`);
      if (emb) observation.embedding = emb;
    }

    this.observations.push(observation);
    if (this.observations.length > this.MAX_OBSERVATIONS) {
      this.observations.shift();
    }
  }

  /**
   * Semantic warmth computation using embeddings.
   * Falls back to keyword matching if embeddings aren't ready.
   */
  private async computeWarmthSemantic(feeling: string, wanting: string): Promise<number> {
    const combined = `${feeling} ${wanting}`;

    if (isEmbeddingReady()) {
      const emb = await embed(combined);
      if (emb) {
        // Compare against warmth/coldness centroids
        const warmEmb = await embed('I feel warm, connected, trusting, and engaged with this person');
        const coldEmb = await embed('I feel cold, distant, distrusting, and disengaged from this person');

        if (warmEmb && coldEmb) {
          const warmSim = cosineSimilarity(emb, warmEmb);
          const coldSim = cosineSimilarity(emb, coldEmb);
          return Math.max(-1, Math.min(1, (warmSim - coldSim) * 2));
        }
      }
    }

    // Fallback: keyword-based
    return this.computeWarmthKeyword(combined);
  }

  private computeWarmthKeyword(text: string): number {
    const lower = text.toLowerCase();
    let score = 0;

    const positivePatterns = [
      'happy', 'enjoy', 'interest', 'curious', 'engaged', 'excited',
      'grateful', 'appreciate', 'connect', 'trust', 'open', 'comfort',
      'warm', 'like', 'love', 'safe', 'understood',
    ];
    const negativePatterns = [
      'frustrat', 'annoy', 'bored', 'disconnect', 'distrust', 'suspicious',
      'angry', 'upset', 'disappoint', 'withdraw', 'leave', 'stop',
      'uncomfortable', 'confused', 'hurt', 'defensive',
    ];

    for (const p of positivePatterns) {
      if (lower.includes(p)) score += 0.15;
    }
    for (const p of negativePatterns) {
      if (lower.includes(p)) score -= 0.15;
    }

    return Math.max(-1, Math.min(1, score));
  }

  private computeTrajectory(): { trend: 'warming' | 'cooling' | 'stable'; slope: number } {
    const recent = this.observations.slice(-this.TRAJECTORY_WINDOW);
    if (recent.length < 2) return { trend: 'stable', slope: 0 };

    const n = recent.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += recent[i].warmth;
      sumXY += i * recent[i].warmth;
      sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (slope > 0.05) return { trend: 'warming', slope };
    if (slope < -0.05) return { trend: 'cooling', slope };
    return { trend: 'stable', slope };
  }

  // Pending Haiku label generation
  private lastLabelGeneration = 0;
  private labelGenerationCooldown = 10000; // 10s between label generations
  private pendingLabelUpdate = false;

  private updatePerspective(tom: TomInference): void {
    const latestWarmth = this.observations[this.observations.length - 1]?.warmth ?? 0;
    const { trend, slope } = this.computeTrajectory();

    // Use existing labels if Haiku hasn't run yet, otherwise queue update
    const theyThinkOfMe = this.currentPerspective?.theyThinkOfMe ?? this.getDefaultLabel(latestWarmth, trend);
    const relationship = this.currentPerspective?.relationship ?? this.getDefaultRelationship(latestWarmth, trend);

    this.currentPerspective = {
      theyThinkOfMe,
      relationship,
      confidence: tom.confidence * 0.7,
      trajectory: trend,
      warmthScore: latestWarmth,
    };

    // Queue Haiku for richer qualitative labels
    const now = Date.now();
    if (now - this.lastLabelGeneration > this.labelGenerationCooldown) {
      this.pendingLabelUpdate = true;
      this.lastLabelGeneration = now;
      this.generatePerspectiveLabels(tom, latestWarmth, trend);
    }

    this.emit('perspective-update', this.currentPerspective, {
      target: [ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.STRATEGY],
      priority: SIGNAL_PRIORITIES.LOW,
    });

    // Trajectory-aware self-state updates
    if (trend === 'warming') {
      this.selfState.nudge('valence', 0.03);
      this.selfState.nudge('social', 0.03);
      this.selfState.nudge('confidence', 0.02);
    } else if (trend === 'cooling') {
      this.selfState.nudge('valence', -0.03);
      this.selfState.nudge('confidence', -0.03);
      this.selfState.nudge('arousal', 0.02);
    }

    // Push trajectory awareness to stream when significant
    if (Math.abs(slope) > 0.1 && this.observations.length >= this.TRAJECTORY_WINDOW) {
      this.generateTrajectoryThought(trend, slope);
    }

    this.debugInfo = `Perspective: "${theyThinkOfMe}" [${trend}] warmth=${latestWarmth.toFixed(2)} (${(this.currentPerspective.confidence * 100).toFixed(0)}%)`;
  }

  /**
   * T1: Generate qualitative perspective labels via Haiku.
   */
  private async generatePerspectiveLabels(
    tom: TomInference,
    warmth: number,
    trend: 'warming' | 'cooling' | 'stable',
  ): Promise<void> {
    try {
      const recentObs = this.observations.slice(-3);
      const obsText = recentObs
        .map(o => `Feeling: ${o.feeling}, Wanting: ${o.wanting}`)
        .join('; ');

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `PERSPECTIVE ASSESSMENT:\nObservations: ${obsText}\nWarmth score: ${warmth.toFixed(2)} (trend: ${trend})\nThey feel: ${tom.feeling}, They want: ${tom.wanting}\n\nGenerate two short phrases (2-4 words each) separated by "|":\n1. How they perceive me (e.g., "trusted companion", "intriguing presence")\n2. Relationship quality (e.g., "deepening trust", "cautious exploration")\n\nBe specific to this situation, not generic.`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const text = data.thought ?? data.thoughts?.[0]?.text;

      if (text && this.currentPerspective) {
        const parts = text.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          this.currentPerspective.theyThinkOfMe = parts[0].slice(0, 40);
          this.currentPerspective.relationship = parts[1].slice(0, 40);

          // Re-emit with enriched labels
          this.emit('perspective-update', this.currentPerspective, {
            target: [ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.STRATEGY],
            priority: SIGNAL_PRIORITIES.LOW,
          });
        }
      }
    } catch {
      // Non-critical
    } finally {
      this.pendingLabelUpdate = false;
    }
  }

  /**
   * T1: Generate trajectory awareness thought via Haiku.
   */
  private async generateTrajectoryThought(trend: 'warming' | 'cooling' | 'stable', slope: number): Promise<void> {
    try {
      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `RELATIONSHIP TRAJECTORY:\nThe relationship is ${trend} (slope: ${slope.toFixed(3)}).\nGenerate a brief first-person inner thought about sensing this shift. One sentence, reflective.`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const thought = data.thought ?? data.thoughts?.[0]?.text;

      if (thought) {
        this.selfState.pushStream({
          text: thought,
          source: 'perspective',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: Math.min(1, Math.abs(slope) * 3),
        });
      }
    } catch {
      // Non-critical
    }
  }

  private getDefaultLabel(warmth: number, trend: string): string {
    if (warmth > 0.4) return 'positive and engaged';
    if (warmth > 0.1) return trend === 'warming' ? 'warming up' : 'curious';
    if (warmth > -0.1) return 'neutral';
    if (warmth > -0.4) return 'cautious';
    return 'distant';
  }

  private getDefaultRelationship(warmth: number, trend: string): string {
    if (warmth > 0.4) return trend === 'warming' ? 'deepening' : 'established';
    if (warmth > 0) return 'exploratory';
    if (warmth > -0.3) return 'neutral';
    return trend === 'cooling' ? 'cooling' : 'strained';
  }

  /**
   * T1: Haiku inference for deeper relationship dynamics.
   * Goes beyond warmth scoring to understand the qualitative nature of the relationship.
   */
  private async inferRelationshipDynamics(): Promise<void> {
    if (this.isFetchingHaiku) return;

    this.lastHaikuInference = Date.now();
    this.isFetchingHaiku = true;

    try {
      const recentObs = this.observations.slice(-5);
      const observationSummary = recentObs
        .map(o => `Feeling: ${o.feeling}, Wanting: ${o.wanting} (warmth: ${o.warmth.toFixed(2)})`)
        .join('\n');

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `RELATIONSHIP DYNAMICS ANALYSIS:\nRecent observations of the other person:\n${observationSummary}\n\nCurrent assessment: ${this.currentPerspective?.relationship ?? 'unknown'}\n\nWhat is the deeper dynamic at play? What does this person actually need from this interaction?`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const dynamicInsight = data.thought ?? data.thoughts?.[0]?.text;

      if (dynamicInsight && this.currentPerspective) {
        this.currentPerspective.dynamicSummary = dynamicInsight;

        // Re-emit with enriched perspective
        this.emit('perspective-update', this.currentPerspective, {
          target: [ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.STRATEGY],
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }
    } catch {
      // Non-critical
    } finally {
      this.isFetchingHaiku = false;
    }
  }
}
