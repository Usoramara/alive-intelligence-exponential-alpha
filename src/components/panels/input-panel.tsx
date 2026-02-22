'use client';

import { useState, useCallback, useContext, type KeyboardEvent } from 'react';
import { MindContext } from '@/components/mind-provider';
import { ENGINE_IDS } from '@/core/constants';
import { SIGNAL_PRIORITIES } from '@/core/constants';
import { useSpeechToText } from '@/hooks/use-speech-to-text';

export function InputPanel() {
  const [text, setText] = useState('');
  const [interim, setInterim] = useState('');
  const loop = useContext(MindContext);

  const { status: sttStatus, toggle } = useSpeechToText({
    language: 'no',
    onTranscript: useCallback((transcript: string) => {
      setText((prev) => {
        const separator = prev && !prev.endsWith(' ') ? ' ' : '';
        return prev + separator + transcript;
      });
      setInterim('');
    }, []),
    onInterim: useCallback((text: string) => {
      setInterim(text);
    }, []),
  });

  const send = useCallback(() => {
    if (!text.trim() || !loop) return;

    // Broadcast — TextInputEngine, PerceptionEngine, and ConversationPanel all receive
    loop.bus.emit({
      type: 'text-input',
      source: ENGINE_IDS.TEXT_INPUT,
      payload: { text: text.trim(), timestamp: Date.now() },
      priority: SIGNAL_PRIORITIES.HIGH,
    });

    setText('');
    setInterim('');
  }, [text, loop]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <h3 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
        Input
      </h3>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Speak to the mind..."
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 font-mono"
          />
          {interim && (
            <div className="absolute left-3 top-full mt-1 text-xs text-white/30 font-mono truncate max-w-full">
              {interim}
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          className={`px-3 py-2 rounded-md text-sm font-mono transition-colors border ${
            sttStatus === 'listening'
              ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse'
              : sttStatus === 'connecting'
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
          }`}
          title={
            sttStatus === 'listening'
              ? 'Stop recording'
              : sttStatus === 'connecting'
                ? 'Connecting...'
                : 'Start voice input (Norwegian)'
          }
        >
          {sttStatus === 'connecting' ? (
            <SpinnerIcon />
          ) : (
            <MicIcon active={sttStatus === 'listening'} />
          )}
        </button>
        <button
          onClick={send}
          disabled={!text.trim()}
          className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-md text-blue-400 text-sm font-mono hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? 'text-red-400' : ''}
    >
      <rect x="9" y="1" width="6" height="14" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
    </svg>
  );
}
