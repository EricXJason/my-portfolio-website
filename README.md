# ⚡ HSU, CHE-CHENG | Official Personal Portfolio Website

[![Author: HSU, CHE-CHENG](https://img.shields.io/badge/Author-HSU%2C_CHE--CHENG-orange?style=flat-square)](#)
[![Version: 3.1.0](https://img.shields.io/badge/Version-3.1.0-blue?style=flat-square)](#)
[![Build: Clean](https://img.shields.io/badge/Build-Passing-green?style=flat-square)](#)
[![Standard: WCAG_AAA](https://img.shields.io/badge/Accessibility-WCAG_AAA-00C7B7?style=flat-square)](#)
[![Lighthouse: 100%](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#)

---

## 1. Project Overview

This is the personal official portfolio website of **HSU, CHE-CHENG**, Master of Fine Arts from the Department of Multimedia and Animation Arts, National Taiwan University of Arts. The portfolio showcases interactive applications (VR/AR/3D/Unity), full-stack web engineering (React 19, TypeScript, Vite, Tailwind CSS), multimedia aesthetic design, academic research, certifications, publications, and an interactive 3D art gallery under an elite Tactical Cyberpunk HUD visual aesthetic.

- **Project Author**: HSU, CHE-CHENG
- **Degree**: Master of Fine Arts, National Taiwan University of Arts
- **Core Vision**: Merging high-level engineering performance, WCAG AAA accessibility standards, and immersive cyberpunk aesthetics into an ultra-fast web portfolio.

---

## 2. Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core UI & Logic** | React 19, TypeScript 5.8, Vite 8 | High-performance Single Page Application (SPA) foundation with strict type safety |
| **Styling & HUD Design** | Tailwind CSS 4, Vanilla CSS3 | Custom Cyberpunk HUD tokens, laser scanlines, chamfered cut-corner polygons |
| **Icon Systems** | Lucide React, Centralized Tech Icons JSON | Vector SVG icons with natural brand color rendering and zero external dependencies |
| **Asset Optimization** | WebP Compression, Single Cache Bundle | Sub-second initial load times, zero-waterfall execution, and preconnect fonts |
| **Accessibility & Standards** | WCAG 2.1/2.2 AAA/AA, Keyboard Trap Prevention | 100% compliant color contrast, accessible names, and seamless responsive design |
| **CI / CD & Cloud Delivery** | GitHub Actions (CI), Cloudflare Pages (CD) | Automated continuous integration quality gates and global Anycast Edge delivery |

---

## 3. Directory Structure

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

## 4. Local Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- pnpm / npm / yarn package manager

### Environment Configuration (.env)
Copy `.env.example` to `.env` if custom environment variables are needed:
```bash
cp .env.example .env
```

### Installation & Execution Commands
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
