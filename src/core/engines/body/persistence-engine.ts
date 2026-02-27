import { Engine } from '../../engine';
import { ENGINE_IDS } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType, StreamEntry } from '../../types';

export class PersistenceEngine extends Engine {
  private lastSave = 0;
  private saveInterval = 10000; // Save every 10s
  private lastStreamSave = 0;
  private streamSaveInterval = 30000; // Save stream every 30s
  private lastSavedStreamTimestamp = 0; // Track what we've already saved

  constructor() {
    super(ENGINE_IDS.PERSISTENCE);
  }

  protected subscribesTo(): SignalType[] {
    return ['persist-state'];
  }

  protected process(signals: Signal[]): void {
    // Handle explicit save requests
    for (const signal of signals) {
      if (isSignal(signal, 'persist-state')) {
        this.save();
      }
    }
    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();
    if (now - this.lastSave >= this.saveInterval) {
      this.save();
    }
    // Save consciousness stream less frequently (it's larger)
    if (now - this.lastStreamSave >= this.streamSaveInterval) {
      this.saveStream();
    }
    this.status = 'idle';
  }

  private async save(): Promise<void> {
    this.status = 'processing';
    this.lastSave = Date.now();

    try {
      const selfState = this.selfState.get();
      await fetch('/api/user/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selfState),
      });
      this.debugInfo = `Saved @ ${new Date().toLocaleTimeString()}`;
    } catch (err) {
      this.debugInfo = `Save error: ${err}`;
    }
  }

  /**
   * Save new consciousness stream entries to DB.
   * Only saves entries newer than what was last saved.
   */
  private async saveStream(): Promise<void> {
    this.lastStreamSave = Date.now();

    const stream = this.selfState.getStream();
    if (stream.length === 0) return;

    // Only save entries we haven't saved yet
    const newEntries = stream.filter(
      e => e.timestamp > this.lastSavedStreamTimestamp,
    );
    if (newEntries.length === 0) return;

    try {
      await fetch('/api/user/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: newEntries.map(e => ({
            text: e.text,
            source: e.source,
            flavor: e.flavor,
            intensity: e.intensity,
            timestamp: e.timestamp,
          })),
        }),
      });

      // Track the latest saved timestamp
      this.lastSavedStreamTimestamp = Math.max(
        ...newEntries.map(e => e.timestamp),
      );
    } catch {
      // Non-critical — stream persistence is best-effort
    }
  }

  async restore(): Promise<void> {
    try {
      // Restore self-state
      const stateResponse = await fetch('/api/user/state');
      if (stateResponse.ok) {
        const selfState = await stateResponse.json();
        if (selfState && typeof selfState.valence === 'number') {
          this.selfState.restore(selfState);
          this.debugInfo = 'State restored from server';

          this.emit('state-restored', { selfState }, {
            priority: 50,
          });
        }
      } else {
        this.debugInfo = 'No saved state (not authenticated or no data)';
      }

      // Restore consciousness stream
      const streamResponse = await fetch('/api/user/stream');
      if (streamResponse.ok) {
        const { entries } = (await streamResponse.json()) as {
          entries: Array<{
            text: string;
            source: string;
            flavor: string;
            intensity: number;
            timestamp: number;
          }>;
        };

        if (entries && entries.length > 0) {
          // Restore stream entries — this gives Wybe continuity of thought
          for (const entry of entries) {
            this.selfState.pushStream(entry as StreamEntry);
          }
          this.lastSavedStreamTimestamp = Math.max(
            ...entries.map(e => e.timestamp),
          );
        }
      }

      // Fetch pending insights from autonomous processing
      // These are thoughts Wybe had while the user was away
      const insightsResponse = await fetch('/api/user/insights');
      if (insightsResponse.ok) {
        const { insights } = (await insightsResponse.json()) as {
          insights: Array<{
            type: string;
            content: string;
            priority: number;
            createdAt: string;
          }>;
        };

        if (insights && insights.length > 0) {
          for (const insight of insights) {
            const prefix = insight.type === 'anticipation'
              ? 'I was anticipating: '
              : 'While you were away, I was thinking: ';

            this.selfState.pushStream({
              text: `${prefix}${insight.content}`,
              source: 'autonomous-reflection',
              flavor: insight.type === 'anticipation' ? 'curiosity' : 'reflection',
              timestamp: Date.now(),
              intensity: insight.priority,
            });
          }
        }
      }
    } catch (err) {
      this.debugInfo = `Restore error: ${err}`;
    }
  }
}
