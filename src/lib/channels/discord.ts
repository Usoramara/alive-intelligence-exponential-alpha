import type { ChannelAdapter, OutgoingMessage } from './adapter';

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_API = 'https://discord.com/api/v10';

/**
 * Discord adapter using the raw REST API.
 * For production with gateway events, consider discord.js.
 * This adapter works for webhook-based interactions and sending messages.
 */
export class DiscordAdapter implements ChannelAdapter {
  readonly type = 'discord';

  async sendMessage(channelId: string, message: OutgoingMessage): Promise<void> {
    if (!BOT_TOKEN) {
      console.error('DISCORD_BOT_TOKEN not configured');
      return;
    }

    // Split long messages (Discord limit: 2000 chars)
    const chunks = splitMessage(message.text, 2000);

    for (const chunk of chunks) {
      await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${BOT_TOKEN}`,
        },
        body: JSON.stringify({
          content: chunk,
          // Add embeds if metadata contains them
          ...(message.metadata?.embeds ? { embeds: message.metadata.embeds } : {}),
        }),
      });
    }
  }

  /** Send a message with rich embed */
  async sendEmbed(channelId: string, embed: DiscordEmbed): Promise<void> {
    if (!BOT_TOKEN) return;

    await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
      body: JSON.stringify({ embeds: [embed] }),
    });
  }

  /** Add a reaction to a message */
  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    if (!BOT_TOKEN) return;

    await fetch(
      `${DISCORD_API}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bot ${BOT_TOKEN}` },
      },
    );
  }
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  image?: { url: string };
  thumbnail?: { url: string };
  footer?: { text: string };
}

function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }
    // Try to split at last newline within limit
    let splitIdx = remaining.lastIndexOf('\n', maxLength);
    if (splitIdx <= 0) splitIdx = maxLength;
    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }
  return chunks;
}

let instance: DiscordAdapter | null = null;
export function getDiscordAdapter(): DiscordAdapter {
  if (!instance) {
    instance = new DiscordAdapter();
  }
  return instance;
}
