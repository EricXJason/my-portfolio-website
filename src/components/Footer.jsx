import React from 'react';
import { useLang } from '../context/LangContext';
import { Workflow } from 'lucide-react';

// Official Tech Icons — matching Skills section exactly
const TechIcons = {
  html: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#E34F26' }} viewBox="0 0 24 24">
      <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.186-2.091H6.182l.344 4.184 5.474 1.523 5.464-1.523.748-8.243H8.531z"/>
    </svg>
  ),
  css: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#1572B6' }} viewBox="0 0 24 24">
      <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.186-2.091H6.182l.344 4.184 5.474 1.523 5.464-1.523.748-8.243H8.531z"/>
    </svg>
  ),
  scss: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#CC6699' }} viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.176 16.544c-1.378 1.3-3.69 1.76-5.834 1.345-2.66-.516-4.52-2.673-4.52-5.385 0-3.037 2.37-5.5 5.5-5.5 2.14 0 4.02 1.25 4.88 3.12l-2.02.82c-.44-.96-1.47-1.6-2.66-1.6-1.74 0-3.14 1.4-3.14 3.14 0 1.52 1.04 2.76 2.5 3.06 1.3.26 2.78-.02 3.62-.82l1.674 1.82z"/>
    </svg>
  ),
  tailwind: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#06B6D4' }} viewBox="0 0 24 24">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  javascript: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#F7DF1E' }} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-.828-.153-.153-.213-.358-.213-.559 0-.649.48-.999 1.258-.999.736 0 1.24.255 1.588.857l1.384-.808c-.658-1.29-1.89-1.922-3.359-1.922-1.996 0-3.327 1.139-3.327 2.766 0 1.218.665 2.128 2.37 2.828.915.375 1.485.645 1.68.915.225.315.225.69.045 1.05-.285.54-.99.795-1.815.795-.99 0-1.605-.405-2.04-1.23l-1.395.84c.75 1.455 2.13 2.175 3.825 2.175 2.445 0 3.75-1.245 3.75-3.015z"/>
    </svg>
  ),
  react: (
    <svg className="w-4 h-4 shrink-0 fill-none animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="1.2">
        <ellipse cx="12" cy="12" rx="9" ry="3.5"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/>
      </g>
    </svg>
  ),
  vite: (
    <svg className="w-4 h-4 shrink-0 fill-current" style={{ color: '#646CFF' }} viewBox="0 0 24 24">
      <path d="M22.632 3.633L12.753 22.37a.89.89 0 01-1.564 0L1.368 3.633a.89.89 0 01.81-1.317h19.645a.89.89 0 01.809 1.317z"/>
    </svg>
  ),
  githubActions: (
    <Workflow className="w-4 h-4 shrink-0" style={{ color: '#2088FF' }} />
  ),
};

const techBadges = [
  { name: 'HTML5',          icon: TechIcons.html },
  { name: 'CSS3',           icon: TechIcons.css },
  { name: 'SCSS',           icon: TechIcons.scss },
  { name: 'Tailwind CSS',   icon: TechIcons.tailwind },
  { name: 'JavaScript',     icon: TechIcons.javascript },
  { name: 'React',          icon: TechIcons.react },
  { name: 'Vite',           icon: TechIcons.vite },
  { name: 'GitHub Actions', icon: TechIcons.githubActions },
];

export const Footer = ({ lastUpdated }) => {
  const { lang } = useLang();

  return (
    <footer className="w-full relative z-20 border-t border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-2xl py-10 transition-colors duration-300 select-text">

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">

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
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto pt-2">
          {techBadges.map((tech, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs font-code font-bold text-[var(--text-main)] shadow-xs hover:border-cyan-400 transition-colors"
              style={{}}
            >
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
};
