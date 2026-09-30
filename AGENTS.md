# AGENTS.md | 全域 AI Agent 核心工程中樞協定

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-09-30  
> **協定定位**: 全域 AI Agent 與工程師協作之最高中樞規範。負責跨 Agent 指令匹配、軟體工程底線 (SOLID/Clean Code)、文檔矩陣與特化模組調度。以極低 Token 開銷、高密度工程事實為唯一準則。

---

## 0. 核心交付指令矩陣 (精確關鍵字匹配)

所有 AI Agent 檢測到使用者輸入包含以下精確關鍵字時，強制中斷日常對話並啟動對應 SOP：

| 指令名稱 | 執行時機與防護機制 | SOP 摘要 |
| :--- | :--- | :--- |
| **`專案系統分析建立`** | 專案初始化或大規模架構重構時 | 逆向掃描實體代碼，於 `docs/system-design/` 建立規格書，並分類初始化 `docs/check-list.md`。 |
| **`專案系統分析更新`** | 資料表、API 或架構模型異動時 | 精準增量同步 `docs/system-design/` 與對應領域規範，不變動未受影響檔案。 |
| **`功能點收驗收`** | 需求調整、新增或交付驗收時 | 拆解複雜需求，依領域更新 `docs/check-list.md`（替換過時條件），逐項核對交付成果。 |
| **`嚴格專案最佳化`** | 發布前代碼庫淨化 (**⚠️ Unity 專案禁執行**) | 檢查 pnpm、清除 Dead Code 與除錯日誌、補齊繁中註解、驗證 0 錯誤構建，於 `docs/change-log.md` 頂端追加記錄。 |

> 📌 **版控核心指令調度**: 凡輸入包含 `初始化 git`、`切回 feature`、`切回 dev`、`切回 master`、`push到feature`、`push到dev`、`push到master`、`倒回上一個 commit`、`git 重置化` 等關鍵字，同屬最高優先級中斷指令，強制調度 `AGENTS-GIT.md` 嚴格執行。

---

## 1. 協定架構、預設邊界與優先級裁決

### 1.1 預設無 Git 與模組路由原則
- **無 Git 預設**: 專案在未收到人類明確下達 `初始化 git` 指令前，**嚴禁執行任何 Git 指令或建立 `.git` 目錄**。
- **特化規範庫按需加載**:
  - Web/前端專案：參照 `AGENTS-FRONT.md`。
  - 後端/伺服端專案：參照 `AGENTS-BACK.md`。
  - Unity 遊戲專案：參照 `AGENTS-UNITY.md`（嚴禁執行最佳化指令）。
  - 版控操作：參照 `AGENTS-GIT.md`。

### 1.2 優先級裁決階層 (不可逾越)
1. **歧義主動提問**: 需求不明確或參數缺漏時立即暫停並提問，嚴禁自行推測。
2. **資安與零幻覺原則**: 嚴禁在代碼內硬編碼金鑰；查無實據之套件或端點嚴禁捏造。
3. **特化協定原生規則**: 語言原生檔名與命名規則強制覆蓋通用條款。
4. **修改邊界隔離**: 明確指定修改範圍時，嚴禁變動無關程式碼。
5. **人類明確覆寫**: 使用者明確指示覆寫某條款時始得例外處理。

---

## 2. 語言規範：凡人讀之文檔一律臺灣繁體中文

- **人類閱讀內容強制臺灣繁體中文**:
  - 對話回覆、所有說明文檔（`README.md`、`docs/check-list.md`、`docs/change-log.md`、`docs/system-design/` 全部檔案）與程式碼註解，**一律強制 100% 使用臺灣繁體中文**（「臺」一律使用「臺」，嚴禁簡體字與「台」）。
- **英文術語保留**: 保留業界標準專有名詞（如 SQL, Firebase, DTO, Repository, Async/Await, TODO, Hook, Redis, Conventional Commits）。
- **程式碼註解**:
  - **全體註解一律使用臺灣繁體中文**。
  - 核心檔案頂部包含繁體中文 Header 區塊註解（說明責任邊界、架構模式與依賴）。
  - 內部代碼註解解釋「為什麼 (Why)」而非贅述「做什麼 (What)」。
  - 待辦事項標註強制採用 `TODO:` 前綴 + 繁體中文說明。
