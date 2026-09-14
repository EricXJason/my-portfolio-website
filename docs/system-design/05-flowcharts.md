# 核心業務流程圖與狀態轉移 | Flowcharts & State Machine Specifications

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **規範標準 / Compliance**: 依據《AGENTS.md》全域最高工業級工程協定第 6 章規範建置。定義系統之**使用者操作路徑、業務邏輯流程 (Flowchart) 與核心狀態機轉移 (State Diagram)**。本文件不包含 UML 類別圖與循序圖（由 `07-uml-diagrams.md` 獨立專職承擔），落實嚴格分責分離。  
> *Release: 2026-09-14*

---

## 1. 首屏造訪與語言門禁載入流程 | Initial Visit & Language Selection Flowchart

本流程定義訪客首次進入網站時之多階段加載動畫、字體與多媒體資產非同步預載、以及多語系初始化之完整路徑。  
*Defines the progressive hydration sequence, asset preloading, and dual-language preference initialization upon first visit:*

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

    Start(["用戶發起 HTTP 造訪<br>User Initiates Visit"]):::hudCard --> Step1["階段一: InitialPreloader 0%~100% 科技載入動畫<br>Phase 1: Preloader HUD Progress"]:::hudCard
    Step1 --> Preload["非同步預載關鍵 WebP 圖片、SVG 圖標與字體<br>Async Preload Media, Icons & Fonts"]:::hudCard
    Preload --> Step2["階段二: LangSelectModal 語言偏好設定彈窗<br>Phase 2: Language Preference Modal"]:::hudCard
    Step2 --> UserChoice["使用者選定語系<br>Language Preference Chosen"]:::hudCard
    UserChoice -->|"選擇 zh 或 en / Choose zh or en"| SetLang["寫入 LangContext 與派發 HTML lang 屬性<br>Update LangContext & HTML Attributes"]:::hudCard
    SetLang --> Step3["階段三: siteEntered = true 全站平滑淡入<br>Phase 3: Smooth Scene Fade-in"]:::hudCard
    Step3 --> MainView(["呈現前臺首頁 MainSiteContent<br>Public Showcase Rendered"]):::hudCard
```

---

## 2. CMS 模式選擇與身分驗證門禁流程 | CMS Mode Selection & Auth Flowchart

本流程規範從前臺切換至管理員後臺時之認證邊界與錯誤防禦邏輯。  
*Specifies security gates, mode toggles, and fallback paths when transitioning into the admin environment:*

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

    ClickGear["點擊導覽列 CMS 入口按鈕<br>Click CMS Switch in Navbar"]:::hudCard --> OpenDialog["彈出 CmsModeSelectDialog 模式選擇視窗<br>Open Mode Selection Dialog"]:::hudCard
    OpenDialog --> Choice["選擇登入模式<br>Select Mode Option"]:::hudCard
    
    Choice -->|"快速測試登入 / 訪客沙盒"| GrantGuest["設定本地管理態與解鎖本地編輯<br>Unlock Local Storage Sandbox"]:::hudCard
    Choice -->|"Firebase 雲端認證 / Cloud Auth"| OpenFB["彈出 Firebase 認證對話框<br>Open Auth Credentials Modal"]:::hudCard
    
    OpenFB --> InputCreds["輸入管理者 Email 與密碼<br>Input Admin Credentials"]:::hudCard
    InputCreds --> Validating["驗證 Firebase 身分憑據<br>Validate Identity Token"]:::hudCard
    Validating -->|"認證失敗 / Failed"| ShowErr["顯示錯誤提示並阻斷進入<br>Display Error & Intercept Access"]:::hudCard
    Validating -->|"認證成功 / Passed"| GrantAdmin["寫入 Firebase Auth Token 與解鎖完整雲端權限<br>Grant Full Cloud Storage Rights"]:::hudCard
    
    GrantGuest --> CMSView(["進入 CmsApp 管理後臺主畫面<br>Mount CmsApp View"]):::hudCard
    GrantAdmin --> CMSView
```

---

