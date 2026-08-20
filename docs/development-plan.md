# ⚡ Project Master Development Plan (專案主架構開發計畫)

> 本文件為個人官方作品集網站（Portfolio）之全域核心架構規範與規格藍圖，涵蓋系統願景、功能模組、非功能性需求（WCAG 無障礙對比標準、Lighthouse 雙平臺雙百標準與 AI 代理爬蟲規範）、設計系統、技術棧及資料架構。

---

## 1. 🎯 系統願景與核心價值 (Vision & Core Goals)

本專案旨在為 許哲誠（HSU, CHE-CHENG）建置具備極致科技美學與頂級工程標準的個人官方作品集網站，提供全球招募主管、技術專家、AI 代理爬蟲與訪客卓越的互動體驗。

### A. 核心定位
- **跨領域技術整合**：結合 VR/AR 互動應用開發 (Unity / Unreal Engine)、全端網頁工程架構 (React 19 / TypeScript / Tailwind CSS / Spring Boot / FastAPI / Cloudflare Pages) 與新媒體美學設計。
- **極致響應式與流暢體驗**：全平臺 PC、平板與手機（直向與橫向）自適應佈局，零版面偏移（CLS 0），具備 0.85s 細膩減速阻尼之向下滾動視差動效。
- **零妥協無障礙與極限效能**：100% 符合最新 WCAG 2.1/2.2 AAA/AA 對比度規範、Lighthouse 雙平臺五項指標（效能、無障礙、最佳實踐、SEO、AI 代理瀏覽）全滿分標竿。

---

## 2. 🧩 功能模組與使用者旅程 (Functional Requirements & User Journeys)

全站採用單頁式架構（SPA），包含八大核心展示區塊與多模態互動控制系統。

### A. 三階段開場與全域導覽控制系統
- **三階段流暢開場機制 (Three-Stage Onboarding Flow)**：
  - **階段一（0% -> 100% 科技載入動畫）**：`InitialPreloader` 獨立置頂運行，全站主體、導覽列與側邊欄維持完全隔離，杜絕任何載入中途畫面跳動。
  - **階段二（語言選擇視窗）**：`LangSelectModal` 即時呈現，背景完全隱蔽，等待使用者確認語系偏好。
  - **階段三（全站同步淡入與 0ms 極速切換）**：完成選擇後立即觸發 `siteEntered: true`，背景提前預熱完成，導覽列（Navbar）、進度條（ScrollProgress）、側邊索引（SideNav）與首頁內容以 0ms 零延遲齊步平滑淡入。
- **頂部導覽列 (Navbar)**：
  - 品牌徽標、章節錨點快速跳轉。
  - 語系即時切換開關（繁體中文 / English）。
  - 主題即時切換開關（深色深淵模式 / 淺色運維模式）。
  - 背景音效開關與音量控制彈窗。
  - 手機端全螢幕抽屜式選單（平滑滑入與防捲動鎖定）。
- **滾動進度指示條 (ScrollProgress)**：位於頂部導覽列下方，即時反應用戶瀏覽全頁百分比。
- **側邊快速索引 (SideNav)**：幾何菱形發光錨點，滾動時即時高亮當前視窗所在區塊。

### B. 核心內容區塊
1. **Hero 首頁看板**：
   - 具備滑鼠/觸控視線追蹤之賽博龐克微表情機器人（SciFiRobotAvatar）。
   - 主標題、多重動態漸層副標題、簡介。
   - GitHub 專頁與 ArtStation 作品集外鏈按鈕。
   - 聯絡資訊看板（電話、Email、LINE ID）與一鍵複製功能。
2. **關於我 (About)**：
   - 國立臺灣藝術大學新媒體藝術碩士背景介紹。
   - 核心專長與專業定位論述。
   - 數據指標卡（碩士學歷、多種核心專案經驗、TOEIC 755 多益成績證書外鏈）。
3. **專業技能 (Skills)**：
   - 分為「主要專業領域 (Primary)」與「輔助專業技能 (Auxiliary)」。
   - 涵蓋遊戲引擎、全端技術（含 Cloudflare Pages、AWS、GCP、Firebase 等雲端服務）、多媒體設計之晶片化標籤矩陣。
4. **專案作品 (Projects)**：
   - 類別過濾系統（精選作品、全部作品、互動應用、前端開發、全端開發、LINE Bot）。
   - 精選作品視圖（3 件代表作橫向卡片）與「檢視更多」跳轉按鈕。
   - 全部作品視圖（8 件完整專案清單）與原位「檢視更多 / 收起專案」平滑展開按鈕。
   - 專案詳情燈箱彈窗（展示技術棧、專案貢獻、榮譽獎項、演示影片與 GitHub 連結）。
   - YouTube 影音展示彈窗（支援即時嵌入播放）。
5. **專業證照與檢定 (Certifications)**：
   - 高對比 TOEIC 755 證書卡片。
   - 國家級技能檢定與原廠國際認證分類清單，支援 Google Drive 證書外鏈。
