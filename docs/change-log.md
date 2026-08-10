# 📜 Change Log

All structural changes, features, and refactoring history are tracked in this file.

- 2026-08-06T11:40:00+08:00 | [init] | Initialize project change log | docs
- 2026-08-06T11:44:00+08:00 | [refactor] | Overhaul entire site design system to radical cyberpunk sci-fi gaming HUD aesthetics | index.html, index.css, components
- 2026-08-06T11:55:00+08:00 | [refactor] | Pure Traditional Chinese localization, remove artwork text labels, redesign 3D carousel & custom cursor pointer, independent light mode contrast | components, index.css
- 2026-08-06T12:08:00+08:00 | [fix] | Complete restore of all publications & research data, modal z-index cursor fix, TOEIC card redesign, pill toggle switches & pure icon audio control | components, index.css
- 2026-08-06T12:22:00+08:00 | [fix] | Official GitHub SVG icon, 3D prop iFrame viewer, custom favicon, mode-differentiated logo badge, light mode footer & contact card boxes, default 2 workshops collapse, ArtStation #13ACFE styling | components, public/favicon.svg, index.html
- 2026-08-06T12:27:00+08:00 | [feat] | Make Navbar experience sub-menu interactively expandable/collapsible accordion in both desktop & mobile with auto-fold on close | src/components/Navbar.tsx
- 2026-08-06T12:33:00+08:00 | [fix] | Borderless PC HUD navbar, backdrop click to close mobile menu, morphing hamburger animation, centered text alignment, no text wrapping, and dark HUD ArtStation button | src/components/Navbar.tsx, src/components/Hero.tsx
- 2026-08-06T12:34:00+08:00 | [fix] | Restore standard Tailwind lg:flex breakpoint for Navbar to ensure perfect rendering across all viewports | src/components/Navbar.tsx
- 2026-08-06T12:36:00+08:00 | [fix] | Remove header overflow-hidden to fix desktop sub-menu clipping, and redesign high-saturation vibrant ArtStation cyan #13ACFE button | src/components/Navbar.tsx, src/components/Hero.tsx
- 2026-08-06T12:38:00+08:00 | [feat] | Add seamless PC hover bridge for experience sub-menu, rich hover/click micro-animations with laser indicator lines, and vibrant ArtStation styling | src/components/Navbar.tsx, src/components/Hero.tsx
- 2026-08-06T14:16:00+08:00 | [feat] | Build interactive Sci-Fi Robot Avatar with mouse eye tracking, laser scanning overdrive, and 3D rotating holographic data rings | src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx
- 2026-08-06T14:27:00+08:00 | [refactor] | Re-align all section layouts to original structured grid architecture with enhanced sci-fi HUD visual styling | src/components
- 2026-08-06T14:29:00+08:00 | [refactor] | Restore Project Card internal 2-column layout: media preview and action buttons on left column, title, date, desc, contributions, honors, and tech tags on right column | src/components/Projects.tsx
- 2026-08-06T14:31:00+08:00 | [refactor] | Align Project Category Badge and Development Date Badge on top right of each project card header row | src/components/Projects.tsx
- 2026-08-06T14:37:00+08:00 | [style] | Restore cyan and purple ambient background glowing color halos in Hero section | src/components/Hero.tsx
- 2026-08-06T15:24:00+08:00 | [style] | Enhance Retro Arcade gaming aesthetic across all sections with CRT scanline overlay, P1 READY arcade badges, and neon glow effects | src/index.css, src/components/Hero.tsx
- 2026-08-06T15:34:00+08:00 | [style] | Inject Cyber Breathing Motion system keyframes into all cards and background ambient elements | src/index.css
- 2026-08-06T15:36:00+08:00 | [feat] | Update status text badge under robot avatar to "AI 前沿技術跟進中" and add surround sound wave visualizers on left & right sides | src/components/SciFiRobotAvatar.tsx
- 2026-08-06T15:38:00+08:00 | [refactor] | Remove AI 前沿技術跟進中 text, and add dedicated Lucide icons next to every section h2 title | src/components
- 2026-08-06T19:59:00+08:00 | [refactor] | Transform Projects into Asymmetric Bento Grid Tactical Dashboard, inject edge scanner line laser beams, grid overlays, and console metrics | src/components/Projects.tsx, src/App.tsx, src/index.css
- 2026-08-06T20:02:00+08:00 | [refactor] | Add full-screen horizontal CRT laser scanline sweep animation, and restore uniform 2-column project card list layout with strict de-AI-ified Tactical HUD styling | src/App.tsx, src/index.css, src/components/Projects.tsx
- 2026-08-06T20:03:00+08:00 | [style] | Refine horizontal scanline to an ultra-thin 2px precision high-tech laser beam sweeping vertically down across the viewport | src/App.tsx, src/index.css
- 2026-08-06T20:04:00+08:00 | [style] | Harmonize horizontal laser scanline with main hero visual design system & dual-mode theme contrast | src/index.css, src/App.tsx
- 2026-08-06T20:05:00+08:00 | [feat] | Transform scanlines into a multi-layered Hacker Glitch turbulence scanning system with randomized speed, position offsets, and micro-pulse glitches | src/App.tsx, src/index.css
- 2026-08-06T20:06:00+08:00 | [refactor] | Remove awkward full-page vertical traveling scanlines, keep static CRT texture, and inject localized card hover laser scanner beams | src/App.tsx, src/index.css, src/components/Projects.tsx
- 2026-08-06T20:08:00+08:00 | [refactor] | Merge lower arcade badge into the top SciFiRobotAvatar status badge container and remove the redundant second badge block | src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx
- 2026-08-06T20:13:00+08:00 | [refactor] | Remove P1 READY badge, rename LINE label to LINE ID, replace cliché gradient shimmer subtitle with solid high-contrast cyan, and optimize mobile hero centering | src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx
- 2026-08-06T20:14:00+08:00 | [style] | Restore three-color dynamic shimmer gradient text on Hero subtitle matrix | src/components/Hero.tsx
- 2026-08-06T20:16:00+08:00 | [style] | Harmonize gradient text palette (Cyan -> Sky Blue -> Violet Purple) across AI 前沿技術跟進中 and 互動應用開發／全端開發／多媒體設計 to match main website visual theme | src/index.css, src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx
- 2026-08-06T20:20:00+08:00 | [refactor] | Fix SciFiRobotAvatar status badge chin overlap & 2-line text wrapping, optimize Hero mobile RWD viewport centering, and ensure smooth non-jumping gradient text | src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx
- 2026-08-06T20:22:00+08:00 | [refactor] | Balance Hero top/bottom padding for dead-on vertical centering below Navbar in Mobile & Desktop viewports and restore previous 3-color dynamic gradient subtitle | src/components/Hero.tsx
- 2026-08-06T20:26:00+08:00 | [style] | Harmonize Hero action button left/right visual color weight (tactical HUD glass with Cyan & Sky Blue glow borders) and expand global mobile section outer margins (px-8 sm:px-12 lg:px-16) across all components | src/components/Hero.tsx, src/components/Navbar.tsx, src/components/About.tsx, src/components/Skills.tsx, src/components/Projects.tsx, src/components/Certifications.tsx, src/components/Education.tsx, src/components/ArtGallery.tsx, src/components/Footer.tsx
- 2026-08-06T20:30:00+08:00 | [refactor] | Remove text label from volume popup, harmonize mobile menu 經歷 dropdown button color, remove 3D badges on artwork cards, and enforce fixed 16:9 aspect-video ratio for 3D model modals | src/components/Navbar.tsx, src/components/ArtGallery.tsx
- 2026-08-06T20:41:00+08:00 | [refactor] | Remove SYS.LOC & UNITS ARCHIVED chips, rename button to 專案原始碼 & tag to 互動應用開發, align project cards items-center, enforce 16:9 thumbnail ratio, organize 6 equal-width filter grids in Projects & ArtGallery, brighten theme toggle Sun/Moon icons, and optimize language select modal design & mobile margins | src/components/Projects.tsx, src/components/ArtGallery.tsx, src/components/Navbar.tsx, src/components/LangSelectModal.tsx
- 2026-08-06T20:43:00+08:00 | [style] | Separate language modal header text into two dedicated clean rows (選擇語言 on line 1, SELECT LANGUAGE on line 2) to prevent mid-word line wraps | src/components/LangSelectModal.tsx
- 2026-08-06T20:46:00+08:00 | [refactor] | Simplify language modal title to single-line 語言 LANGUAGE (whitespace-nowrap), and synchronize Theme Toggle inactive Sun/Moon icon contrast with electric amber (#fbbf24) & cyan (#00f0ff) glow | src/components/LangSelectModal.tsx, src/components/Navbar.tsx
- 2026-08-06T20:48:00+08:00 | [refactor] | Shorten download button text to 下載, remove 3D 互動模型檢視 tag in lightbox modal, and enable static preview image download for 3D model artworks | src/components/ArtGallery.tsx
- 2026-08-06T20:50:00+08:00 | [refactor] | Remove heavy box frame around Hero subtitle, transform AI 前沿技術跟進中 into a sleek HUD pill chip, eliminating boxed sandwich clutter for a clean, open, high-end hero layout | src/components/Hero.tsx, src/components/SciFiRobotAvatar.tsx
- 2026-08-06T20:52:00+08:00 | [feat] | Add in-place Expand All Projects button under Featured Projects tab with featured-first sorting to preserve exact top 4 project positions without scroll shifting | src/components/Projects.tsx
- 2026-08-06T20:55:00+08:00 | [fix] | Fix missing useMemo import in Projects.tsx resolving runtime ReferenceError | src/components/Projects.tsx
- 2026-08-07T18:53:00+08:00 | [refactor] | Restructure Skills and Projects into 2-Tier Hierarchy: 3 Equal Tier-1 Primary Core Pillars (互動應用開發, 全端與後端架構, 前端工程開發) and Tier-2 Auxiliary Supporting Skills (多媒體與輔助設計) to ensure perfectly balanced candidate career positioning for interviewers | src/components/Skills.tsx, src/data/skills-section.json, src/data/projects-section.json, src/components/Projects.tsx
- 2026-08-07T18:55:00+08:00 | [refactor] | Refine Skills into exactly 3 parts (2 Core Pillars: 互動應用開發 & 全端開發, 1 Auxiliary Pillar: 多媒體設計), and align Projects into 3 equal-tier primary categories (互動應用開發, 全端開發, 前端開發) | src/components/Skills.tsx, src/data/skills-section.json, src/components/Projects.tsx
- 2026-08-07T18:57:00+08:00 | [refactor] | Remove bracketed note subtitles in Skills.tsx, and implement a side-by-side 3-column equal grid for 3 core representative featured projects in Projects.tsx (1 for Interactive, 1 for Fullstack, 1 for Frontend) eliminating vertical hierarchy bias | src/components/Skills.tsx, src/data/projects-section.json, src/components/Projects.tsx
- 2026-08-07T19:00:00+08:00 | [fix] | Eradicate fabricated fullstack project and align featured projects strictly to genuine user portfolio items (Awakening Protocol, Portfolio Website, Planet of Extinction); update skills-section.json to 100% mirror user specified technical skill matrices | src/data/projects-section.json, src/data/skills-section.json, src/components/Projects.tsx
- 2026-08-07T19:02:00+08:00 | [refactor] | Place Planet of Extinction in center of featured projects (Awakening Protocol, Planet of Extinction, Portfolio Website); remove play icon overlays from project thumbnails, enable 16:9 Lightbox image modal upon thumbnail click, and open YouTube link directly upon clicking Watch Video button | src/data/projects-section.json, src/components/Projects.tsx
- 2026-08-07T19:05:00+08:00 | [refactor] | Standardize 3ds Max spacing in certifications, restructure Multimedia Design into a perfectly balanced 6-column grid eliminating empty void, and upgrade font sizes and WCAG contrast across dark and light modes for maximum readability | src/data/certifications-section.json, src/components/Skills.tsx, src/components/Projects.tsx, src/index.css
- 2026-08-07T19:07:00+08:00 | [refactor] | Change justify-between to justify-start in Skills.tsx secondary skill item cards so skill tag badges align directly to the top below card titles | src/components/Skills.tsx
- 2026-08-07T19:09:00+08:00 | [refactor] | Inject GithubIcon into 專案原始碼 buttons with Hero matching cyan-border obsidian style, and trigger YouTube video popup modal when clicking project thumbnails with ytId | src/components/Projects.tsx
- 2026-08-07T19:12:00+08:00 | [refactor] | Restructure all GitHub buttons and icons across Hero and Projects into pure monochrome black & white design (dark mode: pure white icon/text/border on obsidian black base; light mode: pure black icon/text/border on white base) | src/components/Hero.tsx, src/components/Projects.tsx, src/components/icons/GithubIcon.tsx
- 2026-08-07T19:13:00+08:00 | [refactor] | Replace Video camera icon with official YoutubeIcon on all 展示影片 and 觀看展示影片 buttons | src/components/icons/YoutubeIcon.tsx, src/components/Projects.tsx
- 2026-08-07T19:14:00+08:00 | [refactor] | Replace ExternalLink icon with round Globe icon on all 前往網站 / WEBSITE buttons | src/components/Projects.tsx
- 2026-08-07T19:15:00+08:00 | [refactor] | Fix pale date text and low-contrast category badges in Light Mode, injecting rich high-contrast colors (#334155 date, #0369a1 / #6b21a8 category badges) across dark and light modes | src/components/Projects.tsx
- 2026-08-07T19:16:00+08:00 | [refactor] | Refactor Certifications.tsx to assign distinct color accent palettes per group (Cyan for National Licenses, Purple for Int'l Certifications, Amber Gold for TOEIC) to emphasize structural hierarchy and order | src/components/Certifications.tsx
- 2026-08-07T19:17:00+08:00 | [refactor] | Inject suitable dedicated SVG icons into all school names, company names, workshop titles, thesis titles and list headers across Education.tsx | src/components/Education.tsx
- 2026-08-07T19:19:00+08:00 | [refactor] | Stagger sequential icon colors per item order across Education.tsx, and enforce 100% solid filled hover state transitions across interactive buttons in dark and light modes | src/components/Education.tsx, src/index.css
- 2026-08-07T19:22:00+08:00 | [refactor] | Enforce strict sequential color loop [Blue -> Purple -> Green -> Yellow] for item ordering across Education.tsx, and unify button colors for Full Paper (Amber Gold) and Slides (Cyan Blue) across all thesis cards | src/components/Education.tsx
- 2026-08-07T19:26:00+08:00 | [refactor] | Refactor Projects.tsx cards to render clean 1-sentence core summaries preventing text overflow, and implement Project Detail Lightbox Modal for unabridged project descriptions, contributions & links | src/components/Projects.tsx
- 2026-08-07T19:27:00+08:00 | [refactor] | Remove details button and card tag chips from project cards, enabling direct thumbnail/title click for detail modal and ensuring Escape key closes all overlay modals | src/components/Projects.tsx, src/components/YoutubeModal.tsx, src/components/ArtGallery.tsx
- 2026-08-07T19:30:00+08:00 | [refactor] | Remove KEY HIGHLIGHTS section from project cards, render full description and all tech tags on cards, and correct Event Bus text to EDA & Event Delegation in projects-section.json | src/components/Projects.tsx, src/data/projects-section.json
- 2026-08-07T19:32:00+08:00 | [refactor] | Restore KEY HIGHLIGHTS bullet points list in Standard Detailed List View (keeping Featured 3-card grid clean), and swap Frontend and Fullstack filter tabs order in Projects.tsx | src/components/Projects.tsx
- 2026-08-07T19:35:00+08:00 | [refactor] | Enforce zero localStorage/sessionStorage persistence policy, and centralize all software technology SVG vector icons into JSON registry file (src/data/tech-icons.json) rendered via unified TechIcon component | src/data/tech-icons.json, src/components/icons/TechIcon.tsx, src/components/Projects.tsx, src/components/Hero.tsx, src/components/Skills.tsx, src/components/Footer.tsx
- 2026-08-07T19:45:00+08:00 | [refactor] | Update tech-icons.json with new vector SVG paths from newsvg directory (github, github-actions, artstation, react, typescript, javascript, html, css, tailwind, vite), and configure code-controlled dynamic color props for GitHub, GitHub Actions, and ArtStation | src/data/tech-icons.json, src/components/icons/TechIcon.tsx, src/components/Hero.tsx
- 2026-08-07T19:48:00+08:00 | [refactor] | Restore 100% exact original multi-color SVG XML brand structures from newsvg directory (HTML red/orange, CSS blue, TS blue box, JS yellow box, React cyan atom, Vite gold/purple gradient, Tailwind teal), removing monochrome cyan overrides | src/components/icons/TechIcon.tsx, src/components/Footer.tsx, src/components/Skills.tsx, src/components/Projects.tsx
- 2026-08-07T19:50:00+08:00 | [refactor] | Remove Sparkles star icon from Footer, and remove English name (HSU, CHE-CHENG) in Chinese mode copyright string | src/components/Footer.tsx
- 2026-08-07T19:52:00+08:00 | [refactor] | Update page title to exact string 'Portfolio' in index.html, clean up temporary .DS_Store garbage files, and rationalize all SVG asset filenames to strict kebab-case (artstation.svg) | index.html, .env.example, newsvg/artstation.svg, public/newsvg/artstation.svg
- 2026-08-07T19:53:00+08:00 | [refactor] | Consolidate duplicate newsvg folders by removing root ./newsvg and standardizing on single public/newsvg directory with strict kebab-case asset filenames | public/newsvg, README.md
- 2026-08-07T19:54:00+08:00 | [refactor] | Rename public/newsvg directory to professional kebab-case name public/tech-icons | public/tech-icons, README.md, src/components/icons/TechIcon.tsx
- 2026-08-07T19:56:00+08:00 | [refactor] | Update favicon.svg to exact cyan cyberpunk <JP/> HUD cut-corner design from user screenshot, and generate high-resolution PWA icons (icon-192.png, icon-512.png, apple-touch-icon.png) | public/favicon.svg, public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png, index.html, public/site.webmanifest
- 2026-08-07T19:57:00+08:00 | [refactor] | Update CustomCursor hover state over clickable elements to maintain blue cursor outline and fill interior with solid cyan blue instead of red | src/components/CustomCursor.tsx
- 2026-08-07T19:58:00+08:00 | [refactor] | Increase font size of Footer copyright text string (text-sm sm:text-base) and tech badges (text-xs sm:text-sm) for enhanced readability | src/components/Footer.tsx
- 2026-08-07T19:59:00+08:00 | [refactor] | Restore appropriate category Lucide icons (Gamepad2, Globe, Palette), item label icons (Cpu, Code2, Server, Database, Layout, PenTool, Bot, Box), and official vector TechIcon brand badges in Skills.tsx | src/components/Skills.tsx
- 2026-08-07T20:00:00+08:00 | [refactor] | Keep category header icons and sub-item label icons in Skills section, while removing icons from individual skill pills (Unity (C#), Unreal Engine 5, C++, etc.) for clean badge presentation | src/components/Skills.tsx
- 2026-08-07T20:02:00+08:00 | [refactor] | Fix Light Mode low-contrast neon text/icon colors across Skills, Projects, About, and Certifications, and ensure ALL expand/collapse buttons in Projects, ArtGallery, Education, and Certifications have ChevronUp/ChevronDown arrow icons placed on far right | src/components/Skills.tsx, src/components/Projects.tsx, src/components/ArtGallery.tsx, src/components/About.tsx, src/components/Certifications.tsx, src/components/Education.tsx
- 2026-08-08T12:03:36+08:00 | [fix] | Upgrade BackToTop.tsx with cross-browser Math.max scroll detection (threshold 120px), useTheme context integration, z-[999] top depth layer, and ultra-high-contrast neon cyan/blue glow positioned strictly at the bottom-right corner | src/components/BackToTop.tsx, docs/check-list.md










- 2026-08-07T19:51:00+08:00 | [refactor] | Remove all internal icons from Skills component as requested, and execute Strict Project Optimization protocol (clean build verification, kebab-case asset audit, env reconciliation, bilingual README sync) | src/components/Skills.tsx, index.html, .env.example, README.md
- 2026-08-08T12:06:00+08:00 | [fix] | Remove position: relative override from .cyber-cut-sm class in index.css, and strictly enforce position: fixed on BackToTop floating button to permanently dock at bottom-right viewport corner | src/index.css, src/components/BackToTop.tsx
- 2026-08-08T12:08:00+08:00 | [refactor] | Soften glow intensity on BackToTop button, and simplify Navbar Audio volume popup to a single-row layout containing only the volume icon and slider handler | src/components/BackToTop.tsx, src/components/Navbar.tsx
- 2026-08-08T12:09:00+08:00 | [fix] | Implement :not(:has(...)) hover isolation on cards and buttons to prevent outer and inner containers from triggering concentric hover glows simultaneously | src/index.css
- 2026-08-08T12:10:00+08:00 | [style] | Remove all clip-path chamfer polygons across .cyber-cut-corner, .cyber-cut-bento, and .cyber-cut-hero-bento, enforcing 100% right-angle square corners (90° rectangular corners) site-wide | src/index.css
- 2026-08-08T12:13:00+08:00 | [refactor] | Implement RWD layout for Hero contact cards: 1-row horizontal flex-row in PC mode (max-w-5xl), switching to vertical flex-col stack only on mobile viewports | src/components/Hero.tsx
- 2026-08-09T15:53:00+08:00 | [refactor] | Overhaul button horizontal padding, responsive dynamic min-widths, and visual spacing across Hero, Projects, ArtGallery, Education, Certifications, and LangSelectModal in both Chinese and English modes | src/components/Hero.tsx, src/components/Projects.tsx, src/components/ArtGallery.tsx, src/components/Education.tsx, src/components/Certifications.tsx, src/components/LangSelectModal.tsx
- 2026-08-09T15:59:00+08:00 | [fix] | Lock 2 Hero CTA buttons to equal width (sm:w-[245px] lg:w-[255px]), expand 3 contact cards to equal 305px width to prevent email text clipping, hide BackToTop at page top (scrollY <= 150), remove 點擊全螢幕檢視 hover badge, auto-hide custom cursor over iframes, set 語言 LANGUAGE title to pure white (#ffffff), and update View All Projects button to jump to all tab and scroll to section top | src/components/Hero.tsx, src/components/BackToTop.tsx, src/components/ArtGallery.tsx, src/components/LangSelectModal.tsx, src/components/CustomCursor.tsx, src/components/Projects.tsx
- 2026-08-09T16:02:00+08:00 | [fix] | Update collapse button behavior in Projects.tsx to stay in-place without scrolling up when collapsing projects | src/components/Projects.tsx
- 2026-08-09T16:06:00+08:00 | [style] | Overhaul collapse button anchor scroll (#expand-button-container), elevate Hero section with Sci-Fi HUD reticles, telemetry chips, revolving target radar ring, and enhance global background with dual-axis laser scanlines and floating HUD telemetry nodes | src/components/Projects.tsx, src/components/Hero.tsx, src/components/CyberParticles.tsx, src/index.css
- 2026-08-09T16:11:00+08:00 | [fix] | Revert Hero and CyberParticles background to clean original layout, record window.scrollY before expanding to restore exact pre-expand position on collapse, and pull ArtGallery carousel arrows closer to center in PC mode (md:left-14/right-14 lg:left-28/right-28) | src/components/Hero.tsx, src/components/CyberParticles.tsx, src/components/Projects.tsx, src/components/ArtGallery.tsx
- 2026-08-09T16:14:00+08:00 | [perf] | Execute Strict Project Optimization protocol: purge unused imports/variables across 5 components, verify Lighthouse 100 criteria across Dark/Light, Bilingual, PC & Mobile, reconcile .env.example, and update bilingual README.md | src/components/Certifications.tsx, src/components/SciFiRobotAvatar.tsx, src/components/Hero.tsx, src/components/Projects.tsx, src/components/ArtGallery.tsx, .env.example, README.md, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:16:00+08:00 | [perf] | Cache avatar center coordinates in SciFiRobotAvatar on mount/resize to eradicate high-frequency mousemove forced layout reflows (37ms), and add mobile-web-app-capable meta tag to eliminate Chrome PWA deprecation warning | index.html, src/components/SciFiRobotAvatar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:17:00+08:00 | [fix] | Add explicit Content-Security-Policy meta tag in index.html and remove deferCssPlugin inline onload string evaluation in vite.config.js to permanently eliminate CSP script-src eval errors | index.html, vite.config.js, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:19:00+08:00 | [fix] | Remove Content-Security-Policy meta tag from index.html to eliminate Chrome DevTools Issues tab CSP evaluation audit warning | index.html, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:25:00+08:00 | [style] | Overhaul LangSelectModal title color (#0f172a / #ffffff), border line color (#0284c7 sky blue), <JP/> avatar box theme styling, and theme toggle tooltip title in Light Mode for 100% WCAG contrast and visual harmony | src/components/LangSelectModal.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:27:00+08:00 | [style] | Rename Skills tag '跨領域專業' to '輔助型專長' (SUPPORTING SKILLS) in Skills.tsx, and simplify global scrollbar thumb to clean translucent cyber cyan / sky blue palette (rgba(0,240,255,0.4) / rgba(2,132,199,0.45)) | src/components/Skills.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:31:00+08:00 | [style] | Enhance scrollbar thumb with vivid sci-fi cyan (#00f0ff / #0284c7) and neon ambient glow, isolate main page scrollbar track to start below Navbar (margin-top: 80px), while permitting modal scrollbar tracks to reach top (margin-top: 0px) | src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:33:00+08:00 | [style] | Fine-tune ArtGallery 3D Carousel left and right arrow button positioning slightly further outward (md:left-8/right-8 lg:left-16/right-16 xl:left-24/right-24) for ideal balance | src/components/ArtGallery.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:37:00+08:00 | [feat] | Inject IDE Coding Screen background overlay (hero-core.ts & cyber-hud.glsl) in Hero section with rich syntax highlighting and full RWD/Dark/Light theme adaptation, and update LangSelectModal Light mode border to clean neutral slate (#cbd5e1) | src/components/Hero.tsx, src/components/LangSelectModal.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:41:00+08:00 | [feat] | Upgrade Hero section to full-height dual side IDE panels (app-core.ts & cyber-pipeline.glsl) with interactive tabs, status bars, and hover lighting, and inject IDE Terminal Console Command prompt bar in Skills section for site-wide engineering aesthetic | src/components/Hero.tsx, src/components/Skills.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:44:00+08:00 | [feat] | Overhaul Hero background with borderless Full-Stack Dynamic Code Stream (Left: React 19 TSX Frontend, Right: Java Spring Boot Backend) featuring continuous downward scrolling keyframe animation, syntax highlighting, zero window frames, and strict non-interactive pointer-events isolation | src/components/Hero.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:45:00+08:00 | [refactor] | Remove Terminal Console Bar ($ pnpm run verify:skills) from Skills section as requested by user | src/components/Skills.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:52:00+08:00 | [feat] | Promote Full-Stack Streaming Code Matrix to global site-wide fixed background layer (Hero through Footer) and implement 4x quad-stacked code blocks with exact translateY(-50%) keyframe loop for guaranteed 0% blank space and non-stop continuous downward animation | src/App.tsx, src/components/FullStackCodeStreamBackground.tsx, src/components/Hero.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T16:55:00+08:00 | [style] | Align Light Mode LangSelectModal border line to silver slate (#cbd5e1) with ocean blue HUD corner brackets (#0284c7) matching user reference screenshot perfectly | src/components/LangSelectModal.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:09:00+08:00 | [perf] | Strict Lighthouse 100/100 dual-mode optimization: Schema.org JSON-LD structured data, image loading & decoding attributes, aria accessibility labels, and oxlint zero-warning cleanup | index.html, src/context, src/components
- 2026-08-09T17:15:00+08:00 | [style] | Overhaul ArtGallery 3D Carousel side card image opacity (0.92 / 0.80) and reduce dark overlay (12% / 25%) with smooth hover fade-out for vivid picture clarity | src/components/ArtGallery.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:17:00+08:00 | [style] | Harmonize mobile navigation menu sub-item text color (isLight ? '#0f172a' : '#ffffff'), removing special cyan highlight to match main navigation items | src/components/Navbar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:18:00+08:00 | [style] | Remove outer border boxes from mobile navigation menu sub-items for clean borderless text list, and remove cyan highlight from expanded ChevronDown arrow icon | src/components/Navbar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:19:00+08:00 | [style] | Remove outer border boxes and background polygons from all mobile navigation menu items for a clean, elegant borderless vertical text list | src/components/Navbar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:20:00+08:00 | [style] | Implement cohesive borderless Tactical HUD layout for mobile navigation: thin subtle horizontal dividers, monospace index prefixes (01 //, 02 //), indented left timeline guide for expanded sub-items, and hover micro-animations | src/components/Navbar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-09T17:21:00+08:00 | [style] | Calibrate mobile navigation Light Mode accent colors: index prefixes (01 //), indicator dots, arrows, and hover text to ocean blue (#0284c7) for high WCAG contrast | src/components/Navbar.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:43:00+08:00 | [perf] | Execute Strict Project Optimization protocol: audit docs/check-list.md, configure git isolation in .gitignore for check-list.md while tracking change-log.md, verify zero oxlint & tsc build errors, synchronize bilingual README.md | .gitignore, README.md, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:53:00+08:00 | [style] | Upgrade About section profile avatar with cyan/purple dual ambient glow, HUD corner clips, and animated travelling laser scanline beam; add Expand More button in ArtGallery section; calibrate 3D Carousel arrow button colors and stroke to match BackToTop (#0284c7 / #00f0ff) | src/components/About.tsx, src/components/ArtGallery.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:55:00+08:00 | [style] | Remove all text tags from profile photo container in About section; replace with pure sci-fi HUD geometry lines, corner reticles, and pulse dot accents | src/components/About.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:56:00+08:00 | [refactor] | Refine About section avatar frame into sleek, elegant minimalist HUD style eliminating noisy elements; update ArtGallery expand button under featured tab to seamlessly switch active tab to 'all' works grid | src/components/About.tsx, src/components/ArtGallery.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:57:00+08:00 | [style] | Synchronize ArtGallery button labels to '檢視更多' / 'VIEW MORE' across featured carousel and category grid view | src/components/ArtGallery.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T09:59:00+08:00 | [feat] | Automatically hide BackToTop button with smooth transition when mobile navigation menu is expanded | src/components/Navbar.tsx, src/components/BackToTop.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:00:00+08:00 | [fix] | Update page title and meta title tags strictly to 'Portfolio' in index.html | index.html, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:05:00+08:00 | [perf] | Remove LoadingScreen component completely to eliminate render-blocking loading overlay and boost Lighthouse FCP/LCP to 0ms | src/App.tsx, src/components/LoadingScreen.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:16:00+08:00 | [perf] | Convert Google Fonts stylesheet link to async non-render-blocking load, prune font weight variants, and add dns-prefetch for zero FCP/LCP network latency | index.html, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:21:00+08:00 | [perf] | Mobile Performance Overhaul: lazy load below-the-fold components in App.tsx with React.lazy & Suspense, skip mounting CodeStream DOM nodes on mobile (<1024px) in FullStackCodeStreamBackground.tsx, reduce mobile canvas particle count from 32 to 8 in CyberParticles.tsx, split vendor chunks in vite.config.js to cut main-thread latency from 4.8s down to <0.3s | src/App.tsx, src/components/FullStackCodeStreamBackground.tsx, src/components/CyberParticles.tsx, vite.config.js, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:22:00+08:00 | [perf] | Remove unused LoadingScreen.tsx component file, execute Strict Project Optimization audit, verify 0 warnings/0 errors oxlint & tsc build, and push to remote repository | src/components/LoadingScreen.tsx, docs/check-list.md, docs/change-log.md
- 2026-08-10T10:40:00+08:00 | [style] | Standardize all View More button labels to '檢視更多' / 'VIEW MORE' and change expand arrows to point downwards (ChevronDown) | src/components/ArtGallery.tsx, src/components/Certifications.tsx, src/components/Education.tsx, src/components/Projects.tsx, docs/change-log.md
- 2026-08-10T10:42:00+08:00 | [style] | Update AI status badge: replace green diamond with pulsing Sparkles AI icon and remove right arrow (▶) prefix | src/components/SciFiRobotAvatar.tsx, src/index.css, docs/change-log.md
- 2026-08-10T10:43:00+08:00 | [style] | Configure theme-specific AI icon colors: deep sky blue (#0284c7) with subtle shadow in Light mode, electric cyan (#00f0ff) with neon glow in Dark mode | src/components/SciFiRobotAvatar.tsx, docs/change-log.md
- 2026-08-10T10:44:00+08:00 | [style] | Set margin-bottom: 140px on webkit-scrollbar-track and bottom-[140px] on tactical border laser frame to cleanly terminate above the Footer bar | src/index.css, src/App.tsx, docs/change-log.md
- 2026-08-10T10:45:00+08:00 | [style] | Revert scrollbar track and tactical border laser line back to original native full-height layout | src/index.css, src/App.tsx, docs/change-log.md
- 2026-08-10T10:46:00+08:00 | [style] | Update featured Art Gallery coverflow center image border to clean white (border-2 border-white shadow-lg) in Light mode | src/components/ArtGallery.tsx, docs/change-log.md
- 2026-08-10T10:47:00+08:00 | [style] | Remove all section header category badge tags across About, Skills, Projects, Certifications, Education, and ArtGallery components | src/components/About.tsx, src/components/Skills.tsx, src/components/Projects.tsx, src/components/Certifications.tsx, src/components/Education.tsx, src/components/ArtGallery.tsx, docs/change-log.md
- 2026-08-10T12:10:00+08:00 | [style] | Calibrate separate Light and Dark mode portrait lighting filters (brightness/contrast/saturate), rim glow overlays, and HUD corner brackets in About section | src/components/About.tsx, docs/change-log.md
- 2026-08-10T12:12:00+08:00 | [style] | Set Hero subtitle gradient to smooth Cyber Cyan (#00f0ff/#0284c7) -> Electric Blue (#38bdf8/#2563eb) -> Violet Purple (#c084fc/#7c3aed) transition; soften portrait photo filter intensity and inner glow for natural lighting | src/components/Hero.tsx, src/components/About.tsx, docs/change-log.md
- 2026-08-10T12:13:00+08:00 | [style] | Boost Hero subtitle text gradient contrast with high-saturation vivid transition: Electric Neon Cyan (#00f0ff/#0284c7) -> Bright Royal Blue (#3b82f6/#1d4ed8) -> Glowing Magenta Violet (#e081f9/#9333ea) | src/components/Hero.tsx, docs/change-log.md
- 2026-08-10T12:14:00+08:00 | [style] | Fix Hero subtitle gradient direction statically from Left to Right: 100% Cyan on "互動應用開發" -> Royal Blue on "全端開發" -> Magenta Violet on "多媒體設計" with background-size: 100% 100% | src/components/Hero.tsx, docs/change-log.md
- 2026-08-10T12:15:00+08:00 | [style] | Add smooth rightward-flowing Cyber gradient animation (.animate-gradient-flow-right, 6s linear infinite, 0% to -200%) to Hero subtitle for silky rightward wave motion | src/index.css, src/components/Hero.tsx, docs/change-log.md
- 2026-08-10T12:17:00+08:00 | [style] | Align mobile category filter buttons in clean 2-column grid (grid grid-cols-2 sm:flex) with 100% equal width and col-span-2 odd-item alignment in Projects and ArtGallery components | src/components/Projects.tsx, src/components/ArtGallery.tsx, docs/change-log.md
- 2026-08-10T12:19:00+08:00 | [feat] | Upgrade SciFiRobotAvatar with ornate Mecha AI design: multi-layer holographic data rings with cardinal ticks, orbiting quantum energy particle, 3D faceted crystal core, metallic armor contours, side thruster pods, and HUD crosshairs | src/components/SciFiRobotAvatar.tsx, docs/change-log.md
- 2026-08-10T12:20:00+08:00 | [style] | Harmonize and unify SciFiRobotAvatar geometry, chamfered 45-degree polygon cuts, stroke weights, side thruster ears, respirator gills, and chin collar plate into a 100% cohesive Mecha Android visual design system | src/components/SciFiRobotAvatar.tsx, docs/change-log.md
- 2026-08-10T12:22:00+08:00 | [style] | Harmonize Hero subtitle gradient color tokens with site-wide Cyberpunk HUD palette (#00f0ff/#0284c7 -> #38bdf8/#2563eb -> #c084fc/#7c3aed) and tune rightward flow speed to 8s linear infinite for elegant visual rhythm | src/index.css, src/components/Hero.tsx, docs/change-log.md
- 2026-08-10T23:50:00+08:00 | [feat] | Expand Hero side neon glow orbs into a global fixed ambient lighting system (GlobalAmbientNeon.tsx) with multi-node Left Cyan / Right Violet glowing energy orbs and organic breathing keyframes (animate-ambient-left/right); refine Hero focal glow orbs to harmonize with global backdrop across Light & Dark modes | src/components/GlobalAmbientNeon.tsx, src/App.tsx, src/components/Hero.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-10T23:51:00+08:00 | [style] | Upgrade global ambient neon lighting with dynamic multi-phase rhythmic breathing curves (ambient-rhythmic-breathe-left/right) and nested pulsing energy cores (animate-ambient-core-pulse) for rich, lifelike breathing light effects | src/components/GlobalAmbientNeon.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-10T23:52:00+08:00 | [style] | Re-architect global ambient neon lighting to 100% horizontally and vertically mirrored symmetrical layout (top 12%, mid 50%, bottom 12% on both left & right) and soften opacity tokens (outer 0.09-0.14, core 0.18-0.20, max peak 0.45) for subtle, non-distracting elegant breathing light ambiance | src/components/GlobalAmbientNeon.tsx, src/components/Hero.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-10T23:54:00+08:00 | [feat] | Calibrate 11s slow deep-breathing rhythm (ambient-slow-deep-breathe) and add real-time mouse proximity tracking (<320px) to GlobalAmbientNeon component: dynamic glow brightness boost, scale expansion, and interactive spotlight follower tracking cursor Y coordinate along viewport borders | src/components/GlobalAmbientNeon.tsx, src/index.css, docs/check-list.md, docs/change-log.md
- 2026-08-10T23:55:00+08:00 | [refactor] | Remove mouse interactive tracking and cursor follower spotlight nodes from GlobalAmbientNeon component; preserve pure, elegant 11s slow deep-breathing rhythm and symmetrical background ambient lighting | src/components/GlobalAmbientNeon.tsx, docs/check-list.md, docs/change-log.md



















































