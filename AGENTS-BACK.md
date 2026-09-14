# ⚡ AGENTS-BACK.md | 全域 AI Agent 後端與資料庫特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **適用領域**: 後端伺服端 (Java / Spring Boot, Node.js / NestJS / Express, Go, Python)、資料庫 (SQL / NoSQL / Redis) 與微服務架構  
> **協定性質**: 本文件為純靜態規範庫，**不包含任何可調用指令**。專門定義企業級分層架構、資料庫交易邊界、快取防禦策略、零信任資安雙 Token、金鑰隔離與可觀測性維運標準。  
> *Release: 2026-09-14*

---

## 🧭 Agent 階段生命週期巡檢地圖 (Lifecycle Fast-Path Routing)

為加速 Agent 閱讀，執行後端任務時請直接跳轉對應章節進行局部深讀：

```
[情境 A: 後端分層與命名規範] ──> 閱讀【第 1 章】(Java/Node/Go 分層架構與命名覆寫)
│
[情境 B: 資料庫設計與交易處理] ──> 閱讀【第 2 章】(ERD、ACID、快取防禦與冪等性)
│
[情境 C: 身分鑑別與資安防護] ──> 閱讀【第 3 章】(雙 Token、RBAC、RFC 7807 錯誤格式、.env)
│
[情境 D: 容器化構建與可觀測性] ──> 閱讀【第 4 章】(Docker 多階段構建、健康檢查與結構化日誌)
```

---

## 0. 🏆 獨立運作降級與優先級覆寫 (Standalone & Overrides)

本章節確立本特化規範庫與母協定之交互關係與覆寫權限。

### 0.0 獨立運作降級條款
本條款定義獨立環境下的預設運作基準：
若當前專案未提供 `AGENTS.md`，本文件自動啟用獨立降級模式：強制使用臺灣繁體中文對話、代碼頂部包含繁體中文 Header 區塊註解、金鑰強制走 `.env`（嚴禁硬編碼）、遵循嚴格 Clean Code 分層架構。

### 0.1 後端優先級覆寫原則
本條款確立後端類別命名與套件路徑之最高裁判權限：
Java 與 C# 類別檔名強制採用 **`PascalCase`**（例如 `OrderServiceImpl.java`），套件路徑全小寫無底線，本條款具備最高法律效力，強制覆蓋通用 `kebab-case` 檔名規則。

---

## 1. 🏗️ 後端分層架構與命名規範 (Architecture & Naming)

本章節規範企業級後端服務之實體分層職責與程式碼命名標準。

### 1.1 分層架構職責隔離 (Layered Architecture)
本條款明訂後端核心分層之職責邊界，嚴禁跨層越權存取：
* **`controller/` (協定與傳輸層)**: 負責路由派發、HTTP 狀態碼映射、請求參數格式校驗（DTO Validation），嚴禁包含實質商業邏輯。
* **`service/` (領域商務邏輯層)**: 負責核心商務運算、交易邊界控制、事件發布與領域規則驗證。
* **`repository/` 或 `dao/` (資料存取層)**: 負責資料庫查詢、持久化儲存與快取交互，嚴禁依賴 Controller 或 DTO。
* **`model/entity/` 與 `model/dto/` (模型隔離)**: 資料庫實體（Entity）與外部通訊物件（DTO）強制物理隔離，嚴禁直接將 Entity 回傳予客戶端。

### 1.2 語言特化命名標準 (Language Specific Standards)
本條款規範各主流後端語言之標準命名慣例：
* **Java (Spring Boot 生態)**:
  * 類別與檔案：`PascalCase.java`（例如 `UserServiceImpl.java`, `PaymentController.java`）。
  * 介面命名：`PascalCase`，**不加 `I` 前綴**；實作類別結尾加 `Impl`（例如 `OrderService` 與 `OrderServiceImpl`）。
  * 成員變數與方法：小駝峰 `camelCase`；常數採用全大寫蛇形 `UPPER_SNAKE_CASE`。
* **Node.js (NestJS / Express 生態)**:
  * 檔案命名：連字號加後綴 `kebab-case.service.ts`、`kebab-case.controller.ts`。
  * 私有成員：強制小駝峰加底線前綴 **`private _camelCase`**。
* **Go (Golang 生態)**:
  * 檔案命名：蛇形 `snake_case.go`。
  * 導出成員（Public）：首字母大寫 `PascalCase`；未導出成員（Private）：小駝峰 `camelCase`。

---

## 2. 💾 資料庫設計、ACID 交易邊界與快取防禦策略

本章節定義資料持久化設計、高併發寫入防護與分散式快取標準。

