'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useConversation } from '@elevenlabs/react';

type Mode = 'speaking' | 'listening';

export default function VoicePage() {
  const [mode, setMode] = useState<Mode>('listening');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [disconnectReason, setDisconnectReason] = useState<'user' | 'unexpected' | null>(null);
  const userInitiatedRef = useRef(false);

  const conversation = useConversation({
    onModeChange: ({ mode: m }) => { setMode(m as Mode); console.log('[voice] mode:', m); },
    onConnect: () => {
      console.log('[voice] connected');
      setError(null);
      setDisconnectReason(null);
    },
    onDisconnect: () => {
      console.log('[voice] disconnected, userInitiated:', userInitiatedRef.current);
      if (!userInitiatedRef.current) {
        setDisconnectReason('unexpected');
      } else {
        setDisconnectReason('user');
      }
      userInitiatedRef.current = false;
    },
    onError: (err) => {
      console.error('[voice] error', err);
      setError(typeof err === 'string' ? err : (err as Error)?.message ?? 'Connection error');
    },
    onMessage: (msg) => { console.log('[voice] message:', msg); },
    onDebug: (evt) => { console.log('[voice] debug:', evt); },
  });

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';

  const startConversation = useCallback(async () => {
    setError(null);
    setDisconnectReason(null);
    userInitiatedRef.current = false;
    try {
      // Request mic permission first — ElevenLabs needs it before session starts
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch('/api/convai/signed-url', { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to get signed URL (${res.status})`);
      }
      const { signed_url } = await res.json();
      await conversation.startSession({ signedUrl: signed_url });
      conversation.setVolume({ volume });
    } catch (err) {
      console.error('[voice] start failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to start');
    }
  }, [conversation, volume]);

  const endConversation = useCallback(async () => {
    try {
      userInitiatedRef.current = true;
      await conversation.endSession();
    } catch (err) {
      console.error('[voice] end failed:', err);
    }
  }, [conversation]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (isConnected) {
      conversation.setVolume({ volume: v });
    }
  }, [conversation, isConnected]);

  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            &larr; Back
          </Link>
          <div>
            <h1 className="text-lg font-mono text-white/80 tracking-tight">
              Voice
            </h1>
            <p className="text-xs font-mono text-white/25">
              real-time conversation
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/intelligence" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            Intelligence &rarr;
          </Link>
          <Link href="/stream" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            Stream &rarr;
          </Link>
          <Link href="/openclaw" className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors">
            OpenClaw &rarr;
          </Link>
        </div>
      </header>

      {/* Center — main voice interface */}
      <div className="flex flex-col items-center gap-8 -mt-12">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full transition-colors ${
              isConnected
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                : isConnecting
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-white/20'
            }`}
          />
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
            {conversation.status}
          </span>
        </div>

        {/* Mode ring + button */}
        <div className="relative">
          {/* Outer ring — shows mode */}
          <div
            className={`absolute -inset-4 rounded-full border-2 transition-all duration-500 ${
              isConnected
                ? mode === 'speaking'
                  ? 'border-blue-400/60 shadow-[0_0_24px_rgba(96,165,250,0.3)]'
                  : 'border-emerald-400/40 shadow-[0_0_16px_rgba(52,211,153,0.2)]'
                : 'border-white/5'
            }`}
          />

          {/* Pulse ring when speaking */}
          {isConnected && mode === 'speaking' && (
            <div className="absolute -inset-8 rounded-full border border-blue-400/20 animate-ping" />
          )}

          {/* Main button */}
          <button
            onClick={isConnected ? endConversation : startConversation}
            disabled={isConnecting}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected
                ? 'bg-red-500/20 border-2 border-red-500/40 hover:bg-red-500/30 hover:border-red-500/60'
                : isConnecting
                  ? 'bg-amber-500/10 border-2 border-amber-500/20 cursor-wait'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {isConnected ? (
              /* Stop icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : isConnecting ? (
              /* Loading spinner */
              <svg width="28" height="28" viewBox="0 0 24 24" className="text-amber-400 animate-spin">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            ) : (
              /* Mic icon */
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mode label */}
        <div className="h-6">
          {isConnected && (
            <span
              className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                mode === 'speaking' ? 'text-blue-400/70' : 'text-emerald-400/50'
              }`}
            >
              {mode === 'speaking' ? 'wybe is speaking' : 'listening'}
            </span>
          )}
          {!isConnected && !isConnecting && disconnectReason !== 'unexpected' && (
            <span className="text-xs font-mono text-white/20">
              tap to connect
            </span>
          )}
          {isConnecting && (
            <span className="text-xs font-mono text-amber-400/50">
              connecting...
            </span>
          )}
        </div>

        {/* Unexpected disconnect — reconnect prompt */}
        {!isConnected && !isConnecting && disconnectReason === 'unexpected' && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-amber-400/70">
              connection lost unexpectedly
            </p>
            <button
              onClick={startConversation}
              className="text-xs font-mono text-white/50 hover:text-white/80 transition-colors px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg"
            >
              reconnect
            </button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 max-w-sm">
            <p className="text-xs font-mono text-red-400/80">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-6">
        <div className="max-w-xs mx-auto">
          {/* Volume */}
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider block mb-2">
              Volume
            </label>
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/20 shrink-0">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white/50
                  [&::-webkit-slider-thumb]:hover:bg-white/70
                  [&::-webkit-slider-thumb]:transition-colors"
              />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/20 shrink-0">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
