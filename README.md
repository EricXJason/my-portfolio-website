# 許哲誠 個人作品集網站 | Portfolio

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.5.0](https://img.shields.io/badge/Version-3.5.0-blue?style=flat-square)](#)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean_Code-000000?style=flat-square)](#)

---

## 1. Project Overview (專案簡介)

**繁體中文**:
本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站（Website Title: **Portfolio**）。採用全模組化直觀語意 JSON 架構（`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`），整合個人於 **互動應用開發 (Unity / UE5 / VR / AR)**、**全端開發 (React / Spring Boot)** 與 **多媒體美學設計** 之專案成果、實務工作經歷、研習歷程、學術論文與專業證照。

本網站核心設計理念聚焦於高質感數位視覺體驗與極致使用者互動：
- **深淺色模式專屬視覺系統 (Theme-Aware Multilayer Shadow System)**：針對深色（Dark Mode）與淺色（Light Mode）主題量身定制光影層次，包含頭像專屬多層次立體陰影 (`0 20px 40px -10px rgba(14,165,233,0.18)` / `0 20px 45px -10px rgba(6,182,212,0.3)`)、柔和背景環狀光暈（Radial Background Glow）與 Glassmorphic 玻璃擬態邊框。
- **沉浸式音視效互動引擎 (Audio-Visual Interactive Engine)**：整合基於 Web Audio API 之自訂合成器背景音樂引擎 (`bgmSynth.js`) 與 HTML5 Canvas 賽博粒子渲染器 (`CyberParticles.jsx`)，賦予現代網頁視覺靈動感與高度互動性。
- **去 i18n 化語意 JSON 數據層 (Semantic JSON Data Store)**：徹底解耦前端組件與靜態資料，以直觀語意 JSON 檔案託管全站文本與媒體資源鏈結，提升開發擴充性與維護效率。

**English**:
Official personal portfolio web application for **HSU, CHE-CHENG** (Website Title: **Portfolio**). Built on a fully modular semantic JSON architecture (`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`), bringing together interactive application engineering (Unity / UE5 / VR / AR), fullstack web architecture (React / Spring Boot), multimedia design projects, work experience, academic research, and credentials.

Key website concepts and visual aesthetics include:
- **Theme-Aware Multilayer Shadow & Glassmorphism**: Tailored Light and Dark mode visual systems featuring custom multilayer avatar shadows, radial background glows, glassmorphic card overlays, and high-contrast WCAG-compliant legibility.
- **Audio-Visual Interactive Engine**: Custom Web Audio API synthesizer (`bgmSynth.js`) for ambient audio and an HTML5 Canvas cyber particle renderer (`CyberParticles.jsx`).
- **Semantic JSON Architecture**: Clean, decoupled data layer managing text strings, project highlights, and media links without external i18n overhead.

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
