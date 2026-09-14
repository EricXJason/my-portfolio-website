# AGENTS-FRONT.md | 全域 AI Agent 前端、UI/UX 與 SEO 特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **適用領域**: Web 前端 (React, Vue, Next.js, Nuxt, Angular, Svelte, HTML/SCSS/TS)、跨裝置 UI/UX 設計與語意化 SEO 工程  
> **協定性質**: 本文件為純靜態規範庫，**不包含任何可調用指令**。專門定義前端命名慣例、套件管理器 (pnpm 優先與轉換清除 SOP)、UI/UX 抗排版崩潰體系、雙主題對稱性、欠缺 API 之繁體中文 TODO 對接標準以及全方位 SEO / 結構化資料規範。  
> *Release: 2026-09-14*

---

## 🧭 Agent 階段生命週期巡檢地圖 (Lifecycle Fast-Path Routing)

為加速 Agent 閱讀，執行前端任務時請直接跳轉對應章節進行局部深讀：

```
[情境 A: 專案啟動/套件安裝/建置] ──> 閱讀【第 1 章】(pnpm 強制原則、npm 轉換與舊內容清除 SOP)
│
[情境 B: 前端檔案/元件/成員命名] ──> 閱讀【第 2 章】(kebab-case/PascalCase 與 private _camelCase)
│
[情境 C: 前端先行/缺乏實體後端] ──> 閱讀【第 3 章】(繁體中文 TODO 四部曲規格標準)
│
[情境 D: UI/UX/視覺/文案/RWD] ──> 閱讀【第 4 章】(文案真實化、抗排版崩潰、Header RWD 選單、雙主題)
│
[情境 E: SEO/語意化/社群分享] ──> 閱讀【第 5 章】(HTML 語意、Meta 矩陣、OG/Twitter、JSON-LD、Sitemap)
```

---

## 0. 🏆 獨立運作降級與優先級覆寫 (Standalone & Overrides)

本章節確立本特化規範庫與母協定之交互關係與覆寫權限。

### 0.0 獨立運作降級條款
本條款定義獨立環境下的預設運作基準：
若當前專案未提供 `AGENTS.md`，本文件自動啟用獨立降級模式：強制使用臺灣繁體中文對話、檔案頂部包含繁體中文 Header 區塊註解、私有欄位採用 `_camelCase`、一律優先採用 `pnpm`。

### 0.1 前端優先級覆寫原則
本條款確立前端特化語法與樣式之最高裁判權限：
本文件之 UI 元件命名（PascalCase）、私有成員命名（`private _camelCase`）、套件管理器標準、Header RWD 選單機制、抗排版崩潰條款與第 5 章之全方位 SEO 規範，具備最高法律效力，強制覆寫任何通用規範。

---

## 1. 📦 套件管理器標準與 pnpm 轉換清除協定 (pnpm Protocol & Cleanup SOP)

本章節確立 Node.js 與 Web 生態系之依賴管理最高準則。

### 1.1 強制優先採用 pnpm
本條款規範套件管理工具之選用原則：
所有 Web 前端專案**一律強制優先使用 `pnpm`** 進行套件管理與腳本執行（如 `pnpm add`, `pnpm install`, `pnpm run build`），杜絕幽靈依賴並保障磁碟快取效率。

### 1.2 npm 專案主動詢問機制
本條款建立既有 npm 專案之攔截確認防線：
當 Agent 開啟或介入既有專案，檢測到專案存在 `package-lock.json` 或由 `npm` 管理時，**嚴禁靜默沿用 npm 或擅自直接切換**，必須立即使用繁體中文主動詢問使用者：
> 「檢測到當前專案目前使用 npm 管理（存在 package-lock.json）。本架構最高工業標準強制優先採用 pnpm。請問是否同意將專案切換為 pnpm？[Y/N]」

### 1.3 切換至 pnpm 之舊內容徹底清除 SOP (Cleanup Upon Migration)
本條款規範切換套件管理器時之徹底清除步驟：
當人類回覆確認（Y）切換為 pnpm 後，Agent **必須執行徹底清理，拔除所有 npm 舊內容**，嚴禁殘留造成衝突：
1. **刪除 npm 鎖定檔**: 徹底移除根目錄之 `package-lock.json`。
2. **清空舊依賴目錄**: 徹底移除 `node_modules/` 目錄。
3. **重新乾淨安裝**: 執行 `pnpm install` 重新建立純淨的符號連結依賴並生成 `pnpm-lock.yaml`。
4. **確認執行命令一致**: 後續所有套件安裝與建置腳本全面切換為 `pnpm`。

---

## 2. 🔠 前端命名慣例與代碼風格 (Naming Standards)

