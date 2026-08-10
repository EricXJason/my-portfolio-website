import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const GlobalAmbientNeon: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Subtle & Symmetrical Atmosphere Colors (Dark vs Light)
  const leftCyanOuter = isLight ? 'rgba(56, 189, 248, 0.14)' : 'rgba(0, 240, 255, 0.11)';
  const leftBlueOuter = isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(14, 165, 233, 0.09)';
  const leftCyanCore  = isLight ? 'rgba(2, 132, 199, 0.20)' : 'rgba(0, 240, 255, 0.18)';

  const rightPurpleOuter = isLight ? 'rgba(192, 132, 252, 0.14)' : 'rgba(168, 85, 247, 0.11)';
  const rightVioletOuter = isLight ? 'rgba(124, 58, 237, 0.12)' : 'rgba(147, 51, 234, 0.09)';
  const rightPurpleCore  = isLight ? 'rgba(147, 51, 234, 0.20)' : 'rgba(168, 85, 247, 0.18)';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ── LEFT SIDE AMBIENT NEON SYSTEM (CYAN / ELECTRIC BLUE) ── */}

      {/* Symmetrical Vertical Edge Aura Strip - Left */}
      <div
        className="absolute top-0 bottom-0 left-0 w-28 sm:w-48 opacity-45 pointer-events-none transition-opacity duration-1000 animate-ambient-core-pulse"
        style={{
          background: isLight
            ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.12) 0%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(0, 240, 255, 0.09) 0%, transparent 100%)',
        }}
      />

      {/* Node 1: Top-Left Symmetrical Orb */}
      <div
        className="absolute top-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[150px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[100px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore }}
        />
      </div>

      {/* Node 2: Mid-Left Symmetrical Orb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[150px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftBlueOuter, animationDelay: '2.5s' }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[110px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, animationDelay: '1.2s' }}
        />
      </div>

      {/* Node 3: Bottom-Left Symmetrical Orb */}
      <div
        className="absolute bottom-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[150px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter, animationDelay: '5s' }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[100px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, animationDelay: '2.4s' }}
        />
      </div>


      {/* ── RIGHT SIDE AMBIENT NEON SYSTEM (PURPLE / VIOLET — 100% MIRRORED SYMMETRY) ── */}

      {/* Symmetrical Vertical Edge Aura Strip - Right */}
      <div
        className="absolute top-0 bottom-0 right-0 w-28 sm:w-48 opacity-45 pointer-events-none transition-opacity duration-1000 animate-ambient-core-pulse"
        style={{
          background: isLight
            ? 'linear-gradient(270deg, rgba(192, 132, 252, 0.12) 0%, transparent 100%)'
            : 'linear-gradient(270deg, rgba(168, 85, 247, 0.09) 0%, transparent 100%)',
        }}
      />

      {/* Node 1: Top-Right Symmetrical Orb */}
      <div
        className="absolute top-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[150px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[100px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore }}
        />
      </div>

      {/* Node 2: Mid-Right Symmetrical Orb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[150px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightVioletOuter, animationDelay: '2.5s' }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[110px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, animationDelay: '1.2s' }}
        />
      </div>

      {/* Node 3: Bottom-Right Symmetrical Orb */}
      <div
        className="absolute bottom-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[150px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter, animationDelay: '5s' }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[100px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, animationDelay: '2.4s' }}
        />
      </div>
    </div>
  );
};

export default GlobalAmbientNeon;
