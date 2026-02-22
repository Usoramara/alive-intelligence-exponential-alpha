/**
 * Hook bridge — subscribes to hook events on the OpenClaw bridge
 * and maps them to signal bus signals.
 *
 * Hooks are OpenClaw's plugin event system. This bridge converts
 * hook events into cognitive signals for the engine system.
 */

import { getOpenClawBridge } from './openclaw-bridge';
import { recordSignalActivity, recordEngineActivity } from '@/core/engine-status';

// Map of OpenClaw hook events to signal mappings
const HOOK_MAPPINGS: Record<string, { from: string; to: string; signalType: string }> = {
  'hook.beforeSend': { from: 'arbiter', to: 'expression', signalType: 'hook.beforeSend' },
  'hook.afterReceive': { from: 'text-input', to: 'perception', signalType: 'hook.afterReceive' },
  'hook.skillActivated': { from: 'motor', to: 'arbiter', signalType: 'hook.skillActivated' },
  'hook.pluginLoaded': { from: 'persistence', to: 'arbiter', signalType: 'hook.pluginLoaded' },
  'hook.authCheck': { from: 'safety', to: 'arbiter', signalType: 'hook.authCheck' },
};

let subscribed = false;

/**
 * Subscribe to hook events from the OpenClaw bridge.
 * Safe to call multiple times — only subscribes once.
 */
export function subscribeToHooks(): void {
  if (subscribed) return;
  subscribed = true;

  try {
    const bridge = getOpenClawBridge();

    for (const [event, mapping] of Object.entries(HOOK_MAPPINGS)) {
      bridge.on(event, () => {
        recordSignalActivity(mapping.from, mapping.to, mapping.signalType);
        recordEngineActivity(mapping.from, 0.5);
      });
    }

    console.log('[openclaw-hook-bridge] Subscribed to hook events');
  } catch (err) {
    subscribed = false;
    console.debug('[openclaw-hook-bridge] Failed to subscribe:', err instanceof Error ? err.message : err);
  }
}