本章節規範現代 Web 前端環境之嚴格標準命名慣例。

### 2.1 檔案系統命名
本條款定義前端各層檔案之命名風格：
* **一般腳本、樣式與工具檔案**: 強制全小寫並以連字號分隔 **`kebab-case`**（例如 `auth-service.ts`, `button-primary.scss`, `date-utils.js`）。
* **UI 元件檔案 (React / Vue / Svelte / JSX / TSX Component)**: 強制大駝峰 **`PascalCase`**（例如 `Button.tsx`, `UserProfileCard.vue`）。
* **樣式模組檔案**: 依賴元件時強制採用 `PascalCase.module.scss`，全域樣式採用 `kebab-case.scss`。

### 2.2 代碼成員命名 (全框架通用)
本條款確立全前端框架通用之程式碼成員命名規範：
* **公開變數、物件屬性、常態函式**: 小駝峰 **`camelCase`**（例如 `userProfile`, `calculateDiscount()`）。
* **私有成員屬性與方法 (Private Fields & Methods)**: 不論在 TypeScript、Angular、Vue 或 React 內部，只要定義為 **`private` 或非公開內部成員**，強制採用小駝峰加底線前綴 **`_camelCase`**（例如 `private _httpService`, `private _calculateInternalHash()`）。
* **類別 (Class)、介面 (Interface)、型別別名 (Type Alias)**: 大駝峰 **`PascalCase`**。介面名稱不加 `I` 前綴。
* **常數 (Constant)**: 全域固定值使用 **`UPPER_SNAKE_CASE`**（例如 `API_TIMEOUT_MS`）。
* **Custom Hook**: 強制以 `use` 開頭的小駝峰（例如 `useWindowResize()`, `useDebounce()`）。

---

## 3. 🔌 欠缺依賴與後端 API TODO 繁體中文標註規格

本章節明訂當專案處於前端先行、後端端點尚未就緒時之通訊協定對接標註標準。

### 3.1 欠缺後端 API 之五部曲規格要求
本條款規範缺少後端時之標準繁體中文註解規格：
* **TODO 格式**: 一律以大寫 `TODO:` 為前綴，說明內容**強制完全使用臺灣繁體中文**。
* **五部曲內容**:
  1. **HTTP Method**: GET / POST / PUT / DELETE / PATCH。
  2. **預期端點路由 (Endpoint Path)**: RESTful 規格路徑（如 `/api/v1/players/{id}`）。
  3. **請求載荷 (Request Payload)**: Header, Path Param, Query Param 或 JSON Body 結構與型別。
  4. **預期回應與狀態碼**: 200/201/204 回應 Schema 及 400/401/403/404 錯誤碼處置。
  5. **暫代方案**: 說明目前採用之本地 Mock 資料與未來切換方式。

#### 範例:
```typescript
/**
 * TODO: [後端端點對接] 取得使用者個人資料與權限角色
 * 1. HTTP Method: GET
 * 2. 預期端點: /api/v1/users/{userId}/profile
 * 3. 請求參數:
 *    - Header: Authorization: Bearer <JWT_ACCESS_TOKEN>
 *    - Path Param: userId (string, UUID)
 *    - Query Params: 無
 * 4. 預期回應:
 *    - 200 OK: { success: true, data: { id: string, name: string, role: string } }
 *    - 401 Unauthorized: 憑證無效或過期
 *    - 404 Not Found: 查無該使用者
 * 5. 當前狀態: 暫時返回本地 mockUserProfile，待後端 API 部署後切換為 apiClient 呼叫。
 */
export async function getUserProfile(userId: string) {
  return Promise.resolve(mockUserProfile);
}
```

---

## 4. 🎨 現代高階 UI/UX 設計工程、文案真實化與抗崩潰排版協定

本章節確立 Web 前端介面之視覺美學、真實文案、結構容錯與無障礙標準。

### 4.1 內容與文案去 AI 模板化 (Anti-AI Copywriting & Real Content)
本條款杜絕虛浮的 AI 生成文字，確保產品文案具備真實商務語意：
* **嚴禁「假大空」行銷模板詞**: 嚴禁在未經要求下出現「一站式平台」、「賦能未來」、「釋放您的潛能」等陳腔濫調。標題與文案必須**精確陳述功能、操作目標或技術參數**（例如：「分散式日誌查詢中心」、「即時 WebSocket 延遲監控 (P99 < 50ms)」）。
* **杜絕敷衍占位符 (No Lazy Placeholders)**: 嚴禁使用 `Lorem Ipsum`、`Card Title 1`、`test@test.com`。所有卡片、表格假資料必須具備真實情境語意與長度多樣性。
* **文字截斷與容器適配 (Text Overflow Resilience)**: 所有可能動態注入文字的容器，必須明確配置文字溢出防護（如 `truncate`、`line-clamp-2` 或 `break-words`），杜絕固定容器文字腰斬事故。

