import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const pointerRef = useRef<HTMLDivElement | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse / trackpad)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add('custom-cursor-active');

    const pointer = pointerRef.current;

    const updatePosition = (x: number, y: number, target: HTMLElement | null) => {
      if (pointer) {
        pointer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      setHasMoved(true);

      // Check if mouse is over iframe or body has hide class
      const isOverIframe =
        target &&
        (target.tagName === 'IFRAME' ||
          target.closest('iframe') ||
          target.closest('.iframe-container') ||
          target.closest('.modal-iframe-area'));

      const isBodyHidden = document.body.classList.contains('hide-custom-cursor');

      if (isOverIframe || isBodyHidden) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Check if target is interactive
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
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

    const handlePointerMove = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const handleWindowLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight ||
        !e.relatedTarget
      ) {
        setIsHidden(true);
      }
    };

    const handleWindowEnter = () => {
      setIsHidden(false);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setIsHidden(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handleMouseDown, { passive: true });
    window.addEventListener('pointerup', handleMouseUp, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('mouseleave', handleWindowLeave, { passive: true });
    window.addEventListener('mouseenter', handleWindowEnter, { passive: true });
    window.addEventListener('focus', handleWindowEnter, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('pointerup', handleMouseUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleWindowLeave);
      window.removeEventListener('mouseenter', handleWindowEnter);
      window.removeEventListener('focus', handleWindowEnter);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const cyanColor = isLight ? '#0284c7' : '#00f0ff';
  const currentFill = isHovered ? cyanColor : (isLight ? '#ffffff' : '#070d19');

  return (
    <div
      ref={pointerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[99999999] will-change-transform transition-opacity duration-100 ${
        !hasMoved || isHidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-100 ${
          isMouseDown ? 'scale-90' : isHovered ? 'scale-110' : 'scale-100'
        }`}
      >
        {/* Standard Arrow Pointer with Cyan Laser Glow & Blue Fill on Hover */}
        <svg
          className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.75)] transition-colors duration-100"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 3l7 18 3-7 7-3L3 3z"
            fill={currentFill}
            stroke={cyanColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;