- **代碼成員命名 (業界主流慣例)**:
  - **TypeScript / 前端**: 公開與私有成員一律採標準 `camelCase`（私有成員依專案環境採 `private camelCase` 或原生 `#camelCase`，嚴禁強加底線前綴）。
  - **Java (Spring Boot)**: 標準 `camelCase`（無底線）。
  - **Python**: 標準 `snake_case`；類別 `PascalCase`；私有成員 `_snake_case`。
  - **Go**: 導出成員 `PascalCase`，未導出私有成員 `camelCase`。
  - **Unity C#**: 僅 Inspector 序列化私有欄位採用 `[SerializeField] private _camelCase`，其餘私有欄位採用 `camelCase`。

---

## 3. 軟體工程底線：SOLID 與 Clean Code

- **SRP 單一職責**: Controller, Service, Repository, DTO 必須物理隔離，嚴禁萬能類別。
- **OCP 開放封閉**: 擴充邏輯優先採用策略模式 (Strategy) 或多型，避免巨大 switch-case。
- **LSP 里氏替換**: 子類別必須保證完全相容父類別契約，嚴禁拋出 `NotSupportedException`。
- **ISP 介面隔離**: 介面應精簡明確，強制將龐大胖介面拆分為細粒度角色介面。
- **DIP 依賴反轉**: 高階模組依賴抽象，全域貫徹依賴注入 (DI)。
- **Clean Code**: 單一函式長度原則不超過 20 行；嚴格落實早期返回 (Early Return)；嚴禁靜默吞掉例外。

---

## 4. 文檔工程矩陣 (`docs/` & `README.md`)

### 4.1 根目錄 `README.md` 工程化規範 (僅於 `push到master` 時自動生成/對齊)
平時日常開發不維護 `README.md`。當執行 `push到master`（生產發布）時，Agent 必須依據真實代碼全量建立或更新 `README.md`。**全篇一律使用臺灣繁體中文撰寫，嚴禁行銷廢話（如「一站式」、「賦能」），內容必須具備真實技術深度**，順序如下：
1. **專案摘要與環境版本**: 專案名稱、目標痛點；清楚載明**語言與執行環境版本號**（如 Node.js 20.x, Java 21, Unity 6000.0.x，嚴格對齊實體檔案，查無不寫）。
2. **架構設計思路 (Architecture Mindset)**: 核心分層選型理由、技術決策權衡。
3. **核心功能規格 (Specifications)**: 依模組條列真實功能清單、輸入邊界與錯誤處置。
4. **系統業務流程圖 (Flowchart)**: 使用 Mermaid 繪製關鍵業務流程或狀態機（**未經系統分析定義之專案嚴禁捏造**）。
5. **資料庫模型 (ERD)**: 具備持久化資料庫時，以 Mermaid ERD 標註實體關聯、欄位型別與主外鍵（**無 DB 專案自動省略，嚴禁生成空圖**）。
6. **檔案目錄結構拓撲**: 真實實體原始碼樹狀目錄及各層職責。
7. **本機建置與運行指南**: 前置環境、`.env` 配置、安裝與啟動除錯指令。

### 4.2 `docs/` 文檔結構與維護責任 (全純繁體中文)

```text
docs/
├── change-log.md              # 【永遠常駐】輕量繁中修訂歷程 (最新記錄在頂端，舊歷史向下堆疊)
├── check-list.md              # 繁中待辦與驗收點收表 (分類管理、動態替換)
└── system-design/             # 系統架構設計庫 (按需選配，非必要不建空殼)
    ├── 01-overview.md         # 系統願景與 C4 Model
    ├── 02-tech-stack.md       # 技術選型矩陣與版本理由
    ├── 03-architecture.md     # 分層結構與模組依賴
    ├── 04-specs-api.md        # API / 通訊協定規格書
    ├── 05-specs-database.md   # ERD、資料字典與快取架構
    ├── 06-flowcharts.md       # 業務流程與 Mermaid 圖表
    ├── 07-ui-ux-standards.md  # 前端 UI/UX 與無障礙標準
    └── 08-devops.md           # 容器建置與維運指標
```

