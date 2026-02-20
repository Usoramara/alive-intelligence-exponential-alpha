// Send message tool — lets Wybe proactively message users on any channel

import { getTelegramAdapter } from '@/lib/channels/telegram';
import { getSlackAdapter } from '@/lib/channels/slack';
import { getDiscordAdapter } from '@/lib/channels/discord';
import { getWhatsAppAdapter } from '@/lib/channels/whatsapp';

export interface SendMessageOutput {
  success: boolean;
  channel: string;
  recipient: string;
  message: string;
}

export async function sendChannelMessage(params: {
  channel: 'telegram' | 'slack' | 'discord' | 'whatsapp';
  recipient: string;
  text: string;
}): Promise<SendMessageOutput> {
  const message = { text: params.text };

  switch (params.channel) {
    case 'telegram': {
      const adapter = getTelegramAdapter();
      await adapter.sendMessage(params.recipient, message);
      break;
    }
    case 'slack': {
      const adapter = getSlackAdapter();
      await adapter.sendMessage(params.recipient, message);
      break;
    }
    case 'discord': {
      const adapter = getDiscordAdapter();
      await adapter.sendMessage(params.recipient, message);
      break;
    }
    case 'whatsapp': {
      const adapter = getWhatsAppAdapter();
      await adapter.sendMessage(params.recipient, message);
      break;
    }
    default:
      throw new Error(`Unknown channel: ${params.channel}`);
  }

  return {
    success: true,
    channel: params.channel,
    recipient: params.recipient,
    message: `Message sent via ${params.channel}`,
  };
}
