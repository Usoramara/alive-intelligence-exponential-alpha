import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Engine } from './engine';
import { SignalBus } from './signal-bus';
import { SelfStateManager } from './state';
import type { Signal, SignalType } from './types';
import type { EngineId } from './constants';

// Concrete test engine
class TestEngine extends Engine {
  public processedSignals: Signal[] = [];
  public idleCalls = 0;
  private _subscribesTo: SignalType[] | undefined;

  constructor(id: EngineId = 'arbiter' as EngineId, subscribesTo?: SignalType[]) {
    super(id);
    this._subscribesTo = subscribesTo;
  }

  protected subscribesTo(): SignalType[] | undefined {
    return this._subscribesTo;
  }

  protected process(signals: Signal[]): void {
    this.processedSignals.push(...signals);
  }

  protected override onIdle(): void {
    super.onIdle();
    this.idleCalls++;
  }

  // Expose protected methods for testing
  public getStatus() { return this.status; }
  public getSignalsProcessed() { return this.signalsProcessed; }
}

class ErrorEngine extends Engine {
  constructor() {
    super('arbiter' as EngineId);
  }

  protected subscribesTo(): SignalType[] | undefined {
    return undefined;
  }

  protected process(): void {
    throw new Error('Engine failure');
  }

  public getStatus() { return this.status; }
}

// The arbiter tick interval is 100ms. Use timestamps well past that.
const T0 = 1000;    // first tick
const T1 = 1010;    // within interval (should be skipped)
const T2 = 2000;    // well past interval

describe('Engine', () => {
  let bus: SignalBus;
  let selfState: SelfStateManager;

  beforeEach(() => {
    bus = new SignalBus();
    selfState = new SelfStateManager();
  });

  it('tick rate limits processing', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);

    bus.emit({
      type: 'thought',
      source: 'perception' as EngineId,
      payload: {},
      priority: 50,
    });
    bus.flush();

    // First tick should process
    engine.tick(T0);
    expect(engine.processedSignals).toHaveLength(1);

    // Tick within interval should be skipped
    bus.emit({
      type: 'thought',
      source: 'perception' as EngineId,
      payload: {},
      priority: 50,
    });
    bus.flush();
    engine.tick(T1);
    expect(engine.processedSignals).toHaveLength(1); // unchanged

    // Tick past interval should process
    engine.tick(T2);
    expect(engine.processedSignals).toHaveLength(2);
  });

  it('processes inbox signals on tick', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);

    bus.emit({
      type: 'thought',
      source: 'perception' as EngineId,
      payload: { text: 'hello' },
      priority: 50,
    });
    bus.flush();

    engine.tick(T0);
    expect(engine.processedSignals).toHaveLength(1);
    expect(engine.processedSignals[0].payload).toEqual({ text: 'hello' });
  });

  it('increments signalsProcessed count', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);

    bus.emit({ type: 'thought', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.emit({ type: 'thought', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.flush();

    engine.tick(T0);
    expect(engine.getSignalsProcessed()).toBe(2);
  });

  it('calls onIdle when no signals', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);
    engine.tick(T0);
    expect(engine.idleCalls).toBe(1);
    expect(engine.getStatus()).toBe('idle');
  });

  it('snapshot() returns correct engine info', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);
    const snap = engine.snapshot();
    expect(snap.id).toBe('arbiter');
    expect(snap.zone).toBeDefined();
    expect(snap.status).toBe('idle');
    expect(snap.tickCount).toBe(0);
    expect(snap.signalsProcessed).toBe(0);
  });

  it('destroy() unsubscribes from bus', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);
    engine.destroy();

    // Emit signal after destroy — should not reach engine
    bus.emit({ type: 'thought', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.flush();
    engine.tick(T0);
    expect(engine.processedSignals).toHaveLength(0);
  });

  it('emit() puts signal on the bus', () => {
    const engine = new TestEngine('arbiter' as EngineId);
    engine.init(bus, selfState);

    bus.emit({
      type: 'action-decision',
      source: 'arbiter' as EngineId,
      payload: { action: 'speak' },
      priority: 75,
    });

    expect(bus.pendingCount).toBe(1);
  });

  it('error in process() sets status to error', () => {
    const engine = new ErrorEngine();
    engine.init(bus, selfState);

    bus.emit({ type: 'thought', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.flush();
    engine.tick(T0);

    expect(engine.getStatus()).toBe('error');
  });

  it('only receives subscribed signal types', () => {
    const engine = new TestEngine('arbiter' as EngineId, ['thought', 'action-decision']);
    engine.init(bus, selfState);

    bus.emit({ type: 'thought', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.emit({ type: 'emotion-update', source: 'perception' as EngineId, payload: {}, priority: 50 });
    bus.flush();

    engine.tick(T0);
    expect(engine.processedSignals).toHaveLength(1);
    expect(engine.processedSignals[0].type).toBe('thought');
  });
});
