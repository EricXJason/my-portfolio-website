# ⚡ 許哲誠 (HSU, CHE-CHENG) | 個人官方作品集網站 (Personal Portfolio Website)

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG_許哲誠-orange?style=flat-square)](#)
[![Version: 2.7.0](https://img.shields.io/badge/Version-2.7.0-blue?style=flat-square)](#)
[![Build: Clean](https://img.shields.io/badge/Build-Passing-green?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

---

## 1. 專案簡介 Project Overview

本專案為 **許哲誠 (HSU, CHE-CHENG)**（國立臺灣藝術大學多媒體動畫藝術學系碩士）之個人官方作品集網站。全站採用極致戰術賽博朋克 (Tactical Cyberpunk HUD) 視覺美學，完整呈現在 VR/AR/3D 互動應用開發 (Unity C#)、全端網頁工程 (React, TypeScript, Vite, Tailwind CSS)、多媒體美學設計、專業證照、學術論文發表與美術畫廊之代表作成果。

This is the personal official portfolio website of **HSU, CHE-CHENG (許哲誠)**, a Master of Fine Arts (M.F.A.) graduate from the Department of Multimedia and Animation Arts, National Taiwan University of Arts. The portfolio showcases interactive applications (VR/AR/3D/Unity), full-stack web engineering (React, TypeScript, Vite, Tailwind CSS), multimedia design, certifications, publications, and an interactive art gallery under an elite Tactical Cyberpunk HUD aesthetic.

---

## 2. 技術棧 Technology Stack 

| Category / 類別 | Technology / 技術項目 | Description / 說明 |
| :--- | :--- | :--- |
| **Core UI & Logic** | React 19, TypeScript, Vite 6 | High-performance SPA frontend foundation with full type safety |
| **Styling & HUD Design** | Tailwind CSS 4, Vanilla CSS3 | Custom Cyberpunk HUD tokens, scanline lasers, cut-corner polygons |
| **Icon Systems** | Lucide React, Centralized Tech Icons JSON | Vector SVG icons with natural brand color rendering |
| **Asset Optimization** | AVIF / WebP Compression, Vite Asset Pipeline | Lightning fast initial load times and optimized texture sizes |
| **Interactive Overlays** | YouTube Lightbox, Custom Project Detail Modals | Unabridged project previews with full keyboard accessibility (ESC key) |

---

## 3. 目錄結構 Directory Structure 

```text
my-portfolio-website/
├── docs/                      # Dynamic documentation (check-list.md gitignored, change-log.md tracked)
│   ├── check-list.md
│   └── change-log.md
├── public/                    # Static public assets & favicon
│   ├── assets/
│   │   ├── gallery/
│   │   ├── images/
│   │   └── logos/
│   └── tech-icons/            # Vector SVG brand assets (artstation, css, github, html, js, react, tailwind, ts, vite)
├── src/
│   ├── components/            # React UI components
│   │   ├── icons/             # Centralized TechIcon component
│   │   ├── About.tsx
│   │   ├── ArtGallery.tsx
│   │   ├── Certifications.tsx
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── FullStackCodeStreamBackground.tsx
│   │   ├── GlobalAmbientNeon.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Projects.tsx
│   │   ├── Publications.tsx
│   │   └── Skills.tsx
│   ├── context/               # React Context (ThemeContext, LangContext)
│   ├── data/                  # Structured JSON data files (kebab-case)
│   │   ├── about-section.json
│   │   ├── artgallery-section.json
│   │   ├── certifications-section.json
│   │   ├── education-section.json
│   │   ├── experience-section.json
│   │   ├── hero-section.json
│   │   ├── projects-section.json
│   │   ├── publications-section.json
│   │   ├── skills-section.json
│   │   ├── site-translations.json
│   │   └── tech-icons.json
│   ├── utils/                 # Asset path utilities & helpers
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example               # Environment variables configuration template
├── index.html                 # Main HTML entry with complete SEO meta tags
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. 本地開發配置 Local Development Setup 

### Prerequisites (前置需求)
- Node.js 18.0.0 or higher
- pnpm / npm / yarn package manager

### Environment Configuration (.env)
Copy `.env.example` to `.env` if custom environment variables are needed:
```bash
cp .env.example .env
```

### 安裝與啟動指令 Installation & Execution Commands 
```bash
# 1. Install dependencies
pnpm install

# 2. Start local development server (Locked on port 5500)
pnpm dev

# 3. Build production bundle & run type check
pnpm build

# 4. Preview production build locally (Locked on port 5500)
pnpm preview
```
