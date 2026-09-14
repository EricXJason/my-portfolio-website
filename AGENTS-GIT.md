# AGENTS-GIT.md | 全域 AI Agent Git 版本控制與部署工程協定

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **協定定位**: AI Agent 執行 Git 版本控制之唯一法定工程規範。定義三層分支拓撲（`master` / `development` / `feature`）、遠端認證協定（SSH 優先、HTTPS 容許覆寫）、**AI 執行結果強制 Commit 至 feature 沙盒原則**、高頻原子暫存、破壞性邊界阻斷、雙語 README 驗收標準與全自動發布管線。零猜測、防誤推、嚴格釐清破壞性邊界。  
> *Release: 2026-09-14*

---

## 版控專屬指令速查 (Git Command Reference)

本區塊定義專案法定之 8 大精準指令及其破壞性層級與核心執行動作：

| 法定指令名稱 | 破壞性層級 | 核心動作簡述 | 標準執行 SOP 摘要 |
| :--- | :--- | :--- | :--- |
| **`初始化 git`** | 安全建置 | 檢驗遠端連線、完成倉庫遠端綁定、建立基底並切入沙盒 | 檢驗連線 ➔ 關聯 origin ➔ 建立 master/dev ➔ **強制切入 feature 沙盒** |
| **`git 重置化`** | ⚠️ 全域歷史破壞 | 銷毀 `.git` 歷史庫，保留實體檔案重建基底並切入沙盒 | 強制確認 ➔ 移除 `.git` ➔ 初始化 ➔ 提交基底 ➔ **強制切入 feature 沙盒** |
| **`倒回上一個 commit`** | ⚠️ 局部單次破壞 | 抹殺當前分支最新提交（前無提交強制阻斷） | 檢驗提交領先數 ➔ `reset --hard HEAD~1` ➔ `clean -fd` |
| **`切回 dev`** | 非破壞性 | 未提交改動自動原子暫存存檔後安全切換至 development | 檢查工作區 ➔ 自動暫存 commit ➔ `checkout development` |
| **`切回 master`** | 非破壞性 | 未提交改動自動原子暫存存檔後安全切換至 master | 檢查工作區 ➔ 自動暫存 commit ➔ `checkout master` |
| **`pull 最新`** | 非破壞性 | 本地進度快照存檔後拉取遠端最新進度並合併 | 自動暫存 commit ➔ `pull origin development` |
| **`push到dev`** | 階段發布 | feature 分支壓平合併 (Squash) 至 development 並推送 | 檢查工作區 ➔ 切至 dev ➔ `merge --squash feature` ➔ 語意 commit ➔ 推送 ➔ 切回 feature |
| **`push到master`** | ⚠️ 生產發布 | 二度授權確認後啟動一條龍發布：自動確保 dev 同步至最新，再合併推送到 master | 強制確認 ➔ 防呆檢驗 feature/dev ➔ 自動同步 dev ➔ 合併 master ➔ 推送 ➔ 切回 feature |

---

## 🧭 Agent 階段生命週期巡檢地圖 (Lifecycle Fast-Path Routing)

為提升 Agent 執行效率並防止注意力稀釋，Agent 接收到特定版控任務時，直接跳轉對應章節執行：

```
[專案初始化 / 遠端配置] ──> 【第 1 章】(SSH 優先 / HTTPS 容許通訊協定 ➔ 切入 feature)
│
[維護 / 重置 / 回滾 / 切換 / 拉取] ──> 【第 2 章】(重置 2.1 / 倒回 2.2 / 切換 2.3 & 2.4 / 拉取 2.5)
│
[日常 AI 任務 / 原子存檔] ──> 【第 3 章】(固定三層分支 master / development / feature 沙盒強制提交協定)
│
[執行 git add 前置審查] ──> 【第 4 章】(雙語 README 四大核心結構審查)
│
[成果發布 push到dev / master] ──> 【第 5 章】(Squash 壓平合併與生產二度授權)
│
[提交訊息格式 / 衝突降級] ──> 【第 6 章】(Conventional Commits) + 【第 7 章】(衝突中斷 SOP)
```

