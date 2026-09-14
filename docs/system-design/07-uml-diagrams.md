# 物件導向類別圖與系統互動循序圖 | UML Class & Sequence Diagrams

> **專案作者 / Author**: 許哲誠 (HSU, CHE-CHENG)  
> **規範標準 / Compliance**: 依據《AGENTS.md》全域最高工業級工程協定第 6 章規範建置。定義系統之**物件導向架構（Class Diagram）與跨層動態循序圖（Sequence Diagram）**。本文件不包含業務流程圖與操作狀態機（統一由 `05-flowcharts.md` 承擔），全面採用標準 **Mermaid** 語法，確保在 VS Code、GitHub 及任何 Markdown 預覽器開箱即用、免額外套件原生即時圖形渲染。  
> *Release: 2026-09-14*

---

## 1. 前臺展示系統類別關聯圖 | Public Showcase Class Diagram

本圖定義前臺展示視圖之元件階層、全域狀態 Context 與底層工具依賴關係，在 VS Code 內建預覽器中支援原生即時渲染。  
*Visualizes component composition, context injection, and utility dependencies across public showcase views:*

```mermaid
classDiagram
    direction TB

    class App {
        -boolean isCmsRoute
        -boolean isSiteEntered
        +render() JSX.Element
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
        -string activeSection
        +render() JSX.Element
    }

    class HeroSection {
        -HeroData _heroData
        +render() JSX.Element
    }

    class SciFiRobotAvatar {
        -boolean _isHovered
        -number _audioLevel
        +triggerReaction() void
    }

    class ProjectsSection {
        -string _filterCategory
        -List~Project~ _projects
        +handleCategoryChange(cat) void
        +openLightbox(projectId) void
    }

    class ProjectLightbox {
        -Project _activeProject
        +onClose() void
        +renderMedia() JSX.Element
    }

    class ArtGallerySection {
        -string _activeTab
        +switchTab(tab) void
        +open3DViewer(modelUrl) void
    }

    class TechIconRenderer {
        +renderIcon(name, size) JSX.Element
    }

    class WebAudioSynthEngine {
        -AudioContext _ctx
        +playCyberClick() void
        +playWarningBeep() void
        +toggleBgm() void
    }

    App *-- LangProvider : wraps
    App *-- ThemeProvider : wraps
    ILangContext <|.. LangProvider : implements
    IThemeContext <|.. ThemeProvider : implements
    App o-- MainSiteContent : renders when !isCmsRoute
    MainSiteContent *-- HeroSection : composite
    MainSiteContent *-- ProjectsSection : composite
    MainSiteContent *-- ArtGallerySection : composite
    HeroSection *-- SciFiRobotAvatar : composite
    ProjectsSection *-- ProjectLightbox : modal
    ProjectsSection ..> TechIconRenderer : renders tags
    MainSiteContent ..> WebAudioSynthEngine : audio feedback
```

---

## 2. 自研 CMS 後臺架構類別關係圖 | In-House CMS Architecture Class Diagram

本圖清楚展示自研 CMS 之抽象基礎編輯器、未存檔狀態阻斷 Context、刪除二次確認對話框以及本機/雲端資料配接器。  
*Illustrates abstract base editors, unsaved state interceptors, modal portals, and persistence adapters:*

```mermaid
classDiagram
    direction TB

    class CmsApp {
        -string activeTab
        -boolean isPreviewMode
        +switchTab(tab) void
        +togglePreview() void
        +exitCms() void
    }

    class ICmsDirtyContext {
        <<interface>>
        +boolean isDirty
        +markDirty() void
        +markPristine() void
        +confirmNavigation(target) void
    }

    class CmsDirtyProvider {
        -boolean _isDirty
        -Function _pendingAction
        +markDirty() void
        +markPristine() void
        +confirmNavigation(target) void
    }

    class CmsUnsavedModal {
        -boolean isOpen
        +onDiscardAndLeave() void
        +onSaveAndLeave() void
        +onCancel() void
    }

    class CmsConfirmDialog {
        -string title
        -string message
        +onConfirm() void
        +onCancel() void
    }

    class BaseCmsEditor {
        <<Abstract>>
        #boolean isDirty
        #boolean hasLoaded
        +loadInitialData()* void
        +handleSave()* void
        +handleReset()* void
    }

    class CmsHeroEditor {
        -HeroFormData _formData
        +updateField(key, val) void
        +handleSave() void
    }

    class CmsProjectsEditor {
        -List~ProjectItem~ _projectList
        +addProject() void
        +moveUp(index) void
        +moveDown(index) void
        +deleteProject(id) void
    }

    class CmsGalleryEditor {
        -List~GalleryItem~ _galleryList
        +toggleFeatured(id) void
        +updateCoverImage(id, url) void
    }

    class CmsUrlInput {
        -string value
        +handleVisitUrl() void
        +validateProtocol() string
    }

    class LocalStorageCacheManager {
        +saveSectionData(key, data)$ void
        +loadSectionData(key, fallback)$ any
        +clearAllOverrides()$ void
    }

    class FirebaseSyncAdapter {
        -Firestore _dbInstance
        +syncDoc(col, id, payload) Promise
        +fetchDoc(col, id) Promise
    }

    ICmsDirtyContext <|.. CmsDirtyProvider : implements
    CmsApp *-- CmsDirtyProvider : manages state
    CmsApp *-- CmsUnsavedModal : delegates guard
    CmsApp *-- CmsConfirmDialog : delegates deletion guard
    CmsApp o-- BaseCmsEditor : active editor
    BaseCmsEditor <|-- CmsHeroEditor : extends
    BaseCmsEditor <|-- CmsProjectsEditor : extends
    BaseCmsEditor <|-- CmsGalleryEditor : extends
    BaseCmsEditor *-- CmsUrlInput : safe visit testing
    BaseCmsEditor ..> ICmsDirtyContext : notifies changes
    BaseCmsEditor ..> LocalStorageCacheManager : persists
    BaseCmsEditor ..> FirebaseSyncAdapter : cloud sync
```

