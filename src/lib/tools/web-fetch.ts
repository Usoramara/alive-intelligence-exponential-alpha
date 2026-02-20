// Web fetch with Readability extraction
// Pattern extracted from OpenClaw, simplified for Next.js server-side use

const DEFAULT_MAX_CHARS = 20_000;
const MAX_RESPONSE_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// SSRF protection: block private/internal IPs
function isBlockedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();

    // Block common internal hostnames
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return true;
    }

    // Block private IP ranges
    const parts = hostname.split('.');
    if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
      const first = parseInt(parts[0]);
      const second = parseInt(parts[1]);
      if (first === 10) return true; // 10.0.0.0/8
      if (first === 172 && second >= 16 && second <= 31) return true; // 172.16.0.0/12
      if (first === 192 && second === 168) return true; // 192.168.0.0/16
      if (first === 169 && second === 254) return true; // link-local
    }

    // Block non-http(s) protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export interface WebFetchOutput {
  url: string;
  title?: string;
  text: string;
  contentType?: string;
  truncated: boolean;
}

export async function webFetch(params: {
  url: string;
  max_chars?: number;
}): Promise<WebFetchOutput> {
  if (isBlockedUrl(params.url)) {
    throw new Error('URL blocked: cannot fetch internal/private addresses.');
  }

  const maxChars = Math.max(100, params.max_chars ?? DEFAULT_MAX_CHARS);

  const res = await fetch(params.url, {
    method: 'GET',
    headers: {
      Accept: 'text/html, application/json, text/plain;q=0.9, */*;q=0.1',
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}): ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type') ?? '';

  // Read body with size limit
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (totalBytes < MAX_RESPONSE_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalBytes += value.length;
  }
  reader.cancel();

  const body = new TextDecoder().decode(
    chunks.length === 1
      ? chunks[0]
      : new Uint8Array(
          chunks.reduce<number[]>((acc, c) => [...acc, ...c], []),
        ),
  );

  let text: string;
  let title: string | undefined;

  if (contentType.includes('text/html')) {
    // Try Readability first
    try {
      const { Readability } = await import('@mozilla/readability');
      const { parseHTML } = await import('linkedom');
      const { document } = parseHTML(body);
      const reader = new Readability(document, { charThreshold: 0 });
      const parsed = reader.parse();
      if (parsed?.textContent) {
        text = parsed.textContent.replace(/\s+/g, ' ').trim();
        title = parsed.title || undefined;
      } else {
        // Fallback to tag stripping
        text = stripTags(body);
        const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        title = titleMatch ? stripTags(titleMatch[1]) : undefined;
      }
    } catch {
      text = stripTags(body);
      const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      title = titleMatch ? stripTags(titleMatch[1]) : undefined;
    }
  } else if (contentType.includes('application/json')) {
    try {
      text = JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      text = body;
    }
  } else {
    text = body;
  }

  const truncated = text.length > maxChars;
  if (truncated) {
    text = text.slice(0, maxChars);
  }

  return {
    url: params.url,
    title,
    text,
    contentType: contentType.split(';')[0]?.trim() || undefined,
    truncated,
  };
}
