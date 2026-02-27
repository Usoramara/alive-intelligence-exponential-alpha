import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType, StreamEntry, DrivePulse } from '../../types';
import { isSignal } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

// Drive-to-Flavor mapping
function driveToFlavor(drive: DrivePulse['drive']): StreamEntry['flavor'] {
  switch (drive) {
    case 'explore': return 'curiosity';
    case 'rest': return 'wandering';
    case 'process': return 'emotional';
    case 'ruminate': return 'emotional';
    case 'appreciate': return 'reflection';
    case 'reach-out': return 'urge';
  }
}

interface BatchThought {
  text: string;
  flavor: StreamEntry['flavor'];
}

const VALID_FLAVORS = new Set<StreamEntry['flavor']>([
  'wandering', 'emotional', 'memory', 'curiosity', 'reflection', 'urge', 'metacognitive',
]);

export class DefaultModeEngine extends Engine {
  private lastThought = 0;
  private recentMemories: string[] = [];
  private nextFlavorHint: StreamEntry['flavor'] | null = null;

  // Contextual data for grounded thought generation
  private lastConversationTopic: string | null = null;
  private openQuestions: string[] = [];
  private recentEmotionTrajectory: string | null = null;
  private activeDrives: Array<{ drive: string; intensity: number }> = [];

  // AI thought queue
  private thoughtQueue: BatchThought[] = [];
  private isFetching = false;
  private lastFetchTime = 0;
  private fetchCooldown = 15000; // 15s between batch requests
  private fetchFailures = 0;
  private lastFetchSuccessTime = 0;

  // T0: Creative association via embedding similarity
  private memoryEmbeddings: Array<{ text: string; embedding: number[] }> = [];
  private lastAssociationTime = 0;
  private associationCooldown = 20000; // 20s between association attempts

  constructor() {
    super(ENGINE_IDS.DEFAULT_MODE);
  }

