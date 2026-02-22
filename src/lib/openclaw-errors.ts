/**
 * Typed error classes for OpenClaw bridge and RPC communication.
 */

export class OpenClawError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenClawError';
  }
}

export class OpenClawRpcError extends OpenClawError {
  readonly method: string;
  readonly code: string | undefined;

  constructor(method: string, message: string, code?: string) {
    super(`RPC error [${method}]: ${message}`);
    this.name = 'OpenClawRpcError';
    this.method = method;
    this.code = code;
  }
}

export class OpenClawConnectionError extends OpenClawError {
  constructor(message: string) {
    super(`Connection error: ${message}`);
    this.name = 'OpenClawConnectionError';
  }
}

export class OpenClawTimeoutError extends OpenClawError {
  readonly method: string;
  readonly timeoutMs: number;

  constructor(method: string, timeoutMs: number) {
    super(`RPC timeout [${method}] after ${timeoutMs}ms`);
    this.name = 'OpenClawTimeoutError';
    this.method = method;
    this.timeoutMs = timeoutMs;
  }
}

/** Discriminated result type for RPC calls */
export type RpcResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: OpenClawError };

/** Wrap an async call into a Result */
export async function toResult<T>(fn: () => Promise<T>): Promise<RpcResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (err instanceof OpenClawError) {
      return { ok: false, error: err };
    }
    return {
      ok: false,
      error: new OpenClawError(err instanceof Error ? err.message : String(err)),
    };
  }
}
