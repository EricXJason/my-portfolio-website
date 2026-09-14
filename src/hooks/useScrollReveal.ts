/**
 * ============================================================================
 * 檔案名稱: useScrollReveal.ts
 * 所屬模組: UI Animation System (滾動觸發進場動畫模組)
 * 責任描述: 透過原生的 Intersection Observer API 提供 GPU 硬體加速安全的視窗滾動進場動畫。
 * 架構分層: Custom Hook Layer (共用 Hook 層)
 * 依賴關係: 僅依賴瀏覽器原生 IntersectionObserver 與 React 生命週期 Hook。
 * 邊界處理: 針對偏好減少動態效果 (prefers-reduced-motion) 自動標記為已揭露，且元素進場後立即取消監聽 (fire-once) 以確保極致渲染效能。
 * ============================================================================
 */

import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — 針對單一容器元素的視窗滾動揭露 Hook。
 *
 * 架構意圖：純粹透過切換 CSS class 與 data 屬性驅動動畫，完全不使用額外的 JS 動畫運算，
 * 確保動畫全部在瀏覽器的 Compositor 執行緒執行，達成零卡頓與高 Lighthouse 評分。
 *
 * 當容器進入視窗邊界時，會為 DOM 節點設定 `data-revealed="true"`，
 * 子元素則能透過 `.reveal-*` 等 CSS 選擇器無縫觸發進場微動效。
 */
export function useScrollReveal(
  threshold = 0.05,
  rootMargin = '0px 0px -20px 0px',
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 若使用者系統偏好減少動畫效果，直接標記為已揭露並提前返回，節省 Observer 運算開銷
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            // 一旦觸發進場即解除觀察，貫徹單次觸發模式以取得最佳效能
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * useScrollRevealChildren — 針對複數子元素個別進行視窗交叉監聽，
 * 實現子項目獨立進場與精確交錯 (stagger) 動畫效果。
 */
export function useScrollRevealChildren(
  selector: string,
  threshold = 0.05,
  rootMargin = '0px 0px -20px 0px',
) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      container.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.dataset.revealed = 'true';
      });
      return;
    }

    const children = Array.from(
      container.querySelectorAll<HTMLElement>(selector),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [selector, threshold, rootMargin]);

  return containerRef;
}
