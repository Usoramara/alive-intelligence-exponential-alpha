import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignalBus } from './signal-bus';
import type { Signal, SignalType } from './types';
import type { EngineId } from './constants';

function makeSignal(overrides: Partial<Signal> = {}): Omit<Signal, 'id' | 'timestamp' | 'ttl'> {
  return {
    type: 'thought' as SignalType,
    source: 'arbiter' as EngineId,
    payload: { text: 'test' },
    priority: 50,
    ...overrides,
  };
}

describe('SignalBus', () => {
  let bus: SignalBus;

  beforeEach(() => {
    bus = new SignalBus();
  });

  it('emits signals and assigns id/timestamp/ttl', () => {
    const signal = bus.emit(makeSignal());
    expect(signal.id).toMatch(/^sig_/);
    expect(signal.timestamp).toBeGreaterThan(0);
    expect(signal.ttl).toBeGreaterThan(0);
  });

  it('orders queue by priority (highest first)', () => {
    bus.emit(makeSignal({ priority: 10 }));
    bus.emit(makeSignal({ priority: 90 }));
    bus.emit(makeSignal({ priority: 50 }));

    const queue = bus.getQueue();
    expect(queue[0].priority).toBe(90);
    expect(queue[1].priority).toBe(50);
    expect(queue[2].priority).toBe(10);
  });

  it('delivers signals to matching subscribers on flush', () => {
    const handler = vi.fn();
    bus.subscribe('arbiter' as EngineId, ['thought'], handler);
    bus.emit(makeSignal({ type: 'thought' }));
    bus.flush();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not deliver unmatched signal types', () => {
    const handler = vi.fn();
    bus.subscribe('arbiter' as EngineId, ['emotion-update'], handler);
    bus.emit(makeSignal({ type: 'thought' }));
    bus.flush();
    expect(handler).not.toHaveBeenCalled();
  });

  it('delivers targeted signals only to target engine', () => {
    const targetHandler = vi.fn();
    const otherHandler = vi.fn();
    bus.subscribe('arbiter' as EngineId, undefined, targetHandler);
    bus.subscribe('perception' as EngineId, undefined, otherHandler);
    bus.emit(makeSignal({ target: 'arbiter' as EngineId }));
    bus.flush();
    expect(targetHandler).toHaveBeenCalledOnce();
    expect(otherHandler).not.toHaveBeenCalled();
  });

  it('delivers broadcast signals to all subscribers', () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.subscribe('arbiter' as EngineId, undefined, h1);
    bus.subscribe('perception' as EngineId, undefined, h2);
    bus.emit(makeSignal());
    bus.flush();
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });

  it('removes expired signals on flush', () => {
    bus.emit(makeSignal({ timestamp: Date.now() - 999_999, ttl: 1 }));
    const processed = bus.flush();
    expect(processed).toHaveLength(0);
  });

  it('records signals in ring buffer history', () => {
    for (let i = 0; i < 5; i++) {
      bus.emit(makeSignal());
    }
    bus.flush();
    expect(bus.getHistory()).toHaveLength(5);
  });

  it('isolates handler errors so other handlers still run', () => {
    const errorHandler = vi.fn(() => { throw new Error('boom'); });
    const goodHandler = vi.fn();
    bus.subscribe('arbiter' as EngineId, undefined, errorHandler);
    bus.subscribe('perception' as EngineId, undefined, goodHandler);
    bus.emit(makeSignal());
    bus.flush();
    expect(errorHandler).toHaveBeenCalledOnce();
    expect(goodHandler).toHaveBeenCalledOnce();
  });

  it('unsubscribes correctly', () => {
    const handler = vi.fn();
    const subId = bus.subscribe('arbiter' as EngineId, undefined, handler);
    bus.unsubscribe(subId);
    bus.emit(makeSignal());
    bus.flush();
    expect(handler).not.toHaveBeenCalled();
  });

  it('clear() empties queue and history', () => {
    bus.emit(makeSignal());
    bus.flush();
    expect(bus.getHistory().length).toBeGreaterThan(0);
    bus.clear();
    expect(bus.getQueue()).toHaveLength(0);
    expect(bus.getHistory()).toHaveLength(0);
  });
});
