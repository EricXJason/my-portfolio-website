import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { TechIcon } from './icons/TechIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface TechBadge {
  name: string;
  iconName: string;
}

const techBadges: TechBadge[] = [
  { name: 'HTML5',          iconName: 'html' },
  { name: 'CSS3',           iconName: 'css' },
  { name: 'Tailwind CSS',   iconName: 'tailwind' },
  { name: 'TypeScript',     iconName: 'typescript' },
  { name: 'React',          iconName: 'react' },
  { name: 'Vite',           iconName: 'vite' },
  { name: 'GitHub Actions', iconName: 'githubactions' },
];

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const footerRef = useScrollReveal(0.1) as React.RefObject<HTMLDivElement>;

  // 取得本地最新日期與時區碼，例如 "2026-08-19 (UTC+8)"
  const getLocalDateWithTimezone = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    const sign = offsetHours >= 0 ? '+' : '';
    const tzStr = `UTC${sign}${offsetHours}`;

    return `${dateStr} (${tzStr})`;
  };

  const displayDate = getLocalDateWithTimezone();
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
        </div>

        {/* Tech Badges with Natural Brand SVG Colors */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto pt-2">
          {techBadges.map((tech, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold cyber-cut-sm flex items-center gap-2 shadow-xs transition-transform hover:scale-105"
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
