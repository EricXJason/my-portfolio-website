import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects.json';
import { Play, Trophy, Calendar, Cpu, Layers, Gamepad2, Globe, Sparkles, Video, Layout, ExternalLink } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

export const Projects = ({ onOpenYoutube }) => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('all');

  const filteredProjects = projectsData.filter(
    (p) => filter === 'all' || p.category === filter
  );

  const filters = [
    { key: 'all', label: t('cat_all'), icon: <Layers size={16} /> },
    { key: 'interactive', label: t('cat_interactive'), icon: <Gamepad2 size={16} /> },
    { key: 'frontend', label: t('cat_frontend'), icon: <Layout size={16} /> },
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={16} /> },
  ];

  return (
    <section id="projects" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('projects_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
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
              className={`h-12 px-6 rounded-xl text-sm font-code font-bold transition-all flex items-center gap-2.5 cursor-pointer shadow-sm border-2 ${
                filter === f.key
                  ? 'filter-btn-active bg-slate-900 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                  : 'filter-btn-inactive bg-slate-900/60 text-[var(--text-sub)] border-slate-800 hover:border-cyan-600'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Frontend / Fullstack Web Development Info Notice */}
        {filteredProjects.length === 0 && (
          <div className="p-8 sm:p-12 rounded-2xl glass-card text-center max-w-2xl mx-auto space-y-4 border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Sparkles size={32} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">
              {filter === 'frontend'
                ? (lang === 'zh' ? '前端網頁開發實力展示' : 'Frontend Development Showcase')
                : (lang === 'zh' ? '全端開發實力展示' : 'Fullstack Development Showcase')}
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
              {lang === 'zh'
                ? '個人專案作品主要聚焦於 3D/VR/AR 互動遊戲與國科會計畫。本個人作品集網站即為採用 React、Vite、Java Spring Boot API、Sass/SCSS 與 Tailwind CSS 所獨立開發打造之個人前端與全端網站專案展示。'
                : 'Project portfolio primarily focuses on 3D/VR/AR interactive games and NSTC research projects. This portfolio website serves as an authentic frontend & fullstack showcase built with React, Vite, Spring Boot, Sass, and Tailwind CSS.'}
            </p>
          </div>
        )}

        {/* Project Grid */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {filteredProjects.map((project) => {
            const title = lang === 'zh' ? project.title : (project.title_en || project.title);
            const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
            const honorsList = lang === 'zh' ? project.honors : (project.honors_en || project.honors);
            const contribs = lang === 'zh' ? project.contributions : (project.contributions_en || project.contributions);

            const categoryLabels = {
              interactive: lang === 'zh' ? '互動遊戲' : 'Interactive Game',
              fullstack: lang === 'zh' ? '全端作品' : 'Fullstack',
              frontend: lang === 'zh' ? '前端作品' : 'Frontend',
            };
            const catLabel = categoryLabels[project.category] || 'Project';

            return (
              <article
                key={project.id}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] flex flex-col lg:flex-row gap-8 items-stretch group hover:-translate-y-1.5 transition-all duration-500 shadow-lg"
              >
                {/* Left Side: Thumbnail Preview + Direct Action Button */}
                <div className="w-full lg:w-5/12 flex flex-col justify-start gap-3">
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

                    {/* Play Video Button Overlay */}
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

                  {/* YouTube Direct Link Button */}
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

                {/* Right Side: Header, Title, Honors, Breakdown & Tags */}
                <div className="w-full lg:w-7/12 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3.5">

                    {/* Category Label Pill + Title */}
                    <div className="space-y-1.5">
                      <span className="inline-block text-[11px] font-code font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {catLabel}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] group-hover:text-cyan-500 transition-colors tracking-tight">
                        {title}
                      </h3>
                    </div>

                    {/* Honors List Highlight Box */}
                    {honorsList && honorsList.length > 0 && (
                      <div className="space-y-2 pt-0.5">
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

                    {/* Concise Overview */}
                    <p className="text-[var(--text-sub)] text-sm sm:text-base leading-relaxed font-medium">
                      {desc}
                    </p>

                    {/* Technical Contributions Box */}
                    {contribs && contribs.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-code font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                          <Cpu size={14} />
                          <span>{lang === 'zh' ? '核心架構與技術亮點' : 'Key Architecture & Highlights'}</span>
                        </div>
                        <ul
                          className="p-4 rounded-xl space-y-2 text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed border"
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.7)',
                            borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)'
                          }}
                        >
                          {contribs.map((item, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2.5">
                              <span className="text-cyan-500 font-bold shrink-0 mt-0.5">•</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Tools Tags */}
                  <div className="pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)' }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="tech-tag text-xs font-code px-3 py-1 rounded-lg font-bold border transition-transform hover:scale-105"
                        style={{
                          backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.8)',
                          borderColor: isLight ? '#bae6fd' : 'rgba(255,255,255,0.08)',
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

      </div>
    </section>
  );
};