---

## 快速導航與規則交叉索引 (Rule Cross-Reference Index)

本索引表供所有執行任務之 AI Agent 於操作瞬間進行前置校準。

| 任務觸發情境與檢查項目 | 強制參照章節與核心約束條款 |
| :--- | :--- |
| **獨立降級與母協定繼承** | 強制參照 **第 0.0 節**：獨立運作降級規範與母協定繼承原則。 |
| **破壞性層級與安全防禦原則** | 強制參照 **第 0.1 節**：確立全域重置、單次原子回滾（前無提交強制阻斷）與非破壞切換。 |
| **全指令執行前強制二次確認機制** | 強制參照 **第 0.2 節**：接收任何 AGENTS 版控指令前，必須向使用者確認始得執行。 |
| **AI 任務執行結果強制 Commit 到 feature** | 強制參照 **第 0.3 節與第 3.2 節**：**日常任務絕對嚴禁直接 commit 到 dev 或 master，強制 100% 落在 feature 沙盒**。 |
| **遠端通訊與認證協定** | 強制參照 **第 1 章**：預設 SSH 優先、專案或使用者明確指定時容許 HTTPS 協定。 |
| **專案版控維護指令集 SOP** | 強制參照 **第 2 章**：重置化、倒回 commit、切換分支與 pull 最新之標準執行步驟。 |
| **固定三層分支拓撲與日常沙盒** | 強制參照 **第 3 章**：乾淨純粹之 master / development / feature 分支拓撲。 |
| **文件驗收與 Pre-Git-Add 規範** | 強制參照 **第 4 章**：雙語 README 同步檢驗、四大核心法定章節與按需擴充條款。 |
| **遠端推送發布與授權審查** | 強制參照 **第 5 章**：指令 `push到dev`（壓平）與 `push到master`（生產發布）SOP。 |
| **提交訊息規範與 Conventional Commits** | 強制參照 **第 6 章**：標準 Conventional Commits 英文格式與類型定義。 |
| **工作區乾淨度檢查與衝突降級處置** | 強制參照 **第 7 章**：Pre-Flight 檢查、衝突立即中斷（abort）回報 SOP。 |

---

## 0. 🏆 協定前置載入與安全執行原則 (Execution Principles)

本章節規範本地端與遠端 Git 倉庫執行操作之最高安全原則，杜絕自動化誤操作與未經授權之變更。

### 0.0 獨立運作降級與母協定繼承 (Standalone Fallback Protocol)
本條款定義多層級協定相容原則，確保在不同專案環境下的執行一致性：
1. **母協定繼承效力**: 若專案根目錄存在 `AGENTS.md`，本文件自動承接其優先級仲裁順位表，所有對話與回報完全使用臺灣繁體中文（臺灣「臺」標準），代碼內部註解採標準英文。
2. **獨立運作保證**: 若專案未提供 `AGENTS.md`，本文件具備完全獨立之規範效力，AI Agent 依本協定獨立完成全套版控操作。

### 0.1 破壞性操作層級與安全防禦原則 (Destructive Scoping Principles)
本專案嚴密區分操作之破壞性範圍，杜絕模糊空間：
1. **全域歷史破壞（極度危險）**: 僅限指令：`git 重置化`。銷毀整個 `.git` 歷史庫，強制二次確認。
2. **局部單次破壞（明確抹殺與邊界阻斷）**: 指令：`倒回上一個 commit`。**針對性徹底抹殺最新一次任務的產出**；但若目前所在分支相較於其基準分支前方無獨立提交時，**強制自動攔截並拒絕執行**。
3. **非破壞性操作（絕對留存）**: 指令：`切回 dev`、`切回 master`、`pull 最新` 與日常分支作業。嚴禁執行任何抹殺行為，確保所有既有提交與開發中代碼完整留存。

