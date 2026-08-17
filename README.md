# 個人官方作品集網站 Personal Portfolio Website

## 1. 專案簡介 Project Overview

本專案為 **許哲誠 (HSU, CHE-CHENG)**（國立臺灣藝術大學多媒體動畫藝術學系碩士）之個人官方作品集網站。全站採用極致戰術賽博朋克 (Tactical Cyberpunk HUD) 視覺美學，完整呈現在 VR/AR/3D 互動應用開發 (Unity C#)、全端網頁工程 (React, TypeScript, Vite, Tailwind CSS)、多媒體美學設計、專業證照、學術論文發表與美術畫廊之代表作成果。

This is the personal official portfolio website of **HSU, CHE-CHENG (許哲誠)**, a Master of Fine Arts (M.F.A.) graduate from the Department of Multimedia and Animation Arts, National Taiwan University of Arts. The portfolio showcases interactive applications (VR/AR/3D/Unity), full-stack web engineering (React, TypeScript, Vite, Tailwind CSS), multimedia design, certifications, publications, and an interactive art gallery under an elite Tactical Cyberpunk HUD aesthetic.

---

## 2. 技術棧 Technology Stack 

HTML5 · CSS3 · Tailwind CSS · TypeScript · React · Vite · GitHub Actions
---

## 3. 目錄結構 Directory Structure 

```text
my-portfolio-website/
├── docs/                      
│   ├── check-list.md
│   └── change-log.md
├── public/                   
│   ├── assets/
│   │   ├── gallery/
│   │   ├── images/
│   │   └── logos/
│   └── tech-icons/            
├── src/
│   ├── components/           
│   │   ├── icons/             
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
│   ├── context/               
│   ├── data/                  
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
│   ├── utils/                 
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example               
├── index.html                
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. 本地開發配置 Local Development Setup 

### Prerequisites (前置需求)
- Node.js 18.0.0 or higher
- pnpm / npm / yarn package manager

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
