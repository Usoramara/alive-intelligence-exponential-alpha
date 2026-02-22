/**
 * Bridge that loads skill manifests from OpenClaw, converts them to
 * ToolDefinition[], and provides execution handlers that route
 * through the OpenClaw bridge.
 */

import { getOpenClawBridge } from './openclaw-bridge';
import type { ToolDefinition } from './tools/registry';

interface SkillManifest {
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  tools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
}

// ── Cache ──

let cachedSkills: SkillManifest[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60_000;

/**
 * Fetch skill manifests from OpenClaw.
 */
export async function discoverSkills(): Promise<SkillManifest[]> {
  const now = Date.now();
  if (cachedSkills && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSkills;
  }

  try {
    const bridge = getOpenClawBridge();
    const result = await bridge.call('skills.status', undefined, 10_000) as {
      skills?: SkillManifest[];
    } | null;

    if (result?.skills && Array.isArray(result.skills)) {
      cachedSkills = result.skills;
      cacheTimestamp = now;
      return cachedSkills;
    }
  } catch (err) {
    console.debug('[openclaw-skill-bridge] discovery failed:', err instanceof Error ? err.message : err);
    if (cachedSkills) return cachedSkills;
  }

  return [];
}

/**
 * Convert enabled skills' tools to ToolDefinition[] for the full registry.
 * Tool names are prefixed with `skill_` to distinguish from core tools.
 */
export async function skillToolDefinitions(): Promise<ToolDefinition[]> {
  const skills = await discoverSkills();
  const defs: ToolDefinition[] = [];

  for (const skill of skills) {
    if (!skill.enabled || !skill.tools) continue;
    for (const tool of skill.tools) {
      defs.push({
        name: `skill_${skill.name}_${tool.name}`,
        description: `[Skill: ${skill.name}] ${tool.description}`,
        input_schema: tool.parameters as ToolDefinition['input_schema'],
      });
    }
  }

  return defs;
}

/**
 * Execute a skill tool via the OpenClaw bridge.
 */
export async function executeSkillTool(
  skillToolName: string,
  input: Record<string, unknown>,
): Promise<{ result: string; is_error: boolean }> {
  try {
    const bridge = getOpenClawBridge();
    const response = await bridge.call('skills.execute', {
      tool: skillToolName,
      input,
    }, 30_000) as { result?: string; is_error?: boolean } | null;

    return {
      result: response?.result ?? JSON.stringify(response),
      is_error: response?.is_error ?? false,
    };
  } catch (err) {
    return {
      result: JSON.stringify({ error: err instanceof Error ? err.message : 'Skill execution failed' }),
      is_error: true,
    };
  }
}
