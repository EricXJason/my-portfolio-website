import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface InitialPreloaderProps {
  onComplete: () => void;
}

export const InitialPreloader: React.FC<InitialPreloaderProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [progress, setProgress] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 100; // Instantaneous mobile/desktop tactical preloader

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      setProgress(currentProgress);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setProgress(100);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 80);
        }, 30);
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.4)';
  const bgCol = isLight ? '#0f172a' : '#030712'; // Solid non-flashing dark backdrop
  const textColor = isLight ? '#ffffff' : '#f8fafc';

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-350"
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
            className="w-10 h-10 sm:w-11 sm:h-11 border p-[2px] cyber-cut-sm flex items-center justify-center shadow-md shrink-0"
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
            <span className="font-mono text-sm sm:text-base font-extrabold tracking-wide" style={{ color: textColor }}>
              JasonProduction
            </span>
            <span className="font-tech text-xs font-bold tracking-wider" style={{ color: cyanCol }}>
              許哲誠 HSU, CHE-CHENG
            </span>
          </div>
        </div>

        {/* Minimal Progress Track & Percentage Only (100% Synchronized Frame-Perfect) */}
        <div className="w-full flex flex-col items-center gap-2.5">
          {/* Progress Bar Container */}
          <div
            className="w-full h-3 border cyber-cut-sm p-[2px] relative overflow-hidden"
            style={{
              backgroundColor: isLight ? '#0f172a' : '#080e1a',
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
