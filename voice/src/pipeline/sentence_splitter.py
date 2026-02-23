"""Norwegian-aware sentence boundary detection for streaming TTS."""

from __future__ import annotations

import re

# Norwegian abbreviations that end with a period — must NOT trigger sentence boundaries
NORWEGIAN_ABBREVIATIONS = frozenset({
    "f.eks", "bl.a", "ca", "nr", "dr", "mr", "mrs", "ms",
    "dvs", "osv", "mfl", "evt", "kl", "forts", "jf", "jfr",
    "tlf", "stk", "mnd", "mill", "mrd", "prof", "ing",
    "adj", "adv", "pga", "mht", "ifm", "ift",
})

# Pattern: sentence-ending punctuation followed by whitespace and uppercase letter
_BOUNDARY_RE = re.compile(r"([.!?])\s+(?=[A-ZÆØÅ])")


class SentenceSplitter:
    """Splits streaming text into sentences at natural boundaries.

    Feed text incrementally via `feed()`. Complete sentences are returned
    immediately; partial sentences are buffered until the next boundary.
    Call `flush()` at end-of-stream to get the remaining buffer.
    """

    def __init__(self) -> None:
        self._buffer = ""

    def feed(self, text: str) -> list[str]:
        """Feed new text. Returns list of complete sentences (may be empty)."""
        self._buffer += text

        # Find all potential boundary positions, filtering out abbreviations
        split_positions: list[int] = []
        for match in _BOUNDARY_RE.finditer(self._buffer):
            punct = match.group(1)
            split_pos = match.start() + 1  # position after the punctuation

            # Check if this period is part of an abbreviation
            if punct == "." and self._is_abbreviation(self._buffer[:split_pos]):
                continue

            split_positions.append(split_pos)

        if not split_positions:
            return []

        # Split at the found boundaries
        sentences: list[str] = []
        prev = 0
        for pos in split_positions:
            sentence = self._buffer[prev:pos].strip()
            if sentence:
                sentences.append(sentence)
            prev = pos

        self._buffer = self._buffer[prev:].lstrip()
        return sentences

    def flush(self) -> str | None:
        """Return and clear any remaining buffered text."""
        text = self._buffer.strip()
        self._buffer = ""
        return text if text else None

    def reset(self) -> None:
        """Clear the buffer."""
        self._buffer = ""

    @staticmethod
    def _is_abbreviation(text: str) -> bool:
        """Check if text ends with a known Norwegian abbreviation + period."""
        stripped = text.rstrip(".")
        words = stripped.split()
        if not words:
            return False
        last_word = words[-1].lower().rstrip(".")
        return last_word in NORWEGIAN_ABBREVIATIONS
