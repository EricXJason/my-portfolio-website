# 本次任務清單 (Session Check-List)

本文件依據《AGENTS.md》全域最高工業級工程協定規範，進行本次對話「將 Mermaid 破版、語法炸彈崩潰（`stateDiagram-v2` 樣式寫死、菱形引號衝突、保留字元 `&`）與零腦補原則正式法典化寫入《AGENTS.md》與《AGENTS-GIT.md》，並全面稽核五大協定檔案確保 AI 具備極致瞬間解析與高速理解效率」之單次點收全量重寫刷新，詳實記錄使用者提出之指示與具體執行細節。

---

## 使用者明確指示

1. **將錯誤根本原因正式寫入合適的 MD 協定檔案中，防範未來再次發生**：
   - 將 Mermaid `stateDiagram-v2` 樣式寫死破版、菱形判斷節點雙引號衝突（`id{"..."}` 拋出 `Syntax error in text`）、保留運算子衝突（未轉義 `&` 破壞語法）、以及脫離原始碼之虛構腦補等問題與防禦條款，寫入協定檔案中。
2. **嚴格確保五個 `AGENTS*.md` 檔案能讓 AI 高速閱讀且高效理解**：
   - 審查 `AGENTS.md`、`AGENTS-GIT.md`、`AGENTS-FRONT.md`、`AGENTS-BACK.md` 與 `AGENTS-UNITY.md` 五大檔案之職責邊界、導航路由樹、排版結構與高信噪比。

---

## AI 實際執行細節

1. **法典化寫入《AGENTS.md》第 6 章與《AGENTS-GIT.md》第 4.3.4 節**：
   - **全面禁止原生 `stateDiagram-v2`**：明文規定 Mermaid 原生狀態機內部寫死紫色標籤（`#8a2be2`）與淺黃色方塊（`#ffffcc`），無視深色主題；狀態轉移機強制採用標準 `flowchart TD` 實作。
   - **全面統一為標準 1:1 矩形 HUD 卡片 (`id["..."]:::hudCard`)**：明文規定菱形節點若加引號（`id{"..."}`）會破壞 Jison 詞法狀態機引發 `Syntax error in text`，若不加引號標籤括號又會引發 `Parse error`；全域流程圖一律強制採用矩形 HUD 卡片 `id["..."]:::hudCard`，兼顧語法 100% 絕對安全與 1:1 尺寸對稱平衡。
   - **嚴禁節點文字包含保留運算子 (`&`)**：明文規定節點文字一律以「與」、「並」或「and」替代 `&` 符號，徹底杜絕剖析器將其誤判為多節點平行連接運算。
   - **零腦補真實代碼對齊原則 (Zero-Hallucination Code-First Principle)**：系統設計圖表必須 100% 依據真實原始碼逆向繪製（如畫廊 3D 檢視以沙盒 `iframe` 嵌入 ArtStation / Sketchfab 播放器與本地 JSON 驅動之 3D 封面輪盤），嚴禁脫離代碼庫自行腦補不存在的技術框架（如 WebGL 手動記憶體釋放、Three.js OrbitControls、GLB 資產流）。
2. **五大協定檔案 AI 閱讀速度與高信噪比全面稽核**：
   - **頂部快速路由全覆蓋 (Lifecycle Fast-Path Routing)**：五大文件（`AGENTS.md`、`AGENTS-GIT.md`、`AGENTS-FRONT.md`、`AGENTS-BACK.md`、`AGENTS-UNITY.md`）頂部全部具備情境路由地圖或速查表，AI 接收特定任務時可在 1 秒內直接命中目標章節，無需全篇冗長掃描。
   - **單一職責與零重複 (SRP)**：母協定專注全域仲裁與架構規範、版控協定專注 Git 與 README、前端/後端/Unity 特化規範庫純為靜態規範庫（無指令、無跨層越權）。
   - **語義格式標準化**：全量落實臺灣繁體中文（臺灣「臺」標準）、保留業界標準英文術語、標題導言規範、純粹專業中英並陳（去裝飾化符號）。
3. **專案建置與代碼庫驗收**：
   - 執行 `pnpm run build`，TypeScript 0 型別錯誤，Vite 生產打包 454ms 零錯誤通過。
