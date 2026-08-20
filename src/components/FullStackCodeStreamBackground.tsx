import React, { useState, useEffect } from 'react';
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
        {/* [HTML-01/04] public/index.html — Core SPA Entrypoint */}
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
        {/* [HTML-02/04] src/components/Navbar.tsx — HUD Navigation */}
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
        {/* [HTML-03/04] src/components/Hero.tsx — Mecha HUD Hero */}
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
        {/* [HTML-04/04] src/components/Projects.tsx — Showcase & Footer */}
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
        {/* [TS-01/04] src/App.tsx — Core Orchestrator */}
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
        {/* [TS-02/04] src/utils/bgmSynth.ts — Cyberpunk Synth */}
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
        {/* [TS-03/04] src/components/SciFiRobotAvatar.tsx — Eye Tracking */}
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
        {/* [TS-04/04] src/hooks/useScrollReveal.ts — Scroll Observer */}
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
   MAIN BACKGROUND COMPONENT (DUAL STREAM: LEFT HTML / RIGHT TS)
   ════════════════════════════════════════════════════════════ */

export const FullStackCodeStreamBackground: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none flex justify-between px-2 sm:px-6 lg:px-10 xl:px-14 overflow-hidden"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-hidden="true"
    >
      {/* ── Left Column: Multi-Script HTML Repository Stream ── */}
      <div className="hidden lg:flex flex-col w-[320px] xl:w-[420px] 2xl:w-[490px] opacity-20 dark:opacity-25 light:opacity-20 pointer-events-none select-none animate-code-stream font-mono text-[11px] leading-relaxed">
        {/* Block A */}
        <div className="flex flex-col shrink-0">
          <HtmlScriptIndex isLight={isLight} />
          <HtmlScriptNavbar isLight={isLight} />
          <HtmlScriptHero isLight={isLight} />
          <HtmlScriptProjects isLight={isLight} />
        </div>
        {/* Block B (Exact mirror duplicate for seamless 60/120fps infinite loop) */}
        <div className="flex flex-col shrink-0" aria-hidden="true">
          <HtmlScriptIndex isLight={isLight} />
          <HtmlScriptNavbar isLight={isLight} />
          <HtmlScriptHero isLight={isLight} />
          <HtmlScriptProjects isLight={isLight} />
        </div>
      </div>

      {/* ── Right Column: Multi-Script TypeScript (TS) Repository Stream ── */}
      <div
        className="hidden lg:flex flex-col w-[320px] xl:w-[420px] 2xl:w-[490px] opacity-20 dark:opacity-25 light:opacity-20 pointer-events-none select-none animate-code-stream font-mono text-[11px] leading-relaxed"
        style={{ animationDelay: '-22s', animationDuration: '48s' }}
      >
        {/* Block A */}
        <div className="flex flex-col shrink-0">
          <TsScriptApp isLight={isLight} />
          <TsScriptSynth isLight={isLight} />
          <TsScriptAvatar isLight={isLight} />
          <TsScriptScroll isLight={isLight} />
        </div>
        {/* Block B (Exact mirror duplicate for seamless 60/120fps infinite loop) */}
        <div className="flex flex-col shrink-0" aria-hidden="true">
          <TsScriptApp isLight={isLight} />
          <TsScriptSynth isLight={isLight} />
          <TsScriptAvatar isLight={isLight} />
          <TsScriptScroll isLight={isLight} />
        </div>
      </div>
    </div>
  );
});

FullStackCodeStreamBackground.displayName = 'FullStackCodeStreamBackground';

export default FullStackCodeStreamBackground;
