import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkingMemory } from './working-memory';

describe('WorkingMemory', () => {
  let wm: WorkingMemory;

  beforeEach(() => {
    wm = new WorkingMemory();
  });

  it('adds items with correct defaults', () => {
    const item = wm.add('test topic', 'topic', 'arbiter');
    expect(item.content).toBe('test topic');
    expect(item.type).toBe('topic');
    expect(item.source).toBe('arbiter');
    expect(item.salience).toBe(0.7);
    expect(item.rehearsalCount).toBe(0);
    expect(item.id).toMatch(/^wm_/);
  });

  it('deduplicates by content and boosts salience', () => {
    const first = wm.add('duplicate', 'topic', 'arbiter', 0.5);
    const second = wm.add('duplicate', 'topic', 'arbiter', 0.5);
    expect(first.id).toBe(second.id);
    expect(first.salience).toBe(0.6); // 0.5 + 0.1
    expect(first.rehearsalCount).toBe(1);
    expect(wm.getItems()).toHaveLength(1);
  });

  it('Yerkes-Dodson capacity: optimal at ~0.4 arousal', () => {
    const cap04 = wm.getCapacity(0.4); // optimal
    const cap00 = wm.getCapacity(0.0); // low extreme
    const cap10 = wm.getCapacity(1.0); // high extreme
    expect(cap04).toBeGreaterThanOrEqual(cap00);
    expect(cap04).toBeGreaterThanOrEqual(cap10);
    expect(cap04).toBeGreaterThanOrEqual(5);
    expect(cap04).toBeLessThanOrEqual(9);
  });

  it('access() rehearses and boosts salience', () => {
    const item = wm.add('test', 'fact', 'perception');
    const initialSalience = item.salience;
    wm.access(item.id);
    expect(item.salience).toBeGreaterThan(initialSalience);
    expect(item.rehearsalCount).toBe(1);
  });

  it('access() returns undefined for non-existent id', () => {
    expect(wm.access('wm_999')).toBeUndefined();
  });

  it('decay reduces salience over time', () => {
    const item = wm.add('decay test', 'topic', 'arbiter', 0.5);
    wm.decay(10_000); // 10s
    expect(item.salience).toBeLessThan(0.5);
  });

  it('enforceCapacity evicts lowest-salience items', () => {
    // Fill well beyond capacity
    for (let i = 0; i < 15; i++) {
      wm.add(`item ${i}`, 'fact', 'arbiter', 0.3 + i * 0.04);
    }
    wm.decay(1); // sort by salience
    const evicted = wm.enforceCapacity(0.4);
    expect(evicted.length).toBeGreaterThan(0);
    expect(wm.getItems().length).toBeLessThanOrEqual(wm.getCapacity(0.4));
  });

  it('enforceCapacity evicts zero-salience items', () => {
    const item = wm.add('zero', 'fact', 'arbiter', 0.0001);
    wm.decay(10_000); // will push to 0
    const evicted = wm.enforceCapacity(0.4);
    expect(evicted.some(e => e.id === item.id)).toBe(true);
  });

  it('onEviction callback fires for each evicted item', () => {
    const cb = vi.fn();
    wm.onEviction(cb);
    for (let i = 0; i < 15; i++) {
      wm.add(`item ${i}`, 'fact', 'arbiter', 0.1);
    }
    wm.decay(1);
    wm.enforceCapacity(0.4);
    expect(cb).toHaveBeenCalled();
  });

  it('getSummary returns formatted string', () => {
    wm.add('topic one', 'topic', 'arbiter');
    wm.add('a question?', 'question', 'perception');
    const summary = wm.getSummary();
    expect(summary).toContain('[topic] topic one');
    expect(summary).toContain('[question] a question?');
  });

  it('getSummary returns empty string when empty', () => {
    expect(wm.getSummary()).toBe('');
  });

  it('getByType filters correctly', () => {
    wm.add('t1', 'topic', 'arbiter');
    wm.add('q1', 'question', 'arbiter');
    wm.add('t2', 'topic', 'arbiter');
    expect(wm.getByType('topic')).toHaveLength(2);
    expect(wm.getByType('question')).toHaveLength(1);
    expect(wm.getByType('emotion')).toHaveLength(0);
  });

  it('clear() removes all items', () => {
    wm.add('a', 'fact', 'arbiter');
    wm.add('b', 'fact', 'arbiter');
    wm.clear();
    expect(wm.getItems()).toHaveLength(0);
  });
});
