import type { ChannelAdapter, OutgoingMessage } from './adapter';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * WhatsApp adapter using the Cloud API (Meta Business Platform).
 * This is the serverless-compatible approach — no persistent connection needed.
 * For the Baileys approach (persistent socket), use a separate worker.
 */
export class WhatsAppAdapter implements ChannelAdapter {
  readonly type = 'whatsapp';

  async sendMessage(recipientPhone: string, message: OutgoingMessage): Promise<void> {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
      console.error('WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured');
      return;
    }

    await fetch(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientPhone,
          type: 'text',
          text: { body: message.text },
        }),
      },
    );
  }

  /** Send a media message (image, audio, document) */
  async sendMedia(
    recipientPhone: string,
    type: 'image' | 'audio' | 'document',
    mediaUrl: string,
    caption?: string,
  ): Promise<void> {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) return;

    const mediaPayload: Record<string, unknown> = { link: mediaUrl };
    if (caption && type !== 'audio') {
      mediaPayload.caption = caption;
    }

    await fetch(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientPhone,
          type,
          [type]: mediaPayload,
        }),
      },
    );
  }
}

let instance: WhatsAppAdapter | null = null;
export function getWhatsAppAdapter(): WhatsAppAdapter {
  if (!instance) {
    instance = new WhatsAppAdapter();
  }
  return instance;
}
