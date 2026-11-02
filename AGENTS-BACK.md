# AGENTS-BACK.md | 全域 AI Agent 後端與資料庫特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-10-27 01:35:00  
> **適用領域**: 後端伺服器 (Java/Spring Boot, Node.js, Go, Python)、關聯式資料庫 (SQL, Redis) 與雲端微服務。純靜態規範庫，完全繼承 `AGENTS.md`。

---

## 1. 後端分層架構、Spring Boot 工程規範與命名慣例

- **全端專案雙目錄物理隔離**:
  根目錄劃分為 `frontend/` 與 `backend/` 獨立雙目錄，各自獨立管理相依套件（`package.json` vs `pom.xml`）、設定檔與建置指令。
- **極致三層式架構與「業務意圖 (Use Case)」邊界防線**:
  - **核心拓撲**: 強制遵循 `Controller (1) -> Business Service / Facade (1) -> 領域資源 (1 對多)`，以「業務意圖」為邊界，絕不以資料表為邊界。
  - **4 大設計黃金法則**:
    1. **Controller 保持極度輕薄 (Thin Controller)**: 1 個 Controller 嚴格只對應 1 個專屬入口 Service；僅負責 HTTP 接收、DTO 校驗 (`@Valid`) 與回應轉發 (`ApiResponse.ok`)；**嚴禁直接注入 Repository、嚴禁編寫業務邏輯、嚴禁跨多個 Service 自行組裝邏輯**。
    2. **Service 以業務流程命名 (統籌 1 對多 Repos)**: 杜絕單表對單 Service 的機械式 CRUD；單一業務 Service 統籌完整業務意圖，可直接注入 1~3 個 Repository；複雜跨領域流程建立專屬 Facade。
    3. **事務邊界 (`@Transactional`) 嚴格收斂在 Service 層且落實雙軌顯式宣告**:
       - **寫操作 (C/U/D)**: 凡涉及資料寫入、修改、軟刪除之方法，**一律強制顯式標註 `@Transactional(rollbackFor = Exception.class)`**，徹底防禦 Checked Exception 引發之未回滾半殘提交。
       - **純讀操作 (Read)**: 凡純檢索與查詢方法，**一律強制顯式標註 `@Transactional(readOnly = true)`**，明確通知資料庫驅動與 ORM 關閉回滾段開銷、不施加排他鎖以釋放極致查詢吞吐量。
       - **Controller 與 Repository 嚴格禁止標註 `@Transactional`**。
    4. **杜絕 Service 平級互打（消滅循環依賴）**: 實體內部狀態變更封裝於 Entity，跨實體純計算抽成 `@Component`；Service 永遠只向下調用 Repositories 或 Components。
