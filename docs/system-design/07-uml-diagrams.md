# 物件導向類別圖與系統互動循序圖 | UML Class & Sequence Diagrams

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **協定標準 / Compliance**: 依據《AGENTS.md》全域最高工程中樞協定規範建置。定義系統之物件導向架構（Class Diagram）與跨層動態循序圖（Sequence Diagram）。全面採用標準 **Mermaid** 語法，確保沉穩科技風與防崩潰規範。  
> *Release: 2026-09*

---

## 1. 前臺展示系統類別關聯圖 | Public Showcase Class Diagram

本圖定義前臺展示視圖之組件階層、全域狀態 Context 與底層工具依賴關係。

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
  }
}}%%
classDiagram
    direction TB

    class App {
        -boolean isCmsRoute
        -boolean isSiteEntered
        +render() JSX.Element
    }

    class IPortfolioDataContext {
        <<interface>>
        +Record~string, any~ dataMap
        +boolean isReady
        +updateDocument(docId, data) Promise~void~
    }

    class PortfolioDataProvider {
        -Record~string, any~ _dataMap
        -boolean _isReady
        +updateDocument(docId, data) Promise~void~
    }

    class ILangContext {
        <<interface>>
        +LangType lang
        +setLang(lang) void
        +t(key) string
    }

    class LangProvider {
        -LangType _currentLang
        +setLang(lang) void
        +t(key) string
    }

    class IThemeContext {
        <<interface>>
        +boolean isDark
        +toggleTheme() void
    }

    class ThemeProvider {
        -boolean _isDark
        +toggleTheme() void
    }

    class MainSiteContent {
        +render() JSX.Element
    }

    class HeroComponent {
        -HeroData heroData
        +render() JSX.Element
    }

    class ProjectsComponent {
        -ProjectItem[] projects
        -string activeFilter
        +filterProjects(category) void
        +openLightbox(projectId) void
    }

    class CertificationsComponent {
        -CertificationItem[] certs
        -boolean isToeicVisible
        +render() JSX.Element
    }

    class ArtGalleryComponent {
        -ArtItem[] galleryItems
        -string activeCategory
        -string active3DModel
        +toggleGalleryFilter(tab) void
        +open3DModal(url) void
    }

    App --> PortfolioDataProvider : 注入 SWR 狀態中樞
    App --> LangProvider : 注入多語系狀態
    App --> ThemeProvider : 注入主題狀態
    PortfolioDataProvider ..|> IPortfolioDataContext : 實作合約
    LangProvider ..|> ILangContext : 實作合約
    ThemeProvider ..|> IThemeContext : 實作合約
    App --> MainSiteContent : 驅動前臺外殼
    MainSiteContent --> HeroComponent
    MainSiteContent --> ProjectsComponent
    MainSiteContent --> CertificationsComponent
    MainSiteContent --> ArtGalleryComponent
```

---

## 2. 自研 CMS 後臺架構類別關係圖 | In-House CMS Architecture Class Diagram

本圖定義 CMS 後臺各模組編輯器、門禁控制器、未存檔攔截守衛與資料庫服務層之架構依賴。

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
  }
}}%%
classDiagram
    direction TB

    class CmsApp {
        -string activeTab
        -boolean isAuthenticated
        +render() JSX.Element
    }

    class ICmsDirtyContext {
        <<interface>>
        +boolean isDirty
        +markDirty() void
        +markPristine() void
        +checkCanNavigate(targetTab) boolean
    }

    class CmsDirtyProvider {
        -boolean _isDirty
        -string _pendingTab
        +markDirty() void
        +markPristine() void
    }

    class CmsModeSelectDialog {
        -string email
        -string password
        +handleAuthLogin() Promise~void~
    }

    class BaseCmsEditor {
        <<abstract>>
        #boolean isDirty
        #saveData() Promise~void~
    }

    class CmsHeroEditor {
        -HeroData localData
        +saveData() Promise~void~
    }

    class CmsProjectsEditor {
        -ProjectItem[] localList
        +toggleVisibility(id) void
        +toggleFeatured(id) void
        +saveData() Promise~void~
    }

    class CmsCertificationsEditor {
        -CertificationItem[] localList
        -boolean toeicVisible
        +saveData() Promise~void~
    }

    class PortfolioDataService {
        +getPortfolioDoc(docId) Promise~any~
        +savePortfolioDoc(docId, data) Promise~void~
        +seedFirestoreFromLocalJson() Promise~void~
    }

    CmsApp --> CmsDirtyProvider : 注入未存檔守衛
    CmsDirtyProvider ..|> ICmsDirtyContext : 實作合約
    CmsApp --> CmsModeSelectDialog : 官方安全門禁
    CmsApp --> CmsHeroEditor : 模組編輯器
    CmsApp --> CmsProjectsEditor : 模組編輯器
    CmsApp --> CmsCertificationsEditor : 模組編輯器

    CmsHeroEditor --|> BaseCmsEditor
    CmsProjectsEditor --|> BaseCmsEditor
    CmsCertificationsEditor --|> BaseCmsEditor

    BaseCmsEditor --> PortfolioDataService : 持久化寫入
```

