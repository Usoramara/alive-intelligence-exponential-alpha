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
  private significanceThreshold = 0.4;

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

    // Batch write
    if (this.writeQueue.length > 0) {
      this.flushWrites();
    }

    this.status = 'idle';
  }

  private async flushWrites(): Promise<void> {
    const items = [...this.writeQueue];
    this.writeQueue = [];

    for (const item of items) {
      try {
        await fetch('/api/user/memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: this.classifyType(item.type),
            content: item.content,
            significance: item.significance,
            tags: item.tags ?? [],
          }),
        });
      } catch (err) {
        console.error('Memory write error:', err);
      }
    }

    this.debugInfo = `Wrote ${items.length} memories`;
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
