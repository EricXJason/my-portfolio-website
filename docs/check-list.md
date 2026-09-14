# 本次任務清單 (Session Check-List)

本文件依據《AGENTS.md》全域最高工業級工程協定規範，進行本次對話「AGENTS-GIT.md 修正為固定三層平級分支 (master / development / feature) 與分支乾淨純化」之單次點收全量重寫刷新，詳實記錄使用者提出之指令與具體執行細節。

---

## 使用者明確請求

1. **分支結構極致乾淨純粹**：
   - 杜絕任何斜線命名造成的 VS Code 虛擬資料夾折疊干擾。
   - 確立平級、乾淨、純粹的三大分支：
     - `master`
     - `development`
     - `feature`
2. **同步修訂 AGENTS-GIT.md 規範**：
   - 全文移除 `feature/*` 或子分支斜線語法。
   - 明確確立固定三層分支體系與 AI 執行結果強制 Commit 到 `feature` 分支之規則。

---

## AI 實際執行細節

1. **AGENTS-GIT.md 全文校準**：
   - **協定定位與拓撲更新**：全面確立三層分支為 `master`、`development` 與 `feature`。
   - **分支職責與沙盒條款（第 0.3 節 & 第 3 章）**：
     - 確立平級單一沙盒 `feature`，嚴禁使用斜線命名。
     - AI 每次任務的所有代碼、文檔與產出，強制 100% Commit 在 `feature` 分支中。
   - **發布指令 SOP 校準（第 5.1 & 5.2 節）**：
     - `push到dev`：執行 `git merge --squash feature` 壓平合併至 `development` 並推送，完成後切回 `feature` 待命。
     - `push到master`：將 `development` 合併推送至 `master`，完成後切回 `feature` 待命。
2. **本地 Git 分支即刻純化**：
   - 執行 `git branch -m feature/portfolio-dev feature`。
   - 本地分支結構完全恢復為乾淨平級之：
     - `master`
     - `development`
     - `feature`
   - 本次所有修訂 100% 於 `feature` 分支內執行原子 Commit。