### 2.1 實體關聯 (ERD) 與資料庫完整性
本條款規範關聯式與非關聯式資料庫之約束標準：
* **主鍵與索引規範**: 所有資料庫資料表必須具備明確之主鍵（UUID v4 或雪花算法 Snowflake ID），查詢高頻欄位建立複合索引。
* **外鍵約束與關聯**: 明確定義關聯性約束與刪除行為（如 `ON DELETE RESTRICT`），防止產生無主孤兒資料。
* **審計欄位 (Audit Fields)**: 核心資料表強制具備 `created_at`、`updated_at` 與 `deleted_at`（軟刪除支援）。

### 2.2 ACID 交易邊界與冪等性防護 (Idempotency)
本條款確立金融級資料寫入之防重送與交易安全底線：
* **ACID 交易保證**: 涉及多資料表異動、狀態扭轉或金流扣款之操作，必須包裹於 `@Transactional` 交易內，任何異常強制 Rollback。
* **冪等性機制 (Idempotency-Key)**: 關鍵寫入端點（如支付、下單、發券）強制要求 Header 攜帶唯一 `Idempotency-Key`，配合 Redis 分散式鎖（帶有適當 Lease Time）防範重試造成的重複扣款。

### 2.3 快取高可用性防禦方案 (Cache-Aside Pattern)
本條款明訂快取層之三大穿透防護實作：
* **防穿透 (Cache Penetration)**: 查詢不存在之資料時，將空值寫入快取並配置極短 TTL（如 30 秒），或於前端布隆過濾器（Bloom Filter）阻斷非法 ID。
* **防擊穿 (Cache Breakdown)**: 熱點 Key 失效瞬間，利用互斥鎖（Mutex Lock）僅允許單一線程穿透至資料庫重構快取，其餘請求等待重試。
* **防雪崩 (Cache Avalanche)**: 快取過期時間強制加入隨機擾動因子（Jitter，如基礎 TTL 加上 10%~20% 浮動），杜絕巨量 Key 同時集體失效。

---

## 3. 🔐 零信任資安架構、身分鑑別與金鑰隔離

本章節確立後端無狀態身分驗證與通訊防禦標準。

### 3.1 雙 Token 旋轉機制 (JWT Rotation Protocol)
本條款規範業界標準之雙 Token 生命週期控制：
* **Access Token**: 短效期（建議 15 分鐘），存放於記憶體或 Header 中，用於無狀態之快速鑑權。
* **Refresh Token Rotation (RTR)**: 長效期（建議 7 天），儲存於 HttpOnly 安全 Cookie 或白名單 Redis 中。每次使用 Refresh Token 換發時，**舊 Token 立即作廢並簽發全新密鑰對**；若檢測到已作廢之 Token 再次被嘗試使用，立即阻斷並凍結該帳號所有 Session（防盜取警報）。

### 3.2 角色型存取控制 (RBAC) 與金鑰隔離
本條款確立權限防線與敏感機密隔離原則：
* **RBAC 權限攔截**: 嚴格於 Middleware / Interceptor / Guard 層完成角色與權限判定，不可依賴客戶端自述角色。
* **絕對環境變數隔離**: 資料庫連線字串、JWT Secret、第三方 API 金鑰**強制經由 `.env` 檔案注入**，程式碼庫內**絕對禁止硬編碼任何密鑰**。專案必須隨附 `.env.example` 提供變數清單。
* **RFC 7807 標準錯誤格式**: API 異常回應統一回傳標準結構化 Problem Details JSON，生產環境嚴禁向客戶端洩漏內部 Stack Trace 或 SQL 語法。

---

## 4. 🐳 容器化構建、健康檢查與可觀測性維運

本章節規範服務打包、健康探針與線上結構化日誌輸出。

### 4.1 Docker 多階段構建 (Multi-stage Build)
本條款定義映像檔瘦身與資安加固要求：
* **多階段分離**: Dockerfile 明確拆分 `builder`（編譯環境）、`tester`（單元測試）與 `runner`（最小執行環境，如 Alpine 或 Distroless）。
* **非 Root 使用者**: 容器內部進程強制以最小權限之非 root 使用者身分執行。

### 4.2 可觀測性與結構化日誌 (Observability & Structured Logging)
本條款規範後端系統之線上監控與故障排查標準：
* **結構化 JSON 日誌**: 捨棄無結構字串列印，統一輸出 JSON 格式日誌，必備欄位包含：`timestamp`, `level`, `traceId`, `service`, `message`, `context`。
* **全域關聯標識符 (Trace ID)**: 所有連入請求於入口自動派發或透傳 `X-Request-ID`，貫穿所有非同步事件、日誌與下游 RPC 呼叫。
* **標準健康探針 (Health Checks)**: 必須提供標準健康檢查端點（`/healthz` 或 `/actuator/health`），明確回報 Liveness 與 Readiness 狀態。