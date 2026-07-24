import React, { useState, useEffect } from 'react';

// ScrollProgress Component: Top Page Reading Indicator Bar
export const ScrollProgress = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollWidth((winScroll / height) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 z-[60] transition-all duration-150"
      style={{ width: `${scrollWidth}%` }}
      role="progressbar"
      aria-valuenow={scrollWidth}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Reading Scroll Progress"
    />
  );
};