### 4.2 排版工程與抗崩潰防護 (Layout Robustness & Anti-Breakage)
本條款定義前端切版之物理防護底線，徹底杜絕非預期排版事故：
* **PC 端絕對禁止非預期橫向拖曳 (No Accidental Horizontal Scroll)**: 嚴禁因父容器寬度超出視窗導致全域水平滾動條。所有外層容器強制以 `w-full overflow-x-hidden` 或響應式 Grid / Flex 包裹；資料表格若需橫向滾動，必須局部封裝於專屬容器內（`overflow-x-auto`）。
* **杜絕小元件孤兒換行 (No Orphan Line-Wrapping)**: 按鈕（Button）、標籤（Badge / Tag）、導覽列項目（Nav Items）上的短文字，強制加上 `whitespace-nowrap`，嚴禁最後一個字掉到下一行形成孤兒字。
* **Flexbox 最小尺寸防禦 (Flexbox `min-w-0` Rule)**: 在任何包含彈性文字或截斷文字的 Flex 子元素上，**必須明確宣告 `min-w-0`**，防止 Flex 預設 `min-width: auto` 撐破外層容器。

### 4.3 Header 導覽列 RWD 響應式與選單按鈕強制規範 (Responsive Header & Menu Protocol)
本條款規範 Header 在小螢幕下的互動呈現標準：
* **禁止純隱藏與擠壓**: 嚴禁僅宣告 `hidden md:flex` 隱藏選單卻無手機端按鈕，亦嚴禁將導覽項目硬擠同一列。
* **選單按鈕 (Menu Button) 規格**: 在小螢幕斷點（`< 768px` 或 `< 1024px`），桌面導覽安全隱藏，同時強制顯示選單漢堡圖標按鈕，點擊觸控區域強制 **>= 44x44px**。
* **抽屜選單功能完整性**: 點擊後具備可用之側邊抽屜（Drawer）或折疊面板，完整容納導覽連結、語系與主題開關；按鈕標註 `aria-expanded` 與 `aria-label`，點擊背景或按 `ESC` 鍵可安全關閉。

### 4.4 雙主題對稱性與 WCAG 2.2 AA 標準 (Symmetric Theming & Accessibility)
本條款確立深淺色主題同等精緻度與無障礙標準：
* **雙模式對稱深度設計**:
  * **深色模式 (Dark Mode)**: 避免純死黑（`#000000`），表面基底採用具備色調傾向之深灰（Slate / Zinc: `#09090b`、`#0f172a`），層次清晰。
  * **淺色模式 (Light Mode)**: 避免純白底配純黑字，採用米白 / 冷白基底（`#f8fafc`、`#f4f4f5`），搭配炭黑文字（`#09090b`），質感與深色 100% 對稱。
* **WCAG 2.2 AA 無障礙合規底線**:
  * **文字與背景對比度**: 一般文字對比度強制 **>= 4.5:1**；大字體（18pt 以上或 14pt 粗體）對比度強制 **>= 3:1**。
  * **可點擊目標尺寸**: 所有按鈕、圖標最小點擊區域強制 **>= 44x44px**。
  * **鍵盤聚焦可見性**: 嚴禁使用 `outline-none`。鍵盤導引之 `:focus-visible` 狀態強制提供高對比焦點環（如 `ring-2 ring-offset-2 ring-primary`）。
  * **減弱動態偏好 (Prefers-Reduced-Motion)**: 核心動畫強制支援系統級動態減弱偏好，提供靜態或低動態替代方案。

---

## 5. 🌐 現代前端 SEO、社群分享卡片與結構化資料規範庫 (SEO & Semantic Web Standards)

本章節定義現代 Web 前端專案之語意化 HTML、搜尋引擎最佳化（SEO）、社群分享協定（Open Graph / Twitter Cards）與結構化資料（Schema.org JSON-LD）之最高工業級標準。

