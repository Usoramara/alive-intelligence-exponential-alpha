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

interface Prediction {
  topic: string;
  prediction: string;
  confidence: number;
  createdAt: number;
  validated?: boolean;
  predictionEmbedding?: number[];
}

interface MentalModel {
  beliefs: Map<string, { value: string; confidence: number; updatedAt: number }>;
  desires: Map<string, { value: string; intensity: number; updatedAt: number }>;
  emotions: Map<string, { value: number; updatedAt: number }>;
  predictions: Prediction[];
  observations: Array<{ content: string; timestamp: number; embedding?: number[] }>;
  communicationStyle: string | null;
  topicsOfInterest: string[];
}

const SEMANTIC_VALIDATION_THRESHOLD = 0.5;  // Cosine similarity for prediction validation
const BELIEF_REVISION_THRESHOLD = 0.25;      // Below this → trigger deep belief revision

export class TomEngine extends Engine {
  private lastInference: TomInference | null = null;
  private lastInferenceTime = 0;
  private pendingContent: string | null = null;

  // Enhanced mental model
  private model: MentalModel = {
    beliefs: new Map(),
    desires: new Map(),
    emotions: new Map(),
    predictions: [],
    observations: [],
    communicationStyle: null,
    topicsOfInterest: [],
  };

  // Prediction tracking
  private predictionAccuracy = 0.5;

  // T1 synthesis timing
  private lastSynthesis = 0;
  private synthesisCooldown = 5000; // 5s between periodic syntheses

  // T2 belief revision
  private lastBeliefRevision = 0;
  private beliefRevisionCooldown = 30000; // 30s between deep revisions
  private pendingRevisionReason: string | null = null;

