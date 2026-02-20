import type { ChannelAdapter, OutgoingMessage } from './adapter';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Telegram adapter using the raw Bot API.
 * No external SDK needed — just fetch().
 */
export class TelegramAdapter implements ChannelAdapter {
  readonly type = 'telegram';

  async sendMessage(chatId: string, message: OutgoingMessage): Promise<void> {
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.text,
        parse_mode: 'Markdown',
      }),
    });
  }
}

// Singleton
let instance: TelegramAdapter | null = null;
export function getTelegramAdapter(): TelegramAdapter {
  if (!instance) {
    instance = new TelegramAdapter();
  }
  return instance;
}
