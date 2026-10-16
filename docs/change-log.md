# 專案修訂歷程記錄庫 (change-log.md)

> **維護準則**: 本檔案永遠常駐，全篇強制 100% 臺灣繁體中文。每次完成修改或指令任務時，直接將最新記錄插入檔案最頂端（免讀取歷史內容，零 Token 損耗）。

---

## [2026-10-16 06:51] - 全面移除 CMS「設為預設值」功能與按鈕，預設基準回歸 IDE 程式碼維護
- **改動原因**: 依使用者明確工程決策，CMS 後臺責任邊界為「編輯、存檔與還原」，嚴禁於 CMS 介面中修改或覆蓋系統預設值（預設值永遠由工程師於 IDE 原始碼維護），故徹底清除全站所有模組之「設為預設值」按鈕與 Baseline 機制。
- **具體內容**:
  1. **全模組按鈕與函式徹底清除**: 自以下 7 大編輯器模組徹底移除 `設為預設值 (Set as Default)` 按鈕、`BookmarkCheck` 圖示匯入及 `handleSetDefault` 函式：
     - [src/cms/components/CmsProjectsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsProjectsEditor.tsx)
     - [src/cms/components/CmsSkillsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsSkillsEditor.tsx)
     - [src/cms/components/CmsAboutEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsAboutEditor.tsx)
     - [src/cms/components/CmsHeroEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsHeroEditor.tsx)
     - [src/cms/components/CmsExperienceEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsExperienceEditor.tsx)
     - [src/cms/components/CmsCertificationsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsCertificationsEditor.tsx)
     - [src/cms/components/CmsGalleryEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsGalleryEditor.tsx)
  2. **還原邏輯單純化**: 各模組的「還原預設」對話框與邏輯徹底移除 `baselineRaw` 判斷，統一直接還原至 IDE 定義之 `getFallbacksByProfile(profile)` 程式碼常數。
  3. **品質把關**: 14 檔測試套件 77 項測試 100% 通過，`pnpm build` 建置驗證 0 錯誤。
- **影響範圍**: 全體 7 大 CMS 編輯器組件、`docs/change-log.md`。

---

## [2026-10-16 06:45] - 深度修復「全部還原預設」之快取殘留問題並強化全域零延遲瞬間刷新
- **改動原因**: 使用者反映 CMS 頂部導覽列「全部還原預設」按鈕執行後無作用，排查發現過往還原邏輯僅清理部分 profile 快取，殘留 `portfolio_projects_data`、`portfolio_custom_translations`、各分類順位快取與 baseline，且 Firestore 雲端寫入權限異常或延遲可能導致本地介面未即時刷新。
- **具體內容**:
  1. **快取徹底深層淨化**: 於 [src/context/PortfolioDataContext.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/context/PortfolioDataContext.tsx) 的 `resetAllToDefaults` 中，納入舊版全域 key（`portfolio_projects_data`, `portfolio_custom_translations` 等）、雙模式分類順位快取（`portfolio_${profile}_project_categories_order`）、預覽與 baseline 之全量清理。
  2. **前端本地瞬間刷新 (Zero-Latency UI Reset)**: 調用 `resetAllToDefaults` 時，優先立即重設 React State 與廣播全域事件（包含 `portfolio_project_categories_order_updated`），再行容錯非阻塞雲端同步，杜絕因雲端延遲或權限問題卡住本地還原。
  3. **編輯器內部全方位對齊**: 於 [src/cms/components/CmsProjectsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsProjectsEditor.tsx) 的 `handleResetAll` 與模組獨立 `triggerResetDialog` 中，同步將 `categoryOrder` 重設為初始順序、`filterCategory` 重設為 `'all'`、重置 `projectsMeta` 與活動專案，工作區狀態徹底還原。
  4. **品質驗證**: 14 檔 77 項測試 100% 通過（耗時降至 5.69 秒），`pnpm build` 0 錯誤。
- **影響範圍**: `src/context/PortfolioDataContext.tsx`, `src/cms/components/CmsProjectsEditor.tsx`, `docs/change-log.md`。

---

## [2026-10-16 06:38] - CMS 專案作品模組新增分類順序調配控制列與 F/I 雙模式獨立順位設定
- **改動原因**: 依使用者需求，CMS「專案作品」模組應具備如同「專業技能」模組之分類順序調配控制列與 `⇄` 順位互換按鈕，並支援在全端模式 (F) 與互動模式 (I) 獨立設定與切換專案分類順位，兼具分類點擊即時篩選編輯清單之功能。
- **具體內容**:
  1. **CMS 專案分類控制列與順位交換**: 於 [src/cms/components/CmsProjectsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsProjectsEditor.tsx) 加入頂部「作品分類順序與檢視」列，支援「全部專案」與各分類標籤切換，標籤間具備 `⇄` 順位互換按鈕，點擊可直接重排專案分類優先序。
  2. **專案清單順序同步重新對齊**: 點擊 `⇄` 交換分類時，垂直專案清單同步依新的分類優先序對齊排序，並自動更新每個專案的 `order` 序號。
  3. **F 與 I 雙模板獨立順位持久化**: 支援將分類順序儲存於 Firestore 雙集合之 `site_settings.project_categories_order`，同時寫入 `portfolio_fullstack_project_categories_order` 與 `portfolio_interactive_project_categories_order` 本地快取，F 與 I 模式相互隔離、互不覆蓋。
  4. **前臺展示即時聯動與動態排序**: 於 [src/components/Projects.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/components/Projects.tsx) 串接 `categoryOrder`，前臺分類篩選列按自訂順位動態生成，專案清單穩定排序亦依分類自訂順位優先排布，並監聽 `portfolio_project_categories_order_updated` 事件即時反應。
  5. **測試與建置把關**: 14 檔測試套件 77 項測試 100% 通過，`pnpm build` 建置驗證 0 錯誤。
