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

  // T1: Haiku for discourse coherence analysis
  private lastCoherenceAnalysis = 0;
  private coherenceAnalysisCooldown = 20000; // 20s

  constructor() {
    super(ENGINE_IDS.DISCOURSE);
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

  private async processUserInput(content: string): Promise<void> {
    this.state.turnCount++;

    // T0: Embedding-based topic extraction and clustering
    if (isEmbeddingReady()) {
      const emb = await embed(content);
      if (emb) {
        await this.updateTopicClusters(content, emb);
        this.lastMessageEmbedding = emb;
      }
    } else {
      // Fallback: keyword-based topic extraction
      const topic = this.extractTopicFallback(content);
      if (topic) {
        this.setCurrentTopic(topic);
      }
    }

    // Semantic question detection
    await this.detectQuestions(content);
  }

  /**
   * Embedding-based topic clustering.
   * Groups semantically similar messages into topic clusters.
   * Detects topic shifts by measuring distance to current cluster.
   */
  private async updateTopicClusters(content: string, embedding: number[]): Promise<void> {
    const now = Date.now();

    // Find most similar existing cluster
    let bestCluster: { cluster: TopicCluster; similarity: number } | null = null;
    for (const cluster of this.topicClusters) {
      const sim = cosineSimilarity(embedding, cluster.embedding);
      if (!bestCluster || sim > bestCluster.similarity) {
        bestCluster = { cluster, similarity: sim };
      }
    }

    if (bestCluster && bestCluster.similarity > 0.5) {
      // Belongs to existing cluster — update it
      const cluster = bestCluster.cluster;
      cluster.messageCount++;
      cluster.lastSeen = now;

      // Weighted average to update cluster centroid
      const weight = 1 / cluster.messageCount;
      for (let i = 0; i < embedding.length; i++) {
        cluster.embedding[i] = cluster.embedding[i] * (1 - weight) + embedding[i] * weight;
      }

      // If this is a different cluster than current topic, it's a topic shift
      if (this.state.currentTopic !== cluster.label) {
        this.setCurrentTopic(cluster.label);
      }
    } else {
      // New topic cluster
      // Use first significant words as label (better than nothing)
      const label = this.extractTopicFallback(content) || content.slice(0, 30);

      const newCluster: TopicCluster = {
        label,
        embedding: [...embedding],
        messageCount: 1,
        firstSeen: now,
        lastSeen: now,
      };

      this.topicClusters.push(newCluster);
      if (this.topicClusters.length > 10) {
        // Remove oldest cluster
        this.topicClusters.sort((a, b) => b.lastSeen - a.lastSeen);
        this.topicClusters = this.topicClusters.slice(0, 10);
      }

      this.setCurrentTopic(label);
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
   * Detect questions using both explicit markers and semantic analysis.
   */
  private async detectQuestions(content: string): Promise<void> {
    const sentences = content.split(/[.!]+/).filter(s => s.trim());

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      const isExplicitQuestion = trimmed.endsWith('?') || content.includes('?');
      const isImplicitQuestion = /\b(I wonder|curious about|would like to know|do you think|what if|how come)\b/i.test(trimmed);

      if ((isExplicitQuestion || isImplicitQuestion) && trimmed.length > 5) {
        if (!this.state.openQuestions.includes(trimmed)) {
          this.state.openQuestions.push(trimmed);
          if (this.state.openQuestions.length > 5) this.state.openQuestions.shift();
        }
      }
    }
  }

  private async processSystemOutput(content: string): Promise<void> {
    // Detect commitments
    const commitmentPattern = /\b(I will|I'll|let me|I can help|I should|I'm going to)\b[^.!?]*/gi;
    const matches = content.match(commitmentPattern);
    if (matches) {
      for (const match of matches) {
        const commitment = match.trim();
        if (commitment.length > 10 && !this.state.commitments.includes(commitment)) {
          this.state.commitments.push(commitment);
          if (this.state.commitments.length > 5) this.state.commitments.shift();
        }
      }
    }

    // Semantic question resolution: check if response addresses open questions
    if (isEmbeddingReady() && this.state.openQuestions.length > 0) {
      const responseEmb = await embed(content);
      if (responseEmb) {
        const resolved: number[] = [];
        for (let i = 0; i < this.state.openQuestions.length; i++) {
          const qEmb = await embed(this.state.openQuestions[i]);
          if (qEmb) {
            const sim = cosineSimilarity(responseEmb, qEmb);
            if (sim > 0.5) {
              resolved.push(i);
            }
          }
        }
        // Remove resolved questions (reverse order to maintain indices)
        for (const idx of resolved.reverse()) {
          this.state.openQuestions.splice(idx, 1);
        }
      }
    } else {
      // Fallback: word overlap question resolution
      this.state.openQuestions = this.state.openQuestions.filter(q => {
        const qWords = new Set(q.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        const responseWords = content.toLowerCase().split(/\s+/);
        const overlap = responseWords.filter(w => qWords.has(w)).length;
        return overlap < 2;
      });
    }
  }

  private extractTopicFallback(content: string): string | null {
    const stopwords = new Set(['the', 'and', 'but', 'for', 'with', 'that', 'this', 'from', 'have', 'been', 'will', 'what', 'when', 'where', 'which', 'about', 'there', 'their', 'would', 'could', 'should', 'just', 'like', 'know', 'think', 'really', 'very', 'much', 'some', 'also', 'into', 'your', 'they', 'them']);
    const words = content
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.has(w));

    if (words.length === 0) return null;
    return words.slice(0, 3).join(' ');
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
