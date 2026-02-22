import { NextResponse } from 'next/server';
import { queryOpenClawGateway } from '@/lib/openclaw-rpc';
import { getOpenClawBridge } from '@/lib/openclaw-bridge';

export async function GET() {
  const bridge = getOpenClawBridge();
  const bridgeStatus = bridge.getStatus();

  const [health, channels, sessionsRaw] = await queryOpenClawGateway([
    'health',
    'status',
    'sessions.list',
  ]);

  const gatewayOnline = health !== null;

  // RPC returns { sessions: [...] } — normalize to flat array for the dashboard.
  const sessions =
    sessionsRaw &&
    typeof sessionsRaw === 'object' &&
    'sessions' in sessionsRaw &&
    Array.isArray((sessionsRaw as Record<string, unknown>).sessions)
      ? (sessionsRaw as Record<string, unknown>).sessions
      : sessionsRaw;

  return NextResponse.json({
    gatewayOnline,
    bridge: bridgeStatus,
    health,
    channels,
    sessions,
    error: gatewayOnline ? null : 'Gateway not running',
  });
}
