import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

export const Navbar = ({ soundPlaying, onToggleSound, soundVolume, onChangeVolume }) => {
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  const isLight = theme === 'light';

  const navItems = [
    { key: 'nav_home', href: '#home' },
    { key: 'nav_about', href: '#about' },
    { key: 'nav_skills', href: '#skills' },
    { key: 'nav_projects', href: '#projects' },
    { key: 'nav_awards', href: '#awards' },
    { key: 'nav_experience', href: '#experience' },
    { key: 'nav_gallery', href: '#gallery' },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(7,9,14,0.88)',
        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
        boxShadow: isLight ? '0 2px 20px rgba(15,23,42,0.07)' : '0 2px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group shrink-0" aria-label="JasonProduction Home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] group-hover:scale-105 transition-transform">
            <div
              className="w-full h-full rounded-[10px] flex items-center justify-center font-mono font-extrabold text-xs"
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
              className="text-sm font-extrabold tracking-wide font-mono group-hover:text-cyan-500 transition-colors"
              style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
            >
              JasonProduction
            </span>
            <span
              className="text-[10px] font-code tracking-widest uppercase font-bold"
              style={{ color: isLight ? '#0369a1' : '#22d3ee' }}
            >
              許哲誠 HSU, CHE-CHENG
            </span>
          </div>
        </a>

        {/* Desktop Nav Pill */}
        <nav
          className="hidden lg:flex items-center gap-0.5 p-1.5 rounded-full border"
          style={{
            backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.5)',
            borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
              style={{ color: isLight ? '#475569' : '#94a3b8' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isLight ? '#eff6ff' : 'rgba(30,41,59,0.9)';
                e.currentTarget.style.color = isLight ? '#1d4ed8' : '#f8fafc';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = isLight ? '#475569' : '#94a3b8';
              }}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Sound Button + Volume Slider Popup */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumePopup(true)}
            onMouseLeave={() => setShowVolumePopup(false)}
          >
            <button
              onClick={onToggleSound}
              className="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center"
              style={soundPlaying
                ? {
                    backgroundColor: isLight ? '#ecfeff' : 'rgba(6,182,212,0.12)',
                    borderColor: '#06b6d4',
                    color: isLight ? '#0891b2' : '#22d3ee',
                  }
                : {
                    backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)',
                    borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                    color: isLight ? '#64748b' : '#64748b',
                  }
              }
              aria-label={soundPlaying ? 'Mute BGM' : 'Play BGM'}
              title={soundPlaying ? 'Mute BGM' : 'Play BGM'}
            >
              {soundPlaying
                ? <Volume2 size={18} className="animate-pulse" />
                : <VolumeX size={18} />
              }
            </button>

            {/* Volume Popup */}
            {showVolumePopup && (
              <div className="absolute top-full right-0 pt-2.5 z-50">
                <div
                  className="p-3 rounded-xl border shadow-xl flex items-center gap-3"
                  style={{
                    width: '160px',
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: isLight ? '#e2e8f0' : '#1e293b',
                  }}
                >
                  <span
                    className="text-[10px] font-code font-bold uppercase shrink-0 select-none"
                    style={{ color: isLight ? '#64748b' : '#475569' }}
                  >
                    VOL
                  </span>
                  <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={soundVolume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                    style={{ height: '4px' }}
                    aria-label="BGM Volume"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Theme Toggle Switch ── */}
          <button
            onClick={toggleTheme}
            className="w-14 h-8 rounded-full border p-1 relative flex items-center transition-all cursor-pointer shadow-inner"
            style={{
              backgroundColor: isLight ? '#e0f2fe' : '#0f172a',
              borderColor: isLight ? '#bae6fd' : '#334155',
            }}
            aria-label="Toggle Theme"
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {/* Background Icons */}
            <div className="absolute inset-0 px-1.5 flex items-center justify-between pointer-events-none text-xs">
              <Sun size={13} className="text-amber-500" />
              <Moon size={13} className="text-indigo-400" />
            </div>

            {/* Sliding Knob */}
            <div
              className="w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 z-10"
              style={{
                transform: isLight ? 'translateX(0px)' : 'translateX(24px)',
                backgroundColor: isLight ? '#ffffff' : '#1e293b',
                color: isLight ? '#f59e0b' : '#818cf8',
              }}
            >
              {isLight ? <Sun size={13} /> : <Moon size={13} />}
            </div>
          </button>

          {/* ── Language Toggle Switch ── */}
          <button
            onClick={toggleLang}
            className="w-16 h-8 rounded-full border p-1 relative flex items-center justify-between transition-all cursor-pointer font-code text-xs font-bold"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#0f172a',
              borderColor: isLight ? '#cbd5e1' : '#334155',
            }}
            aria-label="Switch Language"
            title="Switch Language"
          >
            {/* Background Track Labels */}
            <span className="z-0 px-1.5" style={{ color: lang === 'en' ? 'transparent' : isLight ? '#64748b' : '#94a3b8' }}>
              EN
            </span>
            <span className="z-0 px-1.5" style={{ color: lang === 'zh' ? 'transparent' : isLight ? '#64748b' : '#94a3b8' }}>
              中
            </span>

            {/* Sliding Active Knob */}
            <div
              className="absolute top-1 left-1 w-7 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 z-10"
              style={{
                transform: lang === 'zh' ? 'translateX(28px)' : 'translateX(0px)',
                backgroundColor: '#06b6d4',
                color: '#ffffff',
              }}
            >
              {lang === 'en' ? 'EN' : '中'}
            </div>
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl border transition-all cursor-pointer"
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
              color: isLight ? '#0f172a' : '#f8fafc',
            }}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-6 py-6 space-y-1"
          style={{
            backgroundColor: isLight ? '#ffffff' : '#07090e',
            borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 rounded-xl text-base font-semibold transition-all"
              style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = isLight ? '#eff6ff' : 'rgba(30,41,59,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {t(item.key)}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
