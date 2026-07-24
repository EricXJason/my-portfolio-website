import React from 'react';
import { useLang } from '../context/LangContext';
import {
  Gamepad2, Globe, Palette,
  // Game dev icons
  Cpu, Layers, Zap, Glasses, Wifi,
  // Fullstack icons
  Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge,
  // Multimedia icons
  PenTool, Bot, FileText, Film, Box,
} from 'lucide-react';

/* ── Icon size & color per category ── */
const GAME_COL   = '#22d3ee';  // cyan
const WEB_COL    = '#c084fc';  // purple
const MEDIA_COL  = '#34d399';  // emerald

const itemIcon = (IconComp, color) => (
  <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
    style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}>
    <IconComp size={15} style={{ color }} />
  </span>
);

// Exact Skills Data Sourced 100% Verbatim from Data.txt Lines 42-80
const rawSkillsData = {
  zh: [
    {
      category: '【互動遊戲開發】',
      catColor: GAME_COL,
      catIcon: Gamepad2,
      items: [
        { icon: itemIcon(Cpu,     GAME_COL), label: '遊戲引擎',       content: 'Unity ( C#) / Unreal Engine ( Blueprints )' },
        { icon: itemIcon(Layers,  GAME_COL), label: '設計模式與架構', content: 'Singleton / Object Pool / Registry / Observer Pattern / Event-based Architecture' },
        { icon: itemIcon(Zap,     GAME_COL), label: '核心技術',       content: 'URP / Shader Graph / Addressables / Editor Scripting ( Inspector, EditorWindow ) / Saving System / AI Navigation / Cinemachine / DOTween / Timeline' },
        { icon: itemIcon(Glasses, GAME_COL), label: 'XR 實境開發',   content: 'Vuforia / Meta SDK / XR Interaction Toolkit' },
        { icon: itemIcon(Wifi,    GAME_COL), label: '多人連線開發',   content: 'Netcode / Photon Pun' },
      ]
    },
    {
      category: '【全端開發】',
      catColor: WEB_COL,
      catIcon: Globe,
      items: [
        { icon: itemIcon(Code2,    WEB_COL), label: '後端程式語言',     content: 'Java / Python' },
        { icon: itemIcon(Server,   WEB_COL), label: '後端框架與技術',   content: 'Spring Boot / Hibernate / Flask / Django' },
        { icon: itemIcon(Monitor,  WEB_COL), label: '前端程式語言',     content: 'HTML / CSS / JavaScript / TypeScript' },
        { icon: itemIcon(Layout,   WEB_COL), label: '前端框架與樣式',   content: 'React / Angular / Sass / Tailwind / Bootstrap' },
        { icon: itemIcon(Database, WEB_COL), label: '資料庫與服務',     content: 'MySQL / PostgreSQL' },
        { icon: itemIcon(Cloud,    WEB_COL), label: '雲端服務',         content: 'AWS / GCP' },
        { icon: itemIcon(Wrench,   WEB_COL), label: '開發與建構工具',   content: 'Git / Docker / Vite' },
        { icon: itemIcon(GitMerge, WEB_COL), label: 'CI/CD 自動化',    content: 'GitHub Actions' },
      ]
    },
    {
      category: '【多媒體設計】',
      catColor: MEDIA_COL,
      catIcon: Palette,
      items: [
        { icon: itemIcon(Figma,    MEDIA_COL), label: '視覺設計與 UI/UX', content: 'Figma / Canva / Photoshop / Illustrator' },
        { icon: itemIcon(Bot,      MEDIA_COL), label: 'AI 內容創作',       content: 'ChatGPT / Gemini / ComfyUI / Suno' },
        { icon: itemIcon(FileText, MEDIA_COL), label: '流程圖設計與文書',  content: 'draw.io / Word / Excel / PowerPoint' },
        { icon: itemIcon(Film,     MEDIA_COL), label: '影片剪輯與後製',    content: 'Premiere / DaVinci' },
        { icon: itemIcon(Box,      MEDIA_COL), label: '3D 建模與材質',     content: 'AutoCAD / Blender / Maya / 3dsMax / RizomUV / Zbrush / Substance Painter' },
      ]
    }
  ],
  en: [
    {
      category: 'Interactive Game Dev',
      catColor: GAME_COL,
      catIcon: Gamepad2,
      items: [
        { icon: itemIcon(Cpu,     GAME_COL), label: 'Game Engines',          content: 'Unity ( C#) / Unreal Engine ( Blueprints )' },
        { icon: itemIcon(Layers,  GAME_COL), label: 'Design Patterns',       content: 'Singleton / Object Pool / Registry / Observer Pattern / Event-based Architecture' },
        { icon: itemIcon(Zap,     GAME_COL), label: 'Core Tech',             content: 'URP / Shader Graph / Addressables / Editor Scripting ( Inspector, EditorWindow ) / Saving System / AI Navigation / Cinemachine / DOTween / Timeline' },
        { icon: itemIcon(Glasses, GAME_COL), label: 'XR Development',        content: 'Vuforia / Meta SDK / XR Interaction Toolkit' },
        { icon: itemIcon(Wifi,    GAME_COL), label: 'Multiplayer Networking', content: 'Netcode / Photon Pun' },
      ]
    },
    {
      category: 'Fullstack Web Dev',
      catColor: WEB_COL,
      catIcon: Globe,
      items: [
        { icon: itemIcon(Code2,    WEB_COL), label: 'Backend Languages',  content: 'Java / Python' },
        { icon: itemIcon(Server,   WEB_COL), label: 'Backend Frameworks', content: 'Spring Boot / Hibernate / Flask / Django' },
        { icon: itemIcon(Monitor,  WEB_COL), label: 'Frontend Languages', content: 'HTML / CSS / JavaScript / TypeScript' },
        { icon: itemIcon(Layout,   WEB_COL), label: 'Frontend Frameworks',content: 'React / Angular / Sass / Tailwind / Bootstrap' },
        { icon: itemIcon(Database, WEB_COL), label: 'Databases',          content: 'MySQL / PostgreSQL' },
        { icon: itemIcon(Cloud,    WEB_COL), label: 'Cloud Services',     content: 'AWS / GCP' },
        { icon: itemIcon(Wrench,   WEB_COL), label: 'Dev & Build Tools',  content: 'Git / Docker / Vite' },
        { icon: itemIcon(GitMerge, WEB_COL), label: 'CI/CD Automation',   content: 'GitHub Actions' },
      ]
    },
    {
      category: 'Multimedia Design',
      catColor: MEDIA_COL,
      catIcon: Palette,
      items: [
        { icon: itemIcon(PenTool,   MEDIA_COL), label: 'Visual Design & UI/UX',    content: 'Figma / Canva / Photoshop / Illustrator' },
        { icon: itemIcon(Bot,      MEDIA_COL), label: 'AIGC Creation',            content: 'ChatGPT / Gemini / ComfyUI / Suno' },
        { icon: itemIcon(FileText, MEDIA_COL), label: 'Flowcharts & Office',      content: 'draw.io / Word / Excel / PowerPoint' },
        { icon: itemIcon(Film,     MEDIA_COL), label: 'Video Post-Production',    content: 'Premiere / DaVinci' },
        { icon: itemIcon(Box,      MEDIA_COL), label: '3D Modeling & Materials',  content: 'AutoCAD / Blender / Maya / 3dsMax / RizomUV / Zbrush / Substance Painter' },
      ]
    }
  ]
};

