import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting (per-user when authenticated, per-IP when not)
const WINDOW_MS = 60_000;
const MAX_REQUESTS_FREE = 20;
const MAX_REQUESTS_AUTHENTICATED = 60;

const hits = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) {
      hits.delete(key);
    }
  }
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function rateLimit(key: string, maxRequests: number): NextResponse | null {
  cleanup();

  const now = Date.now();
  let entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(key, entry);
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    );
  }

  return null;
}

// Public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

// API routes that need rate limiting
const isApiRoute = createRouteMatcher(['/api/mind(.*)', '/api/user(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Rate limiting for API routes
  if (isApiRoute(request)) {
    const rateLimitKey = userId ?? `ip:${getClientIp(request as NextRequest)}`;
    const maxRequests = userId ? MAX_REQUESTS_AUTHENTICATED : MAX_REQUESTS_FREE;
    const rateLimitResponse = rateLimit(rateLimitKey, maxRequests);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