### 5.1 語意化 HTML 骨架與標題層級規範 (Semantic HTML Structure)
本條款定義頁面 HTML5 語意化結構之工程底線：
* **唯一的主標題 (`<h1>`)**: 每個獨立頁面**強制具備且僅能具備一個 `<h1>` 標籤**，明確代表該頁面的核心主題。
* **嚴格標題層級階梯 (Heading Hierarchy)**: 標題必須依階層順序呈現（`h1` -> `h2` -> `h3` -> `h4`），嚴禁跳級使用（例如 `h1` 下方直接放 `h3`）。
* **語意化區塊標籤**:
  * 主內容區域強制包裹於 `<main id="main-content">` 中。
  * 導覽列強制使用 `<nav>`，頁首使用 `<header>`，頁尾使用 `<footer>`。
  * 獨立內容單元使用 `<article>`，關聯內容群組使用 `<section>`，次要補充資訊使用 `<aside>`。
  * 嚴禁無意義的「`div` 濃湯」取代語意化結構。
* **圖片無障礙與 SEO 屬性**: 所有 `<img>` 標籤**強制具備描述性 `alt` 屬性**；若為純裝飾性圖形，明確標註 `alt=""` 與 `aria-hidden="true"`。

### 5.2 核心頁面級 Meta 標籤矩陣 (Mandatory Meta Matrix)
本條款定義所有公開網頁 `<head>` 區段必須強制具備之核心 Meta 標籤清單：
```html
<!-- 基礎編碼與視窗設定 -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- 核心 SEO 標籤 -->
<title>精確頁面標題 | 品牌或專案名稱</title>
<meta name="description" content="包含核心關鍵字且長度介於 120 至 160 字元的精準頁面摘要描述。" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="https://example.com/current-canonical-url" />

<!-- 行動裝置與主題色 -->
<meta name="theme-color" content="#030712" />
```

### 5.3 社群分享卡片協定 (Open Graph & Twitter Cards Protocol)
本條款規範鏈結於社群平台（Facebook, X/Twitter, LINE, Discord 等）分享時之卡片渲染標準：
```html
<!-- Open Graph Protocol (OG) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="專案或品牌正式名稱" />
<meta property="og:title" content="社群分享高吸引力標題" />
<meta property="og:description" content="社群預覽精準摘要描述。" />
<meta property="og:url" content="https://example.com/canonical-url" />
<meta property="og:image" content="https://example.com/assets/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="zh_TW" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="社群分享高吸引力標題" />
<meta name="twitter:description" content="社群預覽精準摘要描述。" />
<meta name="twitter:image" content="https://example.com/assets/og-image.jpg" />
```

### 5.4 結構化資料標記規範 (Schema.org / JSON-LD Standards)
本條款要求公開頁面必須於 `<head>` 或 `<body>` 底端注入標準結構化資料（JSON-LD），讓搜尋引擎能以 Rich Snippets 形式索引：
* **通用規格**: 採用 `<script type="application/ld+json">` 格式，禁止舊式 Microdata。
* **標準 Schema 範例 (WebSite & Person / Organization)**:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "專案名稱",
      "description": "專案核心描述",
      "inLanguage": "zh-TW"
    },
    {
      "@type": "Person",
      "@id": "https://example.com/#person",
      "name": "許哲誠 (HSU, CHE-CHENG)",
      "jobTitle": "Full-Stack Engineer & Interactive Media Creator",
      "url": "https://example.com/"
    }
  ]
}
</script>
```

### 5.5 搜尋引擎爬蟲導引與多語系規範 (Crawling & Internationalization)
本條款確立網站爬蟲導向與多語系對應機制：
* **`robots.txt` 規格**: 專案公開根目錄必須具備合法的 `robots.txt`，清楚定義允許之爬取範圍並指向 Sitemap：
  ```txt
  User-agent: *
  Allow: /
  Disallow: /cms/
  Disallow: /admin/
  Sitemap: https://example.com/sitemap.xml
  ```
* **`sitemap.xml` 規格**: 必須提供符合 W3C XML Sitemap 協定之站點地圖，列出所有可公開訪問之 URL、`lastmod`、`changefreq` 與 `priority`。
* **多語系 SEO 宣告**:
  * HTML 根節點必須依當前語系明確標註 `<html lang="zh-TW">` 或 `<html lang="en">`。
  * 多語系頁面必須配置正確的 `<link rel="alternate" hreflang="zh-TW" href="..." />` 與 `<link rel="alternate" hreflang="x-default" href="..." />`。

### 5.6 品牌圖標矩陣與 PWA 基礎資產 (Brand Iconography & Manifest)
本條款規範各平台瀏覽器書籤與桌面捷徑之圖標配置：
* `favicon.ico`: 支援傳統瀏覽器（32x32px）。
* `favicon.svg`: 現代瀏覽器原生向量圖標，支援深淺色模式自適應。
* `apple-touch-icon.png`: iOS Safari 桌面捷徑專用（180x180px）。
* `manifest.webmanifest` (或 `manifest.json`): PWA Web 應用程式清單，提供名稱、主題色與圖標清單。