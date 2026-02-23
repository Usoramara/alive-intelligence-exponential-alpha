/**
 * Persistent WebSocket bridge to the OpenClaw gateway.
 *
 * Maintains a reconnecting connection with exponential backoff,
 * handles the v3 handshake, and exposes RPC call + event subscription.
 */

import {
  OpenClawConnectionError,
  OpenClawRpcError,
  OpenClawTimeoutError,
} from './openclaw-errors';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';
const MIN_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const DEFAULT_CALL_TIMEOUT_MS = 8_000;

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

type EventHandler = (payload: unknown) => void;

export type BridgeStatus = {
  connected: boolean;
  latencyMs: number | null;
};

class OpenClawBridge {
  private ws: WebSocket | null = null;
  private connected = false;
  private destroyed = false;
  private backoff = MIN_BACKOFF_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pending = new Map<string, PendingRequest>();
  private listeners = new Map<string, Set<EventHandler>>();
  private handshakeId: string | null = null;
  private lastPingMs: number | null = null;
  private connectWaiters: Array<{ resolve: () => void; reject: (err: Error) => void }> = [];

  constructor() {
    this.connect();
  }

  /**
   * Wait for the bridge to be connected (or already connected).
   * Returns immediately if already connected, otherwise waits up to timeoutMs.
   */
  waitForConnection(timeoutMs = 5_000): Promise<void> {
    if (this.connected) return Promise.resolve();
    if (this.destroyed) return Promise.reject(new OpenClawConnectionError('Bridge destroyed'));
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = this.connectWaiters.findIndex((w) => w.resolve === resolve);
        if (idx !== -1) this.connectWaiters.splice(idx, 1);
        reject(new OpenClawConnectionError(`Connection timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      this.connectWaiters.push({
        resolve: () => { clearTimeout(timer); resolve(); },
        reject: (err: Error) => { clearTimeout(timer); reject(err); },
      });
    });
  }

  private resolveConnectWaiters() {
    const waiters = this.connectWaiters.splice(0);
    for (const w of waiters) w.resolve();
  }

  private connect() {
    if (this.destroyed) return;
    try {
      this.ws = new WebSocket(GATEWAY_URL);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      // Wait for connect.challenge event from gateway
    };

    this.ws.onmessage = (event) => {
      try {
        const frame = JSON.parse(String(event.data));
        this.handleFrame(frame);
      } catch {
        // Malformed frame
      }
    };

    this.ws.onerror = () => {
      // onclose will fire after this
    };

    this.ws.onclose = () => {
      const wasConnected = this.connected;
      this.connected = false;
      this.rejectAllPending('Connection closed');
      if (wasConnected) {
        console.log('[OpenClawBridge] Disconnected');
      }
      this.scheduleReconnect();
    };
  }

  private handleFrame(frame: Record<string, unknown>) {
    // --- Handshake: connect.challenge → connect ---
    if (frame.type === 'event' && frame.event === 'connect.challenge') {
      const id = crypto.randomUUID();
      this.handshakeId = id;
      this.lastPingMs = Date.now();
      const connectParams: Record<string, unknown> = {
        minProtocol: 3,
        maxProtocol: 3,
        client: {
          id: 'gateway-client',
          version: 'alive-v3',
          platform: 'node',
          mode: 'backend',
        },
        role: 'operator',
        scopes: ['operator.read', 'operator.admin'],
      };
      if (GATEWAY_TOKEN) {
        connectParams.auth = { token: GATEWAY_TOKEN };
      }
      this.ws?.send(JSON.stringify({
        type: 'req',
        id,
        method: 'connect',
        params: connectParams,
      }));
      return;
    }

    // --- Response frames ---
    if (frame.type === 'res') {
      const id = String(frame.id ?? '');

      // Handshake response
      if (id === this.handshakeId) {
        this.handshakeId = null;
        if (frame.ok) {
          this.connected = true;
          this.backoff = MIN_BACKOFF_MS;
          if (this.lastPingMs) {
            this.lastPingMs = Date.now() - this.lastPingMs;
          }
          this.resolveConnectWaiters();
          console.log('[OpenClawBridge] Connected');
        } else {
          console.error('[OpenClawBridge] Handshake rejected:', JSON.stringify(frame.error ?? frame));
          this.ws?.close();
        }
        return;
      }

      // Normal RPC response
      const req = this.pending.get(id);
      if (req) {
        this.pending.delete(id);
        clearTimeout(req.timer);
        if (frame.ok) {
          req.resolve(frame.payload ?? null);
        } else {
          const errMsg = typeof frame.error === 'object' && frame.error !== null
            ? JSON.stringify(frame.error)
            : String(frame.error ?? 'RPC error');
          const code = typeof frame.error === 'object' && frame.error !== null
            ? (frame.error as Record<string, unknown>).code as string | undefined
            : undefined;
          req.reject(new OpenClawRpcError(String(frame.method ?? 'unknown'), errMsg, code));
        }
      }
      return;
    }

    // --- Event frames ---
    if (frame.type === 'event' && typeof frame.event === 'string') {
      const handlers = this.listeners.get(frame.event);
      if (handlers) {
        for (const handler of handlers) {
          try {
            handler(frame.payload);
          } catch {
            // Event handler error
          }
        }
      }
    }
  }

  private scheduleReconnect() {
    if (this.destroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.backoff);
    this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF_MS);
  }

  private rejectAllPending(reason: string) {
    for (const [, req] of this.pending) {
      clearTimeout(req.timer);
      req.reject(new OpenClawConnectionError(reason));
    }
    this.pending.clear();
  }

  async call(method: string, params?: unknown, timeoutMs = DEFAULT_CALL_TIMEOUT_MS): Promise<unknown> {
    if (!this.connected || !this.ws) {
      throw new OpenClawConnectionError('Not connected to gateway');
    }
    const id = crypto.randomUUID();
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new OpenClawTimeoutError(method, timeoutMs));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.ws!.send(JSON.stringify({
        type: 'req',
        id,
        method,
        ...(params !== undefined ? { params } : {}),
      }));
    });
  }

  on(event: string, handler: EventHandler) {
    let handlers = this.listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this.listeners.set(event, handlers);
    }
    handlers.add(handler);
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  getStatus(): BridgeStatus {
    return {
      connected: this.connected,
      latencyMs: this.lastPingMs,
    };
  }

  destroy() {
    this.destroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.rejectAllPending('Bridge destroyed');
    this.listeners.clear();
    try {
      this.ws?.close();
    } catch {
      // ignore
    }
    this.ws = null;
  }
}

// --- Singleton ---

let instance: OpenClawBridge | null = null;

export function getOpenClawBridge(): OpenClawBridge {
  if (!instance) {
    instance = new OpenClawBridge();
  }
  return instance;
}

export function destroyOpenClawBridge() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
