/**
 * ============================================================================
 * 檔案名稱: BackToTop.tsx
 * 所屬模組: Presentation Layer (返回頂部浮動按鈕模組)
 * 責任描述: 負責監聽視窗滾動距離，於超過閾值時浮現霓虹返回頂端按鈕，並執行平滑捲動。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 passive 滾動事件監聽與 CSS 平滑過渡。
 * 依賴關係: 依賴 ThemeContext 與 Lucide ChevronUp 圖示。
 * 邊界處理: 行動端開啟導覽列時自動隱藏、支援被動監聽 (passive: true) 提升滾動幀率。
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

export const BackToTop: React.FC = () => {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isLight = theme === 'light';
  const isEn = lang === 'en';
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > 150);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top-btn !fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] p-3 sm:p-3.5 cyber-cut-sm border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group backdrop-blur-md shadow-md flex items-center justify-center ${
        isVisible ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
      }`}

      style={{
        position: 'fixed',
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(8, 14, 26, 0.85)',
        borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)',
        color: isLight ? '#0369a1' : '#00f0ff',
        boxShadow: isLight
          ? '0 2px 12px rgba(15, 23, 42, 0.1)'
          : '0 4px 14px rgba(0, 0, 0, 0.6), 0 0 6px rgba(0, 240, 255, 0.15)',
      }}
      aria-label={isEn ? 'Back to Top' : '返回頂端'}
      title={isEn ? 'Back to Top' : '返回頂端'}
    >
      <ChevronUp size={22} className="group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
    </button>
  );
};