## 3. CMS 未存檔狀態智慧阻斷狀態轉移機 | Unsaved State Guard State Machine

本狀態機詳細規範當管理者修改表單欄位後，觸發切換模組、點擊外部連結或關閉視窗時之防誤觸多層防禦狀態轉移。  
*State transition model for preventing accidental data loss during active editing sessions:*

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

    Init(["系統初始 / Init"]):::hudCard --> Pristine["乾淨初始態<br>Pristine State (isDirty = false)"]:::hudCard
    Pristine -->|"修改欄位 / Field Mutated"| Dirty["編輯異動態<br>Dirty State (isDirty = true)"]:::hudCard
    Dirty -->|"儲存設定 / Save Changes"| Pristine

    subgraph GuardSub ["未存檔跳轉防護攔截 (Safety Navigation Guard)"]
        Dirty -->|"觸發切換 / Attempt Exit"| Prompt["彈出防護視窗<br>CmsUnsavedModal Active"]:::hudCard
        Prompt --> Choice["選擇處置方案<br>Select Disposal Option"]:::hudCard
        Choice -->|"放棄變更 / Discard & Exit"| Discard["放棄暫存異動 / Discard Mutations"]:::hudCard
        Choice -->|"儲存變更 / Save & Exit"| Save["寫入持久化快取 / Write LocalStorage"]:::hudCard
        Choice -->|"取消跳轉 / Stay on Page"| Stay["留在當前編輯器 / Continue Editing"]:::hudCard
    end

    Discard --> Pristine
    Save --> Pristine
    Stay --> Dirty

    style GuardSub fill:#060a14,stroke:#1e293b,stroke-width:1px,color:#00f0ff
```

---

## 4. 美術畫廊多媒體與 3D 嵌入檢視流程 | Art Gallery & 3D Embed Viewer Flowchart

本流程定義前臺畫廊多模式展示（精選 3D 輪盤與分類響應式網格）、燈箱預覽（ArtStation 3D 嵌入檢視器與 2D 靜態作品燈箱）與鍵盤手勢導覽之實際動態展示路徑。  
*Defines category filtering, featured roulette carousel, and modal lightbox for 3D embedded iframes and 2D media:*

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

    GalleryEnter["進入美術專區 ArtGallery<br>Navigate to Art Gallery Section"]:::hudCard --> ViewMode["選擇檢視模式<br>Active Tab Mode"]:::hudCard
    
    ViewMode -->|"精選模式 (featured)"| RouletteView["3D 封面輪盤展示 (Roulette Layout)<br>3200ms 自動輪播與手勢滑動監聽"]:::hudCard
    ViewMode -->|"分類模式 (all / 3D / 2D)"| GridView["響應式網格渲染卡片<br>Responsive Card Grid (預設 8 筆 / 摺疊切換)"]:::hudCard

    RouletteView --> SelectCard["點擊作品卡片檢視細節<br>Click Artwork Card"]:::hudCard
    GridView --> SelectCard

    SelectCard --> CheckType["判斷作品是否含 3D 嵌入連結<br>Check embedUrl Presence"]:::hudCard
    
    CheckType -->|"3D 立體模型 (含 embedUrl)"| Open3DModal["渲染響應式 3D 嵌入 iframe<br>Render Sandbox 3D Viewer iframe"]:::hudCard
    CheckType -->|"2D 平面作品 (僅含 img)"| Open2DModal["渲染高解析度平面圖形燈箱<br>Render High-Res Image Lightbox"]:::hudCard

    Open3DModal --> Interaction["互動體驗: 上下張切換與鍵盤導覽<br>Interactive 3D / Arrow Keys Nav"]:::hudCard
    Open2DModal --> Interaction

    Interaction --> CloseAction["點擊關閉 / ESC 鍵 / 背景遮罩<br>Dismiss Modal Action"]:::hudCard
    CloseAction --> ResetModal["關閉燈箱視窗並恢復自訂游標狀態<br>Reset activeImage and Restore Custom Cursor"]:::hudCard
```
