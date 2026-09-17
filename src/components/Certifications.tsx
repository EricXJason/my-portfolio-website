/**
 * ============================================================================
 * 檔案名稱: Certifications.tsx
 * 所屬模組: Presentation Layer (專業證照與技能檢定模組)
 * 責任描述: 負責呈現國家級技術士技能檢定、多媒體原廠國際認證與 TOEIC 語言成績證明。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合摺疊展開狀態控制與雲端連結驗證。
 * 依賴關係: 依賴 LangContext、ThemeContext、certifications-section.json 與 useScrollReveal。
 * 邊界處理: 支援缺少連結時按鈕優雅隱藏、防範空群組崩潰。
 * ============================================================================
 */

import React, { useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { CheckCircle2, ExternalLink, Trophy, Award, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import certData from '../data/certifications-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface CertItem {
  name: string;
  org: string;
  linkKey?: string;
  driveUrl?: string;
  visible?: boolean;
}

interface CertGroup {
  group: string;
  iconType: string;
  visible?: boolean;
  items: CertItem[];
}

export const Certifications: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const { data } = usePortfolioData();
  const isLight = theme === 'light';

  const dataMap = (data.certifications || certData) as unknown as Record<Language, CertGroup[]> & {
    toeic: { score: string; driveUrl: string; visible?: boolean };
    driveFolderUrl: string;
    driveLinks?: Record<string, string>;
  };
  const rawGroups: CertGroup[] = dataMap[lang] ?? dataMap.zh;
  const groups: CertGroup[] = rawGroups
    .filter((g) => g.visible !== false)
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => item.visible !== false),
    }));

  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (gIdx: number) => {
    setExpandedGroups((prev) => ({ ...prev, [gIdx]: !prev[gIdx] }));
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0369a1' : '#00f0ff';

  const headerRef    = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const containerRef = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;

  // 證照群組色彩順序配置，突顯結構層次與重要性順位
  const groupAccents = [
    {
      main: isLight ? '#0369a1' : '#00f0ff',
      bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)',
      border: isLight ? '#7dd3fc' : 'rgba(0, 240, 255, 0.35)',
      itemBorder: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)',
      badge: lang === 'zh' ? '國家級技能檢定' : 'NATIONAL LICENSES',
      Icon: ShieldCheck,
    },
    {
      main: isLight ? '#6d28d9' : '#c084fc',
      bg: isLight ? '#f3e8ff' : 'rgba(168, 85, 247, 0.12)',
      border: isLight ? '#c084fc' : 'rgba(168, 85, 247, 0.35)',
      itemBorder: isLight ? '#e9d5ff' : 'rgba(168, 85, 247, 0.25)',
      badge: lang === 'zh' ? '原廠國際認證' : 'INTL CERTIFICATIONS',
      Icon: Award,
    },
  ];

  return (
    <section id="awards" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* 區塊標題列 */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <Award size={32} style={{ color: cyanCol }} className="shrink-0" />
            <span>{t('awards_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('awards_intro')}
          </p>
        </div>

        <div ref={containerRef} className="max-w-6xl mx-auto space-y-10">

          {/* 高對比金琥珀色 TOEIC 755 多益國際英語測驗證照卡片 */}
          {dataMap.toeic?.visible !== false && (
            <div
              className="p-6 sm:p-7 border cyber-cut-corner flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl backdrop-blur-xl reveal-scale reveal-d1"
              style={{
                background: isLight
                  ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.88) 0%, rgba(255, 255, 255, 0.92) 100%)'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.09) 0%, rgba(13, 23, 42, 0.52) 50%, rgba(6, 12, 24, 0.62) 100%)',
                borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.45)',
                boxShadow: isLight
                  ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 10px 25px rgba(245, 158, 11, 0.08)'
                  : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.16), 0 16px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(245, 158, 11, 0.12)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 border cyber-cut-sm shrink-0 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.2)',
                    borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.4)',
                    color: isLight ? '#b45309' : '#fbbf24',
                  }}
                >
                  <Trophy size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 border font-tech text-xs font-bold uppercase tracking-wider cyber-cut-sm"
                      style={{
                        backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.2)',
                        borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.4)',
                        color: isLight ? '#b45309' : '#fbbf24',
                      }}
                    >
                      {lang === 'zh' ? '全球英檢認證' : 'GLOBAL ENGLISH PROFICIENCY'}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {dataMap.toeic?.score || 'TOEIC 755'}
                  </h3>
                  <p className="text-xs sm:text-sm font-tech font-bold" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
                    {lang === 'zh' ? 'ETS 多益英語測驗成績證明' : 'ETS Test of English for International Communication'}
                  </p>
                </div>
              </div>

              <a
                href={dataMap.toeic.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-md group shrink-0"
                style={{
                  backgroundColor: isLight ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
                  borderColor: isLight ? '#d97706' : '#f59e0b',
                  color: isLight ? '#ffffff' : '#fbbf24',
                }}
              >
                <ExternalLink size={16} className="shrink-0 group-hover:scale-110 transition-transform" />
                <span>{t('view_credential')}</span>
              </a>
            </div>
          )}

          {/* 專業認證群組 — 各群組具備獨立識別強調色 */}
          {groups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];
            const displayedItems = isExpanded ? group.items : group.items.slice(0, 3);
            const hasMore = group.items.length > 3;
            const accent = groupAccents[gIdx % groupAccents.length];
            const GroupIcon = accent.Icon;

            return (
              <div
                key={gIdx}
                className={`cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl backdrop-blur-xl reveal-scale reveal-d${((gIdx % 2) + 2) as 2 | 3}`}
                style={{
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
                    : 'linear-gradient(135deg, rgba(13, 23, 42, 0.50) 0%, rgba(6, 12, 24, 0.60) 100%)',
                  borderColor: isLight ? accent.border : `${accent.main}55`,
                  boxShadow: isLight
                    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 10px 25px rgba(15, 23, 42, 0.05)'
                    : `inset 0 1px 0 0 rgba(255, 255, 255, 0.16), 0 16px 36px -10px rgba(0, 0, 0, 0.6), 0 0 20px ${accent.main}12`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 border cyber-cut-sm shrink-0"
                      style={{
                        backgroundColor: accent.bg,
                        borderColor: accent.border,
                        color: accent.main,
                      }}
                    >
                      <GroupIcon size={22} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      {group.group}
                    </h3>
                  </div>

                  <span
                    className="px-3.5 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shadow-xs"
                    style={{
                      backgroundColor: accent.bg,
                      borderColor: accent.border,
                      color: accent.main,
                    }}
                  >
                    {accent.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedItems.map((cert, idx) => (
                    <a
                      key={idx}
                      href={(cert.linkKey && dataMap.driveLinks?.[cert.linkKey]) || cert.driveUrl || dataMap.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 border cyber-cut-sm flex items-center justify-between group transition-all duration-300 hover:border-[var(--neon-cyan)] cursor-pointer shadow-xs backdrop-blur-md"
                      style={{
                        backgroundColor: isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(8, 14, 28, 0.45)',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                        boxShadow: isLight ? 'none' : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <CheckCircle2 size={18} className="shrink-0" style={{ color: accent.main }} />
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-bold font-hud uppercase truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {cert.name}
                          </p>
                          <p className="text-xs font-tech font-semibold truncate" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                            {cert.org}
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={15} className="group-hover:scale-110 transition-transform shrink-0" style={{ color: accent.main }} />
                    </a>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => toggleGroup(gIdx)}
                      className="px-6 sm:px-7 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm cursor-pointer hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-xs"
                      style={{
                        backgroundColor: accent.bg,
                        borderColor: accent.border,
                        color: accent.main,
                      }}
                    >
                      <span>
                        {isExpanded
                          ? (lang === 'zh' ? '收起證照' : 'COLLAPSE CREDENTIALS')
                          : (lang === 'zh' ? '檢視更多' : 'VIEW MORE')}
                      </span>
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