### 0.2 全域指令前置確認原則 (Command Pre-Execution Confirmation Protocol)
本條款確立所有版控指令執行前之絕對防禦防線，杜絕未經授權之自動化執行：
* **強制確認邊界**: 凡接收到本文件所定義之任何版控指令（`初始化 git`、`git 重置化`、`倒回上一個 commit`、`切回 dev`、`切回 master`、`pull 最新`、`push到dev`、`push到master`）時，**AI 絕對嚴禁未經確認直接執行**！
* **停等提問格式**: AI 必須立即中斷流程，並使用純繁體中文向使用者提出二次確認：
  > 「檢測到您下達版控指令：『**[指令名稱]**』。
  > 該操作即將執行：[簡述本指令之核心動作與影響範圍]。
  > 請問是否確認立即執行本指令？[Y/N]」
* **確認後放行**: 僅當使用者明確回覆同意（如「Y」、「確認」、「執行」）後，AI 始得進入該指令之標準作業程序（SOP）；若使用者回覆拒絕（如「N」、「取消」），則立即終止該指令並回報待命。

### 0.3 AI 任務執行沙盒隔離與 Feature 強制提交協定 (Mandatory Feature Sandbox Isolation)
本條款確立 AI 執行任何日常任務時之絕對分支約束，徹底防止污染主幹分支：
1. **執行前分支嗅探**: AI 介入任何專案執行代碼編寫、功能新增、重構或文檔更新前，**必須先執行 `git branch --show-current` 檢測當前分支**。
2. **嚴禁直接 Commit 至主幹**: **AI 絕對嚴禁直接將日常任務產出 Commit 到 `development` 或 `master` 分支！**
3. **固定三層平級分支命名**: 專案嚴格維持平級、純粹的三層分支：**`master`**、**`development`** 與 **`feature`**。嚴禁在分支名稱中使用斜線（如 `feature/*`）造成編輯器產生資料夾折疊干擾。
4. **自動切入沙盒**: 若當前處於 `master` 或 `development`，AI 必須**強制切換至 `feature` 沙盒分支**（若不存在則從 `development` 建立：`git checkout -b feature`；若存在則直接 `git checkout feature`），確保所有日常任務修改 100% 發生在 `feature` 分支內。
5. **高頻提交歸宿**: 任務執行期間的所有高頻原子 Commit，**必須 100% 提交至 `feature` 分支**。
6. **主幹匯入唯一途徑**: `feature` 分支之成果唯有在人類明確下達法定指令 `push到dev` 並獲二次確認後，始得以 Squash Merge（壓平合併）匯入 `development`。

---

## 1. 🌐 遠端通訊與認證協定 (Remote Communication & Protocols)

本章節規範遠端儲存庫之通訊驗證流程。本專案以 **SSH 為主要連線協定**；若專案環境或使用者明確指定 HTTPS，則容許切換為 HTTPS 通訊。

### 1.1 協定選型優先級 (Protocol Hierarchy)
本條款定義遠端通訊協定之仲裁順位：
1. **SSH 協定（預設首選）**: 優先採用 SSH 金鑰驗證（格式：`git@github.com:<owner>/<repo>.git`）。執行遠端操作前，Agent 應優先校驗 `ssh -T git@github.com`。
2. **HTTPS 協定（條件容許）**: 若專案具備明確配置說明指定 HTTPS、CI/CD 容器環境缺乏 SSH 金鑰、或使用者明確指示「使用 HTTPS」，Agent 應完全相容並採用 HTTPS 遠端位址（格式：`https://github.com/<owner>/<repo>.git`），嚴禁教條式拒絕執行。

### 1.2 指令：初始化 git (Repository Initialization SOP)
當接收到指令：「**初始化 git**」並通過二次確認後，Agent 依循以下標準作業程序執行：

