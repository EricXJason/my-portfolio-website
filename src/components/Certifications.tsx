import React, { useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, ExternalLink, Trophy, Award, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import certData from '../data/certifications-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface CertItem {
  name: string;
  org: string;
  linkKey?: string;
  driveUrl?: string;
}

interface CertGroup {
  group: string;
  iconType: string;
  items: CertItem[];
}

export const Certifications: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dataMap = certData as unknown as Record<Language, CertGroup[]> & {
    toeic: { score: string; driveUrl: string };
    driveFolderUrl: string;
    driveLinks?: Record<string, string>;
  };
  const groups: CertGroup[] = dataMap[lang] ?? dataMap.zh;

  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (gIdx: number) => {
    setExpandedGroups((prev) => ({ ...prev, [gIdx]: !prev[gIdx] }));
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  const headerRef    = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const containerRef = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;

  // Distinct color palettes for certification groups to highlight structural hierarchy & order
  const groupAccents = [
    {
      main: isLight ? '#0284c7' : '#00f0ff',
      bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)',
      border: isLight ? '#38bdf8' : 'rgba(0, 240, 255, 0.35)',
      itemBorder: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)',
      badge: lang === 'zh' ? '國家級技能檢定' : 'NATIONAL LICENSES',
      Icon: ShieldCheck,
    },
    {
      main: isLight ? '#7c3aed' : '#c084fc',
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

        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <Award size={34} style={{ color: cyanCol }} className="shrink-0" />
            <span>{t('awards_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('awards_intro')}
          </p>
        </div>

        <div ref={containerRef} className="max-w-6xl mx-auto space-y-10">

          {/* High-Contrast Amber Gold TOEIC 755 Card */}
          <div
            className="p-6 sm:p-7 border cyber-cut-corner flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl backdrop-blur-xl reveal-scale reveal-d1"
            style={{
              backgroundColor: isLight ? '#fffbeb' : '#091328',
              borderColor: isLight ? '#fcd34d' : '#f59e0b',
              boxShadow: isLight ? '0 4px 20px rgba(245,158,11,0.12)' : '0 0 25px rgba(245,158,11,0.25)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3.5 border cyber-cut-sm shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? '#fef3c7' : 'rgba(245,158,11,0.2)',
                  borderColor: isLight ? '#fcd34d' : '#f59e0b',
                  color: isLight ? '#b45309' : '#fbbf24',
                }}
              >
                <Trophy size={28} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-tech text-xs sm:text-sm font-bold uppercase" style={{ color: isLight ? '#b45309' : '#fbbf24' }}>
                    {lang === 'zh' ? '外語能力檢定證明' : 'ENGLISH PROFICIENCY'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  TOEIC 755
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
              className="px-6 sm:px-7 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md"
              style={{
                backgroundColor: isLight ? '#fef3c7' : 'rgba(245,158,11,0.25)',
                borderColor: isLight ? '#fcd34d' : '#f59e0b',
                color: isLight ? '#b45309' : '#fbbf24',
              }}
            >
              <ExternalLink size={15} />
              <span>{t('btn_toeic_proof')}</span>
            </a>
          </div>

          {/* Certification Groups — Distinct Accent Colors per Group */}
          {groups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];
            const displayedItems = isExpanded ? group.items : group.items.slice(0, 3);
            const hasMore = group.items.length > 3;
            const accent = groupAccents[gIdx % groupAccents.length];
            const GroupIcon = accent.Icon;

            return (
              <div
                key={gIdx}
                className={`cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl reveal-scale reveal-d${((gIdx % 2) + 2) as 2 | 3}`}
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)',
                  borderColor: isLight ? accent.border : borderCol,
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
                      className="p-4 border cyber-cut-sm flex items-center justify-between group transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
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