---

## 3. CMS 編輯至前臺即時雙向熱更新循序圖 | Bi-Directional Hot Sync Sequence Diagram

本圖展示管理者在 CMS 後臺進行資料異動時，如何透過 LocalStorage、自訂 CustomEvent 事件匯流排與 Firebase BaaS 達成前端視圖之 0 延遲同步刷新。  
*Demonstrates instant state synchronization between admin mutations and public views via CustomEvent and LocalStorage:*

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 網站管理者 / Admin
    participant CMS as CMS 模組編輯器 / Cms*Editor
    participant Cache as 本地快取層 / LocalStorage
    participant Bus as 全域事件匯流排 / CustomEvent Bus
    participant View as 前臺展示元件 / MainSiteContent
    participant Cloud as 雲端資料庫 / Firebase BaaS

    Admin->>CMS: 修改專案資料或排序 / Mutate item or order
    CMS->>CMS: 觸發 CmsDirtyContext (標記 isDirty = true)
    Admin->>CMS: 點擊「儲存變更」/ Click "Save Changes"
    
    par 本地極速快取寫入 / Instant Local Cache Write
        CMS->>Cache: 寫入序列化 JSON 至 LocalStorage
        CMS->>Bus: 派發 window.dispatchEvent("cms-data-updated")
        Bus->>View: 監聽器捕捉事件並重載快取資料
        View-->>Admin: 前臺視圖即時 0ms 反映最新編輯結果
    and 雲端非同步同步 (若已連線) / Optional Cloud Sync
        CMS->>Cloud: 調用 Firestore API 寫入集合文檔
        Cloud-->>CMS: 回傳成功狀態碼 200 OK
    end
    
    CMS->>CMS: 重設 isDirty = false
    CMS-->>Admin: 呈現「儲存成功」霓虹 HUD 反饋通知 / HUD Toast
```

---

## 4. 路由切換與未存檔安全阻斷循序圖 | Unsaved State Interception Sequence Diagram

本圖詳細定義管理者在未儲存狀態下觸發切換模組時，安全阻斷視窗之判斷邏輯與狀態恢復時序。  
*Detailed chronological trace of dirty state interception and graceful recovery actions:*

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 系統管理者 / Admin
    participant Header as CmsHeader 導覽列
    participant Editor as CmsProjectsEditor
    participant DirtyCtx as CmsDirtyContext
    participant Modal as CmsUnsavedModal
    participant Storage as LocalStorage 快取
    participant View as 前臺 Projects 組件

    Note over Admin,Editor: 階段一: 進行內容編輯 / Phase 1: Form Mutation
    Admin->>Editor: 拖曳調整作品順序或修改專案描述
    Editor->>DirtyCtx: markDirty() (設定 isDirty = true)
    DirtyCtx-->>Header: 點亮「未儲存變更」戰術警示紅點
    
    Note over Admin,Modal: 階段二: 誤觸切換模組安全阻斷 / Phase 2: Interception Guard
    Admin->>Header: 點擊切換至「美術畫廊 (Gallery)」模組
    Header->>DirtyCtx: checkCanNavigate(targetTab = "gallery")
    DirtyCtx->>Modal: 檢測到 isDirty = true，阻斷切換並彈出視窗
    Admin->>Modal: 點擊選項「儲存變更並離開 (Save & Leave)」
    
    Note over Modal,View: 階段三: 存檔、派發與即時熱更新 / Phase 3: Save & Hydrate
    Modal->>Editor: executePendingSave()
    Editor->>Storage: saveSectionData("projects-section", updatedList)
    Editor->>DirtyCtx: markPristine() (重設 isDirty = false)
    Storage->>View: 派發自訂 Event ("portfolio-data-synced")
    View->>View: 重新讀取快取並平滑重渲染最新排序
    Modal->>Header: 放行路由切換 -> 進入「美術畫廊 (Gallery)」
    Header-->>Admin: 呈現「變更已妥善存檔」霓虹 HUD 反饋
```
