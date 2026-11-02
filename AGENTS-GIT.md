# AGENTS-GIT.md | 全域 AI Agent Git 版本控制協定

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-10-27 01:35:00  
> **協定定位**: 全域 AI Agent 執行版本控制之唯一法典。規範預設無 Git 邊界、全純 Git CLI 執行、遠端連線協議（優先 SSH、次要 HTTPS）、三層沙盒拓撲、防撞 Rebase 與生產發布一條龍。完全繼承 `AGENTS.md`。

---

## 0. 版控專屬指令矩陣 (精確關鍵字匹配，全純 Git CLI 執行)

所有版控行為**一律強制使用終端機 Git CLI 指令**執行，嚴禁呼叫黑箱外掛：

| 指令名稱 | 性質與防護等級 | 執行機制摘要 |
| :--- | :--- | :--- |
| **`初始化 git`** | 遠端連線與拓撲建置 | gh 自動檢測/建立同名 Private Repo ➔ 協議檢驗 (優先 SSH，次要 HTTPS) ➔ 建立三層分支並推送基準 ➔ 切入 `feature` 沙盒待命 |
| **`切回 feature`** | ⚡ 極速執行 (免確認) | 本地工作區自動 CLI Commit ➔ CLI 切換至 `feature` 沙盒分支 |
| **`切回 dev`** | ⚡ 極速執行 (免確認) | 本地工作區自動 CLI Commit ➔ CLI 切換至 `development` 分支檢視 |
| **`切回 master`** | ⚡ 極速執行 (免確認) | 本地工作區自動 CLI Commit ➔ CLI 切換至 `master` 分支檢視 |
| **`push到feature`** | ⚡ 極速執行 (防撞保護) | 本地原子 CLI Commit ➔ **推前強制先 pull --rebase** ➔ 若衝突立即通報協商 ➔ `git push origin feature` |
| **`push到dev`** | ⚠️ 單行批次確認 | 單行確認 ➔ **⚠️ 嚴禁更動 README.md** ➔ 切換 dev ➔ **推前先 pull** ➔ Squash 合併 ➔ 推送遠端 ➔ 重置沙盒對齊 dev |
| **`push到master`** | ⚠️ 單行批次確認 | 防污染校驗 ➔ **⚠️ 沙盒內先產繁中 README** ➔ 確認授權 ➔ 原子同步 dev & master ➔ 失敗安全回滾 ➔ 重置沙盒對齊 |
| **`倒回上一個 commit`**| 🛑 高危強制攔截 | CLI 檢驗歷史邊界（若相對於 master 起點無提交則阻斷）➔ 執行 `git reset --hard HEAD~1 && git clean -fd` |
| **`git 重置化`** | 🛑 高危強制攔截 | 二次強制確認 ➔ 移除 `.git` ➔ CLI 重建乾淨三層分支基底 |

---

## 1. 預設無 Git 與「初始化 git」標準 SOP

### 1.1 預設無 Git 邊界
專案在未收到人類明確指令「`初始化 git`」前，**嚴禁執行 `git init` 或建立任何版控檔案**。

### 1.2 初始化 git 執行步驟 (優先 SSH、次要 HTTPS 與三層 CLI 分支拓撲)
收到指令「**`初始化 git`**」時，強制依序以純 Git CLI 指令執行：

1. **遠端倉庫自動偵測與建立 (GitHub CLI 鐵律)**:
   - 透過 `gh auth status` 檢驗 GitHub CLI 認證狀態。
   - 以當前專案資料夾名稱檢測遠端倉庫（`gh repo view :owner/<專案資料夾名稱>`）。
   - **若遠端尚未建立倉庫，強制由 AI 直接使用 GitHub CLI 建立遠端 Private Repo**（`gh repo create <專案資料夾名稱> --private`），嚴禁要求人類手動前往網頁建立。
   - 若遠端已存在，則直接沿用綁定。
