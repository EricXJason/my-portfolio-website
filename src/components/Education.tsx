import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  ExternalLink,
  FileText,
  CheckCircle2,
  Gamepad2,
  Video,
  Box,
  Code,
  Trophy,
  Briefcase,
  Building2,
  Layers,
  Presentation,
  LucideIcon
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

const iconMap: Record<string, LucideIcon> = {
  game: Gamepad2,
  video: Video,
  box: Box,
  code: Code,
};

export const Education: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const dataMap = eduData as unknown as Record<Language, SectionData> & { driveLinks: Record<string, string> };
  const currentData: SectionData = dataMap[lang] ?? dataMap.zh;
  const driveLinks = dataMap.driveLinks;

  const btnBg = isLight ? '#ffffff' : '#0f172a';
  const btnBdr = isLight ? '#cbd5e1' : '#334155';

  const workshopPalette = [
    { text: '#06b6d4', bg: isLight ? '#ecfeff' : 'rgba(6,182,212,0.12)', border: isLight ? '#a5f3fc' : 'rgba(6,182,212,0.3)' },
    { text: '#a855f7', bg: isLight ? '#faf5ff' : 'rgba(168,85,247,0.12)', border: isLight ? '#e9d5ff' : 'rgba(168,85,247,0.3)' },
    { text: '#10b981', bg: isLight ? '#ecfdf5' : 'rgba(16,185,129,0.12)', border: isLight ? '#a7f3d0' : 'rgba(16,185,129,0.3)' },
    { text: '#f59e0b', bg: isLight ? '#fffbeb' : 'rgba(245,158,11,0.12)', border: isLight ? '#fcd34d' : 'rgba(245,158,11,0.3)' },
    { text: '#ec4899', bg: isLight ? '#fdf2f8' : 'rgba(236,72,153,0.12)', border: isLight ? '#fbcfe8' : 'rgba(236,72,153,0.3)' },
  ];

  return (
    <section id="experience" className="py-16 sm:py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* Master Section Header: 經歷 */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            {t('exp_title')}
          </h2>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-[var(--text-sub)]">
            {t('exp_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Master Content Card — 100% matched to About & Certifications container width */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 border border-[var(--border-color)] shadow-xl max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-12">

          {/* ── Sub-section 1: 學歷 ── */}
          <div id="education-degrees" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <GraduationCap size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('degree_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.degrees.map((deg) => (
                <div
                  key={deg.id}
                  className="p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                  }}
                >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        deg.type === 'master' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {deg.school}
                      </h4>
                      <p className="text-xs sm:text-sm font-code font-semibold mt-0.5" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                        {deg.period}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                  {deg.desc}
                </p>

                {/* Proof Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {deg.buttons.map((btn, bIdx) => (
                    <a
                      key={bIdx}
                      href={driveLinks[btn.linkKey]}
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 px-5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105"
                      style={{
                        backgroundColor: btnBg,
                        borderColor: btnBdr,
                        color: isLight ? '#0f172a' : '#ffffff',
                      }}
                    >
                      <ExternalLink
                        size={14}
                        className={deg.type === 'master' ? 'text-cyan-400' : 'text-purple-400'}
                      />
                      <span>{btn.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* ── Sub-section 2: 工作經歷 ── */}
          <div id="work-experience" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Briefcase size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('work_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.workExperiences && currentData.workExperiences.map((job, jIdx) => (
                <div
                  key={jIdx}
                  className="p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-5 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                  }}
                >
                {/* Job Header: Company & Role Side-by-Side with Left Icon Badge */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        jIdx === 0
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {jIdx === 0 ? <Building2 size={24} /> : <Gamepad2 size={24} />}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                      <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {lang === 'zh' ? job.company : (job.company_en || job.company)}
                      </h4>
                      <span className="hidden sm:inline text-slate-500 font-bold">•</span>
                      <span className="text-xl sm:text-2xl font-extrabold" style={{ color: jIdx === 0 ? '#06b6d4' : '#a855f7' }}>
                        {lang === 'zh' ? job.role : (job.role_en || job.role)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="px-3.5 py-1.5 rounded-xl font-code text-xs font-bold border shrink-0"
                    style={{
                      backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.8)',
                      borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
                      color: isLight ? '#0369a1' : '#22d3ee',
                    }}
                  >
                    {job.period}
                  </div>
                </div>

                {/* Job Summary */}
                <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                  {lang === 'zh' ? job.summary : (job.summary_en || job.summary)}
                </p>

                {/* Projects List */}
                {job.projects && job.projects.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-code font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                      {lang === 'zh' ? job.projectsHeader : (job.projectsHeader_en || job.projectsHeader)}
                    </span>
                    <ul
                      className="space-y-2.5 p-4 rounded-xl border font-normal text-xs sm:text-sm"
                      style={{
                        backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.7)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
                        color: isLight ? '#1e293b' : '#e2e8f0'
                      }}
                    >
                      {(lang === 'zh' ? job.projects : (job.projects_en || job.projects)).map((projItem, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{projItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Scope Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-code font-bold mr-1" style={{ color: isLight ? '#475569' : '#cbd5e1' }}>
                      {lang === 'zh' ? job.skillsHeader : (job.skillsHeader_en || job.skillsHeader)}
                    </span>
                    {job.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-code px-3 py-1 rounded-lg font-bold border transition-transform hover:scale-105"
                        style={{
                          backgroundColor: isLight ? '#fdf4ff' : 'rgba(168,85,247,0.12)',
                          borderColor: isLight ? '#f5d0fe' : 'rgba(168,85,247,0.3)',
                          color: isLight ? '#9333ea' : '#c084fc',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>

          {/* ── Sub-section 3: 研習歷程 ── */}
          <div id="workshops" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('workshop_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.workshops.map((ws, wIdx) => {
                const IconComponent = iconMap[ws.iconType] ?? Gamepad2;
                const colorItem = workshopPalette[wIdx % workshopPalette.length];

                return (
                  <div
                    key={wIdx}
                    className="p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: colorItem.bg,
                            borderColor: colorItem.border,
                            color: colorItem.text,
                          }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-lg sm:text-xl" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {ws.title}
                          </h4>
                          <p className="text-xs sm:text-sm font-code text-cyan-600 dark:text-cyan-400 font-bold mt-1">
                            {ws.org} ({ws.date})
                          </p>
                        </div>
                      </div>

                      <a
                        href={driveLinks[ws.driveLinkKey]}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 px-4 rounded-xl border text-xs font-bold transition-colors flex items-center gap-2 shadow-xs shrink-0 cursor-pointer hover:scale-105"
                        style={{ backgroundColor: btnBg, borderColor: btnBdr, color: isLight ? '#0f172a' : '#ffffff' }}
                      >
                        <ExternalLink size={14} className="text-cyan-400" />
                        <span>{ws.btnText}</span>
                      </a>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-code font-bold uppercase tracking-wider block" style={{ color: isLight ? '#475569' : '#cbd5e1' }}>
                        {ws.skillsHeader}
                      </span>
                      <ul className="space-y-2 pl-1 font-normal text-xs sm:text-sm" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                        {ws.skills.map((skill, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sub-section 4: 論文與期刊 ── */}
          <div id="publications" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('thesis_section_title')}
              </h3>
            </div>

            <div className="space-y-6">
              {currentData.theses.map((thesis, tIdx) => {
                const isHonor = thesis.award && (thesis.award.includes('獎') || thesis.award.toLowerCase().includes('award'));

                return (
                  <div
                    key={tIdx}
                    className="p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                      <div className="flex items-center gap-2.5">
                        <FileText size={22} className={tIdx === 0 ? 'text-cyan-400 shrink-0' : 'text-purple-400 shrink-0'} />
                        <h4 className="font-extrabold text-lg sm:text-xl" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {thesis.title}
                        </h4>
                      </div>

                      {!isHonor && thesis.award && (
                        <span
                          className="px-3 py-1 rounded-lg font-code text-xs font-bold shrink-0 border bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300"
                        >
                          {thesis.award}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-code font-semibold" style={{ color: isLight ? '#475569' : '#cbd5e1' }}>{thesis.venue}</p>

                    {/* Honor Highlight Box */}
                    {isHonor && (
                      <div
                        className="px-4 py-2 rounded-xl border inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-xs max-w-fit"
                        style={{
                          backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.1)',
                          borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.3)',
                          color: isLight ? '#b45309' : '#fbbf24',
                        }}
                      >
                        <Trophy size={16} className="text-amber-500 shrink-0" />
                        <span>{thesis.award}</span>
                      </div>
                    )}

                    <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>{thesis.desc}</p>

                    {/* Thesis Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={driveLinks[thesis.driveLinkKey]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
                        style={{ backgroundColor: btnBg, borderColor: btnBdr, color: isLight ? '#0f172a' : '#ffffff' }}
                      >
                        <ExternalLink size={14} className={tIdx === 0 ? 'text-cyan-400' : 'text-purple-400'} />
                        <span>{thesis.btnText}</span>
                      </a>

                      {thesis.slidesDriveLinkKey && (
                        <a
                          href={driveLinks[thesis.slidesDriveLinkKey]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
                          style={{
                            backgroundColor: isLight ? '#f0f9ff' : 'rgba(6,182,212,0.12)',
                            borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
                            color: isLight ? '#0369a1' : '#22d3ee',
                          }}
                        >
                          <Presentation size={15} className="shrink-0 text-cyan-500" />
                          <span>{thesis.slidesBtnText}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
