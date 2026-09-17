# 技術選型評估與依賴套件庫規範 | Technology Stack & Dependency Evaluation

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **協定標準 / Compliance**: 依據《AGENTS.md》全域最高工程中樞協定規範建置。定義專案技術選型決策矩陣、架構權衡取捨、核心依賴套件庫與工程品質保證鏈。  
> *Release: 2026-09*

---

## 1. 選型決策矩陣 | Technology Selection Matrix

本專案經過嚴格之效能、型別安全、可維護性與維運成本評估，選定下列核心技術矩陣，達成前端極致效能與雲端無伺服器整合。

| 技術範疇 (Category) | 選定技術與版本 (Technology & Version) | 角色職責 (Role & Responsibility) |
| :--- | :--- | :--- |
| **前端框架 (Frontend UI)** | React 19 (19.2+) | 宣告式組件驅動架構、極致 Virtual DOM 渲染與並發管線 / Declarative component architecture & optimized concurrent reconciliation |
| **程式語言 (Language)** | TypeScript 5.8+ | 強型別防禦、介面契約保證與靜態編譯期型別安全 / Strict type safety, interface contracts & compile-time error defense |
| **建置工具 (Build Tooling)** | Vite 8+ | 次秒級極速熱模組替換 (HMR) 與基於 Rollup 之高效代碼分割 / Sub-second HMR & Rollup-based intelligent chunk splitting |
| **樣式體系 (Styling & Design)** | Tailwind CSS 4 + Vanilla CSS3 | 現代 utility-first 樣式結合自研 Cyber HUD 變數與雷射動效 / Modern atomic styling combined with bespoke Cyber HUD variables |
| **雲端資料庫 (Cloud Database)** | Firebase Firestore | NoSQL 雲端文檔集合、毫秒級 `onSnapshot` 雙向串流即時監聽與離線快取 / Real-time document store & streaming |
| **身分驗證 (Authentication)** | Firebase Auth | 官方安全性金鑰與 Email/Password 鑑別門禁防護 / Official secure credentials & token lifecycle management |
| **多媒體雲端儲存 (Media Storage)**| Firebase Storage | 高解析度圖檔、3D 模型與多媒體資材雲端儲存與非同步管線 / Cloud multimedia asset management |
| **持續整合 (CI Pipeline)** | GitHub Actions (CI) | 自動化品質閘門、型別校驗與構建檢查 / Automated CI validation gates & typecheck enforcement |
| **持續部署與邊緣運算 (CD & Edge)**| Cloudflare Workers (CD) | 邊緣運算執行環境與全球 Anycast 邊緣節點極速分發 / Global Anycast edge distribution & Workers runtime |

---

## 2. 選型理由與權衡取捨 | Architectural Trade-offs & Rationales

本節深入探討本專案核心架構決策之權衡取捨（Trade-offs）與技術選型依據。

### 2.1 為何選擇 React + Vite SPA 而非 Next.js SSR？ | Why React + Vite SPA over Next.js SSR?

本決策以極限前端渲染效能與零伺服器維護負擔為核心出發點。

- **效能極限化 (Maximized Performance)**：本專案為個人作品集與展示型 SPA，靜態資產可 100% 預先編譯並部署至 Cloudflare Workers 邊緣快取，無需 Node.js 伺服器常駐維護，杜絕 SSR 冷啟動延遲。  
  *As an interactive portfolio SPA, all static bundles are pre-compiled and edge-cached on Cloudflare Workers, eliminating Node.js server overhead and SSR cold-start latency.*
- **邊緣分發成本 (Edge Zero-Maintenance)**：Cloudflare 邊緣網絡提供無限頻寬與零實體主機維護成本，具備全球 Anycast 邊緣網絡即時加速。  
  *Cloudflare delivers unlimited bandwidth and globally distributed Anycast edge routing with zero maintenance overhead.*
- **雙向串流同步架構 (Streaming Architecture Alignment)**：前端透過 `PortfolioDataContext` 與 Firebase Firestore `onSnapshot` 直接串接，實現客戶端無感熱更新，無需透過繁瑣的中繼 SSR 轉換。  
  *The client-side streaming model seamlessly bridges with Firebase Firestore real-time listeners for instant hot updates without intermediary SSR layers.*

### 2.2 為何選擇 Firebase BaaS 而非自行架設 Express / NestJS？ | Why Firebase BaaS over Custom Backend?

選用 BaaS 架構大幅壓縮系統維護面，專注於前端互動與資產管理。

- **架構簡約與零負擔 (Architectural Simplicity)**：個人作品集之後臺以多媒體上傳與 JSON/Document 結構管理為主，Firebase 提供開箱即用之身分鑑別、即時資料庫與雲端儲存，免除實體資料庫維運、作業系統安全修補與後端連線池管理。  
  *The admin workflow emphasizes media asset staging and structured document management. Firebase delivers battle-tested authentication, real-time database, and cloud storage without server patching or database connection pooling overhead.*
- **安全攻擊面收斂 (Attack Surface Minimization)**：客戶端透過官方安全驗證與 Security Rules 保護，杜絕私有伺服器遭注入或提權之風險。  
  *Confining external state mutations to authenticated client-side sandboxes drastically narrows the public network attack surface.*

---

## 3. 核心相依套件庫清單 | Core Dependencies Inventory

本專案嚴格遵循最少依賴原則（Zero Bloat），杜絕過度打包與幽靈依賴，確保代碼庫精純高效。

| 套件名稱 (Package) | 模組分層 (Layer) | 用途描述 (Purpose) |
| :--- | :--- | :--- |
| `react`, `react-dom` | UI Core | 核心視圖元件渲染 / Component rendering engine |
| `lucide-react` | Icons | 介面功能圖示集（如 Eye, EyeOff, Save, Trash2 等）/ Functional interface icons |
| `firebase` | Cloud BaaS | Firestore 即時資料庫、Auth 鑑別與 Storage 多媒體庫 / Identity, database & cloud assets |
| `vite` | Tooling | 構建引擎與極速開發伺服器 / Next-gen build engine & dev server |
| `tailwindcss`, `@tailwindcss/vite` | Styling | 現代原子化樣式編譯器 / Utility-first CSS compiler |
| `typescript` | Language | 靜態型別分析與編譯期防禦 / Static type analysis & contract enforcement |

---

## 4. 品質保證與工程規範 | Quality Assurance & Engineering Standards

本節定義專案在開發與交付過程中必須通過的各項品質檢驗閘門。

- **靜態型別檢查 (Type Safety Gate)**：每次提交與構建前強制執行 `pnpm exec tsc --noEmit`，保證 0 型別錯誤。
- **生產構建驗證 (Production Build Gate)**：強制執行 `pnpm run build`，Rollup 代碼分塊嚴密壓制於最佳 gzip 尺寸。
- **無障礙對比標準 (WCAG Standards)**：深淺色模式 100% 符合 WCAG 2.2 AAA/AA 標準（本文文字對比度 ≥ 7:1 / 4.5:1）。
