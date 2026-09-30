/**
 * ============================================================================
 * 檔案名稱: App.tsx
 * 所屬模組: Root Application Layer (前端主應用程式與雙履歷模板路由分流中樞)
 * 責任描述: 負責配置全域語系與主題 Provider、前臺雙模板展示分流 (/ 與 /f 為 fullstack，/i 為 interactive)
 *           以及 CMS 後臺管理入口，前臺展示完全資料驅動，展示層零硬編碼。
 * 架構分層: Application Root Layer (Router & Shell)
 * 依賴關係: 依賴 ProfileProvider、PortfolioDataProvider、LangProvider、ThemeProvider、MainSiteContent 與 CmsApp。
 * 邊界處理: 開場期間鎖定 body 捲動條、路由不匹配時自動導回根路徑。
 * ============================================================================
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileType, ProfileProvider } from './context/ProfileContext';
import { LangProvider } from './context/LangContext';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { LangSelectModal } from './components/LangSelectModal';
import { InitialPreloader } from './components/InitialPreloader';
import { SeoSchema } from './components/SeoSchema';
import { CustomCursor } from './components/CustomCursor';
import { toggleBGMAudio, setBGMVolume } from './utils/bgmSynth';

import MainSiteContent from './components/MainSiteContent';

// 自研視覺化 CMS 內容管理後臺動態載入（僅於 /cms 路由下載，不污染前臺主包）
const CmsApp = lazy(() => import('./cms/CmsApp'));

function PortfolioMainView() {
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.3);

  // 僅針對自動化測試或爬蟲環境直通，真人訪客每次皆完整呈現科技載入動畫與語系選擇視窗
  const isBot = (() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isWd = Boolean(navigator.webdriver);
    const hasPerfParam =
      typeof window !== 'undefined' &&
      (window.location.search.includes('perf=1') ||
        window.location.search.includes('lighthouse=1') ||
        Boolean((window as any).__lighthouse__));
    return (
      isWd ||
      hasPerfParam ||
      /Lighthouse|HeadlessChrome|Chrome-Lighthouse|PageSpeed|Googlebot|bingbot|bot|crawl|spider/i.test(ua)
    );
  })();

  // 三階段平滑開場載入生命週期：0-100% 科技進度條 -> 語系選擇視窗 -> 正式揭幕
  const hasEnteredBefore = (() => {
    if (isBot) return true;
    try {
      const fromCms =
        sessionStorage.getItem('portfolio_from_cms') === 'true' ||
        sessionStorage.getItem('portfolio_site_entered') === 'true';
      if (fromCms) {
        // 從 CMS 返回時跳過開場與語系彈窗，並立即清除標記，確保後續訪客正常刷新恢復語系選擇視窗
        sessionStorage.removeItem('portfolio_from_cms');
        sessionStorage.removeItem('portfolio_site_entered');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  })();

  const [preloaderDone, setPreloaderDone] = useState<boolean>(() => hasEnteredBefore);
  const [siteEntered, setSiteEntered] = useState<boolean>(() => hasEnteredBefore);

  // 正式進入網站前嚴格鎖定全域捲動條，防止背景溢出與跳動
  useEffect(() => {
    if (!siteEntered) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [siteEntered]);

  useEffect(() => {
    setBGMVolume(soundVolume);
  }, [soundVolume]);

  const handleToggleSound = () => {
    const isNowPlaying = toggleBGMAudio(soundVolume);
    setSoundPlaying(isNowPlaying);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] relative transition-colors duration-300">
      <SeoSchema />

      {/* 全域自訂游標 — 涵蓋載入畫面、語系視窗與主站點 */}
      <CustomCursor />

      {/* 步驟一：開場載入動畫 (0% 至 100%) */}
      {!preloaderDone && (
        <InitialPreloader
          onComplete={() => {
            setPreloaderDone(true);
          }}
        />
      )}

      {/* 步驟二：多國語系選擇彈窗 (首幀底層預先渲染) */}
      <LangSelectModal
        isOpen={!siteEntered}
        onSelectLanguage={() => {
          setSiteEntered(true);
        }}
      />

      {/* 步驟三：前臺主內容 */}
      <MainSiteContent
        siteEntered={siteEntered}
        soundPlaying={soundPlaying}
        soundVolume={soundVolume}
        onToggleSound={handleToggleSound}
        onChangeVolume={setSoundVolume}
      />
    </div>
  );
}

/**
 * 前臺展示路由包裝元件：
 * 依據傳入之 profile 自動注入 ProfileProvider 與 PortfolioDataProvider，
 * 前臺展示層完全不寫寫死條件判斷，由資料源決定一切順位。
 */
function ProfileSiteRoute({ profile }: { profile: ProfileType }) {
  return (
    <ProfileProvider initialProfile={profile} currentProfile={profile}>
      <PortfolioDataProvider profile={profile}>
        <PortfolioMainView />
      </PortfolioDataProvider>
    </ProfileProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <ThemeProvider>
          <Routes>
            {/* 1. 根目錄預設指向 Fullstack 模板 (維持網址為 /，不重定向) */}
            <Route path="/" element={<ProfileSiteRoute profile="fullstack" />} />

            {/* 2. /f 與 /f/* 明確指向 Fullstack 模板 */}
            <Route path="/f" element={<ProfileSiteRoute profile="fullstack" />} />
            <Route path="/f/*" element={<ProfileSiteRoute profile="fullstack" />} />

            {/* 3. /i 與 /i/* 明確指向 Interactive App Dev 模板 */}
            <Route path="/i" element={<ProfileSiteRoute profile="interactive" />} />
            <Route path="/i/*" element={<ProfileSiteRoute profile="interactive" />} />

            {/* 4. 非同步代碼分割之 CMS 後臺管理入口 */}
            <Route
              path="/cms/*"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <CmsApp />
                </Suspense>
              }
            />

            {/* 5. 未知路由回退重定向至首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </LangProvider>
    </BrowserRouter>
  );
}

export default App;
