import { NextResponse } from 'next/server';
import { handleChannelMessage } from '@/lib/channels/handler';
import { getTelegramAdapter } from '@/lib/channels/telegram';
import type { IncomingMessage, Attachment } from '@/lib/channels/adapter';
import { getDb } from '@/db';
import { users } from '@/db/schema';

// Telegram webhook handler
// Set webhook URL: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/webhooks/telegram

interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    from?: { id: number; username?: string; first_name?: string };
    text?: string;
    caption?: string;
    photo?: TelegramPhoto[];
    voice?: { file_id: string; duration: number; mime_type?: string };
    audio?: { file_id: string; duration: number; mime_type?: string; title?: string };
    document?: { file_id: string; file_name?: string; mime_type?: string };
  };
  callback_query?: {
    id: string;
    from: { id: number; username?: string };
    message?: { chat: { id: number } };
    data?: string;
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const update = (await request.json()) as TelegramUpdate;

  // Handle callback queries (inline keyboard button presses)
  if (update.callback_query) {
    const chatId = String(update.callback_query.message?.chat.id ?? update.callback_query.from.id);
    const telegramUserId = String(update.callback_query.from.id);
    const userId = `telegram:${telegramUserId}`;
    const text = update.callback_query.data ?? '';

    const incoming: IncomingMessage = {
      channelType: 'telegram',
      channelUserId: chatId,
      text,
      metadata: {
        telegramUserId,
        username: update.callback_query.from.username,
        callbackQueryId: update.callback_query.id,
      },
    };

    const adapter = getTelegramAdapter();
    handleChannelMessage(incoming, userId, adapter).catch(err => {
      console.error('Telegram callback handler error:', err);
    });

    return NextResponse.json({ ok: true });
  }

  if (!update.message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(update.message.chat.id);
  const telegramUserId = String(update.message.from?.id ?? chatId);
  const text = update.message.text ?? update.message.caption ?? '';

  // Skip empty messages with no text and no media
  if (!text && !update.message.photo && !update.message.voice && !update.message.audio && !update.message.document) {
    return NextResponse.json({ ok: true });
  }

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

  // Process media attachments
  const attachments: Attachment[] = [];
  const adapter = getTelegramAdapter();

  if (update.message.photo?.length) {
    // Get the largest photo
    const photo = update.message.photo[update.message.photo.length - 1];
    const photoUrl = await adapter.getFileUrl(photo.file_id);
    if (photoUrl) {
      attachments.push({
        type: 'image',
        url: photoUrl,
        mime_type: 'image/jpeg',
        caption: update.message.caption,
      });
    }
  }

  if (update.message.voice) {
    const voiceUrl = await adapter.getFileUrl(update.message.voice.file_id);
    if (voiceUrl) {
      attachments.push({
        type: 'audio',
        url: voiceUrl,
        mime_type: update.message.voice.mime_type ?? 'audio/ogg',
      });
    }
  }

  if (update.message.audio) {
    const audioUrl = await adapter.getFileUrl(update.message.audio.file_id);
    if (audioUrl) {
      attachments.push({
        type: 'audio',
        url: audioUrl,
        mime_type: update.message.audio.mime_type ?? 'audio/mpeg',
      });
    }
  }

  if (update.message.document) {
    const docUrl = await adapter.getFileUrl(update.message.document.file_id);
    if (docUrl) {
      attachments.push({
        type: 'document',
        url: docUrl,
        mime_type: update.message.document.mime_type,
        filename: update.message.document.file_name,
      });
    }
  }

  const incoming: IncomingMessage = {
    channelType: 'telegram',
    channelUserId: chatId,
    text: text || (attachments.length ? 'Sent media' : ''),
    metadata: {
      telegramUserId,
      username: update.message.from?.username,
    },
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  // Process asynchronously — respond to webhook immediately
  handleChannelMessage(incoming, userId, adapter).catch(err => {
    console.error('Telegram handler error:', err);
  });

  return NextResponse.json({ ok: true });
}
