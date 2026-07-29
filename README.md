# 許哲誠 個人作品集網站 | Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.4.0](https://img.shields.io/badge/Version-3.4.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)

---

## 1. Project Overview (專案簡介)

**繁體中文**:
本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（Website Title: **Portfolio**）。採用全模組化直觀語意 JSON 架構（`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`），整合個人於 **互動應用開發 (Unity / UE5 / VR / AR)**、**全端開發 (React / Spring Boot)** 與 **多媒體美學設計** 之專案成果、實務工作經歷、研習歷程、學術論文與專業證照。

**English**:
Official personal portfolio web application of **HSU, CHE-CHENG** (Website Title: **Portfolio**). Designed with a clean, semantic modular JSON architecture showcasing interactive application engineering, fullstack web architecture, professional work experience, academic research, credentials, and digital multimedia artworks.

- **Author**: HSU, CHE-CHENG (許哲誠)
- **Live Demo**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

---

## 2. Technology Stack (技術棧)

| 分類 (Category) | 本作品集專案實際使用技術 (Technologies Used in This Project) |
| :--- | :--- |
| **Core Framework & Build Tool** | React 19, Vite 8, ES Modules |
| **Styling & Styling Engine** | Tailwind CSS v4, SASS / SCSS, Lightning CSS |
| **UI Components & Icons** | Lucide Icons, Custom Glassmorphism UI Components |
| **State Management & Data Store** | React Context API (`LangContext`, `ThemeContext`), Semantic JSON Store |
| **Audio & Canvas Engines** | Web Audio API Synthesizer (`bgmSynth.js`), HTML5 Canvas (`CyberParticles.jsx`) |
| **Code Quality & Linter** | Oxlint |
| **CI/CD & Hosting** | GitHub Actions (`deploy.yml`), GitHub Pages |

---

## 3. Directory Structure (目錄結構)

```text
my-portfolio-website/
├── docs/                  # Mandatory Dynamic Project Documentation
│   ├── check-list.md
│   └── change-log.md
├── public/assets/         # Optimized Visual Assets & Media
├── src/
│   ├── components/        # Modular React UI Components
│   ├── context/           # Global LangContext & ThemeContext
│   ├── data/              # Semantic JSON Data Store
│   ├── utils/             # Web Audio Synthesizer & Asset Utilities
│   ├── App.jsx            # Main App Component
│   └── index.css          # Core Design System & Tokens
├── index.html             # SEO Meta Tags & JSON-LD Structured Data
├── package.json
└── README.md
```

---

## 4. Local Development Setup (本地開發配置)

```bash
# 1. 克隆專案與安裝依賴 (Clone & Install Dependencies)
git clone https://github.com/EricXJason/my-portfolio-website.git
cd my-portfolio-website
npm install

# 2. 啟動本地開發伺服器 (Start Dev Server)
npm run dev

# 3. 執行生產環境打包 (Build Production Bundle)
npm run build
```

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