1. **環境連線檢測**: 
   - 執行 `ssh -T git@github.com` 檢驗 SSH 狀態。
   - 若連線成功，採用 SSH 遠端位址；若連線失敗且無金鑰，主動詢問使用者是否提供 SSH 公鑰或改採 HTTPS 授權 Token。
2. **本地倉庫建置**:
   - 若目錄尚未初始化，執行 `git init`。
   - 建立並切換至生產基準分支：`git checkout -b master`。
   - 審查暫存前置文件後，執行初始提交：`git add . && git commit -m "chore: initial repository baseline"`。
3. **分支與遠端關聯**:
   - 建立整合測試分支：`git checkout -b development`。
   - 綁定遠端倉庫（依優先級選配 SSH 或 HTTPS）：`git remote add origin <remote-url>`。
   - 驗證遠端設定：`git remote -v`。
4. **沙盒強制切入**:
   - 建立完 `development` 後，**立即執行 `git checkout -b feature` 切入純粹之 feature 開發沙盒分支待命**，嚴防後續任務直接寫入 `development`。

---

## 2. 🛠️ 專案版控維護指令集 SOP (Maintenance Commands SOP)

本章節規範日常維護與狀態重構指令之標準執行程序。執行前必須強制通過第 0.2 節二次確認。

### 2.1 指令：git 重置化 (Full Repository Reset SOP)
當接收到指令：「**git 重置化**」並獲二次確認後，執行全域歷史清理與基底重建：
1. **銷毀歷史**: 刪除 `.git` 目錄（`rm -rf .git`），實體代碼與工作區檔案 100% 完整保留。
2. **重構基底**:
   - 執行 `git init`。
   - 建立 `master` 分支並暫存當前所有檔案：`git checkout -b master && git add .`。
   - 提交初始節點：`git commit -m "chore: initial baseline commit after repository reset"`。
3. **分流環境**: 建立並切換至 `development` 分支：`git checkout -b development`。
4. **遠端復原**: 依原專案位址重新綁定遠端：`git remote add origin <remote-url>`。
5. **沙盒強制切入**: 建立完 `development` 後，**立即執行 `git checkout -b feature` 切入純粹之 feature 開發沙盒分支待命**，嚴防在主線直接寫入代碼。

### 2.2 指令：倒回上一個 commit (Guarded Destructive Purge SOP)
當接收到指令：「**倒回上一個 commit**」並獲二次確認後，抹殺最新一次任務之產出：
1. **前置提交數邊界校驗（防護網）**:
   - 查詢當前分支相對於基準分支之領先提交數：`git rev-list --count development..HEAD`（若當前處於 `development` 則比對 `master`）。
   - **阻斷判定**: 若數值為 `0`，代表當前分支與基準一致，前方已無獨立提交。**強制終止操作**，回報：「⚠️ 阻斷提示：當前分支相較於基準線前方已無本機提交。為防止破壞基準線，倒回操作已自動阻斷。」
2. **硬性抹殺**: 若領先提交數 `>= 1`，執行指針倒回與未追蹤清除：
   - 倒回指針：`git reset --hard HEAD~1`。
   - 清理新增檔案：`git clean -fd`。
   - 驗證工作區乾淨度：`git status`。

### 2.3 指令：切回 dev (Safe Branch Switch to Dev)
當接收到指令：「**切回 dev**」並獲二次確認後，安全返回 development：
1. **自動原子存檔**: 檢查工作區狀態（`git status --porcelain`），若有未提交改動，強制執行原子存檔以防遺失代碼：`git add . && git commit -m "chore: save progress before switching to development"`。
2. **安全切換**: 執行 `git checkout development`。

### 2.4 指令：切回 master (Safe Branch Switch to Master)
當接收到指令：「**切回 master**」並獲二次確認後，安全返回 master：
1. **自動原子存檔**: 檢查工作區狀態，若有變更則執行原子存檔：`git add . && git commit -m "chore: save progress before switching to master"`。
2. **安全切換**: 執行 `git checkout master`。

