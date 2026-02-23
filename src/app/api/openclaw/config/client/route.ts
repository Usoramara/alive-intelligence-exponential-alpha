import { NextResponse } from 'next/server';

/**
 * GET /api/openclaw/config/client
 *
 * Returns the gateway WebSocket URL and token for browser-side connections.
 * The OpenClaw control UI needs these to connect directly from the browser.
 *
 * Server-side env vars:
 *   OPENCLAW_GATEWAY_URL   – e.g. ws://127.0.0.1:18789  (default)
 *   OPENCLAW_GATEWAY_TOKEN – auth token for the gateway handshake
 *   OPENCLAW_CLIENT_GATEWAY_URL – optional override for browser-reachable URL
 *                                 (useful for ngrok/tunnels on Vercel)
 */
export async function GET() {
  const serverUrl = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
  const token = process.env.OPENCLAW_GATEWAY_TOKEN || '';

  // Allow an explicit browser-facing override (ngrok, tunnels, etc.)
  let clientUrl = process.env.OPENCLAW_CLIENT_GATEWAY_URL || '';

  if (!clientUrl) {
    // Convert 127.0.0.1 / 0.0.0.0 to localhost so the browser can reach it
    clientUrl = serverUrl
      .replace('://127.0.0.1', '://localhost')
      .replace('://0.0.0.0', '://localhost');
  }

  return NextResponse.json({ gatewayUrl: clientUrl, token });
}
