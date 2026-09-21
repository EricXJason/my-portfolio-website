/**
 * ============================================================================
 * 檔案名稱: Skills.tsx
 * 所屬模組: Presentation Layer (專業技能展示模組)
 * 責任描述: 負責呈現互動應用開發、全端開發與多媒體設計三大核心領域技能矩陣與晶片化標籤。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合滾動浮現 (Scroll Reveal) 與動態技術徽章映射。
 * 依賴關係: 依賴 LangContext、ThemeContext、skills-section.json、useScrollReveal 與 skillsHelper。
 * 邊界處理: 支援動態標籤分割 (Token Split)、預設圖示回退保障。
 * ============================================================================
 */

import React, { useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  Gamepad2,
  Globe,
  Palette,
  Cpu,
  Code2,
  Server,
  Monitor,
  Layout,
  Database,
  Cloud,
  Wrench,
  GitBranch,
  PenTool,
  Bot,
  Box,
  Boxes,
  Workflow,
  LineChart,
  Glasses,
  Wifi,
  Terminal,
  Sparkles,
  LucideIcon,
  Zap,
  Layers,
} from 'lucide-react';
import skillsData from '../data/skills-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { splitSkillTokens } from '../utils/skillsHelper';
import { getLucideIconByName } from '../utils/iconHelper';

interface SkillItem {
  label: string;
  rowType: string;
  content: string;
  visible?: boolean;
}

interface SkillCategory {
  category: string;
  catType: string;
  catTier?: 'primary' | 'common' | 'secondary';
  icon?: string;
  visible?: boolean;
  items: SkillItem[];
}

const CAT_ICON_MAP: Record<string, LucideIcon> = {
  game:      Gamepad2,
  fullstack: Globe,
  media:     Palette,
};

const getLabelIcon = (label: string, catColor: string) => {
  const l = label.toLowerCase();
  // 互動應用開發 (5 個獨特圖示)
  if (l.includes('遊戲引擎') || l.includes('game engine'))                              return <Cpu       size={16} style={{ color: catColor }} />;
  if (l.includes('核心技術') || l.includes('core tech'))                               return <Wrench    size={16} style={{ color: catColor }} />;
  if (l.includes('動畫') || l.includes('animation') || l.includes('相機'))              return <Monitor   size={16} style={{ color: catColor }} />;
  if (l.includes('xr') || l.includes('xr 實境') || l.includes('xr dev'))                return <Glasses   size={16} style={{ color: catColor }} />;
  if (l.includes('多人') || l.includes('multiplayer'))                                 return <Wifi      size={16} style={{ color: catColor }} />;
  // 全端開發 (6 個獨特圖示)
  if (l.includes('程式語言') || l.includes('programming lang'))                      return <Code2     size={16} style={{ color: catColor }} />;
  if (l.includes('前端') || l.includes('frontend') || l.includes('樣式'))              return <Layout    size={16} style={{ color: catColor }} />;
  if (l.includes('後端') || l.includes('backend'))                                    return <Server    size={16} style={{ color: catColor }} />;
  if (l.includes('資料庫') || l.includes('database') || l.includes('service'))        return <Database  size={16} style={{ color: catColor }} />;
  if (l.includes('雲端') || l.includes('cloud') || l.includes('edge') || l.includes('部署')) return <Cloud     size={16} style={{ color: catColor }} />;
  if (l.includes('開發與測試') || l.includes('dev & test') || l.includes('tool'))     return <Terminal  size={16} style={{ color: catColor }} />;
  // 通用軟體工程能力 (4 個獨特圖示)
  if (l.includes('架構') || l.includes('設計模式') || l.includes('architecture'))     return <Boxes     size={16} style={{ color: catColor }} />;
  if (l.includes('版本控制') || l.includes('version control') || l.includes('devops'))    return <GitBranch size={16} style={{ color: catColor }} />;
  if (l.includes('系統分析') || l.includes('system anal') || l.includes('圖表'))       return <LineChart size={16} style={{ color: catColor }} />;
  if (l.includes('ai') || l.includes('aigc') || l.includes('輔助開發') || l.includes('輔助創作')) return <Bot   size={16} style={{ color: catColor }} />;
  // 多媒體設計 (2 個獨特圖示)
  if (l.includes('3d') || l.includes('建模') || l.includes('model'))                  return <Box       size={16} style={{ color: catColor }} />;
  if (l.includes('視覺') || l.includes('visual') || l.includes('ui/ux') || l.includes('影音')) return <Palette size={16} style={{ color: catColor }} />;
  // Fallback 預設安全圖示
  return <Sparkles size={16} style={{ color: catColor }} />;
};

