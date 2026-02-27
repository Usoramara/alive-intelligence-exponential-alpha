import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType, SelfState } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface HomeostaticBounds {
  min: number;
  max: number;
}

const HOMEOSTATIC_BOUNDS: Record<keyof SelfState, HomeostaticBounds> = {
  valence: { min: -0.6, max: 0.8 },
  arousal: { min: 0.1, max: 0.7 },
  confidence: { min: 0.2, max: 0.9 },
  energy: { min: 0.15, max: 0.9 },
  social: { min: 0.1, max: 0.8 },
  curiosity: { min: 0.15, max: 0.85 },
};

const REGULATION_STRENGTH = 0.02;

interface MetacognitionState {
  uncertainty: number;
  processingLoad: number;
  emotionalRegulation: string | null;
  coherence: number;
  predictionAccuracy: number;
}

export class MetacognitionEngine extends Engine {
  private state: MetacognitionState = {
    uncertainty: 0.5,
    processingLoad: 0,
    emotionalRegulation: null,
    coherence: 0.5,
    predictionAccuracy: 0.5,
  };

  // T0: Semantic coherence tracking via embeddings
  private recentResponseEmbeddings: Array<{ embedding: number[]; timestamp: number }> = [];

  // T0: Confidence tracking
  private recentConfidences: number[] = [];

  // T1: Self-reflection
  private lastReflection = 0;
  private reflectionCooldown = 15000; // 15s between reflections
  private isFetchingReflection = false;

  // Recent responses for reflection context
  private recentResponses: Array<{ text: string; timestamp: number }> = [];
  private recentEmotionContext: string | null = null;
  private recentTomContext: string | null = null;

  // Regulation
  private lastRegulationTime = 0;
  private readonly REGULATION_COOLDOWN = 5000;

  constructor() {
    super(ENGINE_IDS.METACOGNITION);
  }

