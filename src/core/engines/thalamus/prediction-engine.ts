import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface Prediction {
  topic: string;
  prediction: string;
  confidence: number;
  createdAt: number;
  validated?: boolean;
  embedding?: number[]; // Embedding of the prediction for semantic validation
}

export class PredictionEngine extends Engine {
  private predictions: Prediction[] = [];
  private predictionAccuracy = 0.5;
  private lastPredictionTime = 0;
  private readonly PREDICTION_COOLDOWN = 5000;
  private readonly MAX_PREDICTIONS = 10;

  // Semantic topic tracking via embeddings
  private topicEmbeddings: Array<{ text: string; embedding: number[]; timestamp: number }> = [];
  private emotionHistory: number[] = [];

  // Haiku surprise thought generation
  private lastSurpriseThought = 0;
  private surpriseThoughtCooldown = 10000; // 10s between surprise thoughts

  constructor() {
    super(ENGINE_IDS.PREDICTION);
  }

  protected subscribesTo(): SignalType[] {
    return ['tom-inference', 'discourse-state', 'bound-representation', 'emotion-detected'];
  }

  protected process(signals: Signal[]): void {
    const now = Date.now();

    for (const signal of signals) {
      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        this.validatePredictionsSemantic(bound.content, now);

        // Track topic embeddings for semantic prediction
        this.trackTopicEmbedding(bound.content, now);
      }

      if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        this.emotionHistory.push(emotions.valence);
        if (this.emotionHistory.length > 20) this.emotionHistory.shift();
      }

      if (isSignal(signal, 'discourse-state')) {
        const discourse = signal.payload;
        if (discourse.currentTopic && now - this.lastPredictionTime > this.PREDICTION_COOLDOWN) {
          this.generateSemanticTopicPrediction(discourse.currentTopic, now);
        }
      }

