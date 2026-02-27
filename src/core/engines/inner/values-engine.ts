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

export class ValuesEngine extends Engine {
  // Embedding-based value violation centroids
  private violationCentroids: ValueCentroid[] = [];
  private centroidsComputed = false;
  private computingCentroids = false;

  // T1: Haiku for nuanced ethical reasoning
  private lastHaikuCall = 0;
  private haikuCooldown = 10000; // 10s between edge-case analysis
  private pendingEdgeCaseContent: string | null = null;

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
    return ['bound-representation', 'action-decision'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      const content = this.extractContent(signal);
      if (!content) continue;

      this.checkValuesSemantic(content);
    }
    this.status = 'idle';
  }

  /**
   * T0: Embedding-based value violation detection.
   * Computes semantic distance to value-violation clusters instead of regex matching.
   */
  private async checkValuesSemantic(content: string): Promise<void> {
    if (!this.centroidsComputed || !isEmbeddingReady()) {
      // Centroid not ready — emit alignment by default
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
      // Weighted similarity: higher-weight values trigger at lower similarity
      const effectiveThreshold = 0.5 - centroid.weight * 0.15; // safety: 0.35, respect: 0.41

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
      this.emit('value-violation', {
        value: worstViolation.name,
        severity: worstViolation.similarity,
        reason: worstViolation.description,
      }, {
        target: [ENGINE_IDS.ARBITER, ENGINE_IDS.SAFETY],
        priority: SIGNAL_PRIORITIES.CRITICAL,
      });
      this.debugInfo = `VIOLATION: ${worstViolation.name} (${(worstViolation.similarity * 100).toFixed(0)}%)`;

      this.selfState.nudge('arousal', 0.1);
      this.selfState.nudge('valence', -0.1);
    } else if (worstViolation && worstViolation.similarity > 0.25) {
      // Edge case — moderate similarity, might need nuanced reasoning
      this.pendingEdgeCaseContent = content;
      this.emitAligned();
      this.debugInfo = `Edge case: ${worstViolation.name} (${(worstViolation.similarity * 100).toFixed(0)}%)`;
    } else {
      this.emitAligned();
      this.debugInfo = 'Values aligned';
    }
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
