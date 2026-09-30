# 專案修訂歷程記錄庫 (change-log.md)

> **維護準則**: 本檔案永遠常駐，全篇強制 100% 臺灣繁體中文。每次完成修改或指令任務時，直接將最新記錄插入檔案最頂端（免讀取歷史內容，零 Token 損耗）。

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
