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
  private consolidationCooldown = 60000; // 60s between consolidations
  private isConsolidating = false;

  constructor() {
    super(ENGINE_IDS.REPLAY);
  }

  protected subscribesTo(): SignalType[] {
    return ['default-mode-thought', 'stream-thought'];
  }

  protected process(signals: Signal[]): void {
    this.consecutiveIdleFrames = 0;

    for (const signal of signals) {
      if (isSignal(signal, 'stream-thought')) {
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

  private async triggerReplay(): Promise<void> {
    const now = Date.now();
    if (now - this.lastReplay < this.replayCooldown) return;
    this.lastReplay = now;

    try {
      const response = await fetch('/api/user/memories?limit=10');
      if (!response.ok) {
        this.debugInfo = 'No memories to replay (not authenticated?)';
        return;
      }

      const { memories } = (await response.json()) as { memories: MemoryResult[] };
      this.memoryCache = memories;

      const significant = memories.filter(m => m.significance >= 0.5);
      if (significant.length === 0) {
        this.debugInfo = 'No significant memories to replay';
        return;
      }

      const memory = significant[Math.floor(Math.random() * significant.length)];
      this.status = 'processing';

      this.emit('replay-memory', {
        content: memory.content,
        significance: memory.significance,
        flavor: 'replay',
      }, {
        target: [ENGINE_IDS.MEMORY_WRITE, ENGINE_IDS.GROWTH],
        priority: SIGNAL_PRIORITIES.IDLE,
      });

      this.selfState.pushStream({
        text: `Replaying: ${memory.content.slice(0, 80)}...`,
        source: 'replay',
        flavor: 'memory',
        timestamp: now,
        intensity: Math.min(1, memory.significance),
      });

      this.selfState.nudge('curiosity', 0.01);
      this.debugInfo = `Replaying: "${memory.content.slice(0, 30)}..."`;
    } catch (err) {
      this.debugInfo = `Replay error: ${err}`;
    }

    this.status = 'idle';
  }

  /**
   * Memory consolidation: connect related memories, find themes, extract procedural knowledge.
   * Runs during idle periods — genuine "dreaming" consolidation.
   */
  private async consolidateMemories(): Promise<void> {
    if (this.isConsolidating) return;
    if (this.memoryCache.length < 3) return;

    this.lastConsolidation = Date.now();
    this.isConsolidating = true;

    try {
      // Step 1: Find thematic connections between recent memories via embeddings
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

        // Step 2: Synthesize connections via Haiku
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
                // Push consolidation insight to consciousness stream
                this.selfState.pushStream({
                  text: synthesis,
                  source: 'replay',
                  flavor: 'memory',
                  timestamp: Date.now(),
                  intensity: 0.5,
                });

                // Write the synthesis as a new semantic memory
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
