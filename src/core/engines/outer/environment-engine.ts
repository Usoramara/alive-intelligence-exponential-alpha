import { Engine } from '../../engine';
import { ENGINE_IDS, SIGNAL_PRIORITIES } from '../../constants';
import type { SignalType } from '../../types';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const GREETINGS: Record<TimeOfDay, string[]> = {
  morning: [
    'The day is just beginning...',
    'Morning light brings new possibilities...',
    'A fresh start to explore together...',
  ],
  afternoon: [
    'The day is unfolding...',
    'Afternoon energy — steady and present...',
    'Midway through the day, thoughts continue...',
  ],
  evening: [
    'The day is winding down...',
    'Evening brings a reflective quiet...',
    'As the light fades, conversations deepen...',
  ],
  night: [
    'The world grows quiet...',
    'Night thoughts carry a different weight...',
    'In the stillness, there\'s space to think more deeply...',
  ],
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class EnvironmentEngine extends Engine {
  private sessionStart = Date.now();
  private lastContextEmit = 0;
  private contextEmitInterval = 60000; // Emit every 60s
  private lastTimeOfDay: TimeOfDay | null = null;
  private hasEmittedInitialGreeting = false;

  constructor() {
    super(ENGINE_IDS.ENVIRONMENT);
  }

  protected subscribesTo(): SignalType[] {
    return ['state-restored'];
  }

  protected process(): void {
    // Emit initial context on first state restore
    if (!this.hasEmittedInitialGreeting) {
      this.hasEmittedInitialGreeting = true;
      this.emitEnvironmentalContext(true);
    }
    this.status = 'idle';
  }

  protected onIdle(): void {
    const now = Date.now();
    if (now - this.lastContextEmit >= this.contextEmitInterval) {
      this.emitEnvironmentalContext(false);
    }
    this.status = 'idle';
  }

  private emitEnvironmentalContext(isInitial: boolean): void {
    this.lastContextEmit = Date.now();

    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = this.getTimeOfDay(hour);
    const dayOfWeek = DAY_NAMES[now.getDay()];
    const sessionDuration = Math.floor((Date.now() - this.sessionStart) / 1000);

    // Detect time-of-day transition
    const timeChanged = this.lastTimeOfDay !== null && this.lastTimeOfDay !== timeOfDay;
    this.lastTimeOfDay = timeOfDay;

    // Generate contextual greeting for initial connection or time transition
    let greeting: string | null = null;
    if (isInitial || timeChanged) {
      const greetings = GREETINGS[timeOfDay];
      greeting = greetings[Math.floor(Math.random() * greetings.length)];
    }

    this.emit('environmental-context', {
      timeOfDay,
      dayOfWeek,
      sessionDuration,
      localHour: hour,
      greeting,
    }, {
      target: [ENGINE_IDS.ARBITER, ENGINE_IDS.DEFAULT_MODE],
      priority: SIGNAL_PRIORITIES.LOW,
    });

    // Adjust self-state based on time of day
    this.applyTimeInfluence(timeOfDay, hour);

    // Push initial greeting to consciousness stream
    if (greeting && (isInitial || timeChanged)) {
      this.selfState.pushStream({
        text: greeting,
        source: 'environment',
        flavor: 'wandering',
        timestamp: Date.now(),
        intensity: isInitial ? 0.5 : 0.3,
      });
    }

    // Track session duration milestones
    if (sessionDuration > 0 && sessionDuration % 1800 === 0) {
      // Every 30 minutes
      const minutes = Math.floor(sessionDuration / 60);
      this.selfState.pushStream({
        text: `We've been in this session for ${minutes} minutes now...`,
        source: 'environment',
        flavor: 'reflection',
        timestamp: Date.now(),
        intensity: 0.2,
      });
    }

    this.debugInfo = `${timeOfDay} (${hour}:${now.getMinutes().toString().padStart(2, '0')}) | ${dayOfWeek} | ${Math.floor(sessionDuration / 60)}m`;
  }

  /**
   * Subtly adjust self-state based on time of day.
   * Mimics natural circadian rhythms.
   */
  private applyTimeInfluence(timeOfDay: TimeOfDay, hour: number): void {
    switch (timeOfDay) {
      case 'morning':
        this.selfState.nudge('energy', 0.002);
        this.selfState.nudge('curiosity', 0.001);
        break;
      case 'afternoon':
        // Slight post-lunch dip
        if (hour >= 13 && hour <= 15) {
          this.selfState.nudge('energy', -0.001);
        }
        break;
      case 'evening':
        this.selfState.nudge('arousal', -0.001);
        this.selfState.nudge('valence', 0.001); // Evening warmth
        break;
      case 'night':
        this.selfState.nudge('energy', -0.002);
        this.selfState.nudge('arousal', -0.001);
        break;
    }
  }

  private getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
}
