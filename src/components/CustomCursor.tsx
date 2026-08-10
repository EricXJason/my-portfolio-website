import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const pointerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

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

    checkClass();

    const observer = new MutationObserver(checkClass);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const handleMouseLeave = (e: MouseEvent) => {
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

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      const x = e.clientX;
      const y = e.clientY;

      pointer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      setHasMoved(true);

      if (
        document.body.classList.contains('hide-custom-cursor') ||
        (target &&
          (target.tagName === 'IFRAME' ||
            target.closest('iframe') ||
            target.closest('.iframe-container') ||
            target.closest('.modal-iframe-area')))
      ) {
        setIsHidden(true);
        return;
      } else {
        setIsHidden(false);
      }

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
  }, [enabled]);

  if (!enabled) return null;

  const cyanColor = isLight ? '#0284c7' : '#00f0ff';
  // On hover over clickable elements, fill the cursor interior with full cyan blue (no red)
  const currentFill = isHovered ? cyanColor : (isLight ? '#ffffff' : '#070d19');

  return (
    <div
      ref={pointerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[999999] transition-opacity duration-150 ${
        !hasMoved || isHidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ${
          isMouseDown ? 'scale-90' : isHovered ? 'scale-110' : 'scale-100'
        }`}
      >
        {/* Standard Arrow Pointer with Cyan Laser Glow & Blue Fill on Hover */}
        <svg
          className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.75)] transition-colors duration-150"
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
