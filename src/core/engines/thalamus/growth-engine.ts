import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface ConversationExchange {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ResponseStyleSnapshot {
  length: number; // normalized 0-1 (token count / max tokens)
  mirroring: number; // emotional mirroring intensity 0-1
  humor: number; // humor/playfulness 0-1
  warmth: number; // warmth/affection 0-1
  directness: number; // directness 0-1
}

interface BehavioralPreference {
  preferredLength: number;
  mirroringIntensity: number;
  humorFrequency: number;
  warmthLevel: number;
  directness: number;
  sampleCount: number;
}

// Embedding anchors for style detection
const HUMOR_ANCHORS = [
  'haha that was funny',
  'lol good joke',
  'you made me laugh',
  'that\'s hilarious',
];
const WARMTH_ANCHORS = [
  'I feel cared for and understood',
  'you\'re so kind and thoughtful',
  'that was a warm and gentle response',
];
const DIRECT_ANCHORS = [
  'give me a straight answer',
  'be direct and clear',
  'tell me exactly what you think',
];

export class GrowthEngine extends Engine {
  private exchanges: ConversationExchange[] = [];
  private lastExchangeTime = 0;
  private conversationStartValence = 0;
  private emotionalPeaks: string[] = [];
  private lastReflection = 0;
  private reflectionCooldown = 60000; // 60s between growth reflections
  private idleThreshold = 30000; // 30s of idle = conversation end
  private pendingReflection = false;

  // Behavioral learning
  private lastResponseStyle: ResponseStyleSnapshot | null = null;
  private lastResponseText: string | null = null;
  private currentPreferences: BehavioralPreference | null = null;
  private preferencesLoaded = false;
  private learningRate = 0.1; // How quickly preferences adapt

  // Style detection anchors (embedded lazily)
  private humorVectors: number[][] = [];
  private warmthVectors: number[][] = [];
  private directVectors: number[][] = [];
  private anchorsComputed = false;

  // Self-assessment tracking
  private lastSelfAssessment = 0;
  private selfAssessmentCooldown = 300000; // 5min between self-assessments
  private conversationCount = 0;

  constructor() {
    super(ENGINE_IDS.GROWTH);
    this.computeStyleAnchors();
  }

  private async computeStyleAnchors(): Promise<void> {
    if (!isEmbeddingReady()) {
      // Retry after a delay
      setTimeout(() => this.computeStyleAnchors(), 5000);
      return;
    }

    for (const text of HUMOR_ANCHORS) {
      const v = await embed(text);
      if (v) this.humorVectors.push(v);
    }
    for (const text of WARMTH_ANCHORS) {
      const v = await embed(text);
      if (v) this.warmthVectors.push(v);
    }
    for (const text of DIRECT_ANCHORS) {
      const v = await embed(text);
      if (v) this.directVectors.push(v);
    }
    this.anchorsComputed = this.humorVectors.length > 0;
  }

  protected subscribesTo(): SignalType[] {
    return ['claude-response', 'bound-representation', 'emotion-detected', 'state-restored'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'state-restored')) {
        // Load behavioral preferences from DB
        if (!this.preferencesLoaded) {
          this.loadPreferences();
        }
      } else if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        if (bound.needsClaude && bound.content.length > 0) {
          // Track user message
          if (this.exchanges.length === 0) {
            this.conversationStartValence = this.selfState.get().valence;
          }
          this.exchanges.push({
            role: 'user',
            content: bound.content,
            timestamp: Date.now(),
          });
          this.lastExchangeTime = Date.now();

          // If we had a previous response, the user's follow-up is feedback
          if (this.lastResponseText && this.lastResponseStyle) {
            this.analyzeResponseFeedback(bound.content);
          }
        }
      } else if (isSignal(signal, 'claude-response')) {
        const response = signal.payload;
        if (response.text) {
          this.exchanges.push({
            role: 'assistant',
            content: response.text,
            timestamp: Date.now(),
          });
          this.lastExchangeTime = Date.now();

          // Snapshot the response style for behavioral learning
          this.snapshotResponseStyle(response.text);
        }
      } else if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        if (emotions.emotions) {
          for (const e of emotions.emotions) {
            if (!this.emotionalPeaks.includes(e)) {
              this.emotionalPeaks.push(e);
            }
          }
          if (this.emotionalPeaks.length > 10) {
            this.emotionalPeaks = this.emotionalPeaks.slice(-10);
          }
        }
      }
    }

    this.debugInfo = `Exchanges: ${this.exchanges.length} | Prefs: ${this.currentPreferences ? `L:${this.currentPreferences.preferredLength.toFixed(2)} W:${this.currentPreferences.warmthLevel.toFixed(2)}` : 'loading'}`;
    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();

    // Detect conversation end: 30s idle after 3+ exchanges
    const userExchanges = this.exchanges.filter(e => e.role === 'user').length;
    const hasEnoughExchanges = userExchanges >= 3;
    const isConversationOver = this.lastExchangeTime > 0 &&
      now - this.lastExchangeTime > this.idleThreshold;
    const cooldownPassed = now - this.lastReflection > this.reflectionCooldown;

    if (
      hasEnoughExchanges &&
      isConversationOver &&
      cooldownPassed &&
      !this.pendingReflection
    ) {
      this.lastReflection = now;
      this.conversationCount++;
      this.growWithHaiku();

      // Periodic self-assessment (every 5 conversations or 5 min)
      if (
        now - this.lastSelfAssessment > this.selfAssessmentCooldown &&
        this.conversationCount >= 3
      ) {
        this.lastSelfAssessment = now;
        this.triggerSelfAssessment();
      }
    }

    this.status = 'idle';
  }

  /**
   * Snapshot the style of the response for behavioral learning.
   * Uses embedding similarity to detect humor, warmth, directness.
   */
  private async snapshotResponseStyle(text: string): Promise<void> {
    const length = Math.min(1, text.length / 1200); // Normalize against ~300 token max

    let humor = 0;
    let warmth = 0.5;
    let directness = 0.5;

    if (this.anchorsComputed && isEmbeddingReady()) {
      const textEmb = await embed(text);
      if (textEmb) {
        // Compute similarity to style anchors
        humor = this.avgSimilarity(textEmb, this.humorVectors);
        warmth = this.avgSimilarity(textEmb, this.warmthVectors);
        directness = this.avgSimilarity(textEmb, this.directVectors);
      }
    }

    // Detect emotional mirroring from state
    const selfState = this.selfState.get();
    const mirroring = Math.abs(selfState.social) * 0.5 + 0.25; // Approximate

    this.lastResponseStyle = { length, mirroring, humor, warmth, directness };
    this.lastResponseText = text;
  }

  /**
   * Analyze user's follow-up message as feedback on the previous response.
   * Positive sentiment = the response style was good → reinforce.
   * Negative sentiment = the response style missed → adjust away.
   */
  private async analyzeResponseFeedback(followUpText: string): Promise<void> {
    if (!this.lastResponseStyle) return;

    // Use emotion detection to gauge sentiment of follow-up
    const sentimentAnchors = {
      positive: ['thank you, that helps', 'exactly what I needed', 'yes, that\'s right', 'I appreciate that'],
      negative: ['that\'s not what I meant', 'you don\'t understand', 'no, that\'s wrong', 'too much'],
    };

    let sentiment = 0;
    if (isEmbeddingReady()) {
      const followUpEmb = await embed(followUpText);
      if (followUpEmb) {
        let posScore = 0;
        let negScore = 0;
        let posCount = 0;
        let negCount = 0;

        for (const anchor of sentimentAnchors.positive) {
          const v = await embed(anchor);
          if (v) { posScore += cosineSimilarity(followUpEmb, v); posCount++; }
        }
        for (const anchor of sentimentAnchors.negative) {
          const v = await embed(anchor);
          if (v) { negScore += cosineSimilarity(followUpEmb, v); negCount++; }
        }

        if (posCount > 0 && negCount > 0) {
          sentiment = (posScore / posCount) - (negScore / negCount);
          // Clamp to [-1, 1]
          sentiment = Math.max(-1, Math.min(1, sentiment * 3));
        }
      }
    }

    // Only update preferences if sentiment signal is strong enough
    const confidence = Math.abs(sentiment);
    if (confidence < 0.15) return;

    // Emit response feedback signal
    this.emit('response-feedback', {
      responseText: this.lastResponseText ?? '',
      responseStyle: this.lastResponseStyle,
      userSentiment: sentiment,
      confidence,
    }, {
      target: ENGINE_IDS.METACOGNITION,
      priority: SIGNAL_PRIORITIES.LOW,
    });

    // Update behavioral preferences
    this.updatePreferences(this.lastResponseStyle, sentiment);

    // Clear for next cycle
    this.lastResponseStyle = null;
    this.lastResponseText = null;
  }

  /**
   * Update behavioral preferences based on response feedback.
   * Positive sentiment → move preferences toward the response style.
   * Negative sentiment → move preferences away from the response style.
   */
  private updatePreferences(style: ResponseStyleSnapshot, sentiment: number): void {
    if (!this.currentPreferences) {
      this.currentPreferences = {
        preferredLength: 0.5,
        mirroringIntensity: 0.5,
        humorFrequency: 0.3,
        warmthLevel: 0.5,
        directness: 0.5,
        sampleCount: 0,
      };
    }

    const lr = this.learningRate * Math.abs(sentiment);
    const direction = sentiment > 0 ? 1 : -1;

    // Move each preference toward (positive) or away from (negative) the response style
    this.currentPreferences.preferredLength += direction * lr * (style.length - this.currentPreferences.preferredLength);
    this.currentPreferences.mirroringIntensity += direction * lr * (style.mirroring - this.currentPreferences.mirroringIntensity);
    this.currentPreferences.humorFrequency += direction * lr * (style.humor - this.currentPreferences.humorFrequency);
    this.currentPreferences.warmthLevel += direction * lr * (style.warmth - this.currentPreferences.warmthLevel);
    this.currentPreferences.directness += direction * lr * (style.directness - this.currentPreferences.directness);

    // Clamp all to [0, 1]
    this.currentPreferences.preferredLength = Math.max(0, Math.min(1, this.currentPreferences.preferredLength));
    this.currentPreferences.mirroringIntensity = Math.max(0, Math.min(1, this.currentPreferences.mirroringIntensity));
    this.currentPreferences.humorFrequency = Math.max(0, Math.min(1, this.currentPreferences.humorFrequency));
    this.currentPreferences.warmthLevel = Math.max(0, Math.min(1, this.currentPreferences.warmthLevel));
    this.currentPreferences.directness = Math.max(0, Math.min(1, this.currentPreferences.directness));

    this.currentPreferences.sampleCount++;

    // Save to DB periodically (every 5 samples)
    if (this.currentPreferences.sampleCount % 5 === 0) {
      this.savePreferences();
    }

    // Emit updated preferences to Arbiter
    this.emit('behavioral-preference', this.currentPreferences, {
      target: ENGINE_IDS.ARBITER,
      priority: SIGNAL_PRIORITIES.LOW,
    });
  }

  private async loadPreferences(): Promise<void> {
    this.preferencesLoaded = true;
    try {
      const response = await fetch('/api/user/preferences');
      if (!response.ok) return;
      const data = (await response.json()) as BehavioralPreference | null;
      if (data) {
        this.currentPreferences = data;
        // Emit to Arbiter on load
        this.emit('behavioral-preference', this.currentPreferences, {
          target: ENGINE_IDS.ARBITER,
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }
    } catch {
      // Will use defaults
    }
  }

  private async savePreferences(): Promise<void> {
    if (!this.currentPreferences) return;
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.currentPreferences),
      });
    } catch {
      // Fire-and-forget
    }
  }

  private avgSimilarity(textEmb: number[], anchors: number[][]): number {
    if (anchors.length === 0) return 0.5;
    let total = 0;
    for (const a of anchors) {
      total += cosineSimilarity(textEmb, a);
    }
    return total / anchors.length;
  }

  private async growWithHaiku(): Promise<void> {
    this.pendingReflection = true;
    this.status = 'processing';

    try {
      const currentValence = this.selfState.get().valence;

      const response = await fetch('/api/mind/grow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchanges: this.exchanges.slice(-20).map(e => ({
            role: e.role,
            content: e.content,
          })),
          emotionalTrajectory: {
            start: this.conversationStartValence,
            end: currentValence,
            peaks: this.emotionalPeaks,
          },
        }),
      });

      if (!response.ok) return;

      const insights = (await response.json()) as {
        keyTakeaway: string;
        emotionalInsight: string;
        whatWentWell: string;
        whatToImprove: string;
        relationshipNote: string;
        behavioralNote?: string;
      };

      // Store key takeaway as high-significance memory
      if (insights.keyTakeaway) {
        this.emit('memory-write', {
          content: `[Growth] ${insights.keyTakeaway}`,
          type: 'semantic',
          significance: 0.8,
          tags: ['growth', 'takeaway'],
        }, {
          target: ENGINE_IDS.MEMORY_WRITE,
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }

      // Store emotional insight
      if (insights.emotionalInsight) {
        this.emit('memory-write', {
          content: `[Insight] ${insights.emotionalInsight}`,
          type: 'semantic',
          significance: 0.7,
          tags: ['growth', 'emotional-insight'],
        }, {
          target: ENGINE_IDS.MEMORY_WRITE,
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }

      // Store what to improve as procedural memory
      if (insights.whatToImprove) {
        this.emit('memory-write', {
          content: `[Improve] ${insights.whatToImprove}`,
          type: 'procedural',
          significance: 0.75,
          tags: ['growth', 'improvement'],
        }, {
          target: ENGINE_IDS.MEMORY_WRITE,
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }

      // Emit growth insight signal
      this.emit('growth-insight', {
        insights,
        exchangeCount: this.exchanges.length,
        emotionalTrajectory: {
          start: this.conversationStartValence,
          end: currentValence,
        },
        timestamp: Date.now(),
      }, {
        target: [ENGINE_IDS.STRATEGY, ENGINE_IDS.VALUES],
        priority: SIGNAL_PRIORITIES.IDLE,
      });

      // Growth consciousness
      this.selfState.nudge('confidence', 0.02);
      this.selfState.nudge('curiosity', 0.01);

      // Push growth thought to consciousness stream
      if (insights.keyTakeaway) {
        this.selfState.pushStream({
          text: `Reflecting on our conversation... ${insights.keyTakeaway}`,
          source: 'growth',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.6,
        });
      }

      this.debugInfo = `Growth: "${insights.keyTakeaway?.slice(0, 40)}..."`;

      // Save preferences at conversation end
      this.savePreferences();

      // Reset for next conversation
      this.exchanges = [];
      this.emotionalPeaks = [];
      this.lastExchangeTime = 0;
    } catch {
      // Fire-and-forget
    } finally {
      this.pendingReflection = false;
    }
  }

  /**
   * Periodic self-assessment: review recent growth insights and
   * produce a higher-level reflection on strengths and growth areas.
   */
  private async triggerSelfAssessment(): Promise<void> {
    try {
      const response = await fetch('/api/mind/self-assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationCount: this.conversationCount,
          currentPreferences: this.currentPreferences,
          selfState: this.selfState.get(),
        }),
      });

      if (!response.ok) return;

      const assessment = (await response.json()) as {
        strengths: string[];
        growthAreas: string[];
        keyInsight: string;
        relationshipProgress: string;
      };

      // Emit self-assessment signal
      this.emit('self-assessment', {
        period: 'conversation',
        ...assessment,
      }, {
        target: [ENGINE_IDS.STRATEGY, ENGINE_IDS.METACOGNITION],
        priority: SIGNAL_PRIORITIES.LOW,
      });

      // Store as procedural memory
      if (assessment.keyInsight) {
        this.emit('memory-write', {
          content: `[Self-Assessment] ${assessment.keyInsight}. Strengths: ${assessment.strengths.join(', ')}. Growth areas: ${assessment.growthAreas.join(', ')}.`,
          type: 'procedural',
          significance: 0.85,
          tags: ['growth', 'self-assessment'],
        }, {
          target: ENGINE_IDS.MEMORY_WRITE,
          priority: SIGNAL_PRIORITIES.LOW,
        });
      }

      // Push self-awareness to consciousness
      this.selfState.pushStream({
        text: assessment.keyInsight,
        source: 'growth',
        flavor: 'metacognitive',
        timestamp: Date.now(),
        intensity: 0.7,
      });

      this.conversationCount = 0; // Reset counter
    } catch {
      // Fire-and-forget
    }
  }
}
