# AGENTS-BACK.md | 全域 AI Agent 後端特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)[cite: 4]  
> **適用領域**: 後端伺服端 (Java / Spring Boot, Node.js / NestJS, Go, Python)、資料庫 (SQL / NoSQL / Redis) 與微服務架構規範庫。純靜態規範庫，完全繼承 `AGENTS.md`。[cite: 4]

---

## 1. 後端分層架構與命名規範

* **分層架構隔離**:
  * **`controller/`**: 負責路由派發、DTO 格式校驗與 HTTP 狀態碼映射，嚴禁撰寫商務邏輯。[cite: 4]
  * **`service/`**: 負責核心商務運算、交易邊界控制與領域規則驗證。[cite: 4]
  * **`repository/` 或 `dao/`**: 負責資料持久化查詢與快取交互。[cite: 4]
  * **`entity/` 與 `dto/` 隔離**: 資料庫持久化實體與外部通訊物件強制物理隔離，嚴禁直接回傳 Entity。[cite: 4]
* **主流語言命名覆寫**:
  * **Java (Spring Boot)**: 類別與檔名採用 `PascalCase.java`；介面不加 `I` 前綴，實作類別結尾加 `Impl`（如 `UserServiceImpl`）；變數與方法採用 `camelCase`。[cite: 4]
  * **Node.js (NestJS)**: 檔案採用連字號 `kebab-case.service.ts`；私有成員採用 **`private _camelCase`**。[cite: 4]
  * **Go**: 檔案採用 `snake_case.go`；導出成員採用 `PascalCase`，未導出成員採用 `camelCase`。[cite: 4]

---

## 2. 資料庫設計、交易邊界與快取防禦

* **資料庫設計規範**: 強制具備明確主鍵（UUID v4 或雪花算法），高頻欄位建立複合索引；核心實體必備 `created_at`, `updated_at`, `deleted_at` 審計欄位。[cite: 4]
* **ACID 交易與冪等性**:
  * 跨表異動與金流運算強制包裹於交易（`@Transactional`）中，異常強制 Rollback。[cite: 4]
  * 關鍵寫入端點強制校驗 Header 之 `Idempotency-Key`，配合 Redis 分散式鎖防範重複扣款或重送。[cite: 4]
* **快取防禦策略 (Cache-Aside Pattern)**:
  * **防穿透**: 查無資料時將空值寫入快取（極短 TTL）或於前端配置布隆過濾器。[cite: 4]
  * **防擊穿**: 熱點 Key 失效瞬間使用互斥鎖（Mutex Lock）僅允許單一線程穿透至資料庫重構快取。[cite: 4]
  * **防雪崩**: 快取失效時間強制加入 10%~20% 隨機擾動因子（Jitter）。[cite: 4]

---

## 3. 零信任資安架構與金鑰隔離

* **雙 Token 旋轉機制 (JWT Rotation)**:
  * **Access Token**: 短效期（建議 15 分鐘），用於無狀態請求鑑權。[cite: 4]
  * **Refresh Token Rotation (RTR)**: 長效期（建議 7 天），儲存於 HttpOnly 安全 Cookie 或 Redis 白名單。每次換發時舊 Token 立即作廢並核發全新密鑰對；若檢測到已失效 Token 被再次使用，強制凍結該帳號全部 Session。[cite: 4]
* **RBAC 權限與金鑰防禦**:
  * 權限判定強制於 Guard / Interceptor / Middleware 層完成，嚴禁依賴客戶端自述角色。[cite: 4]
  * 資料庫連線、JWT Secret、第三方 API Key **強制經由 `.env` 注入**，代碼庫內絕對禁止硬編碼機密；專案必須隨附 `.env.example`。[cite: 4]
  * API 異常回應統一遵循 RFC 7807 結構化 Problem Details 格式，嚴禁外洩內部 Stack Trace 或 SQL 語句。[cite: 4]

---

## 4. 容器化構建與可觀測性維運

* **Docker 多階段構建**: Dockerfile 明確拆分編譯環境與最小化執行環境（如 Alpine 或 Distroless），容器進程強制以最小權限之非 root 使用者執行。[cite: 4]
* **結構化日誌**: 統一輸出 JSON 格式日誌，必備 `timestamp`, `level`, `traceId`, `service`, `message`, `context`。[cite: 4]
* **全域追蹤與健康探針**: 入口自動派發或透傳 `X-Request-ID`；必須提供標準 `/healthz` 端點回報存活與就緒狀態。[cite: 4]