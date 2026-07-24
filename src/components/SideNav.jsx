import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';

// SideNav Component: Floating Right-Side Section Position Indicator Dots (Dev-Focused Sequence)
export const SideNav = () => {
  const { t } = useLang();
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home', labelKey: 'nav_home' },
    { id: 'about', labelKey: 'nav_about' },
    { id: 'skills', labelKey: 'nav_skills' },
    { id: 'projects', labelKey: 'nav_projects' },
    { id: 'awards', labelKey: 'nav_awards' },
    { id: 'experience', labelKey: 'nav_experience' },
    { id: 'gallery', labelKey: 'nav_gallery' },
  ];

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 select-none"
      role="navigation"
      aria-label="Section Position Indicator"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={t(section.labelKey)}
            className="group relative flex items-center justify-center py-1 cursor-pointer"
          >
            {/* Tooltip Label on Hover */}
            <span className="absolute right-7 px-2.5 py-1 rounded-md bg-slate-900 dark:bg-slate-900 light:bg-white text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-code text-[11px] font-bold border border-slate-700 dark:border-slate-700 light:border-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg">
              {t(section.labelKey)}
            </span>

            {/* Dot Indicator */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-3.5 h-3.5 bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125'
                  : 'w-2 h-2 bg-slate-600 dark:bg-slate-600 light:bg-slate-400 hover:bg-cyan-300 hover:scale-110'
              }`}
            />
          </a>
        );
      })}
    </div>
  );
};
