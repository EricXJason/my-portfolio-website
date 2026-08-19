import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Volume2, VolumeX, Sun, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
  soundPlaying: boolean;
  onToggleSound: () => void;
  soundVolume: number;
  onChangeVolume: (val: number) => void;
  siteEntered?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundPlaying,
  onToggleSound,
  soundVolume,
  onChangeVolume,
  siteEntered = true,
}) => {
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopExpOpen, setDesktopExpOpen] = useState(false);
  const [mobileExpOpen, setMobileExpOpen] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  const volumeRef = useRef<HTMLDivElement | null>(null);
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);

  const isLight = theme === 'light';

  // Volume popup click outside
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

  // Desktop dropdown click outside
  useEffect(() => {
    if (!desktopExpOpen) return;
    const handler = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setDesktopExpOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [desktopExpOpen]);

  // Toggle body class 'mobile-menu-open' to hide BackToTop button when mobile navbar is opened
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileOpen]);

  // Screen resize listener to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);

        setMobileExpOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileExpOpen(false);
  };

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

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const textColor = isLight ? '#0f172a' : '#f8fafc';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b transition-colors duration-300 transition-opacity duration-700 ease-out ${
          siteEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(3,7,18,0.92)',
          borderColor: borderCol,
          boxShadow: isLight ? '0 2px 15px rgba(15,23,42,0.06)' : '0 4px 30px rgba(0,0,0,0.6)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4 w-full">

          {/* Logo & Branding */}
          <a
            href="#home"
            onClick={(e) => {
              scrollToSection(e, '#home');
              closeMobileMenu();
            }}
            className="flex items-center gap-2 sm:gap-3 group min-w-0 transition-transform duration-300 hover:scale-105 active:scale-95 flex-shrink"
            aria-label="JasonProduction 許哲誠 HSU, CHE-CHENG"
          >
            <div
              className="relative w-8 h-8 sm:w-10 sm:h-10 border p-[2px] cyber-cut-sm flex items-center justify-center shadow-md shrink-0 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              style={{
                backgroundColor: isLight ? '#e0f2fe' : '#080e1a',
                borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.5)',
              }}
            >
              <div
                className="font-hud font-black text-[10px] sm:text-xs tracking-wider"
                style={{ color: isLight ? '#0284c7' : '#00f0ff' }}
              >
                &lt;JP/&gt;
              </div>
            </div>

            <div className="flex flex-col text-left leading-tight min-w-0 overflow-hidden">
              <span className="font-mono text-xs sm:text-base font-extrabold tracking-wide truncate group-hover:text-cyan-400 transition-colors" style={{ color: textColor }}>
                JasonProduction
              </span>
              <span className="font-tech text-[9px] sm:text-xs font-bold tracking-wider truncate" style={{ color: cyanCol }}>
                許哲誠 HSU, CHE-CHENG
              </span>
            </div>
          </a>

          {/* PC Navigation: Animated Hover & Hover Dropdown for Experience */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {mainNavItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={item.key}
                    ref={desktopDropdownRef}
                    className="relative group/exp"
                    onMouseEnter={() => setDesktopExpOpen(true)}
                    onMouseLeave={() => setDesktopExpOpen(false)}
                  >
                    <button
                      onClick={() => setDesktopExpOpen(!desktopExpOpen)}
                      className="relative px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-tech font-bold uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer whitespace-nowrap group-hover/exp:text-cyan-400 group-hover/exp:scale-105 active:scale-95"
                      style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${desktopExpOpen ? 'rotate-180' : ''}`}
                      />
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 transition-transform duration-300 origin-center ${desktopExpOpen ? 'scale-x-100' : 'scale-x-0 group-hover/exp:scale-x-100'}`} />
                    </button>

                    {/* Seamless Hover Dropdown Bridge */}
                    {desktopExpOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-1 z-50 animate-fadeIn"
                        onMouseEnter={() => setDesktopExpOpen(true)}
                        onMouseLeave={() => setDesktopExpOpen(false)}
                      >
                        <div
                          className="w-48 py-2 border shadow-2xl space-y-1 cyber-cut-corner backdrop-blur-2xl"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#080e1a',
                            borderColor: borderCol,
                          }}
                        >
                          {expSubItems.map((sub) => (
                            <a
                              key={sub.key}
                              href={sub.href}
                              onClick={(e) => {
                                scrollToSection(e, sub.href);
                                setDesktopExpOpen(false);
                              }}
                              className="block px-4 py-2 text-xs font-tech font-bold whitespace-nowrap transition-all duration-200 hover:pl-6 hover:text-cyan-400 hover:bg-cyan-500/10 active:scale-98"
                              style={{ color: isLight ? '#334155' : '#cbd5e1' }}
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
                  className="relative px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-tech font-bold uppercase transition-all duration-300 whitespace-nowrap hover:text-cyan-400 hover:scale-105 active:scale-95 group"
                  style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                >
                  <span>{t(item.key)}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </a>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">

            {/* Audio Toggle Button */}
            <div className="relative shrink-0" ref={volumeRef}>
              <button
                onClick={() => {
                  onToggleSound();
                  if (!soundPlaying) setShowVolumePopup(true);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowVolumePopup(!showVolumePopup);
                }}
                className={`h-8 w-8 sm:h-9 sm:w-9 border cyber-cut-sm flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-105 cursor-pointer shrink-0 ${
                  soundPlaying
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : isLight
                    ? 'border-slate-300 text-slate-600 bg-slate-100 hover:border-slate-400'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60 hover:border-slate-600'
                }`}
                aria-label={soundPlaying ? '音效開啟 (Audio Active)' : '音效關閉 (Audio Muted)'}
                title={soundPlaying ? '音效開啟 (Audio Active)' : '音效關閉 (Audio Muted)'}
              >
                {soundPlaying ? (
                  <Volume2 size={14} className="animate-pulse text-cyan-400 sm:w-[15px] sm:h-[15px]" />
                ) : (
                  <VolumeX size={14} className="sm:w-[15px] sm:h-[15px]" />
                )}
              </button>

              {showVolumePopup && (
                <div
                  className="absolute top-full right-0 mt-3 px-3 py-2.5 border cyber-cut-sm shadow-xl backdrop-blur-2xl z-[60] w-36 sm:w-40 flex items-center gap-2.5 animate-fadeIn"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#080e1a',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.4)',
                    boxShadow: isLight ? '0 10px 25px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(0,240,255,0.15)',
                  }}
                >
                  <Volume2 size={14} className="text-cyan-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-none shrink"
                    aria-label="Volume Level Slider"
                  />
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="w-14 sm:w-16 h-8 sm:h-9 cyber-cut-sm border relative p-0.5 sm:p-1 flex items-center justify-between transition-all duration-300 cursor-pointer font-tech text-xs font-bold active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
                borderColor: borderCol,
              }}
              aria-label={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
              title={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
            >
              <span className="w-1/2 text-center text-[10px] sm:text-xs z-0 select-none font-bold" style={{ color: lang === 'en' ? 'transparent' : isLight ? '#475569' : '#94a3b8' }}>
                EN
              </span>
              <span className="w-1/2 text-center text-[10px] sm:text-xs z-0 select-none font-bold" style={{ color: lang === 'zh' ? 'transparent' : isLight ? '#475569' : '#94a3b8' }}>
                中
              </span>
              <div
                className={`absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)] rounded-none shadow-md flex items-center justify-center transition-all duration-300 z-10 text-[10px] sm:text-xs font-black ${
                  lang === 'zh' ? 'left-[calc(50%+1px)] sm:left-[calc(50%+2px)]' : 'left-0.5 sm:left-1'
                }`}
                style={{
                  backgroundColor: isLight ? '#0284c7' : '#00f0ff',
                  color: isLight ? '#ffffff' : '#030712',
                }}
              >
                {lang === 'en' ? 'EN' : '中'}
              </div>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="w-14 sm:w-16 h-8 sm:h-9 cyber-cut-sm border relative p-0.5 sm:p-1 flex items-center justify-between transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
                borderColor: borderCol,
              }}
              aria-label={isLight ? '切換為深色模式 (Switch to Dark Mode)' : '切換為淺色模式 (Switch to Light Mode)'}
              title={isLight ? '深色模式' : '淺色模式'}
            >
              <div className="w-1/2 flex items-center justify-center z-0 pointer-events-none">
                <Sun size={12} className="text-amber-400 font-bold opacity-100 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)] sm:w-[13px] sm:h-[13px]" />
              </div>
              <div className="w-1/2 flex items-center justify-center z-0 pointer-events-none">
                <Moon size={12} className="text-cyan-400 font-bold opacity-100 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] sm:w-[13px] sm:h-[13px]" />
              </div>
              <div
                className={`absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)] rounded-none flex items-center justify-center transition-all duration-300 z-10 shadow-md ${
                  isLight ? 'left-0.5 sm:left-1' : 'left-[calc(50%+1px)] sm:left-[calc(50%+2px)]'
                }`}
                style={{
                  backgroundColor: isLight ? '#fbbf24' : '#00f0ff',
                  color: '#0f172a',
                }}
              >
                {isLight ? (
                  <Sun size={12} className="fill-current text-slate-900 sm:w-[13px] sm:h-[13px]" />
                ) : (
                  <Moon size={12} className="fill-current text-slate-900 sm:w-[13px] sm:h-[13px]" />
                )}
              </div>
            </button>

            {/* Mobile Animated Hamburger Button */}
            <button
              onClick={() => {
                if (mobileOpen) {
                  closeMobileMenu();
                } else {
                  setMobileOpen(true);
                  setMobileExpOpen(false);
                }
              }}
              className="lg:hidden flex h-8 w-8 sm:h-9 sm:w-9 border cyber-cut-sm items-center justify-center cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: borderCol,
                color: cyanCol,
                transform: mobileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-label={mobileOpen ? '關閉導覽選單 (Close Navigation Menu)' : '開啟導覽選單 (Open Navigation Menu)'}
            >
              <div className="relative w-4 h-4 flex flex-col justify-between items-center">
                <span
                  className="w-full h-0.5 bg-current transition-all duration-300 rounded-none"
                  style={{
                    transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="w-full h-0.5 bg-current transition-all duration-300 rounded-none"
                  style={{
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  className="w-full h-0.5 bg-current transition-all duration-300 rounded-none"
                  style={{
                    transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                  }}
                />
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay: Backdrop Click Closes Menu & Centered Animated Items */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-40 lg:hidden flex flex-col items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] p-6 overflow-y-auto max-w-full backdrop-blur-2xl animate-fadeIn"
          style={{ backgroundColor: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(3,7,18,0.96)' }}
          onClick={closeMobileMenu}
        >
          <div
            className="w-full max-w-md mx-auto flex flex-col space-y-1 text-left px-2 sm:px-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {mainNavItems.map((item, idx) => {
              const itemNum = `0${idx + 1}`;
              const dividerColor = isLight ? 'rgba(203, 213, 225, 0.6)' : 'rgba(0, 240, 255, 0.12)';
              const accentColor = isLight ? '#0284c7' : '#00f0ff';
              const numColor = isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.75)';

              if (item.isDropdown) {
                return (
                  <div key={item.key} className="w-full flex flex-col border-b py-1.5 transition-colors" style={{ borderColor: dividerColor }}>
                    <button
                      onClick={() => setMobileExpOpen(!mobileExpOpen)}
                      className={`w-full py-2.5 px-3 font-hud font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all duration-300 hover:translate-x-1 group ${
                        isLight ? 'hover:text-sky-600' : 'hover:text-cyan-400'
                      }`}
                      style={{
                        color: isLight ? '#0f172a' : '#ffffff',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold tracking-tighter" style={{ color: numColor }}>
                          {itemNum} //
                        </span>
                        <span>{t(item.key)}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          mobileExpOpen
                            ? `rotate-180 ${isLight ? 'text-sky-600' : 'text-cyan-400'}`
                            : `text-slate-400 ${isLight ? 'group-hover:text-sky-600' : 'group-hover:text-cyan-400'}`
                        }`}
                      />
                    </button>

                    {mobileExpOpen && (
                      <div
                        className="w-full ml-4 my-1 pl-4 border-l-2 space-y-1.5 py-1.5 animate-fadeIn flex flex-col"
                        style={{ borderColor: accentColor }}
                      >
                        {expSubItems.map((sub) => (
                          <a
                            key={sub.key}
                            href={sub.href}
                            onClick={(e) => {
                              scrollToSection(e, sub.href);
                              closeMobileMenu();
                            }}
                            className={`flex items-center gap-2.5 py-2 px-3 text-xs sm:text-sm font-tech font-bold transition-all duration-300 hover:translate-x-1 group ${
                              isLight ? 'hover:text-sky-600' : 'hover:text-cyan-400'
                            }`}
                            style={{
                              color: isLight ? '#334155' : '#cbd5e1',
                            }}
                          >
                            <span className="font-mono text-[10px]" style={{ color: numColor }}>&gt;</span>
                            <span>{t(sub.key)}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.key} className="w-full border-b py-1.5 transition-colors" style={{ borderColor: dividerColor }}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                      closeMobileMenu();
                    }}
                    className={`w-full py-2.5 px-3 font-hud font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-between transition-all duration-300 hover:translate-x-1 group ${
                      isLight ? 'hover:text-sky-600' : 'hover:text-cyan-400'
                    }`}
                    style={{
                      color: isLight ? '#0f172a' : '#ffffff',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold tracking-tighter" style={{ color: numColor }}>
                        {itemNum} //
                      </span>
                      <span>{t(item.key)}</span>
                    </div>
                    <span
                      className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: accentColor }}
                    />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
