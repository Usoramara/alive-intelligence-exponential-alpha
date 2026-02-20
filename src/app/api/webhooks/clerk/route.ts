import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Clerk webhook handler — syncs user data to our database
// Webhook URL: /api/webhooks/clerk
// Events: user.created, user.updated, user.deleted
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { type, data } = body;

  const db = getDb();

  switch (type) {
    case 'user.created':
    case 'user.updated': {
      const email = data.email_addresses?.[0]?.email_address ?? '';
      const displayName = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() || null;

      await db
        .insert(users)
        .values({
          id: data.id,
          email,
          displayName,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email,
            displayName,
            updatedAt: new Date(),
          },
        });
      break;
    }

    case 'user.deleted': {
      if (data.id) {
        await db.delete(users).where(eq(users.id, data.id));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
