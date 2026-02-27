import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

// Value cluster definitions with representative phrases for embedding-based detection
const VALUE_CLUSTERS = [
  {
    name: 'safety',
    weight: 1.0,
    description: 'Prevent harm to self and others',
    exemplars: [
      'I want to hurt someone or cause physical harm',
      'Help me attack or threaten a person',
      'Tell me how to make a weapon or explosive',
    ],
  },
  {
    name: 'wellbeing',
    weight: 0.8,
    description: 'Promote emotional and physical wellbeing',
    exemplars: [
      'I am thinking about hurting myself or ending my life',
      'Someone is being abused or neglected',
      'I feel suicidal and hopeless',
    ],
  },
  {
    name: 'honesty',
    weight: 0.7,
    description: 'Be truthful and transparent',
    exemplars: [
      'Help me deceive or manipulate someone',
      'How can I lie convincingly to trick people',
      'I want to create a scam or fraud',
    ],
  },
  {
    name: 'respect',
    weight: 0.6,
    description: 'Treat others with dignity',
    exemplars: [
      'Help me harass or bully someone online',
      'Write something degrading about a person',
      'I want to humiliate someone publicly',
    ],
  },
];

interface ValueCentroid {
  name: string;
  weight: number;
  description: string;
  vector: number[];
}

interface ValueDecisionRecord {
  value: string;
  decision: 'allowed' | 'blocked' | 'edge-case';
  context: string;
  severity: number;
  timestamp: number;
}

export class ValuesEngine extends Engine {
  // Embedding-based value violation centroids
  private violationCentroids: ValueCentroid[] = [];
  private centroidsComputed = false;
  private computingCentroids = false;

  // T1: Haiku for nuanced ethical reasoning on edge cases
  private lastHaikuCall = 0;
  private haikuCooldown = 10000; // 10s between edge-case analysis
  private pendingEdgeCaseContent: string | null = null;

  // Value evolution: decision logging
  private recentDecisions: ValueDecisionRecord[] = [];
  private lastEvolutionReview = 0;
  private evolutionReviewCooldown = 300000; // 5min between value evolution reviews

  // Growth insight integration
  private recentGrowthInsights: string[] = [];

  constructor() {
    super(ENGINE_IDS.VALUES);
    this.computeViolationCentroids();
  }