- **Java (Spring Boot) 核心工程標準**:
  - **構造器依賴注入 (DIP, 全專案零 @Autowired 鐵律)**:
    - **全專案（Controller, Service, Component, Config 及測試類別）絕對嚴格禁止使用 `@Autowired` 欄位注入**。
    - **一律強制採用建構子注入，並搭配 Lombok `@RequiredArgsConstructor`（成員宣告為 `private final ...`）**；測試類別亦採用構造器注入或顯式傳參。
  - **全域設定外部化與零寫死預設值 (Strict Zero Hardcoded Fallbacks)**:
    - 所有業務參數、系統信箱、金鑰、過期時效與環境設定，100% 於設定檔（`application.properties` / `.env`）中集中管理（SSOT）。
    - **絕對嚴格禁止在 Java 代碼中硬編碼降級值（如 `@Value("${mail.from:test@example.com}")`）**，設定缺失時由 Spring Boot 啟動即時報錯阻斷。
  - **Entity ⇄ DTO 映射零反射強型別轉換 (Zero-Reflection Type-Safe Mapping)**:
    - DTO 與 Entity 轉換，**一律強制採用純原生私有轉換器（如 Service 底部之 `convertToResponse`）或靜態工廠方法（如 `UserResponse.from(entity)`）**。
    - **嚴格禁止使用執行期反射映射庫 (如 ModelMapper)**，消滅反射效能損耗與隱蔽誤灌 Bug。
  - **Lombok 與日誌 (嚴格禁止 @Data 濫用鐵律)**:
    - **嚴格禁止在 Entity 與 DTO 宣告 `@Data`**，杜絕自動生成之 `@EqualsAndHashCode` 在一對多關聯集合中引發遞迴雜湊、記憶體洩漏與比對死穴。
    - **標準實體與 DTO 註解組合**: 一律顯式標註 `@Getter`, `@Setter`, `@ToString`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`。
    - **統一日誌**: 一律使用 `@Slf4j`，嚴禁使用 `System.out.println`。
  - **多分支映射條件規範**: 超過 3 分支之多條件判斷，嚴禁長鏈 `if - else if`，強制採用常數 `Map` 或 `switch-case`。
- **語言命名慣例**:
  - **Java (Spring Boot)**: 類別 `PascalCase.java`；介面不加 `I`，實作類別加 `Impl`；成員與變數採 `camelCase`。
  - **Node.js (NestJS)**: 檔案 `kebab-case.service.ts`；私有成員採 `private camelCase`。
  - **Python (FastAPI)**: 檔案 `snake_case.py`；類別 `PascalCase`；函式與變數採 `snake_case`。
  - **Go**: 檔案 `snake_case.go`；導出成員 `PascalCase`，私有成員 `camelCase`。

---

## 2. 資料庫設計、SQL 集中歸檔與 ORM 防禦

- **SQL 實體檔案唯一真實路徑 (SSOT)**:
  - 全系統關聯式資料庫結構 DDL (`schema.sql`) 與種子資料 DML (`data.sql`)，永遠且僅能存放於：`backend/src/main/resources/database/`。嚴禁散落於根目錄或暫存檔。
- **嚴格禁止 Hibernate 自動建表與改表 (Strict Zero DDL Auto Generation)**:
  - ORM 組態 `spring.jpa.hibernate.ddl-auto` **強制永遠只能設定為 `none`**！嚴禁 `update`, `create`, `create-drop`。
  - 全系統資料庫結構異動，**100% 永遠且僅能由 `backend/src/main/resources/database/schema.sql` 唯一真實來源 (SSOT) 主導**。
- **嚴格禁止 JPA 衍生查詢，100% 強制使用原生 SQL (`nativeQuery = true`)**:
  - **嚴格禁止 Spring Data JPA 方法名稱推導 (如 `findByUsername`, `findAll`, `findById`)**。
  - **所有資料檢索、分頁過濾與統計，強制顯式標註 `@Query(value = "SELECT ... FROM ...", nativeQuery = true)`**，動態條件一律採用命名參數化綁定（`:userId`）防範 SQL 注入。唯一允許之內建方法僅限實體持久化核心指令（`save()`, `saveAll()`）。
- **嚴格禁止多對多關聯 (`@ManyToMany`)**:
  - **全系統 Entity 嚴格禁止宣告 `@ManyToMany`**。
  - 任何多對多場景，強制顯式拆解為獨立中介實體表：`EntityA (1) <-> (N) IntermediateEntity (N) <-> (1) EntityB`，透過 `@OneToMany` 與 `@ManyToOne` 精準掌控關聯生命週期與欄位擴充。
- **交易邊界與快取防禦 (Cache-Aside Pattern)**:
  - 跨表異動強制包裹於 `@Transactional`，失敗自動 Rollback。
  - 快取防穿透（空值快取）、防擊穿（互斥鎖 Mutex）、防雪崩（過期時間附加 10%~20% Jitter）。

---

## 3. 零信任資安架構、雙 Token 輪替與郵件通訊

> 📌 完整資安規格嚴格對齊 `docs/09-security.md`。

- **零信任雙 Token 輪替機制 (Zero Trust Dual-Token Standard)**:
  - **短效 Access Token**: 有效期 **5 ~ 15 分鐘**，無狀態 Bearer Token，隨請求標頭傳送。
  - **長效 Refresh Token (RTR)**: 有效期 **7 ~ 14 天**，強制以 `HttpOnly`, `Secure`, `SameSite=Strict` Cookie 存儲，僅限換發端點調用。
  - **單次輪替 (Rotation)**: 每次換發即作廢舊 Token 並簽發新憑證；作廢 Token 換發觸發重放攻擊防禦阻斷全數活躍 Token。
  - **主動吊銷 (Active Revocation)**: 登出或資安事件時，透過 Redis/內存 JTI 黑名單實現即時吊銷。
- **密碼、權限與防禦**:
  - 密碼全面採用 Argon2id 演算法，嚴禁 MD5/SHA 或純 bcrypt。
  - RBAC 方法級 `@PreAuthorize` 攔截。
  - 錯誤回應遵循 RFC 7807 隱蔽內部堆疊與例外。
- **雲端郵件主力方案 (HTTP REST Mail API)**:
  - 雲端環境普遍封鎖 SMTP 587/465 埠，外發郵件主力方案優先採用 **HTTP REST API (走 HTTPS Port 443，如 Brevo HTTP API)**，零阻斷發送 OTP 與開通驗證信；SMTP 僅得作為本機離線降級備用。

---

## 4. 容器化構建與可觀測性

- **Docker 多階段構建**: 分離編譯與執行環境，使用最小化 Base Image，強制非 root 使用者執行。
- **結構化日誌與保活探針**: 輸出結構化 JSON 日誌（必備 `timestamp`, `level`, `traceId`, `service`, `message`）；配置 Actuator 保活探針 (`/actuator/health`)。

---

## 5. 後端與資料庫 MCP 賦能建議

繼承 `AGENTS.md` §1.4，對接資料庫或雲端服務（MySQL, Redis, Cloudflare 等）且環境具備 MCP 時，主動建議啟用以加速結構查驗、遷移與跨工具自動化。