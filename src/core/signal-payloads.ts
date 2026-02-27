import type {
  SelfState,
  DrivePulse,
  BoundRepresentation,
  ActionDecision,
  AttentionFocus,
  EmotionDetection,
} from './types';
import type { EngineId } from './constants';
import type { BodyIntent, BodyManifest, TaskStatus, TaskUpdateEvent } from './hal/types';

// ── Signal Payload Map ──
// Maps each SignalType to its concrete payload shape.

export interface SignalPayloadMap {
  // Sensor signals
  'text-input': { text: string; message?: string };
  'camera-frame': { frame: string; timestamp: number };
  'audio-chunk': { data: ArrayBuffer };
  'speech-text': { text: string };

  // Perception signals
  'perception-result': { description: string; modality: string; salience: number };
  'visual-description': { description: string };
  'emotion-detected': EmotionDetection;

  // Attention signals
  'attention-focus': AttentionFocus;
  'saliency-map': { items: Array<{ content: string; salience: number }> };

  // Integration signals
  'bound-representation': BoundRepresentation;
  'action-decision': ActionDecision;

  // Reasoning signals
  'thought': ActionDecision;
  'claude-response': { text: string; emotionShift?: Partial<SelfState> };
  'tom-inference': { theyFeel: string; theyWant: string; theyBelieve: string; confidence: number; thinking?: string; feeling?: string; wanting?: string };
  'perspective-update': { theyThinkOfMe: string; relationship: string; dynamicSummary?: string };

  // Emotion signals
  'emotion-update': { valence: number; arousal: number; dominantEmotion?: string };
  'person-state-update': { id: string; name: string; valence: number; arousal: number; engagement: number; trust: number };
  'empathic-state': { mirroring: string; coupling: number; resonance: string; response?: string; intensity?: number };
  'valence-shift': { delta: number; source: string };

  // Inner world signals
  'imagination-result': {
    scenario: string;
    valence: number;
    type: string;
    valueAlignment?: number;
    goalRelevance?: number;
    actionability?: number;
  };
  'intuition-alert': { message: string; confidence: number; basis: string };
  'hope-worry-update': { hopes: Array<{ content: string; intensity: number }>; worries: Array<{ content: string; intensity: number }> };
  'strategy-update': { currentPriority: { description: string; priority: number; progress: number } };
  'default-mode-thought': { thought: string; flavor?: string };
  'replay-memory': { content: string; significance: number; flavor?: string };
  'love-field-update': { warmth: number; protectiveness: number; attachment: number };
  'growth-insight': { insight?: string; area?: string; keyTakeaway?: string };

  // Values
  'value-check': { content: string; context: string };
  'value-violation': { value: string; severity: number; reason: string };

  // Memory signals
  'memory-query': { query: string };
  'memory-result': { items: string[] };
  'memory-write': { content: string; significance: number };
  'memory-significance': { content: string; type: string; significance: number };

  // Safety signals
  'safety-alert': { level: string; reason: string };
  'safety-clear': { cleared: boolean };

  // Output signals
  'voice-output': { text: string; timestamp: number };
  'voice-output-partial': { delta: string; accumulatedText: string; timestamp: number };
  'expression-update': { speaking?: boolean; text?: string; [key: string]: unknown };
  'motor-command': { action: string; reason?: string };
  'locomotion-update': { action: string; reason?: string };

  // Consciousness stream signals
  'stream-thought': { text: string; flavor: string; intensity: number };
  'drive-pulse': DrivePulse;

  // Working memory & discourse signals
  'working-memory-update': { items: unknown[]; summary: string; capacity: number };
  'discourse-state': { currentTopic: string | null; openQuestions: string[]; commitments: string[] };
  'item-evicted': { content: string; type: string; significance: number };

  // Theory of Mind & prediction signals
  'tom-model-update': { beliefs: Record<string, unknown>; emotions: Record<string, unknown>; predictionAccuracy: number };
  'prediction-validated': { prediction: string; topic: string; accuracy: number };
  'prediction-error': { surpriseLevel: number; expected?: string; actual?: string };

  // Metacognition signals
  'metacognition-update': { uncertainty: number; processingLoad: number; emotionalRegulation: string | null; coherence: number };
  'metacognition-reflection': { reflection: string; adjustments: string[]; timestamp: number };

  // Vocal/visual perception signals
  'vocal-emotion': {
    speechRate: number; // words per second (estimated)
    pauseRatio: number; // ratio of pauses to speech (0-1)
    confidencePattern: 'steady' | 'declining' | 'fluctuating';
    inferredTone: 'calm' | 'anxious' | 'energetic' | 'flat' | 'warm' | 'tense';
    confidence: number;
  };
  'visual-emotion': {
    emotions: string[];
    valence: number;
    arousal: number;
    confidence: number;
    people: Array<{ expression: string; estimatedMood: string }>;
    sceneContext: string;
  };
  'tone-text-mismatch': {
    textEmotion: string;
    vocalTone: string;
    mismatchType: 'suppression' | 'sarcasm' | 'masking';
    confidence: number;
    interpretation: string;
  };
  'environmental-context': {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
    sessionDuration: number; // seconds
    localHour: number;
    greeting: string | null; // contextual greeting suggestion
  };

  // Behavioral learning signals
  'behavioral-preference': {
    preferredLength: number; // 0=terse, 1=verbose
    mirroringIntensity: number; // 0=minimal, 1=high
    humorFrequency: number; // 0=serious, 1=playful
    warmthLevel: number; // 0=formal, 1=warm
    directness: number; // 0=indirect, 1=direct
    sampleCount: number;
  };
  'response-feedback': {
    responseText: string;
    responseStyle: { length: number; mirroring: number; humor: number; warmth: number; directness: number };
    userSentiment: number; // -1 to 1 inferred from follow-up
    confidence: number;
  };
  'value-decision-log': {
    value: string;
    decision: string;
    context: string;
    severity: number;
  };
  'self-assessment': {
    period: 'conversation' | 'daily' | 'weekly';
    strengths: string[];
    growthAreas: string[];
    keyInsight: string;
    relationshipProgress: string;
  };

  // Emotion trajectory signals
  'emotion-trajectory': {
    pattern: 'spiraling-down' | 'spiraling-up' | 'stabilizing' | 'oscillating' | 'neutral';
    valenceSlope: number;
    arousalSlope: number;
    windowSize: number;
    confidence: number;
  };

  // Resource management signals
  'resource-budget': { sonnetRemaining: number; suggestedMaxTokens: number; useLite: boolean };

  // Tool activity signals
  'tool-activity': { toolName: string; status: 'started' | 'completed' | 'error'; input?: Record<string, unknown>; result?: string };

  // Body HAL signals
  'body-intent': BodyIntent;
  'body-feedback': { taskId: string; status: TaskStatus; result?: unknown; error?: string };
  'body-manifest': BodyManifest;
  'body-status': { bodyId: string; connected: boolean; bodyType: string };
  'body-task-update': TaskUpdateEvent;

  // System signals
  'engine-status': { engine: EngineId; status: string; action?: string };
  'persist-state': { selfState: SelfState; timestamp: number };
  'state-restored': { selfState: SelfState };
}
