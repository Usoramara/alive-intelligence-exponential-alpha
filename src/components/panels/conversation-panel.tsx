'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { MindContext, ConversationIdContext } from '@/components/mind-provider';
import { ENGINE_IDS } from '@/core/constants';
import { VoiceEngine } from '@/core/engines/body/voice-engine';
import { isSignal } from '@/core/types';

interface Message {
  role: 'user' | 'wybe' | 'tool';
  text: string;
  timestamp: number;
  toolName?: string;
  toolStatus?: 'started' | 'completed' | 'error';
  streaming?: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  web_search: 'Searching the web',
  web_fetch: 'Reading a page',
  memory_search: 'Searching memories',
};

export function ConversationPanel() {
  const loop = useContext(MindContext);
  const conversationId = useContext(ConversationIdContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<boolean>(false);

  // Load conversation history from server
  useEffect(() => {
    if (!conversationId) return;
    fetch(`/api/user/messages?conversationId=${conversationId}`)
      .then(r => r.ok ? r.json() : { messages: [] })
      .then(data => {
        const history: Message[] = (data.messages ?? []).map((m: { role: string; content: string; createdAt: string }) => ({
          role: m.role === 'user' ? 'user' as const : 'wybe' as const,
          text: m.content,
          timestamp: new Date(m.createdAt).getTime(),
        }));
        setMessages(history);
      })
      .catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    if (!loop) return;

    // Listen to text-input signals for user messages
    const userSub = loop.bus.subscribe(
      ENGINE_IDS.TEXT_INPUT,
      ['text-input'],
      (signal) => {
        if (!isSignal(signal, 'text-input')) return;
        const payload = signal.payload;
        setMessages(prev => [...prev, {
          role: 'user',
          text: payload.text,
          timestamp: Date.now(),
        }]);
      }
    );

    // Listen to streaming partial output
    const voiceEngine = loop.getEngine<VoiceEngine>(ENGINE_IDS.VOICE);

    const partialUnsub = voiceEngine?.onPartialOutput((_delta, accumulated) => {
      setMessages(prev => {
        // If last message is a streaming wybe message, update it
        if (
          prev.length > 0 &&
          prev[prev.length - 1].role === 'wybe' &&
          prev[prev.length - 1].streaming
        ) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: accumulated,
          };
          return updated;
        }
        // Otherwise, start a new streaming message
        streamingRef.current = true;
        return [...prev, {
          role: 'wybe',
          text: accumulated,
          timestamp: Date.now(),
          streaming: true,
        }];
      });
    });

    // Listen to final voice output (completes the streaming message)
    const voiceUnsub = voiceEngine?.onOutput((text) => {
      setMessages(prev => {
        // If the last message is a streaming wybe message, finalize it
        if (
          prev.length > 0 &&
          prev[prev.length - 1].role === 'wybe' &&
          prev[prev.length - 1].streaming
        ) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text,
            streaming: false,
          };
          streamingRef.current = false;
          return updated;
        }
        // No streaming message — add as new (non-streaming path)
        streamingRef.current = false;
        return [...prev, {
          role: 'wybe',
          text,
          timestamp: Date.now(),
        }];
      });
    });

    // Listen to tool activity signals
    const toolSub = loop.bus.subscribe(
      ENGINE_IDS.ARBITER,
      ['tool-activity'],
      (signal) => {
        if (!isSignal(signal, 'tool-activity')) return;
        const { toolName, status } = signal.payload;

        if (status === 'started') {
          setMessages(prev => [...prev, {
            role: 'tool',
            text: TOOL_LABELS[toolName] ?? `Using ${toolName}`,
            timestamp: Date.now(),
            toolName,
            toolStatus: 'started',
          }]);
        } else if (status === 'completed' || status === 'error') {
          // Update the last matching 'started' message
          setMessages(prev => {
            const updated = [...prev];
            for (let i = updated.length - 1; i >= 0; i--) {
              if (
                updated[i].role === 'tool' &&
                updated[i].toolName === toolName &&
                updated[i].toolStatus === 'started'
              ) {
                updated[i] = {
                  ...updated[i],
                  toolStatus: status,
                  text: status === 'completed'
                    ? `${TOOL_LABELS[toolName] ?? toolName} — done`
                    : `${TOOL_LABELS[toolName] ?? toolName} — failed`,
                };
                break;
              }
            }
            return updated;
          });
        }
      }
    );

    return () => {
      loop.bus.unsubscribe(userSub);
      loop.bus.unsubscribe(toolSub);
      partialUnsub?.();
      voiceUnsub?.();
    };
  }, [loop]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10 flex flex-col h-full">
      <h3 className="text-white/60 text-xs font-mono uppercase tracking-wider mb-3 shrink-0">
        Conversation
      </h3>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin min-h-0">
        {messages.length === 0 && (
          <p className="text-white/15 text-xs font-mono text-center py-8">
            Speak to the mind...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user'
                ? 'justify-end'
                : msg.role === 'tool'
                  ? 'justify-center'
                  : 'justify-start'
            }`}
          >
            {msg.role === 'tool' ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {msg.toolStatus === 'started' && (
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                {msg.toolStatus === 'completed' && (
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                )}
                {msg.toolStatus === 'error' && (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                )}
                <span className="text-amber-200/60 text-xs font-mono">
                  {msg.text}
                </span>
              </div>
            ) : (
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm font-mono ${
                  msg.role === 'user'
                    ? 'bg-blue-500/15 text-blue-200/80 border border-blue-500/20'
                    : 'bg-purple-500/15 text-purple-200/80 border border-purple-500/20'
                }`}
              >
                <span className="text-[10px] opacity-40 block mb-1">
                  {msg.role === 'user' ? 'You' : 'Wybe'}
                </span>
                {msg.text}
                {msg.streaming && (
                  <span className="inline-block w-1.5 h-3.5 bg-purple-400/60 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