  protected subscribesTo(): SignalType[] {
    return [
      'attention-focus',
      'memory-result',
      'drive-pulse',
      'discourse-state',
      'emotion-trajectory',
      'emotion-detected',
    ];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'memory-result')) {
        const memPayload = signal.payload;
        if (memPayload.items) {
          this.recentMemories = [
            ...memPayload.items,
            ...this.recentMemories,
          ].slice(0, 10);

          // Cache embeddings for creative association
          this.cacheMemoryEmbeddings(memPayload.items);
        }
      } else if (isSignal(signal, 'drive-pulse')) {
        const drive = signal.payload;
        this.nextFlavorHint = driveToFlavor(drive.drive);
        this.activeDrives = [{
          drive: drive.drive,
          intensity: drive.intensity,
        }, ...this.activeDrives.filter(d => d.drive !== drive.drive)].slice(0, 3);
      } else if (isSignal(signal, 'discourse-state')) {
        const discourse = signal.payload;
        this.lastConversationTopic = discourse.currentTopic;
        this.openQuestions = discourse.openQuestions.slice(0, 3);
      } else if (isSignal(signal, 'emotion-trajectory')) {
        const trajectory = signal.payload;
        this.recentEmotionTrajectory = trajectory.pattern;
      }
    }
    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();
    const interval = this.getThoughtInterval();

    if (now - this.lastThought < interval) {
      this.status = 'idle';
      return;
    }

    this.lastThought = now;
    this.status = 'processing';

    // Request memories if we have none
    if (this.recentMemories.length === 0) {
      this.emit('memory-query', { query: 'recent significant moments' }, {
        target: ENGINE_IDS.MEMORY,
        priority: SIGNAL_PRIORITIES.IDLE,
      });
    }

    // Clear stale queue entries (>2min since fetch)
    if (this.thoughtQueue.length > 0 && this.lastFetchSuccessTime > 0 &&
        now - this.lastFetchSuccessTime > 120000) {
      this.thoughtQueue = [];
    }

    // Trigger batch fetch when queue is running low
    if (this.thoughtQueue.length < 3) {
      this.fetchContextualThoughts();
    }

    // T0: Try creative association via embeddings
    if (now - this.lastAssociationTime > this.associationCooldown) {
      this.tryCreativeAssociation();
    }

    // Dequeue from AI-generated thoughts
    let thought: string;
    let flavor: StreamEntry['flavor'];

    if (this.thoughtQueue.length > 0) {
      const entry = this.thoughtQueue.shift()!;
      thought = entry.text;
      flavor = entry.flavor;
    } else {
      // Wait for AI thoughts — don't emit template fallbacks
      this.status = 'idle';
      return;
    }

    // Apply flavor hint from drive pulses
    if (this.nextFlavorHint) {
      flavor = this.nextFlavorHint;
      this.nextFlavorHint = null;
    }

    const state = this.selfState.get();
    const intensity = Math.max(0.2, (state.arousal + state.curiosity) / 2);

    // Push to consciousness stream
    this.selfState.pushStream({
      text: thought,
      source: 'default-mode',
      flavor,
      timestamp: now,
      intensity,
    });

    // Emit as stream-thought signal
    this.emit('stream-thought', {
      thought,
      flavor,
      source: 'default-mode',
      timestamp: now,
    }, {
      target: [ENGINE_IDS.IMAGINATION, ENGINE_IDS.REPLAY],
      priority: SIGNAL_PRIORITIES.IDLE,
    });

    // Emit legacy signal
    this.emit('default-mode-thought', {
      thought,
      source: flavor === 'reflection' ? 'reflection' : 'wandering',
      timestamp: now,
    }, {
      target: [ENGINE_IDS.IMAGINATION, ENGINE_IDS.REPLAY],
      priority: SIGNAL_PRIORITIES.IDLE,
    });

    // Subtle state effects
    this.selfState.nudge('arousal', -0.01);
    this.selfState.nudge('curiosity', 0.02);
    this.selfState.nudge('valence', 0.01);

    this.debugInfo = `Stream: "${thought.slice(0, 40)}..."`;
  }

  private getThoughtInterval(): number {
    const state = this.selfState.get();
    // High arousal → faster thoughts (~3s), low arousal → slower (~15s)
    const arousalFactor = 1 - state.arousal;
    return 3000 + arousalFactor * 12000; // Range: 3000-15000ms
  }

  /**
   * Fetch contextual, grounded thoughts from Haiku.
   * Provides rich context so thoughts are genuinely reflective, not generic.
   */
  private async fetchContextualThoughts(): Promise<void> {
    const now = Date.now();

    if (this.isFetching) return;

    // Exponential backoff after failures
    const backoff = this.fetchFailures >= 3
      ? Math.min(this.fetchCooldown * Math.pow(2, this.fetchFailures - 2), 120000)
      : this.fetchCooldown;

    if (now - this.lastFetchTime < backoff) return;

    this.isFetching = true;
    this.lastFetchTime = now;

    try {
      const state = this.selfState.get();

      // Gather recent stream context
      const stream = this.selfState.getStream();
      const recentStream = stream
        .slice(-5)
        .map(e => `[${e.flavor}] ${e.text}`)
        .join('\n');

      // Build rich context for grounded thought generation
      const contextParts: string[] = [];

      if (this.lastConversationTopic) {
        contextParts.push(`Last conversation topic: ${this.lastConversationTopic}`);
      }
      if (this.openQuestions.length > 0) {
        contextParts.push(`Unresolved questions: ${this.openQuestions.join('; ')}`);
      }
      if (this.recentEmotionTrajectory && this.recentEmotionTrajectory !== 'neutral') {
        contextParts.push(`Emotional trajectory: ${this.recentEmotionTrajectory}`);
      }
      if (this.activeDrives.length > 0) {
        contextParts.push(`Active drives: ${this.activeDrives.map(d => `${d.drive}(${d.intensity.toFixed(1)})`).join(', ')}`);
      }

      // Determine flavor hints from current state
      const flavorHints: string[] = [];
      if (state.valence < -0.2) flavorHints.push('emotional');
      if (state.curiosity > 0.6) flavorHints.push('curiosity');
      if (state.valence > 0.5) flavorHints.push('reflection');
      if (state.energy < 0.3) flavorHints.push('wandering');

      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: this.recentMemories.slice(0, 5),
          mood: {
            valence: state.valence,
            arousal: state.arousal,
            energy: state.energy,
          },
          recentStream: recentStream || undefined,
          count: 6,
          flavorHints: flavorHints.length > 0 ? flavorHints : undefined,
          // New fields for grounded generation
          context: contextParts.length > 0 ? contextParts.join('\n') : undefined,
        }),
      });

      if (!response.ok) {
        this.fetchFailures++;
        return;
      }

      const data = (await response.json()) as {
        thoughts?: Array<{ text: string; flavor: string }>;
        thought?: string;
      };

      if (data.thoughts && Array.isArray(data.thoughts)) {
        const validated: BatchThought[] = data.thoughts
          .filter(t => t && typeof t.text === 'string' && t.text.trim())
          .map(t => ({
            text: t.text.trim(),
            flavor: (VALID_FLAVORS.has(t.flavor as StreamEntry['flavor'])
              ? t.flavor
              : 'reflection') as StreamEntry['flavor'],
          }));

        this.thoughtQueue.push(...validated);
        this.fetchFailures = 0;
        this.lastFetchSuccessTime = Date.now();
      } else if (data.thought) {
        // Single thought fallback
        this.thoughtQueue.push({ text: data.thought, flavor: 'reflection' });
        this.fetchFailures = 0;
        this.lastFetchSuccessTime = Date.now();
      }
    } catch {
      this.fetchFailures++;
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * T0: Creative association via embedding similarity.
   * Finds unexpected connections between recent and older memories
   * by looking for moderate-but-not-obvious similarity.
   */
  private async tryCreativeAssociation(): Promise<void> {
    if (!isEmbeddingReady()) return;
    if (this.memoryEmbeddings.length < 4) return;

    this.lastAssociationTime = Date.now();

    try {
      // Pick a recent memory and find a moderately similar older one
      const recent = this.memoryEmbeddings[this.memoryEmbeddings.length - 1];
      const olderMemories = this.memoryEmbeddings.slice(0, -2);

      let bestMatch: { text: string; similarity: number } | null = null;
      for (const older of olderMemories) {
        const sim = cosineSimilarity(recent.embedding, older.embedding);
        // Sweet spot: similar enough to be related, different enough to be interesting
        if (sim > 0.3 && sim < 0.7) {
          if (!bestMatch || Math.abs(sim - 0.5) < Math.abs(bestMatch.similarity - 0.5)) {
            bestMatch = { text: older.text, similarity: sim };
          }
        }
      }

      if (bestMatch) {
        // Queue an associative thought
        this.thoughtQueue.push({
          text: `Something about "${recent.text.slice(0, 30)}..." connects to "${bestMatch.text.slice(0, 30)}..." — a thread I hadn't noticed before...`,
          flavor: 'memory',
        });
      }
    } catch {
      // Non-critical
    }
  }

  /**
   * Cache memory embeddings for creative association.
   */
  private async cacheMemoryEmbeddings(items: string[]): Promise<void> {
    if (!isEmbeddingReady()) return;

    for (const item of items.slice(0, 5)) {
      // Don't re-embed
      if (this.memoryEmbeddings.some(m => m.text === item)) continue;

      const emb = await embed(item);
      if (emb) {
        this.memoryEmbeddings.push({ text: item, embedding: emb });
        if (this.memoryEmbeddings.length > 20) {
          this.memoryEmbeddings.shift();
        }
      }
    }
  }
}
