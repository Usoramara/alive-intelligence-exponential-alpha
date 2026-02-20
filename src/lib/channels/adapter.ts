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
