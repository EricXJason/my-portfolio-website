import React from 'react';
import { useLang } from '../context/LangContext';
import { getAssetUrl } from '../utils/assetPath';

interface TechBadge {
  name: string;
  icon?: string;
  svg?: React.ReactNode;
}

const HtmlIcon: React.FC = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 124 141.532" fill="none">
    <path d="M10.383 126.894L0 0l124 .255-10.979 126.639-50.553 14.638z" fill="#e34f26"/>
    <path d="M62.468 129.277V12.085l51.064.17-9.106 104.851z" fill="#ef652a"/>
    <path d="M99.49 41.362l1.446-15.49H22.383l4.34 47.49h54.213L78.81 93.617l-17.362 4.68-17.617-5.106-.936-12.085H27.319l2.128 24.681 32 8.936 32.255-8.936 4.34-48.17H41.107L39.49 41.362z" fill="#fff"/>
  </svg>
);

const CssIcon: React.FC = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 124 141.53" fill="none">
    <path d="M10.383 126.892L0 0l124 .255-10.979 126.637-50.553 14.638z" fill="#1b73ba"/>
    <path d="M62.468 129.275V12.085l51.064.17-9.106 104.85z" fill="#1c88c7"/>
    <path d="M100.851 27.064H22.298l2.128 15.318h37.276l-36.68 15.745 2.127 14.808h54.043l-1.958 20.68-18.298 3.575-16.595-4.255-1.277-11.745H27.83l2.042 24.426 32.681 9.106 31.32-9.957 4-47.745H64.765l36.085-14.978z" fill="#fff"/>
  </svg>
);

const techBadges: TechBadge[] = [
  { name: 'HTML',           svg: <HtmlIcon /> },
  { name: 'CSS',            svg: <CssIcon /> },
  { name: 'Tailwind CSS',   icon: getAssetUrl('/assets/logos/tailwind.avif') },
  { name: 'TypeScript',     icon: getAssetUrl('/assets/logos/typescript.avif') },
  { name: 'React',          icon: getAssetUrl('/assets/logos/react.avif') },
  { name: 'Vite',           icon: getAssetUrl('/assets/logos/vite.avif') },
  { name: 'GitHub Actions (CI/CD)', icon: getAssetUrl('/assets/logos/github-actions.avif') },
];

interface FooterProps {
  lastUpdated?: string;
}

export const Footer: React.FC<FooterProps> = ({ lastUpdated }) => {
  const { lang } = useLang();
  const displayDate = lastUpdated || new Date().toISOString().split('T')[0];

  return (
    <footer className="w-full relative z-10 border-t border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-2xl py-10 transition-colors duration-300 select-text">

      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" aria-hidden="true" />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base font-semibold text-[var(--text-main)]">
          <span className="text-xl sm:text-2xl font-bold font-mono text-sky-700 dark:text-cyan-400 leading-none">©</span>
          <span className="text-[var(--text-main)] font-bold">
            {lang === 'zh' ? '許哲誠 版權所有' : 'HSU, CHE-CHENG All Rights Reserved'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700/70 text-slate-300 light:bg-slate-100 light:border-slate-200 light:text-slate-600 font-code text-xs font-bold">
            {displayDate}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto pt-2">
          {techBadges.map((tech, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 flex items-center gap-2 text-xs font-code font-bold text-[var(--text-main)] shadow-xs hover:border-cyan-400 transition-colors"
            >
              {tech.svg ? (
                tech.svg
              ) : (
                <img
                  src={tech.icon}
                  alt={`${tech.name} logo`}
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
};
