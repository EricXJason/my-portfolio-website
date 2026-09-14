# 業務功能與極限條件防護規格 | Functional Specifications & Boundary Defense

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **規範標準 / Compliance**: 依據《AGENTS.md》全域最高工業級工程協定第 6.4 節規範建置。定義前臺展示模組與自研 CMS 後臺之功能規格、防護機制與極限邊界處理。  
> *Release: 2026-09-14*

---

## 1. 核心前臺模組規格 | Core Public Showcase Specifications

本專案前臺涵蓋八大核心區塊，嚴格落實雙語映射、自適應排版與 WCAG 2.2 AAA/AA 無障礙標準。  
*The public site comprises eight core modules featuring dual-language parity and adaptive layouts:*

| 模組名稱 (Module) | 業務規格與功能要點 (Specifications & Capabilities) |
| :--- | :--- |
| **Hero 首頁看板 (Hero Banner)** | 賽博龐克機甲微表情機器人（支援滑鼠軌跡眼球追蹤）、雙語標題與動態副標、外部社群一鍵連結與剪貼簿聯絡資訊複製 / Cyberpunk mecha avatar with pupil tracking, dual-language typewriter headers, and one-click contact copying |
| **About 關於我 (About Me)** | 個人專業簡歷、新媒體藝術學術背景與三大核心指標卡片（碩士學位、多專案實績、國際證照）/ Professional bio, academic background, and metric summary HUD cards |
| **Skills 技能矩陣 (Skills Matrix)** | 兩大核心領域（遊戲開發、全端工程）與輔助技能矩陣，晶片化科技標籤展示 / Core engineering domains (Game Dev, Full-Stack) with chip-style tech tags |
| **Projects 專案作品 (Featured Projects)** | 多維度過濾（全部、互動應用、前端開發、全端開發）、精選橫向看板、全專案矩陣、雙欄詳情燈箱與 YouTube 影音嵌入 / Multi-tag filtering, spotlight showcases, lightbox inspector, and embedded video demo |
| **Education 經歷學術 (Academic & Experience)** | 整合學歷歷程、工作經歷、國科會研習歷程與論文期刊發表，時間軸依序呈現與雲端連結存取 / Timeline chronicle covering academics, professional career, research projects, and publications |
| **Certifications 專業證照 (Certificates)** | 國際語言檢定與專業技術證照，支援外部證明文件直接檢視驗證 / Global language proficiency and professional engineering certifications |
| **Art Gallery 美術畫廊 (Art Gallery)** | 3D 場景/道具輪盤展示、互動 3D 檢視器（ArtStation 3D 嵌入）、2D 麥克筆與概念素描燈箱 / 3D prop turntable showcases, interactive ArtStation 3D embedded viewer, and 2D concept art lightbox |
| **Navbar 導覽控制 (Navigation Header)** | 錨點快速跳轉、雙語切換開關、深淺主題切換開關、BGM 合成音效引擎開關與音量調整 / Smooth anchor jumps, language switcher, HUD theme toggler, and Web Audio synthesized BGM control |

---

## 2. 自研視覺化 CMS 管理後臺規格 | In-House Visual CMS Specifications

本節定義自研 CMS 之操作權限、防護機制與編輯邏輯。  
*Defines operational permissions, data guards, and editing ergonomics for the proprietary CMS:*

### 2.1 模式選擇門禁與安全存取 | Mode Selection & Security Gate
進入 CMS 模式前強制經過模式選擇門禁（支援快速測試模式與 Firebase 雲端驗證模式）；載入狀態僅顯示 spinning 光圈（`Loader2`），去除冗贅等待文字；遮罩或 ESC 鍵不可任意穿透，防範意外誤觸。  
*Mandatory security modal preceding admin entry (supporting Sandbox Mode and Firebase Auth Mode); sleek spinner states eliminating redundant text; strict modal click-outside prevention.*

### 2.2 未儲存狀態智慧阻斷防護 | Unsaved State Guard (`CmsDirtyContext`)
任何編輯器表單內容變更時，自動標記 `isDirty = true`；當使用者嘗試切換左側模組或返回前臺時，系統強制彈出 `CmsUnsavedModal`，提供「儲存變更並離開」、「放棄變更並離開」與「留在本頁」三種清晰決策路徑。  
*Form mutations dynamically toggle `isDirty = true`. Attempting navigation triggers `CmsUnsavedModal`, offering three explicit recovery paths: "Save & Exit", "Discard & Exit", or "Stay on Page".*

### 2.3 刪除操作二次確認機制 | Two-Step Deletion Confirmation
專案、學歷、經歷、研習、論文、技能項目、證照與畫廊作品之刪除按鈕，**全面強制彈出二次確認對話框 (`CmsConfirmDialog`)**；使用 React `createPortal` 掛載至 `document.body`，杜絕任何父級容器樣式造成的渲染偏差。  
*All destructive delete triggers across every module require explicit confirmation via `CmsConfirmDialog`. Rendered through React `createPortal` directly onto `document.body` to prevent CSS stacking or parent overflow clipping.*

### 2.4 極簡與直覺編輯原則 | Intuitive Ergonomics & Dual Reordering
移除所有無意義的規範宣導橫幅，專注於純粹高效率的編輯器介面；所有可調整順位之項目，皆具備拖曳把手（Grip）與 `↑`、`↓` 箭頭按鈕，兼顧桌面端與行動裝置操作。  
*Zero bloat or lecturing UI banners; all list items feature dual reordering controls (drag-and-drop handles paired with accessible `↑` and `↓` step buttons) optimized for desktop and mobile ergonomics.*
