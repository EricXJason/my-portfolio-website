# 系統願景與全域拓撲 | System Vision & Global Topology

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **規範標準 / Compliance**: 依據《AGENTS.md》全域最高工業級工程協定第 6.1 節規範建置。本文件為系統架構唯一真實來源 (SSOT) 之首要核心，定義個人官方作品集網站（Portfolio）之全域願景、業務承載目標、SLA 與 C4 Model 架構拓撲。  
> *Release: 2026-09-14*

---

## 1. 業務痛點與預期承載能力 | Business Pain Points & System Capacity

> [!NOTE]
> **系統目標與核心 SLA 基準 | Strategic Vision & Benchmark Targets**:
> - **極致邊緣快取**: 預編譯靜態邊緣架構，首屏渲染延遲壓制於 `< 800ms`，全站累積版面位移 `CLS = 0`。
> - **高對比無障礙**: 深色主題對比度達 `18.7:1`、淺色模式達 `17.9:1`，全面超標符合 `WCAG 2.2 AAA` 標準。
> - **型別與構建安全**: TypeScript 靜態編譯 `0 型別錯誤`，Vite 生產打包確定性控制於 `< 400ms`。

本專案旨在為 **許哲誠（HSU, CHE-CHENG）**（國立臺灣藝術大學多媒體動畫藝術學系碩士）建置具備極致科技美學與頂級工程標準的個人官方作品集網站，提供全球招募主管、技術專家、AI 代理爬蟲與一般訪客卓越的互動體驗。  
*This project establishes the personal official portfolio website for **HSU, CHE-CHENG** (MFA, Department of Multimedia and Animation Arts, National Taiwan University of Arts). Engineered to the highest software engineering standards under a Tactical Cyberpunk HUD aesthetic, it delivers an uncompromising interactive experience for global hiring managers, technical experts, AI agent crawlers, and general visitors.*

### 1.1 業務核心目標 | Core Business Objectives
- **跨領域專業展現**：深度整合 VR/AR 互動應用開發 (Unity / Unreal Engine)、全端網頁工程 (React 19 / TypeScript / Vite / Tailwind CSS / Firebase BaaS) 與新媒體藝術美學。  
  *Cross-Disciplinary Showcase: Seamlessly integrates interactive VR/AR engineering (Unity / Unreal Engine), modern full-stack web architecture (React 19 / TypeScript / Vite / Tailwind CSS / Firebase BaaS), and contemporary new media aesthetics.*
- **自研視覺化 CMS 內容管理**：提供涵蓋首頁看板、技能矩陣、專案作品、經歷學歷與美術畫廊等八大模組之即時可視化後臺，具備未儲存狀態阻斷防護（Unsaved State Guard）與安全門禁。  
  *In-House Visual CMS Suite: Houses a dedicated, zero-framework visual CMS covering eight core modules (Hero, Skills, Projects, Education, Art Gallery, etc.) equipped with a robust Unsaved State Guard and mode selection security gates.*
- **雙向即時熱更新與持久化**：CMS 編輯結果即時反映於本地快取與前臺視圖，並整合 Firebase Storage 作為 BaaS 雲端儲存中心。  
  *Bi-Directional Hot Sync & Persistence: CMS edits synchronize instantly with local state and public views, backed by Firebase Storage for asynchronous multimedia cloud persistence.*

### 1.2 系統承載與工程指標 | System Capacity & Engineering Benchmarks
- **初始首屏載入延遲 (FCP / LCP)**：預編譯靜態邊緣快取，首屏渲染延遲壓制於 < 800ms。  
  *First Contentful / Largest Contentful Paint (FCP / LCP): Edge-cached static delivery ensuring initial render < 800ms.*
- **累積版面位移 (CLS)**：嚴格為 0（全站零版面跳動與位移）。  
  *Cumulative Layout Shift (CLS): Strictly 0 (zero visual displacement).*
- **互動就緒延遲 (INP / TBT)**：組件輕量化與事件優化，主線程阻塞時間 < 50ms。  
  *Interaction to Next Paint (INP / TBT): Lightweight component tree ensuring main-thread blocking < 50ms.*
- **無障礙對比度實測 (WCAG 2.2)**：深色主題文字對比度達 18.7:1，淺色主題達 17.9:1，符合 AAA 規範。  
  *WCAG 2.2 Contrast Verification: Measured text contrast ratios of 18.7:1 (Dark Mode) and 17.9:1 (Light Mode), meeting AAA criteria.*
- **型別與構建安全閘門 (Build Gates)**：TypeScript 靜態編譯 0 型別錯誤，Vite 生產打包時間穩定壓制於 < 400ms。  
  *Type Safety & Build Gates: Zero TypeScript compile errors, sub-second deterministic Vite build (< 400ms).*

