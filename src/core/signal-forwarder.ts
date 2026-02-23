import type { Signal } from './types';
import type { SignalBus } from './signal-bus';

/**
 * SignalForwarder — subscribes to the SignalBus and batches signals
 * for forwarding to the Wybe Life Model ingest endpoint.
 *
 * Batches by time (100ms) or count (100 signals), whichever comes first.
 * Non-blocking: failures are logged but don't affect the main signal flow.
 */
export class SignalForwarder {
  private buffer: Signal[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private subscriptionId: string | null = null;
  private sending = false;

  private readonly batchIntervalMs = 100;
  private readonly batchSize = 100;
  private readonly timeoutMs = 5000;

  constructor(
    private readonly signalBus: SignalBus,
    private readonly ingestUrl: string,
  ) {}

  start(): void {
    if (this.subscriptionId) return;

    // Subscribe to ALL signals (no type filter)
    this.subscriptionId = this.signalBus.subscribe(
      'persistence' as never, // Use persistence engine ID as subscriber identity
      undefined,              // All signal types
      (signal) => this.onSignal(signal),
    );

    console.log(`[SignalForwarder] Started — forwarding to ${this.ingestUrl}`);
  }

  stop(): void {
    if (this.subscriptionId) {
      this.signalBus.unsubscribe(this.subscriptionId);
      this.subscriptionId = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    // Flush remaining
    if (this.buffer.length > 0) {
      this.flush();
    }
    console.log('[SignalForwarder] Stopped');
  }

  private onSignal(signal: Signal): void {
    this.buffer.push(signal);

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchIntervalMs);
    }
  }

  private flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.buffer.length === 0 || this.sending) return;

    const batch = this.buffer;
    this.buffer = [];
    this.sending = true;

    // Fire-and-forget POST
    this.sendBatch(batch)
      .catch((err) => {
        console.warn(`[SignalForwarder] Failed to send ${batch.length} signals:`, err.message);
      })
      .finally(() => {
        this.sending = false;
      });
  }

  private async sendBatch(signals: Signal[]): Promise<void> {
    const body = JSON.stringify({
      signals: signals.map(s => ({
        id: s.id,
        type: s.type,
        source: s.source,
        target: s.target,
        payload: s.payload,
        priority: s.priority,
        timestamp: s.timestamp,
        ttl: s.ttl,
      })),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(this.ingestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      if (!res.ok) {
        console.warn(`[SignalForwarder] Ingest returned ${res.status}`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
