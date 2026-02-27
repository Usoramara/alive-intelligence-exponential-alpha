import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import type { EngineId } from '../../constants';

interface ResourceBudget {
  sonnetRemaining: number;
  haikuRemaining: number;
  suggestedMaxTokens: number;
  useLite: boolean;
  haikuUtilization: number; // 0-1 how much of Haiku budget is used
  sonnetUtilization: number; // 0-1 how much of Sonnet budget is used
  topConsumers: Array<{ engine: string; calls: number }>;
}

interface CallRecord {
  timestamp: number;
  model: 'sonnet' | 'haiku';
  engine: string;
}

// Per-engine Haiku budgets — engines that make frequent T1 calls get higher allocations
const ENGINE_HAIKU_BUDGETS: Partial<Record<EngineId, number>> = {
  [ENGINE_IDS.EMOTION_INFERENCE]: 20,
  [ENGINE_IDS.TOM]: 15,
  [ENGINE_IDS.IMAGINATION]: 12,
  [ENGINE_IDS.DEFAULT_MODE]: 15,
  [ENGINE_IDS.METACOGNITION]: 10,
  [ENGINE_IDS.WORKING_MEMORY]: 8,
  [ENGINE_IDS.DISCOURSE]: 8,
  [ENGINE_IDS.PERSPECTIVE]: 8,
  [ENGINE_IDS.REPLAY]: 6,
  [ENGINE_IDS.INTUITION]: 5,
  [ENGINE_IDS.GROWTH]: 5,
  [ENGINE_IDS.VALUES]: 5,
  [ENGINE_IDS.STRATEGY]: 5,
  [ENGINE_IDS.HOPE_WORRY]: 5,
  [ENGINE_IDS.PREDICTION]: 5,
};

export class ResourceManagerEngine extends Engine {
  private callHistory: CallRecord[] = [];
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  // Upgraded budgets for the exponential architecture
  private readonly SONNET_BUDGET = 18;
  private readonly HAIKU_BUDGET = 130;

  // Dynamic allocation multiplier based on conversational intensity
  private conversationalIntensity = 0.5; // 0 = idle, 1 = intense conversation
  private lastUserInputTime = 0;
  private messageCount = 0;
  private lastMessageCountReset = Date.now();

  // Latest context for adaptive token allocation
  private latestSurprise = 0;
  private latestProcessingLoad = 0;
  private latestUncertainty = 0;

  constructor() {
    super(ENGINE_IDS.RESOURCE_MANAGER);
  }

  protected subscribesTo(): SignalType[] {
    return ['claude-response', 'prediction-error', 'metacognition-update', 'bound-representation'];
  }