### 1.3 服務可用性 SLA | Service Level Agreement
- **目標可用性**：99.99%（依託 Cloudflare Pages 全球 Anycast 邊緣網絡與高可用性 CDN 快取）。  
  *Target Availability: 99.99% (backed by Cloudflare Pages Anycast global edge network and high-performance CDN caching).*

---

## 2. C4 Model 架構圖 | C4 Model Architecture Diagrams

本節以 C4 Model 標準呈現系統與外部使用者及周邊雲端服務之上下文邊界與容器級拓撲。  
*This section presents the System Context and Container diagrams using the C4 Model methodology.*

### 2.1 系統情境圖 (System Context Diagram - Level 1)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#030712',
    'mainBkg': '#0b0f19',
    'nodeBorder': '#00f0ff',
    'textColor': '#f8fafc',
    'lineColor': '#00f0ff',
    'edgeLabelBackground': '#030712',
    'fontSize': '12px'
  },
  'flowchart': {
    'curve': 'linear'
  }
}}%%
flowchart TD
    classDef hudCard fill:#0b0f19,stroke:#00f0ff,stroke-width:1.5px,color:#f8fafc;

    User["訪客 / 招募專家 / 評審<br>Visitors / Recruiters / Reviewers"]:::hudCard
    Admin["網站作者 (許哲誠)<br>Author: HSU, CHE-CHENG"]:::hudCard
    Crawler["AI 代理人 / 搜尋引擎爬蟲<br>AI Agents & Web Crawlers"]:::hudCard

    Portfolio["個人作品集前端系統<br>Portfolio Web Application (React 19)"]:::hudCard
    CMS["自研視覺化 CMS 管理後臺<br>In-House Visual CMS Suite"]:::hudCard

    Firebase["Firebase Storage & Auth (BaaS)<br>雲端儲存與身分驗證"]:::hudCard
    Cloudflare["Cloudflare Pages (Anycast CDN)<br>全球邊緣快取節點"]:::hudCard

    User -->|"HTTPS 瀏覽展示 / HTTPS Browse"| Portfolio
    Admin -->|"模式切換與認證 / Auth Mode"| CMS
    Crawler -->|"讀取 llms.txt & JSON-LD"| Portfolio
    
    CMS -->|"多媒體與資料儲存 / Cloud API"| Firebase
    Portfolio -->|"靜態分發與快取 / Edge CDN"| Cloudflare
```

### 2.2 容器服務圖 (Container Diagram - Level 2)

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#030712',
    'mainBkg': '#0b0f19',
    'nodeBorder': '#00f0ff',
    'textColor': '#f8fafc',
    'lineColor': '#00f0ff',
    'clusterBkg': '#060a14',
    'clusterBorder': '#1e293b',
    'titleColor': '#00f0ff',
    'edgeLabelBackground': '#030712',
    'fontSize': '12px'
  },
  'flowchart': {
    'curve': 'linear'
  }
}}%%
flowchart TD
    classDef hudCard fill:#0b0f19,stroke:#00f0ff,stroke-width:1.5px,color:#f8fafc;

    subgraph TierBrowser ["用戶端環境 (Client Environment - React 19 SPA)"]
        Preloader["開場門禁引擎<br>InitialPreloader"]:::hudCard
        MainApp["前臺八大模組展示系統<br>MainSiteContent"]:::hudCard
        CMSApp["CMS 管理後臺系統<br>CmsApp (Lazy Chunk)"]:::hudCard
        StateGuard["未存檔狀態阻斷防護<br>CmsDirtyContext"]:::hudCard
    end

    subgraph TierServices ["資料快取與雲端基礎設施 (Persistence & Cloud Services)"]
        LocalStorage["本機離線優先快取<br>localStorage"]:::hudCard
        FBAuth["Firebase Auth 鑑別中心<br>Identity & Session Gate"]:::hudCard
        FBStorage["Firebase Storage 多媒體庫<br>Cloud Multimedia Assets"]:::hudCard
        CFPages["Cloudflare Pages 邊緣快取<br>Global Anycast CDN"]:::hudCard
    end

    Preloader -->|"進入展示主頁 / Mount View"| MainApp
    MainApp -->|"讀取快取複寫 / Read Cache"| LocalStorage
    CMSApp -->|"變更防護攔截 / Dirty Guard"| StateGuard
    CMSApp -->|"持久化寫入 / Write Cache"| LocalStorage
    CMSApp -->|"會話校驗 / Verify Session"| FBAuth
    CMSApp -->|"非同步媒體儲存 / Cloud Upload"| FBStorage
    MainApp -->|"靜態資產快取分發 / Edge CDN"| CFPages

    style TierBrowser fill:#060a14,stroke:#1e293b,stroke-width:1px,color:#00f0ff
    style TierServices fill:#060a14,stroke:#1e293b,stroke-width:1px,color:#00f0ff
```
