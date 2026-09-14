/**
 * ============================================================================
 * 檔案名稱: CustomCursor.tsx
 * 所屬模組: UI Interaction System (自訂游標互動模組)
 * 責任描述: 提供零重複渲染 (Zero-re-render) 的極致流暢自訂游標體驗，支援深淺色主題、懸停變形與點擊縮放。
 * 架構分層: Presentation Layer (React UI Component)
 套用 Direct DOM Manipulation 與 Ref 狀態暫存模式，徹底阻絕指標移動造成的 React Reconciliation 負擔。
 * 依賴關係: 依賴 ThemeContext 取得當前色彩主題模式。
 * 邊界處理: 針對觸控裝置自動停用、偵測 iframe 與模態視窗自動隱藏、視窗邊界離開時淡出。
 * ============================================================================
 */

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

// 零重複渲染自訂游標 — 所有高頻狀態皆由 Ref 追蹤並直接操作 DOM。
// pointermove 與 mousemove 事件絕對不會觸發 React 虛擬 DOM 協調。
export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const wrapperRef   = useRef<HTMLDivElement | null>(null);
  const svgFillRef   = useRef<SVGPathElement | null>(null);
  // 可變 Ref 集合 — 避免在高頻路徑調用 setState
  const stateRef = useRef({
    hasMoved:    false,
    isHovered:   false,
    isMouseDown: false,
    isHidden:    false,
  });

  // 依據當前色彩主題計算色碼 (當主題切換時重新計算)
  const cyanColor    = isLight ? '#0284c7' : '#00f0ff';
  const defaultFill  = isLight ? '#ffffff'  : '#070d19';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 檢查是否為精確指標裝置 (非觸控螢幕)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add('custom-cursor-active');

    const wrapper = wrapperRef.current;
    const fill    = svgFillRef.current;
    if (!wrapper || !fill) return;

    // ── 原生 DOM 操作輔助函式 (零 React 重複渲染) ──────────────────────────
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

    // ── 核心游標位置更新 (在 pointermove 事件中調用 — 位於 rAF 幀率邊界) ─
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

    // ── 事件監聽器處理函式 ──────────────────────────────────────────────────
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

  // 當深淺色主題切換時同步更新 SVG 顏色屬性 (不在高頻移動路徑上)
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
