/**
 * TechAmbient BGM Engine — Bulletproof Web Audio Synthesizer
 *
 * Architecture: Am pentatonic generative composition
 *   - Bass drone: A1 (55Hz) + A2 (110Hz) filtered sine waves
 *   - Pad chords: Am / F / C / G voice-led slowly via LFO
 *   - Melody: occasional pentatonic lead notes (triangle osc)
 *   - Hi-pass shimmer: soft high-freq triangle texture
 *   - Global reverb via ConvolverNode (impulse-response)
 *   - Master gain & dynamics limiter to prevent clipping
 *
 * Guaranteed Instant Mute & Zero-Leak State Machine:
 *   - Immediate cancellation of all AudioParam automations
 *   - Synchronous oscillator termination and disconnect to eliminate ghost audio
 *   - Context suspend on stop & instant resume on start
 */

interface PadOscillator {
  osc: OscillatorNode;
  g: GainNode;
  filter: BiquadFilterNode;
}

interface ShimmerOscillator {
  osc: OscillatorNode;
  g: GainNode;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let limiter: DynamicsCompressorNode | null = null;
let pads: PadOscillator[] = [];
let bass: OscillatorNode[] | null = null;
let shimmer: ShimmerOscillator | null = null;
let melodyTimer: ReturnType<typeof setInterval> | null = null;
let padLfoTimer: ReturnType<typeof setInterval> | null = null;
let isPlaying = false;

/* ── Build a stereo reverb from a white-noise impulse ── */
function buildReverb(audioCtx: AudioContext): ConvolverNode {
  const convolver = audioCtx.createConvolver();
  const length = Math.floor(audioCtx.sampleRate * 2.2);
  const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

/* ── Am pentatonic scale (A3=220, ascending) ── */
const PentaHz = [
  220.00,   // A3
  246.94,   // B3
  261.63,   // C4
  293.66,   // D4
  329.63,   // E4
  369.99,   // F#4
  392.00,   // G4
  440.00,   // A4
  493.88,   // B4
  523.25,   // C5
  587.33,   // D5
  659.25,   // E5
];

/* ── Chord voicings in Hz: Am / Fmaj / Cmaj / Gmaj ── */
const CHORDS = [
  [110, 165, 220, 277, 330],          // Am
  [87.3, 130.8, 174.6, 220, 261.6],   // Fm-ish low voice
  [130.8, 196, 261.6, 329.6],         // Cmaj
  [98, 146.8, 196, 246.9],            // Gm pentatonic
];

/**
 * Synchronously terminate and cleanup all running audio nodes and timers
 */
const cleanupAllNodes = () => {
  if (melodyTimer) {
    clearInterval(melodyTimer);
    melodyTimer = null;
  }
  if (padLfoTimer) {
    clearInterval(padLfoTimer);
    padLfoTimer = null;
  }

  // Stop and disconnect all pad oscillators
  pads.forEach(({ osc, g, filter }) => {
    try {
      osc.stop();
      osc.disconnect();
      g.disconnect();
      filter.disconnect();
    } catch {
      /* ignore already stopped */
    }
  });
  pads = [];

  // Stop and disconnect bass oscillators
  if (bass) {
    bass.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        /* ignore */
      }
    });
    bass = null;
  }

  // Stop shimmer
  if (shimmer) {
    try {
      shimmer.osc.stop();
      shimmer.osc.disconnect();
      shimmer.g.disconnect();
    } catch {
      /* ignore */
    }
    shimmer = null;
  }

  // Silence master immediately
  if (master && ctx) {
    try {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.disconnect();
    } catch {
      /* ignore */
    }
    master = null;
  }

  if (reverb) {
    try {
      reverb.disconnect();
    } catch {
      /* ignore */
    }
    reverb = null;
  }

  if (limiter) {
    try {
      limiter.disconnect();
    } catch {
      /* ignore */
    }
    limiter = null;
  }
};

export const toggleBGMAudio = (volume = 0.35): boolean => {
  if (isPlaying) {
    stopBGMAudio();
    return false;
  } else {
    return startBGMAudio(volume);
  }
};

