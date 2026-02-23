"""Configuration loading from config.yaml and .env."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent


@dataclass
class AudioConfig:
    sample_rate: int = 16000
    channels: int = 1
    blocksize: int = 512
    device: int | None = None


@dataclass
class VADConfig:
    threshold: float = 0.5
    min_speech_frames: int = 3
    min_silence_frames: int = 10
    pre_speech_frames: int = 5


@dataclass
class NbWhisperConfig:
    model: str = "NbAiLab/nb-whisper-large-distil-turbo-beta"
    device: str = "mps"  # Apple Metal GPU
    torch_dtype: str = "float16"
    language: str = "no"
    task: str = "transcribe"


@dataclass
class ClaudeConfig:
    model: str = "claude-sonnet-4-20250514"
    max_tokens: int = 1024
    system_prompt: str = (
        "Du er Wybe, en norsk AI-assistent. "
        "Svar alltid på norsk med mindre brukeren eksplisitt ber om et annet språk. "
        "Vær hjelpsom, konsis og naturlig i tonen."
    )


@dataclass
class OpenClawConfig:
    base_url: str = "http://localhost:18789"
    session_key: str = "voice:room-mic:main"


@dataclass
class Config:
    audio: AudioConfig = field(default_factory=AudioConfig)
    vad: VADConfig = field(default_factory=VADConfig)
    whisper: NbWhisperConfig = field(default_factory=NbWhisperConfig)
    claude: ClaudeConfig = field(default_factory=ClaudeConfig)
    openclaw: OpenClawConfig = field(default_factory=OpenClawConfig)


def load_config(config_path: Path | None = None) -> Config:
    """Load config from YAML file and environment variables."""
    # Load voice-local .env first, then parent project's .env.local as fallback
    load_dotenv(PROJECT_ROOT / ".env")
    load_dotenv(PROJECT_ROOT.parent / ".env.local")

    path = config_path or PROJECT_ROOT / "config.yaml"
    raw: dict = {}
    if path.exists():
        with open(path) as f:
            raw = yaml.safe_load(f) or {}

    cfg = Config()

    if "audio" in raw:
        cfg.audio = AudioConfig(**raw["audio"])
    if "vad" in raw:
        cfg.vad = VADConfig(**raw["vad"])
    if "whisper" in raw:
        cfg.whisper = NbWhisperConfig(**raw["whisper"])
    if "claude" in raw:
        cfg.claude = ClaudeConfig(**raw["claude"])
    if "openclaw" in raw:
        cfg.openclaw = OpenClawConfig(**raw["openclaw"])

    return cfg
