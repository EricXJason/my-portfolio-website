/**
 * TechAmbient BGM Engine
 *
 * Architecture: Am pentatonic generative composition
 *   - Bass drone: A1 (55Hz) + A2 (110Hz) filtered sine waves
 *   - Pad chords: Am / F / C / G voice-led slowly via LFO
 *   - Melody: occasional pentatonic lead notes (triangle osc)
 *   - Hi-pass shimmer: soft high-freq triangle texture
 *   - Global reverb via ConvolverNode (impulse-response)
 *   - All routed through master limiter to prevent clipping
 *
 * Design goal: "Low-key, tech-feel ambient" — no percussion,
 *   continuous pads, subtle movement, comfortable over long sessions.
 */

let ctx = null;
let master = null;
let reverb = null;
let limiter = null;
let pads = [];
let bass = null;
let shimmer = null;
let melodyTimer = null;
let padLfoTimer = null;
let isPlaying = false;

/* ── Build a simple stereo reverb from a white-noise impulse ── */
function buildReverb(audioCtx) {
  const convolver = audioCtx.createConvolver();
  const length = audioCtx.sampleRate * 2.5;
  const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

/* ── Create a smooth-sounding osc with gain envelope ── */
function createOsc(audioCtx, freq, type, gainVal, destination) {
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(gainVal, audioCtx.currentTime + 3.5);
  osc.connect(g);
  g.connect(destination);
  osc.start();
  return { osc, g };
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
  [110, 165, 220, 277, 330],   // Am  bass→ A E A C# E (approximated Am extended)
  [87.3, 130.8, 174.6, 220, 261.6], // Fm-ish low voice
  [130.8, 196, 261.6, 329.6], // Cmaj
  [98, 146.8, 196, 246.9],    // Gm pentatonic
];

export const toggleBGMAudio = (volume = 0.35) => {
  if (isPlaying) {
    stopBGMAudio();
    return false;
  } else {
    startBGMAudio(volume);
    return true;
  }
};

export const startBGMAudio = (volume = 0.35) => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    if (isPlaying) return true;
    isPlaying = true;

    const now = ctx.currentTime;

    /* ── Signal chain: pads → reverb ──┐
                                         ├→ master → limiter → out
                         dry signal ─────┘                          */

    // Limiter at very end
    limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-4, now);
    limiter.knee.setValueAtTime(3, now);
    limiter.ratio.setValueAtTime(20, now);
    limiter.attack.setValueAtTime(0.001, now);
    limiter.release.setValueAtTime(0.25, now);
    limiter.connect(ctx.destination);

    // Master gain
    master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(volume * 0.4, now + 2.5);
    master.connect(limiter);

    // Reverb (wet mix)
    reverb = buildReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.3, now);
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    // ── Bass drone: two sine waves, A1 + A2 ──
    const bassOsc1 = ctx.createOscillator();
    const bassOsc2 = ctx.createOscillator();
    const bassFilter = ctx.createBiquadFilter();
    const bassGain   = ctx.createGain();
    bassOsc1.type = 'sine'; bassOsc1.frequency.setValueAtTime(55, now);    // A1
    bassOsc2.type = 'sine'; bassOsc2.frequency.setValueAtTime(110, now);   // A2
    bassFilter.type = 'lowpass'; bassFilter.frequency.setValueAtTime(300, now); bassFilter.Q.setValueAtTime(1, now);
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.55, now + 4);
    bassOsc1.connect(bassFilter); bassOsc2.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(master);
    bassOsc1.start(); bassOsc2.start();
    bass = [bassOsc1, bassOsc2];

    // ── Pad layer: 5 detuned oscillators on chord 0 ──
    const chord = CHORDS[0];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = i < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i % 3 - 1) * 4, now); // slight chorus
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200 + i * 200, now);
      filter.Q.setValueAtTime(0.8, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.03 / (i + 1), now + 3.5);
      osc.connect(filter); filter.connect(g);
      g.connect(master);
      g.connect(reverb);
      osc.start();
      pads.push({ osc, g, filter });
    });

    // ── Shimmer: ultra-high soft triangle oscillator ──
    const shimOsc = ctx.createOscillator();
    const shimGain = ctx.createGain();
    shimOsc.type = 'triangle';
    shimOsc.frequency.setValueAtTime(2093, now); // C7
    shimGain.gain.setValueAtTime(0, now);
    shimGain.gain.linearRampToValueAtTime(0.008, now + 5);
    shimOsc.connect(shimGain); shimGain.connect(reverb);
    shimOsc.start();
    shimmer = { osc: shimOsc, g: shimGain };

    // ── Melody: occasional soft lead notes ──
    let mIdx = 0;
    const MELODY_SEQ = [0, 4, 7, 5, 9, 7, 4, 2, 0, 7, 9, 7]; // index into PentaHz
    melodyTimer = setInterval(() => {
      if (!isPlaying || !ctx) return;
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
      } catch(e) { /* suppress */ }
    }, 1800 + Math.random() * 600);

    // ── Chord morph: shift pads through chord voicings every 8s ──
    let chordIdx = 0;
    padLfoTimer = setInterval(() => {
      if (!isPlaying || !ctx) return;
      chordIdx = (chordIdx + 1) % CHORDS.length;
      const nextChord = CHORDS[chordIdx];
      pads.forEach(({ osc }, i) => {
        if (nextChord[i]) {
          osc.frequency.linearRampToValueAtTime(nextChord[i], ctx.currentTime + 4);
        }
      });
    }, 8000);

    return true;
  } catch(e) {
    console.warn('BGM start failed:', e);
    isPlaying = false;
    return false;
  }
};

export const stopBGMAudio = () => {
  isPlaying = false;
  if (melodyTimer) { clearInterval(melodyTimer); melodyTimer = null; }
  if (padLfoTimer) { clearInterval(padLfoTimer); padLfoTimer = null; }

  if (master && ctx) {
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
  }

  setTimeout(() => {
    pads.forEach(({ osc }) => { try { osc.stop(); } catch(e) {} });
    pads = [];
    if (bass) { bass.forEach(o => { try { o.stop(); } catch(e) {} }); bass = null; }
    if (shimmer) { try { shimmer.osc.stop(); } catch(e) {} shimmer = null; }
  }, 1200);
};

export const setBGMVolume = (volume) => {
  if (master && ctx && isPlaying) {
    // volume range 0-1 → scale to 0.0-0.55 for comfortable level
    master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)) * 0.55, ctx.currentTime + 0.1);
  }
};
