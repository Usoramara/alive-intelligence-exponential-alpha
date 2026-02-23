'use client';

import Link from 'next/link';

export default function StreamPage() {
  return (
    <main className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            &larr; Back
          </Link>
          <div>
            <h1 className="text-lg font-mono text-white/80 tracking-tight">
              Stream
            </h1>
            <p className="text-xs font-mono text-white/25">
              36-engine cognitive architecture — live streams
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/intelligence" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            Intelligence &rarr;
          </Link>
          <Link href="/system" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            System &rarr;
          </Link>
          <Link href="/thoughts" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            Thoughts &rarr;
          </Link>
          <Link href="/execution/chat?session=main" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            Execution &rarr;
          </Link>
        </div>
      </header>

      {/* Embedded architecture stream */}
      <iframe
        src="https://alive-intelligence-architecture.vercel.app"
        className="flex-1 w-full border-0"
        allow="fullscreen"
      />
    </main>
  );
}
