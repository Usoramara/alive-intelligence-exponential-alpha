import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType, SelfState } from '../../types';
import { WorkingMemory, type WorkingMemoryItem } from '../../working-memory';

interface BoundRepresentation {
  content: string;
  context: string[];
  selfState: SelfState;
  timestamp: number;
}

export class WorkingMemoryEngine extends Engine {
  private wm = new WorkingMemory();
  private lastDecay = Date.now();

  constructor() {
    super(ENGINE_IDS.WORKING_MEMORY);

    // When items are evicted, push them to long-term memory
    this.wm.onEviction((item) => {
      this.emit('item-evicted', {
        content: item.content,
        type: item.type,
        significance: 0.3 + item.rehearsalCount * 0.1,
      }, {
        target: ENGINE_IDS.MEMORY_WRITE,
        priority: SIGNAL_PRIORITIES.LOW,
      });
    });
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'claude-response', 'emotion-detected'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (signal.type === 'bound-representation') {
        const bound = signal.payload as BoundRepresentation;
        this.extractAndStore(bound.content, 'user-input');
      } else if (signal.type === 'claude-response') {
        const response = signal.payload as { text: string };
        this.wm.add(response.text.slice(0, 100), 'fact', 'claude');
      } else if (signal.type === 'emotion-detected') {
        const emotions = signal.payload as { emotions: string[] };
        if (emotions.emotions.length > 0) {
          this.wm.add(emotions.emotions.join(', '), 'emotion', 'emotion-inference');
        }
      }
    }

    this.status = 'idle';
  }

  protected onIdle(): void {
    // Run decay on each tick
    const now = Date.now();
    const deltaMs = now - this.lastDecay;
    this.lastDecay = now;

    if (deltaMs > 0) {
      this.wm.decay(deltaMs);
      const arousal = this.selfState.get().arousal;
      const evicted = this.wm.enforceCapacity(arousal);

      if (evicted.length > 0 || this.wm.getItems().length > 0) {
        this.emitUpdate();
      }
    }

    const items = this.wm.getItems();
    this.debugInfo = `WM: ${items.length} items (cap: ${this.wm.getCapacity(this.selfState.get().arousal)})`;
    this.status = 'idle';
  }

  private extractAndStore(content: string, source: string): void {
    // Extract topics (significant words)
    const words = content.split(/\s+/).filter(w => w.length > 4);
    if (words.length > 0) {
      this.wm.add(content.slice(0, 80), 'topic', source, 0.8);
    }

    // Detect questions
    if (content.includes('?')) {
      this.wm.add(content, 'question', source, 0.9);
    }

    // Detect commitments (from system responses)
    if (/\b(I will|I'll|let me|I can|I should)\b/i.test(content)) {
      this.wm.add(content, 'commitment', source, 0.85);
    }

    this.emitUpdate();
  }

  private emitUpdate(): void {
    this.emit('working-memory-update', {
      items: this.wm.getItems(),
      summary: this.wm.getSummary(),
      capacity: this.wm.getCapacity(this.selfState.get().arousal),
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.BINDER],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });
  }

  getWorkingMemory(): WorkingMemory {
    return this.wm;
  }
}