- **影響範圍**: `src/cms/components/CmsProjectsEditor.tsx`, `src/components/Projects.tsx`, `docs/change-log.md`, `docs/check-list.md`。

---

## [2026-10-16 06:31] - 擴充「前端開發 (Frontend Dev)」專案分類並合理調整 CMS 系統與前臺展示
- **改動原因**: 依使用者需求，為純前端網站建立獨立的專業分類「前端開發」，使技術層次更分明，保留「全端開發」給未來 Java + 前端之端到端專案，並對 CMS 管理系統與前臺篩選進行合理相容調整。
- **具體內容**:
  1. **領域型別擴充**: 於 [src/types/portfolio.ts](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/types/portfolio.ts) 將專案 `category` 擴充為 `'interactive' | 'fullstack' | 'frontend'`。
  2. **CMS 編輯器升級**: 於 [src/cms/components/CmsProjectsEditor.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/cms/components/CmsProjectsEditor.tsx) 加入「前端開發」下拉選項與清單狀態徽章，並將精選作品上限邏輯整合為 Web 網頁領域（全端/前端合計最多 3 項，避免與互動領域衝突）。
  3. **前臺介面與篩選整合**: 於 [src/components/Projects.tsx](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/components/Projects.tsx) 新增「前端開發」標籤（天藍色系），過濾器支援獨立切換 `frontend`，並在首頁精選並排區塊將 Web 領域標頭對齊為「全端／前端開發」。
  4. **服務層排序對齊**: 於 [src/services/portfolioDataService.ts](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/src/services/portfolioDataService.ts) 讓全端與前端專案在 Web 模式下皆優先排列。
  5. **測試與品質把關**: 14 檔 77 項測試全數通過，`pnpm build` 0 錯誤。
- **影響範圍**: `src/types/portfolio.ts`, `src/cms/components/CmsProjectsEditor.tsx`, `src/components/Projects.tsx`, `src/services/portfolioDataService.ts`, `docs/change-log.md`。

---

## [2026-10-16 06:15] - 成功發布 Cloud Firestore 生產安全性規則至雲端
- **改動原因**: 使用者完成 Firebase 授權登入後，因 Firebase Storage 雲端尚未於控制台啟用导致整體部署失敗，需將規則部署目標精準聚焦於已啟用的 Firestore。
- **具體內容**:
  1. 執行 `pnpm exec firebase deploy --only firestore:rules`，成功編譯並將 [firestore.rules](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/firestore.rules) 發布至雲端 `my-portfolio-website-f2e03`。
  2. 於 [package.json](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/package.json) 將 `deploy:rules` 拆分為專注的 `firebase deploy --only firestore:rules`，並新增獨立的 `deploy:storage` 供未來啟用 Storage 後使用。
  3. 驗證部署狀態：`✔ cloud.firestore: rules file firestore.rules compiled successfully`、`✔ Deploy complete!`。
- **影響範圍**: `package.json`, `docs/change-log.md`。

---

## [2026-10-16 06:12] - 整合 firebase-tools 工具鏈與自動化部署指令
- **改動原因**: 滿足指令自動化部屬需求，將 Firebase CLI 納入專案相依並提供專屬部署腳本。
- **具體內容**:
  1. 安裝 `firebase-tools` 至 `devDependencies`，消除每次 `npx` 重複下載開銷。
  2. 於 [package.json](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/package.json) 建立 `pnpm deploy:rules` 捷徑指令，支援一鍵發布 Firestore 與 Storage 安全規則。
- **影響範圍**: `package.json`, `pnpm-lock.yaml`, `docs/change-log.md`。

---

