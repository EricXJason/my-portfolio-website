# 許哲誠 個人作品集網站 | Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-0F172A?style=flat-square&logo=github&logoColor=white)](#)
[![Version: 4.3.0](https://img.shields.io/badge/Version-4.3.0-2563EB?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-0D9488?style=flat-square)](#)

---
**線上展示 (Live Demo)**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

## 1. 專案簡介 (Project Overview)

本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（**Portfolio**）。採用模組化 JSON 架構與 TypeScript 重構，整合展示個人於 **互動應用開發**、**全端開發** 與 **多媒體美學設計** 之專案成果、實務經歷、學術論文與專業證照。

**核心特色**:
- **中英雙語切換**：支援 繁體中文 與 English 雙語即時切換，滿足國際化瀏覽需求。
- **深淺色主題切換**：支援深色與淺色模式切換，具備流暢視覺體驗與響應式佈局 (RWD)。
- **動態音視效體驗**：整合 Web Audio API 自訂背景音效與 HTML5 Canvas 粒子動畫。
- **模組化資料架構**：採用語意化 JSON 檔案管理全站文本與媒體資料，方便維護與擴充。

Official personal portfolio web application for **HSU, CHE-CHENG** (**Portfolio**). Fully re-architected with TypeScript and pnpm, leveraging a modular JSON data architecture to showcase interactive applications, fullstack web engineering, multimedia design projects, work experience, academic research, and credentials.

**Key Features**:
- **Bilingual Support**: Instant toggle between Traditional Chinese and English for international accessibility.
- **Theme-Aware UI**: Seamless Light/Dark mode switching with responsive layout and clean visual aesthetics.
- **Audio-Visual Interactions**: Integrated Web Audio API background synthesizer and dynamic Canvas particle renderer.
- **Modular Data Architecture**: Maintainable text and asset data store powered by clean, structured JSON files.

---

## 2. 技術棧 (Technology Stack)

本專案嚴選現代化前端工具與庫，建構無瑕疵且具備高度可維護性的軟體架構。

| 分類 (Category) | 專案使用技術 (Technologies Used) |
| :--- | :--- |
| **核心框架與語言 (Core & Language)** | React 19, TypeScript 5.8, Vite 8, ES Modules |
| **包管理器 (Package Manager)** | pnpm |
| **樣式與圖示 (Styling & Icons)** | Tailwind CSS v4, Lucide Icons |
| **狀態與資料 (State & Data)** | React Context API (`LangContext`, `ThemeContext`), Modular JSON |
| **音視效引擎 (Audio & Canvas)** | Web Audio API Custom Synth, HTML5 Canvas Particle Engine |
| **部署與託管 (Deployment)** | GitHub Actions, GitHub Pages |

---

## 3. 目錄結構 (Directory Structure)

專案採用標準化與語意化的目錄劃分，利於多人協作與組件邏輯解耦。

```text
my-portfolio-website/
├── public/assets/         # 靜態視覺媒體與圖片資源
├── src/
│   ├── components/        # 模組化 React TypeScript UI 組件 (.tsx)
│   ├── context/           # 全局語系與主題 Context (.tsx)
│   ├── data/              # 模組化 JSON 資料庫 (.json)
│   ├── utils/             # Web Audio 音效與工具函式 (.ts)
│   ├── App.tsx            # 主應用組件
│   ├── main.tsx           # 應用入口檔
│   ├── index.css          # 核心 Tailwind CSS 設計系統樣式
│   └── vite-env.d.ts      # Vite TypeScript 環境定義
├── index.html             # 入口頁面與 SEO Meta 設定
├── package.json
├── pnpm-lock.yaml         # pnpm 鎖定檔
├── tsconfig.json          # TypeScript 設定檔
└── README.md
```

---

## 4. 本地開發配置 (Local Development Setup)

```bash
# 1. 克隆專案與安裝依賴 (使用 pnpm)
git clone https://github.com/EricXJason/my-portfolio-website.git
cd my-portfolio-website
pnpm install

# 2. 啟動本地開發伺服器
pnpm run dev

# 3. 執行型別檢查與生產打包
pnpm run build
```

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
