/**
 * Channel adapter interface — common contract for all messaging channels.
 * Each channel adapter translates platform-specific messages to/from
 * Wybe's cognitive processing pipeline.
 */

/**
 * Channels with native Wybe adapters.
 */
export type NativeChannelType = 'telegram' | 'slack' | 'discord' | 'whatsapp';

/**
 * Channels routed through the OpenClaw bridge.
 * These correspond to OpenClaw's natively supported channel types.
 */
export type OpenClawChannelType =
  | 'messenger'
  | 'instagram'
  | 'twitter'
  | 'line'
  | 'viber'
  | 'wechat'
  | 'signal'
  | 'matrix'
  | 'irc'
  | 'email'
  | 'sms'
  | 'web'
  | 'teams'
  | 'rocketchat'
  | 'mattermost'
  | 'zulip'
  | 'twitch'
  | 'steam'
  | 'revolt'
  | 'xmpp'
  | 'nostr'
  | 'farcaster';

/**
 * Union of all supported channel types — native and OpenClaw-bridged.
 */
export type ChannelType = NativeChannelType | OpenClawChannelType;

export interface IncomingMessage {
  channelType: ChannelType;
  channelUserId: string; // Platform-specific user ID
  text: string;
  metadata?: Record<string, unknown>;
  /** Media attachments (images, audio, documents) */
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'image' | 'audio' | 'document' | 'video';
  url?: string; // Direct URL to the media
  data_base64?: string; // Base64-encoded data
  mime_type?: string;
  filename?: string;
  caption?: string;
}

export interface OutgoingMessage {
  text: string;
  metadata?: Record<string, unknown>;
  /** Optional media to send with the message */
  attachments?: OutgoingAttachment[];
}

export interface OutgoingAttachment {
  type: 'image' | 'audio' | 'document';
  url?: string;
  data_base64?: string;
  mime_type?: string;
  filename?: string;
  caption?: string;
}

export interface ChannelAdapter {
  /** Channel type identifier */
  readonly type: string;

  /** Send a message back through the channel */
  sendMessage(channelUserId: string, message: OutgoingMessage): Promise<void>;
}
