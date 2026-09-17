# 變更歷史與版本歷程紀錄 | CHANGELOG

本文件為全專案唯一的全域修訂歷程紀錄（SSOT），詳實記錄系統核心架構、CMS 內容管理平臺、安全鑑別與前臺展示層之重大版本演進與功能迭代。本規範嚴格遵循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 標準格式編排。

---

## [1.0.0] - 2026-09-17

本版本標誌個人作品集網站（Portfolio）與自主研發視覺化內容管理平臺（In-House CMS）正式全面整合上線，達成全端 BaaS 雲端化、離線優先快取與毫秒級即時串流同步。

### 核心新增 (Added)

本節詳列本次重大發布中全新構建之核心架構、資料庫串接與安全門禁功能。

- **全域離線優先 SWR 雙向狀態中樞 (`PortfolioDataContext`)**：
  - 整合 `Firebase Firestore` 雲端資料庫集合 `portfolio_content`，實作「本地靜態 JSON 0ms 首屏渲染 + `onSnapshot` 毫秒級即時串流監聽」雙層狀態管線。
  - 前臺八大模組全面改由雲端 Context 動態驅動，CMS 儲存時自動持久化至雲端，達成**前臺無須重新整理網頁即可即時熱更新**。
- **Firebase Auth 官方安全身分認證門禁**：
  - CMS 管理後臺全面接入 `signInWithEmailAndPassword` 官方加密驗證，徹底移除本地模擬放行與測試旁路，保障後臺安全。
- **資料庫集合結構與播種管線 (`portfolioDataService`)**：
  - 封裝 `savePortfolioDoc`、`getPortfolioDoc` 與一鍵雲端資料庫初始化函式 `seedFirestoreFromLocalJson`。
- **多益檢定細粒度開關與前臺聯動**：
  - 支援語言檢定與雲端證照庫中多益單項開關獨立切換，前臺嚴格依據 `toeic.visible` 狀態即時呈現或隱藏。
- **系統分析與工程架構規格拓撲 (`docs/system-design/`)**：
  - 依照《AGENTS.md》條款 3.2 建立 `01-overview.md` 至 `09-devops-deployment.md` 共九大標準規格文檔，確保系統架構規格唯一真實來源。

### 架構變更與最佳化 (Changed)

本節說明既有模組的設計升級、美學重構與操作人因工程優化。

- **個人作品集專案敘述與貢獻全量更新**：
  - 更新 [`projects-section.json`](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/data/projects-section.json) 中個人作品集專案之詳細技術棧標籤、系統架構貢獻說明與最新 WebP 封面圖資。
- **CMS 操作介面純淨化**：
  - 移除 [`CmsHeader.tsx`](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsHeader.tsx) 頂部手動同步按鈕，回歸各模組編輯器自動存檔寫入雲端架構。
  - 歷程時間軸自動依照結束時間精準降序排序，簡化操作負擔。
- **科幻賽博龐克戰術視覺全面升級**：
  - 前臺模組升級為玻璃擬態（Glassmorphism）半透明層次與動態 Canvas 粒子交互背景，兼顧 WCAG AAA 高對比無障礙要求。

### 移除項目 (Removed)

本節列出因架構標準化而依法清理之冗餘非規範檔案。

- **非規範文件清理**：
  - 徹底移除不符合規範之 `docs/checklist.md` 與 `docs/log.md`，由本 `CHANGELOG.md` 統一代管全域修訂歷程。
- **旁路登入邏輯清理**：
  - 拔除 CMS 門禁對話框內之測試模式與訪客沙盒按鈕，杜絕未授權存取風險。

---

## [0.9.0] - 2026-09-14

本版本奠定全端 React 19 與 TypeScript 基礎架構，建構前臺八大模組與初版自研視覺化 CMS 核心。

### 核心新增 (Added)

本節紀錄專案初期建立之各項展示與管理基礎模組。

- **前臺八大展示模組**：
  - 完成首頁看板機甲微表情機器人、關於我、技能矩陣、精選專案、經歷歷程、專業證照、美術畫廊與戰術導覽列。
- **自研視覺化 CMS 管理後臺基礎**：
  - 建置未儲存狀態智慧阻斷防護（`CmsDirtyContext`）與刪除二次確認對話框（`CmsConfirmDialog`）。
- **多語系與主題中樞**：
  - 導入 `LangContext`（繁中 / 英文）與 `ThemeContext`（賽博深色 / 純淨淺色）。
