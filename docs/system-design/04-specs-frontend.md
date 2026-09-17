# 前端展示模組與 UI 狀態防禦規格 | Frontend Showcase & UI State Defense Specifications

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **協定標準 / Compliance**: 依據《AGENTS.md》全域最高工程中樞協定規範建置。本文件定義前臺八大展示模組、CMS 管理後臺之功能規格、UI 狀態管理與極限邊界防禦機制。  
> *Release: 2026-09*

---

## 1. 核心前臺模組展示規格 | Core Public Showcase Specifications

本節定義前臺八大核心模組之業務職責、展示邏輯與無障礙相容性要求。

| 模組名稱 (Module) | 業務規格與功能要點 (Specifications & Capabilities) |
| :--- | :--- |
| **Hero 首頁看板 (Hero Banner)** | 賽博龐克機甲微表情機器人（支援滑鼠軌跡眼球追蹤）、雙語標題與動態副標、外部社群一鍵連結與剪貼簿聯絡資訊複製 / Cyberpunk mecha avatar with pupil tracking, dual-language typewriter headers, and one-click contact copying |
| **About 關於我 (About Me)** | 個人專業簡歷、新媒體藝術學術背景與三大核心指標卡片（碩士學位、多專案實績、國際證照）/ Professional bio, academic background, and metric summary HUD cards |
| **Skills 技能矩陣 (Skills Matrix)** | 兩大核心領域（遊戲開發、全端工程）與輔助技能矩陣，晶片化科技標籤展示，根分類永久顯示而子項具細粒度開關 / Core engineering domains (Game Dev, Full-Stack) with chip-style tech tags |
| **Projects 專案作品 (Featured Projects)** | 多維度過濾（全部、互動應用、前端開發、全端開發）、精選橫向看板、全專案矩陣、雙欄詳情燈箱與 YouTube 影音嵌入，支援隱藏項目自動脫離精選 / Multi-tag filtering, spotlight showcases, lightbox inspector, and embedded video demo |
| **Education 經歷學術 (Academic & Experience)** | 整合學歷歷程、工作經歷、國科會研習歷程與論文期刊發表，以結束時間精確自動降序排序並支援雲端連結 / Timeline chronicle covering academics, professional career, research projects, and publications |
| **Certifications 專業證照 (Certificates)** | 國際語言檢定（TOEIC 755 藍色證書，具可視性開關）與專業技術證照庫，支援外部證明文件直接檢視驗證 / Global language proficiency and professional engineering certifications |
| **Art Gallery 美術畫廊 (Art Gallery)** | 3D 場景/道具輪盤展示、互動 3D 檢視器（ArtStation 3D 嵌入）、2D 麥克筆與概念素描燈箱 / 3D prop turntable showcases, interactive ArtStation 3D embedded viewer, and 2D concept art lightbox |
| **Navbar 導覽控制 (Navigation Header)** | 錨點快速跳轉、雙語切換開關、深淺主題切換開關、Web Audio 合成音效引擎開關 / Smooth anchor jumps, language switcher, HUD theme toggler, and Web Audio synthesized BGM control |

---

## 2. 自研視覺化 CMS 管理後臺規格 | In-House Visual CMS Specifications

本節定義自研 CMS 之操作權限、防護機制、雙向串流同步與編輯器人因工程。

### 2.1 官方身分驗證門禁 | Official Authentication Security Gate

進入 CMS 後臺強制通過 Firebase Authentication 官方安全門禁，杜絕旁路模擬登入與暴力破解漏洞。

- **官方帳密鑑別**：透過 `signInWithEmailAndPassword` 執行密碼學層級驗證，非合法帳密強制阻斷於門禁外。
- **會話生命週期防護**：登入憑證有效期間維持工作階段，登出時徹底清空記憶體會話狀態。

### 2.2 未儲存狀態智慧阻斷防護 | Unsaved State Guard (`CmsDirtyContext`)

本防護機制確保管理者在編輯過程中絕不因誤觸或非預期導航而遺失任何資料。

- **異動動態標記**：任何編輯器表單輸入發生變更時，即刻標記 `isDirty = true`。
- **導航攔截三向處置**：嘗試切換左側功能標籤或返回前臺時，強制彈出 `CmsUnsavedModal`，提供「儲存變更並離開」、「放棄變更並離開」與「留在本頁」三種清晰決策路徑。
- **瀏覽器離開攔截**：註冊 `beforeunload` 事件監聽，防範意外關閉分頁或重整頁面。

### 2.3 刪除操作二次確認防線 | Two-Step Deletion Confirmation

全模組之破壞性刪除操作皆配置高警示之二次確認對話框 (`CmsConfirmDialog`)。

- **全域 Portal 掛載**：使用 React `createPortal` 掛載至 `document.body` 最外層，杜絕任何 CSS `overflow: hidden` 或定位干擾。
- **明確警示提示**：列出即將刪除之實體標題，避免管理員誤刪重要履歷或專案資料。

### 2.4 雙向跨語系連動與文字隔離 | Cross-Language Sync & Content Isolation

針對中英文雙語環境實作結構同步與內容獨立機制。

- **結構性欄位全域連動**：新增項目、刪除項目、日期區間、排序索引、標籤分類與可視性開關在中英文模式下雙向連動，避免多語系結構脫節。
- **純文本欄位獨立維護**：各語系之專案描述、個人自傳、職責貢獻與標題各自獨立維護，支援精準在地化翻譯。
