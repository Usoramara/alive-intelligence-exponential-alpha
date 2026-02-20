import type { ChannelAdapter, OutgoingMessage } from './adapter';

const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

/**
 * Slack adapter using the raw Web API.
 * For production, consider using @slack/bolt.
 */
export class SlackAdapter implements ChannelAdapter {
  readonly type = 'slack';

  async sendMessage(channelId: string, message: OutgoingMessage): Promise<void> {
    if (!BOT_TOKEN) {
      console.error('SLACK_BOT_TOKEN not configured');
      return;
    }

    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text: message.text,
      }),
    });
  }
}

let instance: SlackAdapter | null = null;
export function getSlackAdapter(): SlackAdapter {
  if (!instance) {
    instance = new SlackAdapter();
  }
  return instance;
}
