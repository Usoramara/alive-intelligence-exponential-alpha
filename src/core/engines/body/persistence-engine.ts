import { Engine } from '../../engine';
import { ENGINE_IDS } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

export class PersistenceEngine extends Engine {
  private lastSave = 0;
  private saveInterval = 10000; // Save every 10s

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

  async restore(): Promise<void> {
    try {
      const response = await fetch('/api/user/state');
      if (!response.ok) {
        this.debugInfo = 'No saved state (not authenticated or no data)';
        return;
      }
      const selfState = await response.json();
      if (selfState && typeof selfState.valence === 'number') {
        this.selfState.restore(selfState);
        this.debugInfo = 'State restored from server';

        this.emit('state-restored', { selfState }, {
          priority: 50,
        });
      }
    } catch (err) {
      this.debugInfo = `Restore error: ${err}`;
    }
  }
}
