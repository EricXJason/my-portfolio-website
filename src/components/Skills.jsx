import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Gamepad2, Globe, Palette, Cpu, Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge, PenTool, Bot, FileText, Film, Box } from 'lucide-react';
import skillsData from '../data/skills.json';

import { getAssetUrl } from '../utils/assetPath';

/* ── Category icon map ── */
const CAT_ICON_MAP = {
  game:  Gamepad2,
  web:   Globe,
  media: Palette,
};

/* ── Multimedia Design Logo Map (User Provided & Normalized) ── */
const getMediaTechLogo = (sub, isLight) => {
  const s = sub.toLowerCase();

  // Dark & Light Mode Theme-aware variants for monochrome logos
  if (s === 'chatgpt') return getAssetUrl(isLight ? '/assets/logos/chatgpt.png' : '/assets/logos/chatgpt-dark.png');
  if (s === 'zbrush') return getAssetUrl(isLight ? '/assets/logos/zbrush.png' : '/assets/logos/zbrush-dark.png');
  if (s === 'suno') return getAssetUrl(isLight ? '/assets/logos/suno.png' : '/assets/logos/suno-dark.png');

  // Universal Normalized 128x128 1:1 Square Logos
  const mediaLogoMap = {
    'figma': getAssetUrl('/assets/logos/figma.png'),
    'canva': getAssetUrl('/assets/logos/canva.png'),
    'photoshop': getAssetUrl('/assets/logos/photoshop.png'),
    'illustrator': getAssetUrl('/assets/logos/illustrator.png'),
    'gemini': getAssetUrl('/assets/logos/gemini.png'),
    'comfyui': getAssetUrl('/assets/logos/comfyui.png'),
    'draw.io': getAssetUrl('/assets/logos/drawio.png'),
    'word': getAssetUrl('/assets/logos/word.png'),
    'excel': getAssetUrl('/assets/logos/excel.png'),
    'powerpoint': getAssetUrl('/assets/logos/powerpoint.png'),
    'premiere': getAssetUrl('/assets/logos/premiere.png'),
    'davinci': getAssetUrl('/assets/logos/davinci.png'),
    'autocad': getAssetUrl('/assets/logos/autocad.png'),
    'blender': getAssetUrl('/assets/logos/blender.png'),
    'maya': getAssetUrl('/assets/logos/maya.png'),
    '3dsmax': getAssetUrl('/assets/logos/3dsmax.png'),
    'rizomuv': getAssetUrl('/assets/logos/rizomuv.png'),
    'substance painter': getAssetUrl('/assets/logos/substance-painter.png'),
  };

  return mediaLogoMap[s] ?? null;
};

/* ── Sub-row label icon map ── */
const getLabelIcon = (label, catColor) => {
  const l = label.toLowerCase();
  if (l.includes('遊戲引擎') || l.includes('game engine')) return <Cpu size={15} style={{ color: catColor }} />;
  if (l.includes('設計模式') || l.includes('design pattern')) return <Code2 size={15} style={{ color: catColor }} />;
  if (l.includes('核心技術') || l.includes('core tech')) return <Wrench size={15} style={{ color: catColor }} />;
  if (l.includes('xr') || l.includes('xr 實境')) return <Monitor size={15} style={{ color: catColor }} />;
  if (l.includes('多人') || l.includes('multiplayer')) return <GitMerge size={15} style={{ color: catColor }} />;
  if (l.includes('後端程式') || l.includes('backend lang')) return <Code2 size={15} style={{ color: catColor }} />;
  if (l.includes('後端框架') || l.includes('backend frame')) return <Server size={15} style={{ color: catColor }} />;
  if (l.includes('前端程式') || l.includes('frontend lang')) return <Monitor size={15} style={{ color: catColor }} />;
  if (l.includes('前端框架') || l.includes('frontend frame')) return <Layout size={15} style={{ color: catColor }} />;
  if (l.includes('資料庫') || l.includes('database')) return <Database size={15} style={{ color: catColor }} />;
  if (l.includes('雲端') || l.includes('cloud')) return <Cloud size={15} style={{ color: catColor }} />;
  if (l.includes('開發與建構') || l.includes('dev & build')) return <Wrench size={15} style={{ color: catColor }} />;
  if (l.includes('ci/cd')) return <GitMerge size={15} style={{ color: catColor }} />;
  if (l.includes('視覺') || l.includes('visual')) return <PenTool size={15} style={{ color: catColor }} />;
  if (l.includes('ai') || l.includes('aigc')) return <Bot size={15} style={{ color: catColor }} />;
  if (l.includes('流程') || l.includes('flowchart')) return <FileText size={15} style={{ color: catColor }} />;
  if (l.includes('影片') || l.includes('video')) return <Film size={15} style={{ color: catColor }} />;
  if (l.includes('3d') || l.includes('建模') || l.includes('model')) return <Box size={15} style={{ color: catColor }} />;
  return <Cpu size={15} style={{ color: catColor }} />;
};

/* ── Main Component ── */
export const Skills = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentSkills = skillsData[lang] ?? skillsData.zh;

  return (
    <section id="skills" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
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
            const CatIcon = CAT_ICON_MAP[cat.catType] ?? Gamepad2;

            return (
              <div key={idx} className="rounded-2xl glass-card overflow-hidden shadow-md border border-[var(--border-color)]">

                {/* Category Header */}
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

                {/* Skill Rows */}
                <div className="p-4 sm:p-6 space-y-3">
                  {cat.items.map((item, iIdx) => {
                    const tokens = item.content.split('/').map(s => s.trim()).filter(Boolean);

                    return (
                      <div
                        key={iIdx}
                        className="skill-row-bg rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 border"
                      >
                        {/* Label */}
                        <div className="flex items-center gap-2.5 shrink-0 sm:w-[220px]">
                          <span
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
                            style={{
                              backgroundColor: `${cat.catColor}14`,
                              border: `1px solid ${cat.catColor}28`,
                            }}
                          >
                            {getLabelIcon(item.label, cat.catColor)}
                          </span>
                          <span className="font-bold text-sm text-[var(--text-main)]">
                            {item.label}
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-5 shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />

                        {/* Tech Chips */}
                        <div className="flex flex-wrap items-center gap-2">
                          {tokens.map((sub, sIdx) => {
                            const logoUrl = cat.catType === 'media' ? getMediaTechLogo(sub, isLight) : null;

                            return (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold font-code transition-all hover:scale-105 shadow-xs"
                                style={{
                                  backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)',
                                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)',
                                  color: isLight ? '#0f172a' : '#f8fafc',
                                  borderWidth: '1px',
                                }}
                              >
                                {logoUrl && (
                                  <img
                                    src={logoUrl}
                                    alt={`${sub} logo`}
                                    className="w-4 h-4 object-contain shrink-0"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                )}
                                <span>{sub}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