export const Skills = () => {
  const { t, lang } = useLang();
  const currentSkills = rawSkillsData[lang] ?? rawSkillsData.zh;

  return (
    <section id="skills" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          {lang === 'en' && (
            <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block mb-1">
              {t('skills_subtitle')}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('skills_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
            {t('skills_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Skill Categories */}
        <div className="space-y-10 max-w-5xl mx-auto">
          {currentSkills.map((cat, idx) => {
            const CatIcon = cat.catIcon;
            return (
              <div key={idx} className="rounded-2xl glass-card overflow-hidden shadow-md border border-[var(--border-color)]">

                {/* Category Header bar */}
                <div
                  className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-color)]"
                  style={{ borderLeftWidth: '4px', borderLeftColor: cat.catColor }}
                >
                  <div className="p-2.5 rounded-xl cat-icon-bg border">
                    <CatIcon size={22} style={{ color: cat.catColor }} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
                    {cat.category}
                  </h3>
                </div>

                {/* Skill Item Rows */}
                <div className="p-4 sm:p-6 space-y-3">
                  {cat.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="skill-row-bg rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 border"
                    >
                      {/* Icon + Label */}
                      <div className="flex items-center gap-2.5 shrink-0 sm:w-[220px]">
                        {item.icon}
                        <span className="font-bold text-sm text-[var(--text-main)]">
                          {item.label}
                        </span>
                      </div>
                      {/* Divider visible on desktop */}
                      <div className="hidden sm:block w-px h-5 shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />
                      {/* Content */}
                      <span className="text-sm text-[var(--text-sub)] font-medium leading-relaxed">
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
