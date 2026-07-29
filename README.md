# 許哲誠 個人作品集網站 | Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.8.0](https://img.shields.io/badge/Version-3.8.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)

---

## 1. 專案簡介 (Project Overview)

本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（**Portfolio**）。採用模組化 JSON 架構，整合展示個人於 **互動應用開發**、**全端開發** 與 **多媒體美學設計** 之專案成果、實務經歷、學術論文與專業證照。

**核心特色**:
- **中英雙語切換**：支援 繁體中文 與 English 雙語即時切換，滿足國際化瀏覽需求。
- **深淺色主題切換**：支援深色與淺色模式切換，具備流暢視覺體驗與響應式佈局 (RWD)。
- **動態音視效體驗**：整合 Web Audio API 自訂背景音效與 HTML5 Canvas 粒子動畫。
- **模組化資料架構**：採用語意化 JSON 檔案管理全站文本與媒體資料，方便維護與擴充。

Official personal portfolio web application for **HSU, CHE-CHENG** (**Portfolio**). Built with a modular JSON data architecture to showcase interactive applications, fullstack web engineering, multimedia design projects, work experience, academic research, and credentials.

**Key Features**:
- **Bilingual Support**: Instant toggle between Traditional Chinese and English for international accessibility.
- **Theme-Aware UI**: Seamless Light/Dark mode switching with responsive layout and clean visual aesthetics.
- **Audio-Visual Interactions**: Integrated Web Audio API background synthesizer and dynamic Canvas particle renderer.
- **Modular Data Architecture**: Maintainable text and asset data store powered by clean, structured JSON files.

- **作者 (Author)**: 許哲誠 (HSU, CHE-CHENG)
- **線上展示 (Live Demo)**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

---

## 2. 技術棧 (Technology Stack)

| 分類 (Category) | 專案使用技術 (Technologies Used) |
| :--- | :--- |
| **核心框架與工具 (Core & Build)** | React 19, Vite 8, ES Modules |
| **樣式與圖示 (Styling & Icons)** | Tailwind CSS, SCSS, Lucide Icons |
| **狀態與資料 (State & Data)** | React Context API (`LangContext`, `ThemeContext`), Modular JSON |
| **音視效引擎 (Audio & Canvas)** | Web Audio API Custom Synth, HTML5 Canvas Particle Engine |
| **代碼品質 (Code Quality)** | Oxlint |
| **部署與託管 (Deployment)** | GitHub Actions, GitHub Pages |

---

## 3. 目錄結構 (Directory Structure)

```text
my-portfolio-website/
├── docs/                  # 動態專案文件 (check-list.md, change-log.md)
├── public/assets/         # 靜態視覺媒體與圖片資源
├── src/
│   ├── components/        # 模組化 React UI 組件
│   ├── context/           # 全局語系與主題 Context
│   ├── data/              # 模組化 JSON 資料庫
│   ├── utils/             # Web Audio 音效與工具函式
│   ├── App.jsx            # 主應用組件
│   └── index.css          # 核心設計系統樣式
├── index.html             # 入口頁面與 SEO Meta 設定
├── package.json
└── README.md
```

---

## 4. 本地開發配置 (Local Development Setup)

```bash
# 1. 克隆專案與安裝依賴
git clone https://github.com/EricXJason/my-portfolio-website.git
cd my-portfolio-website
npm install

# 2. 啟動本地開發伺服器
npm run dev

# 3. 執行生產打包
npm run build
```

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