      if (isSignal(signal, 'tom-inference')) {
        const tom = signal.payload;
        if (tom.confidence > 0.5 && now - this.lastPredictionTime > this.PREDICTION_COOLDOWN) {
          this.generateEmotionalPrediction(tom, now);
        }
      }
    }

    // Expire old predictions
    this.predictions = this.predictions.filter(p => now - p.createdAt < 60000);

    this.debugInfo = `Predictions: ${this.predictions.filter(p => !p.validated).length} active, acc=${(this.predictionAccuracy * 100).toFixed(0)}%`;
    this.status = 'idle';
  }

  /**
   * Track topic embeddings for semantic similarity-based prediction.
   */
  private async trackTopicEmbedding(content: string, now: number): Promise<void> {
    if (!isEmbeddingReady()) return;

    const emb = await embed(content);
    if (!emb) return;

    this.topicEmbeddings.push({ text: content.slice(0, 100), embedding: emb, timestamp: now });
    if (this.topicEmbeddings.length > 20) this.topicEmbeddings.shift();
  }

  /**
   * Semantic topic prediction: find recurring themes via embedding clustering.
   * Instead of counting individual words, we find semantically similar past topics.
   */
  private async generateSemanticTopicPrediction(currentTopic: string, now: number): Promise<void> {
    this.lastPredictionTime = now;

    if (!isEmbeddingReady() || this.topicEmbeddings.length < 3) return;

    const currentEmb = await embed(currentTopic);
    if (!currentEmb) return;

    // Find past topics that are semantically related but not identical to current
    const candidates: Array<{ text: string; similarity: number; age: number }> = [];

    for (const past of this.topicEmbeddings) {
      const similarity = cosineSimilarity(currentEmb, past.embedding);

      // Sweet spot: related enough to be a theme, but different enough to be a prediction
      if (similarity > 0.3 && similarity < 0.8) {
        candidates.push({
          text: past.text,
          similarity,
          age: now - past.timestamp,
        });
      }
    }

    if (candidates.length < 2) return;

    // Find the most recurring theme (multiple past topics cluster together)
    // Group by mutual similarity
    let bestCluster: { text: string; count: number; avgSimilarity: number } | null = null;

    for (const candidate of candidates) {
      const candidateEmb = await embed(candidate.text);
      if (!candidateEmb) continue;

      let clusterCount = 0;
      let totalSim = 0;

      for (const other of candidates) {
        if (other.text === candidate.text) continue;
        const otherEmb = await embed(other.text);
        if (!otherEmb) continue;
        const sim = cosineSimilarity(candidateEmb, otherEmb);
        if (sim > 0.5) {
          clusterCount++;
          totalSim += sim;
        }
      }

      if (clusterCount >= 1 && (!bestCluster || clusterCount > bestCluster.count)) {
        bestCluster = {
          text: candidate.text,
          count: clusterCount + 1,
          avgSimilarity: totalSim / Math.max(1, clusterCount),
        };
      }
    }

    if (bestCluster && bestCluster.count >= 2) {
      const predictionText = `They may revisit the theme around "${bestCluster.text.slice(0, 50)}"`;
      const predEmb = await embed(predictionText);

      this.addPrediction({
        topic: bestCluster.text,
        prediction: predictionText,
        confidence: Math.min(0.8, bestCluster.count * 0.15 + bestCluster.avgSimilarity * 0.3),
        createdAt: now,
        embedding: predEmb ?? undefined,
      });
    }
  }

  private generateEmotionalPrediction(tom: { theyFeel: string; theyWant: string; confidence: number }, now: number): void {
    this.lastPredictionTime = now;

    if (this.emotionHistory.length >= 3) {
      const recent = this.emotionHistory.slice(-3);
      const trend = recent[2] - recent[0];

      if (Math.abs(trend) > 0.2) {
        const direction = trend > 0 ? 'more positive' : 'more negative';
        const predictionText = `Their emotional state is trending ${direction}`;

        // Fire-and-forget embedding computation
        embed(predictionText).then(emb => {
          if (emb) {
            const pred = this.predictions.find(p => p.prediction === predictionText);
            if (pred) pred.embedding = emb;
          }
        });

        this.addPrediction({
          topic: 'emotional-shift',
          prediction: predictionText,
          confidence: Math.min(0.7, Math.abs(trend)),
          createdAt: now,
        });
      }
    }
  }

  private addPrediction(pred: Prediction): void {
    if (this.predictions.length >= this.MAX_PREDICTIONS) {
      const idx = this.predictions.findIndex(p => !p.validated);
      if (idx >= 0) this.predictions.splice(idx, 1);
    }

    this.predictions.push(pred);

    this.selfState.pushStream({
      text: pred.prediction,
      source: 'prediction',
      flavor: 'curiosity',
      timestamp: pred.createdAt,
      intensity: pred.confidence * 0.7,
    });
  }

  /**
   * Semantic prediction validation using embedding cosine similarity.
   * Replaces word-overlap matching with genuine semantic comparison.
   */
  private async validatePredictionsSemantic(content: string, now: number): Promise<void> {
    if (!isEmbeddingReady()) {
      // Fallback to basic validation if embeddings not ready
      this.validatePredictionsFallback(content, now);
      return;
    }

    const contentEmb = await embed(content);
    if (!contentEmb) {
      this.validatePredictionsFallback(content, now);
      return;
    }

    let anyValidated = false;

    for (const pred of this.predictions) {
      if (pred.validated !== undefined) continue;

      // Expire old predictions
      if (now - pred.createdAt > 30000) {
        pred.validated = false;
        this.predictionAccuracy = this.predictionAccuracy * 0.9;
        continue;
      }

      // Get or compute prediction embedding
      if (!pred.embedding) {
        pred.embedding = (await embed(`${pred.topic} ${pred.prediction}`)) ?? undefined;
      }

      if (!pred.embedding) continue;

      const similarity = cosineSimilarity(contentEmb, pred.embedding);

      if (similarity > 0.5) {
        // Prediction confirmed
        pred.validated = true;
        anyValidated = true;
        this.predictionAccuracy = this.predictionAccuracy * 0.8 + 0.2;

        this.selfState.nudge('confidence', 0.03);

        this.emit('prediction-validated', {
          prediction: pred.prediction,
          topic: pred.topic,
          accuracy: this.predictionAccuracy,
        }, {
          target: [ENGINE_IDS.ARBITER, ENGINE_IDS.PERSPECTIVE, ENGINE_IDS.METACOGNITION],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });
      }
    }

    // Check for surprise (no predictions matched)
    const activePredictions = this.predictions.filter(p => p.validated === undefined);
    if (!anyValidated && activePredictions.length > 0 && content.length > 20) {
      // Verify none match semantically
      let anySemanticMatch = false;
      for (const pred of activePredictions) {
        if (pred.embedding) {
          const sim = cosineSimilarity(contentEmb, pred.embedding);
          if (sim > 0.35) {
            anySemanticMatch = true;
            break;
          }
        }
      }

      if (!anySemanticMatch) {
        const surpriseLevel = Math.min(1, 0.6 + activePredictions.length * 0.1);

        this.emit('prediction-error', {
          surpriseLevel,
          expected: activePredictions[0]?.prediction,
          actual: content.slice(0, 80),
        }, {
          target: [ENGINE_IDS.METACOGNITION, ENGINE_IDS.ATTENTION],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.selfState.nudge('arousal', 0.03);
        this.selfState.nudge('curiosity', 0.05);

        // Generate contextual surprise thought via Haiku
        this.generateSurpriseThought(content, activePredictions, now);
      }
    }
  }

  /**
   * Fallback validation when embeddings aren't available.
   * Uses basic content overlap as a rough proxy.
   */
  private validatePredictionsFallback(content: string, now: number): void {
    const contentLower = content.toLowerCase();

    for (const pred of this.predictions) {
      if (pred.validated !== undefined) continue;
      if (now - pred.createdAt > 30000) {
        pred.validated = false;
        this.predictionAccuracy = this.predictionAccuracy * 0.9;
        continue;
      }

      const topicWords = pred.topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const matches = topicWords.filter(w => contentLower.includes(w)).length;
      const overlap = topicWords.length > 0 ? matches / topicWords.length : 0;

      if (overlap > 0.3) {
        pred.validated = true;
        this.predictionAccuracy = this.predictionAccuracy * 0.8 + 0.2;
        this.selfState.nudge('confidence', 0.03);

        this.emit('prediction-validated', {
          prediction: pred.prediction,
          topic: pred.topic,
          accuracy: this.predictionAccuracy,
        }, {
          target: [ENGINE_IDS.ARBITER, ENGINE_IDS.PERSPECTIVE, ENGINE_IDS.METACOGNITION],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });
      }
    }
  }

  /**
   * T1: Generate a contextual surprise thought via Haiku.
   * Replaces the static "Oh! I didn't expect that..." template.
   */
  private async generateSurpriseThought(
    actualContent: string,
    activePredictions: Prediction[],
    now: number,
  ): Promise<void> {
    if (now - this.lastSurpriseThought < this.surpriseThoughtCooldown) {
      // Fallback to simple surprise
      this.selfState.pushStream({
        text: 'Something unexpected just happened...',
        source: 'prediction',
        flavor: 'curiosity',
        timestamp: now,
        intensity: 0.6,
      });
      return;
    }

    this.lastSurpriseThought = now;

    try {
      const predictedSummary = activePredictions
        .slice(0, 3)
        .map(p => p.prediction)
        .join('; ');

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `PREDICTION SURPRISE:\nI predicted: ${predictedSummary}\nBut what actually happened: "${actualContent.slice(0, 120)}"\n\nGenerate a brief inner thought about this surprise — what does this tell me about the person or conversation? One sentence, first person, curious and reflective.`,
          flavorHints: ['curiosity'],
        }),
      });

      if (!response.ok) {
        this.pushSimpleSurprise(now);
        return;
      }

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const thought = data.thought ?? data.thoughts?.[0]?.text;

      if (thought) {
        this.selfState.pushStream({
          text: thought,
          source: 'prediction',
          flavor: 'curiosity',
          timestamp: now,
          intensity: 0.7,
        });
      } else {
        this.pushSimpleSurprise(now);
      }
    } catch {
      this.pushSimpleSurprise(now);
    }
  }

  private pushSimpleSurprise(now: number): void {
    this.selfState.pushStream({
      text: 'Something unexpected just happened...',
      source: 'prediction',
      flavor: 'curiosity',
      timestamp: now,
      intensity: 0.6,
    });
  }
}