2. **連線協議檢核 (優先 SSH，次要 HTTPS)**:
   - 優先測試 SSH：`ssh -T git@github.com`。若連線成功，**強制優先採用 SSH URL**（`git@github.com:<owner>/<repo>.git`）。
   - 若未配置 SSH Key、連線不通或指定 HTTP，**平滑降級採用 HTTPS URL**（`https://github.com/<owner>/<repo>.git`）。
3. **三層分支拓撲建置與上游鎖定**:
   ```bash
   git init
   git checkout -b master
   git add .
   git commit -m "chore: initial baseline commit"
   git remote add origin <REMOTE-URL>  # 優先 SSH，次要 HTTPS
   git push -u origin master
   git checkout -b development
   git push -u origin development
   git checkout -b feature
   git push -u origin feature
   ```
4. **完成回報**: 使用繁體中文回報拓撲建立成功與連線協議（SSH / HTTPS），當前於 `feature` 沙盒待命。

---

## 2. 三層分支流動與守衛機制

* **`master` 分支**: 生產環境穩定分支。嚴禁日常直接 Commit。
* **`development` 分支**: 整合測試主幹。由發布指令將 `feature` 壓平匯入。
* **`feature` 分支**: 日常開發沙盒。
* **全域守衛底線 (Invariants)**:
  1. **原子 Commit 守衛**: 於 `feature` 沙盒結束對話前，強制背景執行 CLI 提交（`git add . && git commit -m "..."`），工作區零殘留。
  2. **本地協定常駐守衛**: `.gitignore` 排除 `AGENTS*.md`，任何 `reset --hard` / `clean -fd` / `checkout` 嚴禁抹除本地實體協定檔案。
  3. **嚴格禁止 AI 自主執行 `git push` 鐵律**: 日常任務僅限本地原子 Commit，**絕對嚴禁自作主張執行 `git push`**。唯有收到明確指令（`push到feature`、`push到dev`、`push到master`）始得推送。
  4. **`development` 永遠不落後 `master` 鐵律**: 發布至 `master` 完成後，**強制切回 `development` 執行 Fast-Forward 合併同步對齊 `master`（`git checkout development && git merge --ff-only master && git push origin development`）**。
  5. **推前強制必拉鐵律 (Pull-Before-Push)**: 執行任何推送前，強制先執行目標分支之 `git pull`（或 `git pull --rebase`），確保基準對齊。
  6. **衝突即刻通報協商**: pull / rebase / merge 發生任何衝突時，**嚴禁 AI 私自解決**。立即中斷並以臺灣繁體中文通報衝突清單，獲人類裁決指示後始得處理。
  7. **README.md 維護邊界**: 平時開發與 `push到dev` 絕對嚴禁更動 `README.md`。**唯有下達 `push到master` 時始得全量逆向對齊 `README.md`**。

---

## 3. 核心指令執行詳細 SOP (全純 Git CLI 指令)

### 3.1 push到feature (日常備份與防撞保護)
1. 確保沙盒代碼已完成原子提交且工作區乾淨。
2. 防撞保護與推送：
   ```bash
   git pull --rebase origin feature 2>/dev/null || true
   git push -u origin feature
   ```
   若發生衝突立即執行 `git rebase --abort` 並以繁體中文通報衝突清單由人類裁決。

### 3.2 倒回上一個 commit (邊界阻斷保護)
1. 查詢相對於 `master` 基準點之總提交數：
   ```bash
   git rev-list --count master..HEAD
   ```
2. **阻斷機制**: 若數值為 `0`（代表已達 master 起點，無獨立提交），強制終止並以繁中回報：「⚠️ 阻斷提示：當前分支已達 master 基準點，前方無可撤回之獨立提交，操作自動攔截。」
3. **安全抹殺**: 數值 `>= 1` 時執行：
   ```bash
   git reset --hard HEAD~1
   git clean -fd
   ```

