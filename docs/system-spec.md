# System Master Specification | 系統主規格書

> **Author**: HSU, CHE-CHENG (許哲誠)
> **Version**: 3.0.0
> **Last Updated**: 2026-07-29

---

## 1. Overview | 專案總覽

**繁體中文**:
本專案為 **許哲誠 (HSU, CHE-CHENG)** 之個人官方作品集網站。採用全模組化直觀語意 JSON 架構（`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`），整合互動應用開發、全端工程實務、工作經歷、研習歷程、學術論文與多媒體美學設計。

**English**:
Master specification for personal portfolio web application of **HSU, CHE-CHENG**, featuring full modular semantic JSON architecture showcasing interactive application engineering, fullstack web architecture, work experiences, professional workshops, academic papers, and digital design portfolio.

---

## 2. Core Capabilities & Features | 核心功能規格

- **Theme-Aware Multilayer Shadow Avatar Framing (深淺色專屬多層次立體陰影頭像外框)**: Clean portrait avatar container utilizing tailored multilayer shadows (`0 20px 40px -10px rgba(14,165,233,0.18)` in Light mode & `0 20px 45px -10px rgba(6,182,212,0.3)` in Dark mode) with soft radial background glow.
- **Accurate Thesis Publications Data (精準學術論文資訊)**: Master's thesis and conference paper details reflecting exact degree status and awards.
- **i18n-Free Semantic JSON Architecture (去 i18n 化語意 JSON 架構)**: Clean, self-explanatory JSON filenames (`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`).
- **Streamlined Lightbox Header (簡化美術彈跳視窗列)**: Clean top-right Download Image and Close controls without filename clutter.
- **Explicit Drive Link Key Names (明確網址命名)**: Every external drive link key in JSON is named explicitly.
- **Inline Featured Works Expansion (原地作品展開機制)**: Clicking "Expand All Works" (展開全部作品) under Featured Works switches active filter to All Works inline.

---

## 3. Architecture & Data Flow | 系統架構與資料流

- **UI Layer**: React 18 modular components (`Navbar`, `Hero`, `About`, `Projects`, `Certifications`, `Education`, `ArtGallery`, `YoutubeModal`, `SideNav`, `Footer`).
- **State Management**: React Context (`LangContext`, `ThemeContext`).
- **Data Layer**: Decoupled JSON data store (`site-translations.json`, `hero-section.json`, `about-section.json`, `skills-section.json`, `projects-section.json`, `experience-section.json`, `certifications-section.json`).
- **Audio & Visual Effects**: Web Audio API synth (`bgmSynth.js`) & Canvas particle renderer (`CyberParticles.jsx`).

---

## 4. Engineering Principles & Compliance | 工程原則與規範

- **Author**: HSU, CHE-CHENG (許哲誠)
- **SOLID & Defensive Code**: Strict single responsibility and DIP implementation.
- **Strict Scope Isolation**: Zero unrequested visual or functional modifications.
- **Zero-Hallucination Data**: Grounded authentic project data and academic certifications.
- **Comprehensive RWD**: Responsive support across PC, Tablet, and Mobile in both portrait and landscape orientations.

---

## 5. Technology Stack Matrix | 技術棧矩陣

- **Frontend Core**: React 18, Vite, SCSS, Tailwind CSS, Lucide Icons
- **Backend & Integrations**: Java Spring Boot, REST APIs, LINE Messaging API
- **AI & Dev Tools**: Codex, Antigravity, Claude Code, Cursor, Suno
- **Engine & 3D Tools**: Unity (C#), Unreal Engine 5, Blender, Maya, ZBrush, RizomUV, Substance Painter, Marmoset Toolbag
- **Deployment & CI/CD**: GitHub Actions, GitHub Pages