6. **學歷與經歷 (Education & Experience)**：
   - 臺藝大碩士與虎科大學士學位證書與成績單外鏈。
   - 教授研究助理兼助教三年之國科會研究計畫經歷。
   - 專業工作坊培訓結業證書。
   - 學術論文發表紀錄與簡報外鏈。
7. **美術畫廊 (Art Gallery)**：
   - 3D 場景與道具輪播輪盤（Roulette 3D Carousel）與多分類畫廊網格。
   - 圖片高解析度燈箱預覽、鍵盤左右箭頭導覽與高解析素材下載。
8. **頁尾 (Footer)**：
   - 本地時區版權宣告、全站技術棧徽章矩陣（HTML5、CSS3、Tailwind CSS、TypeScript、React、Vite、GitHub Actions、Cloudflare Pages）。

---

## 3. 🛡️ 非功能性需求與無障礙標準 (Non-Functional Requirements & WCAG Standards)

全站設計嚴格遵循國際頂級無障礙、爬蟲友善與效能標準。

### A. WCAG 2.1 / 2.2 AAA & AA 對比度標準
- **深色模式 (Dark Mode)**：
  - 主要文字 (`--text-main: #f8fafc`) 對背景 (`#030712`)：**對比度 18.7:1 (AAA)**。
  - 次要文字 (`--text-sub: #cbd5e1`) 對背景 (`#030712`)：**對比度 12.6:1 (AAA)**。
  - 霓虹強調青色 (`--neon-cyan: #00f0ff`) 對背景 (`#030712`)：**對比度 15.4:1 (AAA)**。
  - 金黃琥珀色 (`#fbbf24`) 對背景 (`#091328`)：**對比度 10.5:1 (AAA)**。
- **淺色模式 (Light Mode)**：
  - 主要文字 (`--text-main: #0f172a`) 對背景 (`#f8fafc` / `#ffffff`)：**對比度 17.9:1 ~ 18.7:1 (AAA)**。
  - 次要文字 (`--text-sub: #334155`) 對背景 (`#f8fafc` / `#ffffff`)：**對比度 9.4:1 ~ 9.8:1 (AAA)**。
  - 科技天藍色 (`--neon-cyan: #0284c7`) 對背景 (`#ffffff`)：**對比度 5.8:1 (AA / AAA Large)**。
  - 深青藍文字 (`#0369a1`) 對淺藍背景 (`#e0f2fe`)：**對比度 6.2:1 (AA / AAA Large)**。
  - 琥珀深棕文字 (`#b45309`) 對淺黃背景 (`#fffbeb`)：**對比度 5.1:1 (AA / AAA Large)**。
- **輔助功能 (a11y)**：
  - 所有按鈕、連結與互動元件皆具備明確之 `aria-label`、`title`、`role="tab"`、`role="dialog"`。
  - 支援鍵盤 Tab 焦點導航與 Escape 快速關閉彈窗。
  - 支援 `prefers-reduced-motion` 媒體查詢以照顧前庭覺敏感使用者。

### B. 搜尋引擎最佳化 (SEO) 與 AI 代理瀏覽 (Agentic Browsing)
- 網頁標題固定為 **`Portfolio`**。
- 完整 Open Graph、Twitter Card、Canonical URL、robots.txt、sitemap.xml 與 Schema.org JSON-LD 結構化資料。
- 遵循 llms.txt 官方規範建立標準 `public/llms.txt`，包含一級標題與 Markdown 導航結構，獲得 Agentic Browsing 滿分（100/100）。

---

## 4. 🎨 設計系統 (Design System)

- **字體層級**：
  - 戰術 HUD 標題：`Orbitron`, `Chakra Petch`, `Noto Sans TC`
  - 科技標籤與數據：`Chakra Petch`, `Rajdhani`, `Share Tech Mono`
  - 內文與閱讀排版：`Inter`, `Noto Sans TC`
  - Google Fonts 採用 Preconnect + Preload + 非阻塞 Media 加載，徹底消除渲染阻塞（0ms blocking）。
- **動畫曲線與阻尼**：
  - 滾動進場：`0.85s` 動畫時長搭配高階減速阻尼曲線 `cubic-bezier(0.22, 1, 0.36, 1)`，微幅位移 `18px/20px`。
  - 視窗觸發門檻：`IntersectionObserver` 門檻 `threshold: 0.05`、`rootMargin: '0px 0px -20px 0px'`。
- **斷點系統**：
  - Mobile: `< 640px`
  - Tablet: `640px ~ 1024px`
  - Desktop: `1024px ~ 1536px`
  - Ultra-wide: `>= 1536px`

---

## 5. 🛠️ 技術棧與架構 (Tech Stack & Architecture)

- **前端核心**：React 19, TypeScript 5.8, Vite 8.1, Tailwind CSS v4
- **圖示庫**：Lucide React, 自研精準 SVG TechIcon 系統
- **持續整合與交付 (CI/CD)**：
  - **CI (GitHub Actions)**：靜態代碼檢查 (`oxlint`) 與建置門禁 (`vite build`)。
  - **CD (Cloudflare Pages)**：邊緣節點自動化建構與全球 Anycast CDN 快取加速發布。
- **版本控制分支規範**：僅維護單一主分支 **`master`**。
