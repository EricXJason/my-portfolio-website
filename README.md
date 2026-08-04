# Portfolio | 個人官方作品集網站

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-0F172A?style=flat-square&logo=github&logoColor=white)](#)
[![Version: 4.5.0](https://img.shields.io/badge/Version-4.5.0-2563EB?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-0D9488?style=flat-square)](#)

---

## 1. 專案簡介與核心特色 (Project Overview & Key Features)

本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（**Portfolio**）。本網站設計概念以 **「將 3D 空間美學與現代 Web 前端技術深度融合」** 為核心主軸，結合 **Web Audio API 幾何音脈衝**、**HTML5 Canvas 動態粒子拓動演算法** 與 **微光玻璃卡片浮雕**，打造兼具未來科技感、沉浸式互動與極致資訊質感的展演平台。

Official personal portfolio web application designed for **HSU, CHE-CHENG**. Built upon the core design vision of **seamlessly integrating 3D spatial interactive aesthetics with modern web architecture**, featuring ambient frequency audio pulse, dynamic particle canvas algorithms, and refined glassmorphism UI.

- **作者資訊 (Author Info)**: 許哲誠 (HSU, CHE-CHENG)
- **線上展示 (Live Demo)**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

### 核心特色與 UI/UX 體驗重點 (Key Features & UI/UX Design Focus)
1. 🌐 **中英雙語無縫切換 (Bilingual Seamless Toggle)**：完整支援 繁體中文 與 English 雙語即時切換，於行動端與桌面端提供 2 欄水平對齊之語言選擇面板與 Navbar 即時語系滑塊。
2. 🌓 **雙色主題獨立美學 (Independent Dual-Theme UI System)**：獨立規劃深色（Cyber Neon Black）與淺色（Luminous Blue）雙主題，包含獨立卡片外框微光、按鈕 Hover 漸層、Icon 對比度與獨立 Custom Scrollbars 捲軸。
3. 🎨 **UI/UX 視覺與體驗設計重點 (UI/UX Visual & Experience Focus)**：自訂音脈衝互動、響應式 Canvas API 粒子引力拓動、排版長度動態折疊 controls 與 100/100 Lighthouse / WCAG AAA 無障礙閱讀體驗。

---

## 2. 技術棧 (Technology Stack)

| 分類 (Category) | 專案使用技術 (Technologies Used) |
| :--- | :--- |
| **核心框架與語言 (Core & Language)** | React 19, TypeScript 5.9, Vite 8, ES Modules |
| **樣式與圖示 (Styling & Icons)** | Tailwind CSS v4, Lucide Icons |
| **狀態與資料 (State & Data)** | React Context API (`LangContext`, `ThemeContext`), Modular JSON (`src/data/*.json`) |
| **音視效引擎 (Audio & Canvas)** | Web Audio API Custom Synth, HTML5 Canvas Particle Engine |
| **SEO 與無障礙 (SEO & PWA)** | JSON-LD Dynamic Schema (`SeoSchema.tsx`), PWA Web Manifest & PNG Icons |
| **部署與託管 (Deployment)** | GitHub Actions (CI/CD), GitHub Pages |

---

## 3. 目錄結構 (Directory Structure)

專案嚴格遵從 **`kebab-case`** 命名規範與結構化模組劃分：

```text
my-portfolio-website/
├── public/                # 靜態視覺媒體、PWA Web Manifest 與 PNG/SVG 圖示
│   ├── assets/            # 專案與畫廊影像資源 (AVIF)
│   ├── favicon.svg        # 核心 SVG 幾何圖示
│   ├── apple-touch-icon.png # iOS Safari 主畫面 PNG 圖示 (180x180)
│   ├── icon-192.png       # Android PWA PNG 圖示 (192x192)
│   ├── icon-512.png       # Android PWA PNG 圖示 (512x512)
│   └── site.webmanifest   # PWA Web Manifest 部署檔
├── src/
│   ├── components/        # 模組化 React UI 組件 (.tsx)
│   ├── context/           # 全局語系與主題 Context (.tsx)
│   ├── data/              # 100% 模組化 JSON 資料庫 (.json)
│   │   ├── seo-schema.json
│   │   ├── hero-section.json
│   │   ├── about-section.json
│   │   ├── skills-section.json
│   │   ├── projects-section.json
│   │   ├── experience-section.json
│   │   ├── certifications-section.json
│   │   └── gallery-section.json
│   ├── utils/             # Web Audio 音效與工具函式 (.ts)
│   ├── App.tsx            # 主應用組件
│   ├── main.tsx           # 應用入口檔
│   └── index.css          # 核心 Tailwind CSS 設計系統樣式
├── index.html             # 入口頁面與 SEO Meta 設定
├── .env.example           # 環境變數範本檔
├── package.json
└── README.md
```

---

## 4. 本地開發配置 (Local Development Setup)

### 前置需求 (Prerequisites)
- Node.js >= 18.0.0

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
