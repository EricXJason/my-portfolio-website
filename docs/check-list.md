# 本次任務清單 (Session Check-List)

> 本文件每次對話完整覆寫，嚴禁保留舊項目。

---

## 使用者明確請求

1. **代碼動畫速度放慢**：目前背景代碼流速度過快，需調緩。
2. **Loading Bar 更順暢合理**：目前載入條卡頓不自然，需重構為有機感的載入曲線。
3. **完整專案整理與嚴格最佳化**：執行 AGENTS.md § 7「Strict Project Optimization」完整流程。

---

## AI 實際執行

### 任務一：代碼動畫減速（`src/components/FullStackCodeStreamBackground.tsx`）
- 左欄速度：`0.45px/frame → 0.28px/frame`（≈17px/s @60fps，更沉穩環境感）
- 右欄速度：`0.35px/frame → 0.22px/frame`（≈13px/s @60fps）
- RAF 無縫 Loop 架構維持不變

### 任務二：Loading Bar 三段式有機曲線（`src/components/InitialPreloader.tsx`）
- 舊實作：`p(t) = 1.25t - 0.25t²` 線性偏移曲線（1100ms），視覺感受機械卡頓
- 新實作：三段式有機載入曲線（1600ms）：
  - Phase 1（t: 0→0.28）：easeOutQuart，0%→55%，快速衝刺
  - Phase 2（t: 0.28→0.72）：easeInOutCubic，55%→82%，有機節奏
  - Phase 3（t: 0.72→1.0）：easeOutQuart，82%→100%，自信收尾
  - 100% 停留 120ms → 300ms 淡出

### 任務三：嚴格專案最佳化掃描結果
- 外部 Hotlink 圖片：無，所有圖片皆本地 WebP/SVG 物理檔案 ✅
- 無效 console.log：僅 bgmSynth.ts 之 console.warn 屬正常錯誤邊界 ✅
- Oxlint：1 warning（非 error），0 errors ✅
- TypeScript 型別：pnpm tsc --noEmit 零錯誤 ✅
- 圖示格式：12 個品牌 SVG + favicon.svg 全本地 ✅
- 圖片資產：所有 gallery/proj-*/personal 均為 WebP ✅
- 依賴項：無冗餘，全部必要 ✅
- 空目錄：無 ✅
- SEO：OG/Twitter/Canonical/robots/sitemap/Schema.org/llms.txt 完整 ✅
- docs/development-plan.md：已同步追加 §6 背景動畫架構、§7 個人肖像處理規範 ✅
