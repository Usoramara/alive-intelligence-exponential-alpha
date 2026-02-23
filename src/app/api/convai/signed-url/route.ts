const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url';

export async function POST(): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return Response.json(
      { error: 'ElevenLabs not configured' },
      { status: 503 },
    );
  }

  const url = `${ELEVENLABS_API_URL}?agent_id=${agentId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'xi-api-key': apiKey },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('[convai] ElevenLabs signed URL error:', response.status, body);
    return Response.json(
      { error: 'Failed to get signed URL' },
      { status: 502 },
    );
  }

  const data = await response.json();
  return Response.json({ signed_url: data.signed_url });
}
