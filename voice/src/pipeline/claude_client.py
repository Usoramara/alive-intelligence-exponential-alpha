"""Direct Claude API streaming client.

Used as fallback when OpenClaw gateway is not connected.
Streams responses using the Anthropic SDK.
"""

from __future__ import annotations

import os
import sys
from typing import AsyncIterator

import anthropic

from src.config import ClaudeConfig


class ClaudeClient:
    """Streams responses from Claude via the Anthropic API."""

    def __init__(self, config: ClaudeConfig) -> None:
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            print("[claude] WARNING: ANTHROPIC_API_KEY not set", file=sys.stderr)

        self._client = anthropic.AsyncAnthropic(api_key=api_key)
        self._model = config.model
        self._max_tokens = config.max_tokens
        self._system_prompt = config.system_prompt
        self._available = bool(api_key)

        if self._available:
            print(f"[claude] Client ready (model={self._model})", file=sys.stderr)

    @property
    def available(self) -> bool:
        return self._available

    async def stream(self, message: str, language: str | None = None) -> AsyncIterator[str]:
        """Stream a response from Claude, yielding text chunks.

        Args:
            message: The user's transcribed speech.
            language: Detected language code (e.g. "no", "en").
        """
        if not self._available:
            yield "[Claude API key not configured]"
            return

        system = self._system_prompt
        if language and language not in ("no", "nb", "nn"):
            lang_names = {
                "en": "English", "sv": "Swedish", "da": "Danish",
                "de": "German", "fr": "French", "es": "Spanish",
            }
            lang_name = lang_names.get(language, language)
            system = f"Respond in {lang_name}. {system}"

        async with self._client.messages.stream(
            model=self._model,
            max_tokens=self._max_tokens,
            system=system,
            messages=[{"role": "user", "content": message}],
        ) as stream:
            async for text in stream.text_stream:
                yield text
