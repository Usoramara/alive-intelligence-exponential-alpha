// Brave Search API integration
// Pattern extracted from OpenClaw, stripped of pi-agent-core dependencies

const BRAVE_SEARCH_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
const DEFAULT_COUNT = 5;
const MAX_COUNT = 10;
const TIMEOUT_MS = 15_000;

interface BraveSearchResult {
  title?: string;
  url?: string;
  description?: string;
  age?: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveSearchResult[];
  };
}

export interface WebSearchResult {
  title: string;
  url: string;
  description: string;
  published?: string;
}

export interface WebSearchOutput {
  query: string;
  results: WebSearchResult[];
  count: number;
}

export async function webSearch(params: {
  query: string;
  count?: number;
}): Promise<WebSearchOutput> {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'BRAVE_API_KEY not configured. Web search is unavailable.',
    );
  }

  const count = Math.max(1, Math.min(MAX_COUNT, params.count ?? DEFAULT_COUNT));

  const url = new URL(BRAVE_SEARCH_ENDPOINT);
  url.searchParams.set('q', params.query);
  url.searchParams.set('count', String(count));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(
      `Brave Search API error (${res.status}): ${detail || res.statusText}`,
    );
  }

  const data = (await res.json()) as BraveSearchResponse;
  const results = (data.web?.results ?? []).map((entry) => ({
    title: entry.title ?? '',
    url: entry.url ?? '',
    description: entry.description ?? '',
    published: entry.age || undefined,
  }));

  return {
    query: params.query,
    results,
    count: results.length,
  };
}
