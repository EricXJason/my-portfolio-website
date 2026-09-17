# AGENTS-FRONT.md | 全域 AI Agent 前端特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)[cite: 1]  
> **適用領域**: Web 前端 (React, Vue, Next.js, Nuxt, TS)、UI/UX 設計與 SEO 特化規範庫。純靜態規範庫，完全繼承 `AGENTS.md`。[cite: 1]

---

## 1. 套件管理器標準 (pnpm Protocol)

* **強制優先採用 pnpm**: 所有 Web 前端專案一律強制使用 `pnpm`（`pnpm add`, `pnpm install`, `pnpm run build`），杜絕幽靈依賴。[cite: 1]
* **npm 專案切換防線**: 檢測到專案存在 `package-lock.json` 時，主動詢問使用者是否同意切換至 pnpm。[cite: 1]同意後刪除 `package-lock.json` 與 `node_modules/`，執行 `pnpm install` 重新建立鎖定檔。[cite: 1]

---

## 2. 前端命名慣例 (Naming Standards)

* **檔案系統命名**:
  * 一般腳本、工具函式、全域樣式：`kebab-case`（如 `auth-service.ts`, `main.scss`）。[cite: 1]
  * UI 元件檔案：`PascalCase`（如 `UserProfileCard.tsx`, `Button.vue`）。[cite: 1]
  * 元件樣式模組：`PascalCase.module.scss`。[cite: 1]
* **代碼成員命名**:
  * 公開變數、物件屬性、常態函式：`camelCase`。[cite: 1]
  * 私有成員屬性與方法：強制採用小駝峰加底線前綴 **`private _camelCase`**。[cite: 1]
  * 類別 (Class)、介面 (Interface)、型別 (Type)：`PascalCase`（介面不加 `I` 前綴）。[cite: 1]
  * 常數：`UPPER_SNAKE_CASE`。[cite: 1]
  * Custom Hook：以 `use` 開頭的小駝峰（如 `useDebounce`）。[cite: 1]

---

## 3. 欠缺後端 API 之 TODO 標註規格

當後端端點尚未就緒時，必須使用繁體中文 `TODO:` 註解標註五部曲規格[cite: 1]：
1. **HTTP Method**: GET / POST / PUT / DELETE / PATCH[cite: 1]
2. **預期端點路由**: RESTful 規範路徑（如 `/api/v1/users/{id}`）[cite: 1]
3. **請求參數/載荷**: Header, Path Param, Query Param 或 Body Schema[cite: 1]
4. **預期回應與錯誤碼**: 200 回應結構及 400/401/404 處置[cite: 1]
5. **暫代方案**: 標註當前 Mock 資料結構與未來切換方式[cite: 1]

---

## 4. UI/UX 抗排版崩潰與雙主題無障礙規範

* **文案真實化**: 嚴禁「一站式平台」、「釋放潛能」等假大空行銷詞與 `Lorem Ipsum` 占位符；展示資料具備真實情境語意與長度多樣性。[cite: 1]
* **抗排版崩潰防護**:
  * 動態文字容器強制配置文字溢出防護（`truncate`, `line-clamp-2` 或 `break-words`）。[cite: 1]
  * 包含彈性或截斷文字的 Flex 子元素，強制宣告 **`min-w-0`**，防止撐破容器。[cite: 1]
  * 按鈕與標籤短文字強制宣告 `whitespace-nowrap`，杜絕孤兒換行。[cite: 1]
  * PC 端禁止出現非預期全域水平滾動條，大寬度表格局部封裝於 `overflow-x-auto`。[cite: 1]
* **Header RWD 規範**: 小螢幕斷點下禁止純隱藏選單，強制提供觸控區域 **>= 44x44px** 之漢堡選單按鈕，側邊抽屜支援 ESC 鍵與點擊背景關閉。[cite: 1]
* **雙主題與 WCAG 2.2 AA 標準**:
  * 文字對比度底線：一般文字 **>= 4.5:1**；大字體 **>= 3:1**。[cite: 1]
  * 可點擊目標尺寸強制 **>= 44x44px**。[cite: 1]
  * 鍵盤導向狀態強制提供高對比焦點環，嚴禁裸露 `outline-none`。[cite: 1]
  * 核心動畫強制支援 `prefers-reduced-motion` 系統減弱偏好。[cite: 1]

---

## 5. SEO、社群分享與結構化資料標準

* **語意化 HTML 骨架**: 頁面僅能具備一個唯一 `<h1>`；標題依階梯嚴格排列（`h1` -> `h2` -> `h3`）；主內容包裹於 `<main id="main-content">`；`<img>` 必備描述性 `alt` 屬性。[cite: 1]
* **核心 Meta 標籤清單**: 頁面必須具備 `title`, `description` (120~160 字元), `canonical`, `theme-color`, Open Graph (`og:type`, `og:title`, `og:description`, `og:image`, `og:url`) 與 Twitter Cards (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)。[cite: 1]
* **結構化資料 (JSON-LD)**: 公開頁面必須於 `<head>` 注入標準 `<script type="application/ld+json">`，包含符合 Schema.org 之 `WebSite` 與 `Person` 或 `Organization` 宣告。[cite: 1]
* **爬蟲檢索規範**: 提供合法的 `robots.txt`（宣告 Sitemap 路徑）與 W3C 標準 XML 格式之 `sitemap.xml`。[cite: 1]