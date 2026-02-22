/**
 * AudioWorklet processor that captures mic audio and emits 512-sample frames.
 *
 * AudioWorklet's process() receives 128 samples per call at the AudioContext's
 * sample rate. We accumulate them and emit 512-sample Float32 frames — the
 * exact size Silero VAD expects at 16 kHz.
 */
class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunks = [];
    this.pending = 0;
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input || input.length === 0) return true;

    this.chunks.push(new Float32Array(input));
    this.pending += input.length;

    while (this.pending >= 512) {
      const frame = new Float32Array(512);
      let offset = 0;

      while (offset < 512) {
        const chunk = this.chunks[0];
        const needed = 512 - offset;

        if (chunk.length <= needed) {
          frame.set(chunk, offset);
          offset += chunk.length;
          this.chunks.shift();
        } else {
          frame.set(chunk.subarray(0, needed), offset);
          this.chunks[0] = chunk.subarray(needed);
          offset += needed;
        }
      }

      this.pending -= 512;
      this.port.postMessage(frame.buffer, [frame.buffer]);
    }

    return true;
  }
}

registerProcessor("audio-capture", AudioCaptureProcessor);
