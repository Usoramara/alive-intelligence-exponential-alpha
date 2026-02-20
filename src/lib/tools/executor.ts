// Tool executor — dispatches tool calls by name and returns results

import { webSearch } from './web-search';
import { webFetch } from './web-fetch';
import { searchMemories } from '@/lib/memory/manager';

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  userId?: string; // For user-scoped tools like memory search
}

export interface ToolResult {
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

async function memorySearch(params: {
  query: string;
  userId?: string;
}): Promise<{ results: Array<{ content: string; type: string; similarity?: number }>; count: number }> {
  if (!params.userId) {
    return { results: [], count: 0 };
  }
  const memories = await searchMemories(params.userId, params.query, 10);
  return {
    results: memories.map(m => ({
      content: m.content,
      type: m.type,
      similarity: m.similarity,
    })),
    count: memories.length,
  };
}

export async function executeTool(call: ToolCall): Promise<ToolResult> {
  try {
    let result: unknown;

    switch (call.name) {
      case 'web_search':
        result = await webSearch({
          query: call.input.query as string,
          count: call.input.count as number | undefined,
        });
        break;

      case 'web_fetch':
        result = await webFetch({
          url: call.input.url as string,
          max_chars: call.input.max_chars as number | undefined,
        });
        break;

      case 'memory_search':
        result = await memorySearch({
          query: call.input.query as string,
          userId: call.userId,
        });
        break;

      default:
        return {
          tool_use_id: call.id,
          content: `Unknown tool: ${call.name}`,
          is_error: true,
        };
    }

    return {
      tool_use_id: call.id,
      content: JSON.stringify(result),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Tool execution failed';
    return {
      tool_use_id: call.id,
      content: JSON.stringify({ error: message }),
      is_error: true,
    };
  }
}
