import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';
import {
  embed,
  isEmbeddingReady,
  cosineSimilarity,
} from '../../embeddings';

interface TopicCluster {
  label: string;
  embedding: number[];
  messageCount: number;
  firstSeen: number;
  lastSeen: number;
}

interface DiscourseState {
  currentTopic: string | null;
  topicHistory: string[];
  openQuestions: string[];
  commitments: string[];
  turnCount: number;
}

export class DiscourseEngine extends Engine {
  private state: DiscourseState = {
    currentTopic: null,
    topicHistory: [],
    openQuestions: [],
    commitments: [],
    turnCount: 0,
  };

  // Embedding-based topic clustering
  private topicClusters: TopicCluster[] = [];
  private lastMessageEmbedding: number[] | null = null;

  // Pre-computed intent embeddings
  private questionIntentEmbedding: number[] | null = null;
  private implicitQuestionEmbedding: number[] | null = null;
  private commitmentIntentEmbedding: number[] | null = null;
  private intentsComputed = false;

  // T1: Haiku for topic labeling and commitment extraction
  private lastHaikuLabel = 0;
  private haikuLabelCooldown = 8000; // 8s between label generation
  private pendingLabelContent: string | null = null;
  private pendingLabelClusterIndex = -1;

  private lastCommitmentExtraction = 0;
  private commitmentExtractionCooldown = 5000;

  constructor() {
    super(ENGINE_IDS.DISCOURSE);
    this.precomputeIntentEmbeddings();
  }