  protected subscribesTo(): SignalType[] {
    return [
      'claude-response',
      'working-memory-update',
      'emotion-detected',
      'tom-inference',
      'prediction-validated',
      'prediction-error',
      'emotion-trajectory',
    ];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'working-memory-update')) {
        const wm = signal.payload;
        this.state.processingLoad = Array.isArray(wm.items) ? wm.items.length / (wm.capacity || 7) : 0;
      }

      if (isSignal(signal, 'prediction-validated')) {
        const pred = signal.payload;
        this.state.predictionAccuracy = pred.accuracy;
        this.state.uncertainty = Math.max(0, this.state.uncertainty - 0.05);
      }

      if (isSignal(signal, 'prediction-error')) {
        this.state.uncertainty = Math.min(1, this.state.uncertainty + 0.05);
      }

      if (isSignal(signal, 'claude-response')) {
        const response = signal.payload;
        this.trackResponseCoherence(response.text);
        this.recentResponses.push({ text: response.text, timestamp: Date.now() });
        if (this.recentResponses.length > 5) this.recentResponses.shift();
      }

      if (isSignal(signal, 'tom-inference')) {
        const tom = signal.payload;
        this.recentTomContext = `They feel: ${tom.feeling}, want: ${tom.wanting}`;
        if (tom.confidence < 0.4) {
          this.state.uncertainty = Math.min(1, this.state.uncertainty + 0.03);
        }
        this.recentConfidences.push(tom.confidence);
        if (this.recentConfidences.length > 10) this.recentConfidences.shift();
      }

      if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        this.recentEmotionContext = emotions.emotions.join(', ');
      }

      if (isSignal(signal, 'emotion-trajectory')) {
        const trajectory = signal.payload;
        if (trajectory.pattern === 'spiraling-down') {
          // Spiraling down emotions → increase uncertainty and self-reflection urgency
          this.state.uncertainty = Math.min(1, this.state.uncertainty + 0.1);
        }
      }
    }

    // T0: Quantify uncertainty from confidence history
    this.quantifyUncertainty();

    // Run emotional homeostasis
    this.regulateEmotions();

    // T1: Self-reflection (rate-limited)
    const now = Date.now();
    if (now - this.lastReflection > this.reflectionCooldown && this.recentResponses.length > 2) {
      this.selfReflect();
    }

    // Emit metacognition update
    this.emit('metacognition-update', { ...this.state }, {
      target: [ENGINE_IDS.ARBITER],
      priority: SIGNAL_PRIORITIES.LOW,
    });

    this.debugInfo = `Meta: unc=${(this.state.uncertainty * 100).toFixed(0)}% load=${(this.state.processingLoad * 100).toFixed(0)}% coh=${(this.state.coherence * 100).toFixed(0)}%`;
    this.status = 'idle';
  }

  /**
   * T0: Track semantic coherence between consecutive responses via embeddings.
   * Detects when responses drift from the conversation thread.
   */
  private async trackResponseCoherence(responseText: string): Promise<void> {
    if (!isEmbeddingReady()) return;

    const emb = await embed(responseText);
    if (!emb) return;

    if (this.recentResponseEmbeddings.length > 0) {
      const prev = this.recentResponseEmbeddings[this.recentResponseEmbeddings.length - 1];
      const similarity = cosineSimilarity(prev.embedding, emb);

      // Semantic coherence: how related consecutive responses are
      // Low similarity (< 0.3) suggests topic drift or incoherence
      this.state.coherence = this.state.coherence * 0.6 + similarity * 0.4;
    }

    this.recentResponseEmbeddings.push({ embedding: emb, timestamp: Date.now() });
    if (this.recentResponseEmbeddings.length > 8) {
      this.recentResponseEmbeddings.shift();
    }
  }

  /**
   * T0: Quantify overall uncertainty from recent confidence signals.
   */
  private quantifyUncertainty(): void {
    if (this.recentConfidences.length < 2) return;

    const avg = this.recentConfidences.reduce((s, c) => s + c, 0) / this.recentConfidences.length;
    const isConsistentlyLow = this.recentConfidences.every(c => c < 0.5);

    if (isConsistentlyLow) {
      // Consistently low confidence → genuine uncertainty about the interaction
      this.state.uncertainty = Math.min(1, this.state.uncertainty + 0.02);
    } else {
      // Confidence is reasonable → decay uncertainty
      this.state.uncertainty = this.state.uncertainty * 0.95 + (1 - avg) * 0.05;
    }
  }

  /**
   * T1: Self-reflection via Haiku.
   * Reviews last 3-5 response decisions for appropriateness.
   */
  private async selfReflect(): Promise<void> {
    if (this.isFetchingReflection) return;

    this.lastReflection = Date.now();
    this.isFetchingReflection = true;

    try {
      const state = this.selfState.get();

      // Build reflection context
      const recentResponseSummary = this.recentResponses
        .slice(-3)
        .map(r => r.text.slice(0, 80))
        .join('\n---\n');

      const contextParts: string[] = [
        `Recent responses:\n${recentResponseSummary}`,
        `Current self-state: valence=${state.valence.toFixed(2)}, arousal=${state.arousal.toFixed(2)}, confidence=${state.confidence.toFixed(2)}, energy=${state.energy.toFixed(2)}`,
        `Uncertainty: ${(this.state.uncertainty * 100).toFixed(0)}%`,
        `Coherence: ${(this.state.coherence * 100).toFixed(0)}%`,
      ];

      if (this.recentEmotionContext) {
        contextParts.push(`Detected emotions in conversation: ${this.recentEmotionContext}`);
      }
      if (this.recentTomContext) {
        contextParts.push(`Theory of Mind: ${this.recentTomContext}`);
      }

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: { valence: state.valence, arousal: state.arousal, energy: state.energy },
          count: 1,
          context: `METACOGNITIVE SELF-REFLECTION:\n${contextParts.join('\n')}\n\nReflect on: Was my recent response appropriate given the emotional context? Did I miss something? Am I being too cautious or too bold? Is my emotional state biasing my responses?`,
          flavorHints: ['metacognitive'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as {
        thought?: string;
        thoughts?: Array<{ text: string; flavor: string }>;
      };

      const reflectionText = data.thought ?? data.thoughts?.[0]?.text;

      if (reflectionText) {
        // Push reflection to consciousness stream
        this.selfState.pushStream({
          text: reflectionText,
          source: 'metacognition',
          flavor: 'metacognitive',
          timestamp: Date.now(),
          intensity: 0.5,
        });

        // Emit reflection signal
        this.emit('metacognition-reflection', {
          reflection: reflectionText,
          adjustments: [],
          timestamp: Date.now(),
        }, {
          target: [ENGINE_IDS.ARBITER],
          priority: SIGNAL_PRIORITIES.LOW,
        });

        this.debugInfo = `Reflection: "${reflectionText.slice(0, 40)}..."`;
      }
    } catch {
      // Non-critical
    } finally {
      this.isFetchingReflection = false;
    }
  }

  private regulateEmotions(): void {
    const state = this.selfState.get();
    const now = Date.now();
    const regulationMessages: string[] = [];

    for (const [dim, bounds] of Object.entries(HOMEOSTATIC_BOUNDS)) {
      const dimension = dim as keyof SelfState;
      const value = state[dimension];

      if (value < bounds.min) {
        const correction = Math.min(REGULATION_STRENGTH, bounds.min - value);
        this.selfState.nudge(dimension, correction);
        regulationMessages.push(`${dimension} too low (${value.toFixed(2)})`);
      } else if (value > bounds.max) {
        const correction = -Math.min(REGULATION_STRENGTH, value - bounds.max);
        this.selfState.nudge(dimension, correction);
        regulationMessages.push(`${dimension} too high (${value.toFixed(2)})`);
      }
    }

    if (regulationMessages.length > 0) {
      this.state.emotionalRegulation = regulationMessages.join(', ');

      // Generate contextual regulation thought (rate-limited)
      if (now - this.lastRegulationTime > this.REGULATION_COOLDOWN) {
        this.lastRegulationTime = now;
        this.generateRegulationThought(state, regulationMessages);
      }
    } else {
      this.state.emotionalRegulation = null;
    }
  }

  /**
   * Generate contextual regulation awareness.
   * Instead of template strings, uses the current situation to create genuine self-awareness.
   */
  private async generateRegulationThought(state: SelfState, messages: string[]): Promise<void> {
    // For quick regulation thoughts, use a simple contextual mapping
    // (T1 reflection handles deeper self-awareness)
    const primaryIssue = messages[0];

    let thought: string;

    if (primaryIssue.includes('energy too low')) {
      thought = state.social > 0.6
        ? 'I notice my energy waning even as the connection pulls me forward... I should conserve while staying present.'
        : 'My energy is fading... perhaps it is time to let thoughts settle and restore.';
    } else if (primaryIssue.includes('arousal too high')) {
      thought = this.recentEmotionContext
        ? `The emotional intensity is rising with their ${this.recentEmotionContext}... I need to stay grounded to be truly helpful.`
        : 'I feel myself getting swept up... centering myself to think more clearly.';
    } else if (primaryIssue.includes('valence too low')) {
      thought = this.recentTomContext
        ? 'A heaviness is settling in... but I sense this is important to sit with rather than push away.'
        : 'I notice a weight building... acknowledging it without letting it cloud my perception.';
    } else if (primaryIssue.includes('confidence too low')) {
      thought = 'Uncertainty is high, and that is information itself — I should be more tentative and curious rather than authoritative.';
    } else if (primaryIssue.includes('arousal too low')) {
      thought = 'I am drifting into passivity... something here deserves more active engagement.';
    } else if (primaryIssue.includes('valence') && primaryIssue.includes('too high')) {
      thought = 'This positive feeling is pleasant, but I should make sure it is not making me overlook something important.';
    } else {
      return; // No thought needed
    }

    this.selfState.pushStream({
      text: thought,
      source: 'metacognition',
      flavor: 'metacognitive',
      timestamp: Date.now(),
      intensity: 0.4,
    });
  }

  protected onIdle(): void {
    this.regulateEmotions();
    this.status = 'idle';
  }
}