/**
 * [專業技能模組] 展示工程技術、架構分層與多媒體視覺之核心技能晶片
 * 支援 zh / en / ja 三語系切換與光暗主題自適應渲染。
 */
export const Skills: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const { data } = usePortfolioData();
  const isLight = theme === 'light';

  const dataMap = (data.skills || skillsData) as unknown as Record<Language, SkillCategory[]>;
  const rawSkills: SkillCategory[] = dataMap[lang] ?? dataMap.zh;
  const currentSkills: SkillCategory[] = rawSkills
    .filter((s) => s.visible !== false)
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => item.visible !== false),
    }));
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';

  const primarySkills = currentSkills.filter((s) => s.catTier === 'primary');
  const [primaryActiveTab, setPrimaryActiveTab] = useState(0);
  const commonSkills  = currentSkills.filter((s) => s.catTier === 'common');
  const secondarySkills = currentSkills.filter((s) => s.catTier === 'secondary');

  // 全站順序色嚴格規範：青色 (Cyan) → 藍色 (Sky/Blue) → 紫色 (Purple) → 綠色 (Emerald Green)
  const catAccents: Record<string, { main: string; bg: string; border: string }> = {
    fullstack: { main: isLight ? '#0369a1' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)',   border: isLight ? '#7dd3fc' : 'rgba(0,240,255,0.35)'   }, // 1. 青色
    game:      { main: isLight ? '#1d4ed8' : '#60a5fa', bg: isLight ? '#eff6ff' : 'rgba(96,165,250,0.15)', border: isLight ? '#93c5fd' : 'rgba(96,165,250,0.4)'  }, // 2. 藍色（更鑑和）
    common:    { main: isLight ? '#7c3aed' : '#c084fc', bg: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)', border: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)' }, // 3. 紫色
    media:     { main: isLight ? '#059669' : '#34d399', bg: isLight ? '#ecfdf5' : 'rgba(16,185,129,0.14)', border: isLight ? '#6ee7b7' : 'rgba(52,211,153,0.42)' }, // 4. 綠色 (第四順位嚴格遵照青藍紫綠)
  };

  const primaryColor   = isLight ? '#0369a1' : '#00f0ff'; // 青 — 全端開發
  const commonColor    = isLight ? '#7c3aed' : '#c084fc'; // 紫 — 通用工程
  const secondaryColor = isLight ? '#7e22ce' : '#c084fc'; // 紫 — 輔助技能統一紫色

  const headerRef   = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const primaryRef  = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
  const commonRef   = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
  const secondaryRef = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;

  return (
    <section id="skills" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-16">

        {/* 章節主標題列 */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <Cpu size={32} style={{ color: primaryColor }} className="shrink-0" />
            <span>{t('skills_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('skills_intro')}
          </p>
        </div>

        {/* 兩大核心專業領域 */}
        <div ref={primaryRef} className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b reveal-up" style={{ borderColor: isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(0, 240, 255, 0.3)' }}>
            <Zap size={20} style={{ color: primaryColor }} />
            <h3 className="font-hud font-bold text-base sm:text-lg uppercase tracking-wider" style={{ color: primaryColor }}>
              {lang === 'zh' ? '主要專業領域' : 'PRIMARY CORE COMPETENCIES'}
            </h3>
          </div>

          {/* 手機端 Tab 切換器 (< md) */}
          {primarySkills.length > 1 && (
            <div className="flex md:hidden gap-0 border cyber-cut-sm overflow-hidden mb-4"
              style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.2)' }}
            >
              {primarySkills.map((cat, idx) => {
                const accent = catAccents[cat.catType] || catAccents.game;
                const isActive = primaryActiveTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setPrimaryActiveTab(idx)}
                    className="flex-1 py-2 text-xs font-bold font-hud uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: isActive ? accent.bg : 'transparent',
                      color: isActive ? accent.main : (isLight ? '#64748b' : '#94a3b8'),
                      borderRight: idx < primarySkills.length - 1 ? `1px solid ${isLight ? '#cbd5e1' : 'rgba(0,240,255,0.2)'}` : 'none',
                    }}
                  >
                    {cat.category}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {primarySkills.map((cat, idx) => {
              const CatIcon = (cat.icon ? getLucideIconByName(cat.icon) : null) || CAT_ICON_MAP[cat.catType] || Gamepad2;
              const accent = catAccents[cat.catType] || catAccents.game;

              return (
                <div
                  key={idx}
                  className={`cyber-card p-5 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-xl relative reveal-scale reveal-d${(idx + 1) as 1 | 2}${idx !== primaryActiveTab ? ' hidden md:block' : ''}`}
                  style={{
                    background: isLight
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
                      : 'linear-gradient(135deg, rgba(13, 23, 42, 0.52) 0%, rgba(6, 12, 24, 0.62) 100%)',
                    borderColor: isLight ? accent.border : borderCol,
                    boxShadow: isLight
                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 12px 30px rgba(15, 23, 42, 0.06)'
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div className="space-y-5">
                    {/* 分類標題列 — 永遠 flex-row 防止行動端破版 */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700/40 pb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="p-2 sm:p-2.5 border cyber-cut-sm shrink-0"
                          style={{
                            backgroundColor: accent.bg,
                            borderColor: accent.border,
                            color: accent.main,
                          }}
                        >
                          <CatIcon size={20} />
                        </div>
                        <h4 className="text-base sm:text-xl font-black font-hud uppercase tracking-tight truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {cat.category}
                        </h4>
                      </div>

                      <span
                        className="px-2.5 py-0.5 border font-tech text-[10px] sm:text-xs font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs"
                        style={{
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                          color: accent.main,
                        }}
                      >
                        {lang === 'zh' ? '核心專長' : 'CORE'}
                      </span>
                    </div>


                    {/* 技能項目條列 */}
                    <div className="space-y-4">
                      {cat.items.map((item, iIdx) => {
                        const tokens = splitSkillTokens(item.content);

                        return (
                          <div
                            key={iIdx}
                            className="p-4 border cyber-cut-sm space-y-2.5 transition-all duration-300 shadow-xs"
                            style={{
                              backgroundColor: isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(8, 14, 28, 0.45)',
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
                                  className="px-3 py-1 text-xs sm:text-sm font-tech font-semibold border tech-tag cyber-cut-sm skill-tag-reveal"
                                  style={{
                                    backgroundColor: isLight ? '#ffffff' : 'rgba(0,0,0,0.4)',
                                    borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                                    color: isLight ? '#0f172a' : '#e2e8f0',
                                    animationDelay: `${(iIdx * 0.08 + sIdx * 0.04).toFixed(2)}s`,
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

        {/* 輔助專業技能 — common + secondary 合併，外層 2 欄 grid 左右/左右/中 */}
        {(commonSkills.length > 0 || secondarySkills.length > 0) && (() => {
          const auxiliarySkills = [...commonSkills, ...secondarySkills];
          const getBadgeText = (catType: string) => {
            if (catType === 'common') return lang === 'zh' ? '通用工程專長' : 'GENERAL ENGINEERING';
            return lang === 'zh' ? '輔助型專長' : 'AUXILIARY SKILLS';
          };
          return (
            <div ref={secondaryRef} className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center gap-2.5 pb-2 border-b reveal-up" style={{ borderColor: isLight ? 'rgba(124, 58, 237, 0.3)' : 'rgba(192,132,252,0.35)' }}>
                <Layers size={20} style={{ color: secondaryColor }} />
                <h3 className="font-hud font-bold text-base sm:text-lg uppercase tracking-wider" style={{ color: secondaryColor }}>
                  {lang === 'zh' ? '輔助專業技能' : 'SUPPORTING SKILLS'}
                </h3>
              </div>

              {/* 外層垂直排列（上下堆疊） */}
              <div className="flex flex-col gap-8">
                {auxiliarySkills.map((cat, aIdx) => {
                  const CatIcon = (cat.icon ? getLucideIconByName(cat.icon) : null)
                    || (cat.catType === 'common' ? Wrench : null)
                    || CAT_ICON_MAP[cat.catType]
                    || Palette;
                  const accent = catAccents[cat.catType] || catAccents.media;
                  const isLastOdd = auxiliarySkills.length % 2 === 1 && aIdx === auxiliarySkills.length - 1;

                  return (
                    <div
                      key={aIdx}
                      className={`cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-xl space-y-6 reveal-scale reveal-d${(aIdx % 2 + 1) as 1 | 2}${isLastOdd ? ' md:col-span-2 md:max-w-[50%] md:mx-auto md:w-full' : ''}`}
                      style={{
                        background: isLight
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
                          : 'linear-gradient(135deg, rgba(13, 23, 42, 0.52) 0%, rgba(6, 12, 24, 0.62) 100%)',
                        borderColor: isLight ? accent.border : borderCol,
                        boxShadow: isLight
                          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 12px 30px rgba(15, 23, 42, 0.06)'
                          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {/* 卡片標題列 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3 border-b border-slate-700/40 pb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="p-2.5 sm:p-3 border cyber-cut-sm shrink-0"
                            style={{ backgroundColor: accent.bg, borderColor: accent.border, color: accent.main }}
                          >
                            <CatIcon size={22} />
                          </div>
                          <h4 className="text-lg sm:text-2xl font-black font-hud uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {cat.category}
                          </h4>
                        </div>
                        <span
                          className="px-3 sm:px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs self-start sm:self-auto"
                          style={{ backgroundColor: accent.bg, borderColor: accent.border, color: accent.main }}
                        >
                          {getBadgeText(cat.catType)}
                        </span>
                      </div>

                      {/* 子項目 2 欄 grid（奇數最後一項置中） */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cat.items.map((item, iIdx) => {
                          const tokens = splitSkillTokens(item.content);
                          const isItemOdd = cat.items.length % 2 === 1 && iIdx === cat.items.length - 1;
                          return (
                            <div
                              key={iIdx}
                              className={`${isItemOdd ? 'md:col-span-2 md:max-w-[50%] md:mx-auto md:w-full' : ''} p-4 border cyber-cut-sm flex flex-col justify-start space-y-2.5 transition-all duration-300 shadow-xs`}
                              style={{
                                backgroundColor: isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(8, 14, 28, 0.45)',
                                borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                              }}
                            >
                              <div className="flex items-center border-b border-slate-700/20 pb-2">
                                <span className="font-hud font-bold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                  {getLabelIcon(item.label, accent.main)}
                                  <span>{item.label}</span>
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {tokens.map((sub, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-3 py-1 text-xs sm:text-sm font-tech font-semibold border tech-tag cyber-cut-sm skill-tag-reveal"
                                    style={{
                                      backgroundColor: isLight ? '#ffffff' : 'rgba(0,0,0,0.4)',
                                      borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                                      color: isLight ? '#0f172a' : '#e2e8f0',
                                      animationDelay: `${(iIdx * 0.07 + sIdx * 0.035).toFixed(2)}s`,
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
            </div>
          );
        })()}

      </div>
    </section>
  );
};

export default Skills;
