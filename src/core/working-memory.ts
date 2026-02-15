export type WorkingMemoryItemType = 'topic' | 'commitment' | 'question' | 'fact' | 'emotion';

export interface WorkingMemoryItem {
  id: string;
  content: string;
  type: WorkingMemoryItemType;
  salience: number; // 0-1, decays over time
  createdAt: number;
  lastAccessed: number;
  rehearsalCount: number;
  source: string; // engine that created it
}

let wmItemCounter = 0;

export class WorkingMemory {
  private items: WorkingMemoryItem[] = [];
  private baseCapacity = 7;
  private evictionCallbacks: Array<(item: WorkingMemoryItem) => void> = [];

  getCapacity(arousal: number): number {
    // Yerkes-Dodson: moderate arousal → max capacity, extremes → reduced
    // Optimal arousal ~0.4, range 5-9
    const deviation = Math.abs(arousal - 0.4);
    const adjustment = Math.round(2 * (1 - deviation * 2)); // -2 to +2
    return Math.max(5, Math.min(9, this.baseCapacity + adjustment));
  }

  add(content: string, type: WorkingMemoryItemType, source: string, salience = 0.7): WorkingMemoryItem {
    // Check for duplicate content
    const existing = this.items.find(i => i.content === content);
    if (existing) {
      existing.lastAccessed = Date.now();
      existing.rehearsalCount++;
      existing.salience = Math.min(1, existing.salience + 0.1);
      return existing;
    }

    const item: WorkingMemoryItem = {
      id: `wm_${++wmItemCounter}`,
      content,
      type,
      salience,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      rehearsalCount: 0,
      source,
    };

    this.items.push(item);
    return item;
  }

  access(id: string): WorkingMemoryItem | undefined {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.lastAccessed = Date.now();
      item.rehearsalCount++;
      item.salience = Math.min(1, item.salience + 0.05);
    }
    return item;
  }

  decay(deltaMs: number): WorkingMemoryItem[] {
    const decayRate = 0.001; // salience lost per ms
    const evicted: WorkingMemoryItem[] = [];

    for (const item of this.items) {
      const timeSinceAccess = Date.now() - item.lastAccessed;
      // Rehearsal slows decay
      const rehearsalFactor = 1 / (1 + item.rehearsalCount * 0.3);
      item.salience -= decayRate * deltaMs * rehearsalFactor;
      item.salience = Math.max(0, item.salience);
    }

    // Sort by salience (lowest first for eviction)
    this.items.sort((a, b) => b.salience - a.salience);

    return evicted; // Actual eviction happens in enforceCapacity
  }

  enforceCapacity(arousal: number): WorkingMemoryItem[] {
    const capacity = this.getCapacity(arousal);
    const evicted: WorkingMemoryItem[] = [];

    while (this.items.length > capacity) {
      const victim = this.items.pop()!; // Lowest salience (sorted in decay)
      evicted.push(victim);
      for (const cb of this.evictionCallbacks) {
        cb(victim);
      }
    }

    // Also evict items with zero salience
    const zeroed = this.items.filter(i => i.salience <= 0);
    this.items = this.items.filter(i => i.salience > 0);
    for (const item of zeroed) {
      evicted.push(item);
      for (const cb of this.evictionCallbacks) {
        cb(item);
      }
    }

    return evicted;
  }

  onEviction(callback: (item: WorkingMemoryItem) => void): void {
    this.evictionCallbacks.push(callback);
  }

  getItems(): readonly WorkingMemoryItem[] {
    return this.items;
  }

  getSummary(): string {
    if (this.items.length === 0) return '';
    return this.items
      .slice(0, 7)
      .map(i => `[${i.type}] ${i.content}`)
      .join('\n');
  }

  getByType(type: WorkingMemoryItemType): WorkingMemoryItem[] {
    return this.items.filter(i => i.type === type);
  }

  clear(): void {
    this.items = [];
  }
}
