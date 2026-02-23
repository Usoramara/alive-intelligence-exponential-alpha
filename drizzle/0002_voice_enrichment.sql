-- Voice Intelligence Pipeline: add channel tracking and enrichment status

ALTER TABLE "conversations" ADD COLUMN "channel" text DEFAULT 'web';
ALTER TABLE "messages" ADD COLUMN "enriched" boolean DEFAULT false;
