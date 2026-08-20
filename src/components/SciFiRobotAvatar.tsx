import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
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
    window.addEventListener('touchmove', (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      const centerX = centerPosRef.current.x;
      const centerY = centerPosRef.current.y;
      if (!centerX && !centerY) return;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;

      const maxOffset = 7;
      const moveX = (deltaX / distance) * Math.min(Math.abs(deltaX * 0.05), maxOffset);
      const moveY = (deltaY / distance) * Math.min(Math.abs(deltaY * 0.05), maxOffset);

      setEyeOffset({ x: moveX, y: moveY });
    }, { passive: true });

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
  const handleAvatarClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <div className="flex flex-col items-center select-none">
      <div
        ref={avatarRef}
        onClick={handleAvatarClick}
        onTouchEnd={handleAvatarClick}
        className="relative w-36 h-36 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center cursor-pointer select-none touch-manipulation group"
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

      {/* Outer Holographic Data Ring (Rotating 360deg with Cardinal Ticks) */}
      <div
        className="absolute inset-0 rounded-full border border-dashed animate-[spin_16s_linear_infinite] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity"
        style={{
          borderColor: isLight ? '#0284c7' : '#00f0ff',
          boxShadow: soundPlaying
            ? '0 0 30px rgba(0,240,255,0.45)'
            : '0 0 14px rgba(0,240,255,0.2)',
        }}
      >
        {/* Holographic Cardinal Notches */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_#c084fc]" />
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_#c084fc]" />
      </div>

      {/* Middle Reverse Rotating Hexagon Tech Ring */}
      <div
        className="absolute inset-2.5 rounded-full border-2 border-dotted animate-[spin_24s_linear_infinite_reverse] pointer-events-none opacity-50"
        style={{ borderColor: isLight ? '#38bdf8' : '#a855f7' }}
      />

      {/* Orbiting Quantum Energy Orb */}
      <div className="absolute inset-0 animate-[spin_10s_linear_infinite] pointer-events-none">
        <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#00f0ff] -top-1.5 left-1/2 -translate-x-1/2 absolute" />
      </div>

      {/* Pulsing Energy Sound Aura when BGM active */}
      {soundPlaying && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl animate-pulse pointer-events-none" />
      )}

      {/* Mecha Robot Head SVG Illustration */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center">
        <svg
          className="w-full h-full drop-shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-transform duration-500 group-hover:scale-105"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#ffffff' : '#0b1326'} />
              <stop offset="50%" stopColor={isLight ? '#f0f9ff' : '#060c18'} />
              <stop offset="100%" stopColor={isLight ? '#e0f2fe' : '#030712'} />
            </linearGradient>

            <linearGradient id="armorAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#0284c7' : '#00f0ff'} />
              <stop offset="50%" stopColor={isLight ? '#2563eb' : '#3b82f6'} />
              <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#a855f7'} />
            </linearGradient>

            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? '#0284c7' : '#00f0ff'} />
              <stop offset="50%" stopColor={isLight ? '#38bdf8' : '#3b82f6'} />
              <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#c084fc'} />
            </linearGradient>

            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Mecha Antenna Horns & Side Winglets (Unified Chamfered Geometry) */}
          <path
            d="M45 80 L25 45 L52 60 L70 38 L100 28 L130 38 L148 60 L175 45 L155 80 L165 120 L140 162 L100 178 L60 162 L35 120 Z"
            fill="url(#helmetGrad)"
            stroke={cyanCol}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Armor Panel Lines & Accent Contour */}
          <path
            d="M56 82 L70 48 L100 38 L130 48 L144 82 L152 118 L134 156 L100 168 L66 156 L48 118 Z"
            fill="none"
            stroke="url(#armorAccentGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Side Armor Thruster Ears (Unified Polygon Chamfers matching Cheek Angles) */}
          <g>
            <polygon points="20,86 32,82 32,118 20,114" fill="url(#armorAccentGrad)" stroke={cyanCol} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="23" y1="94" x2="29" y2="94" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="23" y1="100" x2="29" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="23" y1="106" x2="29" y2="106" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />

            <polygon points="180,86 168,82 168,118 180,114" fill="url(#armorAccentGrad)" stroke={cyanCol} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="171" y1="94" x2="177" y2="94" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="171" y1="100" x2="177" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            <line x1="171" y1="106" x2="177" y2="106" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
          </g>

          {/* Forehead Quantum Crystal Core Matrix */}
          <polygon
            points="100,36 112,48 100,60 88,48"
            fill="url(#armorAccentGrad)"
            filter="url(#cyanGlow)"
            className="animate-pulse"
          />
          <polygon points="100,41 106,48 100,55 94,48" fill="#ffffff" opacity="0.95" />

          {/* Visor Glass Screen Mask */}
          <path
            d="M44 80 C44 80, 100 68, 156 80 C162 114, 146 136, 100 142 C54 136, 38 114, 44 80 Z"
            fill={isLight ? '#0b1326' : '#020610'}
            stroke={cyanCol}
            strokeWidth="2"
          />

          {/* HUD Visor Target Reticle Crosshair & Scanner Grid Lines */}
          <line x1="100" y1="74" x2="100" y2="138" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.35" />
          <line x1="48" y1="98" x2="152" y2="98" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.35" />
          <circle cx="100" cy="98" r="40" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />

          {/* Interactive Mechanical Eye Left */}
          <g transform="translate(70, 98)">
            <circle cx="0" cy="0" r="14" fill="#000000" stroke={cyanCol} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity="0.4" />
            <circle cx="0" cy="0" r="7.5" stroke="url(#armorAccentGrad)" strokeWidth="1" strokeDasharray="3 2" />

            {/* Eye Pupil (Tracks Mouse Movement & Blinks) */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y}) scale(1, ${isBlinking ? 0.05 : 1})`}>
              <circle cx="0" cy="0" r="6" fill={cyanCol} filter="url(#cyanGlow)" />
              <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
            </g>
          </g>

          {/* Interactive Mechanical Eye Right */}
          <g transform="translate(130, 98)">
            <circle cx="0" cy="0" r="14" fill="#000000" stroke={cyanCol} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity="0.4" />
            <circle cx="0" cy="0" r="7.5" stroke="url(#armorAccentGrad)" strokeWidth="1" strokeDasharray="3 2" />

            {/* Eye Pupil (Tracks Mouse Movement & Blinks) */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y}) scale(1, ${isBlinking ? 0.05 : 1})`}>
              <circle cx="0" cy="0" r="6" fill={cyanCol} filter="url(#cyanGlow)" />
              <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
            </g>
          </g>

          {/* Mouth Respirator Vents & Laser Speaker Gills (Matching Ear Slits) */}
          <path d="M84 146 L116 146" stroke={cyanCol} strokeWidth="2" strokeLinecap="round" />
          <path d="M88 151 L112 151" stroke="url(#armorAccentGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M92 156 L108 156" stroke={cyanCol} strokeWidth="1" strokeLinecap="round" opacity="0.75" />

          {/* Chin Armor Collar Plate (Unified Chamfer Polygon) */}
          <polygon points="100,164 116,156 100,175 84,156" fill="url(#armorAccentGrad)" opacity="0.85" stroke={cyanCol} strokeWidth="1" />
        </svg>

        {/* Laser Scan Beam overlay when clicked */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-30">
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#00f0ff] animate-laser-top" />
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
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
        <Sparkles
          size={16}
          className="animate-pulse shrink-0"
          style={{
            color: isLight ? '#0284c7' : '#00f0ff',
            filter: isLight
              ? 'drop-shadow(0 1px 3px rgba(2, 132, 199, 0.4))'
              : 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.85))',
          }}
        />
        <span className="arcade-badge cyber-gradient-text animate-shimmer-text whitespace-nowrap">{lang === 'zh' ? 'AI 前沿技術跟進中' : 'AI ADVANCEMENT TRACKING'}</span>
      </div>
    </div>
  );
};

export default SciFiRobotAvatar;