### 3.3 push到dev (Squash Merge 發布至測試環境，⚠️ 嚴禁動 README.md)
1. 確保沙盒代碼全數完成原子提交。
2. **邊界防護**：此階段**絕對嚴禁更動 `README.md`**。
3. 執行發布與沙盒重置指令序列：
   ```bash
   git checkout development
   git pull origin development
   git merge --squash feature
   ```
   - 若發生衝突，立即中斷並回滾至沙盒（`git merge --abort && git checkout feature`），向人類呈報衝突清單討論裁決。
   - 無衝突時完成整合：
     ```bash
     git commit -m "feat: integrate updates into development"
     git push origin development
     git checkout feature
     git reset --hard development
     git push origin feature --force-with-lease
     ```

### 3.4 push到master (生產發布一條龍：沙盒預備、防污染校驗與安全原子流動)
當人類下達 `push到master` 時，AI 自動執行具備防污染校驗與失敗自愈保護的發布管線：

1. **第一階段：防污染前置校驗 (Pre-flight Contamination Check)**:
   - 執行 `git fetch origin`。
   - 檢查 `development` 分支是否存在未經當前沙盒驗收之提交：
     ```bash
     git rev-list --count feature..origin/development 2>/dev/null || echo 0
     ```
   - 若數值 `> 0`，代表 `development` 存在未經本沙盒驗收之變更，**強制就地中斷發布**並以繁中提示攔截，指示先整合至 dev 驗收。
2. **第二階段：沙盒內預備繁中 README (All-in-Sandbox Preparation)**:
   - 完全在 `feature` 沙盒分支內完成，依據 `AGENTS.md` §4.1 全量生成/更新根目錄繁中 `README.md`。
   - 在沙盒內完成原子提交：
     ```bash
     git add README.md
     git commit -m "docs: align production readme with verified architecture"
     ```
   - 若過程異常，工作區安全停留在 `feature`，主幹毫髮無損。
3. **第三階段：單行確認發布授權**:
   - 單行確認發布授權：「✅ 沙盒代碼與繁中 README 已就緒且無污染風險。即將同步 dev 並發布至 master，請確認？[Y/N]」。
4. **第四階段：原子同步與失敗自愈守衛 (Atomic Flow & Fail-Safe Rollback)**:
   - 記錄發布前沙盒基準：`PRE_RELEASE_COMMIT=$(git rev-parse HEAD)`。
   - 推進發布序列：
     ```bash
     # 1. 推進沙盒最新狀態至遠端
     git push origin feature
     # 2. 整合至 development
     git checkout development
     git pull origin development
     git merge --squash feature
     git commit -m "chore(release): integrate validated feature and readme"
     git push origin development
     # 3. 發布至生產 master
     git checkout master
     git pull origin master
     git merge development
     git push origin master
     # 4. 同步 development 對齊 master (杜絕拓撲落後)
     git checkout development
     git merge --ff-only master
     git push origin development
     # 5. 重置沙盒完全對齊 master
     git checkout feature
     git reset --hard master
     git push origin feature --force-with-lease
     ```
   - **全域失敗自愈保護 (Fail-Safe Trap)**:
     若上述步驟因網路、Token 或衝突失敗，強制安全回滾：`git checkout feature && git reset --hard $PRE_RELEASE_COMMIT`，100% 復原至發布前乾淨沙盒狀態並報告中斷點。

---

## 4. 提交訊息規範 (Conventional Commits)

Commit 訊息為全協定中**唯一強制 100% 使用純英文**之項目，格式：

```text
<type>(<scope>): <short imperative description>
```

* 允許類型：`feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `style`, `test`。

---

## 5. GitHub 服務 MCP 賦能建議

繼承 `AGENTS.md` §1.4，對接 GitHub 遠端服務（PR 審查、Issue 追蹤或 Release 標籤發布等高階協作）且環境具備 MCP 支援時，主動建議啟用以加速開發與審查流程。