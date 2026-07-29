import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects-section.json';
import { Play, Trophy, Calendar, Cpu, Layers, Gamepad2, Globe, Sparkles, Video, ExternalLink, Bot, Star, ArrowRight } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

export const Projects = ({ onOpenYoutube }) => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('featured');

  const filteredProjects = projectsData.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'featured') return p.featured === true;
    return p.category === filter;
  });

  const filters = [
    { key: 'all', label: t('cat_all'), icon: <Layers size={16} /> },
    { key: 'featured', label: t('cat_featured'), icon: <Star size={16} className="text-amber-400 fill-amber-400" /> },
    { key: 'interactive', label: t('cat_interactive'), icon: <Gamepad2 size={16} /> },
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={16} /> },
    { key: 'linebot', label: t('cat_linebot'), icon: <Bot size={16} /> },
  ];

  return (
    <section id="projects" className="py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            {t('projects_title')}
          </h2>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-[var(--text-sub)]">
            {t('projects_note')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              role="tab"
              aria-selected={filter === f.key}
              className={`h-12 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-code font-bold transition-all flex items-center gap-2.5 cursor-pointer shadow-sm border-2 ${
                filter === f.key
                  ? 'filter-btn-active bg-slate-900 text-white border-cyan-500 shadow-md shadow-cyan-500/20 scale-105'
                  : 'filter-btn-inactive bg-slate-900/60 text-[var(--text-sub)] border-slate-800 hover:border-cyan-600'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Empty State Fallback */}
        {filteredProjects.length === 0 && (
          <div className="p-8 sm:p-12 rounded-2xl glass-card text-center max-w-2xl mx-auto space-y-4 border border-slate-800 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Sparkles size={32} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              {lang === 'zh' ? '專案整理與開發進行中' : 'Projects Under Active Development'}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
              {lang === 'zh'
                ? '此分類之專案目前正在持續開發與整備中，歡迎點擊精選作品與互動應用開發觀看精選成果。'
                : 'Projects in this category are currently under development. Please check out Featured Works and Interactive App Dev projects.'}
            </p>
          </div>
        )}

        {/* Project Grid */}
        <div className="space-y-12 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          {filteredProjects.map((project) => {
            const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
            const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
            const honorsList = lang === 'zh' ? project.honors : (project.honors_en || project.honors);
            const contribs = lang === 'zh' ? project.contributions : (project.contributions_en || project.contributions);

            return (
              <article
                key={project.id}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] flex flex-col lg:flex-row gap-8 items-stretch group hover:-translate-y-1.5 transition-all duration-500 shadow-lg"
              >
                {/* Left Side: Thumbnail Preview + Direct Action Button */}
                <div className="w-full lg:w-5/12 flex flex-col justify-between gap-4">
                  <div
                    className="relative aspect-video w-full rounded-2xl overflow-hidden cursor-pointer group/video border border-slate-800/40 shadow-inner"
                    onClick={() => onOpenYoutube(project.ytId, title)}
                  >
                    <img
                      src={getAssetUrl(project.image)}
                      alt={title}
                      className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" aria-hidden="true" />

                    {/* Date Badge */}
                    {project.date && (
                      <div
                        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg font-code text-xs font-bold shadow-md border backdrop-blur-md"
                        style={{
                          backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.9)',
                          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                          color: isLight ? '#0f172a' : '#f8fafc',
                        }}
                      >
                        <Calendar size={12} className={isLight ? 'text-cyan-600' : 'text-cyan-400'} />
                        <span>{project.date}</span>
                      </div>
                    )}

                    {/* Play Video Overlay */}
                    <div
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover/video:bg-red-600 group-hover/video:scale-110 transition-all duration-300 border"
                      style={{
                        backgroundColor: isLight ? 'rgba(15,23,42,0.85)' : 'rgba(3,7,18,0.85)',
                        borderColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                      }}
                      aria-hidden="true"
                    >
                      <Play size={22} className="ml-1 fill-white text-white" />
                    </div>
                  </div>

                  {/* Direct YouTube Link Button */}
                  <div>
                    <a
                      href={`https://www.youtube.com/watch?v=${project.ytId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-11 rounded-xl font-code text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border shadow-xs transition-all duration-300 cursor-pointer"
                      style={{
                        backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.85)',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                        color: isLight ? '#0f172a' : '#cbd5e1',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = isLight ? '#ffffff' : 'rgba(15,23,42,0.85)';
                        e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.color = isLight ? '#0f172a' : '#cbd5e1';
                      }}
                    >
                      <Video size={16} className="shrink-0" />
                      <span>{lang === 'zh' ? '▶ YouTube 播放展示' : '▶ Watch on YouTube'}</span>
                      <ExternalLink size={13} className="opacity-70 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Right Side: Title, Desc, Tech Highlights FIRST, Honors SECOND */}
                <div className="w-full lg:w-7/12 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3.5">

                    {/* Project Title */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold group-hover:text-cyan-500 transition-colors tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {title}
                      </h3>
                    </div>

                    {/* Overview Bio — font-normal/medium for comfortable reading */}
                    <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                      {desc}
                    </p>

                    {/* Technical Contributions Box */}
                    {contribs && contribs.length > 0 && (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-code font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                          <Cpu size={14} />
                          <span>{lang === 'zh' ? '核心架構與技術亮點' : 'Key Architecture & Highlights'}</span>
                        </div>
                        <ul
                          className="p-4 rounded-xl space-y-2.5 text-xs sm:text-sm leading-relaxed border font-normal"
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.7)',
                            borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
                            color: isLight ? '#1e293b' : '#e2e8f0'
                          }}
                        >
                          {contribs.map((item, cIdx) => {
                            const parts = item.split(/(:|：)/);
                            const hasLabel = parts.length >= 3;

                            return (
                              <li key={cIdx} className="flex items-start gap-2.5">
                                <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
                                <span className="leading-relaxed">
                                  {hasLabel ? (
                                    <>
                                      <span
                                        className="font-bold font-code px-1.5 py-0.5 rounded mr-1.5"
                                        style={{
                                          backgroundColor: isLight ? '#e0f2fe' : 'rgba(6,182,212,0.18)',
                                          color: isLight ? '#0369a1' : '#38bdf8',
                                          border: isLight ? '1px solid #bae6fd' : '1px solid rgba(6,182,212,0.3)',
                                        }}
                                      >
                                        {parts[0]}
                                      </span>
                                      {parts.slice(2).join('')}
                                    </>
                                  ) : (
                                    item
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Honors List Highlight Box */}
                    {honorsList && honorsList.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {honorsList.map((honorItem, hIdx) => (
                          <div
                            key={hIdx}
                            className="px-4 py-2.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm font-bold shadow-xs"
                            style={{
                              backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.08)',
                              borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.25)',
                              color: isLight ? '#92400e' : '#fcd34d',
                            }}
                          >
                            <Trophy size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                            <span className="leading-relaxed">{honorItem}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specialized Tools Tags */}
                  <div className="pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)' }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="tech-tag text-xs font-code px-3 py-1 rounded-lg font-bold border transition-transform hover:scale-105 shadow-xs"
                        style={{
                          backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.9)',
                          borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
                          color: isLight ? '#0369a1' : '#22d3ee'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Expand All Works Button when viewing Featured Works (Keeps current scroll position!) */}
        {filter === 'featured' && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setFilter('all');
                // Stay inline without auto-scrolling to top!
              }}
              className="px-8 py-3.5 rounded-2xl font-code font-bold text-sm transition-all duration-300 inline-flex items-center gap-3 cursor-pointer shadow-lg hover:scale-105 active:scale-95 border-2"
              style={{
                backgroundColor: isLight ? '#0f172a' : '#1e293b',
                borderColor: '#06b6d4',
                color: '#ffffff',
              }}
            >
              <span>{lang === 'zh' ? '展開全部作品' : 'Expand All Works'}</span>
              <ArrowRight size={18} className="text-cyan-400" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
