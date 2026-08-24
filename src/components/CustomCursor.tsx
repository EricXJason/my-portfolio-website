import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

// Zero-re-render custom cursor — all state tracked via refs & direct DOM manipulation.
// mousemove / pointermove events NEVER trigger React reconciliation.
export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const wrapperRef   = useRef<HTMLDivElement | null>(null);
  const svgFillRef   = useRef<SVGPathElement | null>(null);
  // Mutable ref bag — avoids any setState on hot paths
  const stateRef = useRef({
    hasMoved:    false,
    isHovered:   false,
    isMouseDown: false,
    isHidden:    false,
  });

  // Derive colours from current theme (re-evaluated when theme changes via layout effect)
  const cyanColor    = isLight ? '#0284c7' : '#00f0ff';
  const defaultFill  = isLight ? '#ffffff'  : '#070d19';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add('custom-cursor-active');

    const wrapper = wrapperRef.current;
    const fill    = svgFillRef.current;
    if (!wrapper || !fill) return;

    // ── Direct DOM helpers (zero React re-render) ──────────────────────────
    const applyVisibility = () => {
      const s = stateRef.current;
      wrapper.style.opacity = (!s.hasMoved || s.isHidden) ? '0' : '1';
    };

    const applyScale = () => {
      const s = stateRef.current;
      const scale = s.isMouseDown ? 0.90 : s.isHovered ? 1.10 : 1.00;
      if (wrapper.firstElementChild) {
        (wrapper.firstElementChild as HTMLElement).style.transform = `scale(${scale})`;
      }
    };

    const applyFill = () => {
      const s = stateRef.current;
      fill.setAttribute('fill', s.isHovered ? cyanColor : defaultFill);
    };

    // ── Core position update (called in pointermove — already on rAF boundary) ─
    const updatePosition = (x: number, y: number, target: HTMLElement | null) => {
      wrapper.style.transform = `translate3d(${x}px,${y}px,0)`;

      const s = stateRef.current;
      if (!s.hasMoved) { s.hasMoved = true; }

      const isOverIframe =
        target &&
        (target.tagName === 'IFRAME' ||
          target.closest('iframe') ||
          target.closest('.iframe-container') ||
          target.closest('.modal-iframe-area'));
      const isBodyHidden = document.body.classList.contains('hide-custom-cursor');

      const newHidden = !!(isOverIframe || isBodyHidden);
      if (newHidden !== s.isHidden) { s.isHidden = newHidden; applyVisibility(); }

      const newHovered = !!(
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
      );
      if (newHovered !== s.isHovered) { s.isHovered = newHovered; applyFill(); applyScale(); }

      applyVisibility();
    };

    // ── Event handlers ──────────────────────────────────────────────────────
    const onPointerMove = (e: PointerEvent) =>
      updatePosition(e.clientX, e.clientY, e.target as HTMLElement | null);

    const onMouseMove = (e: MouseEvent) =>
      updatePosition(e.clientX, e.clientY, e.target as HTMLElement | null);

    const onDown = () => {
      stateRef.current.isMouseDown = true;
      applyScale();
    };
    const onUp = () => {
      stateRef.current.isMouseDown = false;
      applyScale();
    };

    const onWindowLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 || e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight ||
        !e.relatedTarget
      ) {
        stateRef.current.isHidden = true;
        applyVisibility();
      }
    };
    const onWindowEnter = () => {
      stateRef.current.isHidden = false;
      applyVisibility();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        stateRef.current.isHidden = false;
        applyVisibility();
      }
    };

    window.addEventListener('pointermove',    onPointerMove,  { passive: true });
    window.addEventListener('mousemove',      onMouseMove,    { passive: true });
    window.addEventListener('pointerdown',    onDown,         { passive: true });
    window.addEventListener('pointerup',      onUp,           { passive: true });
    window.addEventListener('mousedown',      onDown,         { passive: true });
    window.addEventListener('mouseup',        onUp,           { passive: true });
    window.addEventListener('mouseleave',     onWindowLeave,  { passive: true });
    window.addEventListener('mouseenter',     onWindowEnter,  { passive: true });
    window.addEventListener('focus',          onWindowEnter,  { passive: true });
    document.addEventListener('visibilitychange', onVisibility, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove',    onPointerMove);
      window.removeEventListener('mousemove',      onMouseMove);
      window.removeEventListener('pointerdown',    onDown);
      window.removeEventListener('pointerup',      onUp);
      window.removeEventListener('mousedown',      onDown);
      window.removeEventListener('mouseup',        onUp);
      window.removeEventListener('mouseleave',     onWindowLeave);
      window.removeEventListener('mouseenter',     onWindowEnter);
      window.removeEventListener('focus',          onWindowEnter);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update colour attrs synchronously when theme toggles (not on hot path)
  useEffect(() => {
    const fill = svgFillRef.current;
    if (!fill) return;
    fill.setAttribute('stroke', cyanColor);
    if (!stateRef.current.isHovered) fill.setAttribute('fill', defaultFill);
  }, [cyanColor, defaultFill]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99999999] will-change-transform opacity-0"
      style={{ transition: 'opacity 100ms' }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ transition: 'transform 100ms' }}
      >
        <svg
          className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.75)]"
          viewBox="0 0 24 24"
        >
          <path
            ref={svgFillRef}
            d="M3 3l7 18 3-7 7-3L3 3z"
            fill={defaultFill}
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
