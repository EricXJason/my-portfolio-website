import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Volume2, VolumeX, Sun, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  soundPlaying: boolean;
  onToggleSound: () => void;
  soundVolume: number;
  onChangeVolume: (val: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundPlaying,
  onToggleSound,
  soundVolume,
  onChangeVolume,
}) => {
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpOpen, setMobileExpOpen] = useState(false);
  const [desktopExpHover, setDesktopExpHover] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const volumeRef = useRef<HTMLDivElement | null>(null);

  const isLight = theme === 'light';

  // Close volume popup when clicking outside
  useEffect(() => {
    if (!showVolumePopup) return;
    const handler = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolumePopup(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showVolumePopup]);

  // Reset mobile sub-accordion when mobile menu is closed
  useEffect(() => {
    if (!mobileOpen) {
      setMobileExpOpen(false);
    }
  }, [mobileOpen]);

  // Handle window resize & orientation change to prevent menu state mismatch
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Smooth scroll handler with precise header offset calculation
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 116;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      if (window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    }
  };

  const expSubItems = [
    { key: 'nav_sub_degrees', href: '#education-degrees' },
    { key: 'nav_sub_work', href: '#work-experience' },
    { key: 'nav_sub_workshops', href: '#workshops' },
    { key: 'nav_sub_publications', href: '#publications' },
  ];

  const mainNavItems = [
    { key: 'nav_home', href: '#home' },
    { key: 'nav_about', href: '#about' },
    { key: 'nav_skills', href: '#skills' },
    { key: 'nav_projects', href: '#projects' },
    { key: 'nav_awards', href: '#awards' },
    { key: 'nav_experience', href: '#experience', isDropdown: true },
    { key: 'nav_gallery', href: '#gallery' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300"
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.97)' : 'rgba(7,9,14,0.88)',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
          boxShadow: isLight ? '0 2px 20px rgba(15,23,42,0.07)' : '0 2px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => {
              scrollToSection(e, '#home');
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 group shrink-0"
            aria-label="<JP/> JasonProduction 首頁 Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] group-hover:scale-105 active:scale-95 transition-transform">
              <div
                className="w-full h-full rounded-[10px] flex items-center justify-center font-mono font-extrabold text-xs"
                style={{ backgroundColor: isLight ? '#ffffff' : '#030712', color: isLight ? '#0369a1' : '#22d3ee' }}
              >
                &lt;JP/&gt;
              </div>
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span
                className="text-sm font-extrabold tracking-wide font-mono group-hover:text-cyan-500 transition-colors"
                style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
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
          </a>

          {/* Desktop Nav Pill */}
          <nav
            className="hidden lg:flex items-center gap-0.5 p-1.5 rounded-full border"
            style={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.5)',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
            }}
          >
            {mainNavItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={item.key}
                    className="relative group/exp"
                    onMouseEnter={() => setDesktopExpHover(true)}
                    onMouseLeave={() => setDesktopExpHover(false)}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer"
                      style={{
                        backgroundColor: desktopExpHover ? (isLight ? '#eff6ff' : 'rgba(30,41,59,0.9)') : 'transparent',
                        color: desktopExpHover ? (isLight ? '#1d4ed8' : '#f8fafc') : (isLight ? '#475569' : '#94a3b8'),
                      }}
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${desktopExpHover ? 'rotate-180 text-cyan-400' : ''}`}
                      />
                    </a>

                    {/* Desktop Submenu Dropdown Panel */}
                    {desktopExpHover && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                        <div
                          className="w-48 py-2 rounded-2xl border shadow-2xl space-y-0.5 overflow-hidden backdrop-blur-2xl"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#0f172a',
                            borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                          }}
                        >
                          {expSubItems.map((sub) => (
                            <a
                              key={sub.key}
                              href={sub.href}
                              onClick={(e) => {
                                scrollToSection(e, sub.href);
                                setDesktopExpHover(false);
                              }}
                              className="block px-4 py-2.5 text-xs font-bold font-code transition-all hover:pl-6"
                              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isLight ? '#f0f9ff' : 'rgba(6,182,212,0.15)';
                                e.currentTarget.style.color = isLight ? '#0284c7' : '#38bdf8';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = isLight ? '#334155' : '#cbd5e1';
                              }}
                            >
                              {t(sub.key)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={{ color: isLight ? '#475569' : '#94a3b8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isLight ? '#eff6ff' : 'rgba(30,41,59,0.9)';
                    e.currentTarget.style.color = isLight ? '#1d4ed8' : '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = isLight ? '#475569' : '#94a3b8';
                  }}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </nav>

          {/* Right Controls Container */}
          <div className="flex items-center gap-3">

            {/* 1. Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-14 h-8 rounded-full border p-1 relative flex items-center transition-all cursor-pointer active:scale-95 hover:border-cyan-400"
              style={{
                backgroundColor: isLight ? '#f0f9ff' : '#0f172a',
                borderColor: isLight ? '#bae6fd' : '#334155',
              }}
              aria-label="Toggle Theme"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <div className="absolute inset-0 px-1.5 flex items-center justify-between pointer-events-none text-xs">
                <Sun size={12} className={isLight ? "text-amber-400" : "text-amber-400/70"} />
                <Moon size={12} className={isLight ? "text-sky-500/60" : "text-cyan-400/60"} />
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 z-10"
                style={{
                  transform: isLight ? 'translateX(0px)' : 'translateX(24px)',
                  background: isLight
                    ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
                    : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  boxShadow: isLight
                    ? '0 2px 8px rgba(245, 158, 11, 0.5)'
                    : '0 2px 8px rgba(6, 182, 212, 0.5)',
                  color: '#ffffff',
                }}
              >
                {isLight ? <Sun size={13} /> : <Moon size={13} />}
              </div>
            </button>

            {/* 2. Language Toggle Slider */}
            <button
              onClick={toggleLang}
              className="w-16 h-8 rounded-full border p-1 relative flex items-center justify-between transition-all cursor-pointer font-code text-xs font-bold active:scale-95 hover:border-cyan-400 light:hover:border-sky-400"
              style={{
                backgroundColor: isLight ? '#f0f9ff' : '#0f172a',
                borderColor: isLight ? '#bae6fd' : '#334155',
              }}
              title="Switch Language"
            >
              <span className="z-0 px-1.5" style={{ color: lang === 'en' ? 'transparent' : isLight ? '#475569' : '#94a3b8' }}>EN</span>
              <span className="z-0 px-1.5" style={{ color: lang === 'zh' ? 'transparent' : isLight ? '#475569' : '#94a3b8' }}>中</span>
              <div
                className="absolute top-1 left-1 w-7 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 z-10"
                style={{
                  transform: lang === 'zh' ? 'translateX(28px)' : 'translateX(0px)',
                  background: isLight ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : '#06b6d4',
                  color: '#ffffff',
                }}
              >
                {lang === 'en' ? 'EN' : '中'}
              </div>
            </button>

            {/* 3. BGM Sound Button */}
            <div className="relative" ref={volumeRef}>
              <button
                onClick={() => {
                  onToggleSound();
                  if (!soundPlaying) setShowVolumePopup(true);
                  else setShowVolumePopup(false);
                }}
                onContextMenu={(e) => { e.preventDefault(); setShowVolumePopup((v) => !v); }}
                className="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:scale-105"
                style={soundPlaying
                  ? { backgroundColor: isLight ? '#ecfeff' : 'rgba(6,182,212,0.12)', borderColor: '#06b6d4', color: isLight ? '#0891b2' : '#22d3ee' }
                  : { backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)', borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)', color: '#64748b' }
                }
                aria-label={soundPlaying ? 'Mute Sound' : 'Play Sound'}
                title={soundPlaying ? 'Mute' : 'Play Sound'}
              >
                {soundPlaying
                  ? <Volume2 size={18} className="animate-pulse text-cyan-400" />
                  : <VolumeX size={18} />
                }
              </button>

              {/* Minimalist Volume Popup Panel */}
              {showVolumePopup && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <div
                    className="p-3.5 rounded-2xl border shadow-2xl space-y-2 flex flex-col items-center justify-center relative"
                    style={{
                      width: '170px',
                      backgroundColor: isLight ? '#ffffff' : '#0f172a',
                      borderColor: isLight ? '#e2e8f0' : '#1e293b',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div className="w-full flex items-center justify-between gap-1.5 px-0.5">
                      <div className="flex items-center gap-1.5">
                        <Volume2 size={13} className="text-cyan-400" />
                        <span className="text-xs font-code font-bold text-cyan-400">
                          {Math.round(soundVolume * 100)}%
                        </span>
                      </div>
                      <button
                        onClick={() => setShowVolumePopup(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        aria-label="Close Volume Panel"
                        title="Close"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={soundVolume}
                      onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                      style={{ height: '5px' }}
                      aria-label="Volume"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 hover:border-cyan-400"
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

        {/* Mobile Drawer with Hover / Active Interactivity */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t px-6 py-6 space-y-2 max-h-[85vh] overflow-y-auto"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#07090e',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)',
            }}
          >
            {mainNavItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.key} className="space-y-1">
                    <button
                      onClick={() => setMobileExpOpen(!mobileExpOpen)}
                      className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-base font-semibold transition-all cursor-pointer border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10 active:bg-cyan-500/20 active:scale-[0.99]"
                      style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${mobileExpOpen ? 'rotate-180 text-cyan-400' : ''}`}
                      />
                    </button>

                    {/* Mobile Accordion Submenu Panel */}
                    {mobileExpOpen && (
                      <div className="pl-4 space-y-1.5 border-l-2 border-cyan-500/30 ml-4 py-2">
                        {expSubItems.map((sub) => (
                          <a
                            key={sub.key}
                            href={sub.href}
                            onClick={(e) => {
                              scrollToSection(e, sub.href);
                              setMobileOpen(false);
                              setMobileExpOpen(false);
                            }}
                            className="block py-2.5 px-3 rounded-lg text-sm font-semibold font-code transition-all hover:bg-cyan-500/15 hover:text-cyan-400 active:bg-cyan-500/25 active:scale-95"
                            style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                          >
                            {t(sub.key)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href);
                    setMobileOpen(false);
                  }}
                  className="block py-3 px-4 rounded-xl text-base font-semibold transition-all border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 active:bg-cyan-500/20 active:scale-[0.99]"
                  style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
          style={{ top: '80px' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
