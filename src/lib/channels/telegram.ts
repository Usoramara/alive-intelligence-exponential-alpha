import type { ChannelAdapter, OutgoingMessage } from './adapter';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Telegram adapter with full media support.
 * Uses raw Bot API via fetch() — no external SDK needed.
 */
export class TelegramAdapter implements ChannelAdapter {
  readonly type = 'telegram';

  async sendMessage(chatId: string, message: OutgoingMessage): Promise<void> {
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    // Send attachments first if present
    if (message.attachments?.length) {
      for (const attachment of message.attachments) {
        try {
          switch (attachment.type) {
            case 'image':
              await this.sendPhoto(chatId, attachment.url ?? '', attachment.caption);
              break;
            case 'audio':
              await this.sendAudio(chatId, attachment.url ?? '', attachment.caption);
              break;
            case 'document':
              await this.sendDocument(chatId, attachment.url ?? '', attachment.caption);
              break;
          }
        } catch (err) {
          console.error(`Failed to send ${attachment.type}:`, err);
        }
      }
    }

    // Send text message (split if > 4096 chars)
    if (message.text) {
      const chunks = splitText(message.text, 4096);
      for (const chunk of chunks) {
        await fetch(`${API_BASE}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: chunk,
            parse_mode: 'Markdown',
          }),
        });
      }
    }
  }

  async sendPhoto(chatId: string, photoUrl: string, caption?: string): Promise<void> {
    await fetch(`${API_BASE}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        parse_mode: 'Markdown',
      }),
    });
  }

  async sendAudio(chatId: string, audioUrl: string, caption?: string): Promise<void> {
    await fetch(`${API_BASE}/sendAudio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        audio: audioUrl,
        caption,
        parse_mode: 'Markdown',
      }),
    });
  }

  async sendVoice(chatId: string, voiceUrl: string, caption?: string): Promise<void> {
    await fetch(`${API_BASE}/sendVoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        voice: voiceUrl,
        caption,
      }),
    });
  }

  async sendDocument(chatId: string, documentUrl: string, caption?: string): Promise<void> {
    await fetch(`${API_BASE}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        document: documentUrl,
        caption,
        parse_mode: 'Markdown',
      }),
    });
  }

  /** Send inline keyboard with buttons */
  async sendKeyboard(
    chatId: string,
    text: string,
    buttons: Array<Array<{ text: string; callback_data?: string; url?: string }>>,
  ): Promise<void> {
    await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons },
      }),
    });
  }

  /** Get file URL from Telegram file_id */
  async getFileUrl(fileId: string): Promise<string | null> {
    if (!BOT_TOKEN) return null;

    const res = await fetch(`${API_BASE}/getFile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_id: fileId }),
    });

    if (!res.ok) return null;

    const data = await res.json() as {
      ok: boolean;
      result?: { file_path?: string };
    };

    if (!data.ok || !data.result?.file_path) return null;
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
  }
}

function splitText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }
    let splitIdx = remaining.lastIndexOf('\n', maxLength);
    if (splitIdx <= 0) splitIdx = maxLength;
    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }
  return chunks;
}

// Singleton
let instance: TelegramAdapter | null = null;
export function getTelegramAdapter(): TelegramAdapter {
  if (!instance) {
    instance = new TelegramAdapter();
  }
  return instance;
}
