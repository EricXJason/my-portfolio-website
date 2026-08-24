import React, { useState, useEffect } from 'react';

interface ScrollProgressProps {
  siteEntered?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ siteEntered = true }) => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollWidth((winScroll / height) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Top Horizontal Reading Progress Line — Positioned strictly below Navbar (top-16 sm:top-20) */
    <div
      className={`fixed top-16 sm:top-20 left-0 h-[2px] bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 z-40 transition-opacity duration-700 shadow-sm pointer-events-none ${
        siteEntered ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        width: `${scrollWidth}%`,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
      role="progressbar"
      aria-valuenow={Math.round(scrollWidth)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading Scroll Progress"
    />
  );
};
