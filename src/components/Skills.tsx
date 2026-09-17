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

import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Gamepad2, Globe, Palette, Cpu, Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge, PenTool, Bot, Box, LucideIcon, Zap, Layers } from 'lucide-react';
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
  catTier?: 'primary' | 'secondary';
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

/**
 * TODO: [後端端點對接] 取得使用者模式專業技能分組與標籤清單
 * 1. HTTP Method: GET
 * 2. 預期端點: /api/v1/skills
 * 3. 請求參數:
 *    - Query Params: lang (string, 'zh' | 'en' | 'ja')
 * 4. 預期回應:
 *    - 200 OK: { success: true, data: { zh: SkillCategory[], en: SkillCategory[], ja: SkillCategory[] } }
 *    - 500 Internal Server Error: 伺服器讀取技能清單失敗
 * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，直接採用本地靜態 JSON 資料 (skills-section.json) 驅動，待後端 API 完成後改由 apiClient.get() 取得。
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
  const secondarySkills = currentSkills.filter((s) => s.catTier === 'secondary');

  const catAccents: Record<string, { main: string; bg: string; border: string }> = {
    game:      { main: isLight ? '#0369a1' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)', border: isLight ? '#7dd3fc' : 'rgba(0,240,255,0.35)' },
    fullstack: { main: isLight ? '#0284c7' : '#38bdf8', bg: isLight ? '#e0f2fe' : 'rgba(56,189,248,0.15)', border: isLight ? '#38bdf8' : 'rgba(56,189,248,0.5)' },
    media:     { main: isLight ? '#7c3aed' : '#c084fc', bg: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)', border: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)' },
  };

  const primaryColor = isLight ? '#0369a1' : '#00f0ff';
  const secondaryColor = isLight ? '#7c3aed' : '#c084fc';

  const headerRef   = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const primaryRef  = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {primarySkills.map((cat, idx) => {
              const CatIcon = (cat.icon ? getLucideIconByName(cat.icon) : null) || CAT_ICON_MAP[cat.catType] || Gamepad2;
              const accent = catAccents[cat.catType] || catAccents.game;

              return (
                <div
                  key={idx}
                  className={`cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-xl relative reveal-scale reveal-d${(idx + 1) as 1 | 2}`}
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
                  <div className="space-y-6">
                    {/* 分類標題列與對應圖示 */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3 border-b border-slate-700/40 pb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="p-2.5 sm:p-3 border cyber-cut-sm shrink-0"
                          style={{
                            backgroundColor: accent.bg,
                            borderColor: accent.border,
                            color: accent.main,
                          }}
                        >
                          <CatIcon size={22} />
                        </div>
                        <h4 className="text-lg sm:text-2xl font-black font-hud uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {cat.category}
                        </h4>
                      </div>

                      <span
                        className="px-3 sm:px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs self-start sm:self-auto"
                        style={{
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                          color: accent.main,
                        }}
                      >
                        {lang === 'zh' ? '核心專長' : 'CORE FOCUS'}
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

        {/* 一項跨領域輔助能力 */}
        {secondarySkills.length > 0 && (
          <div ref={secondaryRef} className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b reveal-up" style={{ borderColor: isLight ? 'rgba(4, 120, 87, 0.3)' : 'rgba(52, 211, 153, 0.3)' }}>
              <Layers size={20} style={{ color: secondaryColor }} />
              <h3 className="font-hud font-bold text-base sm:text-lg uppercase tracking-wider" style={{ color: secondaryColor }}>
                {lang === 'zh' ? '輔助專業技能' : 'AUXILIARY COMPETENCY'}
              </h3>
            </div>

            {secondarySkills.map((cat, sIdx) => {
              const CatIcon = (cat.icon ? getLucideIconByName(cat.icon) : null) || CAT_ICON_MAP[cat.catType] || Palette;
              const accent = catAccents[cat.catType] || catAccents.media;

              return (
                <div
                  key={sIdx}
                  className="cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-xl space-y-6 reveal-scale reveal-d1"
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3 border-b border-slate-700/40 pb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="p-2.5 sm:p-3 border cyber-cut-sm shrink-0"
                        style={{
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                          color: accent.main,
                        }}
                      >
                        <CatIcon size={22} />
                      </div>
                      <h4 className="text-lg sm:text-2xl font-black font-hud uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {cat.category}
                      </h4>
                    </div>

                    <span
                      className="px-3 sm:px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shrink-0 shadow-xs self-start sm:self-auto"
                      style={{
                        backgroundColor: accent.bg,
                        borderColor: accent.border,
                        color: accent.main,
                      }}
                    >
                      {lang === 'zh' ? '輔助型專長' : 'SUPPORTING SKILLS'}
                    </span>
                  </div>

                  {/* 六等分對稱平衡網格 */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {cat.items.map((item, iIdx) => {
                      const tokens = splitSkillTokens(item.content);
                      const isRow1 = iIdx < 3;
                      const spanClass = isRow1 ? 'md:col-span-2' : 'md:col-span-3';

                      return (
                        <div
                          key={iIdx}
                          className={`${spanClass} p-4 border cyber-cut-sm flex flex-col justify-start space-y-2.5 transition-all duration-300 shadow-xs`}
                          style={{
                            backgroundColor: isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(8, 14, 28, 0.45)',
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
        )}

      </div>
    </section>
  );
};

export default Skills;