  constructor() {
    super(ENGINE_IDS.TOM);
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'person-state-update', 'visual-description', 'memory-result', 'emotion-detected'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        this.pendingContent = bound.content;

        // T0: Accumulate observation with embedding
        this.addObservation(bound.content);

        // Semantic prediction validation
        this.validatePredictionsSemantic(bound.content);
      } else if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        for (const emotion of emotions.emotions) {
          this.model.emotions.set(emotion, { value: emotions.valence, updatedAt: Date.now() });
        }
      }
    }

    // T1: Rate-limited inference
    const now = Date.now();
    if (this.pendingContent && now - this.lastInferenceTime > 3000) {
      this.infer(this.pendingContent);
      this.pendingContent = null;
    }

    // T1: Periodic synthesis of observations into model
    if (now - this.lastSynthesis > this.synthesisCooldown && this.model.observations.length > 3) {
      this.synthesizeObservations();
    }

    // T2: Deep belief revision if triggered
    if (this.pendingRevisionReason && now - this.lastBeliefRevision > this.beliefRevisionCooldown) {
      this.triggerBeliefRevision(this.pendingRevisionReason);
      this.pendingRevisionReason = null;
    }

    this.status = 'idle';
  }

  /**
   * T0: Add observation with embedding for semantic operations.
   */
  private async addObservation(content: string): Promise<void> {
    const observation: MentalModel['observations'][0] = {
      content,
      timestamp: Date.now(),
    };

    // Embed for semantic matching (non-blocking)
    if (isEmbeddingReady()) {
      const emb = await embed(content);
      if (emb) observation.embedding = emb;
    }

    this.model.observations.push(observation);
    if (this.model.observations.length > 30) this.model.observations.shift();
  }

  /**
   * Semantic prediction validation using cosine similarity.
   * Replaces word-overlap matching with genuine semantic understanding.
   */
  private async validatePredictionsSemantic(actualContent: string): Promise<void> {
    const now = Date.now();
    const recentPredictions = this.model.predictions.filter(
      p => !p.validated && now - p.createdAt < 60000,
    );

    if (recentPredictions.length === 0) return;

    // Embed actual content
    let actualEmbedding: number[] | null = null;
    if (isEmbeddingReady()) {
      actualEmbedding = await embed(actualContent);
    }

    for (const pred of recentPredictions) {
      let similarity = 0;

      if (actualEmbedding && pred.predictionEmbedding) {
        // Semantic similarity between prediction and actual behavior
        similarity = cosineSimilarity(pred.predictionEmbedding, actualEmbedding);
      } else {
        // Fallback: embed prediction topic and compare
        if (actualEmbedding && isEmbeddingReady()) {
          const predEmb = await embed(pred.prediction);
          if (predEmb) {
            similarity = cosineSimilarity(predEmb, actualEmbedding);
            pred.predictionEmbedding = predEmb; // Cache for future
          }
        }
      }

      if (similarity >= SEMANTIC_VALIDATION_THRESHOLD) {
        // Prediction validated semantically
        pred.validated = true;
        this.predictionAccuracy = this.predictionAccuracy * 0.8 + 0.2;
        this.selfState.nudge('confidence', 0.05);

        this.emit('prediction-validated', {
          prediction: pred.prediction,
          topic: pred.topic,
          accuracy: this.predictionAccuracy,
        }, {
          target: [ENGINE_IDS.ARBITER, ENGINE_IDS.PERSPECTIVE],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.selfState.pushStream({
          text: `My sense about "${pred.topic}" was right... I'm beginning to understand their patterns.`,
          source: 'tom',
          flavor: 'curiosity',
          timestamp: now,
          intensity: 0.6,
        });
      } else if (similarity < BELIEF_REVISION_THRESHOLD && now - pred.createdAt > 15000) {
        // Prediction failed significantly → trigger belief revision
        pred.validated = false;
        this.predictionAccuracy = this.predictionAccuracy * 0.9;
        this.selfState.nudge('confidence', -0.03);

        this.emit('prediction-error', {
          surpriseLevel: 1 - similarity,
          expected: pred.prediction,
          actual: actualContent.slice(0, 100),
        }, {
          target: [ENGINE_IDS.METACOGNITION, ENGINE_IDS.ARBITER],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        // Queue belief revision
        this.pendingRevisionReason = `Prediction "${pred.prediction}" failed. They actually said: "${actualContent.slice(0, 80)}". Similarity was only ${similarity.toFixed(2)}.`;
      }
    }

    // Clean up old predictions
    this.model.predictions = this.model.predictions.filter(
      p => now - p.createdAt < 120000,
    );
  }

  /**
   * T1: Haiku inference for thinking/feeling/wanting.
   */
  private async infer(content: string): Promise<void> {
    this.status = 'waiting';
    this.lastInferenceTime = Date.now();

    const recentObs = this.model.observations.slice(-5).map(o => o.content).join(' | ');
    const currentEmotions = [...this.model.emotions.entries()]
      .map(([k, v]) => `${k}: ${v.value.toFixed(1)}`)
      .join(', ');

    // Include communication style and topics if known
    const modelContext: string[] = [];
    if (this.model.communicationStyle) {
      modelContext.push(`Communication style: ${this.model.communicationStyle}`);
    }
    if (this.model.topicsOfInterest.length > 0) {
      modelContext.push(`Topics of interest: ${this.model.topicsOfInterest.join(', ')}`);
    }

    try {
      const response = await fetch('/api/mind/tom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          recentObservations: recentObs,
          currentEmotions: currentEmotions || undefined,
          existingBeliefs: Object.fromEntries(
            [...this.model.beliefs.entries()].map(([k, v]) => [k, v.value]),
          ),
          modelContext: modelContext.length > 0 ? modelContext.join('\n') : undefined,
        }),
      });

      if (!response.ok) return;

      const result = await response.json() as {
        thinking: string;
        feeling: string;
        wanting: string;
        confidence: number;
        beliefUpdates?: Record<string, string>;
        desireUpdates?: Record<string, string>;
        prediction?: { topic: string; prediction: string };
      };

      this.lastInference = {
        thinking: result.thinking,
        feeling: result.feeling,
        wanting: result.wanting,
        confidence: result.confidence,
      };

      // Update mental model
      if (result.beliefUpdates) {
        for (const [key, value] of Object.entries(result.beliefUpdates)) {
          this.model.beliefs.set(key, { value, confidence: result.confidence, updatedAt: Date.now() });
        }
      }
      if (result.desireUpdates) {
        for (const [key, value] of Object.entries(result.desireUpdates)) {
          this.model.desires.set(key, { value, intensity: 0.6, updatedAt: Date.now() });
        }
      }

      // Store prediction with pre-computed embedding
      if (result.prediction) {
        const pred: Prediction = {
          ...result.prediction,
          confidence: result.confidence,
          createdAt: Date.now(),
        };

        // Pre-embed prediction for semantic validation later
        if (isEmbeddingReady()) {
          const predEmb = await embed(result.prediction.prediction);
          if (predEmb) pred.predictionEmbedding = predEmb;
        }

        this.model.predictions.push(pred);
      }

      // Emit model update signal
      this.emit('tom-inference', {
        ...this.lastInference,
        theyFeel: result.feeling,
        theyWant: result.wanting,
        theyBelieve: result.thinking,
      }, {
        target: [ENGINE_IDS.PERSPECTIVE, ENGINE_IDS.ARBITER],
        priority: SIGNAL_PRIORITIES.MEDIUM,
      });

      this.emit('tom-model-update', {
        beliefs: Object.fromEntries(this.model.beliefs),
        emotions: Object.fromEntries(this.model.emotions),
        predictionAccuracy: this.predictionAccuracy,
      }, {
        priority: SIGNAL_PRIORITIES.LOW,
      });

      this.selfState.nudge('curiosity', 0.03);
      this.debugInfo = `ToM: "${result.thinking.slice(0, 30)}..." (acc:${(this.predictionAccuracy * 100).toFixed(0)}%)`;
    } catch (err) {
      this.debugInfo = `ToM error: ${err}`;
    }

    this.status = 'idle';
  }

  /**
   * T1: Periodic synthesis of recent observations into mental model updates.
   * Extracts communication style, topics of interest, and patterns.
   */
  private async synthesizeObservations(): Promise<void> {
    this.lastSynthesis = Date.now();

    const recentObs = this.model.observations.slice(-8);
    if (recentObs.length < 3) return;

    // Extract communication patterns from observations
    const contents = recentObs.map(o => o.content);

    // Detect topics of interest (via embedding clustering)
    if (isEmbeddingReady() && recentObs.some(o => o.embedding)) {
      const withEmbeddings = recentObs.filter(o => o.embedding) as Array<{
        content: string;
        embedding: number[];
      }>;

      if (withEmbeddings.length >= 3) {
        // Find recurring themes by looking at pairwise similarity
        const themes: string[] = [];
        for (let i = 0; i < withEmbeddings.length; i++) {
          for (let j = i + 1; j < withEmbeddings.length; j++) {
            const sim = cosineSimilarity(withEmbeddings[i].embedding, withEmbeddings[j].embedding);
            if (sim > 0.6) {
              // These observations are thematically related
              const shorter = withEmbeddings[i].content.length < withEmbeddings[j].content.length
                ? withEmbeddings[i].content
                : withEmbeddings[j].content;
              themes.push(shorter.slice(0, 50));
            }
          }
        }

        if (themes.length > 0) {
          this.model.topicsOfInterest = [...new Set(themes)].slice(0, 5);
        }
      }
    }
  }

  /**
   * T2: Deep belief revision via Sonnet when predictions fail significantly.
   * Analyzes WHY the prediction failed and updates the mental model accordingly.
   */
  private async triggerBeliefRevision(reason: string): Promise<void> {
    this.lastBeliefRevision = Date.now();

    try {
      // Use the reflect endpoint with deep revision context
      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `BELIEF REVISION NEEDED:\n${reason}\n\nCurrent beliefs: ${JSON.stringify(Object.fromEntries(this.model.beliefs))}\n\nWhat should I update about my understanding of this person?`,
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const revisionThought = data.thought ?? data.thoughts?.[0]?.text;

      if (revisionThought) {
        this.selfState.pushStream({
          text: `My understanding was off... ${revisionThought.slice(0, 80)}`,
          source: 'tom',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.7,
        });

        this.selfState.nudge('curiosity', 0.05);
        this.debugInfo = `Belief revision: ${revisionThought.slice(0, 40)}`;
      }
    } catch {
      // Non-critical
    }
  }
}
