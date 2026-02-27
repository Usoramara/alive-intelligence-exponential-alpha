import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import { WorkingMemory } from '../../working-memory';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

export class WorkingMemoryEngine extends Engine {
  private wm = new WorkingMemory();
  private lastDecay = Date.now();

  // T0: Embedding-based thematic shift detection
  private lastMessageEmbedding: number[] | null = null;

  // T1: Haiku commitment extraction
  private lastCommitmentExtraction = 0;
  private commitmentExtractionCooldown = 5000; // 5s between extractions
  private pendingResponseForCommitments: string | null = null;

  // Question detection embedding (pre-computed)
  private questionIntentEmbedding: number[] | null = null;
  private questionEmbeddingComputed = false;

  constructor() {
    super(ENGINE_IDS.WORKING_MEMORY);

    // When items are evicted, push to long-term memory
    this.wm.onEviction((item) => {
      this.emit('item-evicted', {
        content: item.content,
        type: item.type,
        significance: 0.3 + item.rehearsalCount * 0.1,
      }, {
        target: ENGINE_IDS.MEMORY_WRITE,
        priority: SIGNAL_PRIORITIES.LOW,
      });
    });

    // Pre-compute question intent embedding
    this.precomputeQuestionEmbedding();
  }

  private async precomputeQuestionEmbedding(): Promise<void> {
    if (this.questionEmbeddingComputed) return;

    const emb = await embed(
      'I am asking a question and want to know the answer. Can you tell me? I wonder about this.',
    );
    if (emb) {
      this.questionIntentEmbedding = emb;
      this.questionEmbeddingComputed = true;
    }
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'claude-response', 'emotion-detected'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        this.extractSemanticContent(bound.content, 'user-input');
      } else if (isSignal(signal, 'claude-response')) {
        const response = signal.payload;
        this.wm.add(response.text.slice(0, 100), 'fact', 'claude');

        // Queue for commitment extraction via T1
        this.pendingResponseForCommitments = response.text;
      } else if (isSignal(signal, 'emotion-detected')) {
        const emotions = signal.payload;
        if (emotions.emotions.length > 0) {
          this.wm.add(emotions.emotions.join(', '), 'emotion', 'emotion-inference');
        }
      }
    }

    // T1: Extract commitments from responses
    const now = Date.now();
    if (this.pendingResponseForCommitments && now - this.lastCommitmentExtraction > this.commitmentExtractionCooldown) {
      this.extractCommitmentsT1(this.pendingResponseForCommitments);
      this.pendingResponseForCommitments = null;
    }

    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();
    const deltaMs = now - this.lastDecay;
    this.lastDecay = now;

    if (deltaMs > 0) {
      this.wm.decay(deltaMs);
      const arousal = this.selfState.get().arousal;
      this.wm.enforceCapacity(arousal);
      this.emitUpdate();
    }

    const items = this.wm.getItems();
    this.debugInfo = `WM: ${items.length} items (cap: ${this.wm.getCapacity(this.selfState.get().arousal)})`;
    this.status = 'idle';
  }

  /**
   * Semantic content extraction using embeddings.
   * Replaces word-length topic extraction with genuine semantic analysis.
   */
  private async extractSemanticContent(content: string, source: string): Promise<void> {
    // Always store the content as a topic item
    const salience = this.computeMultiSignalSalience(content);
    this.wm.add(content.slice(0, 100), 'topic', source, salience);

    // T0: Detect thematic shifts via embedding distance
    if (isEmbeddingReady()) {
      const emb = await embed(content);
      if (emb) {
        if (this.lastMessageEmbedding) {
          const similarity = cosineSimilarity(this.lastMessageEmbedding, emb);
          if (similarity < 0.3) {
            // Significant thematic shift
            this.wm.add(`[topic shift] ${content.slice(0, 60)}`, 'topic', source, 0.9);
          }
        }
        this.lastMessageEmbedding = emb;

        // Semantic question detection
        await this.detectQuestionSemantic(content, emb);
      }
    } else {
      // Fallback: simple question detection
      this.detectQuestionFallback(content, source);
    }

    this.emitUpdate();
  }

  /**
   * Semantic question detection via embedding similarity to question-intent cluster.
   * Handles implicit questions like "I wonder if...", "It would be interesting to know..."
   */
  private async detectQuestionSemantic(content: string, contentEmbedding: number[]): Promise<void> {
    // Retry pre-computation if not ready
    if (!this.questionIntentEmbedding) {
      await this.precomputeQuestionEmbedding();
      if (!this.questionIntentEmbedding) return;
    }

    const similarity = cosineSimilarity(contentEmbedding, this.questionIntentEmbedding);

    // Explicit questions (?) get a boost
    const hasQuestionMark = content.includes('?');
    const threshold = hasQuestionMark ? 0.2 : 0.45;

    if (similarity >= threshold || hasQuestionMark) {
      this.wm.add(content, 'question', 'working-memory', 0.9);
    }
  }

  /**
   * Fallback question detection when embeddings aren't available.
   */
  private detectQuestionFallback(content: string, source: string): void {
    if (content.includes('?')) {
      this.wm.add(content, 'question', source, 0.9);
    }
    // Check for implicit question patterns
    if (/\b(I wonder|curious about|interesting to know|would like to understand|do you think)\b/i.test(content)) {
      this.wm.add(content, 'question', source, 0.8);
    }
  }

  /**
   * Multi-signal salience computation.
   * Integrates emotional intensity, novelty, relevance, and emphasis patterns.
   */
  private computeMultiSignalSalience(content: string): number {
    let salience = 0.5; // Base salience

    // Length signal: very short or very long messages are more salient
    if (content.length < 10) salience += 0.1; // Terse = potentially significant
    if (content.length > 200) salience += 0.1; // Elaborate = invested

    // Emphasis patterns: caps, exclamation, repetition
    if (/[A-Z]{3,}/.test(content)) salience += 0.15; // All-caps words
    if (/!{2,}/.test(content)) salience += 0.1; // Multiple exclamation
    if (/\?{2,}/.test(content)) salience += 0.1; // Multiple questions

    // Self-reference (personal stakes)
    if (/\b(I feel|I think|I need|I want|my|mine)\b/i.test(content)) salience += 0.1;

    // Emotional loading from current state
    const state = this.selfState.get();
    if (Math.abs(state.valence) > 0.5) salience += 0.1;
    if (state.arousal > 0.6) salience += 0.1;

    return Math.min(1, salience);
  }

  /**
   * T1: Extract commitments from system responses via Haiku.
   * Uses embedding similarity to pre-filter, then Haiku for actual extraction.
   */
  private async extractCommitmentsT1(responseText: string): Promise<void> {
    this.lastCommitmentExtraction = Date.now();

    // T0: Semantic pre-filter — check if response resembles commitment language
    if (isEmbeddingReady()) {
      const commitmentAnchor = await embed(
        'I will do this. I promise. Let me help. I am going to take care of it.',
      );
      const responseEmb = await embed(responseText);

      if (commitmentAnchor && responseEmb) {
        const similarity = cosineSimilarity(responseEmb, commitmentAnchor);
        if (similarity < 0.3) return; // Doesn't resemble commitments at all
      }
    }

    // T1: Haiku extraction for genuine commitment identification
    try {
      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `COMMITMENT EXTRACTION:\nExtract any specific commitments, promises, or offers to help from this response:\n"${responseText.slice(0, 500)}"\n\nList each commitment as a short phrase separated by "|". Only include genuine commitments, not hypotheticals or suggestions. If none, respond "none".`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const text = data.thought ?? data.thoughts?.[0]?.text;

      if (text && text.toLowerCase() !== 'none') {
        const commitments = text.split('|').map(c => c.trim()).filter(c => c.length > 5);
        for (const commitment of commitments) {
          this.wm.add(commitment, 'commitment', 'claude', 0.85);
        }
      }
    } catch {
      // Non-critical — commitments are supplementary
    }
  }

  private emitUpdate(): void {
    this.emit('working-memory-update', {
      items: this.wm.getItems(),
      summary: this.wm.getSummary(),
      capacity: this.wm.getCapacity(this.selfState.get().arousal),
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.BINDER, ENGINE_IDS.METACOGNITION],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });
  }

  getWorkingMemory(): WorkingMemory {
    return this.wm;
  }
}
