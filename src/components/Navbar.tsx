/**
 * ============================================================================
 * 檔案名稱: Navbar.tsx
 * 所屬模組: Presentation Layer (全域頂部導覽列模組)
 * 責任描述: 負責提供跨裝置導覽跳轉、雙語切換、深淺色切換、BGM 音效引擎開關與音量拉桿控制。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 Context 狀態管理與自適應點擊監聽 (Click Outside)。
 * 依賴關係: 依賴 LangContext、ThemeContext 與 site-settings.json 預設品牌標題。
 * 邊界處理: 處理行動裝置開啟選單時隱藏返回頂部按鈕、視窗尺寸動態重設防範佈局錯位。
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Volume2, VolumeX, Sun, Moon, ChevronDown } from 'lucide-react';
import defaultSiteSettings from '../data/site-settings.json';

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

  /**
   * TODO: [後端端點對接] 取得使用者模式網站全域設定 (網頁標題、雙層導覽列品牌名稱、動畫速度)
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/site-settings
   * 3. 請求參數:
   *    - Header: Authorization (非強制，公開讀取)
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: SiteSettings }
   *    - 500 Internal Server Error: 伺服器讀取全域設定失敗
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，直接採用本地靜態 JSON 資料 (site-settings.json) 驅動，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const { data } = usePortfolioData();
  const siteSettings = ((data.site_settings || defaultSiteSettings) as typeof defaultSiteSettings);

  const currentSettings = siteSettings[lang] || defaultSiteSettings[lang] || defaultSiteSettings.zh;
  const headerTopTitle = currentSettings.headerTop || 'Portfolio';
  const headerBottomTitle = currentSettings.headerBottom || (lang === 'en' ? 'HSU, CHE-CHENG' : '許哲誠 HSU, CHE-CHENG');

  useEffect(() => {
    if (currentSettings.htmlTitle) {
      document.title = currentSettings.htmlTitle;
    }
  }, [currentSettings.htmlTitle]);

  const volumeRef = useRef<HTMLDivElement | null>(null);
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);

  const isLight = theme === 'light';

  // 音量調節彈窗外部點擊關閉監聽
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

  // 桌面端下拉選單外部點擊關閉監聽
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

  // 當手機選單展開時，於 body 注入 class 以自動隱藏返回頂部按鈕
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

  // 視窗尺寸改變監聽：當回到桌面寬度時自動關閉手機端選單
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

  // 鍵盤按下 Escape 鍵時關閉行動端選單與音量彈窗
  useEffect(() => {
    if (!mobileOpen && !showVolumePopup) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        setShowVolumePopup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, showVolumePopup]);

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

  /**
   * TODO: [後端端點對接] 取得使用者模式導覽列與區塊模組自訂排版順序
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/modules-order
   * 3. 請求參數: 無
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: string[] }
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，採用作品集標準推薦順序，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const moduleOrder = ['home', 'about', 'skills', 'projects', 'awards', 'experience', 'gallery'];

  const expSubItems = [
    { key: 'nav_sub_degrees', href: '#education-degrees' },
    { key: 'nav_sub_work', href: '#work-experience' },
    { key: 'nav_sub_workshops', href: '#workshops' },
    { key: 'nav_sub_publications', href: '#publications' },
  ];

  const baseNavMap: Record<string, { key: string; href: string; isDropdown?: boolean }> = {
    home: { key: 'nav_home', href: '#home' },
    about: { key: 'nav_about', href: '#about' },
    skills: { key: 'nav_skills', href: '#skills' },
    projects: { key: 'nav_projects', href: '#projects' },
    awards: { key: 'nav_awards', href: '#awards' },
    experience: { key: 'nav_experience', href: '#experience', isDropdown: true },
    gallery: { key: 'nav_gallery', href: '#gallery' },
  };

  const mainNavItems = moduleOrder
    .map((id) => baseNavMap[id])
    .filter(Boolean);

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

          {/* 品牌標誌與作品集名稱 */}
          <a
            href="#home"
            onClick={(e) => {
              scrollToSection(e, '#home');
              closeMobileMenu();
            }}
            className="flex items-center gap-2 sm:gap-3 group min-w-0 transition-transform duration-300 hover:scale-105 active:scale-95 flex-shrink"
            aria-label="Portfolio 許哲誠 HSU, CHE-CHENG"
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
                {headerTopTitle}
              </span>
              <span className="font-tech text-[9px] sm:text-xs font-bold tracking-wider truncate" style={{ color: cyanCol }}>
                {headerBottomTitle}
              </span>
            </div>
          </a>

          {/* 桌面端導覽列：動態懸停底線與經歷下拉式選單 */}
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
                      className="relative px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-tech font-bold uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer whitespace-nowrap group-hover/exp:text-cyan-400 group-hover/exp:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-sm"
                      style={{ color: isLight ? '#0f172a' : '#f1f5f9' }}
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${desktopExpOpen ? 'rotate-180' : ''}`}
                      />
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 transition-transform duration-300 origin-center ${desktopExpOpen ? 'scale-x-100' : 'scale-x-0 group-hover/exp:scale-x-100'}`} />
                    </button>

                    {/* 無縫懸停下拉觸發區域橋接 */}
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
                              className="block px-4 py-2 text-xs font-tech font-bold whitespace-nowrap transition-all duration-200 hover:pl-6 hover:text-cyan-400 hover:bg-cyan-500/10 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950"
                              style={{ color: isLight ? '#0f172a' : '#f1f5f9' }}
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
                  className="relative px-2.5 xl:px-3.5 py-2 text-xs xl:text-sm font-tech font-bold uppercase transition-all duration-300 whitespace-nowrap hover:text-cyan-400 hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-sm"
                  style={{ color: isLight ? '#0f172a' : '#f1f5f9' }}
                >
                  <span>{t(item.key)}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </a>
              );
            })}
          </nav>

          {/* 右側快捷控制項 */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">

            {/* 背景音樂開關按鈕 */}
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
                className={`h-8 w-8 sm:h-9 sm:w-9 border cyber-cut-sm flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-105 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  soundPlaying
                    ? isLight
                      ? 'border-sky-700 text-sky-700 bg-sky-100/60'
                      : 'border-cyan-400 text-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : isLight
                    ? 'border-slate-300 text-slate-600 bg-slate-100 hover:border-slate-400'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60 hover:border-slate-600'
                }`}
                aria-label={soundPlaying ? '音效開啟 (Audio Active)' : '音效關閉 (Audio Muted)'}
                title={soundPlaying ? '音效開啟 (Audio Active)' : '音效關閉 (Audio Muted)'}
              >
                {soundPlaying ? (
                  <Volume2 size={14} className={`animate-pulse sm:w-[15px] sm:h-[15px] ${isLight ? 'text-sky-700' : 'text-cyan-400'}`} />
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
                  <Volume2 size={14} className={`shrink-0 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-none shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-label="Volume Level Slider"
                  />
                </div>
              )}
            </div>

            {/* 多國語系切換器 */}
            <button
              onClick={toggleLang}
              className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer font-tech text-xs font-bold active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
                borderColor: borderCol,
              }}
              aria-label={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
              title={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
            >
              <div className="w-full h-full flex items-center justify-between pointer-events-none z-0">
                <span className="w-1/2 text-center text-[10px] sm:text-xs font-bold" style={{ color: lang === 'en' ? 'transparent' : (isLight ? '#334155' : '#cbd5e1') }}>
                  EN
                </span>
                <span className="w-1/2 text-center text-[10px] sm:text-xs font-bold" style={{ color: lang === 'zh' ? 'transparent' : (isLight ? '#334155' : '#cbd5e1') }}>
                  中
                </span>
              </div>
              <div
                className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm"
                style={{
                  transform: lang === 'en' ? 'translateX(0%)' : 'translateX(100%)',
                  backgroundColor: isLight ? '#0284c7' : '#00f0ff',
                  color: isLight ? '#ffffff' : '#0f172a',
                }}
              >
                <span className="text-[10px] sm:text-xs font-black tracking-tighter">
                  {lang === 'en' ? 'EN' : '中'}
                </span>
              </div>
            </button>

            {/* 外觀主題切換器 */}
            <button
              onClick={toggleTheme}
              className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
                borderColor: borderCol,
              }}
              aria-label={isLight ? '切換為深色模式 (Switch to Dark Mode)' : '切換為淺色模式 (Switch to Light Mode)'}
              title={isLight ? '深色模式' : '淺色模式'}
            >
              <div className="w-full h-full flex items-center justify-between pointer-events-none z-0 px-1">
                <div className="w-1/2 flex items-center justify-center">
                  <Sun size={12} className="text-amber-400 font-bold opacity-80" />
                </div>
                <div className="w-1/2 flex items-center justify-center">
                  <Moon size={12} className="text-cyan-400 font-bold opacity-80" />
                </div>
              </div>
              <div
                className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm"
                style={{
                  transform: isLight ? 'translateX(0%)' : 'translateX(100%)',
                  backgroundColor: isLight ? '#fbbf24' : '#00f0ff',
                  color: '#0f172a',
                }}
              >
                {isLight ? (
                  <Sun size={13} className="fill-current text-slate-900" />
                ) : (
                  <Moon size={13} className="fill-current text-slate-900" />
                )}
              </div>
            </button>

            {/* 行動端動畫漢堡選單按鈕 (符合 WCAG 2.2 觸控面積 >= 44x44px 與 aria-expanded 語意) */}
            <button
              onClick={() => {
                if (mobileOpen) {
                  closeMobileMenu();
                } else {
                  setMobileOpen(true);
                  setMobileExpOpen(false);
                }
              }}
              className="lg:hidden flex min-h-[44px] min-w-[44px] h-11 w-11 border cyber-cut-sm items-center justify-center cursor-pointer shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: borderCol,
                color: cyanCol,
                transform: mobileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? (lang === 'zh' ? '關閉導覽選單' : 'Close navigation menu') : (lang === 'zh' ? '開啟導覽選單' : 'Open navigation menu')}
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

      {/* 行動端全螢幕選單覆蓋層 */}
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
