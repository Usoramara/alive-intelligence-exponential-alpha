import { Engine } from '../../engine';
import { ENGINE_IDS } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface VoiceOutput {
  text: string;
  timestamp: number;
}

export type VoiceListener = (text: string) => void;
export type VoicePartialListener = (delta: string, accumulated: string) => void;

export class VoiceEngine extends Engine {
  private outputHistory: VoiceOutput[] = [];
  private listeners = new Set<VoiceListener>();
  private partialListeners = new Set<VoicePartialListener>();

  constructor() {
    super(ENGINE_IDS.VOICE);
  }

  protected subscribesTo(): SignalType[] {
    return ['voice-output', 'voice-output-partial'];
  }

  // External code can listen to complete voice output (for the UI)
  onOutput(listener: VoiceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // External code can listen to streaming partial output
  onPartialOutput(listener: VoicePartialListener): () => void {
    this.partialListeners.add(listener);
    return () => this.partialListeners.delete(listener);
  }

  getHistory(): VoiceOutput[] {
    return [...this.outputHistory];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'voice-output')) {
        const payload = signal.payload;
        this.outputHistory.push(payload);

        // Keep last 50 outputs
        if (this.outputHistory.length > 50) {
          this.outputHistory = this.outputHistory.slice(-50);
        }

        // Notify UI listeners
        for (const listener of this.listeners) {
          try {
            listener(payload.text);
          } catch (e) {
            console.error('Voice listener error:', e);
          }
        }

        this.debugInfo = `Said: "${payload.text.slice(0, 30)}..."`;
      }

      if (isSignal(signal, 'voice-output-partial')) {
        const payload = signal.payload;

        // Notify partial listeners
        for (const listener of this.partialListeners) {
          try {
            listener(payload.delta, payload.accumulatedText);
          } catch (e) {
            console.error('Voice partial listener error:', e);
          }
        }

        this.debugInfo = `Streaming: "${payload.accumulatedText.slice(-30)}..."`;
      }
    }
    this.status = 'idle';
  }
}
