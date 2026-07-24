// Authenticated Projects Dataset (Derived Strictly from Data.txt)
export const projectsData = [
  {
    id: "awakening",
    title: "《覺醒協議 Awakening Protocol》",
    title_en: "《Awakening Protocol》",
    category: "interactive",
    image: "/assets/images/proj-awakening.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [
      "國立臺灣藝術大學設計學院多媒體動畫藝術學系 114 學年度畢業創作影片補助"
    ],
    honors_en: [
      "NTUA Department of Multimedia & Animation Arts Graduation Project Grant"
    ],
    desc: "基於皮亞傑認知發展理論設計之沉浸式 VR 哲學解謎遊戲。體驗者化身虛擬生命體，於去文本化環境中透過具身操作與即時物理回饋，歷經感知探索至抽象推理之意識覺醒歷程。",
    desc_en: "Immersive VR philosophy puzzle game designed around Piaget's cognitive development theory. Players embody an artificial lifeform navigating embodied interaction towards consciousness awakening.",
    contributions: [
      "事件驅動架構與設計模式：建構全域 Event Bus，整合 Singleton、Observer 與 Registry 模式，實作 UI、音訊與物理機關解耦。",
      "具身互動與演算法：基於 XR Interaction Toolkit 開發高精準度抓取與機關觸發，編寫多階代數驗證與遞迴迷宮生成演算法。",
      "渲染管線與著色器開發：採用 URP 與 UV 頂點對齊色票技術，開發客製化拓撲線條著色器插件，實現極簡賽博龐克風格。",
      "AIGC 與多媒體控制：運用 Timeline 控管非線性過場；整合 DeepVoice Pro 語音合成與 Suno AI 聲場演算。"
    ],
    contributions_en: [
      "Event-Driven Arch & Design Patterns: Built global Event Bus integrating Singleton, Observer & Registry patterns for full decoupling.",
      "Embodied Interaction & Algorithms: Developed XR physics grabbing & triggers, algebraic verification & recursive maze generation algorithms.",
      "Render Pipeline & Shaders: URP custom topology line shader plugin for minimalist cyberpunk visual aesthetics.",
      "AIGC & Multimedia Control: Timeline non-linear cutscenes; DeepVoice Pro voice synthesis & Suno AI soundscape calculation."
    ],
    tags: ["Unity", "C#", "XR Interaction Toolkit", "URP", "DOTween Pro", "Timeline", "Blender", "DeepVoice Pro", "Suno AI"],
    date: "2025.09 - 2026.05"
  },
  {
    id: "extinction",
    title: "《滅境之星 Planet of Extinction》",
    title_en: "《Planet of Extinction》",
    category: "interactive",
    image: "/assets/images/proj-extinction.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [
      "2022 全國大專及高中職學生專題競賽成果展示 - 第一名",
      "2022 Unreal Engine 5 台灣遊戲創意設計大賽 - 佳作",
      "2023 放視大賞遊戲組 - 初選入圍"
    ],
    honors_en: [
      "1st Place in National Special Topic Contest",
      "UE5 Taiwan Game Contest - Merit Award",
      "2023 FaView Awards - Finalist"
    ],
    desc: "由 Unreal Engine 5 開發之 3D 多人合作第一人稱射擊遊戲。玩家需於限時內對抗大量敵對目標並採集星球能源，考驗戰術反應與射擊操作。",
    desc_en: "3D co-op FPS game built with Unreal Engine 5. Players engage in tactical combat against enemy hordes and gather planet energy under tight time constraints.",
    contributions: [
      "核心系統全藍圖開發：獨立建構玩家控制器、核心 UI 狀態流與關卡狀態機切換機制。",
      "AI 行為與感知系統：結合 Behavior Tree 與 AIPerception，實作敵對目標巡邏、感知追擊、動態包圍與戰術移動邏輯。",
      "地形與 3D 資產整合：負責 Landscape 巨型地形編輯、3D 武器模型製作、LOD 效能優化與引擎導入。"
    ],
    contributions_en: [
      "Core Blueprints Dev: Independently built Player Controller, UI state flow, and level state machine switching logic.",
      "AI Behavior & Perception: Integrated Behavior Tree & AIPerception for enemy patrolling, tactical flanking, and siege logic.",
      "Terrain & 3D Assets: Landscape giant terrain editing, 3D weapon modeling, LOD optimization, and engine asset pipeline."
    ],
    tags: ["Unreal Engine 5", "Blueprints", "Blender", "Substance Painter"],
    date: "2022.03 - 2023.04"
  },
  {
    id: "rhythmsync",
    title: "《節奏同奏 RhythmSync》",
    title_en: "《RhythmSync》",
    category: "interactive",
    image: "/assets/images/proj-rhythmsync.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [],
    honors_en: [],
    desc: "灰階懷舊風格之 2D 音效同步動作跑酷遊戲。透過即時音訊頻譜動態驅動 UI、視覺特效、鏡頭運動與背景變化，打造視聽高度同步之沉浸體驗。",
    desc_en: "Grayscale 2D audio-synced action runner. Real-time audio spectrum drives dynamic UI, particle VFX, camera shake, and background shifts.",
    contributions: [
      "即時頻譜解析與映射：呼叫 API 實時解析音域振幅數據，將特定頻段動態映射至場景物件縮放與粒子特效。",
      "Cinemachine 動態運鏡：整合 Cinemachine 運鏡模組，將鏡頭震動與追蹤軌跡與音訊頻譜即時連動。",
      "全域狀態與資料持久化：導入 Singleton 模式管理全域音訊狀態機，並透過 PlayerPrefs 實作數據存檔。"
    ],
    contributions_en: [
      "Real-Time Spectrum Mapping: Analyzed audio amplitude API to dynamically map frequencies to object scaling & particle VFX.",
      "Cinemachine Dynamic Camera: Linked camera shake and tracking trajectory with real-time audio spectrum beat detection.",
      "Global State & Persistence: Singleton pattern for global audio state machine and PlayerPrefs data saving."
    ],
    tags: ["Unity", "C#", "Cinemachine"],
    date: "2024.10 - 2024.12"
  },
  {
    id: "temporal-shrine",
    title: "《社影流光 Temporal Shrine》",
    title_en: "《Temporal Shrine》",
    category: "interactive",
    image: "/assets/images/proj-temporal-shrine.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [],
    honors_en: [],
    desc: "結合 AR 空間感測技術之新竹神社歷史文化導覽互動遊戲。使用者可透過觸發互動任務探索歷史故事並進行認知測驗。",
    desc_en: "AR spatial observation interactive guide for Hsinchu Shrine. Users trigger interactive quests to explore cultural stories and complete cognitive quizzes.",
    contributions: [
      "AR 識別與空間定位：整合 Vuforia SDK 實作圖像識別與空間座標追蹤，精準處理虛實物件疊加。",
      "過場編排與狀態管理：運用 Timeline 系統精確控制過場動畫與音訊同步；採用 Singleton 模式管理全域場景載入與任務數據。"
    ],
    contributions_en: [
      "AR Tracking & Placement: Vuforia SDK image targeting and spatial coordinate tracking for virtual object overlay.",
      "Cutscenes & State Management: Timeline system for camera animation and audio sync; Singleton pattern for scene loading."
    ],
    tags: ["Unity", "C#", "Vuforia SDK", "Timeline"],
    date: "2025.10 - 2026.02"
  },
  {
    id: "ecohoops",
    title: "《環保投籃王 EcoHoops》",
    title_en: "《EcoHoops》",
    category: "interactive",
    image: "/assets/images/proj-ecohoops.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [],
    honors_en: [],
    desc: "結合籃球投擲與環保分類教育之兒童 VR 沉浸式體驗遊戲。玩家透過將垃圾投擲至正確回收桶以學習資源分類。",
    desc_en: "Educational VR basketball game combining trash sorting with physics throwing mechanics to teach environmental classification.",
    contributions: [
      "VR 物理互動開發：利用 Meta Quest SDK 實作手勢追蹤、控制器輸入映射與抓取邏輯，處理投籃物理軌跡與碰撞反饋。",
      "流程與計分狀態控管：導入 Singleton 模式管理全域計分系統、計時器與關卡流程切換。"
    ],
    contributions_en: [
      "VR Physics & Grab: Meta Quest SDK hand tracking, controller input mapping, and parabolic throwing physics.",
      "State & Scoring System: Singleton pattern for global score tracking, timer, and stage state management."
    ],
    tags: ["Unity", "C#", "Meta Quest SDK"],
    date: "2025.03 - 2025.05"
  },
  {
    id: "little-prince",
    title: "《小王子帶你去旅行 The Little Prince Takes You on a Journey》",
    title_en: "《Traveling with The Little Prince》",
    category: "interactive",
    image: "/assets/images/proj-little-prince.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [
      "國科會專題計畫案作品",
      "2023 通訊大賽聯網未來挑戰賽 - 決賽入圍"
    ],
    honors_en: [
      "NSTC Project Output",
      "2023 Mobileheros Connectivity Future Challenge - Finalist"
    ],
    desc: "國科會專題研究計畫案作品。基於情境教學與語言學習開發之 VTuber 虛擬角色互動直播與簡報系統。學習者透過扮演虛擬角色進行情境模擬，提升語言表達能力。",
    desc_en: "NSTC research project. VTuber virtual character presentation system for contextual language learning. Responsible for core 3D character assets, environment topology, and visual tuning.",
    contributions: [
      "3D 角色與場景資產建置：獨立負責核心虛擬角色與 3D 故事場景建置、拓撲減面與引擎內效能優化。",
      "三維視覺與動態系統調校：負責全案三維視覺呈現調校、動態導覽系統編排與展演影片剪輯製作。"
    ],
    contributions_en: [
      "3D Assets & Environments: Built core virtual characters and 3D scenes, topology polygon reduction, and engine optimization.",
      "Visual Tuning & Motion: Fine-tuned 3D visuals, automated camera navigation, and produced showcase videos."
    ],
    tags: ["Unity", "C#", "Blender", "Substance Painter", "Premiere"],
    date: "2022.07 - 2023.06"
  },
  {
    id: "aircraft",
    title: "《飛機檢修行動學習平台 Aircraft Maintenance Action Learning Platform》",
    title_en: "《Aircraft Maintenance Action Learning Platform》",
    category: "interactive",
    image: "/assets/images/proj-aircraft.jpg",
    ytId: "dQw4w9WgXcQ",
    ytUrl: "https://www.youtube.com/",
    honors: [
      "國科會計畫案作品",
      "2021 第四屆台灣數位媒體設計獎 - 大專組互動科技應用 - 銀賞"
    ],
    honors_en: [
      "NSTC Project Official Output",
      "2021 4th Taiwan Digital Media Design Award - Interactive Tech Silver Medal"
    ],
    desc: "國科會計畫研究案作品。針對空中巴士 A330 客機檢修訓練開發之跨平台行動學習軟體，以煞車器拆解與安裝模擬為核心教案。獨立負責全套專業檢修介面視覺設計與 UGUI 邏輯建置。",
    desc_en: "NSTC research project. Cross-platform interactive learning app for Airbus A330 brake assembly maintenance. Designed complete UI/UX visual system and modular Unity UGUI logic.",
    contributions: [
      "UI/UX 視覺系統獨立設計：獨立負責全套專業檢修介面視覺設計與美術素材製作。",
      "UGUI 流程與狀態機建置：將素材導入 Unity 規劃 UGUI 邏輯，編寫複雜檢修步驟的核心互動機制與流程切換。"
    ],
    contributions_en: [
      "UI/UX Design: Independently designed full aviation maintenance interface visual system and icons.",
      "UGUI & State Machine: Integrated assets into Unity UGUI to program complex interactive maintenance procedures."
    ],
    tags: ["Unity", "C#", "Photoshop", "Illustrator", "Premiere"],
    date: "2020.07 - 2021.06"
  }
];
