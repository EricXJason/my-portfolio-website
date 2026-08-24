# ⚡ Portfolio | HSU, CHE-CHENG (許哲誠)

[![Live Demo: Online](https://img.shields.io/badge/Live_Demo-Online-00f0ff?style=flat-square)](https://my-portfolio-website.user46972.workers.dev/)
[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.2.0](https://img.shields.io/badge/Version-3.2.0-blue?style=flat-square)](#)
[![Build: Clean](https://img.shields.io/badge/Build-Passing-green?style=flat-square)](#)
[![Standard: WCAG_AAA](https://img.shields.io/badge/Accessibility-WCAG_AAA-00C7B7?style=flat-square)](#)
[![Lighthouse: 100%](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

---

## 1. Project Overview (專案簡介)

### English
This is the personal official portfolio website of **HSU, CHE-CHENG**, Master of Fine Arts from the Department of Multimedia and Animation Arts, National Taiwan University of Arts. The portfolio showcases interactive applications (VR/AR/3D/Unity), full-stack web engineering (React 19, TypeScript, Vite, Tailwind CSS), multimedia aesthetic design, academic research, certifications, publications, and an interactive 3D art gallery under an elite Tactical Cyberpunk HUD visual aesthetic.

- **Live Deployed URL**: [https://my-portfolio-website.user46972.workers.dev/](https://my-portfolio-website.user46972.workers.dev/)
- **Project Author**: HSU, CHE-CHENG
- **Degree**: Master of Fine Arts, National Taiwan University of Arts
- **Core Vision**: Merging high-level engineering performance, WCAG AAA accessibility standards, and immersive cyberpunk aesthetics into an ultra-fast web portfolio.

### 繁體中文
本專案為 **許哲誠 (HSU, CHE-CHENG)**（國立臺灣藝術大學多媒體動畫藝術學系新媒體藝術碩士）之個人官方作品集網站。作品集以頂級賽博龐克戰術 HUD（Tactical Cyberpunk HUD）美學呈現，全面展示互動應用開發（VR/AR/3D/Unity）、全端網頁工程（React 19、TypeScript、Vite、Tailwind CSS）、多媒體美學設計、國科會學術研究計畫經歷、專業證照、學術論文與互動 3D 美術畫廊。

- **線上部署網址**：[https://my-portfolio-website.user46972.workers.dev/](https://my-portfolio-website.user46972.workers.dev/)
- **專案作者**：許哲誠 (HSU, CHE-CHENG)
- **學位背景**：國立臺灣藝術大學多媒體動畫藝術學系 碩士
- **核心願景**：融合頂尖工程效能、WCAG AAA 無障礙對比標準與沉浸式賽博龐克美學，打造極速絲滑的現代化 Web 作品集。

---

## 2. Technology Stack (技術棧)

| Category (分類) | Technology (技術名稱) | Description (說明) |
| :--- | :--- | :--- |
| **Core UI & Logic (核心前端與邏輯)** | React 19, TypeScript 5.8, Vite 8 | 高效能單頁應用程式（SPA）架構，具備嚴格型別安全與極致模組打包 |
| **Styling & HUD Design (樣式與設計系統)** | Tailwind CSS 4, Vanilla CSS3 | 專屬賽博龐克戰術 HUD 設計標記、雷射掃描動效、斜角切角多邊形幾何 |
| **Icon Systems (圖示系統)** | Lucide React, Centralized Tech Icons JSON | 向量 SVG 圖示系統，嚴格在地化實體格式渲染，杜絕任何外部 CDN 依賴 |
| **Asset Optimization (資源最佳化)** | WebP Compression, Single Cache Bundle | 次秒級初始載入速度、零瀑布流阻塞、Google Fonts 預載與延遲非同步載入 |
| **Accessibility (無障礙對比標準)** | WCAG 2.1/2.2 AAA/AA, Keyboard Navigation | 深淺色模式 100% 符合 WCAG 對比標準、鍵盤無障礙操作、全平臺 RWD 自適應 |
| **CI / CD & Cloud (持續整合與雲端交付)** | GitHub Actions (CI), Cloudflare Pages (CD) | 自動化持續整合建置檢驗與 Cloudflare 全球邊緣節點極速分發 |

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
│   │   ├── MainSiteContent.tsx
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
- pnpm package manager (Recommended) / npm / yarn

### Installation & Execution Commands (安裝與執行指令)

#### English
```bash
# 1. Install dependencies
pnpm install

# 2. Start local development server (Port 5500)
pnpm dev

# 3. Build production bundle & run type check
pnpm build

# 4. Preview production build locally (Port 5500)
pnpm preview

# 5. Run linter inspection
pnpm run lint
```

#### 繁體中文
```bash
# 1. 安裝專案依賴套件
pnpm install

# 2. 啟動本地開發伺服器（預設監聽連接埠 5500）
pnpm dev

# 3. 執行生產環境建置與 TypeScript 型別檢查
pnpm build

# 4. 在本地預覽生產環境建置成果（連接埠 5500）
pnpm preview

# 5. 執行 Linter 代碼語法與品質檢驗
pnpm run lint
```
