# 許哲誠 個人作品集網站 | Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-0F172A?style=flat-square&logo=github&logoColor=white)](#)
[![Version: 4.4.0](https://img.shields.io/badge/Version-4.4.0-2563EB?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-0D9488?style=flat-square)](#)

---

## 1. 專案簡介 (Project Overview)

本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（**Portfolio**）。整合展示個人於 **互動應用開發** (Unity / UE5)、**全端開發** (React / Spring Boot) 與 **多媒體美學設計** 之專案成果、實務經歷、學術論文與專業證照。

- **作者資訊 (Author Info)**: 許哲誠 (HSU, CHE-CHENG)
- **線上展示 (Live Demo)**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)
- **核心特色 (Key Features)**:
  - **中英雙語切換 (Bilingual Support)**: 支援 繁體中文 與 English 雙語即時切換。
  - **雙主題獨立美學 (Independent Dual-Theme UI)**: 獨立設計深色（Cyber Black）與淺色（Luminous Slate）模式之按鈕、卡片外框、Icon 對比度與捲軸系統。
  - **動態 Canvas 與音脈衝引擎 (Canvas & Audio Engine)**: 整合 Web Audio API 自訂背景音脈衝與 HTML5 Canvas 粒子拓動演算法。
  - **雙平台效能滿分 (Lighthouse 100/100)**: 精密最佳化桌面與行動裝置之 Performance、Accessibility、Best Practices 與 SEO 指標。

Official personal portfolio web application for **HSU, CHE-CHENG**. Integrated platform showcasing interactive 3D applications, fullstack software engineering, multimedia design projects, professional experience, research publications, and credentials.

---

## 2. 技術棧 (Technology Stack)

| 分類 (Category) | 專案使用技術 (Technologies Used) |
| :--- | :--- |
| **核心框架與語言 (Core & Language)** | React 19, TypeScript 5.9, Vite 8, ES Modules |
| **包管理器 (Package Manager)** | pnpm |
| **樣式與圖示 (Styling & Icons)** | Tailwind CSS v4, Lucide Icons |
| **狀態與資料 (State & Data)** | React Context API (`LangContext`, `ThemeContext`), Modular JSON |
| **音視效引擎 (Audio & Canvas)** | Web Audio API Custom Synth, HTML5 Canvas Particle Engine |
| **部署與託管 (Deployment)** | GitHub Actions, GitHub Pages |

---

## 3. 目錄結構 (Directory Structure)

專案嚴格遵從 **`kebab-case`** 命名規範與結構化模組劃分：

```text
my-portfolio-website/
├── public/assets/         # 靜態視覺媒體與圖片資源 (AVIF)
├── src/
│   ├── components/        # 模組化 React UI 組件 (.tsx)
│   ├── context/           # 全局語系與主題 Context (.tsx)
│   ├── data/              # 靜態資料庫 (.json)
│   ├── utils/             # Web Audio 音效與工具函式 (.ts)
│   ├── App.tsx            # 主應用組件
│   ├── main.tsx           # 應用入口檔
│   ├── index.css          # 核心 Tailwind CSS 設計系統樣式
│   └── vite-env.d.ts     # Vite 環境定義
├── index.html             # 入口頁面與 SEO Meta 設定
├── .env.example           # 環境變數範本檔
├── package.json
├── pnpm-lock.yaml         # pnpm 鎖定檔
├── tsconfig.json          # TypeScript 設定檔
└── README.md
```

---

## 4. 本地開發配置 (Local Development Setup)

### 前置需求 (Prerequisites)
- Node.js >= 18.0.0
- pnpm >= 9.0.0

### 環境變數設定 (.env Configuration)
複製 `.env.example` 並建立 `.env.local` 檔案：
```bash
cp .env.example .env.local
```

### 安裝與啟動步驟 (Installation & Execution)
```bash
# 1. 克隆專案與安裝依賴
git clone https://github.com/EricXJason/my-portfolio-website.git
cd my-portfolio-website
pnpm install

# 2. 啟動本地開發伺服器
pnpm run dev

# 3. 執行型別檢查與生產打包
pnpm run build

# 4. 生產環境預覽
pnpm run preview
```

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
