# 本次任務清單 (Session Check-List)

> 本文件每次對話完整覆寫，嚴禁保留舊項目。

---

## 使用者明確請求

1. 將 About 區塊的年齡資訊從 **24歲** 改為 **25歲**（中英文雙語皆須更新）。

---

## AI 實際執行

1. 搜尋全站年齡關鍵字（`age`、`歲`），定位到以下兩個資料檔案各含中英文兩筆記錄，共 4 處修改：
   - `src/data/about-section.json`（中文 `p1` 及英文 `p1`）
   - `src/data/site-translations.json`（中文 `about_p1` 及英文 `about_p1`）
2. 執行 `multi_replace_file_content` 將所有 `24歲` / `24 years old` 替換為 `25歲` / `25 years old`，建置不受影響。
