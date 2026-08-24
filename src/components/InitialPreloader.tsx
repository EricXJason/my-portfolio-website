import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface InitialPreloaderProps {
  onComplete: () => void;
}

export const InitialPreloader: React.FC<InitialPreloaderProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1100; // Optimal 1.1s silky telemetry duration
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const t = Math.min(elapsed / duration, 1);

      // Steady, energetic linear-biased progression with gentle ease-out (p(t) = 1.25t - 0.25t^2)
      // Velocity v(t) = 1.25 - 0.5t: Starts actively at 1.25x speed, cruises at 1.0x at midpoint, softly finishes at 0.75x speed without EVER stalling or freezing
      const progressRatio = 1.25 * t - 0.25 * t * t;
      const currentPercent = Math.min(Math.max(Math.round(progressRatio * 100), 1), 100);
      const scaleValue = Math.min(Math.max(progressRatio, 0.01), 1);

      // Direct GPU composite transform (0 layout reflow cost, 60fps/120fps fluid)
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${scaleValue})`;
      }

      // Direct text update with fixed monospace tabular figures
      if (textRef.current) {
        textRef.current.textContent = `${currentPercent}%`;
      }

      if (t < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
        if (textRef.current) textRef.current.textContent = '100%';

        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 250);
        }, 80);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.4)';
  const bgCol = isLight ? '#f8fafc' : '#030712';
  const textColor = isLight ? '#0f172a' : '#f8fafc';

  return (
    <div
      className="fixed inset-0 z-[9999999] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-250 pointer-events-auto"
      style={{
        backgroundColor: bgCol,
        opacity: fadingOut ? 0 : 1,
      }}
      role="progressbar"
      aria-label="頁面系統載入中 (Page Initializing)"
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

        {/* GPU-Composited Progress Track & Frame-Perfect Percentage */}
        <div className="w-full flex flex-col items-center gap-2.5">
          {/* Progress Bar Container */}
          <div
            className="w-full h-3 border cyber-cut-sm p-[2px] relative overflow-hidden transition-colors duration-300"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              borderColor: borderCol,
            }}
          >
            {/* Fill Bar — GPU Subpixel Composited Hardware Acceleration */}
            <div
              ref={barRef}
              className="h-full rounded-none shadow-[0_0_12px_rgba(0,240,255,0.75)] origin-left"
              style={{
                width: '100%',
                transform: 'scaleX(0.01)',
                transformOrigin: 'left center',
                willChange: 'transform',
                background: isLight
                  ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)'
                  : 'linear-gradient(90deg, #00f0ff 0%, #38bdf8 100%)',
              }}
            />
          </div>

          {/* Clean Percentage Display (Monospace tabular digits to eliminate any width jitter) */}
          <span
            ref={textRef}
            className="font-hud font-extrabold tracking-widest text-base sm:text-lg text-center font-mono tabular-nums inline-block min-w-[3.5rem]"
            style={{ color: cyanCol }}
          >
            1%
          </span>
        </div>

      </div>
    </div>
  );
};

export default InitialPreloader;
