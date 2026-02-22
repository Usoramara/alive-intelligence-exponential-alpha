/**
 * Bridge for discovering and executing OpenClaw tools from Wybe.
 *
 * Discovers tools via RPC, caches definitions, and routes execution
 * through the bridge. Cache refreshes every 5 minutes.
 */

import { getOpenClawBridge } from './openclaw-bridge';
import { OpenClawConnectionError } from './openclaw-errors';
import type { ToolDefinition } from './tools/registry';

interface OpenClawToolDef {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  source?: string;
}

// ── Cache ──

let cachedTools: OpenClawToolDef[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

/**
 * Discover available tools from the OpenClaw gateway.
 * Results are cached for 5 minutes.
 */
export async function discoverOpenClawTools(): Promise<OpenClawToolDef[]> {
  const now = Date.now();
  if (cachedTools && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedTools;
  }

  try {
    const bridge = getOpenClawBridge();
    const result = await bridge.call('tools.list', undefined, 10_000) as { tools?: OpenClawToolDef[] } | null;

    if (result?.tools && Array.isArray(result.tools)) {
      cachedTools = result.tools;
      cacheTimestamp = now;
      return cachedTools;
    }
  } catch (err) {
    console.debug('[openclaw-tool-bridge] discovery failed:', err instanceof Error ? err.message : err);
    // Return stale cache if available
    if (cachedTools) return cachedTools;
  }

  return [];
}

/**
 * Execute an OpenClaw tool by name.
 */
export async function executeOpenClawTool(
  toolName: string,
  input: Record<string, unknown>,
  requestId?: string,
): Promise<{ result: string; is_error: boolean }> {
  try {
    const bridge = getOpenClawBridge();
    const status = bridge.getStatus();
    if (!status.connected) {
      throw new OpenClawConnectionError('Not connected to OpenClaw gateway');
    }

    const response = await bridge.call('tools.execute', {
      tool: toolName,
      input,
      requestId: requestId || crypto.randomUUID(),
    }, 30_000) as { result?: string; is_error?: boolean } | null;

    return {
      result: response?.result ?? JSON.stringify(response),
      is_error: response?.is_error ?? false,
    };
  } catch (err) {
    return {
      result: JSON.stringify({ error: err instanceof Error ? err.message : 'OpenClaw tool execution failed' }),
      is_error: true,
    };
  }
}

/**
 * Convert OpenClaw tool definitions to Anthropic ToolDefinition format
 * for inclusion in the full tool registry.
 */
export function openClawToolsAsDefinitions(tools: OpenClawToolDef[]): ToolDefinition[] {
  return tools.map((t) => ({
    name: `openclaw_${t.name}`,
    description: `[OpenClaw] ${t.description}`,
    input_schema: t.parameters as ToolDefinition['input_schema'],
  }));
}

/**
 * Check if a tool name is an OpenClaw-prefixed tool.
 */
export function isOpenClawTool(toolName: string): boolean {
  return toolName.startsWith('openclaw_');
}

/**
 * Strip the 'openclaw_' prefix to get the original tool name.
 */
export function getOriginalToolName(prefixedName: string): string {
  return prefixedName.replace(/^openclaw_/, '');
}
