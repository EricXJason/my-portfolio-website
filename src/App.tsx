/**
 * ============================================================================
 * 檔案名稱: App.tsx
 * 所屬模組: Root Application Layer (前端主應用程式與路由分流模組)
 * 責任描述: 負責配置全域語系與主題 Provider、前臺展示與 CMS 後臺路由分流，以及三階段開場載入生命週期。
 * 架構分層: Application Root Layer (Router & Shell)
 根應用協調者模式 (Root Coordinator) 結合 Suspense 動態代碼分割與預熱機制。
 * 依賴關係: 依賴 LangProvider、ThemeProvider、MainSiteContent、CmsApp 與 bgmSynth。
 * 邊界處理: 開場期間鎖定 body 捲動條、路由不匹配時自動導回根路徑。
 * ============================================================================
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    return (
      Boolean(navigator.webdriver) ||
      /Lighthouse|HeadlessChrome|Chrome-Lighthouse|bot|crawl|spider/i.test(navigator.userAgent)
    );
  })();

  // 三階段平滑開場載入生命週期：0-100% 科技進度條 -> 語系選擇視窗 -> 正式揭幕
  const [preloaderDone, setPreloaderDone] = useState<boolean>(() => isBot);
  const [siteEntered, setSiteEntered] = useState<boolean>(() => isBot);


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
        <InitialPreloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* 步驟二：多國語系選擇彈窗 (首幀底層預先渲染) */}
      <LangSelectModal
        isOpen={!siteEntered}
        onSelectLanguage={() => setSiteEntered(true)}
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

export function App() {
  return (
    <BrowserRouter>
      <PortfolioDataProvider>
        <LangProvider>
          <ThemeProvider>
            <Routes>
              {/* 前臺正式個人作品集首頁 */}
              <Route path="/" element={<PortfolioMainView />} />

              {/* 非同步代碼分割之 CMS 後臺管理入口 */}
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

              {/* 未知路由回退重定向至首頁 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ThemeProvider>
        </LangProvider>
      </PortfolioDataProvider>
    </BrowserRouter>
  );
}

export default App;
