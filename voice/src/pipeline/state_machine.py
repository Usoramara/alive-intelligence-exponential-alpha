"""Voice agent state machine: IDLE → LISTENING → PROCESSING → SPEAKING."""

from __future__ import annotations

from enum import Enum
from typing import Callable


class State(Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    PROCESSING = "PROCESSING"
    SPEAKING = "SPEAKING"


class StateMachine:
    """Tracks the voice agent lifecycle state."""

    def __init__(self) -> None:
        self._state = State.IDLE
        self._listeners: list[Callable[[State, State], None]] = []

    @property
    def state(self) -> State:
        return self._state

    def transition(self, new_state: State) -> None:
        if new_state == self._state:
            return
        old = self._state
        self._state = new_state
        for listener in self._listeners:
            listener(old, new_state)

    def on_change(self, callback: Callable[[State, State], None]) -> None:
        self._listeners.append(callback)

    def reset(self) -> None:
        self.transition(State.IDLE)
