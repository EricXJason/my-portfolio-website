import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Languages, Box, CheckCircle2, ExternalLink, Trophy, Award } from 'lucide-react';
import certData from '../data/certifications.json';

const groupIconMap = {
  languages: Languages,
  box: Box,
};

export const Certifications = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const groups = certData[lang] ?? certData.zh;

  return (
    <section id="awards" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('awards_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
            {t('awards_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-[var(--border-color)] shadow-xl max-w-5xl mx-auto space-y-8">

          {/* ── TOEIC 755 Card ── */}
          <div
            className="p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
            style={{
              backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.06)',
              borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.3)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 shrink-0">
                <Trophy size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-code font-bold tracking-widest uppercase text-amber-500 mb-0.5">
                  {lang === 'zh' ? '英文能力檢定' : 'English Proficiency'}
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
                  TOEIC 755
                </h3>
                <p className="text-xs text-[var(--text-sub)] font-code mt-0.5">
                  {lang === 'zh' ? 'ETS 多益英語測驗成績' : 'ETS Test of English for International Communication'}
                </p>
              </div>
            </div>
            <a
              href={certData.toeic.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-xl font-code text-sm font-bold transition-all border-2"
              style={{
                borderColor: isLight ? '#f59e0b' : 'rgba(245,158,11,0.5)',
                color: isLight ? '#b45309' : '#fbbf24',
                backgroundColor: isLight ? '#ffffff' : 'transparent',
              }}
            >
              <ExternalLink size={15} />
              <span>{t('btn_toeic_proof')}</span>
            </a>
          </div>

          {/* ── Certification Groups ── */}
          {groups.map((group, gIdx) => {
            const IconComp = groupIconMap[group.iconType] ?? Award;
            return (
              <div key={gIdx} className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl border" style={{ backgroundColor: isLight ? '#f1f5f9' : '#0f172a', borderColor: isLight ? '#cbd5e1' : '#1e293b' }}>
                    <IconComp size={20} className={gIdx === 0 ? 'text-cyan-400' : 'text-purple-400'} />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] tracking-wide">
                    {group.group}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((cert, idx) => (
                    <a
                      key={idx}
                      href={certData.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded-xl border transition-all flex items-center justify-between group shadow-xs"
                      style={{
                        backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.6)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)'; }}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <CheckCircle2 size={18} className="text-cyan-500 shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-bold text-[var(--text-main)] truncate">
                            {cert.name}
                          </p>
                          <p className="text-xs text-[var(--text-sub)] font-code truncate mt-0.5">{cert.org}</p>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Drive Folder Button (Theme Designed for both light and dark) */}
          <div className="pt-6 border-t border-slate-800/40 text-center">
            <a
              href={certData.driveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border-2 font-code text-sm font-bold transition-all shadow-md cursor-pointer"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#0f172a',
                borderColor: isLight ? '#06b6d4' : '#06b6d4',
                color: isLight ? '#0284c7' : '#38bdf8',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isLight ? '#f0f9ff' : 'rgba(6,182,212,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = isLight ? '#ffffff' : '#0f172a';
                e.currentTarget.style.transform = '';
              }}
            >
              <ExternalLink size={16} className="text-cyan-500" />
              <span>{t('btn_view_drive_folder')}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
