import type Anthropic from '@anthropic-ai/sdk';

export type ToolDefinition = Anthropic.Tool;

export const tools: ToolDefinition[] = [
  {
    name: 'web_search',
    description:
      'Search the web using Brave Search API. Returns titles, URLs, and snippets. Use when the user asks about current events, recent information, or anything you need to look up.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'The search query string.',
        },
        count: {
          type: 'number',
          description: 'Number of results to return (1-10). Default: 5.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'web_fetch',
    description:
      'Fetch and extract readable content from a URL. Converts HTML to clean markdown text using Readability. Use to read articles, documentation, or any web page.',
    input_schema: {
      type: 'object' as const,
      properties: {
        url: {
          type: 'string',
          description: 'The HTTP or HTTPS URL to fetch.',
        },
        max_chars: {
          type: 'number',
          description: 'Maximum characters to return. Default: 20000.',
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'memory_search',
    description:
      'Search your memories about this person and past conversations. Use when the user references something from the past or when you want to recall relevant context.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'What to search for in memories.',
        },
      },
      required: ['query'],
    },
  },
];
