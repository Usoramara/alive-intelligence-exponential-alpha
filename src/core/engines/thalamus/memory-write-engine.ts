import { Engine } from '../../engine';
import { ENGINE_IDS } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface MemorySignificance {
  content: string;
  type: string;
  significance: number;
  tags?: string[];
}

export class MemoryWriteEngine extends Engine {
  private writeQueue: MemorySignificance[] = [];
  private retryQueue: { item: MemorySignificance; attempts: number }[] = [];
  private significanceThreshold = 0.4;
  private readonly MAX_RETRIES = 3;
  private readonly MAX_QUEUE_SIZE = 50;

  constructor() {
    super(ENGINE_IDS.MEMORY_WRITE);
  }

  protected subscribesTo(): SignalType[] {
    return ['memory-significance', 'memory-write', 'replay-memory'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'memory-significance')) {
        const item = signal.payload as MemorySignificance;
        if (item.significance >= this.significanceThreshold) {
          this.writeQueue.push(item);
        }
      } else if (isSignal(signal, 'memory-write')) {
        const item = signal.payload as MemorySignificance;
        this.writeQueue.push(item);
      }
    }

    // Batch write (includes retries)
    if (this.writeQueue.length > 0 || this.retryQueue.length > 0) {
      this.flushWrites();
    }

    this.status = 'idle';
  }

  private async flushWrites(): Promise<void> {
    const freshItems = this.writeQueue.map(item => ({ item, attempts: 0 }));
    const allItems = [...this.retryQueue, ...freshItems];
    this.writeQueue = [];
    this.retryQueue = [];

    // Backpressure: drop oldest low-significance items if queue overflows
    if (allItems.length > this.MAX_QUEUE_SIZE) {
      allItems.sort((a, b) => b.item.significance - a.item.significance);
      const dropped = allItems.length - this.MAX_QUEUE_SIZE;
      allItems.length = this.MAX_QUEUE_SIZE;
      console.warn(`Memory write backpressure: dropped ${dropped} low-significance items`);
    }

    let written = 0;
    let failed = 0;

    for (const entry of allItems) {
      try {
        const res = await fetch('/api/user/memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: this.classifyType(entry.item.type),
            content: entry.item.content,
            significance: entry.item.significance,
            tags: entry.item.tags ?? [],
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        written++;
      } catch (err) {
        entry.attempts++;
        if (entry.attempts < this.MAX_RETRIES) {
          this.retryQueue.push(entry);
          failed++;
        } else {
          console.error(`Memory write failed after ${this.MAX_RETRIES} attempts:`, err);
          failed++;
        }
      }
    }

    this.debugInfo = `Wrote ${written}${failed > 0 ? `, ${failed} failed` : ''}${this.retryQueue.length > 0 ? `, ${this.retryQueue.length} pending retry` : ''} memories`;
  }

  private classifyType(type: string): string {
    switch (type) {
      case 'response':
      case 'conversation':
      case 'interaction':
        return 'episodic';
      case 'fact':
      case 'knowledge':
        return 'semantic';
      case 'person':
        return 'person';
      default:
        return 'episodic';
    }
  }
}