## [2026-10-16 06:08] - 排除 Cloud Firestore 存取權限到期警告並完善安全規則設定
- **改動原因**: 收到 Firebase 系統通知信警告「Cloud Firestore 測試模式存取權即將於 1 天後到期」，主因為初始建立資料庫時採用預設 30 天測試模式規則，需發布高強度生產環境安全性規則。
- **具體內容**:
  1. **校驗與加固安全規則**: 審核 [firestore.rules](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/firestore.rules)，確認雙履歷集合（`portfolio_fullstack_dev`、`portfolio_interactive_app_dev`）前臺公開唯讀、寫入嚴格限制 Firebase Auth 登入管理員，未知路徑全面阻斷；同步升級 [storage.rules](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/storage.rules) 納入 `portfolio_assets` 路徑與 15MB 圖片格式防護。
  2. **補齊 Firebase 設定檔**: 新增 [firebase.json](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/firebase.json) 與 [.firebaserc](file:///Users/hsuche-cheng/Documents/project/my-portfolio-website/.firebaserc) 鎖定 `my-portfolio-website-f2e03`，串連本地規則與雲端部署規格。
  3. **提供排除指引**: 整理 Firebase Console 線上後臺一鍵發布步驟與 CLI 部署指南。
- **影響範圍**: `firestore.rules`, `storage.rules`, `firebase.json`, `.firebaserc`, `docs/change-log.md`。

---

## [2026-10-01 01:23] - 徹底排除架構質疑盲點：完善 NoSQL ERD 投影契約與協定滿分防禦
- **改動原因**: 響應使用者「把所有質疑和問題嚴格排除，達到嚴格滿分」之最高指示，針對先前提出之 NoSQL 語意張力、多重關聯、MCP 頻率守衛等盲點，以可執行之硬性條款全面落實修訂。
- **具體內容**:
  1. **NoSQL ERD 投影標註**: 於 `AGENTS-BACK.md` 第 2 節明文確立 NoSQL 文件庫反正規化結構投影為 ERD 表格時，強制標記存儲型態，徹底杜絕外鍵 Join 與關聯約束之語意混淆。
  2. **協定漏洞閉環**: 全面校驗五大協定檔案與專案實體代碼，確保無死角對齊「雙中樞＋隨插即用」體系。
- **影響範圍**: `AGENTS-BACK.md`, `docs/change-log.md`。

---

## [2026-10-01 01:18] - 全域加固五大協定 Hub-Spoke 隨插即用架構、Unity 阻斷守衛與分類選配規則
- **改動原因**: 依據使用者指導，明確確立 `AGENTS.md` 與 `AGENTS-GIT.md` 為所有專案永遠必備之核心雙中樞，其餘三大特化協定為按需隨插即用；對全套五大協定執行極致低 Token、高密度工程事實之全面稽核與加固。
- **具體內容**:
  1. **中樞自治架構確立 (Hub & Spoke Protocol)**: 於 `AGENTS.md` 第 1.1 節明訂 `AGENTS.md` + `AGENTS-GIT.md` 具備 100% 獨立自洽運行能力；其餘特化模組按領域導入，缺失時通用協定自治承接，嚴禁報錯。
  2. **跨專案防護硬阻斷**: 於 `AGENTS.md` 第 0 節明訂若檢測到專案存在 `Assets/`、`ProjectSettings/` 或 `AGENTS-UNITY.md`，收到 `嚴格專案最佳化` 時強制就地攔截阻斷，杜絕 Unity GUID 災難。
  3. **check-list 實體分類選配**: 於 `AGENTS.md` 第 4.2 節規範二級分類依實體架構選配，非 Web 專案依實體技術分層命名，嚴禁建立無實質業務之空標題。
- **影響範圍**: `AGENTS.md`, `AGENTS-GIT.md`, `docs/change-log.md`。

---

## [2026-10-01 01:14] - 確立 AI 回應前強制原子 Commit 守衛並將腳本 Header 規格統一為雙等號儀表板方框風格
- **改動原因**: 依據使用者指正，徹底消除 AI 結束對話時遺留未提交變更之斷層問題，將「回應前強制原子 Commit」確立為全域不可逾越之守衛；並依照使用者喜好將腳本頂部 Header 標準範本統一為具備極高可讀性之「雙等號儀表板方框」風格。
- **具體內容**:
  1. **強制原子 Commit 守衛 (Mandatory Commit Guard)**:
     - 於 `AGENTS.md` 第 1.1 節與 `AGENTS-GIT.md` 第 2 節明文確立：在具備 Git 且處於 `feature` 分支下，Agent 每次完成代碼生成、修改或任務後，**在向人類輸出最終回覆文字前，強制必須自動於背景執行 `git add . && git commit -m "..."`**！
     - 確立「工作區零殘留底線」：絕對嚴禁結束對話時遺留 Uncommitted changes 於本地工作區，未 commit 即回覆視為重大違規。
  2. **儀表板雙等號方框 Header 標準化**:
     - 於 `AGENTS.md` 第 2 節將範本更新為使用者偏好之高規格儀表板風格（包含檔案名稱、所屬模組、責任描述、架構分層、聯動關係、邊界處理）。
     - 同步將 `src/services/firebase.ts` 與 `src/types/portfolio.ts` 等腳本 Header 對齊該高規格方框標準。
- **影響範圍**: `AGENTS.md`, `AGENTS-GIT.md`, `src/services/firebase.ts`, `docs/change-log.md`。

---

## [2026-10-01 01:10] - 執行「專案註解確認」全量稽核：達成 64 支實體腳本頂部做什麼與聯動註解 100% 合格
- **改動原因**: 響應使用者「專案註解確認」核心交付指令，全面稽核並補齊專案實體代碼腳本之繁中註解，確立非必要之設定檔不贅述註解，確保代碼條理分明、雜訊極低且可讀性高。
- **具體內容**:
  1. **全域掃描稽核**: 針對 `src/` 底下 64 支實體 TypeScript / React 腳本進行深度註解稽核。
  2. **補齊關鍵標記**: 補齊 `src/services/firebase.ts`、`src/cms/components/CmsVisibilityToggle.tsx`、`src/types/portfolio.ts` 之標準 Header（模組責任、上游依賴與下游消費聯動清單），並在關鍵方法與開關元件補齊繁中業務目的說明。
  3. **稽核成果**: 全專案 64 支腳本達成 **100% 完全合格**，打開任何腳本皆能在 3 秒內掌握核心責任與聯動邊界；純設定檔保持原汁原味，杜絕滿版雜亂。
- **影響範圍**: `src/services/firebase.ts`, `src/cms/components/CmsVisibilityToggle.tsx`, `src/types/portfolio.ts`, `docs/change-log.md`。

---

## [2026-10-01 01:05] - 建立「專案註解確認」核心指令並確立腳本頂部聯動與方法目的之全域默認規範
- **改動原因**: 依據使用者最新要求，確立程式碼可讀性工程標準：任何代碼腳本即便未獲人類特別提醒，**默認必須**附帶頂部繁中 Header（說明該腳本做什麼、與哪些模組聯動）以及方法業務目的註解；並於指令矩陣正式新增「**`專案註解確認`**」核心 SOP。
- **具體內容**:
  1. **核心指令矩陣新增**: 於 `AGENTS.md` 第 0 節正式納入「**`專案註解確認`**」，作為可讀性稽核與交付之標準觸發指令。
  2. **日常預設默認落實底線 (Default Invariant)**:
     - 凡建立、修改或重構腳本時，默認自動落實兩大必備註解：
       - **腳本頂部 Header**: 說明「該腳本是做什麼的」以及「和哪些腳本/模組聯動」（標註上游依賴與下游消費）。
       - **方法上方目的說明**: 所有公開介面、內部核心邏輯函式上方清楚標明「該方法的業務目的」。
     - 達到工程師或 Agent 每次打開任何腳本時，能在 3 秒內快速理解與排查故障。
  3. **特化協定協同對齊**:
     - `AGENTS-FRONT.md`: 明定 UI 元件、Hook、Service 頂部必備功能與 Context/Page 聯動說明，Handlers 與方法必備目的說明。
     - `AGENTS-BACK.md`: 明定 Controller、Service、Repository 頂部必備職責與上下游資料表/API 聯動說明，核心方法必備業務目的說明。
     - `AGENTS-UNITY.md`: 明定 MonoBehaviour、ScriptableObject 頂部必備職責與場景物件/腳本聯動說明，方法必備 XML `<summary>` 目的說明。
- **影響範圍**: `AGENTS.md`, `AGENTS-FRONT.md`, `AGENTS-BACK.md`, `AGENTS-UNITY.md`, `docs/change-log.md`。

---

## [2026-10-01 01:02] - 全面確立 SSOT 永恆落實底線並建立嚴格程式碼註解時機與格式範本規格
- **改動原因**: 依據使用者最新工程指導，將 SSOT (Single Source of Truth) 單一真實資料源提升為最高架構底線，並針對程式碼註解之「何時該寫 (Why/When)」與「標準格式 (How)」建立明確嚴格之可執行規範。
- **具體內容**:
  1. **SSOT 永恆落實底線**: 於 `AGENTS.md` 第 3 節確立全系統資料模型、狀態、常數、設定與規則永遠僅能有唯一真實來源，嚴禁重複宣告硬編碼衍生副本，任何下游存取一律單向依賴真實源頭；於 `AGENTS-BACK.md` 同步強化實體與契約之 SSOT 映射約束。
  2. **程式碼註解時機規範 (Mandatory Triggers)**: 明訂 4 大必須註解時機（核心檔案頂部 Header、公開導出介面/型別/Hook、非直觀商務邏輯與 Hack/Workaround 之 Why 解釋、狀態常數），並明文嚴禁自明代碼撰寫廢話註解。
  3. **標準註解格式範本**: 明文規範 File Header 格式、JSDoc/TSDoc 結構化格式（`@param`, `@returns`, `@throws`）、行內 `// [Why]:` 標籤與 `// TODO:` / `// FIXME:` / `// NOTE:` 工程標籤。
- **影響範圍**: `AGENTS.md`, `AGENTS-BACK.md`, `docs/change-log.md`。

---

## [2026-10-01 00:58] - 執行「功能點收驗收」全套品質驗證與清單逐項核對通過
- **改動原因**: 響應使用者「功能點收驗收」中樞中斷指令，啟動最終核查流程，執行全專案靜態分析、單元測試、型別構建與安全審計。
- **具體內容**:
  1. **靜態分析**: 執行 `oxlint` 檢查全專案 82 支檔案，結果 **0 錯誤**。
  2. **單元測試**: 執行 `vitest run` 全量測試，14 個測試套件共 **77 項測試全數 PASS**（覆蓋 CMS 存檔流程、Dirty Guard、Firebase 離線降級、模組排序與雙軌分流）。
  3. **型別與構建**: 執行 `tsc && vite build`，TypeScript 型別檢查 100% 合規，生產環境打包耗時 390ms，代碼分割與資源打包正常完成（**0 錯誤**）。
  4. **依賴安全審計**: 執行 `pnpm audit`，確認套件庫 **0 已知 CVE 漏洞**。
  5. **核對表驗收**: 逐項對照 `docs/check-list.md` 四大業務領域（資料庫、後端邏輯、前端互動、UI/UX 規範），全數符合規範並確認交付。
- **影響範圍**: 全專案代碼、構建產物、`docs/change-log.md`。

---

## [2026-10-01 00:57] - 確立 check-list.md 專案業務純度邊界並移除 AI 協定非業務內容
- **改動原因**: 依據使用者指正，`docs/check-list.md` 本質為專案業務需求點收表，嚴禁滲透 AI 協定或非專案內容；確立兩者邊界物理隔離。
- **具體內容**:
  1. 自 `docs/check-list.md` 中完全移除「AI 協作協定與規範矩陣」區塊，回歸資料庫、後端、前端、UI/UX 四大專案業務領域。
  2. 於 `AGENTS.md` 第 4.2 節補強明文守衛：「業務功能純度邊界（嚴禁混入 Agent 協定）」，明定點收表僅限專案軟體業務技術實現，杜絕跨領域污染。
- **影響範圍**: `docs/check-list.md`, `AGENTS.md`, `docs/change-log.md`。

---

## [2026-10-01 00:54] - 五大 AI 協定全面升級：納管 MCP 賦能建議、動態清單、驗證邊界與 ERD 深度規格
- **改動原因**: 依據使用者最新工程指導，全面解決 ERD 描述過粗問題；確立 `check-list.md` 隨需求動態增修機制；明定平時嚴禁跑全套詳細驗證以節省 Token；建立外部服務之 MCP 賦能建議機制；並完成五大協定檔案（`AGENTS.md`、`AGENTS-FRONT.md`、`AGENTS-BACK.md`、`AGENTS-GIT.md`、`AGENTS-UNITY.md`）之高密度、低 Token 專業重構。
- **具體內容**:
  1. **ERD 規格深化與灰底根除**: 在 `docs/system-design/05-specs-database.md` 中完整展開 `DOC_SKILLS`、`DOC_PROJECTS`、`DOC_EXPERIENCE`、`DOC_CERTIFICATIONS`、`DOC_SITE_SETTINGS` 之子實體結構與型別，標註繁中註解，並移除所有帶背景色之關聯標籤，改用 Crow's foot 原生語意，杜絕灰底方塊。
  2. **`AGENTS.md` 中樞重構**:
     - 新增「核心雙軌文檔常駐守衛」：存在 `AGENTS.md` 時強制自動確保 `docs/change-log.md` 與 `docs/check-list.md` 存在。
     - 明訂「功能點收驗收」為全套詳細驗證（測試、構建）之唯一觸發時機，平日日常任務嚴禁執行全套驗證，節約 Token 開銷。
     - 確立需求動態更新協議：Agent 必須主動隨使用者需求增刪 `docs/check-list.md`。
     - 確立「外部服務 MCP 賦能建議機制」：當人類提及支援 MCP 之服務時，主動建議並說明加速價值。
  3. **四大特化協定升級**:
     - `AGENTS-FRONT.md`: 納管戰術 HUD 直角非圓角美學、零灰色背景原則，並增訂 Figma / Chrome DevTools 等 MCP 建議機制。
     - `AGENTS-BACK.md`: 增訂 ERD 實體模型規格完整度契約，以及 PostgreSQL / Firebase / Redis 等 MCP 賦能機制。
     - `AGENTS-GIT.md`: 增訂 GitHub / GitLab 等 MCP 工具調度建議。
     - `AGENTS-UNITY.md`: 增訂 Unity Editor / XR 等特化 MCP 工具建議規範。
  4. **驗收清單動態對齊**: 更新 `docs/check-list.md` 頂端，納入 AI 協作協定與規範矩陣。
- **影響範圍**: `AGENTS.md`, `AGENTS-FRONT.md`, `AGENTS-BACK.md`, `AGENTS-GIT.md`, `AGENTS-UNITY.md`, `docs/system-design/05-specs-database.md`, `docs/system-design/07-ui-ux-standards.md`, `docs/check-list.md`, `docs/change-log.md`。

---

## [2026-10-01 00:50] - 全域圖表統一採用非圓角 (直角) HUD 設計並徹底移除 ERD contains 灰色標籤框
- **改動原因**: 徹底解決使用者反映之 ERD `contains` 帶灰底字體背景問題，並依使用者要求全面統一圖表與表單為硬朗戰術「非圓角（直角）」HUD 風格，嚴禁雜亂圓角。
- **具體內容**:
  1. 於 `docs/system-design/05-specs-database.md`、`README.md` 及 `07-ui-ux-standards.md` 中，將 ERD 關係線之 `contains` 標籤全數移除改為標準空標籤 `: " "`，回歸 Crow's foot 符號本身之語意，且注入 `.er.relationshipLabelBox { display: none !important; }`，徹底杜絕任何灰底方塊。
  2. 全面推行「非圓角（直角）」HUD 設計規範：
     - 在 `01-overview.md`、`03-architecture.md`、`05-specs-database.md`、`06-flowcharts.md`、`07-ui-ux-standards.md`、`08-devops.md` 與 `README.md` 的所有圖表（Flowchart、SequenceDiagram、ClassDiagram、ERD）中，全面注入 `themeCSS: 'rect, .node rect, rect.actor { rx: 0px !important; ry: 0px !important; }'`，並於所有 `classDef` 顯式標註 `rx:0px,ry:0px`。
     - 時序圖的 Actor/Participant 矩形（如「核心服務」、「系統管理者」）全面由圓角轉為硬朗直角卡片。
     - 唯一的圓弧/非直角例外嚴格鎖定業界專業語意標準符號（如條件判斷菱形 `{}`）。
  3. 於中樞協定 `AGENTS.md` 第 4.3 節與 `07-ui-ux-standards.md` 第 4.1 節明文確立「全域統一非圓角 (直角) HUD 設計」與「連線文字零背景原則」兩大工程底線。
- **影響範圍**: `AGENTS.md`, `README.md`, `docs/system-design/*` (01, 03, 05, 06, 07, 08), `docs/change-log.md`。

## [2026-10-01 00:44] - 注入 themeCSS 徹底覆蓋 Mermaid ERD SVG relationshipLabelBox 灰色填色
- **改動原因**: 查證 Mermaid ERD 底層渲染機制，發現 `.er.relationshipLabelBox` 屬 SVG 矩形元素，不讀取 high-level 之 `edgeLabelBackground` 變數而直接硬編碼預設灰色，造成預覽器依然顯示灰色色塊。
- **具體內容**:
  1. 於 `docs/system-design/05-specs-database.md`、`README.md` 及 `07-ui-ux-standards.md` 之 ERD 宣告中，全面注入 `themeCSS`：強制宣告 `.er.relationshipLabelBox { fill: #030712 !important; stroke: none !important; }` 與 `.er.relationshipLabel { fill: #00f0ff !important; font-weight: bold; }`，徹底強制消除灰色背景並提亮標籤文字。
  2. 補強 `themeCSS` 中實體表格樣式（`.er.entityBox`, `.er.entityLabel`, `.er.attributeBoxOdd`, `.er.attributeBoxEven`），確保表單風格 100% 統一。
  3. 於 `07-ui-ux-standards.md` 與 `AGENTS.md` 規範庫寫明此底層機制與強制注入 `themeCSS` 之必備條款。
- **影響範圍**: `docs/system-design/05-specs-database.md`, `README.md`, `docs/system-design/07-ui-ux-standards.md`, `AGENTS.md`, `docs/change-log.md`。

## [2026-10-01 00:41] - 徹底剷除 Mermaid ERD 關聯標籤灰色背景並納管全域表單統一設計規範
- **改動原因**: 修復資料庫實體關聯圖中關係標籤文字（如 `contains`）因未宣告 `edgeLabelBackground` 導致渲染出預設灰色矩形底色之問題，並建立全域圖表文字背景零灰色與 ERD 實體表格色彩統一工程底線。
- **具體內容**:
  1. 於 `docs/system-design/05-specs-database.md` 的 Mermaid ERD `themeVariables` 中補齊 `'edgeLabelBackground': '#030712'`，使文字背景與深色底層無縫融合，100% 消除刺眼灰色方塊。
  2. 於 `docs/system-design/07-ui-ux-standards.md` 第 4.1 節明訂「嚴禁字體背景灰色與未宣告色塊」守衛原則，強制所有圖表必須宣告 `'edgeLabelBackground': '#030712'`，且實體表格奇偶列底色強制統一為 `#060a14` 與 `#0b0f19`。
  3. 於 `docs/system-design/07-ui-ux-standards.md` 第 4.3 節補齊標準「4. 資料庫實體關聯圖範本 (`erDiagram`)」。
  4. 於中樞協定 `AGENTS.md` 第 4.3 節同步納管文字背景零灰色與 ERD 表格設計規範，防止未來任何 Agent 產生風格分裂。
- **影響範圍**: `docs/system-design/05-specs-database.md`, `docs/system-design/07-ui-ux-standards.md`, `AGENTS.md`, `docs/change-log.md`。

## [2026-09-30 18:37] - 完成 push到master 生產環境全量發布與 README 逆向對齊
- **改動原因**: 響應使用者「push到master」最高中樞發布指令，對齊規格庫、修訂歷程、README.md 並發布至正式生產環境。
- **具體內容**:
  1. 完成 `feature` 沙盒分支規格文檔原子提交與全域文檔拓撲整合。
  2. 依據真實代碼逆向全量重構根目錄純臺灣繁體中文 `README.md`，納管環境版本、橫向深色 HUD 霓虹風圖表與最新規格。
  3. 拓撲對齊推進 `master` 生產分支並推送到遠端 `origin/master`。
  4. 同步更新並重置 `development` 與 `feature` 分支，實現三層拓撲 100% 對齊。
- **影響範圍**: `README.md`, `master`, `development`, `feature`, `docs/change-log.md`。

## [2026-09-30 18:29] - 解除 07-ui-ux-standards.md 外層代碼圍欄並直通 Mermaid 即時渲染引擎
- **改動原因**: 解決 `07-ui-ux-standards.md` 範本庫因外層 Markdown 代碼圍欄導致 IDE 預覽器無法解析渲染圖表、僅顯示純文字代碼塊的問題。
- **具體內容**:
  1. 移除 `07-ui-ux-standards.md` 第 4.3 節範本的外層代碼圍欄，直接以原生 `mermaid` 區塊宣告，使各平臺與 IDE 預覽器直接即時繪製高顏值圖表。
  2. 範本節點與連線全面貫徹繁體中文、極低 Token 開銷與嚴格雙引號語法防護。
- **影響範圍**: `docs/system-design/07-ui-ux-standards.md`, `docs/change-log.md`。

## [2026-09-30 18:24] - 徹底修復 Mermaid 渲染語法錯誤、剷除紫色雜色並貫徹臺灣繁中優先
- **改動原因**: 修復括號與特殊字元引發之 Mermaid 12.0 解析報錯（炸彈與紅框），全面移除紫色雜色邊框與狀態圖預設紫色，並將所有圖表標籤統一以臺灣繁體中文為主體呈現。
- **具體內容**:
  1. 修復 `06-flowcharts.md` 包含特殊字元之節點標籤與連線文字，加上雙引號 `["..."]` 與 `-->|"標籤"|`，100% 消除 Parse error 炸彈。
  2. 將 `06-flowcharts.md` 帶有紫色背景之 `stateDiagram-v2` 改為乾淨俐落之橫向 `flowchart LR` 狀態轉移圖。
  3. 全面清除全專案所有圖表中殘留的 `#a855f7` 紫色邊框，統一收斂為科技青 `#00f0ff`、冷調青藍 `#38bdf8` 與深藍黑 `#0b0f19`。
  4. 全圖表節點文字全面繁體中文化，杜絕大段純英文堆砌，滿足讀者本位之流暢閱讀體驗。
  5. 於 `07-ui-ux-standards.md` 與 `AGENTS.md` 補齊「嚴禁紫色」、「臺灣繁體中文優先」與「語法防護」三項強制性工程底線。
- **影響範圍**: `docs/system-design/06-flowcharts.md`, `docs/system-design/03-architecture.md`, `docs/system-design/05-specs-database.md`, `docs/system-design/08-devops.md`, `docs/system-design/01-overview.md`, `docs/system-design/07-ui-ux-standards.md`, `AGENTS.md`, `docs/change-log.md`。

## [2026-09-30 18:18] - 重構過長垂直圖表為橫向寬幅 (flowchart LR) 並鎖定一屏可視工程規範
- **改動原因**: 解決原先單列垂直堆疊圖表在 Markdown 預覽中拉伸過長、需頻繁滾動的嚴重閱讀障礙，追求極致空間利用率與閱讀體驗。
- **具體內容**:
  1. 重構 `03-architecture.md` 系統分層架構圖為寬幅橫向 `flowchart LR`，精簡節點標籤換行，高度壓縮至 200px 內，達成免滾動一屏完整閱讀。
  2. 重構 `05-specs-database.md` 三級快取階層圖為橫向 `flowchart LR`。
  3. 於 `07-ui-ux-standards.md` 第 4.1 節與 `AGENTS.md` 第 4.3 節正式寫入「橫向優先 (`flowchart LR`) 與單一視窗一屏可視 (Single Viewport Fit)」強制工程標準。
- **影響範圍**: `docs/system-design/03-architecture.md`, `docs/system-design/05-specs-database.md`, `docs/system-design/07-ui-ux-standards.md`, `AGENTS.md`, `docs/change-log.md`。

## [2026-09-30 18:16] - 徹底淘汰 ASCII 純文字方塊圖並將 Tech HUD Mermaid 設計標準納入全域規範庫
- **改動原因**: 淘汰低可讀性之純文字 ASCII 方塊圖與文字箭頭，並將深色 HUD 霓虹科技風圖表標準正式寫入全域協定與設計規範，確保未來所有技術文檔風格統一。
- **具體內容**:
  1. 將 `03-architecture.md` 系統分層架構與 `05-specs-database.md` 三級快取階層由純文字 ASCII 轉譯為深色 HUD Mermaid 流程圖。
  2. 於 `07-ui-ux-standards.md` 正式建立「第 4 節 全域技術文件與 Mermaid 圖表視覺設計標準」，定義配色色票與 Flowchart、ClassDiagram、SequenceDiagram 範本。
  3. 於 `AGENTS.md` 核心工程中樞新增「4.3 全域圖表與流程圖視覺工程標準」，強制約束所有 AI Agent 執行圖表輸出時皆遵循此規範，嚴禁 ASCII 文字圖。
- **影響範圍**: `docs/system-design/03-architecture.md`, `docs/system-design/05-specs-database.md`, `docs/system-design/07-ui-ux-standards.md`, `AGENTS.md`, `docs/change-log.md`。

## [2026-09-30 18:13] - 全域 Mermaid 圖表全面升級為深色 HUD 霓虹科技美學風格
- **改動原因**: 統一文檔矩陣與系統規格書之視覺體驗，徹底消除預設配色與版型不佳問題，貫徹深色賽博龐克 HUD (Tech HUD) 高科技感標準。
- **具體內容**:
  1. 全域規格圖表注入 `%%{init: {'theme': 'base', 'themeVariables': {...}, 'flowchart': {'curve': 'linear'}}}%%` 深度配置（背景 `#030712`、主卡片 `#0b0f19`、霓虹邊框 `#00f0ff`、文字 `#f8fafc`、子群組 `#060a14`、邊框 `#1e293b`）。
  2. 升級 `01-overview.md` 為三層階梯架構圖 (Tier 1/2/3)、容器執行環境圖與核心類別圖。
  3. 升級 `03-architecture.md` 模組依賴拓撲為包含 EntryTier、StateTier、ShowcaseTier 與 CmsTier 的高密度卡片架構。
  4. 升級 `05-specs-database.md` 之 ERD 模型為深色 HUD 科技配色。
  5. 升級 `06-flowcharts.md` 之開場生命週期、雙軌分流流程、CMS 存檔時序圖 (`sequenceDiagram`) 與離線狀態機 (`stateDiagram-v2`)。
  6. 升級 `08-devops.md` 自動化建置管線圖。
- **影響範圍**: `docs/system-design/01-overview.md`, `03-architecture.md`, `05-specs-database.md`, `06-flowcharts.md`, `08-devops.md`, `docs/change-log.md`。

## [2026-09-30 18:07] - 執行「專案系統分析建立」、「專案系統分析更新」與「嚴格專案最佳化」
- **改動原因**: 響應核心交付指令，全面逆向掃描實體代碼，正式落地 `docs/system-design/` 規格庫與分類驗收清單，並完成代碼庫最佳化驗證。
- **具體內容**:
  1. 依據真實代碼逆向工程，於 `docs/system-design/` 建立 01 至 08 完整系統規格書（願景與 C4 Model、技術選型矩陣、分層結構與 SOLID、API 與 BaaS 通訊協定、ERD 與資料字典、Mermaid 業務流程與狀態機、UI/UX 雙模與無障礙標準、DevOps 邊緣建置管線）。
  2. 依四大領域建立 `docs/check-list.md` 分類驗收核對清單（持久化層、API 商務層、前端狀態層、UI/UX 規格）。
  3. 驗證依賴安全狀態 (`pnpm audit` 達成 0 已知漏洞)、靜態檢驗 (`oxlint` 0 錯誤)、單元與整合測試 (14 個測試套件、77 項測試 100% 通過) 與生產編譯 (`pnpm run build` 0 錯誤)。
- **影響範圍**: 全局文檔體系 (`docs/system-design/*`, `docs/check-list.md`, `docs/change-log.md`)。

## [2026-09-30 17:50] - 核心 Agent 協定矩陣升級與大頭照雙模視覺修復
- **改動原因**: 解決淺色模式下個人大頭照發黑、深色模式下透明去背失效問題，並升級全域 5 份 AI Agent 工程規範庫。
- **具體內容**:
  1. 修復 `About.tsx` 個人大頭照在淺色模式下的掃描線條紋與濾鏡，深色模式維持 `bg-transparent` 保留 RGBA Alpha 去背穿透。
  2. 納管 `firestore.rules` 與 `storage.rules` 雲端安全規則，解決公開寫入風險。
  3. 升級 `nanoid: ^3.3.18` 與 `sharp: ^0.35.4`，消除所有已知 CVE 安全漏洞。
  4. 升級 `AGENTS.md`、`AGENTS-GIT.md`、`AGENTS-FRONT.md`、`AGENTS-BACK.md`、`AGENTS-UNITY.md` 規範庫。
- **影響範圍**: `src/components/About.tsx`, `firestore.rules`, `storage.rules`, `package.json`, 全域規範庫。
