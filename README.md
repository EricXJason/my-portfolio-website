# ⚡ 許哲誠 (HSU, CHE-CHENG) | 個人官方作品集網站 (Personal Portfolio Website)

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG_許哲誠-orange?style=flat-square)](#)
[![Version: 3.1.0](https://img.shields.io/badge/Version-3.1.0-blue?style=flat-square)](#)
[![Build: Clean](https://img.shields.io/badge/Build-Passing-green?style=flat-square)](#)
[![Standard: WCAG_AAA](https://img.shields.io/badge/Accessibility-WCAG_AAA-00C7B7?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

---

## 1. Project Overview (專案簡介)

### English
This is the personal official portfolio website of **HSU, CHE-CHENG (許哲誠)**, Master of Fine Arts from the Department of Multimedia and Animation Arts, National Taiwan University of Arts. The portfolio showcases interactive applications (VR/AR/3D/Unity), full-stack web engineering (React 19, TypeScript, Vite, Tailwind CSS), multimedia aesthetic design, academic research, certifications, publications, and an interactive art gallery under an elite Tactical Cyberpunk HUD aesthetic.

### 繁體中文
本專案為 **許哲誠 (HSU, CHE-CHENG)**（國立臺灣藝術大學多媒體動畫藝術學系碩士）之個人官方作品集網站。全站採用極致戰術賽博朋克 (Tactical Cyberpunk HUD) 視覺美學，完整呈現在 VR/AR/3D 互動應用開發 (Unity C#)、全端網頁工程 (React 19, TypeScript, Vite, Tailwind CSS)、多媒體美學設計、國科會產學研究、專業證照、學術論文發表與美術畫廊之代表作成果。

- **Author / 作者**: HSU, CHE-CHENG (許哲誠)
- **Degree / 學位**: Master of Fine Arts (新媒體藝術碩士), National Taiwan University of Arts

---

## 2. Technology Stack (技術棧)

| Category / 類別 | Technology / 技術項目 | Description / 說明 |
| :--- | :--- | :--- |
| **Core UI & Logic** | React 19, TypeScript, Vite 8 | High-performance SPA frontend foundation with full type safety |
| **Styling & HUD Design** | Tailwind CSS 4, Vanilla CSS3 | Custom Cyberpunk HUD tokens, scanline lasers, cut-corner polygons |
| **Icon Systems** | Lucide React, Centralized Tech Icons JSON | Vector SVG icons with natural brand color rendering |
| **Asset Optimization** | AVIF / WebP Compression, Dynamic Chunk Splitting | Lightning fast initial load times and optimized bundle sizes |
| **Accessibility & Standards** | WCAG 2.1/2.2 AAA/AA, Keyboard Trap Prevention | 100% compliant contrast, accessible names, and seamless responsive design |
| **CI / CD Pipeline** | GitHub Actions (CI), Cloudflare Pages (CD) | Automated continuous integration testing and global edge network delivery |

---

## 3. Directory Structure (目錄結構)

```text
my-portfolio-website/
├── docs/                      # Global Dynamic Documentation (Git Tracked)
│   ├── development-plan.md    # Master Architecture Plan & System Specifications
│   ├── check-list.md          # Single-Session Checklist
│   └── change-log.md          # Pure Chinese Append-Only Changelog
├── public/                    # Static public assets, SEO artifacts & favicon
│   ├── assets/
│   │   ├── gallery/
│   │   └── images/
│   ├── tech-icons/            # Vector SVG brand assets
│   ├── llms.txt               # AI Agent & LLM Web Crawler Standard Spec
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── components/            # React UI components
│   │   ├── icons/             # Centralized TechIcon component
│   │   ├── About.tsx
│   │   ├── ArtGallery.tsx
│   │   ├── BackToTop.tsx
│   │   ├── Certifications.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── CyberParticles.tsx
│   │   ├── Education.tsx
│   │   ├── Footer.tsx
│   │   ├── FullStackCodeStreamBackground.tsx
│   │   ├── GlobalAmbientNeon.tsx
│   │   ├── Hero.tsx
│   │   ├── InitialPreloader.tsx
│   │   ├── LangSelectModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Projects.tsx
│   │   ├── SciFiRobotAvatar.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── SeoSchema.tsx
│   │   ├── SideNav.tsx
│   │   ├── Skills.tsx
│   │   └── YoutubeModal.tsx
│   ├── context/               # React Context (ThemeContext, LangContext)
│   ├── data/                  # Structured JSON data files (kebab-case)
│   │   ├── about-section.json
│   │   ├── certifications-section.json
│   │   ├── experience-section.json
│   │   ├── gallery-section.json
│   │   ├── hero-section.json
│   │   ├── projects-section.json
│   │   ├── seo-schema.json
│   │   ├── site-translations.json
│   │   ├── skills-section.json
│   │   └── tech-icons.json
│   ├── hooks/                 # Custom React Hooks (useScrollReveal.ts)
│   ├── utils/                 # Audio synthesis & asset path utilities
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example               # Environment variables configuration template
├── AGENTS.md                  # Global AI Agent Protocol Standard
├── index.html                 # Main HTML entry with complete SEO meta tags
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## 4. Local Development Setup (本地開發配置)

### Prerequisites (前置需求)
- Node.js 18.0.0 or higher
- pnpm / npm / yarn package manager

### Environment Configuration (.env)
Copy `.env.example` to `.env` if custom environment variables are needed:
```bash
cp .env.example .env
```

### Installation & Execution Commands (安裝與啟動指令)
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
