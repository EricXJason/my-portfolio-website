# API 與通訊協定規格書 (04-specs-api.md)

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-09-30  
> **通訊架構**: 基於 Google Cloud Firebase Web SDK (v12) 之 BaaS 通訊協定與瀏覽器 LocalStorage 同步機制

---

## 1. Cloud Firestore 通訊協定規格

系統與雲端資料庫透過 Firestore SDK 進行安全通訊，集合嚴格依照專業角色劃分。

### 1.1 集合映射與端點定義

| 專業角色 (Profile) | 路由路徑 | Firestore 集合名稱 (Collection) | 前臺存取權限 | 後臺管理權限 |
| :--- | :--- | :--- | :--- | :--- |
| **全端工程師** | `/` 與 `/f` | `portfolio_fullstack_dev` | 公開唯讀 (`allow read: if true;`) | 登入管理者專屬 (`allow write: if request.auth != null;`) |
| **互動應用工程師** | `/i` | `portfolio_interactive_app_dev` | 公開唯讀 (`allow read: if true;`) | 登入管理者專屬 (`allow write: if request.auth != null;`) |

### 1.2 文檔識別碼 (Document ID) 契約矩陣

集合內部包含 8 個核心文檔，每個文檔對應前端一個完整的領域模組：

| 文檔 ID (Doc ID) | 對應資料結構 | 職責與內容說明 |
| :--- | :--- | :--- |
| `hero` | `HeroSectionData` | 首頁大標題、問候語、專業頭銜、社交連結與聯絡方式清單。 |
| `about` | `AboutSectionData` | 個人大頭照 URL、多語系自傳摘要、分段核心經歷自述與統計標籤。 |
| `skills` | `SkillsSectionData` | 技能分類矩陣（前端、後端、系統、互動技術）、掌握標籤與熟練度。 |
| `projects` | `ProjectsSectionData` | 專案清單、中英雙語描述、技術標籤、展示圖庫、外連與 GitHub 連結。 |
| `experience` | `ExperienceSectionData` | 學經歷時間軸（學歷、正職、研究助理）、成果重點、職責條列與證書。 |
| `certifications` | `CertificationsSectionData` | 專業證照、語言能力證明 (TOEIC)、競賽得獎紀錄與專利清單。 |
| `gallery` | `GallerySectionData` | 3D 美術、視覺設計與多媒體創作畫廊清單（可於全端模式設定隱藏）。 |
| `site_settings` | `SiteSettingsData` | 網站多語系導覽列文字、首頁跑馬燈速度、各區塊顯隱開關與模組排序。 |

### 1.3 資料存取方法與錯誤防禦介面

```typescript
// 1. 取得文檔 (含自動安全降級)
async function getPortfolioDoc<T>(docId: PortfolioDocId, profile: ProfileType): Promise<T>
// 正常流程：從 Firestore 集合讀取；
// 異常流程：若網路離線或 Firestore 拋錯，自動 fallback 至本地靜態 JSON，前臺零報錯。

// 2. 儲存文檔 (CMS 專用)
async function savePortfolioDoc(docId: PortfolioDocId, data: any, profile: ProfileType): Promise<void>
// 驗證流程：確認 request.auth 有效，透過 setDoc 寫入目標集合，成功後更新本地快取與狀態廣播。

// 3. 一鍵種子資料初始化 (Seed Database)
async function seedFirestoreFromLocalJson(profile: ProfileType): Promise<void>
// 批次遍歷 8 個領域模組，將本地預設模板寫入遠端 Firestore，建立初始資料庫。
```

---

## 2. Firebase Storage 媒體上傳通訊協定

用於管理大頭照、專案截圖與作品集視覺素材。

### 2.1 上傳路徑規格
- **路徑格式**: `/uploads/{profile}/{module}/{timestamp}_{sanitized_filename}`
- **範例**: `/uploads/fullstack/projects/1727680000000_dashboard_preview.webp`

### 2.2 傳輸規格與資安守衛
1. **傳輸格式**: `multipart/form-data` 或 `Blob / File` 二進位流。
2. **檔案大小限制**: 單一檔案上限 **15 MB**（超出即刻於前端攔截）。
3. **MIME 類型檢驗**: 嚴格限定圖片類型（`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `image/gif`）。
4. **回傳結果**: 成功上傳後調用 `getDownloadURL(storageRef)` 取得全球 CDN HTTPS 永久連結。

---

## 3. Firebase Authentication 認證協定

### 3.1 認證方法
- **登入機制**: Email / Password 認證模式 (`signInWithEmailAndPassword`)。
- **Token 維護**: Firebase SDK 自動於 IndexedDB 維護 Refresh Token 與 ID Token。
- **權限生命週期**:
  - `onAuthStateChanged` 即時監聽管理員登入狀態。
  - CMS 前端路由守衛驗證管理者身份，未登入者阻斷儲存與上傳動作，並跳出密碼驗證視窗。

---

## 4. 本地快取與跨分頁同步通訊契約 (LocalStorage)

為了實現極致快速的首頁渲染，本系統實施「快取優先」與「即時事件廣播」機制：

1. **持久化快取鍵**:
   - `portfolio_${profile}_${docId}_data`: 儲存當前環境已驗證的有效資料快照。
2. **即時預覽快取鍵**:
   - `portfolio_preview_${profile}_${docId}`: CMS 編輯器即時打字預覽暫存。
3. **跨分頁廣播機制**:
   - 當 CMS 進行修改或存檔時，透過 `window.dispatchEvent(new StorageEvent(...))` 或 `localStorage.setItem` 廣播更新事件，前臺預覽視窗自動零重載同步最新內容。
