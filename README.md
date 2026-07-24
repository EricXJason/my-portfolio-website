# 許哲誠 個人作品集網站 | HSU, CHE-CHENG Portfolio

<p align="center">
  <b>許哲誠 (HSU, CHE-CHENG) 個人作品集網站</b><br/>
  <i>Master of M.A. in New Media Art — Interactive Game Dev | Fullstack Dev | Multimedia Design</i>
</p>

---

## 🌐 網站簡介 | Overview

本專案為 **許哲誠** 之個人官方響應式作品集網站。展示個人於 **互動遊戲開發**、**全端開發** 與 **多媒體設計** 之專案成果、學術論文、專業證照與美術畫廊。

Official personal portfolio website for **HSU, CHE-CHENG**. Showcasing projects, research papers, professional credentials, and multimedia artworks across **Interactive Game Dev**, **Fullstack Web Engineering**, and **Multimedia Design**.

- 🔗 **Live Demo**: [https://ericxjason.github.io/my-portfolio-website/](https://ericxjason.github.io/my-portfolio-website/)

---

## 🛠️ 技術棧 | Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, SCSS, Lucide Icons
- **State & i18n**: Context API (ZH / EN BGM & Theme Control)
- **Data Layer**: Clean Modular JSON (`projects.json`, `skills.json`, `education.json`, `certifications.json`, `i18n.json`)
- **Audio Engine**: Web Audio API Ambient BGM Synthesizer
- **CI/CD**: GitHub Actions → GitHub Pages

---

## 📂 目錄結構 | Structure

```text
PortfolioWebsite/
├── public/assets/         # Reorganized 3D, 2D Artworks & Images
├── src/
│   ├── components/        # Modular React Components (Hero, About, Skills, Projects, Education, etc.)
│   ├── context/           # Global LangContext & ThemeContext
│   ├── data/              # Decoupled JSON Data Layer (*.json)
│   ├── utils/             # BGM Synthesizer & Asset Path Utilities
│   ├── App.jsx            # App Entry
│   └── index.css          # Design System Styles
├── .github/workflows/     # CI/CD Deployment Workflow
└── README.md
```

---

## 🚀 本地開發 | Local Setup

```bash
# Install Dependencies
npm install

# Dev Server
npm run dev

# Production Build
npm run build
```

---

© 2026 **許哲誠 (HSU, CHE-CHENG)**. All Rights Reserved.
