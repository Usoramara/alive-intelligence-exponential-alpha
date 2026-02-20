/**
 * Channel adapter interface — common contract for all messaging channels.
 * Each channel adapter translates platform-specific messages to/from
 * Wybe's cognitive processing pipeline.
 */

export interface IncomingMessage {
  channelType: 'telegram' | 'slack' | 'discord' | 'whatsapp';
  channelUserId: string; // Platform-specific user ID
  text: string;
  metadata?: Record<string, unknown>;
}

export interface OutgoingMessage {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelAdapter {
  /** Channel type identifier */
  readonly type: string;

  /** Send a message back through the channel */
  sendMessage(channelUserId: string, message: OutgoingMessage): Promise<void>;
}
