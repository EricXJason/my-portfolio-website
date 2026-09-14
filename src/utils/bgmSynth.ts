/**
 * ============================================================================
 * 檔案名稱: bgmSynth.ts
 * 所屬模組: Audio System (Web Audio 氛圍合成器背景音樂引擎)
 * 責任描述: 採用 Web Audio API 即時程序化合成賽博龐克氛圍背景音樂 (BGM)，支援和弦漸變、動態壓縮與即時靜音。
 * 架構分層: Infrastructure / Audio Synthesis Service Layer
 * 依賴關係: 依賴瀏覽器原生標準 AudioContext、ConvolverNode、OscillatorNode 與 DynamicsCompressorNode。
 * 邊界處理: 確保零音訊殘留 (Zero-Leak)、立即中斷排程節點防止重疊疊加、頁面切換或停止時立即暫停 (suspend) 釋放音效硬體。
 * ============================================================================
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

/* ── 透過白噪音脈衝響應生成立體聲迴音效果 (Reverb Convolver) ── */
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

/* ── A 小調五聲音階 (Am Pentatonic Scale, 基準頻率 A3=220Hz 漸升) ── */
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

/* ── 四部和弦頻率表：Am / Fmaj / Cmaj / Gmaj ── */
const CHORDS = [
  [110, 165, 220, 277, 330],          // Am
  [87.3, 130.8, 174.6, 220, 261.6],   // Fm
  [130.8, 196, 261.6, 329.6],         // Cmaj
  [98, 146.8, 196, 246.9],            // Gm
];

/**
 * 同步關閉並徹底釋放所有運行中的音訊節點與排程器，確保無幽靈殘響
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

  // 停止並斷開所有背景鋪底振盪器 (Pad Oscillators)
  pads.forEach(({ osc, g, filter }) => {
    try {
      osc.stop();
      osc.disconnect();
      g.disconnect();
      filter.disconnect();
    } catch {
      // 忽略已停止的節點例外
    }
  });
  pads = [];

  // 停止並斷開低音振盪器 (Bass Oscillators)
  if (bass) {
    bass.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // 忽略
      }
    });
    bass = null;
  }

  // 停止閃爍高頻紋理 (Shimmer)
  if (shimmer) {
    try {
      shimmer.osc.stop();
      shimmer.osc.disconnect();
      shimmer.g.disconnect();
    } catch {
      // 忽略
    }
    shimmer = null;
  }

  // 立即靜音並斷開主增益節點 (Master Gain)
  if (master && ctx) {
    try {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.disconnect();
    } catch {
      // 忽略
    }
    master = null;
  }

  if (reverb) {
    try {
      reverb.disconnect();
    } catch {
      // 忽略
    }
    reverb = null;
  }

  if (limiter) {
    try {
      limiter.disconnect();
    } catch {
      // 忽略
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
    // 1. 先清理現有殘留節點，防止音訊疊加爆音
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

    // 2. 終端動態壓限器 (Dynamics Compressor)，防止破音破頻
    limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-4, now);
    limiter.knee.setValueAtTime(3, now);
    limiter.ratio.setValueAtTime(20, now);
    limiter.attack.setValueAtTime(0.001, now);
    limiter.release.setValueAtTime(0.25, now);
    limiter.connect(ctx.destination);

    // 3. 主音量增益節點搭配平滑淡入效果
    master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)) * 0.45, now + 1.8);
    master.connect(limiter);

    // 4. 空間迴音 (Reverb Wet Mix)
    reverb = buildReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.3, now);
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    // 5. 低音長鳴 (Bass Drone)：A1 (55Hz) 與 A2 (110Hz) 正弦波
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

    // 6. 和弦鋪底層 (Pad Layer)：多重微失諧鋸齒波與三角波
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

    // 7. 高頻細微閃爍紋理 (Shimmer)
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

    // 8. 隨機五聲音階主旋律音符觸發器
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
        // 忽略
      }
    }, 1800 + Math.random() * 600);

    // 9. 和弦動態演變：每 8 秒平滑滑音過渡至下一組和弦
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
            // 忽略
          }
        }
      });
    }, 8000);

    return true;
  } catch (e) {
    console.warn('背景音樂引擎啟動失敗:', e);
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
      // 忽略
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
      // 忽略
    }
  }
};

export const getBGMIsPlaying = (): boolean => isPlaying;
