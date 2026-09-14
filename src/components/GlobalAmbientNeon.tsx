/**
 * ============================================================================
 * 檔案名稱: GlobalAmbientNeon.tsx
 * 所屬模組: Presentation Layer (全域環境氛圍微光霓虹模組)
 * 責任描述: 負責呈現全站背景深邃對稱環境光暈（左側青藍冷色、右側紫羅蘭暖色），強化空間景深。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 CSS will-change 硬體加速圖層提升。
 * 依賴關係: 依賴 ThemeContext 深淺色切換。
 * 邊界處理: 行動端 (<768px) 縮減為 3 顆光暈並調降模糊半徑以保證 60 FPS 流暢度。
 * ============================================================================
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

// 效能與 WCAG 無障礙對比度規範說明：
// - 所有模糊光暈元素皆配置 will-change: opacity, transform 以促成獨立 GPU 圖層
// - 淺色模式：採用柔和高雅之天藍/靛藍實驗室輝光 (不透明度 0.05-0.08)，保證 100% WCAG 合規
// - 深色模式：深邃賽博深淵霓虹輝光
// - 行動端 (<768px)：僅渲染 3 顆光暈元素，模糊半徑降為 80px (桌面端為 120px)
// - 動畫週期延長至 15s 以降低 GPU 重繪頻率

export const GlobalAmbientNeon: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 柔和對稱環境氛圍色彩（深色對比淺色）
  const leftCyanOuter = isLight ? 'rgba(56, 189, 248, 0.07)' : 'rgba(0, 240, 255, 0.11)';
  const leftBlueOuter = isLight ? 'rgba(2, 132, 199, 0.05)'  : 'rgba(14, 165, 233, 0.09)';
  const leftCyanCore  = isLight ? 'rgba(2, 132, 199, 0.09)'  : 'rgba(0, 240, 255, 0.17)';

  const rightPurpleOuter = isLight ? 'rgba(192, 132, 252, 0.07)' : 'rgba(168, 85, 247, 0.11)';
  const rightVioletOuter = isLight ? 'rgba(124, 58, 237, 0.05)'  : 'rgba(147, 51, 234, 0.09)';
  const rightPurpleCore  = isLight ? 'rgba(147, 51, 234, 0.09)'  : 'rgba(168, 85, 247, 0.17)';

  // 套用至所有動態模糊元素之 GPU 圖層提示
  const willChange: React.CSSProperties = { willChange: 'opacity, transform' };

  if (isMobile) {
    // 行動端：渲染 3 顆光暈、調降模糊半徑、略過中層光球
    return (
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
        aria-hidden="true"
      >
        {/* 左上環境光球 */}
        <div
          className="absolute -left-24 top-[10%] w-[220px] h-[220px] rounded-full blur-[80px] pointer-events-none animate-ambient-left"
          style={{ backgroundColor: leftCyanOuter, ...willChange }}
        />
        {/* 右上環境光球 */}
        <div
          className="absolute -right-24 top-[10%] w-[220px] h-[220px] rounded-full blur-[80px] pointer-events-none animate-ambient-right"
          style={{ backgroundColor: rightPurpleOuter, ...willChange }}
        />
        {/* 底部中央漸層淡出 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[140px] rounded-full blur-[70px] pointer-events-none animate-ambient-core-pulse"
          style={{ backgroundColor: leftBlueOuter, ...willChange }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* ── 左側環境霓虹系統 (青色 / 電光藍) ── */}

      {/* 對稱垂直邊緣光環帶 - 左側 */}
      <div
        className="absolute top-0 bottom-0 left-0 w-28 sm:w-48 pointer-events-none animate-ambient-core-pulse"
        style={{
          opacity: isLight ? 0.25 : 0.40,
          background: isLight
            ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.08) 0%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(0, 240, 255, 0.09) 0%, transparent 100%)',
          ...willChange,
        }}
      />

      {/* 節點 1: 左上光球 */}
      <div
        className="absolute top-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>

      {/* 節點 2: 左中光球 */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftBlueOuter, ...willChange }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[90px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>

      {/* 節點 3: 左下光球 */}
      <div
        className="absolute bottom-[12%] -left-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-left"
        style={{ backgroundColor: leftCyanOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: leftCyanCore, ...willChange }}
        />
      </div>


      {/* ── 右側環境霓虹系統 (紫色 / 霓紫) ── */}

      {/* 對稱垂直邊緣光環帶 - 右側 */}
      <div
        className="absolute top-0 bottom-0 right-0 w-28 sm:w-48 pointer-events-none animate-ambient-core-pulse"
        style={{
          opacity: isLight ? 0.25 : 0.40,
          background: isLight
            ? 'linear-gradient(270deg, rgba(192, 132, 252, 0.08) 0%, transparent 100%)'
            : 'linear-gradient(270deg, rgba(168, 85, 247, 0.09) 0%, transparent 100%)',
          ...willChange,
        }}
      />

      {/* 節點 1: 右上光球 */}
      <div
        className="absolute top-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>

      {/* 節點 2: 右中光球 */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-44 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightVioletOuter, ...willChange }}
      >
        <div
          className="absolute inset-24 rounded-full blur-[90px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>

      {/* 節點 3: 右下光球 */}
      <div
        className="absolute bottom-[12%] -right-36 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none animate-ambient-right"
        style={{ backgroundColor: rightPurpleOuter, ...willChange }}
      >
        <div
          className="absolute inset-20 rounded-full blur-[80px] animate-ambient-core-pulse"
          style={{ backgroundColor: rightPurpleCore, ...willChange }}
        />
      </div>
    </div>
  );
};

export default GlobalAmbientNeon;
