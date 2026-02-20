import { Engine } from '../../engine';
import { ENGINE_IDS } from '../../constants';
import { isSignal } from '../../types';
import type { Signal, SignalType } from '../../types';

export class LocomotionEngine extends Engine {
  private currentAction = 'stationary';

  constructor() {
    super(ENGINE_IDS.LOCOMOTION);
  }

  protected subscribesTo(): SignalType[] {
    return ['locomotion-update', 'motor-command'];
  }

  protected process(signals: Signal[]): void {
    for (const signal of signals) {
      if (isSignal(signal, 'locomotion-update') || isSignal(signal, 'motor-command')) {
        const payload = signal.payload;
        this.currentAction = payload.action;

        if (payload.action === 'halt') {
          this.debugInfo = `Halted: ${payload.reason || 'unknown'}`;
        } else {
          this.debugInfo = `Action: ${payload.action}`;
        }
      }
    }
    this.status = 'idle';
  }
}
