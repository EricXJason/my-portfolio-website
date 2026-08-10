import React, { useState, useEffect } from 'react';

const BOOT_LOGS_ZH = [
  '正在初始化系統核心協定...',
  '正在載入個人經歷與專案資料...',
  '正在配置高解析視覺與畫廊陣列...',
  '正在校準互動介面與全息圖層...',
  '載入完成，即將進入網站...',
];

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 18) + 8;
        const next = Math.min(100, prev + diff);
        const logStep = Math.floor((next / 100) * (BOOT_LOGS_ZH.length - 1));
        setLogIndex(logStep);
        return next;
      });
    }, 100);

    const handleLoad = () => {
      setProgress(100);
      setLogIndex(BOOT_LOGS_ZH.length - 1);
    };

    if (document.readyState === 'complete') {
      setProgress(100);
      setLogIndex(BOOT_LOGS_ZH.length - 1);
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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712] select-none transition-opacity duration-400 ease-out p-4"
      style={{ opacity: isFadingOut ? 0 : 1, pointerEvents: isFadingOut ? 'none' : 'auto' }}
      aria-hidden="true"
    >
      <div className="relative p-8 border border-cyan-500/30 bg-[#080e1a]/95 backdrop-blur-xl max-w-md w-full cyber-cut-corner hud-corner-brackets shadow-2xl flex flex-col items-center text-center">
        {/* Outer Rotating Sci-Fi Rings */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-none border-2 border-transparent border-t-cyan-400 border-r-pink-500 animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-2 rounded-none border border-dashed border-cyan-500/40 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
          
          <div className="relative z-10 font-hud font-black text-cyan-400 text-xl tracking-widest">
            &lt;JP/&gt;
          </div>
        </div>

        {/* Title */}
        <div className="font-tech font-bold text-xs uppercase tracking-widest text-cyan-400/90 mb-1">
          許哲誠 個人官方網站
        </div>

        {/* Status stream */}
        <div className="font-tech text-xs text-slate-300 h-6 truncate mb-4 w-full">
          {BOOT_LOGS_ZH[logIndex]}
        </div>

        {/* Percentage Display */}
        <div className="font-hud font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 tracking-tighter mb-4">
          {progress}<span className="text-xl">%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 border border-cyan-500/30 p-[1px] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
