import { NextResponse } from 'next/server';
import type { ZodSchema, ZodError } from 'zod';

const isDev = process.env.NODE_ENV === 'development';

function checkOrigin(request: Request): boolean {
  if (isDev) return true;

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const source = origin || (referer ? new URL(referer).origin : null);

  if (!source) return false;

  const allowed = new Set<string>();

  // Same-origin: Vercel provides this
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    allowed.add(`https://${vercelUrl}`);
  }

  // Custom allowed origins
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const o of extra.split(',')) {
      const trimmed = o.trim();
      if (trimmed) allowed.add(trimmed);
    }
  }

  // In production on Vercel, also allow the deployment URL from the request itself
  const host = request.headers.get('host');
  if (host) {
    allowed.add(`https://${host}`);
  }

  return allowed.has(source);
}

interface ApiHandlerOptions<T> {
  schema: ZodSchema<T>;
  handler: (body: T) => Promise<NextResponse | object>;
}

export function createApiHandler<T>({ schema, handler }: ApiHandlerOptions<T>) {
  return async function POST(request: Request): Promise<NextResponse> {
    // Origin check
    if (!checkOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate body
    let body: T;
    try {
      const raw = await request.json();
      const result = schema.safeParse(raw);
      if (!result.success) {
        const message = isDev
          ? formatZodError(result.error)
          : 'Invalid request body';
        return NextResponse.json({ error: message }, { status: 400 });
      }
      body = result.data;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Execute handler
    try {
      const result = await handler(body);
      if (result instanceof NextResponse) {
        return result;
      }
      return NextResponse.json(result);
    } catch (error) {
      console.error('API handler error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('; ');
}
