# AGENTS-GIT.md | 全域 AI Agent Git 版本控制協定

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)[cite: 2]  
> **協定定位**: AI Agent 執行 Git 版本控制之唯一法定規範。定義三層分支拓撲、沙盒強制隔離、雙端對齊機制與全自動發布管線。[cite: 2]

---

## 0. 版控核心原則與確認等級 (Command Matrix)

本區塊定義專案版控指令之防護機制與執行等級：

| 指令名稱 | 動作性質 | 防護等級 | 執行機制摘要 |
| :--- | :--- | :--- | :--- |
| **`切回 feature / dev / master`** | 分支切換 | ⚡ 極速直接執行 | 工作區自動存檔 ➔ 切換至指定分支 |
| **`同步 feature / dev / master`** | 遠端拉取 | ⚡ 極速直接執行 | 本地暫存 ➔ 拉取/Rebase 對齊基準 |
| **`push到feature`** | 日常備份 | ⚡ 極速直接執行 | 檢查工作區 ➔ 自動暫存 ➔ 推送 origin/feature |
| **`初始化 git`** | 安全建置 | ⚠️ 單行批次確認 | 檢驗連線 ➔ 建立 master/dev ➔ 強制切入 feature 沙盒 |
| **`push到dev`** | 階段發布 | ⚠️ 單行批次確認 | 單行確認 ➔ Squash 整合 dev ➔ 雙端沙盒自動對齊 |
| **`push到master`** | 生產發布 | ⚠️ 單行批次確認 | 單行確認 ➔ 自動串聯同步 dev ➔ 合併 master ➔ 推送 |
| **`倒回上一個 commit`** | 局部抹殺 | 🛑 高危強制攔截 | 檢驗領先數（=0 阻斷）➔ `reset --hard HEAD~1` ➔ `clean -fd` |
| **`git 重置化`** | 歷史銷毀 | 🛑 高危強制攔截 | 二次確認 ➔ 移除 `.git` ➔ 重建三層分支基底 |

---

## 1. 沙盒隔離與分支拓撲 (Branching Strategy)

專案嚴格維持平級、純粹的三層分支：`master`、`development` 與 `feature`（嚴禁使用斜線資料夾命名）[cite: 2]：
* **`master` 分支**: 生產環境穩定分支。嚴禁日常直接修改或提交。[cite: 2]
* **`development` 分支**: 整合測試基底。做為 feature 的共同父節點，僅透過 `push到dev` 壓平合併匯入。[cite: 2]
* **`feature` 分支**: 日常開發沙盒。所有新功能、修復、重構與文檔更新，**強制 100% 在此分支 Commit**。[cite: 2]

### 1.1 AI 任務強制 Commit 至 Feature 沙盒
1. **執行前檢測**: 介入任何任務前，先執行 `git branch --show-current`。[cite: 2]
2. **自動切入沙盒**: 若處於 `master` 或 `development`，強制切換至 `feature` 沙盒分支（`git checkout -b feature` 或 `git checkout feature`）。[cite: 2]
3. **嚴禁主幹提交**: 日常原子提交絕對禁止直接寫入 `development` 或 `master`。[cite: 2]

---

## 2. 核心版控指令執行 SOP (Commands SOP)

### 2.1 初始化 git
1. 檢驗連線狀態（SSH 優先，容許指定 HTTPS）。[cite: 2]
2. 初始化倉庫並建立生產基準：`git init && git checkout -b master`。[cite: 2]
3. 初始提交：`git add . && git commit -m "chore: initial repository baseline"`。[cite: 2]
4. 建立整合分支並綁定遠端：`git checkout -b development && git remote add origin <url>`。[cite: 2]
5. **強制切入沙盒**：`git checkout -b feature` 待命。[cite: 2]

### 2.2 倒回上一個 commit (邊界阻斷保護)
1. 查詢相對於基準分支之領先數：`git rev-list --count development..HEAD`。[cite: 2]
2. **阻斷機制**: 若數值為 `0`，強制終止並回報：「⚠️ 阻斷：當前分支前方已無獨立提交，操作自動攔截。」[cite: 2]
3. **安全抹殺**: 領先數 `>= 1` 時執行：`git reset --hard HEAD~1 && git clean -fd`。[cite: 2]

### 2.3 同步 dev (Rebase 0 衝突重基底)
1. 沙盒未存代碼自動執行原子存檔。[cite: 2]
2. 背景抓取最新進度：`git fetch origin development:development`。[cite: 2]
3. 執行重基底對齊：`git rebase development`（自動辨識並略過已壓平節點）。[cite: 2]若遭遇代碼語意衝突，立即執行 `git rebase --abort` 並回報人工裁決。

### 2.4 push到dev (Squash Merge 與雙端沙盒自動對齊)
1. 確保沙盒代碼全數完成原子提交。[cite: 2]
2. 切換至 dev 並拉取最新：`git checkout development && git pull origin development`。[cite: 2]
3. 壓平合併：`git merge --squash feature && git commit -m "feat: integrate feature updates into development"`。[cite: 2]
4. 推送至遠端測試主幹：`git push origin development`。[cite: 2]
5. **雙端沙盒自動對齊防線**:
   - 切回沙盒：`git checkout feature`。[cite: 2]
   - 本地基底重置：`git reset --hard development`（徹底消除分叉歷史）。[cite: 2]
   - 遠端沙盒強制租約對齊：`git push origin feature --force-with-lease`（遠端 feature 與本地對齊）。[cite: 2]

### 2.5 push到master (生產發布一條龍)
1. 檢測 feature 是否領先 dev。若有未同步改動，自動依 2.4 節一條龍壓平同步至 dev。[cite: 2]
2. 切換至 master 並拉取最新：`git checkout master && git pull origin master`。[cite: 2]
3. 合併 dev 成果並推送：`git merge development && git push origin master`。[cite: 2]
4. **防禦性切離**：發布完成後立即執行 `git checkout feature` 返回沙盒待命。[cite: 2]

---

## 3. 發布前置文檔結轉與 CHANGELOG 規範

本條款定義執行發布時之唯一真實變更記錄標準：
* **發布觸發沉澱**: 當使用者下達 `push到dev` 或 `push到master` 並確認更新文檔時，AI 始得於根目錄 **`CHANGELOG.md`** 頂端追加本次發布區塊。
* **標準格式**:
  ## [版本號或日期] - YYYY-MM-DD
  ### Added / Changed / Fixed
  - 簡述功能異動與修復項目。
* **日常免維護**: 日常微調任務嚴禁碰觸 `CHANGELOG.md`，完全由 Git Commit 承載歷史。

---

## 4. 提交訊息規範 (Conventional Commits)

* **⚠️ 絕對禁令：所有 Git Commit 訊息強制 100% 使用純英文，絕對禁止出現中文！**[cite: 2]
* 格式：`<type>(<scope>): <imperative English description>`[cite: 2]
* 允許類型：`feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `style`, `test`。[cite: 2]