### 2.5 指令：pull 最新 (Fetch & Merge Remote SOP)
當接收到指令：「**pull 最新**」並獲二次確認後，拉取遠端最新進度：
1. **本地快照存檔**: 執行 `git add . && git commit -m "chore: snapshot current progress before pulling remote"`。
2. **拉取整合**: 執行 `git pull origin development`。
3. **衝突處理**: 若產生衝突，立即依第 7.2 節執行 `git merge --abort` 中斷並回報。

---

## 3. 🌲 分支拓撲與日常沙盒作業 (Branching Lifecycle)

本專案採用嚴格、乾淨、純粹之 **固定三層分支拓撲（master / development / feature）**，實作沙盒化開發與主線保護。

```
[master]        ───● (穩定生產基底) ───────────────────────────● (正式釋出: push到master)
                   │                                           ▲
                   ▼                                           │
[development]   ───● (整合測試環境) ───────● (壓平合併: push到dev)
                   │                       ▲
                   ▼ (開發沙盒)             │
[feature]          └───●───●───● (日常 AI 任務強制 Commit 於此)
```

### 3.1 三層分支職責劃分
本條款界定各分支之生命週期與存取權限：
* **`master` 分支**: 生產環境穩定分支。僅接收經驗證之 Release，**嚴禁日常直接在此分支修改或提交**。
* **`development` 分支**: 團隊整合與測試基底。做為 `feature` 分支的共同父節點，**嚴禁日常直接在此分支修改或提交**，僅透過 `push到dev` 之壓平合併匯入成果。
* **`feature` 分支**: **日常開發沙盒（Agent 主要作業區）**。所有新功能實作、修復、重構或文檔更新，**強制 100% 在此分支執行 Commit**。

### 3.2 AI 執行結果強制 Commit 至 feature 沙盒原則 (Mandatory Feature Commits)
本機制保障每一次任務的執行歷史均可追溯、可單獨回滾且絕不污染整合主幹：
1. **單一純淨沙盒**: AI 在純粹平級之 `feature` 分支中進行代碼與文檔編寫，絕不使用斜線命名產生資料夾折疊。
2. **高頻原子提交 (High-Frequency Atomic Commits)**: 在 `feature` 分支內，每當完成並驗證一個具體函數、微小改動、組件或文檔章節時，**立即執行 `git add .` 與 `git commit`**（嚴格遵循第 6 章 Conventional Commits 格式）。嚴禁累積大量未提交變更，確保 Checkpoints 高密度覆蓋。
3. **提交禁止越界**: AI 絕對嚴禁在未經人類指令授權下，擅自切換回 `development` 或 `master` 進行直接 Commit。

---

## 4. 📦 Pre-Git-Add 暫存前置規範與 README 全集權威架構標準

本章節為專案根目錄 **`README.md` 之唯一法定權威規範庫**。所有涉及 `README.md` 的章節拓撲、核心架構圖表、中英雙語對照標準與暫存前置審查，一律 100% 以本章節為唯一真實來源（SSOT），執行任何 `git add` 進入暫存區前強制完成全量稽核。

### 4.1 雙語 README 唯一同步原則 (SSOT Bilingual Sync)
於執行任何 `git add` 前，必須確保根目錄之 **`README.md`** 已完全同步並更新為**精確的中英雙語自然緊鄰對照 (English & Traditional Chinese)**。嚴禁出現繁簡混雜、純英文留白或僅有單一語言的狀況。

