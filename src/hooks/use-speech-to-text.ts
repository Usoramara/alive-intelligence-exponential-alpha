'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type SttStatus = 'idle' | 'connecting' | 'listening';

interface UseSpeechToTextOptions {
  language?: string;
  onTranscript?: (text: string) => void;
  onInterim?: (text: string) => void;
}

export function useSpeechToText({
  language = 'no',
  onTranscript,
  onInterim,
}: UseSpeechToTextOptions = {}) {
  const [status, setStatus] = useState<SttStatus>('idle');
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Store callbacks in refs to avoid stale closures
  const onTranscriptRef = useRef(onTranscript);
  const onInterimRef = useRef(onInterim);
  onTranscriptRef.current = onTranscript;
  onInterimRef.current = onInterim;

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    recorderRef.current = null;

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        // Send close frame per Deepgram protocol
        wsRef.current.send(JSON.stringify({ type: 'CloseStream' }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setStatus('idle');
  }, []);

  const start = useCallback(async () => {
    if (status !== 'idle') return;
    setStatus('connecting');

    try {
      // 1. Get temporary key
      const tokenRes = await fetch('/api/stt/token', { method: 'POST' });
      if (!tokenRes.ok) throw new Error('Failed to get STT token');
      const { key } = await tokenRes.json();

      // 2. Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Connect WebSocket to Deepgram
      const params = new URLSearchParams({
        model: 'nova-3',
        language,
        interim_results: 'true',
        smart_format: 'true',
        punctuate: 'true',
        encoding: 'opus',
        sample_rate: '48000',
      });

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params}`,
        ['token', key],
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('listening');

        // 4. Start MediaRecorder
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
        recorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };

        recorder.start(250); // Send chunks every 250ms
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          if (!transcript) return;

          if (data.is_final) {
            onTranscriptRef.current?.(transcript);
          } else {
            onInterimRef.current?.(transcript);
          }
        } catch {
          // Ignore non-JSON messages
        }
      };

      ws.onerror = () => {
        stop();
      };

      ws.onclose = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
        setStatus('idle');
      };
    } catch (err) {
      console.error('STT start error:', err);
      stop();
    }
  }, [status, language, stop]);

  const toggle = useCallback(() => {
    if (status === 'idle') {
      start();
    } else {
      stop();
    }
  }, [status, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { status, start, stop, toggle };
}