export const startBGMAudio = (volume = 0.35): boolean => {
  try {
    // 1. Clean up any existing nodes first to prevent ghost/stacked audio
    cleanupAllNodes();

    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctx) {
      ctx = new AC();
    }

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    isPlaying = true;
    const now = ctx.currentTime;

    // 2. Limiter at very end
    limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-4, now);
    limiter.knee.setValueAtTime(3, now);
    limiter.ratio.setValueAtTime(20, now);
    limiter.attack.setValueAtTime(0.001, now);
    limiter.release.setValueAtTime(0.25, now);
    limiter.connect(ctx.destination);

    // 3. Master gain with smooth attack
    master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)) * 0.45, now + 1.8);
    master.connect(limiter);

    // 4. Reverb (wet mix)
    reverb = buildReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.3, now);
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    // 5. Bass drone: two sine waves, A1 + A2
    const bassOsc1 = ctx.createOscillator();
    const bassOsc2 = ctx.createOscillator();
    const bassFilter = ctx.createBiquadFilter();
    const bassGain = ctx.createGain();
    bassOsc1.type = 'sine';
    bassOsc1.frequency.setValueAtTime(55, now);
    bassOsc2.type = 'sine';
    bassOsc2.frequency.setValueAtTime(110, now);
    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(300, now);
    bassFilter.Q.setValueAtTime(1, now);
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.55, now + 3.0);
    bassOsc1.connect(bassFilter);
    bassOsc2.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(master);
    bassOsc1.start();
    bassOsc2.start();
    bass = [bassOsc1, bassOsc2];

    // 6. Pad layer: 5 detuned oscillators on chord 0
    const chord = CHORDS[0];
    chord.forEach((freq, i) => {
      if (!ctx || !master || !reverb) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = i < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i % 3 - 1) * 4, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200 + i * 200, now);
      filter.Q.setValueAtTime(0.8, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.03 / (i + 1), now + 2.5);
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      g.connect(reverb);
      osc.start();
      pads.push({ osc, g, filter });
    });

    // 7. Shimmer: ultra-high soft triangle oscillator
    const shimOsc = ctx.createOscillator();
    const shimGain = ctx.createGain();
    shimOsc.type = 'triangle';
    shimOsc.frequency.setValueAtTime(2093, now);
    shimGain.gain.setValueAtTime(0, now);
    shimGain.gain.linearRampToValueAtTime(0.008, now + 4);
    shimOsc.connect(shimGain);
    shimGain.connect(reverb);
    shimOsc.start();
    shimmer = { osc: shimOsc, g: shimGain };

    // 8. Melody: occasional soft lead notes
    let mIdx = 0;
    const MELODY_SEQ = [0, 4, 7, 5, 9, 7, 4, 2, 0, 7, 9, 7];
    melodyTimer = setInterval(() => {
      if (!isPlaying || !ctx || !master || !reverb) return;
      try {
        const freq = PentaHz[MELODY_SEQ[mIdx % MELODY_SEQ.length]];
        mIdx++;
        const mOsc = ctx.createOscillator();
        const mGain = ctx.createGain();
        mOsc.type = 'triangle';
        mOsc.frequency.setValueAtTime(freq, ctx.currentTime);
        mGain.gain.setValueAtTime(0, ctx.currentTime);
        mGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.15);
        mGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
        mOsc.connect(mGain);
        mGain.connect(reverb);
        mGain.connect(master);
        mOsc.start();
        mOsc.stop(ctx.currentTime + 2.3);
      } catch {
        /* suppress */
      }
    }, 1800 + Math.random() * 600);

    // 9. Chord morph: shift pads through chord voicings every 8s
    let chordIdx = 0;
    padLfoTimer = setInterval(() => {
      if (!isPlaying || !ctx) return;
      const audioCtx = ctx;
      chordIdx = (chordIdx + 1) % CHORDS.length;
      const nextChord = CHORDS[chordIdx];
      pads.forEach(({ osc }, i) => {
        if (nextChord[i]) {
          try {
            osc.frequency.cancelScheduledValues(audioCtx.currentTime);
            osc.frequency.setValueAtTime(osc.frequency.value, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(nextChord[i], audioCtx.currentTime + 4);
          } catch {
            /* ignore */
          }
        }
      });
    }, 8000);

    return true;
  } catch (e) {
    console.warn('BGM start failed:', e);
    isPlaying = false;
    cleanupAllNodes();
    return false;
  }
};

export const stopBGMAudio = (): void => {
  isPlaying = false;
  cleanupAllNodes();
  if (ctx && ctx.state === 'running') {
    try {
      ctx.suspend();
    } catch {
      /* ignore */
    }
  }
};

export const setBGMVolume = (volume: number): void => {
  if (master && ctx && isPlaying) {
    try {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)) * 0.45, now + 0.08);
    } catch {
      /* ignore */
    }
  }
};

export const getBGMIsPlaying = (): boolean => isPlaying;
