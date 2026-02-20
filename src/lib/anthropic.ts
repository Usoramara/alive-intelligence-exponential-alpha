import Anthropic from '@anthropic-ai/sdk';

// Platform client (singleton)
let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

// Per-user client (for BYOK support)
// Uses decrypted user key if available, falls back to platform key
export function getClientForUser(decryptedApiKey?: string): Anthropic {
  if (decryptedApiKey) {
    return new Anthropic({ apiKey: decryptedApiKey });
  }
  return getAnthropicClient();
}
