import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Performance & WCAG notes:
// - All blur elements use will-change: opacity, transform for GPU layer promotion
// - Light Mode: Soft, elegant sky/indigo laboratory luminescence (opacity 0.05-0.08) ensuring 100% WCAG compliance
// - Dark Mode: Deep cyber abyss neon luminescence
// - Mobile (<768px): 3 elements only, blur radius 80px (vs 120px desktop)
// - Animation duration 15s to reduce GPU repaint frequency

export const GlobalAmbientNeon: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Subtle & Symmetrical Atmosphere Colors (Dark vs Light)
  const leftCyanOuter = isLight ? 'rgba(56, 189, 248, 0.07)' : 'rgba(0, 240, 255, 0.11)';
  const leftBlueOuter = isLight ? 'rgba(2, 132, 199, 0.05)'  : 'rgba(14, 165, 233, 0.09)';
  const leftCyanCore  = isLight ? 'rgba(2, 132, 199, 0.09)'  : 'rgba(0, 240, 255, 0.17)';

  const rightPurpleOuter = isLight ? 'rgba(192, 132, 252, 0.07)' : 'rgba(168, 85, 247, 0.11)';
  const rightVioletOuter = isLight ? 'rgba(124, 58, 237, 0.05)'  : 'rgba(147, 51, 234, 0.09)';
  const rightPurpleCore  = isLight ? 'rgba(147, 51, 234, 0.09)'  : 'rgba(168, 85, 247, 0.17)';

  // GPU-layer hint applied to every animated blur element
  const willChange: React.CSSProperties = { willChange: 'opacity, transform' };

  if (isMobile) {
    // Mobile: 3 elements, reduced blur, no mid-orbs
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
        aria-hidden="true"
      >
        {/* Left top orb */}
        <div
          className="absolute -left-24 top-[10%] w-[220px] h-[220px] rounded-full blur-[80px] pointer-events-none animate-ambient-left"
          style={{ backgroundColor: leftCyanOuter, ...willChange }}
        />
        {/* Right top orb */}
        <div
          className="absolute -right-24 top-[10%] w-[220px] h-[220px] rounded-full blur-[80px] pointer-events-none animate-ambient-right"
          style={{ backgroundColor: rightPurpleOuter, ...willChange }}
        />
        {/* Bottom centre fade */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[140px] rounded-full blur-[70px] pointer-events-none animate-ambient-core-pulse"
          style={{ backgroundColor: leftBlueOuter, ...willChange }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ── LEFT SIDE AMBIENT NEON SYSTEM (CYAN / ELECTRIC BLUE) ── */}

      {/* Symmetrical Vertical Edge Aura Strip - Left */}
      <div
        className="absolute top-0 bottom-0 left-0 w-28 sm:w-48 pointer-events-none animate-ambient-core-pulse"
        style={{
          opacity: isLight ? 0.25 : 0.40,
          background: isLight
            ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.08) 0%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(0, 240, 255, 0.09) 0%, transparent 100%)',
          ...willChange,
        }}
      />

      {/* Node 1: Top-Left Orb */}
      <div
        className="absolute top-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>

      {/* Node 2: Mid-Left Orb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftBlueOuter, ...willChange }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[90px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>

      {/* Node 3: Bottom-Left Orb */}
      <div
        className="absolute bottom-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>


      {/* ── RIGHT SIDE AMBIENT NEON SYSTEM (PURPLE / VIOLET) ── */}

      {/* Symmetrical Vertical Edge Aura Strip - Right */}
      <div
        className="absolute top-0 bottom-0 right-0 w-28 sm:w-48 pointer-events-none animate-ambient-core-pulse"
        style={{
          opacity: isLight ? 0.25 : 0.40,
          background: isLight
            ? 'linear-gradient(270deg, rgba(192, 132, 252, 0.08) 0%, transparent 100%)'
            : 'linear-gradient(270deg, rgba(168, 85, 247, 0.09) 0%, transparent 100%)',
          ...willChange,
        }}
      />

      {/* Node 1: Top-Right Orb */}
      <div
        className="absolute top-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>

      {/* Node 2: Mid-Right Orb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightVioletOuter, ...willChange }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[90px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>

      {/* Node 3: Bottom-Right Orb */}
      <div
        className="absolute bottom-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>
    </div>
  );
};

export default GlobalAmbientNeon;
