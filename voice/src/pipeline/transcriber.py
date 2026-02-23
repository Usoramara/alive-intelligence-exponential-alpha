"""NB-Whisper transcription via HuggingFace transformers.

Uses NbAiLab/nb-whisper-large-distil-turbo-beta — a 756M parameter
Norwegian ASR model trained on 66,000 hours of Norwegian speech by
Norway's National Library.
"""

from __future__ import annotations

import sys
import time
from dataclasses import dataclass

import numpy as np
import torch
from transformers import pipeline as hf_pipeline

from src.config import NbWhisperConfig


@dataclass
class TranscriptionResult:
    text: str
    language: str
    audio_duration_s: float
    latency_ms: float


# Known Whisper hallucination patterns on silence / ambient noise
_HALLUCINATION_PATTERNS = {
    "takk for at du sa i fra",
    "teksting av nicolai friis",
    "undertekster av nicolai friis",
    "subs by www.telesynced.com",
    "thank you",
    "thank you for watching",
    "thanks for watching",
    "you",
    "sottotitoli e revisione a cura di qtss",
    "amara.org",
    "teksting av",
    "undertekster av",
    "tv 2 hjelper deg",
    "nrk",
}


def _is_hallucination(text: str) -> bool:
    """Check if transcription matches known hallucination patterns."""
    normalised = text.strip().lower().rstrip(".")
    if normalised in _HALLUCINATION_PATTERNS:
        return True
    # Short repetitive outputs are often hallucinations
    if len(normalised) < 3:
        return True
    return False


class NbWhisperTranscriber:
    """Transcribes audio using NB-Whisper via HuggingFace transformers."""

    def __init__(self, config: NbWhisperConfig) -> None:
        dtype_map = {
            "float16": torch.float16,
            "float32": torch.float32,
            "bfloat16": torch.bfloat16,
        }
        torch_dtype = dtype_map.get(config.torch_dtype, torch.float16)

        print(
            f"[whisper] Loading model '{config.model}' "
            f"(device={config.device}, dtype={config.torch_dtype})...",
            file=sys.stderr,
        )
        self._pipe = hf_pipeline(
            "automatic-speech-recognition",
            model=config.model,
            device=config.device,
            dtype=torch_dtype,
        )
        self._language = config.language
        self._task = config.task
        print("[whisper] NB-Whisper ready", file=sys.stderr)

    def transcribe(self, audio: np.ndarray, sample_rate: int = 16000) -> TranscriptionResult | None:
        """Transcribe a float32 audio array. Returns None if empty or hallucinated."""
        if len(audio) == 0:
            return None

        audio_duration = len(audio) / sample_rate
        if audio_duration < 0.3:
            return None  # too short to be meaningful

        t0 = time.monotonic()

        # transformers pipeline expects dict with raw audio + sampling_rate
        result = self._pipe(
            {"raw": audio, "sampling_rate": sample_rate},
            generate_kwargs={
                "task": self._task,
                "language": self._language,
            },
        )

        text = result.get("text", "").strip() if isinstance(result, dict) else ""
        latency_ms = (time.monotonic() - t0) * 1000

        if not text or _is_hallucination(text):
            return None

        return TranscriptionResult(
            text=text,
            language=self._language or "no",
            audio_duration_s=audio_duration,
            latency_ms=latency_ms,
        )
