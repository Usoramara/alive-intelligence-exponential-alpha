import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface TextPayload {
  text: string;
  timestamp: number;
}

interface PerceptionResult {
  type: 'text' | 'visual';
  content: string;
  timestamp: number;
  salience: number;
}

export class PerceptionEngine extends Engine {
  constructor() {
    super(ENGINE_IDS.PERCEPTION);
  }

  protected subscribesTo(): SignalType[] {
    return ['text-input', 'camera-frame', 'speech-text'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'text-input')) {
        const payload = signal.payload as unknown as TextPayload;
        const result: PerceptionResult = {
          type: 'text',
          content: payload.text,
          timestamp: payload.timestamp,
          salience: this.estimateTextSalience(payload.text),
        };

        // Forward to attention for routing
        this.emit('perception-result', result, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.HIGH,
        });

        // Also forward to emotion inference
        this.emit('perception-result', result, {
          target: ENGINE_IDS.EMOTION_INFERENCE,
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.debugInfo = `Perceived text: "${payload.text.slice(0, 30)}..."`;
      } else if (isSignal(signal, 'camera-frame')) {
        // Will be used in Phase 4
        this.emit('perception-result', {
          type: 'visual',
          content: '[visual frame]',
          timestamp: Date.now(),
          salience: 0.5,
        }, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });
      } else if (isSignal(signal, 'speech-text')) {
        const payload = signal.payload as unknown as TextPayload;
        this.emit('perception-result', {
          type: 'text',
          content: payload.text,
          timestamp: Date.now(),
          salience: this.estimateTextSalience(payload.text) + 0.1, // Speech slightly more salient
        }, {
          target: ENGINE_IDS.ATTENTION,
          priority: SIGNAL_PRIORITIES.HIGH,
        });
      }
    }
    this.status = 'idle';
  }

  private estimateTextSalience(text: string): number {
    let salience = 0.5;
    // Questions are more salient
    if (text.includes('?')) salience += 0.2;
    // Exclamations
    if (text.includes('!')) salience += 0.1;
    // Longer messages are more substantial
    if (text.length > 50) salience += 0.1;
    // Emotional keywords boost salience
    const emotionalWords = ['love', 'hate', 'sad', 'happy', 'afraid', 'angry', 'worried', 'excited'];
    if (emotionalWords.some(w => text.toLowerCase().includes(w))) salience += 0.15;
    return Math.min(1, salience);
  }
}
