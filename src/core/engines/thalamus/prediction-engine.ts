import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface Prediction {
  topic: string;
  prediction: string;
  confidence: number;
  createdAt: number;
  validated?: boolean;
}

export class PredictionEngine extends Engine {
  private predictions: Prediction[] = [];
  private predictionAccuracy = 0.5; // Rolling accuracy
  private lastPredictionTime = 0;
  private readonly PREDICTION_COOLDOWN = 5000;
  private readonly MAX_PREDICTIONS = 10;

  // Topic history for prediction generation
  private topicHistory: string[] = [];
  private emotionHistory: number[] = [];

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
        this.validatePredictions(bound.content, now);

        // Track topics
        const words = bound.content.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        this.topicHistory.push(...words.slice(0, 3));
        if (this.topicHistory.length > 30) this.topicHistory = this.topicHistory.slice(-30);
      }

      if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        this.emotionHistory.push(emotions.valence);
        if (this.emotionHistory.length > 20) this.emotionHistory.shift();
      }

      if (isSignal(signal, 'discourse-state')) {
        const discourse = signal.payload;
        if (discourse.currentTopic && now - this.lastPredictionTime > this.PREDICTION_COOLDOWN) {
          this.generateTopicPrediction(discourse.currentTopic, now);
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

  private generateTopicPrediction(currentTopic: string, now: number): void {
    this.lastPredictionTime = now;

    // Look for recurring topics in history
    const topicCounts = new Map<string, number>();
    for (const word of this.topicHistory) {
      topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
    }

    // Find most-repeated topic that isn't the current one
    let predictedTopic = '';
    let maxCount = 0;
    const currentWords = new Set(currentTopic.toLowerCase().split(/\s+/));
    for (const [word, count] of topicCounts) {
      if (count > maxCount && !currentWords.has(word)) {
        predictedTopic = word;
        maxCount = count;
      }
    }

    if (predictedTopic && maxCount > 2) {
      this.addPrediction({
        topic: predictedTopic,
        prediction: `They may return to the topic of "${predictedTopic}"`,
        confidence: Math.min(0.8, maxCount * 0.1),
        createdAt: now,
      });
    }
  }

  private generateEmotionalPrediction(tom: { theyFeel: string; theyWant: string; confidence: number }, now: number): void {
    this.lastPredictionTime = now;

    // Predict emotional trajectory from history
    if (this.emotionHistory.length >= 3) {
      const recent = this.emotionHistory.slice(-3);
      const trend = recent[2] - recent[0];

      if (Math.abs(trend) > 0.2) {
        const direction = trend > 0 ? 'more positive' : 'more negative';
        this.addPrediction({
          topic: 'emotional-shift',
          prediction: `Their emotional state is trending ${direction}`,
          confidence: Math.min(0.7, Math.abs(trend)),
          createdAt: now,
        });
      }
    }
  }

  private addPrediction(pred: Prediction): void {
    if (this.predictions.length >= this.MAX_PREDICTIONS) {
      // Remove oldest unvalidated
      const idx = this.predictions.findIndex(p => !p.validated);
      if (idx >= 0) this.predictions.splice(idx, 1);
    }

    this.predictions.push(pred);

    // Push prediction to consciousness stream
    this.selfState.pushStream({
      text: pred.prediction,
      source: 'prediction',
      flavor: 'curiosity',
      timestamp: pred.createdAt,
      intensity: pred.confidence * 0.7,
    });
  }

  private validatePredictions(content: string, now: number): void {
    const contentLower = content.toLowerCase();

    for (const pred of this.predictions) {
      if (pred.validated !== undefined) continue;
      if (now - pred.createdAt > 30000) {
        pred.validated = false;
        this.predictionAccuracy = this.predictionAccuracy * 0.9;
        continue;
      }

      // Check topic word overlap
      const topicWords = pred.topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const matches = topicWords.filter(w => contentLower.includes(w)).length;
      const overlap = topicWords.length > 0 ? matches / topicWords.length : 0;

      if (overlap > 0.3) {
        pred.validated = true;
        this.predictionAccuracy = this.predictionAccuracy * 0.8 + 0.2;

        // Surprise is LOW (prediction confirmed)
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

    // Check for surprise (no predictions matched at all)
    const activePredictions = this.predictions.filter(p => p.validated === undefined);
    if (activePredictions.length > 0) {
      const anyMatch = activePredictions.some(p => {
        const words = p.topic.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        return words.some(w => contentLower.includes(w));
      });

      if (!anyMatch && content.length > 20) {
        // Surprise! Nothing predicted this
        const surpriseLevel = 0.6 + activePredictions.length * 0.1;

        this.emit('prediction-error', {
          surpriseLevel: Math.min(1, surpriseLevel),
          content: content.slice(0, 50),
          activePredictions: activePredictions.length,
        }, {
          target: [ENGINE_IDS.METACOGNITION, ENGINE_IDS.ATTENTION],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.selfState.nudge('arousal', 0.03);
        this.selfState.nudge('curiosity', 0.05);

        this.selfState.pushStream({
          text: "Oh! I didn't expect that...",
          source: 'prediction',
          flavor: 'curiosity',
          timestamp: now,
          intensity: Math.min(1, surpriseLevel),
        });
      }
    }
  }
}
