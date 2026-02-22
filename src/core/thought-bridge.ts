import { isSignal } from './types';
import type { Signal, SignalType } from './types';
import type { SignalBus } from './signal-bus';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from './constants';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolActivityPayload {
  toolName: string;
  status: 'started' | 'completed' | 'error';
  input?: Record<string, unknown>;
  result?: string;
}

let activeInstance: ThoughtBridge | null = null;

/**
 * Bridges the client-side signal bus with the server-side Claude API.
 * Listens for 'thought' signals, sends them to /api/mind/think-stream,
 * and injects the response back as 'claude-response' signals.
 * Supports streaming with partial text output and tool activity signals.
 */
export class ThoughtBridge {
  private bus: SignalBus;
  private subscriptionId: string;
  private conversationHistory: ConversationEntry[] = [];
  private processing = false;
  private lastProcessedContent = '';
  private lastProcessedTime = 0;

  constructor(bus: SignalBus) {
    // Destroy previous instance if exists (HMR/StrictMode safety)
    if (activeInstance) {
      activeInstance.destroy();
    }
    activeInstance = this;

    this.bus = bus;
    this.subscriptionId = this.bus.subscribe(
      ENGINE_IDS.ARBITER,  // Subscribe as arbiter to get thought signals
      ['thought'] as SignalType[],
      (signal) => {
        if (isSignal(signal, 'thought')) {
          this.handleThought(signal);
        }
      }
    );
  }

  private async handleThought(signal: Signal): Promise<void> {
    if (this.processing) return; // One at a time
    if (!isSignal(signal, 'thought')) return;

    const decision = signal.payload;

    // Deduplicate — skip if same content within 5s
    const now = Date.now();
    if (
      decision.content === this.lastProcessedContent &&
      now - this.lastProcessedTime < 5000
    ) {
      return;
    }
    this.lastProcessedContent = decision.content;
    this.lastProcessedTime = now;

    this.processing = true;

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: decision.content,
    });

    // Keep last 20 exchanges
    if (this.conversationHistory.length > 40) {
      this.conversationHistory = this.conversationHistory.slice(-40);
    }

    try {
      // Use streaming for full Sonnet, fall back to non-streaming for lite
      if (decision.useLite) {
        await this.handleNonStreaming(decision);
      } else {
        await this.handleStreaming(decision);
      }
    } catch (error) {
      console.error('ThoughtBridge error:', error);

      // Emit error response
      this.bus.emit({
        type: 'claude-response',
        source: ENGINE_IDS.ARBITER,
        target: [ENGINE_IDS.ARBITER, ENGINE_IDS.GROWTH],
        payload: {
          text: 'I... lost my train of thought for a moment. Could you say that again?',
          emotionShift: { confidence: -0.1, energy: -0.05 },
        },
        priority: SIGNAL_PRIORITIES.HIGH,
      });
    } finally {
      this.processing = false;
    }
  }

  private async handleStreaming(decision: {
    content: string;
    context: string[];
    selfState: unknown;
    empathicState?: unknown;
    tomInference?: unknown;
    recentMemories?: unknown;
    detectedEmotions?: unknown;
    strategicPriority?: unknown;
    recentInnerThoughts?: unknown;
    responseStyle?: unknown;
    workingMemorySummary?: unknown;
    discourseContext?: unknown;
    metacognitionContext?: unknown;
  }): Promise<void> {
    const body = {
      content: decision.content,
      context: decision.context,
      selfState: decision.selfState,
      conversationHistory: this.conversationHistory.slice(0, -1),
      empathicState: decision.empathicState,
      tomInference: decision.tomInference,
      recentMemories: decision.recentMemories,
      detectedEmotions: decision.detectedEmotions,
      strategicPriority: decision.strategicPriority,
      recentInnerThoughts: decision.recentInnerThoughts,
      responseStyle: decision.responseStyle,
      workingMemorySummary: decision.workingMemorySummary,
      discourseContext: decision.discourseContext,
      metacognitionContext: decision.metacognitionContext,
    };

    const response = await fetch('/api/mind/think-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Think stream API returned ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedText = '';
    let finalText = '';
    let emotionShift: Record<string, number> | undefined;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events from buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // Keep incomplete line in buffer

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            switch (eventType) {
              case 'text': {
                const delta = data.delta as string;
                accumulatedText += delta;

                // Emit partial text signal
                this.bus.emit({
                  type: 'voice-output-partial',
                  source: ENGINE_IDS.ARBITER,
                  payload: {
                    delta,
                    accumulatedText,
                    timestamp: Date.now(),
                  },
                  priority: SIGNAL_PRIORITIES.HIGH,
                });
                break;
              }

              case 'tool': {
                this.bus.emit({
                  type: 'tool-activity',
                  source: ENGINE_IDS.ARBITER,
                  payload: data as ToolActivityPayload,
                  priority: SIGNAL_PRIORITIES.MEDIUM,
                });
                break;
              }

              case 'shift': {
                finalText = data.text as string;
                emotionShift = data.emotionShift as Record<string, number> | undefined;
                break;
              }

              case 'error': {
                throw new Error(data.message as string);
              }
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              // Ignore JSON parse errors for partial data
            } else {
              throw e;
            }
          }
          eventType = '';
        }
      }
    }

    // Use finalText from 'shift' event if available, otherwise accumulated
    const text = finalText || accumulatedText;

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: text,
    });

    // Inject final response into signal bus
    this.bus.emit({
      type: 'claude-response',
      source: ENGINE_IDS.ARBITER,
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.GROWTH],
      payload: { text, emotionShift },
      priority: SIGNAL_PRIORITIES.HIGH,
    });
  }

  private async handleNonStreaming(decision: {
    content: string;
    context: string[];
    selfState: unknown;
  }): Promise<void> {
    const body = {
      content: decision.content,
      context: decision.context,
      selfState: decision.selfState,
      conversationHistory: this.conversationHistory.slice(0, -1),
    };

    const response = await fetch('/api/mind/think-lite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Think API returned ${response.status}`);
    }

    const result = await response.json();

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: result.text,
    });

    // Inject response back into signal bus
    this.bus.emit({
      type: 'claude-response',
      source: ENGINE_IDS.ARBITER,
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.GROWTH],
      payload: result,
      priority: SIGNAL_PRIORITIES.HIGH,
    });
  }

  getConversationHistory(): ConversationEntry[] {
    return [...this.conversationHistory];
  }

  destroy(): void {
    this.bus.unsubscribe(this.subscriptionId);
    if (activeInstance === this) {
      activeInstance = null;
    }
  }
}
