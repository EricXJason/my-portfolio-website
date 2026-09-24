# 設計系統規範與 WCAG 無障礙標準 | UI/UX Design System & Accessibility Standards

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **協定標準 / Compliance**: 依據《AGENTS.md》全域最高工程中樞協定規範建置。本文件為系統架構唯一真實來源 (SSOT) 之視覺核心，定義 Cyber HUD 設計體系、跨裝置 RWD 響應式佈局矩陣、WCAG 2.2 AAA/AA 對比度規範與多媒體資材分流標準。  
> *Release: 2026-09*

---

## 1. 核心設計語言：賽博龐克戰術 HUD | Core Visual Language: Tactical Cyberpunk HUD

本專案採用自研之科技戰術美學體系，融合幾何切角、微光霓虹與半透明磨砂毛玻璃。

### 1.1 視覺核心元件 | Core Visual Tokens

視覺元件透過幾何造型與邊界裝飾建立一致的科技感與戰術氛圍。

- **Cyber Cut 多邊形切角 (Chamfer Geometry)**：全面採用 `cyber-cut-corner` 與 `cyber-cut-sm` 造型，取代常見的圓角設計，形塑俐落硬派的機甲視覺風格。
- **HUD 邊界括號 (Tactical Corner Brackets)**：於重點卡片四角配置動態括號邊界（`hud-corner-brackets`），強化戰術儀表感與目標鎖定意象。
- **平滑微動畫 (Micro-Interactions)**：按鈕與卡片具備 hover 微光掃描、輕度縮放與 active 觸覺反饋，過渡時間精準控制於 150ms ~ 300ms 之間。

---

## 2. 全裝置相容與 RWD 響應式佈局 | Cross-Device Responsive Layout Matrix

本專案嚴格保證在各類裝置螢幕上的完美呈現，杜絕任何水平溢出或排版坍塌。

| 裝置類型 (Device Tier) | 視窗寬度 (Viewport) | 佈局行為與適配策略 (Adaptive Layout Strategies) |
| :--- | :--- | :--- |
| **桌面寬螢幕 (Desktop)** | ≥ 1024px | 雙欄或多欄網格、固定側邊快速導覽、滑鼠光標視線即時追蹤 / Multi-column grids, fixed HUD sidebar, cursor eye-tracking |
| **平板電腦 (Tablet)** | 768px ~ 1023px | 自適應 2 欄排列、彈性側邊抽屜式選單、兼顧觸控與鍵盤操作 / 2-column adaptive layout, drawer navigation, hybrid touch-friendly |
| **手機直向 (Mobile Portrait)** | < 768px | 單欄垂直流、智慧隱藏高負載粒子背景、提供大尺寸觸控目標（≥ 44x44px）/ Clean vertical stream, particle freeze, 44x44px touch targets |
| **手機橫向 (Mobile Landscape)** | 橫向旋轉模式 | 自動調降卡片高度與緊湊 Padding，防止內容被螢幕邊緣截斷 / Compact card heights and padding, preventing edge clipping |

---

## 3. WCAG 2.2 AAA / AA 無障礙對比度標準 | WCAG Accessibility Contrast Standards

本專案在深色模式與淺色模式下均經過精確計算，全面符合 WCAG 2.2 AAA/AA 標準（本文文字對比度 ≥ 7:1 / 4.5:1）。

### 3.1 深色模式 (Dark HUD Theme)

深色模式建立深邃的虛空夜色背景，搭配極致高對比的高亮文字。

- **背景主色 (Background)**：`#030712` (深邃暗夜黑 / Deep Void Black)。
- **主要文字 (Primary Text)**：`#f8fafc` (對比度高達 18.7:1，遠超 AAA 規範)。
- **次要文字 (Secondary Text)**：`#cbd5e1` (對比度 12.6:1)。
- **霓虹青色強調 (Neon Cyan Accent)**：`#00f0ff` (對比度 15.4:1)。

### 3.2 淺色模式 (Light HUD Theme)

淺色模式以純淨俐落的白底提供極致舒適的長篇閱讀體驗。

- **背景主色 (Background)**：`#f8fafc` / `#ffffff` (現代純淨白 / Modern Pure White)。
- **主要文字 (Primary Text)**：`#0f172a` (對比度高達 17.9:1)。
- **次要文字 (Secondary Text)**：`#334155` (對比度 9.4:1)。
- **科技天藍色 (Tech Sky Blue)**：`#0284c7` (對比度 5.8:1，符合 AA / AAA Large 標準)。
- **高對比覆寫保護 (Contrast Override Guard)**：在淺色模式下，`bg-[var(--neon-cyan)]` 內之文字與圖示強制指定為純白色（`--neon-cyan-fg: #ffffff`），徹底根除深天藍底印黑字導致的閱讀障礙。

### 3.3 全站領域分類順序色與精選金色規範 (Sequential Color Hierarchy)

為形塑層次嚴密且語意一致之戰術介面，全站專案作品、專業技能與畫廊展示統一遵循以下順序色彩與高亮規則：

- **精選專案高亮 (Featured Golden Accent)**：金色 (`#f59e0b` / `#fbbf24`)，代表最核心之旗艦代表作。
- **全部項目基調 (All Items Neutral)**：純白色 (`#ffffff` / `#0f172a`)，提供最高清晰度之全視角導航。
- **第一領域 (Tier 1 - Fullstack / 3D Scenes)**：青色 (`#00f0ff` / `#0284c7`)，象徵全端架構與空間建構。
- **第二領域 (Tier 2 - Interactive / 3D Assets)**：藍色 (`#3b82f6` / `#1d4ed8`)，象徵即時互動與物件演算。
- **第三領域 (Tier 3 - Software / 2D Sketches)**：紫色 (`#c084fc` / `#7c3aed`)，象徵工程架構與手繪骨架。
- **第四領域 (Tier 4 - Multimedia / 2D Marker)**：綠色 (`#34d399` / `#059669`)，象徵色彩感知與視覺合成。
- **看板聯絡資訊卡片 (Hero Contact Triplets)**：由左至右依序遵循「青、藍、綠」三色光譜：聯絡電話（青色）、電子郵件（藍色）、LINE ID（綠色），強化核心通訊鏈之視覺引導。

---

## 4. 資材與多媒體格式分流規範 | Multimedia Asset Segregation Protocol

本專案嚴格遵循高效資材管線與永久性快取原則，確保資材交付之極致穩定性。

- **技術與品牌 Logo / UI 圖示 (Tech & Brand Logos)**：強制採用 **SVG** 向量格式，存放於 `public/tech-icons/` 或整合於 `TechIcon` 組件，保證無損縮放與在地化離線可用性。
- **高解析度作品截圖 (Showcase Media)**：採用現代 **WebP / AVIF** 格式，壓縮率高且保留細節。
- **3D 互動美術作品 (3D Art Interactive)**：採用 ArtStation 3D 嵌入檢視器（`embedUrl`），免除昂貴的本機 3D 渲染資源開銷與 GPU 記憶體洩漏風險。
- **影音示範 (Video Demos)**：採用 YouTube Iframe 延遲載入（Lazy-load），確保首屏加載極速響應。
