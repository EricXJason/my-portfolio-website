import React from 'react';
import { useLang } from '../context/LangContext';
import { getAssetUrl } from '../utils/assetPath';

const techBadges = [
  { name: 'HTML5',          icon: getAssetUrl('/assets/logos/html5.png') },
  { name: 'CSS3',           icon: getAssetUrl('/assets/logos/css3.png') },
  { name: 'SCSS',           icon: getAssetUrl('/assets/logos/scss.png') },
  { name: 'Tailwind CSS',   icon: getAssetUrl('/assets/logos/tailwind.png') },
  { name: 'JavaScript',     icon: getAssetUrl('/assets/logos/javascript.png') },
  { name: 'React',          icon: getAssetUrl('/assets/logos/react.png') },
  { name: 'Vite',           icon: getAssetUrl('/assets/logos/vite.png') },
  { name: 'GitHub Actions', icon: getAssetUrl('/assets/logos/github-actions.png') },
];

export const Footer = ({ lastUpdated }) => {
  const { lang } = useLang();

  return (
    <footer className="w-full relative z-10 border-t border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-2xl py-10 transition-colors duration-300 select-text">

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" aria-hidden="true" />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">

        {/* Copyright Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base font-semibold text-[var(--text-main)]">
          <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 leading-none">©</span>
          <span className="text-[var(--text-main)] font-bold">
            {lang === 'zh' ? '許哲誠 版權所有' : 'HSU, CHE-CHENG All Rights Reserved'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-code text-xs font-bold">
            {lastUpdated}
          </span>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto pt-2">
          {techBadges.map((tech, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 flex items-center gap-2 text-xs font-code font-bold text-[var(--text-main)] shadow-xs hover:border-cyan-400 transition-colors"
            >
              <img
                src={tech.icon}
                alt={`${tech.name} logo`}
                className="w-4 h-4 object-contain shrink-0"
                loading="lazy"
                decoding="async"
              />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
};
