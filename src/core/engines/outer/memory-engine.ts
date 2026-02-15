import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { searchMemories, getMemories, type MemoryRecord } from '@/lib/indexed-db';

interface AttentionFocus {
  content: string;
  modality: string;
  salience: number;
}

// Words associated with positive/negative mood for congruent recall boosting
const NEGATIVE_WORDS = /\b(sad|lost|pain|hurt|died|death|grief|miss|lonely|afraid|angry|broken|failed|regret)\b/i;
const POSITIVE_WORDS = /\b(happy|joy|love|beautiful|grateful|wonderful|kind|warm|hope|bright|success|proud)\b/i;

export class MemoryEngine extends Engine {
  private recentRecalls: MemoryRecord[] = [];
  private lastHaikuRecall = 0;
  private haikuCooldown = 5000; // 5s between Haiku recall calls

  constructor() {
    super(ENGINE_IDS.MEMORY);
  }

  protected subscribesTo(): SignalType[] {
    return ['attention-focus', 'memory-query'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (signal.type === 'attention-focus') {
        const focus = signal.payload as AttentionFocus;
        this.recall(focus.content, focus.salience);
      } else if (signal.type === 'memory-query') {
        const query = signal.payload as { query: string };
        this.recall(query.query, 0.6);
      }
    }
  }

  private async recall(query: string, salience = 0): Promise<void> {
    this.status = 'processing';

    try {
      const results = await searchMemories(query, 5);
      this.recentRecalls = results;

      if (results.length > 0) {
        // Mood-congruent re-ranking: boost memories matching current emotional state
        const selfState = this.selfState.get();
        const rankedResults = this.moodCongruentRerank(results, selfState.valence);

        this.emit('memory-result', {
          items: rankedResults.map(r => r.content),
          records: rankedResults,
        }, {
          target: [ENGINE_IDS.BINDER, ENGINE_IDS.IMAGINATION, ENGINE_IDS.DEFAULT_MODE, ENGINE_IDS.ARBITER],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.debugInfo = `Recalled ${rankedResults.length} memories (mood-ranked)`;
      } else {
        this.debugInfo = 'No memories found';
      }

      // Gate Haiku semantic recall on energy > 0.2 (low energy → skip expensive API call)
      const selfState = this.selfState.get();
      const now = Date.now();
      if (salience > 0.5 && selfState.energy > 0.2 && now - this.lastHaikuRecall > this.haikuCooldown) {
        this.lastHaikuRecall = now;
        this.recallWithHaiku(query);
      }
    } catch (err) {
      this.debugInfo = `Recall error: ${err}`;
    }

    this.status = 'idle';
  }

  private moodCongruentRerank(results: MemoryRecord[], valence: number): MemoryRecord[] {
    if (Math.abs(valence) < 0.15) return results; // Near-neutral: no re-ranking

    const scored = results.map(r => {
      let boost = 0;
      if (valence < -0.15) {
        // Sad mood → boost negative-word memories
        if (NEGATIVE_WORDS.test(r.content)) boost += 0.2;
      } else if (valence > 0.15) {
        // Happy mood → boost positive-word memories
        if (POSITIVE_WORDS.test(r.content)) boost += 0.2;
      }
      return { record: r, score: (r.significance ?? 0.5) + boost };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.record);
  }

  private async recallWithHaiku(query: string): Promise<void> {
    try {
      // Fetch a broader set of candidates from IndexedDB
      const candidates = await getMemories({ limit: 30 });
      if (candidates.length === 0) return;

      const response = await fetch('/api/mind/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          candidates: candidates.map(c => ({
            id: c.id,
            content: c.content,
            significance: c.significance,
          })),
        }),
      });

      if (!response.ok) return;

      const { ranked } = (await response.json()) as {
        ranked: Array<{ id: string; content: string; relevance: number }>;
      };

      if (ranked.length > 0) {
        // Emit supplemental semantic memory results
        this.emit('memory-result', {
          items: ranked.slice(0, 5).map(r => r.content),
          records: ranked.slice(0, 5),
          source: 'semantic',
        }, {
          target: [ENGINE_IDS.BINDER, ENGINE_IDS.IMAGINATION, ENGINE_IDS.DEFAULT_MODE, ENGINE_IDS.ARBITER],
          priority: SIGNAL_PRIORITIES.MEDIUM,
        });

        this.debugInfo = `Semantic recall: ${ranked.length} relevant memories`;
      }
    } catch {
      // Fire-and-forget — don't let failures affect the pipeline
    }
  }

  protected onIdle(): void {
    this.status = 'idle';
  }
}
