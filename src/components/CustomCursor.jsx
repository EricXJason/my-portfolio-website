import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// CustomCursor Component: Responsive High-Contrast Pointer Arrow for Dark & Light Themes
export const CustomCursor = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const pointerRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

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
      
      const scale = isMouseDown ? 0.88 : isHovered ? 1.18 : 1.0;
      pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${scale})`;

      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList?.contains('cursor-pointer') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, isHovered, isMouseDown]);

  if (!enabled) return null;

  return (
    <div
      ref={pointerRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-transform duration-100 ease-out"
      style={{
        filter: isLight
          ? 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.35)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.95))'
          : 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.95)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))',
      }}
    >
      {/* Precision Cyber SVG Arrow Cursor */}
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3l7 18 3-7 7-3L3 3z"
          fill={isLight ? '#0284c7' : 'rgba(6, 182, 212, 0.45)'}
          stroke={isLight ? '#0f172a' : '#22d3ee'}
          strokeWidth={isLight ? '2.2' : '2'}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
