import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, ExternalLink, FileText, CheckCircle2, Gamepad2, Video, Box, Code, Trophy } from 'lucide-react';
import eduData from '../data/education.json';

const iconMap = {
  game: Gamepad2,
  video: Video,
  box: Box,
  code: Code,
};

export const Education = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const currentData = eduData[lang] ?? eduData.zh;
  const driveLinks = eduData.driveLinks;

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
    <section id="experience" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 1. Education Section Header */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
              {t('exp_title')}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
              {t('exp_intro')}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
          </div>

          {/* Education Timeline Cards from JSON */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {currentData.degrees.map((deg) => (
              <div
                key={deg.id}
                className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        deg.type === 'master' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                        {deg.school}
                      </h3>
                      <p className="text-xs sm:text-sm font-code text-[var(--text-sub)] mt-0.5">
                        {deg.period}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
                  {deg.desc}
                </p>

                {/* Proof Action Buttons from JSON */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {deg.buttons.map((btn, bIdx) => (
                    <a
                      key={bIdx}
                      href={driveLinks[btn.linkKey]}
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105"
                      style={{ backgroundColor: btnBg, borderColor: btnBdr }}
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

        {/* 2. Workshops Section from JSON */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {t('workshop_section_title')}
            </h3>
            <div className="w-12 h-1 bg-purple-500 mx-auto rounded-full" aria-hidden="true" />
          </div>

          <div className="space-y-6">
            {currentData.workshops.map((ws, wIdx) => {
              const IconComponent = iconMap[ws.iconType] ?? Gamepad2;
              const colorItem = workshopPalette[wIdx % workshopPalette.length];

              return (
                <div
                  key={wIdx}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md"
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
                        <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)]">
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
                      className="h-10 px-4 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs shrink-0 cursor-pointer hover:scale-105"
                      style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                    >
                      <ExternalLink size={14} className="text-cyan-400" />
                      <span>{ws.btnText}</span>
                    </a>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-code font-bold text-[var(--text-sub)] uppercase tracking-wider block">
                      {ws.skillsHeader}
                    </span>
                    <ul className="space-y-2 pl-1">
                      {ws.skills.map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
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

        {/* 3. Thesis Section from JSON */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {t('thesis_section_title')}
            </h3>
            <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" aria-hidden="true" />
          </div>

          <div className="space-y-6">
            {currentData.theses.map((thesis, tIdx) => {
              const isHonor = thesis.award && (thesis.award.includes('獎') || thesis.award.toLowerCase().includes('award'));

              return (
                <div
                  key={tIdx}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                    <div className="flex items-center gap-2.5">
                      <FileText size={22} className={tIdx === 0 ? 'text-cyan-400 shrink-0' : 'text-purple-400 shrink-0'} />
                      <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)]">
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

                  <p className="text-xs sm:text-sm font-code text-[var(--text-sub)] font-semibold">{thesis.venue}</p>

                  {/* Honor Highlight Box for 優良論文獎 (Matching Project Honor design) */}
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

                  <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">{thesis.desc}</p>

                  <div className="pt-1">
                    <a
                      href={driveLinks[thesis.driveLinkKey]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors shadow-xs cursor-pointer hover:scale-105"
                      style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                    >
                      <ExternalLink size={14} className={tIdx === 0 ? 'text-cyan-400' : 'text-purple-400'} />
                      <span>{thesis.btnText}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
