import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Gamepad2, Globe, Palette, Cpu, Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge, PenTool, Bot, Box, LucideIcon, Zap, Layers } from 'lucide-react';
import skillsData from '../data/skills-section.json';

interface SkillItem {
  label: string;
  rowType: string;
  content: string;
}

interface SkillCategory {
  category: string;
  catTier: string;
  catColor: string;
  catType: string;
  items: SkillItem[];
}

const CAT_ICON_MAP: Record<string, LucideIcon> = {
  game:      Gamepad2,
  fullstack: Globe,
  media:     Palette,
};

const getLabelIcon = (label: string, catColor: string) => {
  const l = label.toLowerCase();
  if (l.includes('遊戲引擎') || l.includes('game engine')) return <Cpu size={16} style={{ color: catColor }} />;
  if (l.includes('設計模式') || l.includes('design pattern')) return <Code2 size={16} style={{ color: catColor }} />;
  if (l.includes('核心') || l.includes('core')) return <Wrench size={16} style={{ color: catColor }} />;
  if (l.includes('xr') || l.includes('xr 實境')) return <Monitor size={16} style={{ color: catColor }} />;
  if (l.includes('多人') || l.includes('multiplayer')) return <GitMerge size={16} style={{ color: catColor }} />;
  if (l.includes('語言') || l.includes('lang')) return <Code2 size={16} style={{ color: catColor }} />;
  if (l.includes('後端') || l.includes('backend')) return <Server size={16} style={{ color: catColor }} />;
  if (l.includes('前端') || l.includes('frontend') || l.includes('框架')) return <Layout size={16} style={{ color: catColor }} />;
  if (l.includes('資料庫') || l.includes('database')) return <Database size={16} style={{ color: catColor }} />;
  if (l.includes('伺服器') || l.includes('雲端') || l.includes('server') || l.includes('cloud')) return <Cloud size={16} style={{ color: catColor }} />;
  if (l.includes('視覺') || l.includes('visual') || l.includes('ui/ux')) return <PenTool size={16} style={{ color: catColor }} />;
  if (l.includes('ai') || l.includes('aigc')) return <Bot size={16} style={{ color: catColor }} />;
  if (l.includes('3d') || l.includes('建模') || l.includes('model')) return <Box size={16} style={{ color: catColor }} />;
  return <Zap size={16} style={{ color: catColor }} />;
};

