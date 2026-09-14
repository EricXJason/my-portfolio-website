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

    Start([用戶發起 HTTP 造訪<br>User Initiates Visit]):::hudCard --> Step1[階段一: InitialPreloader 0%~100% 科技載入動畫<br>Phase 1: Preloader HUD Progress]:::hudCard
    Step1 --> Preload[非同步預載關鍵 WebP 圖片、SVG 圖標與字體<br>Async Preload Media, Icons & Fonts]:::hudCard
    Preload --> Step2[階段二: LangSelectModal 語言偏好設定彈窗<br>Phase 2: Language Preference Modal]:::hudCard
    Step2 --> UserChoice{使用者選定語系?<br>Language Chosen?}:::hudCard
    UserChoice -->|"選擇 zh 或 en / Choose zh or en"| SetLang[寫入 LangContext & 派發 HTML lang 屬性<br>Update LangContext & HTML Attributes]:::hudCard
    SetLang --> Step3[階段三: siteEntered = true 全站平滑淡入<br>Phase 3: Smooth Scene Fade-in]:::hudCard
    Step3 --> MainView([呈現前臺首頁 MainSiteContent<br>Public Showcase Rendered]):::hudCard
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

    ClickGear[點擊導覽列 CMS 入口按鈕<br>Click CMS Switch in Navbar]:::hudCard --> OpenDialog[彈出 CmsModeSelectDialog 模式選擇視窗<br>Open Mode Selection Dialog]:::hudCard
    OpenDialog --> Choice{選擇登入模式<br>Select Mode}:::hudCard
    
    Choice -->|"快速測試登入 / 訪客沙盒"| GrantGuest[設定本地管理態 & 解鎖本地編輯<br>Unlock Local Storage Sandbox]:::hudCard
    Choice -->|"Firebase 雲端認證 / Cloud Auth"| OpenFB[彈出 Firebase 認證對話框<br>Open Auth Credentials Modal]:::hudCard
    
    OpenFB --> InputCreds[輸入管理者 Email 與密碼<br>Input Admin Credentials]:::hudCard
    InputCreds --> Validating{Firebase 認證是否成功?<br>Authentication Passed?}:::hudCard
    Validating -->|"認證失敗 / Failed"| ShowErr[顯示錯誤提示 & 阻斷進入<br>Display Error & Intercept Access]:::hudCard
    Validating -->|"認證成功 / Passed"| GrantAdmin[寫入 Firebase Auth Token & 解鎖完整雲端權限<br>Grant Full Cloud Storage Rights]:::hudCard
    
    GrantGuest --> CMSView([進入 CmsApp 管理後臺主畫面<br>Mount CmsApp View]):::hudCard
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
    'background': '#030712'
  }
}}%%
stateDiagram-v2
    [*] --> Pristine: 載入模組初始資料 / Load Pristine State (isDirty = false)
    
    Pristine --> Dirty: 使用者修改任何表單欄位 / Form Field Mutated (isDirty = true)
    Dirty --> Pristine: 點擊「儲存設定」寫入快取 / Save Changes (isDirty = false)
    
    state Dirty {
        [*] --> Editing: 編輯進行中 / Active Editing
        Editing --> TriggerExit: 觸發切換模組或外部導覽 / Attempt Navigation
    }
    
    TriggerExit --> InterceptModal: 攔截跳轉並彈出 CmsUnsavedModal 三選項視窗 / Intercept & Prompt Modal
    
    state InterceptModal {
        [*] --> AwaitingUserChoice: 等待決策 / Awaiting Decision
        AwaitingUserChoice --> Option1: 點擊「放棄變更並離開」/ Discard & Exit
        AwaitingUserChoice --> Option2: 點擊「儲存變更並離開」/ Save & Exit
        AwaitingUserChoice --> Option3: 點擊「取消並留在本頁」/ Stay on Page
    }
    
    Option1 --> DiscardAndExit: 放棄暫存異動 -> 放行切換 -> Pristine
    Option2 --> SaveAndExit: 立即執行持久化儲存 -> 放行切換 -> Pristine
    Option3 --> ResumeEditing: 關閉彈窗 -> 保持 Dirty 狀態繼續編輯
```

---

## 4. 美術畫廊多媒體與 3D 檢視流程 | Art Gallery & 3D Viewer Flowchart

本流程定義前臺畫廊分類篩選、2D 圖片燈箱與 3D 模型互動檢視器之動態載入與資源釋放路徑。  
*Defines multi-category filtering, 2D media lightboxes, and 3D WebGL runtime lifecycle:*

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

    GalleryEnter[進入美術作品專區 ArtGallery<br>Navigate to Art Gallery]:::hudCard --> CategorySelect[選擇分類: 3D 場景 / 3D 物件 / 2D 素描 / 2D 麥克筆<br>Select Category: 3D / 2D Concept Art]:::hudCard
    CategorySelect --> RenderCards[響應式網格渲染作品卡片<br>Render Responsive Card Grid]:::hudCard
    
    RenderCards --> CardClick{使用者點擊作品卡片<br>Click Card}:::hudCard
    CardClick -->|"2D 平面作品 / 2D Artwork"| Open2DModal[開啟高解析度 2D 燈箱視窗<br>Open High-Res 2D Lightbox Modal]:::hudCard
    CardClick -->|"3D 立體作品 / 3D Model"| Open3DViewer[非同步掛載 3D 互動檢視器<br>Async Mount 3D Interactive Viewer]:::hudCard
    
    Open3DViewer --> LoadModel[載入 GLB / 3D 模型與貼圖資產<br>Stream GLB Assets & PBR Textures]:::hudCard
    LoadModel --> OrbitControls[解鎖滑鼠 360 度旋轉軌道控制器<br>Enable 360 Orbit Controls]:::hudCard
    
    Open2DModal --> CloseModal[點擊關閉 / 背景遮罩 / ESC 鍵<br>Dismiss Modal]:::hudCard
    OrbitControls --> Close3D[點擊關閉 3D 檢視器<br>Close 3D Viewer]:::hudCard
    Close3D --> DisposeWebGL[卸載組件並安全釋放 WebGL 記憶體資源<br>Dispose Geometry & Release WebGL Context]:::hudCard
```