### 4.2 README 六大核心法定章節架構
根目錄 `README.md` 必須強制具備以下 6 大標準章節，各章節得依專案特徵深度展開，嚴禁空殼：
1. **專案願景與核心價值 (Project Overview & Vision)**: 專案定位、業務摘要、特色亮點與作者簽章（專案作者: 許哲誠 HSU, CHE-CHENG），採用精煉中英緊鄰對照。
2. **系統架構與工程設計全集 (System Architecture & Engineering Design)**: 詳述系統分層職責、實體代碼分割（如前臺展示與 CMS 後臺之物理分塊）、核心安全邊界防衛（如未存檔狀態阻斷防護），並嵌入第 4.3 節規範之三大核心視覺化圖表。
3. **技術棧選型矩陣 (Technology Stack)**: 依循「前端視圖層 ➔ 持續整合 (CI) ➔ 持續部署 (CD) ➔ 後端與雲端基礎設施」嚴謹架構流水線順序編排，詳述精確技術版本與客觀選型理由。
4. **目錄結構拓撲 (Directory Structure)**: 符合工程標準之樹狀結構圖，清晰劃分呈現層、狀態 Context、靜態 Schema 資料庫與工具模組。
5. **本地開發與建置指引 (Local Development & Build Setup)**: 包含前置環境、相依安裝指令（Web 專案強制優先採用 pnpm）、開發伺服器啟動與生產打包驗證步驟。
6. **工程品質指標與客觀實測 (Engineering Metrics & Benchmark)**: 記錄基於真實測量之客觀指標（如 TypeScript 0 型別錯誤、生產構建耗時、WCAG 雙主題對比度實測與無障礙減弱動態降級），嚴禁誇大自吹口號。

### 4.3 README 核心架構圖表全集規格 (Architecture Diagram Typology)
在 `README.md` 第二章架構章節中，必須強制嵌入 3 大核心 **Mermaid** 圖表，且必須嚴格落實以下工業級標準：
1. **三大核心圖表必備清單**:
   - **C4 容器級架構模型 (C4 Model - Level 2)**: 呈現「存取角色端 ➔ 應用核心層 ➔ 持久化與雲端設施」清晰垂直分層，連線採單向向下流動，徹底消除反向繞出全圖邊界的大折線。
   - **核心架構 UML 類別關聯圖 (Core UML Class Diagram)**: 橫向對稱展開核心視圖層、語言契約層與 CMS 持久化層之類別關係，精確呈現繼承、實作、組合與依賴。
   - **雙向即時熱更新循序圖 (Bi-Directional Hot Sync Sequence Diagram)**: 展示使用者操作、編輯器、狀態 Context、本地快取、全域事件匯流排與展示組件間之 0ms 熱重載時序。
2. **1:1 黃金比例與尺寸量體絕對完全統一（嚴禁有大有小）**:
   - 同一頁面中的三張圖表，其寬高比與視覺量體必須精準對齊於**協調之黃金比例矩陣（寬度約 700~800px、高度約 350~380px）**。
   - 節點數量平均控制在 6~10 個核心節點，採對稱網格排布，確保字體等大、卡片等大、閱讀節奏平穩統一，徹底杜絕一張圖龐大繞線、下一張圖萎縮窄小的失衡現象。
3. **深淺雙模式高對比度與防白底穿透 (Dual Theme Compatibility)**:
   - 符合 WCAG 2.2 AA 標準，文字對比度達 4.5:1 以上、外框與圖形達 3:1 以上。
   - **深色模式標準**: 全局背景統一為深邃黑夜（`#030712`）、卡片底色為深黑灰（`#0b0f19`）、外框與光束連線為賽博青（`#00f0ff`）、文字為高對比純白（`#f8fafc`）。
   - **淺色模式相容性防護**: 線條粗細至少 1.5px，線條與標籤文字具備充足飽和度，在淺底預覽器中依然筆直清晰、絕無模糊發虛。
   - **Subgraph 容器底色硬體級防護**: 所有包含 `subgraph` 的圖表，強制於 `themeVariables` 配置 `clusterBkg: '#060a14'`、`clusterBorder: '#1e293b'`、`titleColor: '#00f0ff'`，並於代碼末端加掛顯式樣式（如 `style SubgraphId fill:#060a14,stroke:#1e293b...`），雙重硬體防禦杜絕 Markdown 預覽器預設刺眼白底穿透。
