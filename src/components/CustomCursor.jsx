import React, { useEffect, useRef, useState } from 'react';

// CustomCursor Component: High-Tech Cyber Blue Pointer Arrow & Reactive Energy Ring
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let reqId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Direct positioning for sharp precision arrow tip (shifted -2px for exact hit point)
      cursor.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .glass-card, article')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const animate = () => {
      // Smooth lerp trailing halo ring
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
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
  }, []);

  return (
    <>
      {/* Outer Reactive Energy Halo Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`hidden lg:block fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border transition-all duration-200 ${
          isHovered
            ? 'w-10 h-10 border-cyan-400 bg-cyan-400/20 scale-110'
            : isMouseDown
            ? 'w-7 h-7 border-purple-400 bg-purple-500/30 scale-90'
            : 'w-9 h-9 border-cyan-400/50 bg-cyan-500/10'
        }`}
        style={{
          boxShadow: isHovered ? '0 0 20px rgba(6, 182, 212, 0.6)' : '0 0 10px rgba(6, 182, 212, 0.2)',
        }}
      />

      {/* Futuristic Cyber Blue SVG Arrow Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.95)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.8))',
        }}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isHovered ? 'scale-125 text-cyan-300 fill-cyan-400/60' : 'text-cyan-400 fill-cyan-500/40'
          }`}
          viewBox="0 0 24 24"
        >
          {/* Futuristic Precision Pointer Arrow */}
          <path
            d="M3 3l7 18 3-7 7-3L3 3z"
            stroke="#22d3ee"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};
