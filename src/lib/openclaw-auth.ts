/**
 * Shared authentication helper for OpenClaw API routes.
 *
 * Supports:
 * - Gateway API key (x-api-key header or Bearer token)
 * - Clerk JWT (future)
 * - Device tokens (future)
 */

const GATEWAY_API_KEY = process.env.WYBE_GATEWAY_API_KEY;

export type AuthResult =
  | { authenticated: true; userId: string; method: 'api-key' }
  | { authenticated: false; error: string };

/**
 * Validate authentication for an incoming request.
 * Checks x-api-key header and Authorization: Bearer header.
 */
export function validateOpenClawAuth(request: Request): AuthResult {
  if (!GATEWAY_API_KEY) {
    return { authenticated: false, error: 'Server not configured: missing WYBE_GATEWAY_API_KEY' };
  }

  // Check x-api-key header
  const apiKey = request.headers.get('x-api-key');
  if (apiKey === GATEWAY_API_KEY) {
    const userId = request.headers.get('x-openclaw-user-id') || process.env.WYBE_GATEWAY_USER_ID || 'wybe-gateway';
    return { authenticated: true, userId, method: 'api-key' };
  }

  // Check Authorization: Bearer header
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ') && auth.slice(7) === GATEWAY_API_KEY) {
    const userId = request.headers.get('x-openclaw-user-id') || process.env.WYBE_GATEWAY_USER_ID || 'wybe-gateway';
    return { authenticated: true, userId, method: 'api-key' };
  }

  return { authenticated: false, error: 'Invalid or missing API key' };
}
