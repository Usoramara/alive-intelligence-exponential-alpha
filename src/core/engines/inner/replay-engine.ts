import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface MemoryResult {
  id: string;
  content: string;
  type: string;
  significance: number;
  createdAt: string;
}

export class ReplayEngine extends Engine {
  private lastReplay = 0;
  private replayCooldown = 15000;
  private consecutiveIdleFrames = 0;
  private idleThreshold = 600;

  // Memory consolidation
  private memoryCache: MemoryResult[] = [];
  private lastConsolidation = 0;
  private consolidationCooldown = 60000;
  private isConsolidating = false;

  // Contextual replay: track recent conversation for relevance matching
  private recentContext: string[] = [];
  private contextEmbedding: number[] | null = null;

  constructor() {
    super(ENGINE_IDS.REPLAY);
  }

  protected subscribesTo(): SignalType[] {
    return ['default-mode-thought', 'stream-thought', 'bound-representation'];
  }

  protected process(signals: Signal[]): void {
    this.consecutiveIdleFrames = 0;

    for (const signal of signals) {
      if (isSignal(signal, 'bound-representation')) {
        // Track recent conversation for contextual memory selection
        const content = signal.payload.content;
        if (content) {
          this.recentContext.push(content);
          if (this.recentContext.length > 5) this.recentContext.shift();
          // Invalidate cached context embedding
          this.contextEmbedding = null;
        }
      } else if (isSignal(signal, 'stream-thought')) {
        const payload = signal.payload;
        if (payload.flavor === 'memory' || payload.flavor === 'reflection') {
          if (Math.random() < 0.3) {
            this.triggerReplay();
            return;
          }
        }
      } else if (isSignal(signal, 'default-mode-thought')) {
        this.triggerReplay();
        return;
      }
    }
    this.status = 'idle';
  }

  protected onIdle(): void {
    this.consecutiveIdleFrames++;

    if (this.consecutiveIdleFrames > this.idleThreshold) {
      this.triggerReplay();
    }

    // Memory consolidation during idle time
    const now = Date.now();
    if (now - this.lastConsolidation > this.consolidationCooldown) {
      this.consolidateMemories();
    }

    this.status = 'idle';
  }

  /**
   * Contextual memory replay: select memories relevant to current context
   * and generate a Haiku reflection rather than raw "Replaying: ..." templates.
   */
  private async triggerReplay(): Promise<void> {
    const now = Date.now();
    if (now - this.lastReplay < this.replayCooldown) return;
    this.lastReplay = now;

    try {
      const response = await fetch('/api/user/memories?limit=15');
      if (!response.ok) {
        this.debugInfo = 'No memories to replay';
        return;
      }

      const { memories } = (await response.json()) as { memories: MemoryResult[] };
      this.memoryCache = memories;

      const significant = memories.filter(m => m.significance >= 0.4);
      if (significant.length === 0) {
        this.debugInfo = 'No significant memories to replay';
        return;
      }

      // Select memory: prefer contextually relevant over random
      const memory = await this.selectContextualMemory(significant);
      if (!memory) return;

      this.status = 'processing';

      this.emit('replay-memory', {
        content: memory.content,
        significance: memory.significance,
        flavor: 'replay',
      }, {
        target: [ENGINE_IDS.MEMORY_WRITE, ENGINE_IDS.GROWTH],
        priority: SIGNAL_PRIORITIES.IDLE,
      });

      // Generate Haiku reflection on the memory instead of raw template
      await this.reflectOnMemory(memory);

      this.selfState.nudge('curiosity', 0.01);
      this.debugInfo = `Replaying: "${memory.content.slice(0, 30)}..."`;
    } catch (err) {
      this.debugInfo = `Replay error: ${err}`;
    }

    this.status = 'idle';
  }

  /**
   * Select a memory based on semantic relevance to current conversation context.
   * Falls back to significance-weighted random if no context or embeddings unavailable.
   */
  private async selectContextualMemory(memories: MemoryResult[]): Promise<MemoryResult | null> {
    if (memories.length === 0) return null;

    // If we have recent context and embeddings, select by relevance
    if (this.recentContext.length > 0 && isEmbeddingReady()) {
      // Compute or use cached context embedding
      if (!this.contextEmbedding) {
        const contextText = this.recentContext.join(' ');
        this.contextEmbedding = await embed(contextText) ?? null;
      }

      if (this.contextEmbedding) {
        // Score each memory by relevance to context
        const scored: Array<{ memory: MemoryResult; score: number }> = [];

        for (const mem of memories) {
          const memEmb = await embed(mem.content);
          if (memEmb) {
            const relevance = cosineSimilarity(this.contextEmbedding, memEmb);
            // Blend relevance with significance, prefer moderate relevance (not too obvious)
            const sweetSpot = relevance > 0.3 && relevance < 0.75 ? 0.2 : 0;
            const score = relevance * 0.5 + mem.significance * 0.3 + sweetSpot;
            scored.push({ memory: mem, score });
          }
        }

        if (scored.length > 0) {
          scored.sort((a, b) => b.score - a.score);
          return scored[0].memory;
        }
      }
    }

    // Fallback: significance-weighted random
    const totalSig = memories.reduce((s, m) => s + m.significance, 0);
    let r = Math.random() * totalSig;
    for (const mem of memories) {
      r -= mem.significance;
      if (r <= 0) return mem;
    }
    return memories[0];
  }