  private async precomputeIntentEmbeddings(): Promise<void> {
    if (this.intentsComputed) return;

    const questionEmb = await embed(
      'I am asking a direct question and want an answer. Can you tell me? What is this?',
    );
    const implicitEmb = await embed(
      'I wonder about this. It would be interesting to know. I am curious whether. Do you think maybe.',
    );
    const commitmentEmb = await embed(
      'I will do this. I promise to help. Let me take care of that. I am going to make sure.',
    );

    if (questionEmb) this.questionIntentEmbedding = questionEmb;
    if (implicitEmb) this.implicitQuestionEmbedding = implicitEmb;
    if (commitmentEmb) this.commitmentIntentEmbedding = commitmentEmb;

    if (questionEmb && implicitEmb && commitmentEmb) {
      this.intentsComputed = true;
    } else {
      // Retry
      setTimeout(() => this.precomputeIntentEmbeddings(), 5000);
    }
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'claude-response'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'bound-representation')) {
        const bound = signal.payload;
        this.processUserInput(bound.content);
      } else if (isSignal(signal, 'claude-response')) {
        const response = signal.payload;
        this.processSystemOutput(response.text);
      }
    }

    this.emitState();
    this.status = 'idle';
  }

  protected onIdle(): void {
    // Generate Haiku topic labels for unlabeled clusters
    const now = Date.now();
    if (
      this.pendingLabelContent &&
      now - this.lastHaikuLabel > this.haikuLabelCooldown
    ) {
      this.lastHaikuLabel = now;
      this.generateTopicLabel(this.pendingLabelContent, this.pendingLabelClusterIndex);
      this.pendingLabelContent = null;
    }
    this.status = 'idle';
  }

  private async processUserInput(content: string): Promise<void> {
    this.state.turnCount++;

    // T0: Embedding-based topic extraction and clustering
    if (isEmbeddingReady()) {
      const emb = await embed(content);
      if (emb) {
        await this.updateTopicClusters(content, emb);
        this.lastMessageEmbedding = emb;

        // Semantic question detection
        await this.detectQuestionsSemantic(content, emb);
      }
    } else {
      // Minimal fallback: only detect explicit ?
      if (content.includes('?')) {
        const question = content.trim();
        if (question.length > 5 && !this.state.openQuestions.includes(question)) {
          this.state.openQuestions.push(question);
          if (this.state.openQuestions.length > 5) this.state.openQuestions.shift();
        }
      }
    }
  }

  /**
   * Embedding-based topic clustering.
   * Groups semantically similar messages into topic clusters.
   */
  private async updateTopicClusters(content: string, embedding: number[]): Promise<void> {
    const now = Date.now();

    // Find most similar existing cluster
    let bestCluster: { cluster: TopicCluster; similarity: number; index: number } | null = null;
    for (let i = 0; i < this.topicClusters.length; i++) {
      const sim = cosineSimilarity(embedding, this.topicClusters[i].embedding);
      if (!bestCluster || sim > bestCluster.similarity) {
        bestCluster = { cluster: this.topicClusters[i], similarity: sim, index: i };
      }
    }

    if (bestCluster && bestCluster.similarity > 0.5) {
      // Belongs to existing cluster
      const cluster = bestCluster.cluster;
      cluster.messageCount++;
      cluster.lastSeen = now;

      // Weighted average to update centroid
      const weight = 1 / cluster.messageCount;
      for (let i = 0; i < embedding.length; i++) {
        cluster.embedding[i] = cluster.embedding[i] * (1 - weight) + embedding[i] * weight;
      }

      if (this.state.currentTopic !== cluster.label) {
        this.setCurrentTopic(cluster.label);
      }
    } else {
      // New cluster — use content snippet as temporary label, queue Haiku for proper label
      const tempLabel = content.slice(0, 40).replace(/\s+/g, ' ').trim();

      const newCluster: TopicCluster = {
        label: tempLabel,
        embedding: [...embedding],
        messageCount: 1,
        firstSeen: now,
        lastSeen: now,
      };

      this.topicClusters.push(newCluster);
      const clusterIndex = this.topicClusters.length - 1;

      if (this.topicClusters.length > 10) {
        this.topicClusters.sort((a, b) => b.lastSeen - a.lastSeen);
        this.topicClusters = this.topicClusters.slice(0, 10);
      }

      this.setCurrentTopic(tempLabel);

      // Queue Haiku label generation
      this.pendingLabelContent = content;
      this.pendingLabelClusterIndex = clusterIndex;
    }
  }

  /**
   * T1: Generate a concise topic label via Haiku.
   */
  private async generateTopicLabel(content: string, clusterIndex: number): Promise<void> {
    if (clusterIndex < 0 || clusterIndex >= this.topicClusters.length) return;

    try {
      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `TOPIC LABELING:\nGenerate a 2-4 word topic label for this message:\n"${content.slice(0, 200)}"\n\nRespond with ONLY the label, nothing else.`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const label = (data.thought ?? data.thoughts?.[0]?.text)?.slice(0, 40);

      if (label && clusterIndex < this.topicClusters.length) {
        this.topicClusters[clusterIndex].label = label;
        if (this.state.currentTopic === this.topicClusters[clusterIndex].label || clusterIndex === this.topicClusters.length - 1) {
          this.state.currentTopic = label;
        }
      }
    } catch {
      // Non-critical
    }
  }

  private setCurrentTopic(topic: string): void {
    if (this.state.currentTopic && this.state.currentTopic !== topic) {
      this.state.topicHistory.push(this.state.currentTopic);
      if (this.state.topicHistory.length > 10) this.state.topicHistory.shift();
    }
    this.state.currentTopic = topic;
  }

  /**
   * T0: Semantic question detection via embedding similarity to question-intent clusters.
   * Handles both explicit ("what is...?") and implicit ("I wonder about...", "It would be interesting to know...") questions.
   */
  private async detectQuestionsSemantic(content: string, contentEmbedding: number[]): Promise<void> {
    const hasQuestionMark = content.includes('?');

    // Direct question detection
    if (hasQuestionMark) {
      // Split on ? to get individual questions
      const parts = content.split('?').filter(s => s.trim().length > 5);
      for (const part of parts) {
        const q = part.trim() + '?';
        if (!this.state.openQuestions.includes(q)) {
          this.state.openQuestions.push(q);
          if (this.state.openQuestions.length > 5) this.state.openQuestions.shift();
        }
      }
      return;
    }

    // Implicit question detection via embedding similarity
    if (this.implicitQuestionEmbedding) {
      const similarity = cosineSimilarity(contentEmbedding, this.implicitQuestionEmbedding);
      if (similarity > 0.45) {
        // High similarity to implicit question intent
        const trimmed = content.trim();
        if (trimmed.length > 5 && !this.state.openQuestions.includes(trimmed)) {
          this.state.openQuestions.push(trimmed);
          if (this.state.openQuestions.length > 5) this.state.openQuestions.shift();
        }
      }
    }
  }

  /**
   * Process system output: detect commitments semantically and resolve open questions.
   */
  private async processSystemOutput(content: string): Promise<void> {
    const now = Date.now();

    // T0: Semantic commitment detection via embedding similarity
    if (isEmbeddingReady() && this.commitmentIntentEmbedding) {
      const emb = await embed(content);
      if (emb) {
        const similarity = cosineSimilarity(emb, this.commitmentIntentEmbedding);

        if (similarity > 0.4 && now - this.lastCommitmentExtraction > this.commitmentExtractionCooldown) {
          // Content seems to contain commitments — use Haiku to extract them
          this.lastCommitmentExtraction = now;
          this.extractCommitmentsHaiku(content);
        }

        // Semantic question resolution
        if (this.state.openQuestions.length > 0) {
          const resolved: number[] = [];
          for (let i = 0; i < this.state.openQuestions.length; i++) {
            const qEmb = await embed(this.state.openQuestions[i]);
            if (qEmb) {
              const sim = cosineSimilarity(emb, qEmb);
              if (sim > 0.5) resolved.push(i);
            }
          }
          for (const idx of resolved.reverse()) {
            this.state.openQuestions.splice(idx, 1);
          }
        }
      }
    }
  }

  /**
   * T1: Extract commitments from response text via Haiku.
   */
  private async extractCommitmentsHaiku(content: string): Promise<void> {
    try {
      const response = await fetch('/api/mind/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memories: [],
          mood: this.selfState.get(),
          count: 1,
          context: `COMMITMENT EXTRACTION:\nExtract any commitments or promises made in this response:\n"${content.slice(0, 500)}"\n\nList each commitment as a short phrase, separated by "|". If no commitments, respond with "none".`,
          flavorHints: ['reflection'],
        }),
      });

      if (!response.ok) return;

      const data = await response.json() as { thought?: string; thoughts?: Array<{ text: string }> };
      const text = data.thought ?? data.thoughts?.[0]?.text;

      if (text && text.toLowerCase() !== 'none') {
        const commitments = text.split('|').map(c => c.trim()).filter(c => c.length > 5);
        for (const commitment of commitments) {
          if (!this.state.commitments.includes(commitment)) {
            this.state.commitments.push(commitment);
            if (this.state.commitments.length > 5) this.state.commitments.shift();
          }
        }
      }
    } catch {
      // Non-critical
    }
  }

  private emitState(): void {
    this.emit('discourse-state', {
      ...this.state,
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.BINDER],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    this.debugInfo = `Topic: "${this.state.currentTopic ?? 'none'}" Q:${this.state.openQuestions.length} C:${this.state.commitments.length} Clusters:${this.topicClusters.length}`;
  }

  getDiscourseState(): DiscourseState {
    return { ...this.state };
  }
}
