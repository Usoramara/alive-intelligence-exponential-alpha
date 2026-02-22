/**
 * Generic channel adapter that routes messages through the OpenClaw bridge
 * for all 20+ channels that OpenClaw supports natively.
 *
 * Used for channels that Wybe doesn't have a direct adapter for.
 */

import { getOpenClawBridge } from '@/lib/openclaw-bridge';
import type { ChannelAdapter, OutgoingMessage } from './adapter';

/**
 * Creates a ChannelAdapter that sends messages through the OpenClaw bridge.
 */
export function createOpenClawChannelAdapter(channelType: string): ChannelAdapter {
  return {
    type: channelType,
    async sendMessage(channelUserId: string, message: OutgoingMessage): Promise<void> {
      try {
        const bridge = getOpenClawBridge();
        await bridge.call('channels.send', {
          channel: channelType,
          recipient: channelUserId,
          text: message.text,
          metadata: message.metadata,
          attachments: message.attachments,
        }, 15_000);
      } catch (err) {
        console.error(`[openclaw-channel-adapter] Failed to send via ${channelType}:`, err instanceof Error ? err.message : err);
        throw err;
      }
    },
  };
}
