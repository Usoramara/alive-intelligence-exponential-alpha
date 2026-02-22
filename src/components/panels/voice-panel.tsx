'use client';

import { useSpeechToText } from '@/hooks/use-speech-to-text';

export function VoicePanel() {
  const { status } = useSpeechToText();

  return (
    <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
      <h3 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-2">
        Voice
      </h3>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'listening'
              ? 'bg-red-400 animate-pulse'
              : status === 'connecting'
                ? 'bg-yellow-400'
                : 'bg-white/20'
          }`}
        />
        <span className="text-xs font-mono text-white/40">
          {status === 'listening'
            ? 'Listening...'
            : status === 'connecting'
              ? 'Connecting...'
              : 'Idle'}
        </span>
      </div>
    </div>
  );
}
