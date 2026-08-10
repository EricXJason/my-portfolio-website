import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

interface SectionItem {
  id: string;
  labelKey: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'home', labelKey: 'nav_home' },
  { id: 'about', labelKey: 'nav_about' },
  { id: 'skills', labelKey: 'nav_skills' },
  { id: 'projects', labelKey: 'nav_projects' },
  { id: 'awards', labelKey: 'nav_awards' },
  { id: 'experience', labelKey: 'nav_experience' },
  { id: 'gallery', labelKey: 'nav_gallery' },
];

export const SideNav: React.FC = () => {
  const { t } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of SECTIONS) {
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
  }, []);

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

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';

  return (
    <div
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none"
      role="navigation"
      aria-label="快速導覽 Quick Nav"
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleNavClick(e, section.id)}
            aria-label={t(section.labelKey)}
            className="group relative flex items-center justify-end gap-2.5 cursor-pointer py-1"
          >
            {/* Tooltip Label */}
            <span
              className={`px-3 py-1 border cyber-cut-sm font-tech text-xs font-bold uppercase transition-all duration-200 shadow-md ${
                isActive
                  ? 'opacity-100 shadow-sm'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: isActive ? cyanCol : borderCol,
                color: isActive ? cyanCol : isLight ? '#334155' : '#cbd5e1',
              }}
            >
              {t(section.labelKey)}
            </span>

            {/* Tactical Marker Dot */}
            <div
              className={`transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 rotate-45 border shadow-md'
                  : 'w-2 h-2 rotate-45 rounded-none hover:scale-125'
              }`}
              style={{
                backgroundColor: isActive ? cyanCol : isLight ? '#cbd5e1' : '#475569',
                borderColor: isActive ? cyanCol : 'transparent',
              }}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SideNav;
