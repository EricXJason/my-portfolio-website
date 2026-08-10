import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const BackToTop: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
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
      className={`!fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] p-3 sm:p-3.5 cyber-cut-sm border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group backdrop-blur-md shadow-md flex items-center justify-center ${
        isVisible ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
      }`}
      style={{
        position: 'fixed',
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 14, 26, 0.85)',
        borderColor: isLight ? '#94a3b8' : 'rgba(0, 240, 255, 0.35)',
        color: isLight ? '#0284c7' : '#00f0ff',
        boxShadow: isLight
          ? '0 2px 10px rgba(0, 0, 0, 0.08)'
          : '0 4px 14px rgba(0, 0, 0, 0.6), 0 0 6px rgba(0, 240, 255, 0.15)',
      }}
      aria-label="一鍵往上 (Back to Top)"
      title="一鍵往上 (Back to Top)"
    >
      <ChevronUp size={22} className="group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
    </button>
  );
};

