import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface InitialPreloaderProps {
  onComplete: () => void;
}

export const InitialPreloader: React.FC<InitialPreloaderProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [progress, setProgress] = useState<number>(1);
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const minDuration = 1150; // Guaranteed minimum duration of at least ~1.15 seconds
    let isRealReady = false;

    // Track real browser loading state
    if (typeof document !== 'undefined') {
      if (document.readyState === 'complete') {
        isRealReady = true;
      } else {
        window.addEventListener('load', () => { isRealReady = true; }, { once: true });
      }
      if (document.fonts) {
        document.fonts.ready.then(() => { isRealReady = true; }).catch(() => {});
      }
    }

    let displayedProgress = 1;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      // Realistic non-linear telemetry curve with organic cyber staging:
      // Stage 1 (0-30%): Fast initial kernel bootstrap
      // Stage 2 (30-75%): Resource & font hydration micro-bursts
      // Stage 3 (75-95%): Asset preheat verification
      // Stage 4 (95-100%): Final handshake lock
      let targetProgress = 1;
      if (timeRatio < 0.25) {
        targetProgress = 1 + (timeRatio / 0.25) * 28; // 1 -> 29%
      } else if (timeRatio < 0.65) {
        targetProgress = 29 + ((timeRatio - 0.25) / 0.40) * 42; // 29 -> 71%
      } else if (timeRatio < 0.90) {
        targetProgress = 71 + ((timeRatio - 0.65) / 0.25) * 21; // 71 -> 92%
      } else {
        targetProgress = 92 + ((timeRatio - 0.90) / 0.10) * 8; // 92 -> 100%
      }

      // If real page loading is done, smoothly pull towards target
      if (isRealReady && timeRatio >= 0.95) {
        targetProgress = 100;
      }

      // Monotonic smooth incremental step (ensures every number feels alive and never skips erratically)
      if (displayedProgress < targetProgress) {
        const increment = Math.max(1, (targetProgress - displayedProgress) * 0.45);
        displayedProgress = Math.min(Math.round(displayedProgress + increment), 100);
      }

      setProgress(displayedProgress);

      if (elapsed < minDuration || displayedProgress < 100) {
        requestAnimationFrame(step);
      } else {
        setProgress(100);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 300);
        }, 150);
      }
    };

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.4)';
  const bgCol = isLight ? '#f8fafc' : '#030712';
  const textColor = isLight ? '#0f172a' : '#f8fafc';

  return (
    <div
      className="fixed inset-0 z-[9999999] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300"
      style={{
        backgroundColor: bgCol,
        opacity: fadingOut ? 0 : 1,
      }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-6">

        {/* Brand Icon Header (Exact Match to Site Navbar Logo) */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 border p-[2px] cyber-cut-sm flex items-center justify-center shadow-md shrink-0 transition-colors duration-300"
            style={{
              backgroundColor: isLight ? '#e0f2fe' : '#080e1a',
              borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.5)',
            }}
          >
            <div
              className="font-hud font-black text-xs tracking-wider"
              style={{ color: cyanCol }}
            >
              &lt;JP/&gt;
            </div>
          </div>
          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="font-mono text-sm sm:text-base font-extrabold tracking-wide truncate" style={{ color: textColor }}>
              JasonProduction
            </span>
            <span className="font-tech text-xs font-bold tracking-wider truncate" style={{ color: cyanCol }}>
              許哲誠 HSU, CHE-CHENG
            </span>
          </div>
        </div>

        {/* Minimal Progress Track & Percentage Only (100% Synchronized Frame-Perfect) */}
        <div className="w-full flex flex-col items-center gap-2.5">
          {/* Progress Bar Container */}
          <div
            className="w-full h-3 border cyber-cut-sm p-[2px] relative overflow-hidden transition-colors duration-300"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              borderColor: borderCol,
            }}
          >
            {/* Fill Bar — Instant 100% Sync with Progress Percentage */}
            <div
              className="h-full rounded-none shadow-[0_0_12px_rgba(0,240,255,0.75)]"
              style={{
                width: `${progress}%`,
                willChange: 'width',
                background: isLight
                  ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                  : 'linear-gradient(90deg, #00f0ff 0%, #38bdf8 100%)',
              }}
            />
          </div>

          {/* Clean Percentage Display */}
          <span className="font-hud font-extrabold tracking-widest text-base sm:text-lg text-center" style={{ color: cyanCol }}>
            {progress}%
          </span>
        </div>

      </div>
    </div>
  );
};

export default InitialPreloader;
