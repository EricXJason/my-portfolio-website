import React, { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Globe2 } from 'lucide-react';

export const LangSelectModal = () => {
  const { setLangDirect } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const hasChosen = sessionStorage.getItem('lang_chosen');
    if (!hasChosen) {
      setVisible(true);
    }
  }, []);

  const choose = (l) => {
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
        backgroundColor: 'rgba(7,9,14,0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}
      onClick={() => choose('zh')}
      role="dialog"
      aria-modal="true"
      aria-label="Select Language"
    >
      {/* Premium Glassmorphic Modal Card */}
      <div
        className="relative w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(15,23,42,0.96)',
          borderColor: isLight ? '#cbd5e1' : 'rgba(6,182,212,0.35)',
          boxShadow: '0 0 60px rgba(6,182,212,0.2), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Logo Matching Top-Left Navbar Header */}
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

        {/* Modal Header Text */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-code font-bold mb-1">
            <Globe2 size={13} />
            <span>LANGUAGE PREFERENCE</span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            選擇語言 / Select Language
          </h2>
          <p className="text-xs text-[var(--text-sub)] font-medium">
            點擊空白處預設繁體中文 · Click backdrop for 繁體中文
          </p>
        </div>

        {/* Action Buttons — Side-by-side 2-column grid on all screens */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {/* Traditional Chinese Button */}
          <button
            onClick={() => choose('zh')}
            className="flex-1 h-14 rounded-2xl font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(6,182,212,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,182,212,0.35)'; }}
          >
            <span>繁體中文</span>
          </button>

          {/* English Button */}
          <button
            onClick={() => choose('en')}
            className="flex-1 h-14 rounded-2xl font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border-2"
            style={{
              backgroundColor: isLight ? '#f8fafc' : 'rgba(255,255,255,0.05)',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
              color: isLight ? '#0f172a' : '#f1f5f9',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = ''; }}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};
