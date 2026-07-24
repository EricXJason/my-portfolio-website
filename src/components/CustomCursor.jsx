import React, { useEffect, useRef, useState } from 'react';

// CustomCursor Component: Futuristic Cyber Blue Arrow + Reactive Crosshair Target Ring
export const CustomCursor = () => {
  const pointerRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop mouse/fine-pointer devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pointer = pointerRef.current;
    const ring = ringRef.current;
    if (!pointer || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let reqId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Instant 0ms response for precision arrow tip
      pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const handleMouseDown = (e) => {
      setIsMouseDown(true);
      // Spawn temporary click shockwave ring
      const newClick = { id: Date.now(), x: e.clientX, y: e.clientY };
      setClicks((prev) => [...prev.slice(-4), newClick]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
      }, 500);
    };

    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .glass-card, article')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const animate = () => {
      // Smooth 0.22 lerp trailing cyber ring
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      reqId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    reqId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(reqId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* 1. Trailing Cyber Target Crosshair Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-10 h-10 border-cyan-400 bg-cyan-400/20 rotate-45 scale-125'
            : isMouseDown
            ? 'w-7 h-7 border-purple-400 bg-purple-500/30 scale-90'
            : 'w-10 h-10 border-cyan-400/60 bg-cyan-500/10'
        }`}
        style={{
          boxShadow: isHovered
            ? '0 0 25px rgba(6, 182, 212, 0.8), inset 0 0 10px rgba(6, 182, 212, 0.4)'
            : '0 0 12px rgba(6, 182, 212, 0.3)',
        }}
      >
        {/* Cyber Crosshair Hairline Ticks */}
        <div className="absolute -top-1 w-[2px] h-2 bg-cyan-400/80" />
        <div className="absolute -bottom-1 w-[2px] h-2 bg-cyan-400/80" />
        <div className="absolute -left-1 h-[2px] w-2 bg-cyan-400/80" />
        <div className="absolute -right-1 h-[2px] w-2 bg-cyan-400/80" />
      </div>

      {/* 2. Instant Cyber Blue Arrow Precision Pointer */}
      <div
        ref={pointerRef}
        className="fixed top-0 left-0 transition-none"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 1)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.9))',
        }}
      >
        <svg
          className={`w-6 h-6 transition-all duration-150 ${
            isHovered ? 'scale-125 text-cyan-300 fill-cyan-400/70' : 'text-cyan-400 fill-cyan-500/50'
          }`}
          viewBox="0 0 24 24"
        >
          {/* Cyber Pointer Arrow */}
          <path
            d="M3 3l7 18 3-7 7-3L3 3z"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 3. Click Shockwave Energy Ripples */}
      {clicks.map((c) => (
        <div
          key={c.id}
          className="fixed rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-ping pointer-events-none"
          style={{
            left: `${c.x - 16}px`,
            top: `${c.y - 16}px`,
            width: '32px',
            height: '32px',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.9)',
          }}
        />
      ))}
    </div>
  );
};

