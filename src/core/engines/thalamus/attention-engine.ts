import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface PerceptionResult {
  type: 'text' | 'visual';
  content: string;
  timestamp: number;
  salience: number;
}

interface AttentionFocus {
  content: string;
  modality: 'text' | 'visual' | 'multimodal';
  salience: number;
  urgency: number;
  timestamp: number;
}

// Simple hash for content deduplication
function contentHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return String(h);
}

// Words that carry emotional weight for valence-congruent boosting
const EMOTIONAL_WORDS = /\b(died|death|grief|loss|lost|sad|cry|hurt|pain|miss|love|hate|afraid|scared|angry|happy|joy|beautiful|terrible|wonderful|awful)\b/i;

export class AttentionEngine extends Engine {
  private focusHistory: AttentionFocus[] = [];
  private currentFocus: AttentionFocus | null = null;

  // Novelty map: content hash → last-seen timestamp (for habituation)
  private noveltyMap = new Map<string, number>();
  private readonly NOVELTY_DECAY = 30000; // 30s before content feels novel again
  private readonly MAX_NOVELTY_ENTRIES = 100;

  constructor() {
    super(ENGINE_IDS.ATTENTION);
  }

  protected subscribesTo(): SignalType[] {
    return ['perception-result', 'intuition-alert', 'safety-alert'];
  }

  protected process(signals: Signal[]): void {
    const perceptions: PerceptionResult[] = [];

    for (const signal of signals) {
      if (isSignal(signal, 'perception-result')) {
        perceptions.push(signal.payload as unknown as PerceptionResult);
      } else if (isSignal(signal, 'safety-alert')) {
        // Safety always gets highest attention
        this.currentFocus = {
          content: (signal.payload as unknown as { message: string }).message,
          modality: 'text',
          salience: 1.0,
          urgency: 1.0,
          timestamp: Date.now(),
        };
        this.emit('attention-focus', this.currentFocus, {
          target: ENGINE_IDS.BINDER,
          priority: SIGNAL_PRIORITIES.CRITICAL,
        });
        return;
      } else if (isSignal(signal, 'intuition-alert')) {
        // Intuition bumps attention
        this.selfState.nudge('arousal', 0.05);
        this.selfState.nudge('curiosity', 0.1);
      }
    }

    if (perceptions.length === 0) return;

    const selfState = this.selfState.get();
    const now = Date.now();

    // Dynamic attention threshold: high arousal → only high-salience items pass
    const attentionThreshold = 0.2 + selfState.arousal * 0.4;

    const scored = perceptions.map(p => {
      let score = p.salience;

      // Habituation: repeated content loses salience
      const hash = contentHash(p.content);
      const lastSeen = this.noveltyMap.get(hash);
      if (lastSeen && now - lastSeen < this.NOVELTY_DECAY) {
        const recencyFactor = (now - lastSeen) / this.NOVELTY_DECAY;
        score *= 0.3 + 0.7 * recencyFactor;
      }
      this.noveltyMap.set(hash, now);
      if (this.noveltyMap.size > this.MAX_NOVELTY_ENTRIES) {
        const entries = [...this.noveltyMap.entries()];
        entries.sort((a, b) => a[1] - b[1]);
        for (let i = 0; i < entries.length - this.MAX_NOVELTY_ENTRIES; i++) {
          this.noveltyMap.delete(entries[i][0]);
        }
      }

      // Valence-congruent salience boost: negative valence → emotional content gets +0.15
      if (selfState.valence < -0.1 && EMOTIONAL_WORDS.test(p.content)) {
        score += 0.15;
      }

      // Existing curiosity and arousal modulation
      score *= (1 + selfState.curiosity * 0.3) * (1 + selfState.arousal * 0.2);

      return { ...p, score };
    });

    // Filter by dynamic threshold
    const passing = scored.filter(p => p.score >= attentionThreshold);
    if (passing.length === 0) {
      this.debugInfo = `Filtered: all below threshold (${attentionThreshold.toFixed(2)})`;
      this.status = 'idle';
      return;
    }

    passing.sort((a, b) => b.score - a.score);

    const winner = passing[0];
    this.currentFocus = {
      content: winner.content,
      modality: winner.type,
      salience: winner.salience,
      urgency: winner.score,
      timestamp: winner.timestamp,
    };

    // Keep focus history (last 10)
    this.focusHistory.push(this.currentFocus);
    if (this.focusHistory.length > 10) this.focusHistory.shift();

    // Forward to binder for cross-modal integration
    this.emit('attention-focus', this.currentFocus, {
      target: ENGINE_IDS.BINDER,
      priority: SIGNAL_PRIORITIES.HIGH,
    });

    // Also notify memory for potential retrieval
    this.emit('attention-focus', this.currentFocus, {
      target: ENGINE_IDS.MEMORY,
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    this.debugInfo = `Focus: "${winner.content.slice(0, 25)}..." (${winner.score.toFixed(2)}, thr:${attentionThreshold.toFixed(2)})`;
    this.status = 'idle';
  }

  protected onIdle(): void {
    this.status = 'idle';
    // Attention naturally decays
    if (this.currentFocus && Date.now() - this.currentFocus.timestamp > 5000) {
      this.currentFocus = null;
    }
  }
}
