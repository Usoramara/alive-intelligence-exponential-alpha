"""WebSocket server bridging the browser to the voice pipeline.

Browser sends:  binary Float32 PCM audio frames (512 samples at 16kHz)
                JSON control messages: {"type": "start"}, {"type": "stop"}, {"type": "tts_done"}

Server sends:   JSON events: state, transcription, response_delta, response_end,
                error, openclaw_status
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import time
from collections import deque

import numpy as np
import websockets
from websockets.asyncio.server import serve, ServerConnection

from src.config import Config
from src.pipeline.claude_client import ClaudeClient
from src.pipeline.openclaw import OpenClawClient
from src.pipeline.sentence_splitter import SentenceSplitter
from src.pipeline.smart_turn import SmartTurn
from src.pipeline.state_machine import State, StateMachine
from src.pipeline.transcriber import NbWhisperTranscriber
from src.pipeline.vad import SileroVAD


class VoiceServer:
    """WebSocket server that runs the full voice pipeline."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.vad = SileroVAD(
            threshold=config.vad.threshold,
            min_speech_frames=config.vad.min_speech_frames,
            min_silence_frames=config.vad.min_silence_frames,
        )
        self.smart_turn = SmartTurn()
        self.transcriber = NbWhisperTranscriber(config.whisper)
        self.claude = ClaudeClient(config.claude)
        self.openclaw = OpenClawClient(
            url=config.openclaw.base_url.replace("http://", "ws://").replace("https://", "wss://"),
            token=os.environ.get("OPENCLAW_GATEWAY_TOKEN", ""),
        )
        self.state = StateMachine()
        self.splitter = SentenceSplitter()

    async def start(self, host: str = "0.0.0.0", port: int = 8765) -> None:
        """Start the WebSocket server."""
        # Try connecting to OpenClaw (non-blocking)
        asyncio.create_task(self._connect_openclaw())

        async with serve(self._handle_client, host, port) as server:
            print(f"[server] WebSocket server listening on ws://{host}:{port}", file=sys.stderr)
            await asyncio.Future()  # run forever

    async def _connect_openclaw(self) -> None:
        """Connect to OpenClaw gateway with retry."""
        while True:
            if not self.openclaw.connected:
                success = await self.openclaw.connect()
                if not success:
                    await asyncio.sleep(5)
                    continue
            await asyncio.sleep(10)  # health check interval

    async def _handle_client(self, ws: ServerConnection) -> None:
        """Handle a single browser WebSocket connection."""
        print("[server] Browser connected", file=sys.stderr)

        # Per-connection state
        pre_buffer: deque[np.ndarray] = deque(maxlen=self.config.vad.pre_speech_frames)
        speech_frames: list[np.ndarray] = []
        in_speech = False
        active = False
        processing = False  # guard against overlapping transcriptions
        turn_silence_start: float | None = None  # fallback timeout for trailing off

        async def send_event(event_type: str, **data: object) -> None:
            try:
                await ws.send(json.dumps({"type": event_type, **data}))
            except websockets.ConnectionClosed:
                pass

        # Send initial status
        await send_event("state", state="IDLE")
        await send_event("openclaw_status", connected=self.openclaw.connected)

        try:
            async for message in ws:
                # --- JSON control messages ---
                if isinstance(message, str):
                    try:
                        data = json.loads(message)
                    except json.JSONDecodeError:
                        continue

                    msg_type = data.get("type")

                    if msg_type == "start":
                        active = True
                        processing = False
                        self.vad.reset()
                        pre_buffer.clear()
                        speech_frames.clear()
                        in_speech = False
                        turn_silence_start = None
                        self.state.transition(State.LISTENING)
                        await send_event("state", state="LISTENING")
                        await send_event("openclaw_status", connected=self.openclaw.connected)

                    elif msg_type == "stop":
                        active = False
                        in_speech = False
                        processing = False
                        turn_silence_start = None
                        speech_frames.clear()
                        self.state.transition(State.IDLE)
                        await send_event("state", state="IDLE")

                    elif msg_type == "tts_done":
                        # Browser finished speaking — go back to listening
                        if active:
                            self.state.transition(State.LISTENING)
                            await send_event("state", state="LISTENING")
                        else:
                            self.state.transition(State.IDLE)
                            await send_event("state", state="IDLE")

                    continue

                # --- Binary audio frames ---
                if not active or not isinstance(message, (bytes, bytearray)):
                    continue

                # Don't process audio while transcribing/responding
                if processing:
                    continue

                frame = np.frombuffer(message, dtype=np.float32).copy()

                # Silero VAD expects exactly 512 samples
                if len(frame) != 512:
                    continue

                self.vad.process(frame)

                # Speech just started
                if self.vad.speech_started:
                    if not speech_frames:
                        # Fresh start — seed with pre-buffer
                        speech_frames = list(pre_buffer)
                    in_speech = True
                    turn_silence_start = None
                    await send_event("vad", speaking=True)

                # Accumulate during speech
                if in_speech:
                    speech_frames.append(frame)

                # Speech ended (VAD silence threshold reached)
                if self.vad.speech_ended:
                    in_speech = False
                    await send_event("vad", speaking=False)

                    if not speech_frames:
                        continue

                    # -- Smart Turn v3: is the speaker done? --
                    audio = np.concatenate(speech_frames)
                    loop = asyncio.get_event_loop()
                    is_complete, probability = await loop.run_in_executor(
                        None, self.smart_turn.predict, audio
                    )

                    print(
                        f"[smart-turn] probability={probability:.3f} "
                        f"complete={is_complete} "
                        f"audio={len(audio)/16000:.1f}s",
                        file=sys.stderr,
                    )

                    if not is_complete:
                        if turn_silence_start is None:
                            turn_silence_start = time.monotonic()
                        elif time.monotonic() - turn_silence_start > 3.0:
                            print(
                                "[smart-turn] fallback timeout — forcing turn end",
                                file=sys.stderr,
                            )
                            is_complete = True
                        if not is_complete:
                            continue

                    # -- Turn complete — transcribe and respond --
                    speech_frames = []
                    processing = True
                    turn_silence_start = None

                    self.state.transition(State.PROCESSING)
                    await send_event("state", state="PROCESSING")

                    # Transcribe in executor (CPU/GPU-bound)
                    result = await loop.run_in_executor(
                        None, self.transcriber.transcribe, audio
                    )

                    if result:
                        await send_event(
                            "transcription",
                            text=result.text,
                            language=result.language,
                            latency_ms=round(result.latency_ms),
                            audio_duration=round(result.audio_duration_s, 1),
                        )

                        # Get response: prefer OpenClaw, fallback to direct Claude
                        if self.openclaw.connected:
                            await self._stream_openclaw_response(
                                ws, send_event, result.text, result.language
                            )
                        elif self.claude.available:
                            await self._stream_claude_response(
                                ws, send_event, result.text, result.language
                            )
                        else:
                            await send_event(
                                "response_end",
                                text="[No response backend available — transcription only]",
                            )

                    # Back to listening
                    processing = False
                    if active:
                        self.state.transition(State.LISTENING)
                        await send_event("state", state="LISTENING")
                    else:
                        self.state.transition(State.IDLE)
                        await send_event("state", state="IDLE")

                # Pre-buffer when not speaking
                if not in_speech:
                    pre_buffer.append(frame)

        except websockets.ConnectionClosed:
            pass
        finally:
            print("[server] Browser disconnected", file=sys.stderr)
            self.state.transition(State.IDLE)

    async def _stream_openclaw_response(
        self,
        ws: ServerConnection,
        send_event,
        user_text: str,
        language: str,
    ) -> None:
        """Stream an OpenClaw response to the browser."""
        self.state.transition(State.SPEAKING)
        await send_event("state", state="SPEAKING")
        await send_event("response_start")

        self.splitter.reset()
        full_response = ""

        try:
            async for chunk in self.openclaw.chat_stream(
                session_key=self.config.openclaw.session_key,
                message=user_text,
                language=language,
            ):
                full_response += chunk
                await send_event("response_delta", text=full_response)

                sentences = self.splitter.feed(chunk)
                for sentence in sentences:
                    await send_event("tts_sentence", text=sentence)

            remaining = self.splitter.flush()
            if remaining:
                await send_event("tts_sentence", text=remaining)

        except Exception as e:
            print(f"[server] OpenClaw stream error: {e}", file=sys.stderr)
            if not full_response:
                full_response = "[Error getting response from OpenClaw]"

        await send_event("response_end", text=full_response)

    async def _stream_claude_response(
        self,
        ws: ServerConnection,
        send_event,
        user_text: str,
        language: str,
    ) -> None:
        """Stream a direct Claude response to the browser."""
        self.state.transition(State.SPEAKING)
        await send_event("state", state="SPEAKING")
        await send_event("response_start")

        self.splitter.reset()
        full_response = ""

        try:
            async for chunk in self.claude.stream(user_text, language=language):
                full_response += chunk
                await send_event("response_delta", text=full_response)

                sentences = self.splitter.feed(chunk)
                for sentence in sentences:
                    await send_event("tts_sentence", text=sentence)

            remaining = self.splitter.flush()
            if remaining:
                await send_event("tts_sentence", text=remaining)

        except Exception as e:
            print(f"[server] Claude stream error: {e}", file=sys.stderr)
            if not full_response:
                full_response = "[Error getting response from Claude]"

        await send_event("response_end", text=full_response)
