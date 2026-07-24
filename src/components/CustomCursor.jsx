import React, { useEffect, useRef } from 'react';

// CustomCursor Component: High-Tech Cyber Pointer Arrow + Trailing Energy Ring
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

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
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      reqId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    reqId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <>
      {/* Outer Trailing Energy Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400/40 bg-cyan-500/10 pointer-events-none z-[9998] transition-opacity duration-300 blur-[1px]"
      />

      {/* High-Tech Cyber Blue SVG Arrow Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
      >
        <svg
          className="w-6 h-6 text-cyan-400 fill-cyan-500/30 stroke-cyan-400 stroke-[1.5]"
          viewBox="0 0 24 24"
        >
          <path d="M3 3l7 18 3-7 7-3L3 3z" />
        </svg>
      </div>
    </>
  );
};
