import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Increment progress dynamically
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for realistic loading feel
        const diff = Math.floor(Math.random() * 15) + 5;
        return Math.min(100, prev + diff);
      });
    }, 120);

    // Track window load state
    const handleLoad = () => {
      setProgress(100);
    };

    if (document.readyState === 'complete') {
      setProgress(100);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setIsDone(true), 400);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (isDone) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712] select-none transition-opacity duration-400 ease-out"
      style={{ opacity: isFadingOut ? 0 : 1, pointerEvents: isFadingOut ? 'none' : 'auto' }}
      aria-hidden="true"
    >
      {/* Outer Cyber Rings */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-500 animate-spin" style={{ animationDuration: '1.4s' }} />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-pink-500 animate-spin" style={{ animationDuration: '2.2s', animationDirection: 'reverse' }} />
        <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-500/20 blur-md animate-pulse" />

        {/* Center Animated Logo Icon */}
        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-2xl animate-pulse">
          <div className="w-full h-full rounded-[14px] bg-[#030712] flex items-center justify-center font-mono font-extrabold text-cyan-400 text-lg sm:text-xl tracking-wider">
            &lt;JP/&gt;
          </div>
        </div>
      </div>

      {/* Numerical Percentage Display — NO TEXT (Numbers & % ONLY) */}
      <div className="flex items-baseline gap-1 font-mono font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
        <span className="text-4xl sm:text-5xl">{progress}</span>
        <span className="text-2xl sm:text-3xl">%</span>
      </div>

      {/* Bottom Sleek Progress Bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-6 border border-slate-800/80 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-200 ease-out rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
