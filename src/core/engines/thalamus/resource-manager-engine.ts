import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';

interface ResourceBudget {
  sonnetRemaining: number;
  haikuRemaining: number;
  suggestedMaxTokens: number;
  useLite: boolean; // Should arbiter use think-lite instead of think?
}

interface CallRecord {
  timestamp: number;
  model: 'sonnet' | 'haiku';
}

export class ResourceManagerEngine extends Engine {
  private callHistory: CallRecord[] = [];
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  private readonly SONNET_BUDGET = 10;
  private readonly HAIKU_BUDGET = 50;

  // Latest context for adaptive token allocation
  private latestSurprise = 0;
  private latestProcessingLoad = 0;

  constructor() {
    super(ENGINE_IDS.RESOURCE_MANAGER);
  }

  protected subscribesTo(): SignalType[] {
    return ['claude-response', 'prediction-error', 'metacognition-update'];
  }

  protected process(signals: Signal[]): void {
    const now = Date.now();

    for (const signal of signals) {
      if (signal.type === 'claude-response') {
        // Track Sonnet call (main think endpoint uses Sonnet)
        this.callHistory.push({ timestamp: now, model: 'sonnet' });
      }

      if (signal.type === 'prediction-error') {
        const error = signal.payload as { surpriseLevel: number };
        this.latestSurprise = error.surpriseLevel;
      }

      if (signal.type === 'metacognition-update') {
        const meta = signal.payload as { processingLoad: number };
        this.latestProcessingLoad = meta.processingLoad;
      }
    }

    // Clean old call records
    this.callHistory = this.callHistory.filter(c => now - c.timestamp < this.WINDOW_MS);

    // Compute budget
    const sonnetCalls = this.callHistory.filter(c => c.model === 'sonnet').length;
    const haikuCalls = this.callHistory.filter(c => c.model === 'haiku').length;

    const sonnetRemaining = Math.max(0, this.SONNET_BUDGET - sonnetCalls);
    const haikuRemaining = Math.max(0, this.HAIKU_BUDGET - haikuCalls);

    // Adaptive max tokens
    let suggestedMaxTokens = 300;
    if (this.latestSurprise > 0.6) suggestedMaxTokens = 400; // High surprise → more tokens for thoughtful response
    if (this.latestProcessingLoad > 0.7) suggestedMaxTokens = 200; // Overloaded → fewer tokens
    if (sonnetRemaining <= 2) suggestedMaxTokens = 150; // Budget low → conserve

    const useLite = sonnetRemaining === 0;

    const budget: ResourceBudget = {
      sonnetRemaining,
      haikuRemaining,
      suggestedMaxTokens,
      useLite,
    };

    this.emit('resource-budget', budget, {
      target: ENGINE_IDS.ARBITER,
      priority: SIGNAL_PRIORITIES.LOW,
    });

    this.debugInfo = `Budget: S=${sonnetRemaining}/${this.SONNET_BUDGET} H=${haikuRemaining}/${this.HAIKU_BUDGET}${useLite ? ' [LITE]' : ''}`;
    this.status = 'idle';
  }

  // Public method to record Haiku calls from ToM/Imagination engines
  recordHaikuCall(): void {
    this.callHistory.push({ timestamp: Date.now(), model: 'haiku' });
  }
}
