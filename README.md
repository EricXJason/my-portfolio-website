# 許哲誠 個人作品集網站 | HSU, CHE-CHENG Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.0.0](https://img.shields.io/badge/Version-3.0.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)

---

## 1. 🌐 專案簡介與宣言 | Project Manifesto & Overview

**繁體中文**:
本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方響應式作品集網站。採用全模組化直觀語意 JSON 架構，整合個人於 **互動應用開發 (Unity / UE5 / VR / AR)**、**全端開發 (React / Spring Boot / Angular)** 與 **多媒體美學設計** 之專案成果、實務工作經歷、研習歷程、學術論文與專業證照。

**English**:
Official personal portfolio website for **HSU, CHE-CHENG**. Showcasing interactive applications, research projects, professional work experience, academic papers, credentials, and multimedia artworks across **Interactive Application Dev**, **Fullstack Web Engineering**, and **Multimedia Design** with a fully semantic modular JSON architecture.

- 🔗 **Live Demo**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

---

## 2. ⚡ 核心能力與特色 | Core Capabilities & Features

- **深淺色模式專屬多層次陰影頭像 (Theme-Aware Multilayer Shadow Avatar)**: 針對深色與淺色模式量身定制雙重立體層次陰影 (`0 20px 40px -10px rgba(14,165,233,0.18)` / `0 20px 45px -10px rgba(6,182,212,0.3)`) 與柔和背景光暈。
- **語意化模組 JSON 架構 (Semantic JSON Architecture)**: 徹底去除 `i18n` 命名，採用直觀無歧義之 JSON 設定檔（`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`）。
- **純粹彈跳視窗圖列 (Streamlined Gallery Lightbox)**: 彈跳視窗左上角無多餘檔名/ID標籤，工具列純淨收納下載與關閉按鈕。
- **美術作品圖片下載 (Artwork Image Download)**: 美術畫廊彈跳視窗（Lightbox）右上角提供「下載圖片」按鈕，可直接下載原圖檔。
- **動態本地時間格式化 (Dynamic Local Date Formatting)**: 頁腳與時間標記採動態 ISO-8601 本地時間計算。

---

## 3. 🏗️ 架構與資料流 | Architecture & Data Flow

```text
User Interface (React Components)
  ├── Global Context (LangContext, ThemeContext)
  ├── Semantic JSON Store (site-translations.json, hero-section.json, about-section.json, skills-section.json, projects-section.json, experience-section.json, certifications-section.json)
  └── Web Audio Engine (bgmSynth.js, CyberParticles.jsx)
```

---

## 4. 🛡️ 工程原則與作者資訊 | Engineering Principles & Author Info

- **Author**: HSU, CHE-CHENG (許哲誠)
- **Principles**: SOLID Architecture, Zero-Trust Security, Strict IP Compliance, Comprehensive RWD, Zero-Hallucination Data, Checklist Conflict Protocol.

---

## 5. 🛠️ 技術棧矩陣 | Technology Stack Matrix

| 領域 (Domain) | 主要技術 (Primary Technologies) |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, SCSS, Tailwind CSS, Lucide Icons |
| **Backend & APIs** | Java Spring Boot, RESTful APIs, Node.js |
| **Interactive & 3D** | Unity (C#), Unreal Engine 5, XR Interaction Toolkit, Blender, Marmoset Toolbag |
| **AI Tools** | Codex, Antigravity, Claude Code, Cursor, Suno |
| **State & i18n** | React Context API (`LangContext`, `ThemeContext`), Semantic JSON |
| **Audio Engine** | Web Audio API Custom Synth |
| **CI/CD & Hosting** | GitHub Actions, GitHub Pages |

---

## 6. 📂 目錄結構樹 | Directory Structure Tree

```text
my-portfolio-website/
├── docs/                  # Mandatory Dynamic Project Documentation
│   ├── check-list.md
│   ├── system-spec.md
│   └── change-log.md
├── public/assets/         # Optimized WebP/PNG Visual Assets & Media
├── src/
│   ├── components/        # Modular React UI Components (Navbar, Hero, About, Projects, Certifications, Education, ArtGallery, etc.)
│   ├── context/           # Global LangContext & ThemeContext
│   ├── data/              # Semantic JSON Data Store (site-translations.json, *-section.json)
│   ├── utils/             # Web Audio Synthesizer & Asset Utilities
│   ├── App.jsx            # Main App Component
│   └── index.css          # Core Design System & Tokens
├── index.html             # SEO Meta Tags & JSON-LD Structured Data
├── package.json
└── README.md
```

---

## 7. 🚀 本地開發與配置 | Getting Started & Configuration

```bash
# 1. 安裝依賴 (Install Dependencies)
npm install

# 2. 啟動開發伺服器 (Start Dev Server)
npm run dev

# 3. 執行生產建置 (Build Production Bundle)
npm run build
```

---

## 8. 🔄 CI/CD 與部署策略 | CI/CD & Deployment Strategies

本專案採用 **GitHub Actions** 進行自動化測試與建置，當推送至 `main` 分支時自動部署至 **GitHub Pages**。

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
