# 核心業務流程圖與狀態轉移 | Flowcharts & State Machine Specifications

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **協定標準 / Compliance**: 依據《AGENTS.md》全域最高工程中樞協定規範建置。本文件定義系統之使用者操作路徑、業務邏輯流程 (Flowchart) 與核心狀態機轉移 (State Diagram)。  
> *Release: 2026-09*

---

## 1. 首屏造訪與語言門禁載入流程 | Initial Visit & Language Selection Flowchart

本流程定義訪客首次進入網站時之多階段加載動畫、多媒體資產非同步預載、以及多語系初始化之完整路徑。

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

    Start(["用戶發起 HTTP 造訪<br>User Initiates Visit"]):::hudCard --> Step1["階段一: InitialPreloader 科技載入動畫<br>Phase 1: Preloader HUD Progress"]:::hudCard
    Step1 --> Preload["非同步預載關鍵 WebP 圖片、SVG 圖標與字體<br>Async Preload Media, Icons & Fonts"]:::hudCard
    Preload --> Step2["階段二: LangSelectModal 語言偏好設定彈窗<br>Phase 2: Language Preference Modal"]:::hudCard
    Step2 --> UserChoice["使用者選定語系<br>Language Preference Chosen"]:::hudCard
    UserChoice -->|"選擇 zh 或 en"| SetLang["寫入 LangContext 與派發 HTML lang 屬性<br>Update LangContext & HTML Attributes"]:::hudCard
    SetLang --> Step3["階段三: siteEntered = true 全站平滑淡入<br>Phase 3: Smooth Scene Fade-in"]:::hudCard
    Step3 --> MainView(["呈現前臺首頁 MainSiteContent<br>Public Showcase Rendered"]):::hudCard
```

---

## 2. CMS 官方身分驗證門禁流程 | CMS Official Auth Security Flowchart

本流程規範從前臺切換至管理員後臺時之官方憑證校驗與防護阻斷邏輯。

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

    ClickGear["點擊導覽列 CMS 入口按鈕<br>Click CMS in Navbar"]:::hudCard --> OpenDialog["彈出 CmsModeSelectDialog 門禁視窗<br>Open Auth Dialog"]:::hudCard
    OpenDialog --> InputCreds["輸入管理者 Email 與密碼憑據<br>Input Official Admin Credentials"]:::hudCard
    InputCreds --> Validating["呼叫 signInWithEmailAndPassword 驗證<br>Validate Identity via Firebase Auth"]:::hudCard
    Validating -->|"驗證失敗或密碼錯誤"| ShowErr["顯示錯誤提示並強制攔截<br>Display Error & Block Access"]:::hudCard
    Validating -->|"驗證成功"| GrantAdmin["寫入會話狀態並解鎖後臺管理權限<br>Grant Full Administrative Access"]:::hudCard
    GrantAdmin --> CMSView(["進入 CmsApp 管理後臺主畫面<br>Mount CmsApp View"]):::hudCard
```

---

## 3. CMS 未存檔狀態智慧阻斷狀態轉移機 | Unsaved State Guard State Machine

本狀態機規範當管理者修改表單欄位後，觸發切換模組、點擊外部連結或關閉視窗時之防誤觸多層防禦狀態轉移。

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
    Pristine -->|"修改欄位"| Dirty["編輯異動態<br>Dirty State (isDirty = true)"]:::hudCard
    Dirty -->|"儲存設定"| Pristine

    subgraph GuardSub ["未存檔跳轉防護攔截 (Safety Navigation Guard)"]
        Dirty -->|"觸發切換"| Prompt["彈出防護視窗<br>CmsUnsavedModal Active"]:::hudCard
        Prompt --> Choice["選擇處置方案<br>Select Option"]:::hudCard
        Choice -->|"放棄變更"| Discard["放棄暫存異動<br>Discard Mutations"]:::hudCard
        Choice -->|"儲存變更"| Save["寫入 Firestore 與本地快取<br>Save to Cloud & Cache"]:::hudCard
        Choice -->|"取消跳轉"| Stay["留在當前編輯器<br>Continue Editing"]:::hudCard
    end

    Discard --> Pristine
    Save --> Pristine
    Stay --> Dirty

    style GuardSub fill:#060a14,stroke:#1e293b,stroke-width:1px,color:#00f0ff
```

---

## 4. 美術畫廊多媒體與 3D 嵌入檢視流程 | Art Gallery & 3D Embed Viewer Flowchart

本流程定義前臺畫廊多模式展示（精選 3D 輪盤與分類響應式網格）、燈箱預覽（ArtStation 3D 嵌入檢視器與 2D 靜態作品燈箱）之動態展示路徑。

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

    GalleryEnter["進入美術專區 ArtGallery<br>Navigate to Art Gallery"]:::hudCard --> ViewMode["選擇檢視模式<br>Active Tab Mode"]:::hudCard
    
    ViewMode -->|"精選模式 (featured)"| RouletteView["3D 封面輪盤展示 (Roulette Layout)<br>自動輪播與手勢滑動監聽"]:::hudCard
    ViewMode -->|"分類模式 (all / 3D / 2D)"| GridView["響應式網格渲染卡片<br>Responsive Card Grid"]:::hudCard

    RouletteView --> SelectCard["點擊作品卡片檢視細節<br>Click Artwork Card"]:::hudCard
    GridView --> SelectCard

    SelectCard --> CheckType["判斷作品是否含 3D 嵌入連結<br>Check embedUrl"]:::hudCard
    
    CheckType -->|"3D 立體模型 (含 embedUrl)"| Open3DModal["渲染響應式 3D 嵌入 iframe<br>Render Sandbox 3D Viewer"]:::hudCard
    CheckType -->|"2D 平面作品 (僅含 img)"| Open2DModal["渲染高解析度平面圖形燈箱<br>Render Image Lightbox"]:::hudCard

    Open3DModal --> Interaction["互動體驗: 上下張切換與鍵盤導覽<br>Interactive Controls"]:::hudCard
    Open2DModal --> Interaction

    Interaction --> CloseAction["點擊關閉 / ESC 鍵 / 背景遮罩<br>Dismiss Modal Action"]:::hudCard
    CloseAction --> ResetModal["關閉燈箱視窗並恢復自訂游標狀態<br>Reset activeImage"]:::hudCard
```
