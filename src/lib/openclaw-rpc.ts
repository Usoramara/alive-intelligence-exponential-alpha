/**
 * Backward-compatible wrapper over the persistent OpenClaw bridge.
 *
 * Returns typed RpcResult<T> instead of swallowing errors with .catch(() => null).
 */

import { getOpenClawBridge } from './openclaw-bridge';
import { type RpcResult, toResult } from './openclaw-errors';

export type { RpcResult };

/**
 * Call multiple RPC methods in parallel, returning typed results.
 */
export async function queryOpenClawGateway(
  methods: string[],
  timeoutMs = 8_000,
): Promise<RpcResult[]> {
  const bridge = getOpenClawBridge();
  return Promise.all(
    methods.map((m) => toResult(() => bridge.call(m, undefined, timeoutMs))),
  );
}

/**
 * Call a single RPC method with params, returning a typed result.
 */
export async function callOpenClaw<T = unknown>(
  method: string,
  params?: unknown,
  timeoutMs = 8_000,
): Promise<RpcResult<T>> {
  const bridge = getOpenClawBridge();
  return toResult(() => bridge.call(method, params, timeoutMs) as Promise<T>);
}
