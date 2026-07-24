import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects.json';
import { Play, Trophy, Calendar, Cpu, Layers, Gamepad2, Globe, Sparkles, Video } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

// Projects Component: Single YouTube Demo Button & Vertically Centered Alignment (items-center)
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
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={16} /> },
  ];

  return (
    <section id="projects" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          {lang === 'en' && (
            <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block mb-1">
              {t('projects_subtitle')}
            </span>
          )}
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

        {/* Fullstack Web Empty State Notice */}
        {filteredProjects.length === 0 && (
          <div className="p-12 rounded-2xl glass-card text-center max-w-2xl mx-auto space-y-4 border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Sparkles size={32} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">
              {lang === 'zh' ? '全端開發實力展示' : 'Fullstack Development Expertise'}
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
              {lang === 'zh'
                ? '個人專案作品主要聚焦於 3D/VR/AR 互動遊戲與國科會計畫。本個人作品集網站即為採用 React、Vite、Java Spring Boot API、Sass/SCSS 與 Tailwind CSS 所獨立開發打造之個人全端網站專案展示。'
                : 'Project portfolio primarily focuses on 3D/VR/AR interactive games and NSTC research projects. This portfolio website serves as an authentic fullstack showcase built with React, Vite, Spring Boot, Sass, and Tailwind CSS.'}
            </p>
          </div>
        )}

        {/* Full-Width Horizontal Rows List: Vertically Centered (items-center) */}
        <div className="space-y-8">
          {filteredProjects.map((project) => {
            const title = lang === 'zh' ? project.title : project.title_en;
            const desc = lang === 'zh' ? project.desc : project.desc_en;
            const honorsList = lang === 'zh' ? project.honors : project.honors_en;
            const contribs = lang === 'zh' ? project.contributions : project.contributions_en;

            return (
              <article
                key={project.id}
                className="project-card glass-card rounded-2xl overflow-hidden group p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center transition-all duration-300 border border-[var(--border-color)] shadow-sm"
              >
                {/* Left Side: 16:9 Preview */}
                <div className="w-full lg:w-5/12 shrink-0 space-y-4">
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800">
                    <img
                      src={getAssetUrl(project.image)}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" aria-hidden="true" />

                    {/* Date Badge */}
                    {project.date && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/10 text-slate-300 font-code text-[10px] backdrop-blur-md">
                        <Calendar size={10} className="text-cyan-400" />
                        <span>{project.date}</span>
                      </div>
                    )}

                    {/* Play Video Button */}
                    <button
                      onClick={() => onOpenYoutube(project.ytId, title)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform cursor-pointer"
                      title="YouTube 播放展示"
                      aria-label={`YouTube 播放展示: ${title}`}
                    >
                      <Play size={22} className="ml-1 fill-white" />
                    </button>
                  </div>

                  {/* Single Unified Action Button: YouTube Demo Showcase */}
                  <div>
                    <button
                      onClick={() => onOpenYoutube(project.ytId, title)}
                      className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-code text-sm font-bold flex items-center justify-center gap-2 border border-red-500 shadow-md shadow-red-600/20 transition-all cursor-pointer"
                    >
                      <Video size={18} className="text-white" />
                      <span>{lang === 'zh' ? 'YouTube 播放展示' : 'YouTube Demo'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Title, Details, Honors, Contributions */}
                <div className="w-full lg:w-7/12 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] group-hover:text-cyan-500 transition-colors">
                      {title}
                    </h3>
                    <p className="text-[var(--text-sub)] text-sm sm:text-base leading-relaxed">
                      {desc}
                    </p>

                    {/* Honors List */}
                    {honorsList && honorsList.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {honorsList.map((honorItem, hIdx) => (
                          <div
                            key={hIdx}
                            className="px-3.5 py-2 rounded-xl border flex items-start gap-2 text-xs sm:text-sm font-bold"
                            style={{
                              backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.08)',
                              borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.25)',
                              color: isLight ? '#92400e' : '#fcd34d',
                            }}
                          >
                            <Trophy size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                            <span className="leading-relaxed">{honorItem}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technical Contributions */}
                    {contribs && contribs.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-code font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                          <Cpu size={14} />
                          <span>{lang === 'zh' ? '個人技術貢獻與核心架構' : 'Technical Contributions & Architecture'}</span>
                        </div>
                        <ul className="p-4 rounded-xl space-y-2 text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed border"
                          style={{ backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.7)', borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)' }}>
                          {contribs.map((item, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2">
                              <span className="text-cyan-500 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Tools Tags */}
                  <div className="pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)' }}>
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="tech-tag text-xs font-code px-3 py-1 rounded-md font-bold border"
                        style={{ backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.8)', borderColor: isLight ? '#bae6fd' : 'rgba(255,255,255,0.08)', color: isLight ? '#0369a1' : '#22d3ee' }}>
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
