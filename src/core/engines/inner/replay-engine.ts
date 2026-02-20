import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType } from '../../types';
import { isSignal } from '../../types';

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
  private idleThreshold = 600; // ~10s

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
        // Stream thoughts with memory or reflection flavor trigger replay probabilistically
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

    this.status = 'idle';
  }

  private async triggerReplay(): Promise<void> {
    const now = Date.now();
    if (now - this.lastReplay < this.replayCooldown) return;
    this.lastReplay = now;

    try {
      // Get recent memories from server API
      const response = await fetch('/api/user/memories?limit=10');
      if (!response.ok) {
        this.debugInfo = 'No memories to replay (not authenticated?)';
        return;
      }

      const { memories } = (await response.json()) as { memories: MemoryResult[] };
      // Filter to significant memories
      const significant = memories.filter(m => m.significance >= 0.5);
      if (significant.length === 0) {
        this.debugInfo = 'No significant memories to replay';
        return;
      }

      // Select a random significant memory
      const memory = significant[Math.floor(Math.random() * significant.length)];

      this.status = 'processing';

      this.emit('replay-memory', {
        memory: memory.content,
        originalTimestamp: new Date(memory.createdAt).getTime(),
        significance: memory.significance,
        type: memory.type,
      }, {
        target: [ENGINE_IDS.MEMORY_WRITE, ENGINE_IDS.GROWTH],
        priority: SIGNAL_PRIORITIES.IDLE,
      });

      // Push replayed memory to consciousness stream
      this.selfState.pushStream({
        text: `Replaying: ${memory.content.slice(0, 80)}...`,
        source: 'replay',
        flavor: 'memory',
        timestamp: now,
        intensity: Math.min(1, memory.significance),
      });

      // Replaying memories slightly boosts significance (consolidation)
      this.selfState.nudge('curiosity', 0.01);

      this.debugInfo = `Replaying: "${memory.content.slice(0, 30)}..."`;
    } catch (err) {
      this.debugInfo = `Replay error: ${err}`;
    }

    this.status = 'idle';
  }
}
