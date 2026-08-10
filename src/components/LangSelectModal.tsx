import React, { useEffect, useState, useCallback } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe2 } from 'lucide-react';

interface LangSelectModalProps {
  isOpen?: boolean;
  onSelectLanguage?: () => void;
}

export const LangSelectModal: React.FC<LangSelectModalProps> = ({
  isOpen = true,
  onSelectLanguage,
}) => {
  const { lang, setLangDirect } = useLang();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [closing, setClosing] = useState(false);

  const choose = useCallback((l: Language) => {
    setLangDirect(l);
    setClosing(true);

    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (onSelectLanguage) {
        onSelectLanguage();
      }
    }, 350);
  }, [setLangDirect, onSelectLanguage]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || closing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        choose('zh');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, closing, choose]);

  if (!isOpen) return null;

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)';
  const bracketCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-6 sm:p-8 select-none"
      style={{
        backgroundColor: isLight ? 'rgba(15,23,42,0.85)' : 'rgba(3,7,18,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}
      onClick={() => choose('zh')}
      role="dialog"
      aria-modal="true"
      aria-label="選擇語言 / Select Language"
    >
      <div
        className="relative w-full max-w-[calc(100%-2rem)] sm:max-w-md border cyber-cut-corner p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6 hud-corner-brackets"
        style={{
          backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.98)',
          borderColor: borderCol,
          '--hud-bracket-color': bracketCol,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 border p-[2px] cyber-cut-sm flex items-center justify-center shadow-md shrink-0"
              style={{
                borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.4)',
                backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              }}
            >
              <div className="font-hud font-black text-xs" style={{ color: cyanCol }}>
                &lt;JP/&gt;
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wide truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                JasonProduction
              </span>
              <span className="font-tech text-xs sm:text-sm font-bold tracking-wider truncate" style={{ color: cyanCol }}>
                許哲誠 HSU, CHE-CHENG
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="w-13 sm:w-16 h-8 sm:h-9 cyber-cut-sm border p-0.5 sm:p-1 relative flex items-center transition-all cursor-pointer active:scale-95 shrink-0 hover:border-cyan-400"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              borderColor: borderCol,
            }}
            aria-label={isLight ? (lang === 'zh' ? '目前模式：淺色模式' : 'Current Mode: Light Mode') : (lang === 'zh' ? '目前模式：深色模式' : 'Current Mode: Dark Mode')}
            title={isLight ? (lang === 'zh' ? '淺色模式' : 'Light Mode') : (lang === 'zh' ? '深色模式' : 'Dark Mode')}
          >
            <div className="absolute inset-0 px-2 flex items-center justify-between pointer-events-none text-xs">
              <Sun size={13} className="text-amber-400 font-bold opacity-100 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
              <Moon size={13} className="text-cyan-400 font-bold opacity-100 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
            </div>
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-none flex items-center justify-center transition-all duration-300 z-10 text-xs shadow-md"
              style={{
                transform: isLight ? 'translateX(0px)' : (window.innerWidth < 640 ? 'translateX(20px)' : 'translateX(28px)'),
                background: isLight ? '#fbbf24' : '#00f0ff',
                color: '#0f172a',
              }}
            >
              {isLight ? <Sun size={14} className="fill-current text-slate-900" /> : <Moon size={14} className="fill-current text-slate-900" />}
            </div>
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            <Globe2 size={18} className="shrink-0" style={{ color: cyanCol }} />
            <h2 className="text-base sm:text-lg font-bold font-hud uppercase tracking-wider whitespace-nowrap" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              語言 LANGUAGE
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 w-full">
          <button
            onClick={() => choose('zh')}
            className="h-12 px-6 sm:px-8 border cyber-cut-corner font-bold text-sm font-tech transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
            style={{
              backgroundColor: isLight ? '#f0f9ff' : 'rgba(0, 240, 255, 0.15)',
              borderColor: isLight ? '#38bdf8' : '#00f0ff',
              color: isLight ? '#0369a1' : '#00f0ff',
            }}
          >
            <span>繁體中文</span>
          </button>

          <button
            onClick={() => choose('en')}
            className="h-12 px-6 sm:px-8 border cyber-cut-corner font-bold text-sm font-tech transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
            style={{
              backgroundColor: isLight ? '#faf5ff' : 'rgba(168, 85, 247, 0.15)',
              borderColor: isLight ? '#c084fc' : '#a855f7',
              color: isLight ? '#7e22ce' : '#c084fc',
            }}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LangSelectModal;
