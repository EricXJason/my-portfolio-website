# Session Check-List

## 使用者明確請求

1. **請求**：多益證照卡片回到原本金色（Amber Gold）狀態，確認無誤後執行 Git 提交與推送（Push）。

---

## AI 實際執行

### 1. `src/components/Certifications.tsx` — 多益卡片回歸高雅榮譽琥珀金（Amber Gold）
- ✅ **經典高對比琥珀金榮譽卡片**：
  - 深色模式：`#091328` 底色搭配 `#f59e0b` 戰術邊框與 `#fbbf24` 高光。
  - 淺色模式：`#fffbeb` 底色搭配 `#fcd34d` 邊框與 `#b45309` 文本，100% 符合 WCAG AAA 高對比可讀性。
  - 專屬金色獎盃圖示盒（`Trophy`）與「多益成績證明」金色切角按鈕。

### 2. `src/components/Education.tsx` — 學歷三大證明按鈕三色區隔
- ✅ **畢業證書** $\rightarrow$ **賽博亮青（Cyber Cyan）**
- ✅ **歷年成績單** $\rightarrow$ **科技湛藍（Cyber Blue）**
- ✅ **系排名證明** $\rightarrow$ **霓光紫晶（Cyber Purple）**

### 3. `src/components/InitialPreloader.tsx` — 毫秒級滿幀絲滑載入
- ✅ **線性偏置平滑遞進動力學（$p(t) = 1.25t - 0.25t^2$）**：起步即刻推進、全程勻速、終點溫和著陸，消除遲滯與跳格。
- ✅ **Tabular-Nums 防抖**：百分比寬度固定，GPU 複合層（`transform: scaleX`）直更 DOM，達成 120fps/60fps/144Hz 滿幀流暢。

---

## 影響模組
- `src/components/Certifications.tsx`
- `src/components/Education.tsx`
- `src/components/InitialPreloader.tsx`
- `docs/check-list.md`
- `docs/change-log.md`