4. **Mermaid 語法硬指標與防崩潰協定 (Zero-Crash Syntax Protocol)**:
   - **連線標籤強制雙引號包裹**: 凡連線文字含有半形括號 `()`、斜線 `/`、冒號等特殊字元者，強制 100% 使用雙引號包裹（如 `-->|"快速測試登入 / 訪客沙盒"|`），徹底杜絕 `Parse error`。
   - **Stereotype 國際標準單詞化**: `classDiagram` 嚴禁包含中文字元或空格，一律嚴格使用標準單詞 ASCII 標籤（如 `<<interface>>`、`<<abstract>>`），防止剖析器崩潰。
   - **折線演算法**: 一律強制宣告 `curve: 'linear'`，筆直俐落，杜絕多餘圓角與繞圈扭曲。
   - **統一採用標準 1:1 矩形 HUD 卡片 (`id["..."]:::hudCard`) 杜絕菱形詞法崩潰**: 菱形語法 `id{"..."}` 之雙引號會破壞 Mermaid Jison 詞法狀態機引發 `Syntax error in text`；全域流程圖之節點一律統一採用標準 1:1 矩形 HUD 卡片 `id["..."]:::hudCard`，並以清晰肯定句描述決策分支。
   - **嚴禁節點文字包含保留運算子 (`&`)**: 流程圖中 `&` 為多節點平行連接保留運算子。節點文字中嚴禁出現裸露之 `&`，一律以繁體中文「與」、「並」或英文「and」取代。
   - **零腦補真實代碼對齊原則 (Zero-Hallucination Code-First Principle)**: 系統圖表必須 100% 依據真實原始碼逆向繪製（例如以沙盒 `iframe` 嵌入 ArtStation / Sketchfab 3D 檢視器與本地 JSON 驅動之 3D 封面輪盤）。嚴禁脫離代碼庫自行腦補不存在的技術框架（如 WebGL 手動記憶體釋放、Three.js OrbitControls、GLB 資產流）。

### 4.4 中英雙語自然緊鄰排版規範 (Bilingual Inline Flow)
本條款規範文字表達之排版美學：
* 嚴禁採用大區塊切分（例如上半篇純中文、下半篇純英文），強制採用**中英自然緊鄰對照**（英文標題在左/上、中文說明緊隨在下；段落英文在先、繁體中文在後）。
* 圖表內部節點與連線說明一律採 `中文名稱 / English Name` 或以 `<br>` 換行對照，確保開源社群、外商企業與技術評審開箱即用語意通暢。

### 4.5 Pre-Git-Add 一票否決審查機制 (Pre-Git-Add Gatekeeper)
在執行任何 `git add` 之前，AI Agent 必須對 `README.md` 執行全量逐條稽核：
* 若發現圖表存在白底穿透、連線含有未引號括號、Stereotype 非標準單詞、圖表尺寸忽大忽小、或內容與真實原始碼脫節時，**強制一票否決暫存動作**！必須優先將 `README.md` 校準修復完畢後，始得放行執行 `git add`。

---

## 5. 🚀 遠端推送與發布協定 (Push Execution Protocols)

本章節規範成果推送至遠端之標準 SOP，執行前必須強制通過第 0.2 節二次確認。

### 5.1 指令：push到dev (Squash Merge SOP)
當接收到指令：「**push到dev**」並獲二次確認後，將開發成果壓平整合至測試環境：
1. **狀態驗收**: 確保當前 `feature` 分支所有改動已完成原子提交。
2. **壓平合併**:
   - 切換至 development 分支：`git checkout development`。
   - 拉取遠端最新代碼：`git pull origin development`。
   - 執行壓平合併：`git merge --squash feature`。
