// Audio transcription tool
// Providers: OpenAI Whisper (default), Deepgram

export interface TranscribeOutput {
  text: string;
  language?: string;
  duration?: number;
  provider: string;
}

async function fetchAudioBuffer(url: string): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  // Handle base64 data URIs
  if (url.startsWith('data:')) {
    const [header, data] = url.split(',');
    const contentType = header?.match(/data:([^;]+)/)?.[1] ?? 'audio/mpeg';
    const binary = atob(data ?? '');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { buffer: bytes.buffer, contentType };
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: { 'User-Agent': 'Wybe/1.0' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch audio (${res.status}): ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') ?? 'audio/mpeg';
  return { buffer: arrayBuffer, contentType };
}

async function openaiTranscribe(audioBuffer: ArrayBuffer, contentType: string, language?: string): Promise<TranscribeOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured.');

  // Map content type to file extension
  const extMap: Record<string, string> = {
    'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav',
    'audio/ogg': 'ogg', 'audio/webm': 'webm', 'audio/mp4': 'mp4',
    'audio/flac': 'flac', 'audio/m4a': 'm4a',
  };
  const ext = extMap[contentType] ?? 'mp3';

  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: contentType }), `audio.${ext}`);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  if (language) formData.append('language', language);

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`OpenAI Whisper error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json() as { text: string; language?: string; duration?: number };
  return {
    text: data.text,
    language: data.language,
    duration: data.duration,
    provider: 'openai',
  };
}

async function deepgramTranscribe(audioBuffer: ArrayBuffer, contentType: string, language?: string): Promise<TranscribeOutput> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error('DEEPGRAM_API_KEY not configured.');

  const params = new URLSearchParams({
    model: 'nova-2',
    smart_format: 'true',
  });
  if (language) params.set('language', language);

  const res = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': contentType,
    },
    body: audioBuffer,
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`Deepgram error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json() as {
    results?: {
      channels?: Array<{
        alternatives?: Array<{ transcript: string }>;
      }>;
    };
    metadata?: { duration?: number; language?: string };
  };

  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
  return {
    text: transcript,
    language: data.metadata?.language,
    duration: data.metadata?.duration,
    provider: 'deepgram',
  };
}

export async function transcribeAudio(params: {
  url: string;
  language?: string;
  provider?: 'openai' | 'deepgram';
}): Promise<TranscribeOutput> {
  const { buffer, contentType } = await fetchAudioBuffer(params.url);

  const provider = params.provider ?? (process.env.OPENAI_API_KEY ? 'openai' : 'deepgram');

  switch (provider) {
    case 'deepgram':
      return deepgramTranscribe(buffer, contentType, params.language);
    case 'openai':
    default:
      return openaiTranscribe(buffer, contentType, params.language);
  }
}
