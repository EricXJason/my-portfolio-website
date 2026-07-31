import React, { useEffect, useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const LangSelectModal: React.FC = () => {
  const { setLangDirect } = useLang();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

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

  const choose = (l: Language) => {
    setLangDirect(l);
    setClosing(true);

    // Re-enable page scrolling immediately upon language selection
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6 py-4"
      style={{
        backgroundColor: 'rgba(7,9,14,0.85)',
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
        className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.96)',
          borderColor: isLight ? '#cbd5e1' : 'rgba(6,182,212,0.35)',
          boxShadow: isLight
            ? '0 20px 50px rgba(0,0,0,0.15)'
            : '0 0 50px rgba(6,182,212,0.2), 0 25px 50px rgba(0,0,0,0.7)',
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
                className="text-[10px] sm:text-[11px] font-code tracking-widest uppercase font-bold"
                style={{ color: isLight ? '#0369a1' : '#22d3ee' }}
              >
                許哲誠 HSU, CHE-CHENG
              </span>
            </div>
          </div>

          {/* Theme Switcher Toggle Slider (Defaulting to Dark mode style when in Dark mode) */}
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
        <div className="text-center">
          <h2
            className="text-lg sm:text-xl font-extrabold tracking-tight font-mono"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            選擇語言 / Select Language
          </h2>
        </div>

        {/* Low-Key Dark / Theme-adaptive Styled Buttons */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          <button
            onClick={() => choose('zh')}
            className="h-12 rounded-xl font-bold text-sm sm:text-base font-code transition-all cursor-pointer flex items-center justify-center gap-2 border-2 hover:border-cyan-500 shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#0f172a',
              borderColor: isLight ? '#cbd5e1' : '#334155',
              color: isLight ? '#0f172a' : '#ffffff',
            }}
          >
            <span>繁體中文</span>
          </button>

          <button
            onClick={() => choose('en')}
            className="h-12 rounded-xl font-bold text-sm sm:text-base font-code transition-all cursor-pointer flex items-center justify-center gap-2 border-2 hover:border-cyan-500 shadow-md hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#0f172a',
              borderColor: isLight ? '#cbd5e1' : '#334155',
              color: isLight ? '#0f172a' : '#ffffff',
            }}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};
