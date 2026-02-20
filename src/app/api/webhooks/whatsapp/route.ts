import { NextResponse } from 'next/server';
import { handleChannelMessage } from '@/lib/channels/handler';
import { getWhatsAppAdapter } from '@/lib/channels/whatsapp';
import type { IncomingMessage } from '@/lib/channels/adapter';
import { getDb } from '@/db';
import { users } from '@/db/schema';

// WhatsApp Cloud API webhook handler
// Configure in Meta Business Suite: Webhook URL

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Webhook verification (GET)
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

interface WhatsAppWebhook {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string; caption?: string };
          audio?: { id: string; mime_type: string };
          document?: { id: string; filename: string; mime_type: string };
        }>;
        contacts?: Array<{
          profile?: { name: string };
          wa_id: string;
        }>;
      };
    }>;
  }>;
}

// Message handler (POST)
export async function POST(request: Request): Promise<NextResponse> {
  const data = (await request.json()) as WhatsAppWebhook;

  const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
  const contacts = data.entry?.[0]?.changes?.[0]?.value?.contacts;

  if (!messages?.length) {
    return NextResponse.json({ ok: true });
  }

  for (const msg of messages) {
    // Currently handle text messages; media handling can be added
    if (msg.type !== 'text' || !msg.text?.body) continue;

    const phone = msg.from;
    const userId = `whatsapp:${phone}`;
    const contactName = contacts?.find(c => c.wa_id === phone)?.profile?.name;

    // Ensure user exists
    try {
      const db = getDb();
      await db
        .insert(users)
        .values({
          id: userId,
          email: `${phone}@whatsapp.bridge`,
          displayName: contactName ?? null,
        })
        .onConflictDoNothing();
    } catch { /* non-critical */ }

    const incoming: IncomingMessage = {
      channelType: 'whatsapp',
      channelUserId: phone,
      text: msg.text.body,
      metadata: {
        phone,
        contactName,
      },
    };

    const adapter = getWhatsAppAdapter();

    handleChannelMessage(incoming, userId, adapter).catch(err => {
      console.error('WhatsApp handler error:', err);
    });
  }

  return NextResponse.json({ ok: true });
}
