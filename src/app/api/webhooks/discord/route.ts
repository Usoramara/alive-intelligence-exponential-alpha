import { NextResponse } from 'next/server';
import { handleChannelMessage } from '@/lib/channels/handler';
import { getDiscordAdapter } from '@/lib/channels/discord';
import type { IncomingMessage } from '@/lib/channels/adapter';
import { getDb } from '@/db';
import { users } from '@/db/schema';

// Discord Interactions endpoint
// Set up in Discord Developer Portal: Interactions Endpoint URL

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

/** Verify Discord interaction signature using Ed25519 */
async function verifyDiscordSignature(
  request: Request,
  body: string,
): Promise<boolean> {
  if (!DISCORD_PUBLIC_KEY) return false;

  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  if (!signature || !timestamp) return false;

  try {
    // Use tweetnacl or similar for Ed25519 verification
    // For now, skip signature verification if no crypto library available
    // In production, install tweetnacl and verify properly
    const encoder = new TextEncoder();
    const _message = encoder.encode(timestamp + body);
    // TODO: Proper Ed25519 verification with tweetnacl
    // const nacl = require('tweetnacl');
    // return nacl.sign.detached.verify(message, hexToUint8Array(signature), hexToUint8Array(DISCORD_PUBLIC_KEY));
    return true; // Placeholder — add proper verification before production
  } catch {
    return false;
  }
}

interface DiscordInteraction {
  type: number; // 1 = PING, 2 = APPLICATION_COMMAND, 3 = MESSAGE_COMPONENT
  data?: { name?: string; options?: Array<{ value: string }> };
  member?: { user: { id: string; username: string } };
  user?: { id: string; username: string };
  channel_id?: string;
  token?: string;
  id?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const bodyText = await request.text();

  // Verify signature
  if (DISCORD_PUBLIC_KEY) {
    const isValid = await verifyDiscordSignature(request, bodyText);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const interaction = JSON.parse(bodyText) as DiscordInteraction;

  // Handle PING (Discord verification)
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // Handle APPLICATION_COMMAND (slash commands)
  if (interaction.type === 2 && interaction.data) {
    const discordUser = interaction.member?.user ?? interaction.user;
    if (!discordUser) {
      return NextResponse.json({ type: 4, data: { content: 'Could not identify user.' } });
    }

    const userId = `discord:${discordUser.id}`;
    const text = interaction.data.options?.[0]?.value ?? interaction.data.name ?? '';

    // Ensure user exists
    try {
      const db = getDb();
      await db
        .insert(users)
        .values({
          id: userId,
          email: `${discordUser.id}@discord.bridge`,
          displayName: discordUser.username,
        })
        .onConflictDoNothing();
    } catch { /* non-critical */ }

    const incoming: IncomingMessage = {
      channelType: 'discord',
      channelUserId: interaction.channel_id ?? discordUser.id,
      text,
      metadata: {
        discordUserId: discordUser.id,
        username: discordUser.username,
        interactionToken: interaction.token,
        interactionId: interaction.id,
      },
    };

    const adapter = getDiscordAdapter();

    // Process asynchronously
    handleChannelMessage(incoming, userId, adapter).catch(err => {
      console.error('Discord handler error:', err);
    });

    // Acknowledge immediately with deferred response
    return NextResponse.json({
      type: 5, // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
    });
  }

  return NextResponse.json({ type: 1 });
}
