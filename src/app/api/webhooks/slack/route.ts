import { NextResponse } from 'next/server';
import { handleChannelMessage } from '@/lib/channels/handler';
import { getSlackAdapter } from '@/lib/channels/slack';
import type { IncomingMessage } from '@/lib/channels/adapter';
import { getDb } from '@/db';
import { users } from '@/db/schema';

// Slack Events API webhook handler
// Events: message (in channels where bot is added)

interface SlackEvent {
  type: string;
  challenge?: string;
  event?: {
    type: string;
    text?: string;
    user?: string;
    channel?: string;
    bot_id?: string;
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as SlackEvent;

  // URL verification challenge
  if (body.type === 'url_verification' && body.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Only handle message events (ignore bot messages)
  if (body.event?.type !== 'message' || body.event.bot_id || !body.event.text) {
    return NextResponse.json({ ok: true });
  }

  const slackUserId = body.event.user ?? 'unknown';
  const channelId = body.event.channel ?? 'unknown';
  const text = body.event.text;

  const userId = `slack:${slackUserId}`;

  // Ensure user exists
  try {
    const db = getDb();
    await db
      .insert(users)
      .values({
        id: userId,
        email: `${slackUserId}@slack.bridge`,
      })
      .onConflictDoNothing();
  } catch {
    // Database not available
  }

  const incoming: IncomingMessage = {
    channelType: 'slack',
    channelUserId: channelId,
    text,
    metadata: { slackUserId },
  };

  const adapter = getSlackAdapter();

  handleChannelMessage(incoming, userId, adapter).catch(err => {
    console.error('Slack handler error:', err);
  });

  return NextResponse.json({ ok: true });
}
