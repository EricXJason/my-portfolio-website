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

interface SideNavProps {
  siteEntered?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ siteEntered = true }) => {
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

  return (
    <div
      className={`fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none transition-opacity duration-700 ease-out ${
        siteEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
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

            {/* Indicator Dot */}
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
