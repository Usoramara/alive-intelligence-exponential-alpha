import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

interface DeepgramAlternative {
  transcript: string;
  confidence: number;
  words?: DeepgramWord[];
}

interface VocalMetrics {
  speechRate: number;
  pauseRatio: number;
  confidencePattern: 'steady' | 'declining' | 'fluctuating';
  averageConfidence: number;
}

export class MicrophoneEngine extends Engine {
  private stream: MediaStream | null = null;
  private ws: WebSocket | null = null;
  private recorder: MediaRecorder | null = null;
  private enabled = false;

  // Vocal emotion tracking
  private recentMetrics: VocalMetrics[] = [];
  private lastVocalEmotionEmit = 0;
  private vocalEmotionCooldown = 5000; // 5s between vocal emotion signals
  private lastTextEmotion: { emotions: string[]; valence: number } | null = null;

  // Mismatch detection embeddings
  private positiveEmbed: number[] | null = null;
  private negativeEmbed: number[] | null = null;

  constructor() {
    super(ENGINE_IDS.MICROPHONE);
    this.warmUpMismatchEmbeddings();
  }

  private async warmUpMismatchEmbeddings(): Promise<void> {
    // Pre-embed sentiment anchors for mismatch detection
    if (!isEmbeddingReady()) {
      setTimeout(() => this.warmUpMismatchEmbeddings(), 3000);
      return;
    }
    this.positiveEmbed = await embed('happy good great fine wonderful nice okay');
    this.negativeEmbed = await embed('sad terrible bad awful painful hurt struggling');
  }

  protected subscribesTo(): SignalType[] {
    return ['engine-status', 'emotion-detected'];
  }