3. **語意提交與推送**:
   - 提交單一乾淨節點：`git commit -m "feat: integrate feature changes into development"`。
   - 推送至遠端：`git push origin development`。
4. **切回沙盒**: 執行 `git checkout feature` 返回開發沙盒分支待命。

### 5.2 指令：push到master (Production Release SOP - 一條龍同步保證)
當接收到指令：「**push到master**」並獲二次確認後，執行正式生產發布。本流程內建「前置分支差異自動防呆卡控」，確保 `development` 與 `master` 雙基準分支 100% 保持最新：

1. **二度授權與邊界提示**:
   - 強制警示該操作將發布至正式生產環境（GitHub Pages / 生產部署節點）。
2. **前置防呆檢驗與一條龍同步 (Pipeline Pre-Flight Check)**:
   - **檢測 feature 領先狀態**: 執行 `git log development..feature --oneline` 檢測 `feature` 沙盒是否含有尚未壓平至 `development` 的最新成果。
   - **若 feature 領先（有未同步改動）**:
     - 立即啟動一條龍串聯同步（無需人類重複下達指令）：
       1. 確保 `feature` 工作區完全乾淨（未存檔則原子提交）。
       2. 切換至 `development`：`git checkout development`。
       3. 同步遠端測試分支：`git pull origin development`。
       4. 執行壓平合併：`git merge --squash feature`。
       5. 提交語意節點：`git commit -m "feat: integrate feature changes into development"`。
       6. 推送更新至遠端：`git push origin development`。
       - **至此已 100% 保證 dev 分支完全到達最新狀態！**
   - **若 feature 與 dev 同步**: 直接推進至正式發布。
3. **生產發布序列 (Release Sequence)**:
   - 切換至 master 分支：`git checkout master`。
   - 同步遠端狀態：`git pull origin master`。
   - 合併最新 development 成果：`git merge development`。
   - 推送至正式生產環境：`git push origin master`。
4. **防禦性切離 (Return to Sandbox)**:
   - 正式發布完成後，**立即執行 `git checkout feature` 返回日常開發沙盒分支待命**，嚴禁逗留於 master 或 development 主幹分支。

---

## 6. 📝 提交訊息規範 (Conventional Commits)

本章節統一提交紀錄格式，確保歷史線圖具備高度可讀性。

### 6.1 格式標準
所有 Commit 訊息強制採用標準英文與 Conventional Commits 格式：
```
<type>(<scope>): <short imperative description>
```

### 6.2 允許類型清單
提交類型嚴格限定於以下項目：
* `feat`: 新增功能模組。
* `fix`: 修復程式碼錯誤。
* `refactor`: 重構代碼（無功能行為改變）。
* `perf`: 效能提升與最佳化。
* `chore`: 構建腳本、依賴升級或設定檔異動。
* `docs`: 文檔新增或修訂。
* `style`: 程式碼格式化或樣式微調。
* `test`: 測試代碼新增或修改。

---

## 7. 🛡️ 異常降級與防呆檢查 (Failsafe & Conflict Handling)

本章節明訂分支操作與合併異常時之安全防衛標準。

### 7.1 工作區乾淨度檢查 (Pre-Flight Cleanliness)
於執行任何分支切換或合併前，必須先執行乾淨度檢查：
```bash
git status --porcelain
```
若存在未追蹤或未暫存檔案，嚴禁擅自切換或強制覆蓋，必須先行完成原子存檔。

### 7.2 合併衝突中斷標準程序 (Merge Conflict Abort SOP)
若執行 `git merge` 或 `pull 最新` 遭遇衝突，嚴禁 AI 擅自臆測修剪代碼：
1. **立即中斷恢復**: 執行 `git merge --abort` 恢復至操作前乾淨狀態。
2. **回報衝突細節**: 透過繁體中文精準回報衝突檔案清單與區塊，等待人類工程師裁決。