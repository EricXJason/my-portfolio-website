# 技術選型評估與依賴套件庫規範 | Technology Stack & Dependency Evaluation

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **規範標準 / Compliance**: 依據《AGENTS.md》全域最高工業級工程協定第 6.2 節規範建置。定義專案技術選型決策矩陣、架構權衡取捨、核心依賴套件庫與工程品質保證鏈。  
> *Release: 2026-09-14*

---

## 1. 選型決策矩陣 | Technology Selection Matrix

本專案經過嚴格之效能、型別安全、可維護性與維運成本評估，選定下列核心技術矩陣：  
*The project evaluated performance, type safety, maintainability, and operational overhead to establish this core stack:*

| 技術範疇 (Category) | 選定技術與版本 (Technology & Version) | 角色職責 (Role & Responsibility) |
| :--- | :--- | :--- |
| **前端框架 (Frontend UI)** | React 19 (19.2+) | 宣告式組件驅動架構、極致 Virtual DOM 渲染與並發管線 / Declarative component architecture & optimized concurrent reconciliation |
| **程式語言 (Language)** | TypeScript 5.8+ | 強型別防禦、介面契約保證與靜態編譯期型別安全 / Strict type safety, interface contracts & compile-time error defense |
| **建置工具 (Build Tooling)** | Vite 8+ | 次秒級極速熱模組替換 (HMR) 與基於 Rollup 之高效代碼分割 / Sub-second HMR & Rollup-based intelligent chunk splitting |
| **樣式體系 (Styling & Design)** | Tailwind CSS 4 + Vanilla CSS3 | 現代 utility-first 樣式結合自研 Cyber HUD 變數與雷射動效 / Modern atomic styling combined with bespoke Cyber HUD variables |
| **持續整合 (CI Pipeline)** | GitHub Actions (CI) | 自動化品質閘門、型別校驗與構建檢查 / Automated CI validation gates & typecheck enforcement |
| **持續部署與邊緣 (CD & Edge)** | Cloudflare Pages (CD) | 靜態打包與全球 Anycast 邊緣節點極速分發 / Global Anycast edge distribution & instant caching |
| **後端雲端 BaaS (Backend BaaS)** | Firebase Storage & Auth | 無伺服器資產管理、非同步多媒體上傳與身分驗證支援 / Serverless asset pipeline, async media upload & authentication |

---

## 2. 選型理由與權衡取捨 | Architectural Trade-offs & Rationales

### 繁體中文
#### 2.1 為何選擇 React + Vite SPA 而非 Next.js SSR？
- **效能極限化**：本專案為個人作品集與展示型 SPA，靜態資產可 100% 預先編譯並部署至 Cloudflare Pages 邊緣快取，無需 Node.js 伺服器常駐維護，杜絕 SSR 冷啟動延遲。
- **邊緣分發成本**：Cloudflare Pages 提供無限頻寬與零伺服器維護成本，具備全球 Anycast 邊緣網絡即時加速。
- **CMS 架構吻合**：自研視覺化 CMS 核心著重於客戶端狀態管理與本機持久化，搭配 Firebase Storage 即可達成完整閉環，免除複雜的伺服器端渲染負擔。

#### 2.2 為何選擇 Firebase Storage BaaS 而非自行架設 Express / NestJS？
- **架構簡約與零負擔**：個人作品集之後臺以多媒體上傳（高解析度圖檔、3D 作品連結）與 JSON 結構管理為主，BaaS 提供開箱即用之身分鑑別與雲端儲存，免除實體資料庫維運與後端漏洞修補。
- **安全攻擊面收斂**：客戶端僅透過安全金鑰或本地沙盒操作，大幅降低暴露於公網之伺服端攻擊面。

---

### English
#### 2.1 Why React + Vite SPA instead of Next.js SSR?
- **Maximized Performance**: As an interactive portfolio SPA, all static bundles are pre-compiled and edge-cached on Cloudflare Pages, eliminating Node.js server overhead and SSR cold-start latency.
- **Edge Zero-Maintenance**: Cloudflare Pages delivers unlimited bandwidth and globally distributed Anycast edge routing with zero maintenance overhead.
- **CMS Alignment**: The in-house visual CMS focuses on client-side state manipulation and local-first persistence paired with Firebase Storage, avoiding unnecessary server-side rendering complexity.

#### 2.2 Why Firebase Storage BaaS over Custom Express / NestJS Backend?
- **Architectural Simplicity**: The admin workflow emphasizes media asset staging and structured JSON management. A BaaS model delivers battle-tested authentication and cloud storage without server patching or database maintenance.
- **Attack Surface Minimization**: Confining external state mutations to authenticated client-side sandboxes drastically narrows the public network attack surface.

---

## 3. 核心相依套件庫清單 | Core Dependencies Inventory

本專案嚴格遵循最少依賴原則（Zero Bloat），杜絕過度打包與幽靈依賴。  
*Strictly audited to prevent runtime bloat and eliminate phantom dependencies:*

| 套件名稱 (Package) | 模組分層 (Layer) | 用途描述 (Purpose) |
| :--- | :--- | :--- |
| `react`, `react-dom` | UI Core | 核心視圖元件渲染 / Component rendering engine |
| `lucide-react` | Icons | 介面功能圖示集（如 ArrowUp, ArrowDown, Trash2 等）/ Functional interface icons |
| `firebase` (可選整合 / Optional) | Cloud BaaS | 雲端認證與多媒體檔案上傳中心 / Identity verification & cloud asset staging |
| `vite` | Tooling | 構建引擎與極速開發伺服器 / Next-gen build engine & dev server |
| `tailwindcss`, `@tailwindcss/vite` | Styling | 現代原子化樣式編譯器 / Utility-first CSS compiler |
| `typescript` | Language | 靜態型別分析與編譯期防禦 / Static type analysis & contract enforcement |

---

## 4. 品質保證與工程規範 | Quality Assurance & Engineering Standards

- **靜態型別檢查 (Type Safety Gate)**：每次提交與構建前強制執行 `pnpm exec tsc --noEmit`，保證 0 型別錯誤。
- **生產構建驗證 (Production Build Gate)**：強制執行 `pnpm run build`，Rollup 代碼分塊嚴密壓制於最佳 gzip 尺寸。
- **無障礙對比標準 (WCAG Standards)**：深淺色模式 100% 符合 WCAG 2.2 AAA/AA 標準（本文文字對比度 ≥ 7:1 / 4.5:1）。
