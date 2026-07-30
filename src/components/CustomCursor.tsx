import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const pointerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkClass = () => {
      setIsHidden(document.body.classList.contains('hide-custom-cursor'));
    };

    // Initial check
    checkClass();

    const observer = new MutationObserver(checkClass);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const handleMouseLeave = (e: MouseEvent) => {
      // Hide custom cursor when mouse leaves window or enters iframe
      if (!e.relatedTarget || (e.relatedTarget as HTMLElement).tagName === 'IFRAME') {
        setIsHidden(true);
      }
    };

    const handleMouseEnter = () => {
      if (!document.body.classList.contains('hide-custom-cursor')) {
        setIsHidden(false);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      observer.disconnect();
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const pointer = pointerRef.current;
    if (!pointer) return;

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.body.classList.contains('hide-custom-cursor')) {
        setIsHidden(true);
        return;
      } else {
        setIsHidden(false);
      }

      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const scale = isMouseDown ? 0.88 : isHovered ? 1.18 : 1.0;
      pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${scale})`;

      const target = e.target as HTMLElement | null;
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
      className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200 ease-out ${
        isHidden ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        filter: isLight
          ? 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.35)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.95))'
          : 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.95)) drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))',
      }}
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3l7 18 3-7 7-3L3 3z"
          fill={isLight ? '#000000' : 'rgba(6, 182, 212, 0.45)'}
          stroke={isLight ? '#000000' : '#22d3ee'}
          strokeWidth={isLight ? '2.2' : '2'}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
