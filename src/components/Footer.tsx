/**
 * ============================================================================
 * 檔案名稱: Footer.tsx
 * 所屬模組: Presentation Layer (頁尾版權與技術棧標籤模組)
 * 責任描述: 負責呈現全站技術棧 SVG 標籤徽章、作者版權聲明、最後更新日期與管理後臺入口。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合滾動浮現 (Scroll Reveal) 與動態日期格式化。
 * 依賴關係: 依賴 LangContext、ThemeContext、TechIcon 與 useScrollReveal。
 * 邊界處理: 安全時區格式化防護、Router Link 狀態隔離。
 * ============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { TechIcon } from './icons/TechIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface TechBadge {
  name: string;
  iconName: string;
}

const techBadges: TechBadge[] = [
  { name: 'HTML',             iconName: 'html' },
  { name: 'CSS',              iconName: 'css' },
  { name: 'Tailwind CSS',     iconName: 'tailwind' },
  { name: 'TypeScript',       iconName: 'typescript' },
  { name: 'React',            iconName: 'react' },
  { name: 'Vite',             iconName: 'vite' },
  { name: 'GitHub Actions',   iconName: 'githubactions' },
  { name: 'Cloudflare Pages', iconName: 'cloudflare' },
  { name: 'Firebase',         iconName: 'firebase' },
];

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const footerRef = useScrollReveal(0.1) as React.RefObject<HTMLDivElement>;

  // 取得本地最新日期，例如 "2026-08-20"
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const displayDate = getLocalDate();
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.2)';

  return (
    <footer
      className="w-full relative z-10 border-t py-10 select-text transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#ffffff' : '#030712',
        borderColor: borderCol,
      }}
    >
      <div ref={footerRef} className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 space-y-6 text-center reveal-up">

        <div className="flex flex-wrap items-center justify-center gap-3 font-tech text-sm sm:text-base font-bold" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
          <span>
            © {displayDate} {lang === 'zh' ? '許哲誠 版權所有' : 'HSU, CHE-CHENG ALL RIGHTS RESERVED'}
          </span>
          <span style={{ color: isLight ? '#94a3b8' : 'rgba(0, 240, 255, 0.4)' }}>|</span>
          <Link
            to="/cms"
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 border cyber-cut-sm transition-all duration-200 cursor-pointer ${
              isLight
                ? 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-500 shadow-xs'
                : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/40 hover:bg-cyan-950/70 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)]'
            }`}
            title="CMS Console"
          >
            <span>[CMS]</span>
          </Link>
        </div>

        {/* 技術標籤徽章 (呈現品牌原生向量色彩) */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 lg:gap-3 max-w-7xl mx-auto pt-2">
          {techBadges.map((tech, idx) => (
            <div
              key={idx}
              className="px-2.5 sm:px-3 lg:px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold cyber-cut-sm flex items-center gap-2 shadow-xs transition-transform hover:scale-105 shrink-0 whitespace-nowrap"
              style={{
                backgroundColor: isLight ? '#f8fafc' : '#080e1a',
                borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)',
                color: isLight ? '#0f172a' : '#cbd5e1',
              }}
            >
              <TechIcon name={tech.iconName} size={16} className="shrink-0" />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
