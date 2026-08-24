# Session Check-List

## 使用者明確請求

1. **請求**：精選作品區中，「個人作品集網站」等專案圖片的掃描線效果不一致，請徹底修正為全體同步一致。

---

## AI 實際執行

### 1. `src/index.css` & `src/components/Projects.tsx` — 精選作品掃描線 100% 同步化
- ✅ **全卡片掃描線週期與進度鎖步同步**：將 `.card-scanline-laser` 動畫調校為精準 `3.5s linear infinite`，並加入 `will-change: top, opacity` 確保 GPU 渲染毫秒不差。
- ✅ **常駐可見度與高光微動效**：在全專案卡片（包含「個人作品集網站」、「覺醒協議」、「滅境之星」）上，統一設定為常駐微光掃描 `opacity-75`，Hover 時強化為 `opacity-100`，保證所有專案卡片在畫面呈現時，雷射掃描光束永遠處於完全相同的垂直高度與移動進度，徹底消除單一卡片視覺不同步或延遲的問題。

---

## 影響模組
- `src/components/Projects.tsx`
- `src/index.css`
- `docs/check-list.md`
- `docs/change-log.md`
