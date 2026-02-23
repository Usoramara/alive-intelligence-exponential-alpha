"""Norwegian Voice Pipeline — WebSocket server for alive-intelligence-v3.

Run with: python -m src.main
Listens on ws://0.0.0.0:8765 for browser audio connections.
"""

from __future__ import annotations

import asyncio
import signal
import sys

from src.config import load_config
from src.server import VoiceServer


async def run() -> None:
    config = load_config()
    server = VoiceServer(config)
    await server.start(host="0.0.0.0", port=8765)


def main() -> None:
    loop = asyncio.new_event_loop()

    def _shutdown(sig: int, frame: object) -> None:
        print("\nShutting down...", file=sys.stderr)
        for task in asyncio.all_tasks(loop):
            task.cancel()

    signal.signal(signal.SIGINT, _shutdown)

    try:
        loop.run_until_complete(run())
    except (KeyboardInterrupt, asyncio.CancelledError):
        pass
    finally:
        loop.close()
        print("Bye.", file=sys.stderr)


if __name__ == "__main__":
    main()
