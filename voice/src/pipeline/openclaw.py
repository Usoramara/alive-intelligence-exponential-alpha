"""OpenClaw gateway WebSocket client.

Connects to the OpenClaw gateway, completes the v3 handshake,
and provides chat streaming via the chat.send RPC method.
"""

from __future__ import annotations

import asyncio
import json
import sys
import traceback
import uuid
from typing import AsyncIterator

import websockets
from websockets.asyncio.client import ClientConnection


class OpenClawClient:
    """WebSocket client for the OpenClaw gateway."""

    def __init__(self, url: str = "ws://127.0.0.1:18789", token: str = "") -> None:
        self._url = url
        self._token = token
        self._ws: ClientConnection | None = None
        self._connected = False
        self._pending: dict[str, asyncio.Future] = {}
        self._event_queues: dict[str, list[asyncio.Queue]] = {}
        self._read_task: asyncio.Task | None = None
        self._handshake_done = asyncio.Event()

    @property
    def connected(self) -> bool:
        return self._connected

    async def connect(self) -> bool:
        """Connect to the gateway and complete the handshake. Returns True on success."""
        try:
            self._ws = await websockets.connect(
                self._url,
                ping_interval=20,
                ping_timeout=10,
                close_timeout=5,
            )
            self._handshake_done.clear()
            self._read_task = asyncio.create_task(self._read_loop())
            # Wait for handshake to complete (challenge → connect response)
            await asyncio.wait_for(self._handshake_done.wait(), timeout=10.0)
            print("[openclaw] Connected to gateway", file=sys.stderr)
            return True
        except Exception as e:
            print(f"[openclaw] Connection failed: {e}", file=sys.stderr)
            traceback.print_exc(file=sys.stderr)
            self._connected = False
            return False

    async def disconnect(self) -> None:
        """Close the connection."""
        self._connected = False
        if self._read_task:
            self._read_task.cancel()
        if self._ws:
            await self._ws.close()

    async def _read_loop(self) -> None:
        """Background task: read frames from the gateway."""
        assert self._ws is not None
        try:
            async for raw in self._ws:
                frame = json.loads(raw)
                frame_type = frame.get("type")

                if frame_type == "event":
                    event_name = frame.get("event")
                    if event_name == "connect.challenge":
                        await self._handle_challenge()
                    else:
                        self._dispatch_event(event_name, frame.get("payload", {}))

                elif frame_type == "res":
                    self._handle_response(frame)
        except websockets.ConnectionClosed:
            pass
        except asyncio.CancelledError:
            pass
        finally:
            self._connected = False
            # Reject all pending requests
            for fut in self._pending.values():
                if not fut.done():
                    fut.set_exception(ConnectionError("Gateway disconnected"))
            self._pending.clear()

    async def _handle_challenge(self) -> None:
        """Respond to the connect.challenge with our credentials."""
        req_id = str(uuid.uuid4())
        params: dict = {
            "minProtocol": 3,
            "maxProtocol": 3,
            "client": {
                "id": "claudius-voice",
                "version": "0.1.0",
                "platform": "python",
                "mode": "voice",
            },
            "role": "operator",
            "scopes": ["operator.read", "operator.admin"],
        }
        if self._token:
            params["auth"] = {"token": self._token}

        fut = asyncio.get_event_loop().create_future()
        self._pending[req_id] = fut

        await self._ws.send(json.dumps({
            "type": "req",
            "id": req_id,
            "method": "connect",
            "params": params,
        }))

        try:
            await asyncio.wait_for(fut, timeout=10.0)
            self._connected = True
            self._handshake_done.set()
        except Exception:
            self._connected = False
            self._handshake_done.set()

    def _handle_response(self, frame: dict) -> None:
        """Handle an RPC response frame."""
        req_id = str(frame.get("id", ""))
        fut = self._pending.pop(req_id, None)
        if not fut or fut.done():
            return
        if frame.get("ok"):
            fut.set_result(frame.get("payload"))
        else:
            fut.set_exception(
                RuntimeError(f"RPC error: {frame.get('error', 'unknown')}")
            )

    def _dispatch_event(self, event_name: str, payload: dict) -> None:
        """Dispatch an event to all registered queues."""
        queues = self._event_queues.get(event_name, [])
        for q in queues:
            try:
                q.put_nowait(payload)
            except asyncio.QueueFull:
                pass

    def _subscribe(self, event_name: str) -> asyncio.Queue:
        """Subscribe to events of a given type. Returns a queue."""
        q: asyncio.Queue = asyncio.Queue(maxsize=200)
        self._event_queues.setdefault(event_name, []).append(q)
        return q

    def _unsubscribe(self, event_name: str, q: asyncio.Queue) -> None:
        """Unsubscribe a queue from events."""
        queues = self._event_queues.get(event_name, [])
        if q in queues:
            queues.remove(q)

    async def call(self, method: str, params: dict | None = None, timeout: float = 30.0) -> object:
        """Call an RPC method and wait for the response."""
        if not self._connected or not self._ws:
            raise ConnectionError("Not connected to gateway")
        req_id = str(uuid.uuid4())
        fut = asyncio.get_event_loop().create_future()
        self._pending[req_id] = fut

        msg: dict = {"type": "req", "id": req_id, "method": method}
        if params is not None:
            msg["params"] = params

        await self._ws.send(json.dumps(msg))
        return await asyncio.wait_for(fut, timeout=timeout)

    async def chat_stream(
        self, session_key: str, message: str, language: str | None = None
    ) -> AsyncIterator[str]:
        """Send a chat message and yield incremental text chunks.

        Calls chat.send and listens for chat events with matching sessionKey.
        Yields the NEW text in each delta (not the full accumulated text).
        """
        if not self._connected:
            return

        queue = self._subscribe("chat")

        try:
            # Prepare message with language context
            full_message = message
            if language and language != "en":
                # Add language hint as a system-style prefix
                lang_names = {"no": "Norwegian", "nb": "Norwegian", "nn": "Norwegian", "sv": "Swedish", "da": "Danish"}
                lang_name = lang_names.get(language, language)
                full_message = f"[The user is speaking {lang_name}. Respond in {lang_name}.]\n\n{message}"

            # Fire the RPC call (response comes via events, not the RPC return)
            idempotency_key = str(uuid.uuid4())
            asyncio.create_task(self._fire_chat_send(session_key, full_message, idempotency_key))

            prev_text = ""
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=120.0)
                except asyncio.TimeoutError:
                    break

                if event.get("sessionKey") != session_key:
                    continue

                state = event.get("state")

                if state == "delta":
                    text = _extract_text(event.get("message"))
                    if text and len(text) > len(prev_text):
                        new_text = text[len(prev_text):]
                        prev_text = text
                        yield new_text

                elif state == "final":
                    text = _extract_text(event.get("message"))
                    if text and len(text) > len(prev_text):
                        yield text[len(prev_text):]
                    break

                elif state in ("error", "aborted"):
                    error_msg = event.get("errorMessage", "")
                    if error_msg:
                        print(f"[openclaw] Chat error: {error_msg}", file=sys.stderr)
                    break
        finally:
            self._unsubscribe("chat", queue)

    async def _fire_chat_send(self, session_key: str, message: str, idempotency_key: str) -> None:
        """Fire-and-forget chat.send RPC."""
        try:
            await self.call("chat.send", {
                "sessionKey": session_key,
                "message": message,
                "idempotencyKey": idempotency_key,
            }, timeout=120.0)
        except Exception as e:
            print(f"[openclaw] chat.send error: {e}", file=sys.stderr)


def _extract_text(message: object) -> str:
    """Extract text from an OpenClaw message object."""
    if not isinstance(message, dict):
        return ""
    content = message.get("content")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
        return "".join(parts)
    return ""
