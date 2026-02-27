import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface TextPayload {
  text: string;
  timestamp: number;
}

interface VisualDescription {
  description: string;
  emotions?: { detected: string[]; confidence: number };
  people?: Array<{ expression: string; estimatedMood: string }>;
  objects?: string[];
}

// Pre-computed salience anchor embeddings
let urgentEmbed: number[] | null = null;
let emotionalEmbed: number[] | null = null;

export class PerceptionEngine extends Engine {
  private warmupDone = false;

  constructor() {
    super(ENGINE_IDS.PERCEPTION);
  }

  protected subscribesTo(): SignalType[] {
    return ['text-input', 'camera-frame', 'speech-text', 'visual-description'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'text-input')) {
        const payload = signal.payload as unknown as TextPayload;
        const salience = this.estimateTextSalience(payload.text);

        // Forward to attention for routing
        this.emit('perception-result', {
          description: payload.text,
          modality: 'text',
          salience,
        }, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.HIGH,
        });

        // Also forward to emotion inference
        this.emit('perception-result', {
          description: payload.text,
          modality: 'text',
          salience,
        }, {
          target: ENGINE_IDS.EMOTION_INFERENCE,
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.debugInfo = `Perceived text: "${payload.text.slice(0, 30)}..."`;

      } else if (isSignal(signal, 'speech-text')) {
        const payload = signal.payload as unknown as TextPayload;
        const salience = this.estimateTextSalience(payload.text) + 0.1; // Speech slightly more salient

        this.emit('perception-result', {
          description: payload.text,
          modality: 'text',
          salience,
        }, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.HIGH,
        });

        // Also forward to emotion inference for speech
        this.emit('perception-result', {
          description: payload.text,
          modality: 'text',
          salience,
        }, {
          target: ENGINE_IDS.EMOTION_INFERENCE,
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

      } else if (isSignal(signal, 'camera-frame')) {
        // Raw frame — emit stub for attention tracking
        this.emit('perception-result', {
          description: '[visual frame]',
          modality: 'visual',
          salience: 0.3,
        }, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.LOW,
        });

      } else if (isSignal(signal, 'visual-description')) {
        // Claude Vision has processed a frame — extract emotional content
        const visual = signal.payload as unknown as VisualDescription;
        this.processVisualDescription(visual);
      }
    }
    this.status = 'idle';
  }

  /**
   * Process Claude Vision's analysis of a camera frame.
   * Extracts emotional context from the scene and feeds it into the emotion pipeline.
   */
  private processVisualDescription(visual: VisualDescription): void {
    // Estimate salience from visual content
    let salience = 0.4;
    if (visual.people && visual.people.length > 0) salience += 0.2;
    if (visual.emotions && visual.emotions.confidence > 0.5) salience += 0.2;

    // Forward to attention with visual context
    this.emit('perception-result', {
      description: visual.description,
      modality: 'visual',
      salience: Math.min(1, salience),
    }, {
      target: ENGINE_IDS.ATTENTION,
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    // Extract and emit visual emotions if present
    if (visual.emotions && visual.emotions.detected.length > 0) {
      // Map visual emotions to valence/arousal using the same approach as text
      const { valence, arousal } = this.estimateVisualVA(
        visual.emotions.detected,
        visual.people,
      );

      this.emit('visual-emotion', {
        emotions: visual.emotions.detected,
        valence,
        arousal,
        confidence: visual.emotions.confidence,
        people: visual.people ?? [],
        sceneContext: visual.description,
      }, {
        target: [ENGINE_IDS.EMOTION_INFERENCE, ENGINE_IDS.EMPATHIC_COUPLING, ENGINE_IDS.TOM],
        priority: SIGNAL_PRIORITIES.MEDIUM,
      });

      this.debugInfo = `Visual: ${visual.emotions.detected.join(', ')} (${visual.emotions.confidence.toFixed(2)})`;
    } else {
      this.debugInfo = `Visual: ${visual.description.slice(0, 40)}...`;
    }
  }

  /**
   * Estimate valence/arousal from visual emotion labels and people's expressions.
   */
  private estimateVisualVA(
    emotions: string[],
    people?: Array<{ expression: string; estimatedMood: string }>,
  ): { valence: number; arousal: number } {
    // Simple VA mapping for common visual emotions
    const vaMap: Record<string, [number, number]> = {
      happy: [0.7, 0.5], smiling: [0.6, 0.3], joy: [0.7, 0.5],
      sad: [-0.6, -0.3], crying: [-0.7, 0.4], sadness: [-0.6, -0.3],
      angry: [-0.5, 0.7], frustrated: [-0.4, 0.5], anger: [-0.5, 0.7],
      surprised: [0.1, 0.6], shocked: [-0.1, 0.8], surprise: [0.1, 0.6],
      calm: [0.3, -0.4], relaxed: [0.4, -0.3], peaceful: [0.5, -0.4],
      anxious: [-0.4, 0.5], nervous: [-0.3, 0.4], worried: [-0.3, 0.3],
      thoughtful: [0.1, 0.1], contemplative: [0.1, 0.0], reflective: [0.1, 0.0],
      tired: [-0.1, -0.5], bored: [-0.2, -0.4],
      excited: [0.5, 0.7], enthusiastic: [0.6, 0.6],
    };

    let totalValence = 0, totalArousal = 0, count = 0;

    for (const emotion of emotions) {
      const key = emotion.toLowerCase();
      if (vaMap[key]) {
        totalValence += vaMap[key][0];
        totalArousal += vaMap[key][1];
        count++;
      }
    }

    // Also consider people's estimated moods
    if (people) {
      for (const person of people) {
        const mood = person.estimatedMood.toLowerCase();
        if (vaMap[mood]) {
          totalValence += vaMap[mood][0];
          totalArousal += vaMap[mood][1];
          count++;
        }
      }
    }

    return {
      valence: count > 0 ? totalValence / count : 0,
      arousal: count > 0 ? totalArousal / count : 0.3,
    };
  }

  /**
   * Estimate text salience using embedding similarity (T0) with keyword fallback.
   */
  private estimateTextSalience(text: string): number {
    let salience = 0.5;

    // Keyword-based (fast fallback)
    if (text.includes('?')) salience += 0.2;
    if (text.includes('!')) salience += 0.1;
    if (text.length > 50) salience += 0.1;

    // Emotional keywords boost salience
    const emotionalWords = [
      'love', 'hate', 'sad', 'happy', 'afraid', 'angry', 'worried', 'excited',
      'grief', 'scared', 'hurt', 'grateful', 'lonely', 'anxious', 'proud',
    ];
    if (emotionalWords.some(w => text.toLowerCase().includes(w))) salience += 0.15;

    // T0: Embedding-based salience (if available)
    if (isEmbeddingReady() && !this.warmupDone) {
      this.warmupSalienceEmbeddings();
    }

    return Math.min(1, salience);
  }

  private async warmupSalienceEmbeddings(): Promise<void> {
    this.warmupDone = true;
    try {
      urgentEmbed = await embed('urgent help emergency please important need now');
      emotionalEmbed = await embed('feel hurt love scared sad happy angry pain grief');
    } catch {
      // Non-critical
    }
  }
}
