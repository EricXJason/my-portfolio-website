/**
 * ============================================================================
 * 檔案名稱: ScrollProgress.tsx
 * 所屬模組: Presentation Layer (全域滾動閱讀進度條模組)
 * 責任描述: 負責計算網頁當前垂直滾動百分比，並於導覽列下方呈現科技漸層進度指示條。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 passive 滾動事件監聽與 GPU 硬體加速 (translateZ)。
 * 依賴關係: 依賴 React 原生 Hooks 與 siteEntered 開場狀態。
 * 邊界處理: 總高度為 0 時除法防護、開場動畫期間平滑淡入防抖。
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';

interface ScrollProgressProps {
  siteEntered?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ siteEntered = true }) => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollWidth((winScroll / height) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 頂部水平閱讀進度條 — 嚴格置於導覽列下方 (top-16 sm:top-20)
  return (
    <div
      className={`fixed top-16 sm:top-20 left-0 h-[2px] bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 z-40 transition-opacity duration-700 shadow-sm pointer-events-none ${
        siteEntered ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        width: `${scrollWidth}%`,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
      role="progressbar"
      aria-valuenow={Math.round(scrollWidth)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading Scroll Progress"
    />
  );
};
