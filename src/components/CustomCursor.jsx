import React, { useEffect, useRef, useState } from 'react';

// CustomCursor Component: Sleek Cyber Blue Pointer Arrow Only
export const CustomCursor = () => {
  const pointerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop fine-pointer devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pointer = pointerRef.current;
    if (!pointer) return;

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Instant 0ms response, arrow tip aligned to mouse position
      pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={pointerRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-none"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.95)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))',
      }}
    >
      {/* Precision Cyber Blue SVG Arrow Cursor */}
      <svg
        className="w-6 h-6 text-cyan-400 fill-cyan-500/40"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3l7 18 3-7 7-3L3 3z"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