  protected process(signals: Signal[]): void {
    const now = Date.now();

    for (const signal of signals) {
      if (isSignal(signal, 'claude-response')) {
        this.callHistory.push({ timestamp: now, model: 'sonnet', engine: 'arbiter' });
      }

      if (isSignal(signal, 'prediction-error')) {
        const error = signal.payload;
        this.latestSurprise = error.surpriseLevel;
      }

      if (isSignal(signal, 'metacognition-update')) {
        const meta = signal.payload;
        this.latestProcessingLoad = meta.processingLoad;
        this.latestUncertainty = meta.uncertainty;
      }

      if (isSignal(signal, 'bound-representation')) {
        this.lastUserInputTime = now;
        this.messageCount++;
      }
    }

    // Update conversational intensity
    this.updateIntensity(now);

    // Clean old call records
    this.callHistory = this.callHistory.filter(c => now - c.timestamp < this.WINDOW_MS);

    // Compute usage
    const sonnetCalls = this.callHistory.filter(c => c.model === 'sonnet').length;
    const haikuCalls = this.callHistory.filter(c => c.model === 'haiku').length;

    // Dynamic budget adjustment based on conversational intensity
    const intensityMultiplier = 0.7 + this.conversationalIntensity * 0.6; // 0.7x to 1.3x
    const effectiveHaikuBudget = Math.round(this.HAIKU_BUDGET * intensityMultiplier);
    const effectiveSonnetBudget = Math.round(this.SONNET_BUDGET * intensityMultiplier);

    const sonnetRemaining = Math.max(0, effectiveSonnetBudget - sonnetCalls);
    const haikuRemaining = Math.max(0, effectiveHaikuBudget - haikuCalls);

    // Adaptive max tokens
    let suggestedMaxTokens = 300;
    if (this.latestSurprise > 0.6) suggestedMaxTokens = 400;
    if (this.latestUncertainty > 0.7) suggestedMaxTokens = 350; // Uncertain → more thoughtful response
    if (this.latestProcessingLoad > 0.7) suggestedMaxTokens = 200;
    if (sonnetRemaining <= 3) suggestedMaxTokens = 150;

    const useLite = sonnetRemaining === 0;

    // Per-engine breakdown
    const engineCallCounts = new Map<string, number>();
    for (const call of this.callHistory) {
      if (call.model === 'haiku') {
        engineCallCounts.set(call.engine, (engineCallCounts.get(call.engine) || 0) + 1);
      }
    }

    const topConsumers = Array.from(engineCallCounts.entries())
      .map(([engine, calls]) => ({ engine, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5);

    const budget: ResourceBudget = {
      sonnetRemaining,
      haikuRemaining,
      suggestedMaxTokens,
      useLite,
      haikuUtilization: effectiveHaikuBudget > 0 ? haikuCalls / effectiveHaikuBudget : 0,
      sonnetUtilization: effectiveSonnetBudget > 0 ? sonnetCalls / effectiveSonnetBudget : 0,
      topConsumers,
    };

    this.emit('resource-budget', budget, {
      target: ENGINE_IDS.ARBITER,
      priority: SIGNAL_PRIORITIES.LOW,
    });

    this.debugInfo = `Budget: S=${sonnetRemaining}/${effectiveSonnetBudget} H=${haikuRemaining}/${effectiveHaikuBudget} int=${(this.conversationalIntensity * 100).toFixed(0)}%${useLite ? ' [LITE]' : ''}`;
    this.status = 'idle';
  }

  /**
   * Update conversational intensity based on message frequency and recency.
   */
  private updateIntensity(now: number): void {
    // Reset message count every 5 minutes
    if (now - this.lastMessageCountReset > this.WINDOW_MS) {
      this.messageCount = 0;
      this.lastMessageCountReset = now;
    }

    // Recency factor: how recently was last user input (decays over 60s)
    const timeSinceInput = now - this.lastUserInputTime;
    const recencyFactor = Math.max(0, 1 - timeSinceInput / 60000);

    // Frequency factor: messages per minute in current window
    const windowMinutes = Math.max(1, (now - this.lastMessageCountReset) / 60000);
    const messagesPerMinute = this.messageCount / windowMinutes;
    const frequencyFactor = Math.min(1, messagesPerMinute / 5); // 5 msg/min = max

    // Blend
    this.conversationalIntensity =
      this.conversationalIntensity * 0.7 +
      (recencyFactor * 0.6 + frequencyFactor * 0.4) * 0.3;
  }

  /**
   * Record a Haiku call from a specific engine.
   * Called by engines that make T1 Haiku calls for per-engine budget tracking.
   */
  recordHaikuCall(engine?: string): void {
    this.callHistory.push({
      timestamp: Date.now(),
      model: 'haiku',
      engine: engine ?? 'unknown',
    });
  }

  /**
   * Check if a specific engine has remaining Haiku budget.
   * Returns true if the engine can make another call within its allocation.
   */
  canEngineCallHaiku(engineId: EngineId): boolean {
    const now = Date.now();
    const engineBudget = ENGINE_HAIKU_BUDGETS[engineId];
    if (engineBudget === undefined) return true; // Untracked engines default to allowed

    const engineCalls = this.callHistory.filter(
      c => c.model === 'haiku' && c.engine === engineId && now - c.timestamp < this.WINDOW_MS,
    ).length;

    // Scale per-engine budget by intensity
    const intensityMultiplier = 0.7 + this.conversationalIntensity * 0.6;
    const effectiveBudget = Math.round(engineBudget * intensityMultiplier);

    return engineCalls < effectiveBudget;
  }

  /**
   * Record a Sonnet call from a specific engine.
   */
  recordSonnetCall(engine?: string): void {
    this.callHistory.push({
      timestamp: Date.now(),
      model: 'sonnet',
      engine: engine ?? 'arbiter',
    });
  }
}
