import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
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
      className="fixed top-16 sm:top-20 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 z-40 transition-all duration-150 shadow-[0_2px_8px_rgba(0,240,255,0.5)] pointer-events-none"
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
