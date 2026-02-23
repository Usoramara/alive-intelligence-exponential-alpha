"""Silero VAD wrapper with speech start/end state tracking."""

from __future__ import annotations

import sys

import numpy as np
import torch


class SileroVAD:
    """Voice Activity Detection using Silero VAD v5.

    Processes 512-sample frames at 16 kHz and tracks speech boundaries.
    After calling `process()`, check `speech_started` and `speech_ended`
    to detect transitions.
    """

    def __init__(
        self,
        threshold: float = 0.5,
        min_speech_frames: int = 3,
        min_silence_frames: int = 10,
    ) -> None:
        self.threshold = threshold
        self.min_speech_frames = min_speech_frames
        self.min_silence_frames = min_silence_frames

        # State
        self._is_speaking = False
        self._speech_started = False
        self._speech_ended = False
        self._speech_count = 0
        self._silence_count = 0

        # Load model
        print("[vad] Loading Silero VAD model...", file=sys.stderr)
        self._model, _ = torch.hub.load(
            repo_or_dir="snakers4/silero-vad",
            model="silero_vad",
            trust_repo=True,
        )
        print("[vad] Silero VAD ready", file=sys.stderr)

    def process(self, frame: np.ndarray) -> float:
        """Process one audio frame. Returns speech probability.

        After calling this, check `.speech_started` and `.speech_ended`.
        """
        tensor = torch.from_numpy(frame).float()
        prob: float = self._model(tensor, 16000).item()

        self._speech_started = False
        self._speech_ended = False

        if prob >= self.threshold:
            self._speech_count += 1
            self._silence_count = 0
            if (
                not self._is_speaking
                and self._speech_count >= self.min_speech_frames
            ):
                self._is_speaking = True
                self._speech_started = True
        else:
            self._silence_count += 1
            self._speech_count = 0
            if (
                self._is_speaking
                and self._silence_count >= self.min_silence_frames
            ):
                self._is_speaking = False
                self._speech_ended = True

        return prob

    @property
    def is_speaking(self) -> bool:
        """True while speech is active (between start and end)."""
        return self._is_speaking

    @property
    def speech_started(self) -> bool:
        """True on the frame where speech was confirmed to start."""
        return self._speech_started

    @property
    def speech_ended(self) -> bool:
        """True on the frame where speech was confirmed to end."""
        return self._speech_ended

    def reset(self) -> None:
        """Reset VAD state (e.g. after barge-in)."""
        self._is_speaking = False
        self._speech_started = False
        self._speech_ended = False
        self._speech_count = 0
        self._silence_count = 0
        self._model.reset_states()