- **`docs/change-log.md` (永遠常駐，純繁中，零讀取成本寫入)**:
  - 專案任何時期皆必須存在。
  - **每次完成程式碼修改、新增或指令任務時，強制追加最新記錄至頂端**（**免讀取歷史內容，僅需將新異動直接插入檔案最上方**，舊歷史自然向下沉澱）。
  - 格式：
    ```markdown
    ## [YYYY-MM-DD HH:mm] - 異動摘要
    - **改動原因**: 說明調整動機
    - **具體內容**: 變更細節與修改項目
    - **影響範圍**: 涉及之模組、檔案或端點
    ```
- **`docs/check-list.md` (分類驗收點收表，純繁中)**:
  - 遇到複雜或龐大需求時，Agent 必須主動拆解為細粒度子項目。
  - **強制按領域建立 Markdown 二級標題分類**，嚴禁無分類條列：
    - `## 資料庫與持久化層`
    - `## 後端 API 與商務邏輯層`
    - `## 前端介面與互動狀態`
    - `## UI/UX 設計與文字規格`
  - 需求變更時，立即動態更新或刪除替換過時條件；執行 `功能點收驗收` 時以此核對。

### 4.3 全域圖表與流程圖視覺工程標準 (Tech HUD Mermaid)
全體 AI Agent 於產出或維護 `README.md`、`docs/system-design/` 與各類說明文檔之架構圖、流程圖、時序圖與資料庫模型時，強制貫徹以下視覺工程底線：
1. **嚴禁純文字 ASCII 方塊圖**: 任何系統分層或資料流，**一律嚴禁使用 `┌─┐│└─┘` 等純文字方塊與純文字箭頭**，一律強制轉譯為具備高度可讀性之深色 Mermaid 圖表。
2. **強制深色 HUD 霓虹科技風**: 所有 Mermaid 區塊第一行必須宣告 `%%{init: {...}}%%`，鎖定底層深黑 `#030712`、主卡片 `#0b0f19`、霓虹邊框與訊號線 `#00f0ff`、文字 `#f8fafc`、子群組 `#060a14`、邊框 `#1e293b`、連線 `curve: 'linear'`。
3. **嚴禁字體背景灰色與未宣告色塊**: 所有圖表之 `themeVariables` **強制必須明確宣告 `'edgeLabelBackground': '#030712'`**，嚴格杜絕圖表連線標籤或關聯文字（如 ERD 關係線之 `contains` 等）出現預設灰色/白色矩形底色；因 Mermaid ERD 之 `.er.relationshipLabelBox` 預設為灰色且無法由 high-level 變數覆蓋，所有 `erDiagram` **強制注入 `themeCSS: '.er.relationshipLabelBox { fill: #030712 !important; stroke: none !important; } .er.relationshipLabel { fill: #00f0ff !important; font-weight: bold; } ...'`**；ERD 實體表格奇偶列底色強制統一為 `'attributeBackgroundColorOdd': '#060a14'` 與 `'attributeBackgroundColorEven': '#0b0f19'`，確保全專案所有圖表與表單視覺風格完全統一且合理。
4. **階梯卡片樣式標準與禁紫色**: 節點必須定義 `classDef hudCard fill:#0b0f19,stroke:#00f0ff,stroke-width:1.5px,color:#f8fafc;`。**全域嚴禁使用紫色、洋紅等雜亂配色**，維持高階一致性。
5. **長度限制與橫向優先 (`flowchart LR`)**: 嚴禁單純單列垂直堆疊過多節點形成細長高塔圖；分層架構、流程階段與管線優先採用 `flowchart LR` 橫向展開，文字精簡換行 $\le 2$ 行，高度 $\le 350\text{px}$，確保桌面視窗「一屏盡覽、免滾動閱讀」。
6. **繁體中文為主與語法零容錯**: Docs 是寫給人看的，**節點與說明文字一律以臺灣繁體中文為主體**。節點含括號 `()` 或斜線 `/` 時強制以雙引號包裹 `["..."]`，連線標籤強制以 `-->|"標籤"|` 宣告，嚴格杜絕渲染報錯。
7. **範本規格對齊**: 完整色票規格與標準範本庫（Flowchart, ClassDiagram, SequenceDiagram, ERD）嚴格對齊 `docs/system-design/07-ui-ux-standards.md` 第 4 節標準執行。