export const Skills: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dataMap = skillsData as unknown as Record<Language, SkillCategory[]>;
  const currentSkills: SkillCategory[] = dataMap[lang] ?? dataMap.zh;
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';

  const primarySkills = currentSkills.filter((s) => s.catTier === 'primary');
  const secondarySkills = currentSkills.filter((s) => s.catTier === 'secondary');

  const catAccents: Record<string, { main: string; bg: string; border: string }> = {
    game:      { main: isLight ? '#0284c7' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)', border: isLight ? '#38bdf8' : 'rgba(0,240,255,0.35)' },
    fullstack: { main: isLight ? '#7c3aed' : '#c084fc', bg: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)', border: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)' },
    media:     { main: isLight ? '#047857' : '#34d399', bg: isLight ? '#d1fae5' : 'rgba(16,185,129,0.12)', border: isLight ? '#34d399' : 'rgba(16,185,129,0.35)' },
  };

  const primaryColor = isLight ? '#0284c7' : '#00f0ff';
  const secondaryColor = isLight ? '#047857' : '#34d399';

  return (
    <section id="skills" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-16">

        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div
            className="inline-flex items-center gap-2 font-tech text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 border cyber-cut-sm shadow-sm"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#080e1a',
              borderColor: borderCol,
              color: primaryColor,
            }}
          >
            <Cpu size={15} />
            <span>{lang === 'zh' ? '專業核心技能矩陣' : 'TECHNICAL MATRIX'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            <Cpu size={34} style={{ color: primaryColor }} className="shrink-0" />
            <span>{t('skills_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('skills_intro')}
          </p>
        </div>

        {/* 2 PRIMARY CORE DOMAINS (遊戲與互動應用開發 & 全端開發) */}
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(0, 240, 255, 0.3)' }}>
            <Zap size={20} style={{ color: primaryColor }} />
            <h3 className="font-hud font-bold text-base sm:text-lg uppercase tracking-wider" style={{ color: primaryColor }}>
              {lang === 'zh' ? '主要專業領域' : 'PRIMARY CORE COMPETENCIES'}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {primarySkills.map((cat, idx) => {
              const CatIcon = CAT_ICON_MAP[cat.catType] || Gamepad2;
              const accent = catAccents[cat.catType] || catAccents.game;

              return (
                <div
                  key={idx}
                  className="cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl relative"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)',
                    borderColor: isLight ? accent.border : borderCol,
                  }}
                >
                  <div className="space-y-6">
                    {/* Category Header with Category Icon */}
                    <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 border cyber-cut-sm shrink-0"
                          style={{
                            backgroundColor: accent.bg,
                            borderColor: accent.border,
                            color: accent.main,
                          }}
                        >
                          <CatIcon size={22} />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {cat.category}
                        </h4>
                      </div>

                      <span
                        className="px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs"
                        style={{
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                          color: accent.main,
                        }}
                      >
                        {lang === 'zh' ? '核心專長' : 'CORE FOCUS'}
                      </span>
                    </div>

                    {/* Skill Item List */}
                    <div className="space-y-4">
                      {cat.items.map((item, iIdx) => {
                        const tokens = item.content.split(/\s*\/\s*(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);

                        return (
                          <div
                            key={iIdx}
                            className="p-4 border cyber-cut-sm space-y-2.5 transition-all duration-300 hover:-translate-y-0.5 shadow-xs"
                            style={{
                              backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-hud font-bold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                {getLabelIcon(item.label, accent.main)}
                                <span>{item.label}</span>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {tokens.map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-3 py-1 text-xs sm:text-sm font-tech font-semibold border tech-tag cyber-cut-sm"
                                  style={{
                                    backgroundColor: isLight ? '#ffffff' : 'rgba(0,0,0,0.4)',
                                    borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                                    color: isLight ? '#0f172a' : '#e2e8f0',
                                  }}
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 AUXILIARY COMPETENCY (多媒體設計) */}
        {secondarySkills.length > 0 && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b" style={{ borderColor: isLight ? 'rgba(4, 120, 87, 0.3)' : 'rgba(52, 211, 153, 0.3)' }}>
              <Layers size={20} style={{ color: secondaryColor }} />
              <h3 className="font-hud font-bold text-base sm:text-lg uppercase tracking-wider" style={{ color: secondaryColor }}>
                {lang === 'zh' ? '輔助專業技能' : 'AUXILIARY COMPETENCY'}
              </h3>
            </div>

            {secondarySkills.map((cat, sIdx) => {
              const CatIcon = CAT_ICON_MAP[cat.catType] || Palette;
              const accent = catAccents[cat.catType] || catAccents.media;

              return (
                <div
                  key={sIdx}
                  className="cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-xl space-y-6"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)',
                    borderColor: isLight ? accent.border : borderCol,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 border cyber-cut-sm shrink-0"
                        style={{
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                          color: accent.main,
                        }}
                      >
                        <CatIcon size={22} />
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {cat.category}
                      </h4>
                    </div>

                    <span
                      className="px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs"
                      style={{
                        backgroundColor: accent.bg,
                        borderColor: accent.border,
                        color: accent.main,
                      }}
                    >
                      {lang === 'zh' ? '輔助型專長' : 'SUPPORTING SKILLS'}
                    </span>
                  </div>

                  {/* 6-Column Symmetric Balanced Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {cat.items.map((item, iIdx) => {
                      const tokens = item.content.split(/\s*\/\s*(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
                      const isRow1 = iIdx < 3;
                      const spanClass = isRow1 ? 'md:col-span-2' : 'md:col-span-3';

                      return (
                        <div
                          key={iIdx}
                          className={`${spanClass} p-4 border cyber-cut-sm flex flex-col justify-start space-y-2.5 transition-all duration-300 hover:-translate-y-0.5 shadow-xs`}
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                            borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-center justify-between border-b border-slate-700/20 pb-2">
                            <span className="font-hud font-bold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {getLabelIcon(item.label, accent.main)}
                              <span>{item.label}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {tokens.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-3 py-1 text-xs sm:text-sm font-tech font-semibold border tech-tag cyber-cut-sm"
                                style={{
                                  backgroundColor: isLight ? '#ffffff' : 'rgba(0,0,0,0.4)',
                                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                                  color: isLight ? '#0f172a' : '#e2e8f0',
                                }}
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default Skills;
