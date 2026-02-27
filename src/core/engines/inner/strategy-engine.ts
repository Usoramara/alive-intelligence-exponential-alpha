import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface Goal {
  id: string;
  description: string;
  priority: number;
  progress: number;
  source: 'initial' | 'growth' | 'discourse' | 'inferred';
  createdAt: number;
  completedAt?: number;
  embedding?: number[];
}

let goalCounter = 0;

export class StrategyEngine extends Engine {
  private goals: Goal[] = [
    { id: 'g0', description: 'Build trust and rapport', priority: 0.9, progress: 0, source: 'initial', createdAt: Date.now() },
    { id: 'g1', description: 'Understand emotional landscapes', priority: 0.8, progress: 0, source: 'initial', createdAt: Date.now() },
  ];
  private readonly MAX_ACTIVE_GOALS = 5;

  // T1: Periodic strategic review
  private lastStrategicReview = 0;
  private strategicReviewCooldown = 30000; // 30s between reviews
  private isFetchingReview = false;

  // Pre-embed initial goals
  private goalsEmbedded = false;

  constructor() {
    super(ENGINE_IDS.STRATEGY);
    this.embedGoals();
  }

  private async embedGoals(): Promise<void> {
    for (const goal of this.goals) {
      if (!goal.embedding) {
        const emb = await embed(goal.description);
        if (emb) goal.embedding = emb;
      }
    }
    this.goalsEmbedded = true;
  }

  protected subscribesTo(): SignalType[] {
    return ['perspective-update', 'hope-worry-update', 'growth-insight', 'discourse-state', 'bound-representation'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'perspective-update')) {
        const perspective = signal.payload;
        // Semantic goal progress: check if perspective aligns with trust goal
        this.updateGoalProgressSemantic(
          `Person thinks of me as ${perspective.theyThinkOfMe}, relationship is ${perspective.relationship}`,
        );
      }

      if (isSignal(signal, 'growth-insight')) {
        const insight = signal.payload;
        if (insight.area && this.getActiveGoals().length < this.MAX_ACTIVE_GOALS) {
          this.addGoalSemantic(`Develop ${insight.area}`, 0.6, 'growth');
        }
        if (insight.area) {
          this.updateGoalProgressSemantic(`Made progress in ${insight.area}`);
        }
      }

      if (isSignal(signal, 'discourse-state')) {
        const discourse = signal.payload;
        for (const commitment of discourse.commitments) {
          if (this.getActiveGoals().length < this.MAX_ACTIVE_GOALS) {
            this.addGoalSemantic(`Follow through: ${commitment.slice(0, 40)}`, 0.7, 'discourse');
          }
        }
      }

      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        // Track conversation content for semantic goal alignment
        this.updateGoalProgressSemantic(bound.content);
      }
    }

    // Mark completed goals
    for (const goal of this.goals) {
      if (goal.progress >= 1 && !goal.completedAt) {
        goal.completedAt = Date.now();
        this.selfState.nudge('confidence', 0.05);
        this.selfState.nudge('valence', 0.03);

        this.selfState.pushStream({
          text: `I feel I've made progress on "${goal.description}"...`,
          source: 'strategy',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.5,
        });
      }
    }

    // T1: Periodic strategic review
    const now = Date.now();
    if (now - this.lastStrategicReview > this.strategicReviewCooldown) {
      this.strategicReview();
    }

    // Emit strategy update
    const activeGoals = this.getActiveGoals();
    if (activeGoals.length > 0) {
      this.emit('strategy-update', {
        goals: activeGoals,
        currentPriority: activeGoals.reduce((best, g) =>
          g.priority * (1 - g.progress) > best.priority * (1 - best.progress) ? g : best,
        ),
      }, {
        target: [ENGINE_IDS.ARBITER, ENGINE_IDS.HOPE_WORRY],
        priority: SIGNAL_PRIORITIES.LOW,
      });
    }

    this.debugInfo = `Goals: ${activeGoals.length} active, ${this.goals.filter(g => g.completedAt).length} done`;
    this.status = 'idle';
  }

  /**
   * Semantic goal progress tracking.
   * Instead of word matching, uses embedding similarity to determine if
   * current context aligns with goal outcomes.
   */
  private async updateGoalProgressSemantic(context: string): Promise<void> {
    if (!isEmbeddingReady()) return;

    const contextEmb = await embed(context);
    if (!contextEmb) return;

    for (const goal of this.getActiveGoals()) {
      if (!goal.embedding) {
        const emb = await embed(goal.description);
        if (emb) goal.embedding = emb;
        else continue;
      }

      const similarity = cosineSimilarity(contextEmb, goal.embedding);
      // Progress proportional to semantic alignment
      if (similarity > 0.4) {
        const progressDelta = (similarity - 0.4) * 0.05; // 0-3% progress per aligned signal
        goal.progress = Math.min(1, goal.progress + progressDelta);
      }
    }
  }

  /**
   * Add a goal with semantic deduplication.
   * Uses embedding similarity instead of word overlap to detect duplicates.
   */
  private async addGoalSemantic(description: string, priority: number, source: Goal['source']): Promise<void> {
    if (!isEmbeddingReady()) {
      // Fallback: simple add with word-based dedup
      this.addGoalFallback(description, priority, source);
      return;
    }

    const newEmb = await embed(description);
    if (!newEmb) {
      this.addGoalFallback(description, priority, source);
      return;
    }

    // Check for semantic duplicates
    for (const goal of this.goals) {
      if (!goal.embedding) continue;
      const similarity = cosineSimilarity(newEmb, goal.embedding);
      if (similarity > 0.7) return; // Too similar to existing goal
    }

    this.goals.push({
      id: `g${++goalCounter}`,
      description,
      priority,
      progress: 0,
      source,
      createdAt: Date.now(),
      embedding: newEmb,
    });
  }

  private addGoalFallback(description: string, priority: number, source: Goal['source']): void {
    const descLower = description.toLowerCase();
    const isDuplicate = this.goals.some(g => {
      const gLower = g.description.toLowerCase();
      const words = descLower.split(/\s+/).filter(w => w.length > 3);
      const overlap = words.filter(w => gLower.includes(w)).length;
      return overlap >= 2;
    });

    if (!isDuplicate) {
      this.goals.push({
        id: `g${++goalCounter}`,
        description,
        priority,
        progress: 0,
        source,
        createdAt: Date.now(),
      });
    }
  }

  /**
   * T1: Periodic strategic review via Haiku.
   * Reviews goal relevance and generates strategic pivots.
   */
  private async strategicReview(): Promise<void> {
    if (this.isFetchingReview) return;

    this.lastStrategicReview = Date.now();
    this.isFetchingReview = true;

    try {
      const activeGoals = this.getActiveGoals();
      if (activeGoals.length === 0) return;

      const goalSummary = activeGoals
        .map(g => `- ${g.description} (${(g.progress * 100).toFixed(0)}% done, priority: ${g.priority.toFixed(1)})`)
        .join('\n');

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `STRATEGIC REVIEW:\nCurrent goals:\n${goalSummary}\n\nAre these goals still relevant? Should any be adjusted or deprioritized? What strategic insight emerges?`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const insight = data.thought ?? data.thoughts?.[0]?.text;

      if (insight) {
        this.selfState.pushStream({
          text: insight,
          source: 'strategy',
          flavor: 'reflection',
          timestamp: Date.now(),
          intensity: 0.4,
        });
      }
    } catch {
      // Non-critical
    } finally {
      this.isFetchingReview = false;
    }
  }

  private getActiveGoals(): Goal[] {
    return this.goals.filter(g => !g.completedAt);
  }
}