---

## 3. CMS 編輯至前臺即時雙向熱更新循序圖 | Bi-Directional Hot Sync Sequence Diagram

本圖展示管理者在 CMS 後臺進行資料異動時，如何透過 `PortfolioDataContext` 與 Firebase Firestore 達成前臺視圖之毫秒級無感熱更新。

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#030712',
    'actorBkg': '#0b0f19',
    'actorBorder': '#00f0ff',
    'actorTextColor': '#f8fafc',
    'actorLineColor': '#334155',
    'signalColor': '#00f0ff',
    'signalTextColor': '#f8fafc',
    'labelBoxBkgColor': '#0b0f19',
    'labelBoxBorderColor': '#00f0ff',
    'labelTextColor': '#f8fafc',
    'noteBorderColor': '#00f0ff',
    'noteBkgColor': '#08131e',
    'noteTextColor': '#f8fafc'
  }
}}%%
sequenceDiagram
    autonumber
    actor Admin as 網站管理者 / Admin
    participant CMS as CMS 編輯器 / CmsProjectsEditor
    participant DirtyCtx as 未存檔守衛 / CmsDirtyContext
    participant Service as 資料庫服務 / portfolioDataService
    participant Cloud as 雲端資料庫 / Firebase Firestore
    participant DataCtx as 狀態中樞 / PortfolioDataContext
    participant View as 前臺展示元件 / Projects

    Admin->>CMS: 調整專案排序或可視性開關
    CMS->>DirtyCtx: markDirty() (設定 isDirty = true)
    Admin->>CMS: 點擊「儲存設定」按鈕
    
    CMS->>Service: savePortfolioDoc("projects-section", updatedList)
    Service->>Cloud: setDoc(doc(db, "portfolio_content", "projects-section"), data)
    Cloud-->>Service: 寫入成功確認
    
    Cloud-->>DataCtx: onSnapshot 即時串流推播最新文檔
    DataCtx->>View: 狀態自動更新 (毫秒級無感熱更新)
    View-->>Admin: 前臺展示視圖即時呈現最新排序與設定
    
    CMS->>DirtyCtx: markPristine() (重設 isDirty = false)
    CMS-->>Admin: 呈現「儲存成功」霓虹 HUD 反饋通知
```

---

## 4. 路由切換與未存檔安全阻斷循序圖 | Unsaved State Interception Sequence Diagram

本圖詳細定義管理者在未儲存狀態下觸發切換模組時，安全阻斷視窗之判斷邏輯與狀態恢復時序。

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'darkMode': true,
    'background': '#030712',
    'actorBkg': '#0b0f19',
    'actorBorder': '#00f0ff',
    'actorTextColor': '#f8fafc',
    'actorLineColor': '#334155',
    'signalColor': '#00f0ff',
    'signalTextColor': '#f8fafc',
    'labelBoxBkgColor': '#0b0f19',
    'labelBoxBorderColor': '#00f0ff',
    'labelTextColor': '#f8fafc',
    'noteBorderColor': '#00f0ff',
    'noteBkgColor': '#08131e',
    'noteTextColor': '#f8fafc'
  }
}}%%
sequenceDiagram
    autonumber
    actor Admin as 系統管理者 / Admin
    participant Sidebar as CmsSidebar 導覽側邊欄
    participant Editor as CmsProjectsEditor
    participant DirtyCtx as CmsDirtyContext
    participant Modal as CmsUnsavedModal
    participant Service as portfolioDataService
    participant Cloud as Firebase Firestore

    Note over Admin,Editor: 階段一: 進行內容編輯
    Admin->>Editor: 修改專案描述欄位
    Editor->>DirtyCtx: markDirty() (設定 isDirty = true)
    DirtyCtx-->>Sidebar: 點亮未儲存警示指示器
    
    Note over Admin,Modal: 階段二: 誤觸切換模組安全阻斷
    Admin->>Sidebar: 點擊切換至「證照檢定庫」模組
    Sidebar->>DirtyCtx: checkCanNavigate("certifications")
    DirtyCtx->>Modal: 檢測到 isDirty = true，阻斷切換並彈出視窗
    Admin->>Modal: 點擊選項「儲存變更並離開」
    
    Note over Modal,Cloud: 階段三: 存檔與路由放行
    Modal->>Editor: 觸發儲存回呼
    Editor->>Service: savePortfolioDoc()
    Service->>Cloud: setDoc() 雲端持久化
    Editor->>DirtyCtx: markPristine() (重設 isDirty = false)
    Modal->>Sidebar: 放行路由切換 -> 進入「證照檢定庫」
    Sidebar-->>Admin: 呈現「變更已妥善存檔」霓虹反饋
```