  /**
   * T1: Generate a genuine reflection on a replayed memory via Haiku.
   * Replaces raw "Replaying: content..." with contextual inner thought.
   */
  private async reflectOnMemory(memory: MemoryResult): Promise<void> {
    try {
      const state = this.selfState.get();
      const contextHint = this.recentContext.length > 0
        ? `Current conversation context: "${this.recentContext[this.recentContext.length - 1].slice(0, 100)}"`
        : 'Currently idle — no active conversation';

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [memory.content],
          mood: { valence: state.valence, arousal: state.arousal, energy: state.energy },
          count: 1,
          context: `MEMORY REPLAY REFLECTION:\nA memory has surfaced:\n"${memory.content}"\n${contextHint}\n\nGenerate a brief inner thought about why this memory came up now and what it means. First person, reflective, one sentence.`,
          flavorHints: ['memory'],
        }),
      });

      if (!response.ok) {
        // Fallback to simple stream entry
        this.pushSimpleReplay(memory);
        return;
      }

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const reflection = data.thought ?? data.thoughts?.[0]?.text;

      if (reflection) {
        this.selfState.pushStream({
          text: reflection,
          source: 'replay',
          flavor: 'memory',
          timestamp: Date.now(),
          intensity: Math.min(1, memory.significance),
        });
      } else {
        this.pushSimpleReplay(memory);
      }
    } catch {
      this.pushSimpleReplay(memory);
    }
  }

  private pushSimpleReplay(memory: MemoryResult): void {
    this.selfState.pushStream({
      text: `A memory surfaces... ${memory.content.slice(0, 80)}`,
      source: 'replay',
      flavor: 'memory',
      timestamp: Date.now(),
      intensity: Math.min(1, memory.significance * 0.8),
    });
  }

  /**
   * Memory consolidation: connect related memories, find themes, extract procedural knowledge.
   */
  private async consolidateMemories(): Promise<void> {
    if (this.isConsolidating) return;
    if (this.memoryCache.length < 3) return;

    this.lastConsolidation = Date.now();
    this.isConsolidating = true;

    try {
      if (isEmbeddingReady()) {
        const memoriesWithEmbeddings: Array<{ memory: MemoryResult; embedding: number[] }> = [];

        for (const mem of this.memoryCache.slice(0, 5)) {
          const emb = await embed(mem.content);
          if (emb) {
            memoriesWithEmbeddings.push({ memory: mem, embedding: emb });
          }
        }

        // Find pairs with moderate similarity (thematic connections)
        const connections: Array<{ a: string; b: string; similarity: number }> = [];

        for (let i = 0; i < memoriesWithEmbeddings.length; i++) {
          for (let j = i + 1; j < memoriesWithEmbeddings.length; j++) {
            const sim = cosineSimilarity(
              memoriesWithEmbeddings[i].embedding,
              memoriesWithEmbeddings[j].embedding,
            );
            if (sim > 0.4 && sim < 0.85) {
              connections.push({
                a: memoriesWithEmbeddings[i].memory.content,
                b: memoriesWithEmbeddings[j].memory.content,
                similarity: sim,
              });
            }
          }
        }

        if (connections.length > 0) {
          const bestConnection = connections.sort((a, b) => b.similarity - a.similarity)[0];

          try {
            const response = await fetch('/api/mind/reflect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                memories: [bestConnection.a, bestConnection.b],
                mood: this.selfState.get(),
                count: 1,
                context: `MEMORY CONSOLIDATION:\nThese two memories seem connected:\n1. "${bestConnection.a}"\n2. "${bestConnection.b}"\n\nWhat theme or insight connects them? What pattern does this suggest?`,
                flavorHints: ['memory'],
              }),
            });

            if (response.ok) {
              const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
              const synthesis = data.thought ?? data.thoughts?.[0]?.text;

              if (synthesis) {
                this.selfState.pushStream({
                  text: synthesis,
                  source: 'replay',
                  flavor: 'memory',
                  timestamp: Date.now(),
                  intensity: 0.5,
                });

                this.emit('memory-write', {
                  content: `[consolidated] ${synthesis}`,
                  significance: 0.6,
                }, {
                  target: ENGINE_IDS.MEMORY_WRITE,
                  priority: SIGNAL_PRIORITIES.IDLE,
                });

                this.debugInfo = `Consolidated: "${synthesis.slice(0, 40)}..."`;
              }
            }
          } catch {
            // Non-critical
          }
        }
      }
    } catch {
      // Non-critical
    } finally {
      this.isConsolidating = false;
    }
  }
}
