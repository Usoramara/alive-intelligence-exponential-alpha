import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { Signal, SignalType, SelfState } from '../../types';

interface DiscourseState {
  currentTopic: string | null;
  topicHistory: string[];
  openQuestions: string[];
  commitments: string[];
  turnCount: number;
}

interface BoundRepresentation {
  content: string;
  context: string[];
  selfState: SelfState;
  timestamp: number;
}

export class DiscourseEngine extends Engine {
  private state: DiscourseState = {
    currentTopic: null,
    topicHistory: [],
    openQuestions: [],
    commitments: [],
    turnCount: 0,
  };

  constructor() {
    super(ENGINE_IDS.DISCOURSE);
  }

  protected subscribesTo(): SignalType[] {
    return ['bound-representation', 'claude-response'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (signal.type === 'bound-representation') {
        const bound = signal.payload as BoundRepresentation;
        this.processUserInput(bound.content);
      } else if (signal.type === 'claude-response') {
        const response = signal.payload as { text: string };
        this.processSystemOutput(response.text);
      }
    }

    this.emitState();
    this.status = 'idle';
  }

  private processUserInput(content: string): void {
    this.state.turnCount++;

    // Extract topic (longest significant words as proxy)
    const topic = this.extractTopic(content);
    if (topic) {
      if (this.state.currentTopic && this.state.currentTopic !== topic) {
        this.state.topicHistory.push(this.state.currentTopic);
        if (this.state.topicHistory.length > 10) this.state.topicHistory.shift();
      }
      this.state.currentTopic = topic;
    }

    // Detect open questions
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    for (const sentence of sentences) {
      if (sentence.trim().endsWith('?') || content.includes('?')) {
        const question = sentence.trim();
        if (question.length > 5 && !this.state.openQuestions.includes(question)) {
          this.state.openQuestions.push(question);
          if (this.state.openQuestions.length > 5) this.state.openQuestions.shift();
        }
      }
    }
  }

  private processSystemOutput(content: string): void {
    // Detect commitments in system responses
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

    // Check if any open questions were addressed
    this.state.openQuestions = this.state.openQuestions.filter(q => {
      const qWords = new Set(q.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      const responseWords = content.toLowerCase().split(/\s+/);
      const overlap = responseWords.filter(w => qWords.has(w)).length;
      return overlap < 2; // If response addresses the question, remove it
    });
  }

  private extractTopic(content: string): string | null {
    // Extract most significant phrase (longest words, filter stopwords)
    const stopwords = new Set(['the', 'and', 'but', 'for', 'with', 'that', 'this', 'from', 'have', 'been', 'will', 'what', 'when', 'where', 'which', 'about', 'there', 'their', 'would', 'could', 'should', 'just', 'like', 'know', 'think', 'really', 'very', 'much', 'some', 'also', 'into', 'your', 'they', 'them']);
    const words = content
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.has(w));

    if (words.length === 0) return null;

    // Return the 2-3 most significant words as topic
    return words.slice(0, 3).join(' ');
  }

  private emitState(): void {
    this.emit('discourse-state', {
      ...this.state,
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.BINDER],
      priority: SIGNAL_PRIORITIES.MEDIUM,
    });

    this.debugInfo = `Topic: "${this.state.currentTopic ?? 'none'}" Q:${this.state.openQuestions.length} C:${this.state.commitments.length}`;
  }

  getDiscourseState(): DiscourseState {
    return { ...this.state };
  }
}
