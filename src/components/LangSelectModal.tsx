import React, { useEffect, useState, useCallback } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe2 } from 'lucide-react';

export const LangSelectModal: React.FC = () => {
  const { setLangDirect } = useLang();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const choose = useCallback((l: Language) => {
    setLangDirect(l);
    setClosing(true);

    // Re-enable page scrolling immediately upon language selection
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    setTimeout(() => setVisible(false), 350);
  }, [setLangDirect]);

  useEffect(() => {
    // Always show modal on page refresh / initial load
    setVisible(true);

    // Disable background page scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      // Re-enable scrolling on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!visible || closing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        choose('zh');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [visible, closing, choose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6 py-4"
      style={{
        backgroundColor: isLight ? 'rgba(15,23,42,0.65)' : 'rgba(7,9,14,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}
      onClick={() => choose('zh')}
      role="dialog"
      aria-modal="true"
      aria-label="Select Language"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.96)',
          borderColor: isLight ? '#e2e8f0' : 'rgba(6, 182, 212, 0.35)',
          boxShadow: isLight
            ? '0 20px 50px rgba(15, 23, 42, 0.15)'
            : '0 0 50px rgba(6, 182, 212, 0.2), 0 25px 50px rgba(0, 0, 0, 0.75)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Logo and Theme Switcher */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-md">
              <div
                className="w-full h-full rounded-[10px] sm:rounded-[14px] flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#030712',
                  color: isLight ? '#0369a1' : '#22d3ee',
                }}
              >
                &lt;JP/&gt;
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span
                className="text-sm sm:text-base font-extrabold tracking-wide font-mono"
                style={{ color: isLight ? '#0f172a' : '#ffffff' }}
              >
                JasonProduction
              </span>
              <span
                className="text-xs sm:text-sm font-code tracking-widest uppercase font-bold"
                style={{ color: isLight ? '#0369a1' : '#22d3ee' }}
              >
                許哲誠 HSU, CHE-CHENG
              </span>
            </div>
          </div>

          {/* Theme Switcher Toggle Slider */}
          <button
            onClick={toggleTheme}
            className="w-14 h-8 rounded-full border p-1 relative flex items-center transition-all cursor-pointer shadow-inner active:scale-95 hover:border-cyan-400 shrink-0"
            style={{
              backgroundColor: isLight ? '#e0f2fe' : '#0f172a',
              borderColor: isLight ? '#bae6fd' : '#334155',
            }}
            aria-label="Toggle Theme"
            title={isLight ? '切換暗色主題 / Switch Dark' : '切換亮色主題 / Switch Light'}
          >
            <div className="absolute inset-0 px-1.5 flex items-center justify-between pointer-events-none text-xs">
              <Sun size={13} className="text-amber-500" />
              <Moon size={13} className="text-cyan-400" />
            </div>
            <div
              className="w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 z-10"
              style={{
                transform: isLight ? 'translateX(0px)' : 'translateX(24px)',
                backgroundColor: isLight ? '#ffffff' : '#090d16',
                borderColor: isLight ? '#cbd5e1' : '#06b6d4',
                color: isLight ? '#f59e0b' : '#22d3ee',
              }}
            >
              {isLight ? <Sun size={12} /> : <Moon size={12} />}
            </div>
          </button>
        </div>

        {/* Clean Header Title */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2" style={{ color: isLight ? '#0284c7' : '#22d3ee' }}>
            <Globe2 size={18} />
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight font-mono">
              選擇語言 / Select Language
            </h2>
          </div>
        </div>

        {/* Dedicated Independent Color Buttons for Dark & Light Modes — Horizontal 2-Column Grid on Mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {/* Traditional Chinese Button */}
          <button
            onClick={() => choose('zh')}
            className="h-13 rounded-2xl font-bold text-sm sm:text-base font-code transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border-2 shadow-md hover:scale-[1.03] active:scale-[0.97]"
            style={{
              backgroundColor: isLight ? '#f0f9ff' : 'rgba(14, 116, 144, 0.15)',
              borderColor: isLight ? '#7dd3fc' : 'rgba(6, 182, 212, 0.45)',
              color: isLight ? '#0369a1' : '#38bdf8',
            }}
            onMouseEnter={(e) => {
              if (isLight) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(2, 132, 199, 0.35)';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.28)';
                e.currentTarget.style.borderColor = '#22d3ee';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLight ? '#f0f9ff' : 'rgba(14, 116, 144, 0.15)';
              e.currentTarget.style.borderColor = isLight ? '#7dd3fc' : 'rgba(6, 182, 212, 0.45)';
              e.currentTarget.style.color = isLight ? '#0369a1' : '#38bdf8';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <span>繁體中文</span>
          </button>

          {/* English Button */}
          <button
            onClick={() => choose('en')}
            className="h-13 rounded-2xl font-bold text-sm sm:text-base font-code transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border-2 shadow-md hover:scale-[1.03] active:scale-[0.97]"
            style={{
              backgroundColor: isLight ? '#faf5ff' : 'rgba(126, 34, 206, 0.15)',
              borderColor: isLight ? '#e9d5ff' : 'rgba(168, 85, 247, 0.45)',
              color: isLight ? '#7e22ce' : '#c084fc',
            }}
            onMouseEnter={(e) => {
              if (isLight) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.35)';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.28)';
                e.currentTarget.style.borderColor = '#c084fc';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLight ? '#faf5ff' : 'rgba(126, 34, 206, 0.15)';
              e.currentTarget.style.borderColor = isLight ? '#e9d5ff' : 'rgba(168, 85, 247, 0.45)';
              e.currentTarget.style.color = isLight ? '#7e22ce' : '#c084fc';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};
