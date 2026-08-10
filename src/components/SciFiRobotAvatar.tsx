import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

interface SciFiRobotAvatarProps {
  soundPlaying?: boolean;
}

export const SciFiRobotAvatar: React.FC<SciFiRobotAvatarProps> = ({ soundPlaying = false }) => {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isLight = theme === 'light';

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const centerPosRef = useRef({ x: 0, y: 0 });

  // Cache avatar center coordinates on mount, resize, and scroll to prevent forced layout reflows during mouse movement
  useEffect(() => {
    const updateCenter = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        centerPosRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter, { passive: true });
    window.addEventListener('scroll', updateCenter, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = centerPosRef.current.x;
      const centerY = centerPosRef.current.y;
      if (!centerX && !centerY) return;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;

      // Max eye travel distance in pixels
      const maxOffset = 7;
      const moveX = (deltaX / distance) * Math.min(Math.abs(deltaX * 0.05), maxOffset);
      const moveY = (deltaY / distance) * Math.min(Math.abs(deltaY * 0.05), maxOffset);

      setEyeOffset({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('scroll', updateCenter);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Periodic automatic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Click handler to trigger holographic scan overdrive
  const handleAvatarClick = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <div className="flex flex-col items-center select-text">
      <div
        ref={avatarRef}
        onClick={handleAvatarClick}
        className="relative w-36 h-36 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center cursor-pointer select-text group"
        title="點擊啟動機器人系統動態掃描 (Click for AI System Scan)"
      >
      {/* Left Side Surround Sound Equalizer Bars */}
      <div className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-20">
        {[14, 22, 16, 28, 18].map((h, i) => (
          <div
            key={`s-left-${i}`}
            className="w-1 rounded-full animate-pulse transition-all duration-300"
            style={{
              height: `${soundPlaying ? h * 1.5 : h}px`,
              backgroundColor: cyanCol,
              boxShadow: soundPlaying ? '0 0 10px #00f0ff' : '0 0 4px rgba(0,240,255,0.4)',
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${0.7 + (i % 3) * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Right Side Surround Sound Equalizer Bars */}
      <div className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none z-20">
        {[18, 28, 16, 22, 14].map((h, i) => (
          <div
            key={`s-right-${i}`}
            className="w-1 rounded-full animate-pulse transition-all duration-300"
            style={{
              height: `${soundPlaying ? h * 1.5 : h}px`,
              backgroundColor: isLight ? '#7c3aed' : '#a855f7',
              boxShadow: soundPlaying ? '0 0 10px #a855f7' : '0 0 4px rgba(168,85,247,0.4)',
              animationDelay: `${i * 0.18}s`,
              animationDuration: `${0.8 + (i % 3) * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Outer Holographic Data Ring (Rotating 360deg) */}
      <div
        className="absolute inset-0 rounded-full border border-dashed animate-[spin_16s_linear_infinite] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          borderColor: isLight ? '#0284c7' : '#00f0ff',
          boxShadow: soundPlaying
            ? '0 0 25px rgba(0,240,255,0.4)'
            : '0 0 10px rgba(0,240,255,0.15)',
        }}
      />

      {/* Inner Reverse Rotating Ring */}
      <div
        className="absolute inset-3 rounded-full border-2 border-dotted animate-[spin_24s_linear_infinite_reverse] pointer-events-none opacity-40"
        style={{ borderColor: isLight ? '#38bdf8' : '#a855f7' }}
      />

      {/* Pulsing Energy Sound Aura when BGM active */}
      {soundPlaying && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl animate-pulse pointer-events-none" />
      )}

      {/* Mecha Robot Head SVG Illustration */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center">
        <svg
          className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#ffffff' : '#080e1a'} />
              <stop offset="100%" stopColor={isLight ? '#e0f2fe' : '#040810'} />
            </linearGradient>
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#0284c7' : '#00f0ff'} />
              <stop offset="50%" stopColor={isLight ? '#38bdf8' : '#3b82f6'} />
              <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#a855f7'} />
            </linearGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Mecha Chassis & Antenna Horns */}
          <path
            d="M50 80 L30 50 L55 65 L70 45 L100 35 L130 45 L145 65 L170 50 L150 80 L165 120 L140 165 L100 180 L60 165 L35 120 Z"
            fill="url(#helmetGrad)"
            stroke={cyanCol}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Side Armor Ears */}
          <rect x="22" y="90" width="12" height="30" rx="3" fill={isLight ? '#0284c7' : '#00f0ff'} fillOpacity="0.8" />
          <rect x="166" y="90" width="12" height="30" rx="3" fill={isLight ? '#0284c7' : '#00f0ff'} fillOpacity="0.8" />

          {/* Forehead Core Gem Matrix */}
          <polygon points="100,45 110,55 100,65 90,55" fill={isLight ? '#0284c7' : '#00f0ff'} filter="url(#cyanGlow)" className="animate-pulse" />

          {/* Visor Screen Mask */}
          <path
            d="M45 82 C45 82, 100 70, 155 82 C160 115, 145 135, 100 140 C55 135, 40 115, 45 82 Z"
            fill={isLight ? '#0f172a' : '#030712'}
            stroke={cyanCol}
            strokeWidth="2"
          />

          {/* Scanning Visor Grid Lines */}
          <line x1="50" y1="95" x2="150" y2="95" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
          <line x1="55" y1="110" x2="145" y2="110" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

          {/* Interactive Mechanical Eye Left */}
          <g transform="translate(72, 98)">
            {/* Eye Outer Socket */}
            <circle cx="0" cy="0" r="14" fill="#000" stroke={cyanCol} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity="0.3" />

            {/* Eye Pupil (Tracks Mouse Movement & Blinks) */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y}) scale(1, ${isBlinking ? 0.05 : 1})`}>
              <circle cx="0" cy="0" r="6" fill={cyanCol} filter="url(#cyanGlow)" />
              <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
            </g>
          </g>

          {/* Interactive Mechanical Eye Right */}
          <g transform="translate(128, 98)">
            {/* Eye Outer Socket */}
            <circle cx="0" cy="0" r="14" fill="#000" stroke={cyanCol} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity="0.3" />

            {/* Eye Pupil (Tracks Mouse Movement & Blinks) */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y}) scale(1, ${isBlinking ? 0.05 : 1})`}>
              <circle cx="0" cy="0" r="6" fill={cyanCol} filter="url(#cyanGlow)" />
              <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
            </g>
          </g>

          {/* Mouth Speaker Grill / Respirator Vents */}
          <path d="M85 148 L115 148" stroke={cyanCol} strokeWidth="2" strokeLinecap="round" />
          <path d="M88 153 L112 153" stroke={cyanCol} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M92 158 L108 158" stroke={cyanCol} strokeWidth="1" strokeLinecap="round" opacity="0.5" />

          {/* Chin Armor Plate */}
          <polygon points="100,165 115,158 100,175 85,158" fill={cyanCol} opacity="0.6" />
        </svg>

        {/* Laser Scan Beam overlay when clicked */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden rounded-full animate-pulse">
            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#00f0ff] animate-[bounce_1s_infinite]" />
          </div>
        )}
      </div>
    </div>

      {/* Floating Status HUD Overlay Badge: "AI 前沿技術跟進中" */}
      <div
        className="mt-3 px-4 py-1.5 border cyber-cut-sm font-tech text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap shrink-0 z-20"
        style={{
          backgroundColor: isLight ? '#f1f5f9' : 'rgba(8, 14, 26, 0.85)',
          borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)',
          color: cyanCol,
        }}
      >
        <span className="w-2 h-2 rounded-none rotate-45 bg-emerald-400 animate-pulse shrink-0" />
        <span className="arcade-badge cyber-gradient-text animate-shimmer-text whitespace-nowrap">{lang === 'zh' ? 'AI 前沿技術跟進中' : 'AI ADVANCEMENT TRACKING'}</span>
      </div>
    </div>
  );
};

export default SciFiRobotAvatar;
