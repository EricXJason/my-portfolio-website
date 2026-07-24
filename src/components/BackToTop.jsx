import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

// BackToTop Floating Button Component - High Contrast Light Mode Adaptability
export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 dark:border-slate-700 light:border-slate-300 text-cyan-400 dark:text-cyan-400 light:text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group backdrop-blur-md"
      aria-label="Back to Top of Page"
      title="Back to Top"
    >
      <ChevronUp size={22} className="group-hover:-translate-y-1 transition-transform text-cyan-400 dark:text-cyan-400 light:text-slate-900 font-bold" />
    </button>
  );
};
