import { NextResponse } from 'next/server';
import { handleChannelMessage } from '@/lib/channels/handler';
import { getTelegramAdapter } from '@/lib/channels/telegram';
import type { IncomingMessage } from '@/lib/channels/adapter';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Telegram webhook handler
// Set webhook URL: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/webhooks/telegram

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    from?: { id: number; username?: string; first_name?: string };
    text?: string;
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const update = (await request.json()) as TelegramUpdate;

  if (!update.message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(update.message.chat.id);
  const telegramUserId = String(update.message.from?.id ?? chatId);
  const text = update.message.text;

  // Resolve Telegram user to platform user
  // For now, use a convention: telegram:<userId> as the platform user ID
  // A proper implementation would use a channel_links table
  const userId = `telegram:${telegramUserId}`;

  // Ensure user exists in our database
  try {
    const db = getDb();
    await db
      .insert(users)
      .values({
        id: userId,
        email: `${telegramUserId}@telegram.bridge`,
        displayName: update.message.from?.first_name ?? null,
      })
      .onConflictDoNothing();
  } catch {
    // Database not available — process anyway
  }

  const incoming: IncomingMessage = {
    channelType: 'telegram',
    channelUserId: chatId,
    text,
    metadata: {
      telegramUserId,
      username: update.message.from?.username,
    },
  };

  const adapter = getTelegramAdapter();

  // Process asynchronously — respond to webhook immediately
  handleChannelMessage(incoming, userId, adapter).catch(err => {
    console.error('Telegram handler error:', err);
  });

  return NextResponse.json({ ok: true });
}
