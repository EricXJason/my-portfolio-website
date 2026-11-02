# AGENTS-FRONT.md | 全域 AI Agent 前端與 UI/UX 特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-10-27 01:35:00  
> **適用領域**: Web 前端 (Angular, React, Vue, Next.js, TS) 與 UI/UX 設計。純靜態規範庫，完全繼承 `AGENTS.md`。

---

## 1. 套件管理器標準 (pnpm Protocol)

- **強制優先採用 pnpm**: Web 專案一律優先使用 `pnpm`（`pnpm add`, `pnpm install`, `pnpm run build`）。
- **npm 轉換清除 SOP**: 檢測到 `package-lock.json` 時，主動詢問使用者是否切換至 pnpm。獲得同意後刪除 `package-lock.json` 與 `node_modules/`，執行 `pnpm install` 生成 `pnpm-lock.yaml`。

---

## 2. 前端命名慣例與代碼組織

- **檔案命名**:
  - 工具函式、腳本、樣式：`kebab-case`（如 `auth-service.ts`, `main.scss`）。
  - UI 元件檔案：`PascalCase`（如 `UserProfileCard.tsx`）或框架慣例（如 Angular `user-profile.component.ts`）。
  - 元件樣式模組：`kebab-case.component.scss` 或 `PascalCase.module.scss`。
- **代碼成員命名**:
  - 變數、函式：標準 **`camelCase`**。
  - 私有屬性：使用 `private camelCase` 或原生 `#camelCase`（嚴禁無差別強制加底線）。
  - 類別、介面、型別：`PascalCase`（介面不加 `I` 前綴）。
  - 常數：`UPPER_SNAKE_CASE`。
  - Custom Hook / Composable：以 `use` 開頭的小駝峰（如 `useDebounce`）。
- **前端註解與通訊契約對齊**:
  - UI 元件、Custom Hook、Service 頂部必備繁中 Header（職責與 Context/Page 聯動關係）；事件處理與公開方法標記繁中目的。
  - **通訊契約標準**: 嚴格對齊後端 RESTful API 規格（`GET` 讀取、`POST` 新增、`PUT` 完整替換/子資源等冪更新、`PATCH` 局部修改、`DELETE` 刪除）。前端呼叫端點與動詞必須與後端 Controller 100% 精準對齊（SSOT）。
- **欠缺後端 API 之 TODO 標註規格**:
  當後端端點尚未就緒時，必須使用繁體中文 `TODO:` 註解標註：
  ```typescript
  /**
   * TODO: [端點對接] 取得使用者個人資料
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/users/{userId}
   * 3. 請求參數: Header (Authorization: Bearer <TOKEN>), Path (userId)
   * 4. 預期回應: 200 OK (User Profile JSON), 401 Unauthorized, 404 Not Found
   * 5. 暫代方案: 暫時返回本地 mockData，端點就緒後替換
   */
  ```

---

## 3. UI/UX 美學、抗排版崩潰與 RWD 規範

- **前端原生樣式規範 (Native SCSS/CSS Invariant - Strict No External Stylesheets)**:
  - 樣式 100% 自研採用純原生 SCSS/CSS 與 CSS 自訂變數，**嚴格禁止引用 Bootstrap、Tailwind CSS、Bulma 等第三方外部樣式庫**，確保零樣式污染與全站視覺自主可控。
- **抗排版崩潰防護**:
  - 動態文字容器強制配置文字溢出防護（`text-overflow: ellipsis`、`overflow: hidden` 或 `-webkit-line-clamp`）。
  - 包含彈性或截斷文字的 Flex 子元素，強制宣告 `min-width: 0`，防止容器撐破。
  - 按鈕與膠囊標籤短文字強制宣告 `white-space: nowrap`，杜絕孤兒換行。
  - PC 端絕對禁止非預期全域水平滾動條，寬表格必須局部封裝於橫向滾動容器 (`overflow-x: auto`)。
- **Header RWD 規範**:
  - 小螢幕斷點禁止直接隱藏導覽列，強制提供觸控區域 **>= 44x44px** 之漢堡選單按鈕，並實作完整的抽屜/折疊選單機制。
- **雙主題與無障礙**:
  - 文字對比度底線：一般文字 **>= 4.5:1**；大字體 **>= 3:1** (WCAG 2.1 AA)。
  - 鍵盤焦點狀態必須具備高對比焦點環，嚴禁裸露 `outline: none`。
- **戰術 HUD 直角美學與視覺統一底線**:
  - 元件外框與卡片優先貫徹硬朗戰術直角風格（`border-radius: 0` 或微直角 2px~4px），與圖表規範維持全專案高度統一。
  - **全站卡片、標籤與狀態徽章視覺統一底線**: 卡片與狀態徽章一律維持系統標準中性素雅主題，**嚴格禁止為不同類別任意切換五顏六色之花俏背景**，消弭視覺雜訊。
- **全域密碼輸入框小眼睛切換規範 (Password Visibility Toggle)**:
  - 系統內任何涉及密碼填寫之 `<input>`，一律強制配備小眼睛切換功能（Show/Hide Password）。
  - 透過動態 `[type]="showPassword() ? 'text' : 'password'"` 屬性綁定與 Signal 狀態切換，按鈕強制設為 `type="button"` 防止誤送出表單，並配置乾淨自明之 SVG 圖標。

---

## 4. 前端代碼架構規範 (TS 零色票與多分支條件映射)

- **前端 TS 零色票原則 (Strict Zero Color Hex in TypeScript)**:
  - **嚴格禁止在前端 TypeScript 檔案 (.ts) 內直接定義十六進位色票字串 (#hex)、RGB 或 HSL 色碼**。
  - 所有色彩必須 100% 抽離集中於 SCSS/CSS 變數庫（如 `var(--c-...)`）或 CSS 類別統一維護。動態色彩一律透過 CSS 自訂變數或類別傳遞，嚴格維持邏輯與樣式的職責分離。
- **多分支映射條件規範 (Multi-Branch Lookup Map Invariant)**:
  - 凡針對固定枚舉 (Enum)、字串常數或狀態代碼等超過 3 個分支之判斷，**嚴格禁止編寫長鏈 `if - else if - else` 結構**。
  - 強制優先採用 **常數字典映射表 (Lookup Map / Record)** 或 **`switch-case`**，提升執行效率、降低認知負擔並徹底消弭冗餘分支。

---

## 5. 前端與設計服務 MCP 賦能建議

繼承 `AGENTS.md` §1.4，對接設計工具或前端資產（Figma, UI 標註庫等）且環境具備 MCP 時，主動建議啟用以自動提取 Design Token 與解析元件圖層。