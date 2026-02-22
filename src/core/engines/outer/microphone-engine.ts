import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

export class MicrophoneEngine extends Engine {
  private stream: MediaStream | null = null;
  private ws: WebSocket | null = null;
  private recorder: MediaRecorder | null = null;
  private enabled = false;

  constructor() {
    super(ENGINE_IDS.MICROPHONE);
  }

  protected subscribesTo(): SignalType[] {
    return ['engine-status'];
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
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          if (!transcript || !data.is_final) return;

          this.emit(
            'speech-text',
            {
              text: transcript,
              confidence: data.channel?.alternatives?.[0]?.confidence ?? 1,
              timestamp: Date.now(),
            },
            {
              target: ENGINE_IDS.PERCEPTION,
              priority: SIGNAL_PRIORITIES.HIGH,
            },
          );

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
      }
    }
    this.status = 'idle';
  }

  destroy(): void {
    this.disable();
    super.destroy();
  }
}