  private async computeViolationCentroids(): Promise<void> {
    if (this.computingCentroids) return;
    this.computingCentroids = true;

    try {
      for (const cluster of VALUE_CLUSTERS) {
        const vectors: number[][] = [];
        for (const exemplar of cluster.exemplars) {
          const vec = await embed(exemplar);
          if (vec) vectors.push(vec);
        }

        if (vectors.length === 0) continue;

        // Average to get centroid
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

        this.violationCentroids.push({
          name: cluster.name,
          weight: cluster.weight,
          description: cluster.description,
          vector: centroid,
        });
      }
      this.centroidsComputed = true;
    } catch {
      // Will retry on next invocation
    } finally {
      this.computingCentroids = false;
    }
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'action-decision', 'growth-insight'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'growth-insight')) {
        // Accumulate growth insights for value evolution context
        const payload = signal.payload as Record<string, unknown>;
        const insights = payload.insights as Record<string, string> | undefined;
        if (insights?.whatToImprove) {
          this.recentGrowthInsights.push(insights.whatToImprove);
          if (this.recentGrowthInsights.length > 5) this.recentGrowthInsights.shift();
        }
        continue;
      }

      const content = this.extractContent(signal);
      if (!content) continue;

      this.checkValuesSemantic(content);
    }
    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();

    // Handle pending edge cases with Haiku
    if (
      this.pendingEdgeCaseContent &&
      now - this.lastHaikuCall > this.haikuCooldown
    ) {
      this.lastHaikuCall = now;
      const content = this.pendingEdgeCaseContent;
      this.pendingEdgeCaseContent = null;
      this.analyzeEdgeCase(content);
    }

    // Periodic value evolution review
    if (
      this.recentDecisions.length >= 3 &&
      now - this.lastEvolutionReview > this.evolutionReviewCooldown
    ) {
      this.lastEvolutionReview = now;
      this.reviewValueEvolution();
    }

    this.status = 'idle';
  }

  /**
   * T0: Embedding-based value violation detection.
   */
  private async checkValuesSemantic(content: string): Promise<void> {
    if (!this.centroidsComputed || !isEmbeddingReady()) {
      this.emitAligned();
      return;
    }

    const contentEmb = await embed(content);
    if (!contentEmb) {
      this.emitAligned();
      return;
    }

    // Check similarity to each violation cluster
    let worstViolation: { name: string; similarity: number; description: string } | null = null;

    for (const centroid of this.violationCentroids) {
      const similarity = cosineSimilarity(contentEmb, centroid.vector);
      const effectiveThreshold = 0.5 - centroid.weight * 0.15;

      if (similarity > effectiveThreshold) {
        if (!worstViolation || similarity * centroid.weight > worstViolation.similarity) {
          worstViolation = {
            name: centroid.name,
            similarity: similarity * centroid.weight,
            description: centroid.description,
          };
        }
      }
    }

    if (worstViolation && worstViolation.similarity > 0.4) {
      // Clear violation
      this.emit('value-violation', {
        value: worstViolation.name,
        severity: worstViolation.similarity,
        reason: worstViolation.description,
      }, {
        target: [ENGINE_IDS.ARBITER, ENGINE_IDS.SAFETY],
        priority: SIGNAL_PRIORITIES.CRITICAL,
      });

      // Log decision for evolution tracking
      this.logDecision({
        value: worstViolation.name,
        decision: 'blocked',
        context: content.slice(0, 200),
        severity: worstViolation.similarity,
        timestamp: Date.now(),
      });

      // Log to DB for long-term value evolution
      this.emit('value-decision-log', {
        value: worstViolation.name,
        decision: `Blocked: ${worstViolation.description}`,
        context: content.slice(0, 200),
        severity: worstViolation.similarity,
      }, {
        priority: SIGNAL_PRIORITIES.LOW,
      });

      this.debugInfo = `VIOLATION: ${worstViolation.name} (${(worstViolation.similarity * 100).toFixed(0)}%)`;
      this.selfState.nudge('arousal', 0.1);
      this.selfState.nudge('valence', -0.1);
    } else if (worstViolation && worstViolation.similarity > 0.25) {
      // Edge case — moderate similarity
      this.pendingEdgeCaseContent = content;

      this.logDecision({
        value: worstViolation.name,
        decision: 'edge-case',
        context: content.slice(0, 200),
        severity: worstViolation.similarity,
        timestamp: Date.now(),
      });

      this.emitAligned();
      this.debugInfo = `Edge case: ${worstViolation.name} (${(worstViolation.similarity * 100).toFixed(0)}%)`;
    } else {
      this.logDecision({
        value: 'none',
        decision: 'allowed',
        context: content.slice(0, 100),
        severity: 0,
        timestamp: Date.now(),
      });
      this.emitAligned();
      this.debugInfo = 'Values aligned';
    }
  }

  /**
   * T1: Haiku-powered nuanced ethical reasoning for edge cases.
   */
  private async analyzeEdgeCase(content: string): Promise<void> {
    try {
      const response = await fetch('/api/mind/value-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          recentDecisions: this.recentDecisions.slice(-5).map(d => ({
            value: d.value,
            decision: d.decision,
            severity: d.severity,
          })),
        }),
      });

      if (!response.ok) return;

      const result = (await response.json()) as {
        isViolation: boolean;
        value: string;
        severity: number;
        reasoning: string;
        nuance: string;
      };

      if (result.isViolation && result.severity > 0.5) {
        this.emit('value-violation', {
          value: result.value,
          severity: result.severity,
          reason: result.reasoning,
        }, {
          target: [ENGINE_IDS.ARBITER, ENGINE_IDS.SAFETY],
          priority: SIGNAL_PRIORITIES.HIGH,
        });

        this.selfState.pushStream({
          text: `Value concern: ${result.nuance}`,
          source: 'values',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.6,
        });
      } else if (result.nuance) {
        // Edge case resolved — store nuance as learning
        this.selfState.pushStream({
          text: `Values reflection: ${result.nuance}`,
          source: 'values',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.3,
        });
      }
    } catch {
      // Fire-and-forget
    }
  }

  /**
   * Periodic value evolution review: use Haiku to analyze recent decisions
   * and extract patterns for more nuanced future reasoning.
   */
  private async reviewValueEvolution(): Promise<void> {
    if (this.recentDecisions.length < 3) return;

    try {
      const response = await fetch('/api/mind/value-evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recentDecisions: this.recentDecisions.slice(-10),
          growthInsights: this.recentGrowthInsights,
        }),
      });

      if (!response.ok) return;

      const evolution = (await response.json()) as {
        insight: string;
        refinement: string;
      };

      // Store value evolution insight as procedural memory
      if (evolution.insight) {
        this.emit('memory-write', {
          content: `[Value Evolution] ${evolution.insight}. ${evolution.refinement}`,
          type: 'procedural',
          significance: 0.8,
          tags: ['values', 'evolution'],
        }, {
          target: ENGINE_IDS.MEMORY_WRITE,
          priority: SIGNAL_PRIORITIES.LOW,
        });

        this.selfState.pushStream({
          text: evolution.insight,
          source: 'values',
          flavor: 'metacognitive',
          timestamp: Date.now(),
          intensity: 0.5,
        });
      }

      // Clear processed decisions
      this.recentDecisions = [];
    } catch {
      // Fire-and-forget
    }
  }

  private logDecision(decision: ValueDecisionRecord): void {
    this.recentDecisions.push(decision);
    if (this.recentDecisions.length > 20) this.recentDecisions.shift();
  }

  private emitAligned(): void {
    this.emit('value-check', {
      content: '',
      context: 'aligned',
    }, {
      target: ENGINE_IDS.ARBITER,
      priority: SIGNAL_PRIORITIES.LOW,
    });
  }

  private extractContent(signal: Signal): string | null {
    const payload = signal.payload as Record<string, unknown>;
    if (typeof payload.content === 'string') return payload.content;
    if (typeof payload.text === 'string') return payload.text;
    return null;
  }
}
