import React, { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';

// LangSelectModal — shown once per session on first visit
export const LangSelectModal = () => {
  const { setLangDirect } = useLang();
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
        backgroundColor: 'rgba(7,9,14,0.92)',
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
      {/* Modal Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl border p-8 shadow-2xl flex flex-col items-center gap-6"
        style={{
          backgroundColor: 'rgba(13,17,23,0.97)',
          borderColor: 'rgba(6,182,212,0.35)',
          boxShadow: '0 0 60px rgba(6,182,212,0.15), 0 25px 50px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo / Glyph */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-extrabold text-base"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: '#ffffff',
          }}
        >
          &lt;JP/&gt;
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
            JasonProduction
          </p>
          <h2 className="text-xl font-extrabold text-white">
            選擇語言 / Select Language
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            點擊空白處預設繁體中文 · Click backdrop for 繁中
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
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
            <span className="text-xl">🇹🇼</span>
            <span>繁體中文</span>
          </button>
          <button
            onClick={() => choose('en')}
            className="flex-1 h-14 rounded-2xl font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#f1f5f9',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = ''; }}
          >
            <span className="text-xl">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  );
};
