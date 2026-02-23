"""Smart Turn v3 — ONNX-based turn-completion detector.

Runs on raw audio (last 8 seconds) and predicts whether the speaker
has finished their turn. Uses Whisper Tiny encoder backbone with a
linear classifier head (~8M params, ~12ms CPU inference).

Model: pipecat-ai/smart-turn-v3 from HuggingFace
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

import numpy as np
import onnxruntime as ort
from transformers import WhisperFeatureExtractor

MODELS_DIR = Path(__file__).resolve().parent.parent.parent / "models"
DEFAULT_MODEL = "smart-turn-v3.2-cpu.onnx"
SAMPLE_RATE = 16000
WINDOW_SECONDS = 8
WINDOW_SAMPLES = WINDOW_SECONDS * SAMPLE_RATE  # 128,000


def _truncate_or_pad(audio: np.ndarray) -> np.ndarray:
    """Keep the last 8 seconds of audio, or zero-pad at the start."""
    if len(audio) > WINDOW_SAMPLES:
        return audio[-WINDOW_SAMPLES:]
    elif len(audio) < WINDOW_SAMPLES:
        padding = WINDOW_SAMPLES - len(audio)
        return np.pad(audio, (padding, 0), mode="constant", constant_values=0)
    return audio


class SmartTurn:
    """Predicts whether a speaker has finished their turn."""

    def __init__(self, model_name: str = DEFAULT_MODEL, threshold: float = 0.5) -> None:
        self.threshold = threshold
        model_path = MODELS_DIR / model_name

        print(f"[smart-turn] Loading model '{model_path}'...", file=sys.stderr)

        # ONNX session — optimised for fast single-threaded CPU inference
        so = ort.SessionOptions()
        so.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        so.inter_op_num_threads = 1
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self._session = ort.InferenceSession(str(model_path), sess_options=so)

        # Whisper feature extractor (chunk_length=8 for 8-second window)
        self._extractor = WhisperFeatureExtractor(chunk_length=WINDOW_SECONDS)

        print("[smart-turn] Model ready", file=sys.stderr)

    def predict(self, audio: np.ndarray) -> tuple[bool, float]:
        """Predict turn completion on raw audio.

        Args:
            audio: float32 numpy array at 16kHz.

        Returns:
            (is_complete, probability) — is_complete is True when
            probability >= threshold.
        """
        audio = _truncate_or_pad(audio)

        inputs = self._extractor(
            audio,
            sampling_rate=SAMPLE_RATE,
            return_tensors="np",
            padding="max_length",
            max_length=WINDOW_SAMPLES,
            truncation=True,
            do_normalize=True,
        )

        features = inputs.input_features.squeeze(0).astype(np.float32)
        features = np.expand_dims(features, axis=0)  # batch dim

        outputs = self._session.run(None, {"input_features": features})
        probability: float = outputs[0][0].item()

        return probability >= self.threshold, probability
