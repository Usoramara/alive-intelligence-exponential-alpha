/**
 * Skills System — loads YAML/MD skill definitions and injects them as tools.
 *
 * Skill files are YAML with frontmatter that defines:
 * - name: Tool name
 * - description: What the tool does
 * - parameters: JSON Schema for input
 * - prompt: System prompt injected when tool is invoked
 *
 * Example skill file (skills/my-skill.yml):
 * ```yaml
 * name: summarize_text
 * description: Summarize a piece of text concisely
 * parameters:
 *   type: object
 *   properties:
 *     text:
 *       type: string
 *       description: The text to summarize
 *     length:
 *       type: string
 *       enum: [short, medium, long]
 *       description: Desired summary length
 *   required: [text]
 * prompt: |
 *   Summarize the following text. Be concise and capture the key points.
 *   Length preference: {{length}}
 *   Text: {{text}}
 * ```
 */

import type { ToolDefinition } from '@/lib/tools/registry';
import * as fs from 'fs';
import * as path from 'path';

export interface SkillDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  prompt?: string;
  /** If true, this skill is always included in the tool list */
  always?: boolean;
  /** Required environment variables */
  requires_env?: string[];
}

/**
 * Parse YAML frontmatter from a skill file.
 * Supports simple YAML parsing without external dependencies.
 */
function parseSimpleYaml(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentKey = '';
  let inMultiline = false;
  let multilineValue = '';

  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('---')) continue;

    if (inMultiline) {
      if (line.match(/^\S/) && !line.startsWith(' ') && !line.startsWith('\t')) {
        // End of multiline
        result[currentKey] = multilineValue.trim();
        inMultiline = false;
        // Fall through to process this line
      } else {
        multilineValue += line.replace(/^ {2}/, '') + '\n';
        continue;
      }
    }

    const match = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (match) {
      currentKey = match[1];
      const value = match[2].trim();
      if (value === '|' || value === '>') {
        inMultiline = true;
        multilineValue = '';
      } else if (value.startsWith('{') || value.startsWith('[')) {
        try {
          result[currentKey] = JSON.parse(value);
        } catch {
          result[currentKey] = value;
        }
      } else if (value === 'true') {
        result[currentKey] = true;
      } else if (value === 'false') {
        result[currentKey] = false;
      } else if (value.match(/^\d+$/)) {
        result[currentKey] = parseInt(value);
      } else {
        result[currentKey] = value;
      }
    }
  }

  if (inMultiline) {
    result[currentKey] = multilineValue.trim();
  }

  return result;
}

/**
 * Load a single skill from a YAML or Markdown file.
 */
function loadSkillFile(filePath: string): SkillDefinition | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Handle YAML files
    if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
      const data = parseSimpleYaml(content);
      if (!data.name || !data.description) return null;

      return {
        name: data.name as string,
        description: data.description as string,
        parameters: (data.parameters ?? { type: 'object', properties: {}, required: [] }) as Record<string, unknown>,
        prompt: data.prompt as string | undefined,
        always: data.always as boolean | undefined,
        requires_env: data.requires_env as string[] | undefined,
      };
    }

    // Handle Markdown files with YAML frontmatter
    if (filePath.endsWith('.md')) {
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
      if (!fmMatch) return null;

      const data = parseSimpleYaml(fmMatch[1]);
      const body = fmMatch[2].trim();

      if (!data.name || !data.description) return null;

      return {
        name: data.name as string,
        description: data.description as string,
        parameters: (data.parameters ?? { type: 'object', properties: {}, required: [] }) as Record<string, unknown>,
        prompt: body || (data.prompt as string | undefined),
        always: data.always as boolean | undefined,
        requires_env: data.requires_env as string[] | undefined,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Load all skills from a directory.
 */
export function loadSkillsFromDirectory(dir: string): SkillDefinition[] {
  if (!fs.existsSync(dir)) return [];

  const skills: SkillDefinition[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.yml', '.yaml', '.md'].includes(ext)) {
        const skill = loadSkillFile(path.join(dir, entry.name));
        if (skill) skills.push(skill);
      }
    } else if (entry.isDirectory()) {
      // Check for index file inside skill directory
      const indexFiles = ['index.yml', 'index.yaml', 'index.md', 'skill.yml', 'skill.yaml'];
      for (const indexFile of indexFiles) {
        const indexPath = path.join(dir, entry.name, indexFile);
        if (fs.existsSync(indexPath)) {
          const skill = loadSkillFile(indexPath);
          if (skill) skills.push(skill);
          break;
        }
      }
    }
  }

  return skills;
}

/**
 * Convert skill definitions to Anthropic tool definitions.
 */
export function skillsToTools(skills: SkillDefinition[]): ToolDefinition[] {
  return skills
    .filter(skill => {
      // Check required env vars
      if (skill.requires_env) {
        return skill.requires_env.every(envVar => process.env[envVar]);
      }
      return true;
    })
    .map(skill => ({
      name: skill.name,
      description: skill.description,
      input_schema: {
        type: 'object' as const,
        ...skill.parameters,
      },
    }));
}

/**
 * Get the prompt template for a skill (used during tool execution).
 */
const skillPrompts = new Map<string, string>();

export function getSkillPrompt(skillName: string): string | undefined {
  return skillPrompts.get(skillName);
}

/**
 * Load skills and register their prompts.
 */
export function loadAndRegisterSkills(skillDirs: string[]): ToolDefinition[] {
  const allSkills: SkillDefinition[] = [];

  for (const dir of skillDirs) {
    const skills = loadSkillsFromDirectory(dir);
    allSkills.push(...skills);
  }

  // Register prompts
  for (const skill of allSkills) {
    if (skill.prompt) {
      skillPrompts.set(skill.name, skill.prompt);
    }
  }

  return skillsToTools(allSkills);
}
