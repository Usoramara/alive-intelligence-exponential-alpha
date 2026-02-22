/**
 * Process events from the OpenClaw gateway.
 *
 * Called both from the HTTP events endpoint and from bridge event subscriptions.
 * Handles all OpenClaw event types with cognitive state integration.
 */

import { detectEmotion } from '@/lib/cognitive/detect-emotion';
import { updateCognitiveState } from '@/lib/cognitive/state-updater';
import { saveMemoryWithEmbedding } from '@/lib/memory/manager';
import type { SelfState } from '@/core/types';
import { getDb } from '@/db';
import { cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { recordEngineActivity, recordSignalActivity } from '@/core/engine-status';
import { emitCognitiveStateChange } from './openclaw-event-emitter';

const DEFAULT_USER_ID = process.env.WYBE_GATEWAY_USER_ID || 'wybe-gateway';

const DEFAULT_STATE: SelfState = {
  valence: 0.6,
  arousal: 0.3,
  confidence: 0.5,
  energy: 0.7,
  social: 0.4,
  curiosity: 0.6,
};

async function loadSelfState(userId: string): Promise<SelfState> {
  try {
    const db = getDb();
    const [state] = await db
      .select()
      .from(cognitiveStates)
      .where(eq(cognitiveStates.userId, userId));
    if (state) {
      return {
        valence: state.valence,
        arousal: state.arousal,
        confidence: state.confidence,
        energy: state.energy,
        social: state.social,
        curiosity: state.curiosity,
      };
    }
  } catch {
    // DB not available
  }
  return { ...DEFAULT_STATE };
}

export interface OpenClawEvent {
  type: string;
  source?: string;
  content?: string;
  channel?: string;
  sessionKey?: string;
  agentId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export async function processOpenClawEvent(event: OpenClawEvent): Promise<void> {
  const userId = event.userId || DEFAULT_USER_ID;

  switch (event.type) {
    case 'message.received':
      await processMessageReceived(userId, event);
      break;
    case 'agent.complete':
      await processAgentComplete(userId, event);
      break;
    case 'session.start':
      await processSessionStart(userId, event);
      break;
    case 'session.end':
      await processSessionEnd(userId, event);
      break;
    case 'channel.connected':
      await processChannelConnected(userId, event);
      break;
    case 'channel.disconnected':
      await processChannelDisconnected(userId, event);
      break;
    case 'tool.call':
      processToolCall(event);
      break;
    case 'tool.result':
      processToolResult(event);
      break;
    case 'agent.start':
      processAgentStart(event);
      break;
    case 'agent.error':
      await processAgentError(userId, event);
      break;
    case 'cron.fired':
      processCronFired(event);
      break;
    case 'node.connected':
      processNodeConnected(event);
      break;
    case 'node.disconnected':
      processNodeDisconnected(event);
      break;
    default:
      console.log(`[openclaw-events] unhandled event: ${event.type}`);
  }
}

// ── Event Handlers ──

async function processMessageReceived(userId: string, event: OpenClawEvent): Promise<void> {
  const content = event.content;
  if (!content) return;

  console.log(`[openclaw-events] processing message.received from ${event.channel ?? 'unknown'}`);

  // Run emotion detection and memory save in parallel
  const [emotions] = await Promise.all([
    detectEmotion(content).catch(() => null),
    saveMemoryWithEmbedding({
      userId,
      type: 'episodic',
      content: `[${event.channel ?? 'unknown'}] ${content}`,
      significance: 0.5,
      tags: [event.channel ?? 'message', 'openclaw-event'],
    }).catch(() => null),
  ]);

  // Update social dimension — receiving messages increases social engagement
  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = { social: 0.1 };

  if (emotions) {
    // Mirror detected valence slightly
    shift.valence = emotions.valence * 0.2;
    shift.arousal = (emotions.arousal - 0.5) * 0.1;
  }

  await updateCognitiveState(userId, currentState, shift).catch(() => {});

  // Record signal activity
  recordSignalActivity('text-input', 'perception', 'message.received');
}

async function processAgentComplete(userId: string, event: OpenClawEvent): Promise<void> {
  console.log(`[openclaw-events] processing agent.complete for ${event.agentId ?? 'unknown'}`);

  // Agent work depletes energy slightly, but boosts confidence
  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = {
    energy: -0.05,
    arousal: -0.05,
    confidence: 0.05,
  };

  await updateCognitiveState(userId, currentState, shift).catch(() => {});

  // Record engine activity
  recordEngineActivity('arbiter', 0.3);
}

async function processSessionStart(userId: string, event: OpenClawEvent): Promise<void> {
  console.log(`[openclaw-events] session.start: ${event.sessionKey ?? 'unknown'}`);

  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = {
    arousal: 0.1,
    social: 0.15,
    energy: -0.02,
  };

  await updateCognitiveState(userId, currentState, shift).catch(() => {});
  emitCognitiveStateChange(userId, { ...currentState, ...shift });
}

async function processSessionEnd(userId: string, event: OpenClawEvent): Promise<void> {
  console.log(`[openclaw-events] session.end: ${event.sessionKey ?? 'unknown'}`);

  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = {
    arousal: -0.1,
    social: -0.1,
  };

  await updateCognitiveState(userId, currentState, shift).catch(() => {});
}

async function processChannelConnected(userId: string, event: OpenClawEvent): Promise<void> {
  console.log(`[openclaw-events] channel.connected: ${event.channel ?? 'unknown'}`);

  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = { social: 0.05, curiosity: 0.05 };
  await updateCognitiveState(userId, currentState, shift).catch(() => {});
}

async function processChannelDisconnected(userId: string, event: OpenClawEvent): Promise<void> {
  console.log(`[openclaw-events] channel.disconnected: ${event.channel ?? 'unknown'}`);

  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = { social: -0.05 };
  await updateCognitiveState(userId, currentState, shift).catch(() => {});
}

function processToolCall(event: OpenClawEvent): void {
  const toolName = event.metadata?.toolName as string | undefined;
  console.log(`[openclaw-events] tool.call: ${toolName ?? 'unknown'}`);
  recordSignalActivity('arbiter', 'motor', `tool.call:${toolName ?? 'unknown'}`);
  recordEngineActivity('motor', 0.7);
}

function processToolResult(event: OpenClawEvent): void {
  const toolName = event.metadata?.toolName as string | undefined;
  console.log(`[openclaw-events] tool.result: ${toolName ?? 'unknown'}`);
  recordEngineActivity('motor', 0.2);
}

function processAgentStart(event: OpenClawEvent): void {
  console.log(`[openclaw-events] agent.start: ${event.agentId ?? 'unknown'}`);
  recordEngineActivity('arbiter', 0.8);
  recordSignalActivity('binder', 'arbiter', 'agent.start');
}

async function processAgentError(userId: string, event: OpenClawEvent): Promise<void> {
  console.error(`[openclaw-events] agent.error: ${event.agentId ?? 'unknown'}`, event.metadata?.error);

  const currentState = await loadSelfState(userId);
  const shift: Partial<SelfState> = {
    confidence: -0.1,
    arousal: 0.1,
  };
  await updateCognitiveState(userId, currentState, shift).catch(() => {});
}

function processCronFired(event: OpenClawEvent): void {
  console.log(`[openclaw-events] cron.fired: ${event.metadata?.jobId ?? 'unknown'}`);
  recordSignalActivity('persistence', 'arbiter', 'cron.fired');
}

function processNodeConnected(event: OpenClawEvent): void {
  console.log(`[openclaw-events] node.connected: ${event.metadata?.nodeId ?? 'unknown'}`);
}

function processNodeDisconnected(event: OpenClawEvent): void {
  console.log(`[openclaw-events] node.disconnected: ${event.metadata?.nodeId ?? 'unknown'}`);
}
