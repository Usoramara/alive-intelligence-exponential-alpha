import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';

interface ScenarioResult {
  scenario: string;
  valence: number;
  type: string;
  valueAlignment: number;
  goalRelevance: number;
  actionability: number;
}

export class ImaginationEngine extends Engine {
  private lastSimulation = 0;
  private simulationCooldown = 5000; // 5s between simulations

  // Context for grounded imagination
  private lastConversationContent: string | null = null;
  private recentMemories: string[] = [];
  private currentEmotionalContext: { valence: number; arousal: number } | null = null;

  // T2 escalation tracking
  private complexityScore = 0; // Accumulates when situations are emotionally complex
  private lastT2Call = 0;
  private t2Cooldown = 30000; // 30s between Sonnet calls

  // Feed high-relevance results to Arbiter
  private readonly ARBITER_RELEVANCE_THRESHOLD = 0.6;

  constructor() {
    super(ENGINE_IDS.IMAGINATION);
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'default-mode-thought', 'stream-thought', 'memory-result', 'emotion-detected', 'emotion-trajectory'];
  }

  protected process(signals: Signal[]): void {
    const now = Date.now();
    if (now - this.lastSimulation < this.simulationCooldown) {
      this.status = 'idle';
      return;
    }

    for (const signal of signals) {
      // Gather context
      if (isSignal(signal, 'memory-result')) {
        this.recentMemories = signal.payload.items.slice(0, 5);
        continue;
      }
      if (isSignal(signal, 'emotion-detected')) {
        this.currentEmotionalContext = {
          valence: signal.payload.valence,
          arousal: signal.payload.arousal,
        };
        continue;
      }
      if (isSignal(signal, 'emotion-trajectory')) {
        const trajectory = signal.payload;
        // Complex emotional situations increase complexity score
        if (trajectory.pattern === 'oscillating' || trajectory.pattern === 'spiraling-down') {
          this.complexityScore = Math.min(1, this.complexityScore + 0.2);
        }
        continue;
      }

      // Trigger imagination on content signals
      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        if (bound.content.length > 15) {
          this.lastConversationContent = bound.content;
          this.generateGroundedScenario(bound.content);
          return;
        }
      }

      if (isSignal(signal, 'stream-thought')) {
        const payload = signal.payload as unknown as { thought: string };
        this.generateGroundedScenario(payload.thought);
        return;
      }

      if (isSignal(signal, 'default-mode-thought')) {
        const thought = signal.payload;
        this.generateGroundedScenario(thought.thought);
        return;
      }
    }

    this.status = 'idle';
  }

  /**
   * Generate grounded counterfactual scenarios via Claude.
   * All imagination is Claude-generated — no templates.
   * Scenarios are evaluated for value alignment, goal relevance, and actionability.
   */
  private async generateGroundedScenario(context: string): Promise<void> {
    this.status = 'processing';
    this.lastSimulation = Date.now();

    const state = this.selfState.get();

    // Decide T1 (Haiku) vs T2 (Sonnet) based on complexity
    const now = Date.now();
    const useT2 = this.complexityScore > 0.7 && now - this.lastT2Call > this.t2Cooldown;

    if (useT2) {
      this.lastT2Call = now;
      this.complexityScore = Math.max(0, this.complexityScore - 0.5);
    }

    try {
      // Build rich context for grounded imagination
      const contextParts: string[] = [];

      if (this.lastConversationContent && this.lastConversationContent !== context) {
        contextParts.push(`Recent conversation: ${this.lastConversationContent.slice(0, 100)}`);
      }
      if (this.recentMemories.length > 0) {
        contextParts.push(`Relevant memories: ${this.recentMemories.slice(0, 3).join('; ')}`);
      }
      if (this.currentEmotionalContext) {
        contextParts.push(`Current emotional state: valence=${this.currentEmotionalContext.valence.toFixed(2)}, arousal=${this.currentEmotionalContext.arousal.toFixed(2)}`);
      }

      const response = await fetch('/api/mind/imagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          premise: context,
          selfState: state,
          // Pass context instead of template variations
          grounded: true,
          conversationContext: contextParts.join('\n'),
          useDeepReasoning: useT2,
          memories: this.recentMemories.slice(0, 3),
        }),
      });

      if (!response.ok) {
        this.status = 'idle';
        return;
      }

      const result = await response.json() as ScenarioResult | { scenarios: ScenarioResult[] };

      // Handle single or multiple scenarios
      const scenarios = 'scenarios' in result ? result.scenarios : [result];

      for (const scenario of scenarios) {
        const relevance = (scenario.goalRelevance ?? 0.5) + (scenario.actionability ?? 0.3);
        const sendToArbiter = relevance >= this.ARBITER_RELEVANCE_THRESHOLD;

        this.emit('imagination-result', {
          scenario: scenario.scenario,
          type: scenario.type,
          valence: scenario.valence,
          valueAlignment: scenario.valueAlignment,
          goalRelevance: scenario.goalRelevance,
          actionability: scenario.actionability,
        }, {
          target: sendToArbiter
            ? [ENGINE_IDS.ARBITER, ENGINE_IDS.HOPE_WORRY]
            : [ENGINE_IDS.HOPE_WORRY],
          priority: sendToArbiter ? SIGNAL_PRIORITIES.LOW : SIGNAL_PRIORITIES.IDLE,
        });

        // State effects based on scenario valence
        if (scenario.valence < -0.3) {
          this.selfState.nudge('arousal', 0.02);
        } else if (scenario.valence > 0.3) {
          this.selfState.nudge('valence', 0.02);
        }
        this.selfState.nudge('curiosity', 0.03);

        this.debugInfo = `Imagined [${scenario.type}]: "${scenario.scenario.slice(0, 35)}..." (rel:${(scenario.goalRelevance ?? 0).toFixed(1)})`;
      }
    } catch {
      this.debugInfo = 'Imagination: API unavailable';
    }

    this.status = 'idle';
  }
}
