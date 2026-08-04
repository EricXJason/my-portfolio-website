import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Gamepad2, Globe, Palette, Cpu, Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge, PenTool, Bot, FileText, Film, Box, LucideIcon } from 'lucide-react';
import skillsData from '../data/skills-section.json';

interface SkillItem {
  label: string;
  rowType: string;
  content: string;
}

interface SkillCategory {
  category: string;
  catColor: string;
  catType: string;
  items: SkillItem[];
}

const CAT_ICON_MAP: Record<string, LucideIcon> = {
  game:  Gamepad2,
  web:   Globe,
  media: Palette,
};

const getLabelIcon = (label: string, catColor: string) => {
  const l = label.toLowerCase();
  if (l.includes('遊戲引擎') || l.includes('game engine')) return <Cpu size={16} style={{ color: catColor }} />;
  if (l.includes('設計模式') || l.includes('design pattern')) return <Code2 size={16} style={{ color: catColor }} />;
  if (l.includes('核心技術') || l.includes('core tech')) return <Wrench size={16} style={{ color: catColor }} />;
  if (l.includes('xr') || l.includes('xr 實境')) return <Monitor size={16} style={{ color: catColor }} />;
  if (l.includes('多人') || l.includes('multiplayer')) return <GitMerge size={16} style={{ color: catColor }} />;
  if (l.includes('程式語言') || l.includes('programming lang') || l.includes('後端程式') || l.includes('前端程式')) return <Code2 size={16} style={{ color: catColor }} />;
  if (l.includes('後端框架') || l.includes('backend frame')) return <Server size={16} style={{ color: catColor }} />;
  if (l.includes('前端框架') || l.includes('frontend frame')) return <Layout size={16} style={{ color: catColor }} />;
  if (l.includes('資料庫') || l.includes('database')) return <Database size={16} style={{ color: catColor }} />;
  if (l.includes('伺服器') || l.includes('雲端') || l.includes('server') || l.includes('cloud')) return <Cloud size={16} style={{ color: catColor }} />;
  if (l.includes('開發與建構') || l.includes('dev & build')) return <Wrench size={16} style={{ color: catColor }} />;
  if (l.includes('ci/cd')) return <GitMerge size={16} style={{ color: catColor }} />;
  if (l.includes('視覺') || l.includes('visual')) return <PenTool size={16} style={{ color: catColor }} />;
  if (l.includes('ai') || l.includes('aigc')) return <Bot size={16} style={{ color: catColor }} />;
  if (l.includes('流程圖') || l.includes('flowchart')) return <FileText size={16} style={{ color: catColor }} />;
  if (l.includes('影片') || l.includes('video')) return <Film size={16} style={{ color: catColor }} />;
  if (l.includes('3d') || l.includes('建模') || l.includes('model')) return <Box size={16} style={{ color: catColor }} />;
  return <Cpu size={16} style={{ color: catColor }} />;
};

export const Skills: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dataMap = skillsData as unknown as Record<Language, SkillCategory[]>;
  const currentSkills: SkillCategory[] = dataMap[lang] ?? dataMap.zh;

  return (
    <section id="skills" className="py-16 sm:py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('skills_title')}
          </h2>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-[var(--text-sub)]">
            {t('skills_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Master Content Container - 2-Column Responsive Grid on Desktop */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 border border-[var(--border-color)] shadow-xl max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {currentSkills.map((cat, idx) => {
            const CatIcon = CAT_ICON_MAP[cat.catType] ?? Gamepad2;
            const activeCatColor = isLight
              ? (cat.catType === 'game' ? '#0284c7' : cat.catType === 'web' ? '#7e22ce' : '#047857')
              : cat.catColor;

            const isCoreFocus = cat.catType === 'game';

            return (
              <div
                key={idx}
                className={`rounded-2xl glass-card overflow-hidden shadow-md border border-[var(--border-color)] flex flex-col justify-between ${
                  isCoreFocus ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                {/* Category Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--border-color)]"
                  style={{ borderLeftWidth: '4px', borderLeftColor: activeCatColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl cat-icon-bg border">
                      <CatIcon size={22} style={{ color: activeCatColor }} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
                      {cat.category}
                    </h3>
                  </div>

                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-code font-bold uppercase tracking-wider border shadow-xs"
                    style={{
                      backgroundColor: cat.catType === 'game'
                        ? (isLight ? '#f0f9ff' : 'rgba(6,182,212,0.15)')
                        : cat.catType === 'web'
                        ? (isLight ? '#faf5ff' : 'rgba(192,132,252,0.15)')
                        : (isLight ? '#ecfdf5' : 'rgba(52,211,153,0.15)'),
                      borderColor: cat.catType === 'game'
                        ? (isLight ? '#bae6fd' : 'rgba(6,182,212,0.4)')
                        : cat.catType === 'web'
                        ? (isLight ? '#e9d5ff' : 'rgba(192,132,252,0.4)')
                        : (isLight ? '#a7f3d0' : 'rgba(52,211,153,0.4)'),
                      color: cat.catType === 'game'
                        ? (isLight ? '#0369a1' : '#22d3ee')
                        : cat.catType === 'web'
                        ? (isLight ? '#7e22ce' : '#c084fc')
                        : (isLight ? '#047857' : '#34d399'),
                    }}
                  >
                    {cat.catType === 'game'
                      ? (lang === 'zh' ? '★ 核心主修' : '★ Core Focus')
                      : (lang === 'zh' ? '◆ 跨領域專長' : '◆ Cross-Domain')}
                  </span>
                </div>

                {/* Skill Rows Sub-Grid */}
                <div className={`p-4 sm:p-6 ${isCoreFocus ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4' : 'flex flex-col gap-3.5'}`}>
                  {cat.items.map((item, iIdx) => {
                    const tokens = item.content.split('/').map((s) => s.trim()).filter(Boolean);

                    return (
                      <div
                        key={iIdx}
                        className="p-3.5 sm:p-4 rounded-xl border transition-all space-y-2.5 hover:border-cyan-500/40"
                        style={{
                          backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2.5"
                            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                          >
                            <div className="p-1 rounded-md" style={{ backgroundColor: isLight ? '#f0f9ff' : 'rgba(255,255,255,0.05)' }}>
                              {getLabelIcon(item.label, activeCatColor)}
                            </div>
                            <span>{item.label}</span>
                          </span>
                        </div>

                        {/* Tech Chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {tokens.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium font-code transition-all hover:scale-105 shadow-xs"
                              style={{
                                backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)',
                                borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)',
                                color: isLight ? '#0f172a' : '#f8fafc',
                                borderWidth: '1px',
                              }}
                            >
                              <span>{sub}</span>
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

      </div>
    </section>
  );
};

export default Skills;
