/**
 * ============================================================================
 * 檔案名稱: FullStackCodeStreamBackground.tsx
 * 所屬模組: Presentation Layer (全端串流原始碼動態背景模組)
 * 責任描述: 負責於全站底層呈現雙向滾動之全端程式碼串流（左側 HTML、右側 TypeScript），體現極致全端工程氛圍。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合 requestAnimationFrame 物理滾動位移與動態速度阻尼調整。
 * 依賴關係: 依賴 ThemeContext 與 site-settings.json 之代碼滾動速度設定。
 * 邊界處理: 無縫循環高度重設防範溢出、分頁隱藏時自動凍結位移。
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeProps {
  isLight: boolean;
}

/* ════════════════════════════════════════════════════════════
   LEFT STREAM: MULTI-SCRIPT HTML REPOSITORY CODE MATRIX
   ════════════════════════════════════════════════════════════ */

// ── HTML Script 1: index.html (Main Entry, Meta & Font Preloads) ──
const HtmlScriptIndex: React.FC<ThemeProps> = ({ isLight }) => {
  const kwCol = isLight ? '#7c3aed' : '#c084fc';
  const tagCol = isLight ? '#0284c7' : '#00f0ff';
  const attrCol = isLight ? '#2563eb' : '#38bdf8';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-cyan-600 dark:text-cyan-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {/* [HTML-01/04] public/index.html — 單頁應用程式核心入口 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: kwCol }}>&lt;!DOCTYPE </span><span style={{ color: attrCol }}>html</span><span style={{ color: kwCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>02 </span><span style={{ color: tagCol }}>&lt;html </span><span style={{ color: attrCol }}>lang</span>=<span style={{ color: strCol }}>"zh-Hant" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"dark"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>03 </span><span className="ml-2" style={{ color: tagCol }}>&lt;head&gt;</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-4" style={{ color: tagCol }}>&lt;meta </span><span style={{ color: attrCol }}>charset</span>=<span style={{ color: strCol }}>"UTF-8" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-4" style={{ color: tagCol }}>&lt;meta </span><span style={{ color: attrCol }}>name</span>=<span style={{ color: strCol }}>"viewport" </span><span style={{ color: attrCol }}>content</span>=<span style={{ color: strCol }}>"width=device-width, initial-scale=1.0" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-4" style={{ color: tagCol }}>&lt;title&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>許哲誠 (HSU, CHE-CHENG) | 作品集</span><span style={{ color: tagCol }}>&lt;/title&gt;</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-4" style={{ color: tagCol }}>&lt;meta </span><span style={{ color: attrCol }}>name</span>=<span style={{ color: strCol }}>"description" </span><span style={{ color: attrCol }}>content</span>=<span style={{ color: strCol }}>"國立臺灣藝術大學多媒體動畫藝術學系碩士" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-4" style={{ color: tagCol }}>&lt;link </span><span style={{ color: attrCol }}>rel</span>=<span style={{ color: strCol }}>"preconnect" </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"https://fonts.googleapis.com" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-4" style={{ color: tagCol }}>&lt;link </span><span style={{ color: attrCol }}>rel</span>=<span style={{ color: strCol }}>"preconnect" </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"https://fonts.gstatic.com" </span><span style={{ color: attrCol }}>crossorigin </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-4" style={{ color: tagCol }}>&lt;link </span><span style={{ color: attrCol }}>rel</span>=<span style={{ color: strCol }}>"icon" </span><span style={{ color: attrCol }}>type</span>=<span style={{ color: strCol }}>"image/svg+xml" </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"/favicon.svg" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/head&gt;</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-2" style={{ color: tagCol }}>&lt;body </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"bg-gray-950 text-slate-100 antialiased"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-4" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>id</span>=<span style={{ color: strCol }}>"root"</span><span style={{ color: tagCol }}>&gt;&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-4" style={{ color: tagCol }}>&lt;script </span><span style={{ color: attrCol }}>type</span>=<span style={{ color: strCol }}>"module" </span><span style={{ color: attrCol }}>src</span>=<span style={{ color: strCol }}>"/src/main.tsx"</span><span style={{ color: tagCol }}>&gt;&lt;/script&gt;</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/body&gt;</span></div>
      <div><span style={{ color: numCol }}>16 </span><span style={{ color: tagCol }}>&lt;/html&gt;</span></div>
    </div>
  );
};

// ── HTML Script 2: Tactical HUD Navigation & Header Markup ──
const HtmlScriptNavbar: React.FC<ThemeProps> = ({ isLight }) => {
  const tagCol = isLight ? '#0284c7' : '#00f0ff';
  const attrCol = isLight ? '#2563eb' : '#38bdf8';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-cyan-600 dark:text-cyan-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {/* [HTML-02/04] src/components/Navbar.tsx — 科技抬頭導覽列 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: tagCol }}>&lt;header </span><span style={{ color: attrCol }}>id</span>=<span style={{ color: strCol }}>"tactical-hud-nav" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"fixed top-0 inset-x-0 z-40 backdrop-blur-md"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>02 </span><span className="ml-2" style={{ color: tagCol }}>&lt;nav </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>03 </span><span className="ml-4" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"flex items-center gap-3 font-hud"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-6" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"w-8 h-8 rounded border border-cyan-400/40"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-8" style={{ color: tagCol }}>&lt;svg </span><span style={{ color: attrCol }}>viewBox</span>=<span style={{ color: strCol }}>"0 0 24 24" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"w-5 h-5 text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-10" style={{ color: tagCol }}>&lt;path </span><span style={{ color: attrCol }}>d</span>=<span style={{ color: strCol }}>"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-8" style={{ color: tagCol }}>&lt;/svg&gt;</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-6" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-6" style={{ color: tagCol }}>&lt;span </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"text-cyan-400 font-black tracking-wider"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>JASON.DEV</span><span style={{ color: tagCol }}>&lt;/span&gt;</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-4" style={{ color: tagCol }}>&lt;ul </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"hidden md:flex items-center gap-6 font-tech text-sm"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-6" style={{ color: tagCol }}>&lt;li&gt;&lt;a </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"#home" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"hover:text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>HOME</span><span style={{ color: tagCol }}>&lt;/a&gt;&lt;/li&gt;</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-6" style={{ color: tagCol }}>&lt;li&gt;&lt;a </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"#about" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"hover:text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>ABOUT</span><span style={{ color: tagCol }}>&lt;/a&gt;&lt;/li&gt;</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-6" style={{ color: tagCol }}>&lt;li&gt;&lt;a </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"#skills" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"hover:text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>SKILLS</span><span style={{ color: tagCol }}>&lt;/a&gt;&lt;/li&gt;</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-6" style={{ color: tagCol }}>&lt;li&gt;&lt;a </span><span style={{ color: attrCol }}>href</span>=<span style={{ color: strCol }}>"#projects" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"hover:text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>PROJECTS</span><span style={{ color: tagCol }}>&lt;/a&gt;&lt;/li&gt;</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/ul&gt;</span></div>
      <div><span style={{ color: numCol }}>17 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/nav&gt;</span></div>
      <div><span style={{ color: numCol }}>18 </span><span style={{ color: tagCol }}>&lt;/header&gt;</span></div>
    </div>
  );
};

// ── HTML Script 3: Hero Mecha Robot & Holographic HUD Markup ──
const HtmlScriptHero: React.FC<ThemeProps> = ({ isLight }) => {
  const tagCol = isLight ? '#0284c7' : '#00f0ff';
  const attrCol = isLight ? '#2563eb' : '#38bdf8';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-cyan-600 dark:text-cyan-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {/* [HTML-03/04] src/components/Hero.tsx — 機甲主看板 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: tagCol }}>&lt;section </span><span style={{ color: attrCol }}>id</span>=<span style={{ color: strCol }}>"home" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"min-h-screen flex items-center justify-center relative"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>02 </span><span className="ml-2" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"max-w-5xl mx-auto px-6 text-center space-y-6 select-none"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>03 </span><span className="ml-4" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"relative w-48 h-48 mx-auto flex items-center justify-center"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-6" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"absolute inset-0 rounded-full border border-dashed border-cyan-400" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-6" style={{ color: tagCol }}>&lt;svg </span><span style={{ color: attrCol }}>viewBox</span>=<span style={{ color: strCol }}>"0 0 200 200" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"w-40 h-40 filter drop-shadow-[0_0_20px_#00f0ff]"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-8" style={{ color: tagCol }}>&lt;path </span><span style={{ color: attrCol }}>d</span>=<span style={{ color: strCol }}>"M45 80 L25 45 L52 60 L70 38 L100 28 Z" </span><span style={{ color: attrCol }}>fill</span>=<span style={{ color: strCol }}>"url(#helmetGrad)" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-6" style={{ color: tagCol }}>&lt;/svg&gt;</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-4" style={{ color: tagCol }}>&lt;h1 </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"text-4xl sm:text-6xl font-black font-hud tracking-tight"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>許哲誠 </span><span style={{ color: tagCol }}>&lt;span </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"text-cyan-400 font-tech"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>HSU, CHE-CHENG</span><span style={{ color: tagCol }}>&lt;/span&gt;</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/h1&gt;</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-4" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"flex flex-wrap justify-center gap-3 font-tech"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-6" style={{ color: tagCol }}>&lt;span </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"px-4 py-1.5 border border-cyan-500/30 text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>Interactive VR/AR</span><span style={{ color: tagCol }}>&lt;/span&gt;</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-6" style={{ color: tagCol }}>&lt;span </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"px-4 py-1.5 border border-purple-500/30 text-purple-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>Full-Stack Web</span><span style={{ color: tagCol }}>&lt;/span&gt;</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>17 </span><span style={{ color: tagCol }}>&lt;/section&gt;</span></div>
    </div>
  );
};

// ── HTML Script 4: Projects Showcase & Footer Tech Badges Markup ──
const HtmlScriptProjects: React.FC<ThemeProps> = ({ isLight }) => {
  const tagCol = isLight ? '#0284c7' : '#00f0ff';
  const attrCol = isLight ? '#2563eb' : '#38bdf8';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-cyan-600 dark:text-cyan-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        {/* [HTML-04/04] src/components/Projects.tsx — 專案作品展示與頁尾 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: tagCol }}>&lt;section </span><span style={{ color: attrCol }}>id</span>=<span style={{ color: strCol }}>"projects" </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"py-24 relative max-w-7xl mx-auto px-6"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>02 </span><span className="ml-2" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>03 </span><span className="ml-4" style={{ color: tagCol }}>&lt;article </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"border border-cyan-500/20 bg-slate-900/60 rounded-xl overflow-hidden"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-6" style={{ color: tagCol }}>&lt;div </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"relative aspect-video overflow-hidden"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-8" style={{ color: tagCol }}>&lt;img </span><span style={{ color: attrCol }}>src</span>=<span style={{ color: strCol }}>"/assets/images/project-vr.webp" </span><span style={{ color: attrCol }}>alt</span>=<span style={{ color: strCol }}>"VR Showcase" </span><span style={{ color: attrCol }}>loading</span>=<span style={{ color: strCol }}>"lazy" </span><span style={{ color: tagCol }}>/&gt;</span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-8" style={{ color: tagCol }}>&lt;span </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"absolute top-3 left-3 text-xs font-hud bg-cyan-950/80 text-cyan-400"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>VR / 3D UNITY</span><span style={{ color: tagCol }}>&lt;/span&gt;</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-6" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-4" style={{ color: tagCol }}>&lt;/article&gt;</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/div&gt;</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-2" style={{ color: tagCol }}>&lt;footer </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"w-full border-t border-cyan-500/20 py-10 text-center font-tech"</span><span style={{ color: tagCol }}>&gt;</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-4" style={{ color: tagCol }}>&lt;p </span><span style={{ color: attrCol }}>class</span>=<span style={{ color: strCol }}>"text-slate-400 text-sm"</span><span style={{ color: tagCol }}>&gt;</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>© 2026-08-20 許哲誠 版權所有 HSU, CHE-CHENG ALL RIGHTS RESERVED</span><span style={{ color: tagCol }}>&lt;/p&gt;</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-2" style={{ color: tagCol }}>&lt;/footer&gt;</span></div>
      <div><span style={{ color: numCol }}>13 </span><span style={{ color: tagCol }}>&lt;/section&gt;</span></div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   RIGHT STREAM: MULTI-SCRIPT TYPESCRIPT (TS) CODE MATRIX
   ════════════════════════════════════════════════════════════ */

// ── TS Script 1: src/App.tsx (Core Application Orchestration) ──
const TsScriptApp: React.FC<ThemeProps> = ({ isLight }) => {
  const kwCol = isLight ? '#7c3aed' : '#c084fc';
  const fnCol = isLight ? '#2563eb' : '#60a5fa';
  const typeCol = isLight ? '#d97706' : '#fbbf24';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-purple-600 dark:text-purple-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {/* [TS-01/04] src/App.tsx — 核心架構調度器 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: kwCol }}>import </span><span style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>React, {'{'} useState, useEffect {'}'}</span><span style={{ color: kwCol }}> from </span><span style={{ color: strCol }}>'react'</span>;</div>
      <div><span style={{ color: numCol }}>02 </span><span style={{ color: kwCol }}>import </span><span style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>{'{'} useTheme {'}'}</span><span style={{ color: kwCol }}> from </span><span style={{ color: strCol }}>'./context/ThemeContext'</span>;</div>
      <div><span style={{ color: numCol }}>03 </span><span style={{ color: kwCol }}>import </span><span style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>{'{'} toggleBGMAudio, setBGMVolume {'}'}</span><span style={{ color: kwCol }}> from </span><span style={{ color: strCol }}>'./utils/bgmSynth'</span>;</div>
      <div><span style={{ color: numCol }}>04 </span><span style={{ color: kwCol }}>import </span><span style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>{'{'} CustomCursor {'}'}</span><span style={{ color: kwCol }}> from </span><span style={{ color: strCol }}>'./components/CustomCursor'</span>;</div>
      <div><span style={{ color: numCol }}>05 </span></div>
      <div><span style={{ color: numCol }}>06 </span><span style={{ color: kwCol }}>export const </span><span style={{ color: fnCol }}>AppContent</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: React.</span><span style={{ color: typeCol }}>FC </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= () =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'} theme {'}'} = </span><span style={{ color: fnCol }}>useTheme</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>[soundPlaying, setSoundPlaying] = </span><span style={{ color: fnCol }}>useState</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: typeCol }}>boolean</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;(</span><span style={{ color: kwCol }}>false</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>);</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>[siteEntered, setSiteEntered] = </span><span style={{ color: fnCol }}>useState</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: typeCol }}>boolean</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;(</span><span style={{ color: kwCol }}>false</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>);</span></div>
      <div><span style={{ color: numCol }}>10 </span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-3" style={{ color: fnCol }}>useEffect</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>() =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-6" style={{ color: kwCol }}>if </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(!siteEntered) {'{'}</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-9" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>document.body.style.overflow = </span><span style={{ color: strCol }}>'hidden'</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'} </span><span style={{ color: kwCol }}>else </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'}</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-9" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>document.body.style.overflow = </span><span style={{ color: strCol }}>''</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
      <div><span style={{ color: numCol }}>17 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}, [siteEntered]);</span></div>
      <div><span style={{ color: numCol }}>18 </span></div>
      <div><span style={{ color: numCol }}>19 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: fnCol }}>handleToggleSound </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= (): </span><span style={{ color: typeCol }}>void </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>=&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>20 </span><span className="ml-6" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>nowPlaying = </span><span style={{ color: fnCol }}>toggleBGMAudio</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(</span><span style={{ color: typeCol }}>0.3</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>);</span></div>
      <div><span style={{ color: numCol }}>21 </span><span className="ml-6" style={{ color: fnCol }}>setSoundPlaying</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(nowPlaying);</span></div>
      <div><span style={{ color: numCol }}>22 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'};</span></div>
      <div><span style={{ color: numCol }}>23 </span></div>
      <div><span style={{ color: numCol }}>24 </span><span className="ml-3" style={{ color: kwCol }}>return </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: fnCol }}>div </span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>className</span>=<span style={{ color: strCol }}>"min-h-screen"</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;&lt;</span><span style={{ color: fnCol }}>CustomCursor </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>/&gt;&lt;/</span><span style={{ color: fnCol }}>div</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;;</span></div>
      <div><span style={{ color: numCol }}>25 </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'};</span></div>
    </div>
  );
};

// ── TS Script 2: src/utils/bgmSynth.ts (Web Audio Synthesizer) ──
const TsScriptSynth: React.FC<ThemeProps> = ({ isLight }) => {
  const kwCol = isLight ? '#7c3aed' : '#c084fc';
  const fnCol = isLight ? '#2563eb' : '#60a5fa';
  const typeCol = isLight ? '#d97706' : '#fbbf24';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-purple-600 dark:text-purple-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {/* [TS-02/04] src/utils/bgmSynth.ts — 賽博氛圍音樂合成器 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: kwCol }}>class </span><span style={{ color: typeCol }}>CyberpunkSynthEngine </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'}</span></div>
      <div><span style={{ color: numCol }}>02 </span><span className="ml-3" style={{ color: kwCol }}>private </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>audioCtx: </span><span style={{ color: typeCol }}>AudioContext </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>| </span><span style={{ color: kwCol }}>null </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= </span><span style={{ color: kwCol }}>null</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>03 </span><span className="ml-3" style={{ color: kwCol }}>private </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>masterGain: </span><span style={{ color: typeCol }}>GainNode </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>| </span><span style={{ color: kwCol }}>null </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= </span><span style={{ color: kwCol }}>null</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-3" style={{ color: kwCol }}>private readonly </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>frequencies: </span><span style={{ color: typeCol }}>number</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>[] = [</span><span style={{ color: typeCol }}>110</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, </span><span style={{ color: typeCol }}>164.81</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, </span><span style={{ color: typeCol }}>220</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, </span><span style={{ color: typeCol }}>329.63</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>];</span></div>
      <div><span style={{ color: numCol }}>05 </span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-3" style={{ color: kwCol }}>public </span><span style={{ color: fnCol }}>init</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(): </span><span style={{ color: typeCol }}>void </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'}</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-6" style={{ color: kwCol }}>if </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(!</span><span style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx) {'{'}</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-9" style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx = </span><span style={{ color: kwCol }}>new </span><span style={{ color: typeCol }}>AudioContext</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-9" style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.masterGain = </span><span style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx.</span><span style={{ color: fnCol }}>createGain</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-9" style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.masterGain.</span><span style={{ color: fnCol }}>connect</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(</span><span style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx.destination);</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
      <div><span style={{ color: numCol }}>13 </span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-3" style={{ color: kwCol }}>public </span><span style={{ color: fnCol }}>startSynthLoop</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(): </span><span style={{ color: typeCol }}>boolean </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'}</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-6" style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.</span><span style={{ color: fnCol }}>init</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-6" style={{ color: kwCol }}>if </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(</span><span style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx?.state === </span><span style={{ color: strCol }}>'suspended'</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>) </span><span style={{ color: kwCol }}>this</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>.audioCtx.</span><span style={{ color: fnCol }}>resume</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>17 </span><span className="ml-6" style={{ color: kwCol }}>return true</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>18 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
      <div><span style={{ color: numCol }}>19 </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
    </div>
  );
};

// ── TS Script 3: src/components/SciFiRobotAvatar.tsx (Mecha Logic) ──
const TsScriptAvatar: React.FC<ThemeProps> = ({ isLight }) => {
  const kwCol = isLight ? '#7c3aed' : '#c084fc';
  const fnCol = isLight ? '#2563eb' : '#60a5fa';
  const typeCol = isLight ? '#d97706' : '#fbbf24';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-purple-600 dark:text-purple-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {/* [TS-03/04] src/components/SciFiRobotAvatar.tsx — 即時眼球注視追蹤 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: kwCol }}>interface </span><span style={{ color: typeCol }}>EyeOffset </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'} </span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>x</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: </span><span style={{ color: typeCol }}>number</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>; </span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>y</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: </span><span style={{ color: typeCol }}>number</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>; {'}'}</span></div>
      <div><span style={{ color: numCol }}>02 </span></div>
      <div><span style={{ color: numCol }}>03 </span><span style={{ color: kwCol }}>export const </span><span style={{ color: fnCol }}>useRobotEyeTracking </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= () =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>[eyeOffset, setEyeOffset] = </span><span style={{ color: fnCol }}>useState</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: typeCol }}>EyeOffset</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;({'{'} x: </span><span style={{ color: typeCol }}>0</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, y: </span><span style={{ color: typeCol }}>0</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}> {'}'});</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>centerPosRef = </span><span style={{ color: fnCol }}>useRef</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>({'{'} x: </span><span style={{ color: typeCol }}>0</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, y: </span><span style={{ color: typeCol }}>0</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}> {'}'});</span></div>
      <div><span style={{ color: numCol }}>06 </span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-3" style={{ color: fnCol }}>useEffect</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>() =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-6" style={{ color: kwCol }}>const </span><span style={{ color: fnCol }}>handlePointer </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= (</span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>cx</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: </span><span style={{ color: typeCol }}>number</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, </span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>cy</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: </span><span style={{ color: typeCol }}>number</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>) =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-9" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>deltaX = cx - centerPosRef.current.x;</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-9" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>deltaY = cy - centerPosRef.current.y;</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-9" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>dist = Math.</span><span style={{ color: fnCol }}>sqrt</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(deltaX * deltaX + deltaY * deltaY) || </span><span style={{ color: typeCol }}>1</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-9" style={{ color: fnCol }}>setEyeOffset</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>({'{'}</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-12" style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>x</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: (deltaX / dist) * Math.</span><span style={{ color: fnCol }}>min</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(Math.</span><span style={{ color: fnCol }}>abs</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(deltaX * </span><span style={{ color: typeCol }}>0.05</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>), </span><span style={{ color: typeCol }}>7</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>),</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-12" style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>y</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>: (deltaY / dist) * Math.</span><span style={{ color: fnCol }}>min</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(Math.</span><span style={{ color: fnCol }}>abs</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(deltaY * </span><span style={{ color: typeCol }}>0.05</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>), </span><span style={{ color: typeCol }}>7</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>),</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-9" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'});</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'};</span></div>
      <div><span style={{ color: numCol }}>17 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>window.</span><span style={{ color: fnCol }}>addEventListener</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(</span><span style={{ color: isLight ? '#047857' : '#34d399' }}>'mousemove'</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>, (e) =&gt; </span><span style={{ color: fnCol }}>handlePointer</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(e.clientX, e.clientY), {'{'} passive: </span><span style={{ color: kwCol }}>true </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'});</span></div>
      <div><span style={{ color: numCol }}>18 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}, []);</span></div>
      <div><span style={{ color: numCol }}>19 </span><span className="ml-3" style={{ color: kwCol }}>return </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'{'} eyeOffset {'}'};</span></div>
      <div><span style={{ color: numCol }}>20 </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'};</span></div>
    </div>
  );
};

// ── TS Script 4: src/hooks/useScrollReveal.ts (Scroll Observer) ──
const TsScriptScroll: React.FC<ThemeProps> = ({ isLight }) => {
  const kwCol = isLight ? '#7c3aed' : '#c084fc';
  const fnCol = isLight ? '#2563eb' : '#60a5fa';
  const typeCol = isLight ? '#d97706' : '#fbbf24';
  const strCol = isLight ? '#047857' : '#34d399';
  const numCol = '#64748b';

  return (
    <div className="space-y-1 py-4 shrink-0">
      <div className="text-[11px] font-bold font-hud tracking-widest text-purple-600 dark:text-purple-400 pb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {/* [TS-04/04] src/hooks/useScrollReveal.ts — 視窗滾動揭露監聽 */}
      </div>
      <div><span style={{ color: numCol }}>01 </span><span style={{ color: kwCol }}>export const </span><span style={{ color: fnCol }}>useScrollReveal </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= (</span><span style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>threshold </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>= </span><span style={{ color: typeCol }}>0.05</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>): React.</span><span style={{ color: typeCol }}>RefObject</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: typeCol }}>HTMLDivElement </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>| </span><span style={{ color: kwCol }}>null</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt; =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>02 </span><span className="ml-3" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>domRef = </span><span style={{ color: fnCol }}>useRef</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&lt;</span><span style={{ color: typeCol }}>HTMLDivElement </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>| </span><span style={{ color: kwCol }}>null</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>&gt;(</span><span style={{ color: kwCol }}>null</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>);</span></div>
      <div><span style={{ color: numCol }}>03 </span></div>
      <div><span style={{ color: numCol }}>04 </span><span className="ml-3" style={{ color: fnCol }}>useEffect</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>() =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>05 </span><span className="ml-6" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>el = domRef.current;</span></div>
      <div><span style={{ color: numCol }}>06 </span><span className="ml-6" style={{ color: kwCol }}>if </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(!el) </span><span style={{ color: kwCol }}>return</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>;</span></div>
      <div><span style={{ color: numCol }}>07 </span><span className="ml-6" style={{ color: kwCol }}>const </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>observer = </span><span style={{ color: kwCol }}>new </span><span style={{ color: typeCol }}>IntersectionObserver</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>((entries) =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>08 </span><span className="ml-9" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>entries.</span><span style={{ color: fnCol }}>forEach</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>((entry) =&gt; {'{'}</span></div>
      <div><span style={{ color: numCol }}>09 </span><span className="ml-12" style={{ color: kwCol }}>if </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(entry.isIntersecting) {'{'}</span></div>
      <div><span style={{ color: numCol }}>10 </span><span className="ml-15" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>entry.target.classList.</span><span style={{ color: fnCol }}>add</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(</span><span style={{ color: strCol }}>'is-revealed'</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>);</span></div>
      <div><span style={{ color: numCol }}>11 </span><span className="ml-15" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>observer.</span><span style={{ color: fnCol }}>unobserve</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(entry.target);</span></div>
      <div><span style={{ color: numCol }}>12 </span><span className="ml-12" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}</span></div>
      <div><span style={{ color: numCol }}>13 </span><span className="ml-9" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'});</span></div>
      <div><span style={{ color: numCol }}>14 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}, {'{'} threshold, rootMargin: </span><span style={{ color: strCol }}>'0px 0px -20px 0px' </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'});</span></div>
      <div><span style={{ color: numCol }}>15 </span><span className="ml-6" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>observer.</span><span style={{ color: fnCol }}>observe</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>(el);</span></div>
      <div><span style={{ color: numCol }}>16 </span><span className="ml-6" style={{ color: kwCol }}>return </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>() =&gt; observer.</span><span style={{ color: fnCol }}>disconnect</span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>();</span></div>
      <div><span style={{ color: numCol }}>17 </span><span className="ml-3" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'}, [threshold]);</span></div>
      <div><span style={{ color: numCol }}>18 </span><span className="ml-3" style={{ color: kwCol }}>return </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>domRef;</span></div>
      <div><span style={{ color: numCol }}>19 </span><span style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>{'}'};</span></div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   SEAMLESS SCROLL HOOK — RAF-driven, pixel-perfect loop
   Measures Block A height at runtime, resets offset modulo that
   height so the jump is always invisible (Block B == Block A).
   ════════════════════════════════════════════════════════════ */

import defaultSiteSettings from '../data/site-settings.json';

function useSeamlessScroll(speed: number, initialOffset = 0) {
  const outerRef = useRef<HTMLDivElement>(null);
  const blockARef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialOffset);
  const rafRef   = useRef<number>(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const loopHeightRef = useRef<number>(0);

  // 透過 ResizeObserver 取得亞像素級精準高度，避免每幀強制 Reflow 造成卡頓
  useEffect(() => {
    const blockA = blockARef.current;
    if (!blockA) return;

    const updateHeight = () => {
      const rect = blockA.getBoundingClientRect();
      if (rect.height > 0) {
        loopHeightRef.current = rect.height;
      }
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(blockA);
    return () => ro.disconnect();
  }, []);

  const tick = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const loopHeight = loopHeightRef.current;
    if (loopHeight <= 0) {
      if (blockARef.current) {
        const rect = blockARef.current.getBoundingClientRect();
        if (rect.height > 0) loopHeightRef.current = rect.height;
      }
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    offsetRef.current += speedRef.current;
    // 循環高度重設 — 亞像素精度精確取模，徹底消除到底循環點的跳動與卡頓
    if (offsetRef.current >= loopHeight) {
      offsetRef.current = offsetRef.current % loopHeight;
    }
    // 套用 GPU 硬體加速合成之 transform 樣式 — 零重排 (Reflow) 負擔
    outer.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(0, ${-initialOffset}px, 0)`;
      }
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, initialOffset]);

  return { outerRef, blockARef };
}

/* ════════════════════════════════════════════════════════════
   背景核心組件 (雙串流：左側 HTML 庫 / 右側 TypeScript 服務層)
   ════════════════════════════════════════════════════════════ */

export const FullStackCodeStreamBackground: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  /**
   * TODO: [後端端點對接] 取得使用者模式背景代碼流動畫速率乘數
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/site-settings/animation
   * 3. 請求參數: 無
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: { speedMultiplier: number } }
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，採用作品集預設速率 (1.0)，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('portfolio_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.codeAnimationSpeed === 'number') {
          return parsed.codeAnimationSpeed;
        }
      }
    } catch {
      // 讀取失敗回退至預設值
    }
    return (defaultSiteSettings as unknown as { codeAnimationSpeed?: number }).codeAnimationSpeed ?? 1.0;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolio_site_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.codeAnimationSpeed === 'number') {
            setSpeedMultiplier(parsed.codeAnimationSpeed);
            return;
          }
        }
      } catch {
        // 解析異常回退
      }
      setSpeedMultiplier((defaultSiteSettings as unknown as { codeAnimationSpeed?: number }).codeAnimationSpeed ?? 1.0);
    };

    window.addEventListener('portfolio_site_settings_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_site_settings_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 左側串流：基準速率 0.28px/幀 乘上速率乘數
  const left  = useSeamlessScroll(0.28 * speedMultiplier, 0);
  // 右側串流：基準速率 0.22px/幀 搭配初始偏移量產生錯位視覺層次
  const right = useSeamlessScroll(0.22 * speedMultiplier, 320);

  if (!isDesktop) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none flex justify-between px-2 sm:px-6 lg:px-10 xl:px-14 overflow-hidden"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-hidden="true"
    >
      {/* ── 左側串流：多腳本 HTML 程式碼流 ── */}
      <div className="hidden lg:block w-[320px] xl:w-[420px] 2xl:w-[490px] opacity-20 dark:opacity-25 overflow-hidden pointer-events-none select-none font-mono text-[11px] leading-relaxed">
        {/* requestAnimationFrame 驅動之外層容器（套用 GPU 硬體加速 transform） */}
        <div ref={left.outerRef} style={{ willChange: 'transform' }}>
          {/* 區塊 A — 測量循環高度之基準區塊 */}
          <div ref={left.blockARef}>
            <HtmlScriptIndex isLight={isLight} />
            <HtmlScriptNavbar isLight={isLight} />
            <HtmlScriptHero isLight={isLight} />
            <HtmlScriptProjects isLight={isLight} />
          </div>
          {/* 區塊 B — 無縫循環銜接副本 */}
          <div aria-hidden="true">
            <HtmlScriptIndex isLight={isLight} />
            <HtmlScriptNavbar isLight={isLight} />
            <HtmlScriptHero isLight={isLight} />
            <HtmlScriptProjects isLight={isLight} />
          </div>
        </div>
      </div>

      {/* ── 右側串流：多腳本 TypeScript 服務程式碼流 ── */}
      <div className="hidden lg:block w-[320px] xl:w-[420px] 2xl:w-[490px] opacity-20 dark:opacity-25 overflow-hidden pointer-events-none select-none font-mono text-[11px] leading-relaxed">
        <div ref={right.outerRef} style={{ willChange: 'transform' }}>
          {/* 區塊 A */}
          <div ref={right.blockARef}>
            <TsScriptApp isLight={isLight} />
            <TsScriptSynth isLight={isLight} />
            <TsScriptAvatar isLight={isLight} />
            <TsScriptScroll isLight={isLight} />
          </div>
          {/* 區塊 B */}
          <div aria-hidden="true">
            <TsScriptApp isLight={isLight} />
            <TsScriptSynth isLight={isLight} />
            <TsScriptAvatar isLight={isLight} />
            <TsScriptScroll isLight={isLight} />
          </div>
        </div>
      </div>
    </div>
  );
});

FullStackCodeStreamBackground.displayName = 'FullStackCodeStreamBackground';

export default FullStackCodeStreamBackground;
