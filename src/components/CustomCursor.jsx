import React, { useEffect, useRef } from 'react';

// CustomCursor Component: High-Tech Cyber Blue Pointer Arrow Cursor
export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out filter drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
    >
      {/* High-Tech Cyber Blue SVG Arrow Cursor */}
      <svg
        className="w-6 h-6 text-cyan-400 fill-cyan-500/30 stroke-cyan-400 stroke-[1.5]"
        viewBox="0 0 24 24"
      >
        <path d="M3 3l7 18 3-7 7-3L3 3z" />
      </svg>
    </div>
  );
};
