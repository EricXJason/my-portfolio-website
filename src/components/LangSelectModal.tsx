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
    const hasChosen = sessionStorage.getItem('lang_chosen');
    if (!hasChosen) {
      setVisible(true);
    }
  }, []);

  const choose = (l: Language) => {
    setLangDirect(l);
    sessionStorage.setItem('lang_chosen', '1');
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: isLight ? 'rgba(241,245,249,0.75)' : 'rgba(7,9,14,0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}
      onClick={() => choose('zh')}
      role="dialog"
      aria-modal="true"
      aria-label="Select Language"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(15,23,42,0.96)',
          borderColor: isLight ? '#cbd5e1' : 'rgba(6,182,212,0.35)',
          boxShadow: '0 0 60px rgba(6,182,212,0.2), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Logo and Theme Switcher */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-md">
              <div
                className="w-full h-full rounded-[14px] flex items-center justify-center font-mono font-extrabold text-sm"
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
                className="text-base font-extrabold tracking-wide font-mono"
                style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
              >
                JasonProduction
              </span>
              <span
                className="text-[11px] font-code tracking-widest uppercase font-bold"
                style={{ color: isLight ? '#0369a1' : '#22d3ee' }}
              >
                許哲誠 HSU, CHE-CHENG
              </span>
            </div>
          </div>

          {/* Theme Toggle Button inside Modal */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shadow-xs hover:scale-105"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
              color: isLight ? '#0369a1' : '#f59e0b',
            }}
            title={isLight ? '切換暗色主題 / Switch Dark' : '切換亮色主題 / Switch Light'}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Clean Header Title without redundant text */}
        <div className="text-center">
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            選擇語言 / Select Language
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3.5 w-full">
          <button
            onClick={() => choose('zh')}
            className="flex-1 h-14 rounded-2xl font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(6,182,212,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,182,212,0.35)'; }}
          >
            <span>繁體中文</span>
          </button>

          <button
            onClick={() => choose('en')}
            className="flex-1 h-14 rounded-2xl font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border-2"
            style={{
              backgroundColor: isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
              color: isLight ? '#0f172a' : '#f1f5f9',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = ''; }}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};