  async enable(): Promise<boolean> {
    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Fetch temporary Deepgram key
      const tokenRes = await fetch('/api/stt/token', { method: 'POST' });
      if (!tokenRes.ok) {
        this.debugInfo = 'Failed to get STT token';
        return false;
      }
      const { key } = await tokenRes.json();

      // Connect to Deepgram WebSocket
      const params = new URLSearchParams({
        model: 'nova-3',
        language: 'no',
        interim_results: 'true',
        smart_format: 'true',
        punctuate: 'true',
        encoding: 'opus',
        sample_rate: '48000',
      });

      this.ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params}`,
        ['token', key],
      );

      this.ws.onopen = () => {
        // Start MediaRecorder to feed audio chunks
        this.recorder = new MediaRecorder(this.stream!, {
          mimeType: 'audio/webm;codecs=opus',
        });

        this.recorder.ondataavailable = (e) => {
          if (
            e.data.size > 0 &&
            this.ws &&
            this.ws.readyState === WebSocket.OPEN
          ) {
            this.ws.send(e.data);
          }
        };

        this.recorder.start(250);
        this.debugInfo = 'Microphone active (Deepgram)';
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const alt = data.channel?.alternatives?.[0] as DeepgramAlternative | undefined;
          const transcript = alt?.transcript;
          if (!transcript || !data.is_final) return;

          // Extract vocal prosody metrics from word-level data
          const metrics = this.extractVocalMetrics(alt);

          this.emit(
            'speech-text',
            {
              text: transcript,
              confidence: alt.confidence ?? 1,
              timestamp: Date.now(),
            },
            {
              target: ENGINE_IDS.PERCEPTION,
              priority: SIGNAL_PRIORITIES.HIGH,
            },
          );

          // Emit vocal emotion analysis (rate-limited)
          if (metrics) {
            this.recentMetrics.push(metrics);
            if (this.recentMetrics.length > 10) this.recentMetrics.shift();
            this.emitVocalEmotion(metrics, transcript);
          }

          this.selfState.nudge('social', 0.05);
          this.selfState.nudge('arousal', 0.03);
          this.debugInfo = `Heard: "${transcript.slice(0, 30)}..."`;
        } catch {
          // Ignore non-JSON messages
        }
      };

      this.ws.onerror = () => {
        this.debugInfo = 'Deepgram WebSocket error';
      };

      this.ws.onclose = () => {
        if (this.enabled) {
          // Auto-reconnect after a delay
          setTimeout(() => {
            if (this.enabled) {
              this.disable();
              this.enable();
            }
          }, 2000);
        }
      };

      this.enabled = true;
      return true;
    } catch (err) {
      this.debugInfo = `Mic error: ${err}`;
      this.status = 'error';
      return false;
    }
  }

  disable(): void {
    this.enabled = false;

    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
    this.recorder = null;

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'CloseStream' }));
      }
      this.ws.close();
      this.ws = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }

    this.debugInfo = 'Microphone disabled';
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'engine-status')) {
        const cmd = signal.payload;
        if (cmd.engine === this.id) {
          if (cmd.action === 'enable') this.enable();
          else if (cmd.action === 'disable') this.disable();
        }
      } else if (isSignal(signal, 'emotion-detected')) {
        // Track text-based emotion for mismatch detection
        this.lastTextEmotion = {
          emotions: signal.payload.emotions,
          valence: signal.payload.valence,
        };
      }
    }
    this.status = 'idle';
  }

  /**
   * Extract vocal prosody metrics from Deepgram's word-level data.
   * Uses timing, pauses, and confidence patterns as proxy for tone.
   */
  private extractVocalMetrics(alt: DeepgramAlternative): VocalMetrics | null {
    const words = alt.words;
    if (!words || words.length < 2) return null;

    // Speech rate: words per second
    const totalDuration = words[words.length - 1].end - words[0].start;
    const speechRate = totalDuration > 0 ? words.length / totalDuration : 0;

    // Pause ratio: time spent in silence between words
    let totalPause = 0;
    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > 0.1) totalPause += gap; // Only count pauses > 100ms
    }
    const pauseRatio = totalDuration > 0 ? totalPause / totalDuration : 0;

    // Confidence pattern: are word confidences steady, declining, or fluctuating?
    const confidences = words.map(w => w.confidence);
    const avgConfidence = confidences.reduce((s, c) => s + c, 0) / confidences.length;

    let confidencePattern: 'steady' | 'declining' | 'fluctuating' = 'steady';
    if (confidences.length >= 3) {
      // Check for decline (first half avg > second half avg)
      const mid = Math.floor(confidences.length / 2);
      const firstHalf = confidences.slice(0, mid).reduce((s, c) => s + c, 0) / mid;
      const secondHalf = confidences.slice(mid).reduce((s, c) => s + c, 0) / (confidences.length - mid);

      if (firstHalf - secondHalf > 0.1) {
        confidencePattern = 'declining';
      }

      // Check for fluctuation (high variance)
      const variance = confidences.reduce((s, c) => s + (c - avgConfidence) ** 2, 0) / confidences.length;
      if (variance > 0.01) {
        confidencePattern = 'fluctuating';
      }
    }

    return {
      speechRate,
      pauseRatio,
      confidencePattern,
      averageConfidence: avgConfidence,
    };
  }

  /**
   * Emit vocal emotion signal based on prosody analysis.
   * Maps speech rate, pauses, and confidence to inferred tone.
   */
  private emitVocalEmotion(metrics: VocalMetrics, transcript: string): void {
    const now = Date.now();
    if (now - this.lastVocalEmotionEmit < this.vocalEmotionCooldown) return;
    this.lastVocalEmotionEmit = now;

    // Infer tone from prosody features
    let inferredTone: 'calm' | 'anxious' | 'energetic' | 'flat' | 'warm' | 'tense';

    if (metrics.speechRate > 3.5 && metrics.pauseRatio < 0.1) {
      inferredTone = 'energetic';
    } else if (metrics.speechRate > 3.0 && metrics.confidencePattern === 'fluctuating') {
      inferredTone = 'anxious';
    } else if (metrics.speechRate < 1.5 && metrics.pauseRatio > 0.3) {
      inferredTone = 'flat';
    } else if (metrics.pauseRatio > 0.2 && metrics.confidencePattern === 'declining') {
      inferredTone = 'tense';
    } else if (metrics.speechRate < 2.5 && metrics.pauseRatio < 0.15) {
      inferredTone = 'warm';
    } else {
      inferredTone = 'calm';
    }

    this.emit('vocal-emotion', {
      speechRate: metrics.speechRate,
      pauseRatio: metrics.pauseRatio,
      confidencePattern: metrics.confidencePattern,
      inferredTone,
      confidence: Math.min(1, metrics.averageConfidence),
    }, {
      target: [ENGINE_IDS.EMOTION_INFERENCE, ENGINE_IDS.EMPATHIC_COUPLING],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    // Detect word-tone mismatch
    this.detectMismatch(transcript, inferredTone);
  }

  /**
   * Detect mismatch between what was said (text sentiment) and how it was said (tone).
   * E.g., "I'm fine" said in a flat/tense tone → suppression detected.
   */
  private async detectMismatch(
    transcript: string,
    vocalTone: string,
  ): Promise<void> {
    if (!this.lastTextEmotion) return;
    if (!isEmbeddingReady() || !this.positiveEmbed || !this.negativeEmbed) return;

    const textEmbed = await embed(transcript);
    if (!textEmbed) return;

    const posSim = cosineSimilarity(textEmbed, this.positiveEmbed);
    const negSim = cosineSimilarity(textEmbed, this.negativeEmbed);
    const textSentiment = posSim > negSim ? 'positive' : 'negative';

    // Check for mismatches
    const negTones = new Set(['flat', 'tense', 'anxious']);
    const posTones = new Set(['warm', 'energetic']);

    let mismatch = false;
    let mismatchType: 'suppression' | 'sarcasm' | 'masking' = 'suppression';
    let interpretation = '';

    if (textSentiment === 'positive' && negTones.has(vocalTone)) {
      mismatch = true;
      // "I'm fine" + flat tone = suppression
      // "Great, just great" + tense tone = sarcasm
      if (vocalTone === 'tense') {
        mismatchType = 'sarcasm';
        interpretation = 'Their words sound positive but their tone suggests frustration or sarcasm.';
      } else {
        mismatchType = 'suppression';
        interpretation = 'They say they\'re okay but their tone suggests they\'re holding something back.';
      }
    } else if (textSentiment === 'negative' && posTones.has(vocalTone)) {
      mismatch = true;
      mismatchType = 'masking';
      interpretation = 'They\'re expressing difficulty but their tone is surprisingly upbeat — they may be putting on a brave face.';
    }

    if (mismatch) {
      const textEmotion = this.lastTextEmotion.emotions[0] ?? 'neutral';
      this.emit('tone-text-mismatch', {
        textEmotion,
        vocalTone,
        mismatchType,
        confidence: Math.abs(posSim - negSim),
        interpretation,
      }, {
        target: [ENGINE_IDS.EMOTION_INFERENCE, ENGINE_IDS.ARBITER, ENGINE_IDS.EMPATHIC_COUPLING],
        priority: SIGNAL_PRIORITIES.MEDIUM,
      });

      // Push to consciousness stream
      this.selfState.pushStream({
        text: interpretation,
        source: 'microphone',
        flavor: 'emotional',
        timestamp: Date.now(),
        intensity: 0.7,
      });
    }
  }

  destroy(): void {
    this.disable();
    super.destroy();
  }
}
