// Text-to-Speech tool
// Providers: Edge TTS (free, default), ElevenLabs, OpenAI TTS

import { tmpdir } from 'os';
import { join } from 'path';
import { readFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

export interface TTSOutput {
  audio_base64: string;
  format: string;
  provider: string;
  voice: string;
  text_length: number;
}

// Edge TTS voices (free, no API key)
const EDGE_VOICES: Record<string, string> = {
  default: 'en-US-AriaNeural',
  male: 'en-US-GuyNeural',
  female: 'en-US-AriaNeural',
  british: 'en-GB-SoniaNeural',
  australian: 'en-AU-NatashaNeural',
};

async function edgeTTS(text: string, voice?: string): Promise<TTSOutput> {
  const { EdgeTTS } = await import('node-edge-tts');
  const voiceId = EDGE_VOICES[voice ?? 'default'] ?? voice ?? EDGE_VOICES.default;

  const tmpPath = join(tmpdir(), `wybe-tts-${randomUUID()}.mp3`);
  const tts = new EdgeTTS();

  try {
    await tts.ttsPromise(text, tmpPath);
    const audioBuffer = await readFile(tmpPath);
    return {
      audio_base64: audioBuffer.toString('base64'),
      format: 'audio/mpeg',
      provider: 'edge-tts',
      voice: voiceId,
      text_length: text.length,
    };
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}

async function elevenLabsTTS(text: string, voice?: string): Promise<TTSOutput> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const voiceId = voice ?? 'EXAVITQu4vr4xnSDxMaL'; // Default: Bella
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs API error (${res.status}): ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    audio_base64: Buffer.from(arrayBuffer).toString('base64'),
    format: 'audio/mpeg',
    provider: 'elevenlabs',
    voice: voiceId,
    text_length: text.length,
  };
}

async function openaiTTS(text: string, voice?: string): Promise<TTSOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const voiceName = voice ?? 'alloy';
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voiceName,
      response_format: 'mp3',
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new Error(`OpenAI TTS error (${res.status}): ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return {
    audio_base64: Buffer.from(arrayBuffer).toString('base64'),
    format: 'audio/mpeg',
    provider: 'openai',
    voice: voiceName,
    text_length: text.length,
  };
}

export async function textToSpeech(params: {
  text: string;
  voice?: string;
  provider?: 'edge' | 'elevenlabs' | 'openai';
}): Promise<TTSOutput> {
  const provider = params.provider ?? 'edge';

  switch (provider) {
    case 'elevenlabs':
      return elevenLabsTTS(params.text, params.voice);
    case 'openai':
      return openaiTTS(params.text, params.voice);
    case 'edge':
    default:
      return edgeTTS(params.text, params.voice);
  }
}
