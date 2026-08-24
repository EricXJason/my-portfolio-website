# Session Check-List

## 使用者明確請求

1. **請求 A**：音量鍵有時候關不掉音樂，請嚴格確認並修正。
2. **請求 B**：手機模式下 Toggle（主題/語言切換開關）似乎被擠壓到，比例失衡且邊緣碰撞，請嚴格修正。

---

## AI 實際執行

### 1. `src/utils/bgmSynth.ts` — 音效合成器生命週期與即時靜音重構
- ✅ **根本原因修復**：修復了快速切換音效時因 1200ms `setTimeout` 延遲與 `linearRampToValueAtTime` 缺乏錨點時序，導致舊振盪器殘留於背景並產生幽靈音訊（Ghost Audio）無法關閉的問題。
- ✅ **即時靜音與同步釋放**：在 `stopBGMAudio` 觸發當下，立即執行 `master.gain.cancelScheduledValues`、`master.gain.setValueAtTime(0)`，並同步停止並中斷所有 Pad、Bass、Shimmer 振盪器連線（`osc.stop()`, `osc.disconnect()`），最後掛起音訊上下文（`ctx.suspend()`），達成 **0ms 絕對即時靜音**。
- ✅ **防疊加初始化**：在 `startBGMAudio` 啟動時先呼叫 `cleanupAllNodes()`，杜絕多次點擊引發的振盪器疊加問題。

### 2. `src/components/Navbar.tsx` & `src/components/LangSelectModal.tsx` — 切換開關幾何結構與手機模式排版全面重構
- ✅ **幾何比例修復**：捨棄舊版硬編碼寬度與偏移計算，採用現代精密 2 狀態 Transform 滑塊結構（`transform: translateX(0%)` vs `transform: translateX(100%)`）。
- ✅ **對稱呼吸間距**：滑塊在深色、淺色模式及繁中、英文狀態下，四邊（上下左右）均維持精確的 **2px 懸浮呼吸邊距**，滑塊外框採用 `cyber-cut-sm` 戰術斜角，徹底消除與外框碰撞擠壓或比例失衡的方塊感。
- ✅ **手機端防擠壓（Anti-Squeeze）**：在手機端（`< 640px`）將開關尺寸微調為 `w-[52px] h-[28px]`，並對右側控制區容器添加 `shrink-0`，確保在 360px~390px 小型手機螢幕上各控制項具備獨立間距，不再被 Flexbox 擠壓變形。

---

## 影響模組
- `src/utils/bgmSynth.ts`
- `src/components/Navbar.tsx`
- `src/components/LangSelectModal.tsx`
- `docs/check-list.md`
- `docs/change-log.md`
