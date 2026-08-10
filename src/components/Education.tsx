import React, { useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  ExternalLink,
  Briefcase,
  Building2,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  School,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';
import eduData from '../data/experience-section.json';

interface DegreeButton {
  key: string;
  label: string;
  linkKey: string;
}

interface DegreeItem {
  id: string;
  school: string;
  period: string;
  desc: string;
  type: string;
  buttons: DegreeButton[];
}

interface WorkExperienceItem {
  company: string;
  company_en?: string;
  role: string;
  role_en?: string;
  period: string;
  summary: string;
  summary_en?: string;
  projectsHeader: string;
  projectsHeader_en?: string;
  projects: string[];
  projects_en?: string[];
  skillsHeader: string;
  skillsHeader_en?: string;
  tags: string[];
}

interface WorkshopItem {
  title: string;
  date: string;
  org: string;
  iconType: string;
  driveLinkKey: string;
  btnText: string;
  skillsHeader: string;
  skills: string[];
}

interface ThesisItem {
  title: string;
  venue: string;
  desc: string;
  driveLinkKey: string;
  btnText: string;
  slidesDriveLinkKey?: string;
  slidesBtnText?: string;
  award?: string;
}

interface SectionData {
  degrees: DegreeItem[];
  workExperiences: WorkExperienceItem[];
  workshops: WorkshopItem[];
  theses: ThesisItem[];
}

export const Education: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dataMap = eduData as unknown as Record<Language, SectionData> & { driveLinks: Record<string, string> };
  const currentData: SectionData = dataMap[lang] ?? dataMap.zh;
  const driveLinks = dataMap.driveLinks;

  const [showAllWorkshops, setShowAllWorkshops] = useState(false);
  const [showAllTheses, setShowAllTheses] = useState(false);

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  // Strict Sequential Palette Accent Loop for item ordering distinction: 藍 -> 紫 -> 綠 -> 黃
  const sequenceAccents = [
    // 1: 藍 (Blue / Cyan)
    { main: isLight ? '#0284c7' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)', border: isLight ? '#38bdf8' : '#00f0ff' },
    // 2: 紫 (Purple / Violet)
    { main: isLight ? '#7c3aed' : '#c084fc', bg: isLight ? '#f3e8ff' : 'rgba(168, 85, 247, 0.12)', border: isLight ? '#c084fc' : '#a855f7' },
    // 3: 綠 (Green / Emerald)
    { main: isLight ? '#059669' : '#34d399', bg: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.12)', border: isLight ? '#34d399' : '#10b981' },
    // 4: 黃 (Yellow / Amber Gold)
    { main: isLight ? '#b45309' : '#fbbf24', bg: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)', border: isLight ? '#fcd34d' : '#f59e0b' },
  ];

  return (
    <section id="experience" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-16">

        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div
            className="inline-flex items-center gap-2 font-tech text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 border cyber-cut-sm shadow-sm"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#080e1a',
              borderColor: borderCol,
              color: cyanCol,
            }}
          >
            <Briefcase size={15} />
            <span>{lang === 'zh' ? '學歷與職涯經歷' : 'EXPERIENCE & EDUCATION'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            <Briefcase size={34} className="text-cyan-400 shrink-0" />
            <span>{t('exp_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('exp_intro')}
          </p>
        </div>

        {/* Master Experience Container */}
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Sub-section 1: Degrees (教育學歷 - 藍 / 紫 順序) */}
          <div
            id="education-degrees"
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl"
            style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)', borderColor: borderCol }}
          >
            <div className="flex items-center gap-3 border-b border-slate-700/40 pb-4">
              <div
                className="p-3 border cyber-cut-sm shrink-0"
                style={{
                  backgroundColor: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)',
                  borderColor: isLight ? '#38bdf8' : 'rgba(0,240,255,0.35)',
                  color: cyanCol,
                }}
              >
                <GraduationCap size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('degree_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.degrees.map((deg, dIdx) => {
                const accent = sequenceAccents[dIdx % sequenceAccents.length];

                return (
                  <div
                    key={deg.id}
                    className="p-5 border cyber-cut-sm space-y-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                      borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                      <div>
                        <h4 className="text-lg sm:text-xl font-black font-hud uppercase flex items-center gap-2.5" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          <School size={20} className="shrink-0" style={{ color: accent.main }} />
                          <span>{deg.school}</span>
                        </h4>
                        <p className="text-xs font-tech font-bold pl-7 font-mono" style={{ color: accent.main }}>
                          {deg.period}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                      {deg.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      {deg.buttons.map((btn, bIdx) => (
                        <a
                          key={bIdx}
                          href={driveLinks[btn.linkKey]}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 sm:px-6 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                          style={{
                            backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                            borderColor: cyanCol,
                            color: isLight ? '#0369a1' : '#00f0ff',
                          }}
                        >
                          <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                          <span>{btn.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-section 2: Work Experience (工作經歷 - 藍 / 紫 / 綠 / 黃 順序) */}
          <div
            id="work-experience"
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl"
            style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)', borderColor: borderCol }}
          >
            <div className="flex items-center gap-3 border-b border-slate-700/40 pb-4">
              <div
                className="p-3 border cyber-cut-sm shrink-0"
                style={{
                  backgroundColor: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)',
                  borderColor: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)',
                  color: isLight ? '#7c3aed' : '#a855f7',
                }}
              >
                <Building2 size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('work_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.workExperiences.map((job, jIdx) => {
                const accent = sequenceAccents[jIdx % sequenceAccents.length];

                return (
                  <div
                    key={jIdx}
                    className="p-5 border cyber-cut-sm space-y-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                      borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                      <div>
                        <h4 className="text-lg sm:text-xl font-black font-hud uppercase flex items-center gap-2.5" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          <Building2 size={20} className="shrink-0" style={{ color: accent.main }} />
                          <span>{lang === 'zh' ? job.company : (job.company_en || job.company)} • {lang === 'zh' ? job.role : (job.role_en || job.role)}</span>
                        </h4>
                        <p className="text-xs font-tech font-bold pl-7 font-mono" style={{ color: accent.main }}>
                          {job.period}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                      {lang === 'zh' ? job.summary : (job.summary_en || job.summary)}
                    </p>

                    {/* Key Contributions / Projects Header & List */}
                    {job.projects && (
                      <div className="space-y-2 pt-1">
                        <p className="font-tech text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5" style={{ color: accent.main }}>
                          <FolderGit2 size={16} className="shrink-0" />
                          <span>{lang === 'zh' ? job.projectsHeader : (job.projectsHeader_en || job.projectsHeader)}：</span>
                        </p>
                        <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1.5 pl-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                          {(lang === 'zh' ? job.projects : (job.projects_en || job.projects)).map((proj, pIdx) => (
                            <li key={pIdx} className="leading-relaxed">{proj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {job.tags.map((tg, tIdx) => (
                        <span key={tIdx} className="tech-tag px-3 py-1 border text-xs sm:text-sm font-semibold">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-section 3: Workshops & Training (研習與受訓歷程 - 藍 / 紫 / 綠 / 黃 順序) */}
          <div
            id="workshops"
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl"
            style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)', borderColor: borderCol }}
          >
            <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 border cyber-cut-sm shrink-0"
                  style={{
                    backgroundColor: isLight ? '#d1fae5' : 'rgba(16,185,129,0.12)',
                    borderColor: isLight ? '#34d399' : 'rgba(16,185,129,0.35)',
                    color: isLight ? '#059669' : '#10b981',
                  }}
                >
                  <Award size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  {t('workshop_section_title')}
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              {(showAllWorkshops ? currentData.workshops : currentData.workshops.slice(0, 2)).map((ws, wIdx) => {
                const accent = sequenceAccents[wIdx % sequenceAccents.length];

                return (
                  <div
                    key={wIdx}
                    className="p-5 border cyber-cut-sm space-y-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                      borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                    }}
                  >
                    {/* Header — Title on Left, Action Button on Right in PC mode, Below Title in Mobile mode */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-hud font-bold uppercase flex items-start sm:items-center gap-2 leading-snug" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          <BookOpen size={18} className="shrink-0 mt-0.5 sm:mt-0" style={{ color: accent.main }} />
                          <span>{ws.title}</span>
                        </h4>
                        <p className="text-xs font-tech font-bold pl-6 font-mono" style={{ color: accent.main }}>
                          {ws.date} • {ws.org}
                        </p>
                      </div>

                      {ws.driveLinkKey && (
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                          <a
                            href={driveLinks[ws.driveLinkKey]}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                            style={{
                              backgroundColor: accent.bg,
                              borderColor: accent.border,
                              color: accent.main,
                            }}
                          >
                            <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                            <span>{ws.btnText}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Workshop detailed skills bullet list */}
                    {ws.skills && ws.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-tech text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5" style={{ color: accent.main }}>
                          <CheckCircle2 size={15} className="shrink-0" />
                          <span>{ws.skillsHeader || (lang === 'zh' ? '專業內容與技能學習：' : 'SKILLS & KEY LEARNINGS:')}</span>
                        </p>
                        <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1 pl-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                          {ws.skills.map((sk, skIdx) => (
                            <li key={skIdx} className="leading-relaxed">{sk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {currentData.workshops.length > 2 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowAllWorkshops(!showAllWorkshops)}
                  className="px-5 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm cursor-pointer hover:scale-105 transition-all shadow-sm inline-flex items-center gap-2"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#080e1a',
                    borderColor: cyanCol,
                    color: cyanCol,
                  }}
                >
                  <span>
                    {showAllWorkshops
                      ? (lang === 'zh' ? '收起研習證明' : 'COLLAPSE WORKSHOPS')
                      : (lang === 'zh' ? '檢視更多研習證明' : 'VIEW MORE WORKSHOPS')}
                  </span>
                  {showAllWorkshops ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            )}
          </div>

          {/* Sub-section 4: Academic Theses & Publications (學術論文與發表 - 藍 / 紫 / 綠 / 黃 順序) */}
          {currentData.theses && currentData.theses.length > 0 && (
            <div
              id="publications"
              className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-xl"
              style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)', borderColor: borderCol }}
            >
              <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 border cyber-cut-sm shrink-0"
                    style={{
                      backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.12)',
                      borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.35)',
                      color: isLight ? '#b45309' : '#fbbf24',
                    }}
                  >
                    <BookOpen size={22} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {lang === 'zh' ? '學術論文與發表' : 'THESES & PUBLICATIONS'}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {(showAllTheses ? currentData.theses : currentData.theses.slice(0, 3)).map((th, thIdx) => {
                  const accent = sequenceAccents[thIdx % sequenceAccents.length];

                  return (
                    <div
                      key={thIdx}
                      className="p-5 border cyber-cut-sm space-y-4 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                      style={{
                        backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.75)',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                      }}
                    >
                      {/* Header — Title on Left, Action Buttons on Right in PC mode, Below Title in Mobile mode */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg md:text-xl font-hud font-bold uppercase flex items-start gap-2.5 leading-snug" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            <FileText size={20} className="shrink-0 mt-0.5" style={{ color: accent.main }} />
                            <span>{th.title}</span>
                          </h4>
                          <p className="text-xs sm:text-sm font-tech font-bold pl-7 font-mono" style={{ color: accent.main }}>
                            {th.venue}
                          </p>
                        </div>

                        {/* Action Buttons — Right on PC, Below Title on Mobile */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                          {/* 「檢視論文全文」 */}
                          {th.driveLinkKey && (
                            <a
                              href={driveLinks[th.driveLinkKey]}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                              style={{
                                backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.15)',
                                borderColor: isLight ? '#fcd34d' : '#f59e0b',
                                color: isLight ? '#b45309' : '#fbbf24',
                              }}
                            >
                              <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                              <span>{th.btnText}</span>
                            </a>
                          )}

                          {/* 「檢視論文簡報」 */}
                          {th.slidesDriveLinkKey && (
                            <a
                              href={driveLinks[th.slidesDriveLinkKey]}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                              style={{
                                backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                                borderColor: isLight ? '#38bdf8' : '#00f0ff',
                                color: isLight ? '#0369a1' : '#00f0ff',
                              }}
                            >
                              <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                              <span>{th.slidesBtnText}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                        {th.desc}
                      </p>

                      {th.award && (
                        <div
                          className="p-3.5 border font-tech text-xs sm:text-sm font-bold flex items-center gap-2 cyber-cut-sm"
                          style={{
                            backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.15)',
                            borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.35)',
                            color: isLight ? '#b45309' : '#fbbf24',
                          }}
                        >
                          <Award size={16} className="shrink-0" />
                          <span>{th.award}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {currentData.theses.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllTheses(!showAllTheses)}
                    className="px-5 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm cursor-pointer hover:scale-105 transition-all shadow-sm inline-flex items-center gap-2"
                    style={{
                      backgroundColor: isLight ? '#ffffff' : '#080e1a',
                      borderColor: cyanCol,
                      color: cyanCol,
                    }}
                  >
                    <span>
                      {showAllTheses
                        ? (lang === 'zh' ? '收起論文發表' : 'COLLAPSE PUBLICATIONS')
                        : (lang === 'zh' ? '檢視更多論文發表' : 'VIEW MORE PUBLICATIONS')}
                    </span>
                    {showAllTheses ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default Education;
