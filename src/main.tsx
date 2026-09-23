/**
 * ============================================================================
 * 檔案名稱: main.tsx
 * 所屬模組: Application Bootstrap Layer (應用程式渲染掛載起點模組)
 * 責任描述: 負責掛載 React 根節點至 DOM、重設頁面滾動位置與非阻塞載入 Google 字體。
 * 架構分層: Application Bootstrap Layer (Entry Script)
 程式入口啟動腳本 (Application Bootstrap)。
 * 依賴關係: 依賴 React、ReactDOM、App 根組件與 index.css 全域樣式。
 * 邊界處理: 滾動恢復模式手動鎖定、root 節點不存在邊界防禦。
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 確保每次重新整理或造訪時頁面皆強制置頂，防止捲動位置錯亂
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 動態啟用 Google 字體樣式表，避免阻塞關鍵渲染路徑 (Non-render-blocking)
const gf = document.getElementById('gfonts') as HTMLLinkElement | null;
if (gf) {
  // 透過 requestAnimationFrame 與非阻塞微任務延後啟用，確保首屏 DOM 瞬時 0ms Paint
  requestAnimationFrame(() => {
    gf.media = 'all';
  });
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
