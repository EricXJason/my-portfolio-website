# Session Check-List

## 使用者明確請求

1. **請求**：掃描線效果請統一一致（所有卡片與邊界雷射掃描動效回復統一標準參數與同步節奏），完成後直接 Push。

---

## AI 實際執行

### 1. `src/components/Projects.tsx` — 統一專案卡片雷射掃描動效
- ✅ **全專案卡片掃描線標準化**：精選作品卡片、列表專案卡片與彈跳視窗預覽圖之雷射掃描線均統一採用純淨標準 `.card-scanline-laser` 動畫樣式，移除個別行內樣式覆寫，回復整齊一致的賽博龐克掃描律動。

### 2. `src/components/MainSiteContent.tsx` — 統一全域邊界雷射動效
- ✅ **全域左右邊界雷射掃描一致化**：移除左右獨立延遲與週期覆寫，回復標準 `.animate-laser-vert` 統一動畫規範。

---

## 影響模組
- `src/components/Projects.tsx`
- `src/components/MainSiteContent.tsx`
- `docs/check-list.md`
- `docs/change-log.md`
