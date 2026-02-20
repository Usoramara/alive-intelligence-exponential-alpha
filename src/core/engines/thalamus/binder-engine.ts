import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType, AttentionFocus, BoundRepresentation } from '../../types';

export class BinderEngine extends Engine {
  private recentFoci: AttentionFocus[] = [];
  private memoryContext: string[] = [];

  constructor() {
    super(ENGINE_IDS.BINDER);
  }

  protected subscribesTo(): SignalType[] {
    return ['attention-focus', 'memory-result', 'empathic-state'];
  }

  protected process(signals: Signal[]): void {
    let hasNewFocus = false;

    for (const signal of signals) {
      if (isSignal(signal, 'attention-focus')) {
        this.recentFoci.push(signal.payload);
        if (this.recentFoci.length > 5) this.recentFoci.shift();
        hasNewFocus = true;
      } else if (isSignal(signal, 'memory-result')) {
        const memories = signal.payload;
        this.memoryContext = memories.items || [];
      }
    }

    // Only emit bound-representation when we have a NEW focus
    if (!hasNewFocus) return;

    const latestFocus = this.recentFoci[this.recentFoci.length - 1];
    if (!latestFocus) return;

    const bound: BoundRepresentation = {
      content: latestFocus.content,
      context: [
        ...this.memoryContext.slice(0, 3),
        ...this.recentFoci.slice(0, -1).map(f => f.content),
      ],
      selfState: this.selfState.get(),
      timestamp: Date.now(),
      // Need Claude for actual text responses
      needsClaude: latestFocus.modality === 'text' && latestFocus.content.length > 0,
    };

    // Forward to arbiter for action selection
    this.emit('bound-representation', bound, {
      target: ENGINE_IDS.ARBITER,
      priority: SIGNAL_PRIORITIES.HIGH,
    });

    // Also forward to ToM, Imagination, and Growth for deeper processing
    this.emit('bound-representation', bound, {
      target: [ENGINE_IDS.TOM, ENGINE_IDS.IMAGINATION, ENGINE_IDS.GROWTH],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    this.debugInfo = `Bound: "${latestFocus.content.slice(0, 20)}..." + ${this.memoryContext.length} ctx`;
    this.status = 'idle';
  }
}
