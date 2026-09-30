# 技術選型矩陣與版本理由 (02-tech-stack.md)

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-09-30  
> **基準依據**: `package.json`、`pnpm-lock.yaml` 與專案實體配置

---

## 1. 核心技術選型矩陣

| 類別 | 技術 / 套件名稱 | 鎖定版本 | 選型理由與工程價值 |
| :--- | :--- | :--- | :--- |
| **套件管理器** | **pnpm** | `10.5.2` | 採用硬連結 (Hard link) 與符號連結節省磁碟空間，嚴格隔離幻影依賴 (Phantom Dependencies)，安裝速度為 npm 3 倍以上。 |
| **建置工具** | **Vite** | `^8.1.1` (執行時 `8.1.5`) | 次世代前端建置工具，具備極致 ESM 模組熱重載 (HMR) 速度；生產環境整合 Rolldown / Rollup 進行代碼分割與樹搖最佳化 (Tree-shaking)。 |
| **核心前端框架** | **React** | `^19.2.7` | 最穩定現代化 UI 函式庫，支援 React Server Components 邊界相容、`useActionState` 與改進的非同步狀態更新與並行渲染。 |
| **型別系統** | **TypeScript** | `^5.8.2` | 提供端到端型別安全與契約檢查，杜絕前端常見的 `undefined` 與 `null` 執行期錯誤，搭配嚴格型別定義確保資料模型一致。 |
| **樣式引擎** | **Tailwind CSS** | `^4.3.3` | Tailwind v4 全新核心架構，原生效能由 Rust 重構之 Oxide 引擎驅動，無需繁雜的 PostCSS 配置，直接透過 `@tailwindcss/vite` 外掛無縫整合。 |
| **CSS 最佳化** | **lightningcss** | `^1.33.0` | Rust 編寫之極速 CSS 轉換、壓縮與 Polyfill 工具，極大壓縮最終 Bundle 體積並提升解析效能。 |
| **圖標庫** | **lucide-react** | `^1.25.0` | 現代化、模組化 SVG 圖標庫，支援純 Tree-shaking，僅打包實際使用的幾何圖形，避免傳統圖標字型包的冗餘體積。 |
| **前端路由** | **react-router-dom** | `^7.18.3` | 工業級 SPA 宣告式客戶端路由，支援雙專業角色分流 (`/`、`/f`、`/i`) 與 CMS (`/cms/*`) 之動態代碼分割加載。 |
| **雲端持久化** | **firebase** | `^12.19.0` | 整合 Google Cloud 企業級託管服務，包含 Cloud Firestore (NoSQL)、Firebase Storage (媒體儲存) 與 Firebase Authentication (管理員登入)。 |
| **靜態代碼檢驗** | **oxlint** | `^1.71.0` | 基於 Rust 的高效能靜態分析檢驗工具，執行速度比傳統 ESLint 快 50-100 倍，秒級掃除未使用的變數、死碼與語法隱患。 |
| **單元與整合測試** | **vitest** | `^5.0.1` | 與 Vite 共用相同的轉換管線與配置，執行效能極高，提供原生 Jest 語法相容之斷言與 Mock 支援。 |
| **測試環境支援** | **@testing-library/react** | `^16.3.3` | 秉持「站在使用者角度測試介面」的測試哲學，結合 `@testing-library/jest-dom` 提供清晰可讀的 DOM 語法斷言。 |
| **DOM 模擬** | **jsdom** | `^30.1.1` | 純 Node.js 環境下的 W3C DOM 與 HTML 標準實作，使全體前端單元測試無需依賴真實瀏覽器即能高速運行。 |
| **邊緣託管配置** | **wrangler** | - | Cloudflare 邊緣開發工具，支援 Cloudflare Pages 與 Workers 靜態部署，提供全球 Anycast 節點超低延遲存取。 |

---

## 2. 安全防護與版本覆寫策略 (Overrides)

為防止 npm 生態鏈供應鏈攻擊與已知 CVE 漏洞，本專案在 `package.json` 採取明確的安全鎖定策略：

```json
"pnpm": {
  "overrides": {
    "nanoid": "^3.3.18"
  }
}
```

- **CVE 漏洞防禦**: 強制將間接依賴之 `nanoid` 鎖定在修復漏洞之安全版本 `^3.3.18`，防止非預期隨機數生成安全隱患。
- **Sharp 圖片處理器升級**: 本地圖片處理相依之 `sharp` 明確升級至 `^0.35.4`，修復底層 libvips 記憶體安全隱患。
- **執行成果**: `pnpm audit` 達成全專案 **0 已知安全漏洞 (No known vulnerabilities found)**。

---

## 3. 技術決策權衡 (Trade-Off Analysis)

### 3.1 為什麼選擇「全客戶端 SPA + Firebase」而非「Next.js 全端 SSR」？
- **運維成本極致精簡**: 個人作品集重視高可用性與全球低延遲存取，純 SPA 架構可直接部署至 Cloudflare Pages 或 GitHub Pages 等邊緣 CDN，零伺服器維護負擔、零冷啟動 (Cold Start) 延遲，每月營運成本為零。
- **資料可離線備援**: 結合本地靜態 JSON，就算第三方雲端平臺發生異常，網站依然 100% 正常向招募方呈現。
- **豐富互動體驗**: 專案包含自研 Web Audio API 音訊合成器、自訂動態游標、科技感粒子背景與 Canvas 代碼流動畫，純前端架構能最大化發揮瀏覽器硬體加速與流暢渲染優勢。
