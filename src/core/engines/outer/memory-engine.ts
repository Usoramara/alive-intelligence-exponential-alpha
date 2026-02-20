import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

interface MemoryResult {
  id: string;
  content: string;
  type: string;
  significance: number;
  similarity?: number;
}

export class MemoryEngine extends Engine {
  private lastRecall = 0;
  private recallCooldown = 2000; // 2s between recall calls

  constructor() {
    super(ENGINE_IDS.MEMORY);
  }

  protected subscribesTo(): SignalType[] {
    return ['attention-focus', 'memory-query'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'attention-focus')) {
        const focus = signal.payload;
        this.recall(focus.content, focus.salience);
      } else if (isSignal(signal, 'memory-query')) {
        const query = signal.payload;
        this.recall(query.query, 0.6);
      }
    }
  }

  private async recall(query: string, salience = 0): Promise<void> {
    // Cooldown to avoid hammering the API
    const now = Date.now();
    if (now - this.lastRecall < this.recallCooldown) return;
    if (salience < 0.3) return; // Skip low-salience queries
    this.lastRecall = now;

    this.status = 'processing';

    try {
      const response = await fetch(`/api/user/memories?q=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) {
        this.debugInfo = 'Memory search failed (not authenticated?)';
        this.status = 'idle';
        return;
      }

      const { memories } = (await response.json()) as { memories: MemoryResult[] };

      if (memories.length > 0) {
        this.emit('memory-result', {
          items: memories.map(r => r.content),
          records: memories,
        }, {
          target: [ENGINE_IDS.BINDER, ENGINE_IDS.IMAGINATION, ENGINE_IDS.DEFAULT_MODE, ENGINE_IDS.ARBITER],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.debugInfo = `Recalled ${memories.length} memories (vector search)`;
      } else {
        this.debugInfo = 'No memories found';
      }
    } catch (err) {
      this.debugInfo = `Recall error: ${err}`;
    }

    this.status = 'idle';
  }

  protected onIdle(): void {
    this.status = 'idle';
  }
}
