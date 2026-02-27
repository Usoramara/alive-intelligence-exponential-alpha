import {
  pgTable,
  text,
  timestamp,
  real,
  integer,
  boolean,
  jsonb,
  uuid,
  index,
  uniqueIndex,
  vector,
} from 'drizzle-orm/pg-core';

// ── Users (synced from Clerk) ──

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  displayName: text('display_name'),
  tier: text('tier').notNull().default('free'), // 'free' | 'pro' | 'enterprise'
  apiKeyEncrypted: text('api_key_encrypted'), // BYOK: AES-256-GCM encrypted Anthropic key
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Conversations ──

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').default('New conversation'),
    channel: text('channel').default('web'), // 'web' | 'voice' | 'telegram' | etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('conversations_user_idx').on(t.userId)],
);

// ── Messages ──

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    role: text('role').notNull(), // 'user' | 'assistant'
    content: text('content').notNull(),
    emotionShift: jsonb('emotion_shift'), // Partial<SelfState>
    metadata: jsonb('metadata'), // tool activities, etc.
    enriched: boolean('enriched').default(false), // whether background enrichment has processed this message
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('messages_conversation_idx').on(t.conversationId)],
);

// ── Cognitive States (per-user self state) ──

export const cognitiveStates = pgTable('cognitive_states', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  valence: real('valence').notNull().default(0.6),
  arousal: real('arousal').notNull().default(0.3),
  confidence: real('confidence').notNull().default(0.5),
  energy: real('energy').notNull().default(0.7),
  social: real('social').notNull().default(0.4),
  curiosity: real('curiosity').notNull().default(0.6),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Memories (with vector embeddings) ──

export const memories = pgTable(
  'memories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull().default('episodic'), // 'episodic' | 'semantic' | 'procedural'
    content: text('content').notNull(),
    significance: real('significance').notNull().default(0.5),
    tags: text('tags').array(),
    embedding: vector('embedding', { dimensions: 384 }), // all-MiniLM-L6-v2 (local)
    lastAccessedAt: timestamp('last_accessed_at').defaultNow(), // for significance decay
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('memories_user_idx').on(t.userId)],
);

// ── Scheduled Jobs ──

export const scheduledJobs = pgTable(
  'scheduled_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    cronExpr: text('cron_expr'),
    nextRunAt: timestamp('next_run_at').notNull(),
    timezone: text('timezone').default('UTC'),
    payload: text('payload'), // JSON string with job details
    status: text('status').notNull().default('active'), // 'active' | 'completed' | 'cancelled'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('scheduled_jobs_user_idx').on(t.userId),
    index('scheduled_jobs_status_next_run_idx').on(t.status, t.nextRunAt),
  ],
);

// ── Usage Records ──

export const usageRecords = pgTable(
  'usage_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    endpoint: text('endpoint').notNull(),
    model: text('model').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    costCents: real('cost_cents').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('usage_user_idx').on(t.userId)],
);

// ── Agent Files (OpenClaw SOUL.md / IDENTITY.md / USER.md persisted for serverless) ──

export const agentFiles = pgTable(
  'agent_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: text('agent_id').notNull(),
    fileName: text('file_name').notNull(),
    content: text('content').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('agent_files_agent_file_idx').on(t.agentId, t.fileName)],
);

// ── Consciousness Stream (persistent inner thoughts) ──

export const streamEntries = pgTable(
  'stream_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    source: text('source').notNull(), // engine that generated this thought
    flavor: text('flavor').notNull(), // 'wandering' | 'emotional' | 'memory' | etc.
    intensity: real('intensity').notNull().default(0.5),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('stream_entries_user_idx').on(t.userId)],
);

// ── Pending Insights (queued for next interaction) ──

export const pendingInsights = pgTable(
  'pending_insights',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'memory-connection' | 'reflection' | 'proactive-thought'
    content: text('content').notNull(),
    priority: real('priority').notNull().default(0.5), // 0-1
    delivered: boolean('delivered').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('pending_insights_user_idx').on(t.userId)],
);

// ── Behavioral Preferences (learned response style preferences per person) ──

export const behavioralPreferences = pgTable(
  'behavioral_preferences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Learned response style preferences
    preferredLength: real('preferred_length').notNull().default(0.5), // 0=terse, 1=verbose
    mirroringIntensity: real('mirroring_intensity').notNull().default(0.5), // 0=minimal, 1=high
    humorFrequency: real('humor_frequency').notNull().default(0.3), // 0=serious, 1=playful
    warmthLevel: real('warmth_level').notNull().default(0.5), // 0=formal, 1=warm
    directness: real('directness').notNull().default(0.5), // 0=indirect, 1=direct
    // Tracking
    sampleCount: integer('sample_count').notNull().default(0),
    lastUpdatedAt: timestamp('last_updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('behavioral_pref_user_idx').on(t.userId)],
);

// ── Value Decisions (logged value-aligned decisions for evolution) ──

export const valueDecisions = pgTable(
  'value_decisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    value: text('value').notNull(), // which value cluster
    decision: text('decision').notNull(), // what decision was made
    context: text('context').notNull(), // what triggered it
    outcome: text('outcome'), // what happened after (filled later)
    severity: real('severity').notNull().default(0.5),
    wasOverridden: boolean('was_overridden').default(false), // did the user push through?
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('value_decisions_user_idx').on(t.userId)],
);

// ── Channel Conversations (persistent channel history) ──

export const channelConversations = pgTable(
  'channel_conversations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    channelType: text('channel_type').notNull(), // 'telegram' | 'slack' | 'discord' | 'whatsapp' | ...
    channelUserId: text('channel_user_id').notNull(),
    messages: jsonb('messages').notNull(), // Array<{ role, content }>
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('channel_conversations_user_channel_idx').on(t.userId, t.channelType, t.channelUserId),
  ],
);
