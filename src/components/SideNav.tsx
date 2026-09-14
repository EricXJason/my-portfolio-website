/**
 * ============================================================================
 * 檔案名稱: SideNav.tsx
 * 所屬模組: Presentation Layer (桌面端側邊快捷導覽模組)
 * 責任描述: 負責呈現桌面寬螢幕右側錨點導覽膠囊，即時追蹤滾動區塊高亮並提供點擊平滑跳轉。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 IntersectionObserver / 滾動位置動態計算。
 * 依賴關係: 依賴 LangContext、ThemeContext 與 BASE_SECTIONS 區塊對照表。
 * 邊界處理: 頁面未完全載入時隱藏、視窗邊緣安全距離防護。
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

interface SectionItem {
  id: string;
  labelKey: string;
}

const BASE_SECTIONS: Record<string, SectionItem> = {
  home: { id: 'home', labelKey: 'nav_home' },
  about: { id: 'about', labelKey: 'nav_about' },
  skills: { id: 'skills', labelKey: 'nav_skills' },
  projects: { id: 'projects', labelKey: 'nav_projects' },
  awards: { id: 'awards', labelKey: 'nav_awards' },
  experience: { id: 'experience', labelKey: 'nav_experience' },
  gallery: { id: 'gallery', labelKey: 'nav_gallery' },
};

interface SideNavProps {
  siteEntered?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ siteEntered = true }) => {
  const { t } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeSection, setActiveSection] = useState('home');

  /**
   * TODO: [後端端點對接] 取得使用者模式浮動側邊導覽 (SideNav) 模組順序
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/modules-order
   * 3. 請求參數: 無
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: string[] }
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，採用官方標準順序，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const moduleOrder = ['home', 'about', 'skills', 'projects', 'awards', 'experience', 'gallery'];

  const sections = moduleOrder.map((id) => BASE_SECTIONS[id]).filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sections]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 116;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={`fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none transition-opacity duration-700 ease-out ${
        siteEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="navigation"
      aria-label="快速導覽 Quick Nav"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleNavClick(e, section.id)}
            aria-label={t(section.labelKey)}
            className="group relative flex items-center justify-end gap-2.5 cursor-pointer py-1"
          >
            {/* 提示文字標籤 */}
            <span
              className={`px-3 py-1 border cyber-cut-sm font-tech text-xs font-bold uppercase transition-all duration-200 backdrop-blur-md ${
                isActive
                  ? 'opacity-100 shadow-md'
                  : 'opacity-0 group-hover:opacity-100 shadow-sm'
              }`}
              style={{
                backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
                borderColor: isActive ? (isLight ? '#0369a1' : '#00f0ff') : (isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'),
                color: isActive ? (isLight ? '#0369a1' : '#00f0ff') : (isLight ? '#334155' : '#cbd5e1'),
                boxShadow: isActive
                  ? (isLight ? '0 2px 10px rgba(2, 132, 199, 0.18)' : '0 0 10px rgba(0, 240, 255, 0.25)')
                  : (isLight ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none'),
              }}
            >
              {t(section.labelKey)}
            </span>

            {/* 指示圓點 */}
            <div
              className={`w-2.5 h-2.5 cyber-cut-sm border transition-all duration-300 ${
                isActive
                  ? 'scale-125'
                  : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'
              }`}
              style={{
                backgroundColor: isActive ? (isLight ? '#0369a1' : '#00f0ff') : (isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.3)'),
                borderColor: isActive ? (isLight ? '#0369a1' : '#00f0ff') : (isLight ? '#64748b' : 'rgba(255, 255, 255, 0.5)'),
                boxShadow: isActive
                  ? (isLight ? '0 0 8px rgba(2, 132, 199, 0.5)' : '0 0 8px #00f0ff')
                  : 'none',
              }}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SideNav;
