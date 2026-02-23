import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, conversations, memories, cognitiveStates } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Clerk webhook handler — syncs user data to our database
// Webhook URL: /api/webhooks/clerk
// Events: user.created, user.updated, user.deleted
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { type, data } = body;

  const db = getDb();

  switch (type) {
    case 'user.created': {
      const email = data.email_addresses?.[0]?.email_address ?? '';
      const displayName = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim() || null;

      // 1. Create Clerk user row
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

      // 2. Migrate voice-user data if it exists
      const [voiceUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, 'voice-user'));

      if (voiceUser) {
        // Move all foreign-keyed data to the Clerk userId
        await db.update(conversations).set({ userId: data.id })
          .where(eq(conversations.userId, 'voice-user'));
        await db.update(memories).set({ userId: data.id })
          .where(eq(memories.userId, 'voice-user'));
        await db.update(cognitiveStates).set({ userId: data.id })
          .where(eq(cognitiveStates.userId, 'voice-user'));
        // Delete the old placeholder user
        await db.delete(users).where(eq(users.id, 'voice-user'));
        console.log(`[clerk-webhook] Migrated voice-user data to ${data.id}`);
      }
      break;
    }

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
