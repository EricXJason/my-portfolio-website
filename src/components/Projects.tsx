import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects-section.json';
import { Trophy, Calendar, Cpu, Layers, Gamepad2, Globe, Sparkles, Video, ExternalLink, Bot, Star, Layout, ChevronDown } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

interface ProjectItem {
  id: string;
  title_zh: string;
  title_en?: string;
  category: string;
  featured: boolean;
  featuredOrder?: number;
  order?: number;
  image: string;
  ytId?: string;
  websiteUrl?: string;
  githubUrl?: string;
  aiAssisted?: boolean;
  honors: string[];
  honors_en?: string[];
  desc: string;
  desc_en?: string;
  contributions: string[];
  contributions_en?: string[];
  tags: string[];
  date: string;
}

interface ProjectsProps {
  onOpenYoutube: (videoId: string, title: string) => void;
}

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export const Projects: React.FC<ProjectsProps> = ({ onOpenYoutube }) => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('featured');
  const [showAllProjects, setShowAllProjects] = useState(false);

  const projects = projectsData as ProjectItem[];

  const filteredProjects = projects
    .filter((p) => {
      if (filter === 'all') return true;
      if (filter === 'featured') return p.featured === true;
      return p.category === filter;
    })
    .sort((a, b) => {
      if (filter === 'featured') {
        return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
      }
      return (a.order ?? 999) - (b.order ?? 999);
    });

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 3);

  const filters = [
    { key: 'featured', label: t('cat_featured'), icon: <Star size={16} className="text-amber-400 fill-amber-400" /> },
    { key: 'all', label: t('cat_all'), icon: <Layers size={16} /> },
    { key: 'interactive', label: t('cat_interactive'), icon: <Gamepad2 size={16} /> },
    { key: 'frontend', label: t('cat_frontend'), icon: <Layout size={16} /> },
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={16} /> },
    { key: 'linebot', label: t('cat_linebot'), icon: <Bot size={16} /> },
  ];

  return (
    <section id="projects" className="py-16 sm:py-24 relative select-text">
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

        {/* Category Filter Buttons — Centered, compact inline-flex with balanced min-width */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3 mb-10 sm:mb-12 mx-auto max-w-4xl px-2 sm:px-4 py-1" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              role="tab"
              aria-selected={filter === f.key}
              className={`h-10 sm:h-12 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-code font-bold transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm border-2 min-w-[110px] xs:min-w-[125px] sm:min-w-[140px] ${
                filter === f.key
                  ? 'filter-btn-active scale-105'
                  : 'filter-btn-inactive'
              }`}
            >
              {f.icon}
              <span className="whitespace-nowrap">{f.label}</span>
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

        {/* Master Content Card — 100% matched to About & Certifications container width */}
        <div className="glass-card rounded-2xl p-4 sm:p-8 border border-[var(--border-color)] shadow-xl max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {visibleProjects.map((project) => {
            const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
            const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
            const honorsList = lang === 'zh' ? project.honors : (project.honors_en || project.honors);
            const contribs = lang === 'zh' ? project.contributions : (project.contributions_en || project.contributions);

            // Styling Tokens for Theme-Aware Action Buttons
            const webBtnStyle = {
              bg: isLight ? 'rgba(240, 249, 255, 0.95)' : 'rgba(14, 116, 144, 0.12)',
              border: isLight ? '#bae6fd' : 'rgba(6, 182, 212, 0.3)',
              color: isLight ? '#0369a1' : '#38bdf8',
            };

            const ytBtnStyle = {
              bg: isLight ? 'rgba(255, 241, 242, 0.95)' : 'rgba(225, 29, 72, 0.12)',
              border: isLight ? '#fecdd3' : 'rgba(244, 63, 94, 0.3)',
              color: isLight ? '#9f1239' : '#fb7185',
            };

            const ghBtnStyle = {
              bg: isLight ? 'rgba(241, 245, 249, 0.95)' : 'rgba(30, 41, 59, 0.6)',
              border: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.25)',
              color: isLight ? '#0f172a' : '#e2e8f0',
            };

            return (
              <article
                key={project.id}
                className="p-4 sm:p-6 rounded-2xl border border-[var(--border-color)] flex flex-col lg:flex-row gap-8 items-stretch group hover:-translate-y-1.5 transition-all duration-500 shadow-sm"
                style={{
                  backgroundColor: isLight ? '#f8fafc' : 'rgba(3,7,18,0.5)',
                }}
              >
                {/* Left Side: Thumbnail Preview + Direct Action Button */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center gap-3.5 shrink-0">
                  <div
                    className="relative aspect-video w-full rounded-2xl overflow-hidden cursor-pointer group/video border border-slate-800/40 shadow-inner"
                    onClick={() => {
                      if (project.ytId) {
                        onOpenYoutube(project.ytId, title);
                      } else if (project.websiteUrl) {
                        window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
                      } else if (project.githubUrl) {
                        window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <img
                      src={getAssetUrl(project.image)}
                      alt={title}
                      className="w-full h-full object-cover group-hover/video:scale-105 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" aria-hidden="true" />

                    {/* Top-Left Overlay: Project Category Badge (Enlarged + Category Lucide Icon) */}
                    {(() => {
                      const catConfig = (() => {
                        switch (project.category) {
                          case 'interactive':
                            return {
                              label: lang === 'zh' ? '互動應用開發' : 'Interactive App',
                              Icon: Gamepad2,
                              bgLight: '#f0f9ff',
                              bgDark: 'rgba(15, 23, 42, 0.92)',
                              borderLight: '#7dd3fc',
                              borderDark: 'rgba(6, 182, 212, 0.5)',
                              textLight: '#0284c7',
                              textDark: '#22d3ee',
                            };
                          case 'frontend':
                            return {
                              label: lang === 'zh' ? '前端開發' : 'Frontend Dev',
                              Icon: Layout,
                              bgLight: '#faf5ff',
                              bgDark: 'rgba(15, 23, 42, 0.92)',
                              borderLight: '#e9d5ff',
                              borderDark: 'rgba(168, 85, 247, 0.5)',
                              textLight: '#7e22ce',
                              textDark: '#c084fc',
                            };
                          case 'fullstack':
                            return {
                              label: lang === 'zh' ? '全端開發' : 'Fullstack Dev',
                              Icon: Globe,
                              bgLight: '#ecfdf5',
                              bgDark: 'rgba(15, 23, 42, 0.92)',
                              borderLight: '#a7f3d0',
                              borderDark: 'rgba(16, 185, 129, 0.5)',
                              textLight: '#047857',
                              textDark: '#34d399',
                            };
                          case 'linebot':
                            return {
                              label: lang === 'zh' ? 'LINE Bot 開發' : 'LINE Bot Dev',
                              Icon: Bot,
                              bgLight: '#fffbeb',
                              bgDark: 'rgba(15, 23, 42, 0.92)',
                              borderLight: '#fcd34d',
                              borderDark: 'rgba(245, 158, 11, 0.5)',
                              textLight: '#b45309',
                              textDark: '#fbbf24',
                            };
                          default:
                            return {
                              label: lang === 'zh' ? '互動應用開發' : 'Interactive App',
                              Icon: Gamepad2,
                              bgLight: '#f0f9ff',
                              bgDark: 'rgba(15, 23, 42, 0.92)',
                              borderLight: '#7dd3fc',
                              borderDark: 'rgba(6, 182, 212, 0.5)',
                              textLight: '#0284c7',
                              textDark: '#22d3ee',
                            };
                        }
                      })();

                      return (
                        <div
                          className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-code text-xs sm:text-sm font-extrabold shadow-md border backdrop-blur-md"
                          style={{
                            backgroundColor: isLight ? catConfig.bgLight : catConfig.bgDark,
                            borderColor: isLight ? catConfig.borderLight : catConfig.borderDark,
                            color: isLight ? catConfig.textLight : catConfig.textDark,
                          }}
                        >
                          <catConfig.Icon size={15} className="shrink-0" />
                          <span>{catConfig.label}</span>
                        </div>
                      );
                    })()}

                    {/* Bottom-Right Overlay: Date Badge (Guaranteed 0% overlap with Top-Left Category Badge) */}
                    {project.date && (
                      <div
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-code text-xs font-bold shadow-md border backdrop-blur-md"
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

                    {/* Bottom-Left Overlay: AI-Assisted Development Badge */}
                    {project.aiAssisted && (
                      <div
                        className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-code text-xs font-extrabold shadow-lg border backdrop-blur-md"
                        style={{
                          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                          borderColor: isLight ? '#9333ea' : 'rgba(34, 211, 238, 0.6)',
                          color: isLight ? '#581c87' : '#22d3ee',
                          boxShadow: isLight ? '0 4px 14px rgba(147, 51, 234, 0.2)' : '0 4px 14px rgba(6, 182, 212, 0.25)',
                        }}
                      >
                        <Sparkles size={13} className={isLight ? 'text-purple-600 fill-purple-600 animate-pulse' : 'text-cyan-300 fill-cyan-300 animate-pulse'} />
                        <span>{lang === 'zh' ? 'AI 輔助開發' : 'AI-Assisted Dev'}</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Action Link Buttons — Compact inline-flex with minimum width */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
                    {project.websiteUrl && (
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-code text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border shadow-xs transition-all duration-300 cursor-pointer whitespace-nowrap min-w-[130px] sm:min-w-[155px]"
                        style={{
                          backgroundColor: webBtnStyle.bg,
                          borderColor: webBtnStyle.border,
                          color: webBtnStyle.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0284c7';
                          e.currentTarget.style.borderColor = '#0284c7';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = webBtnStyle.bg;
                          e.currentTarget.style.borderColor = webBtnStyle.border;
                          e.currentTarget.style.color = webBtnStyle.color;
                        }}
                      >
                        <Globe size={16} className="shrink-0" />
                        <span>{lang === 'zh' ? '前往網站頁面' : 'Visit Website'}</span>
                        <ExternalLink size={13} className="opacity-70 shrink-0" />
                      </a>
                    )}

                    {project.ytId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${project.ytId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-code text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border shadow-xs transition-all duration-300 cursor-pointer whitespace-nowrap min-w-[130px] sm:min-w-[155px]"
                        style={{
                          backgroundColor: ytBtnStyle.bg,
                          borderColor: ytBtnStyle.border,
                          color: ytBtnStyle.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.borderColor = '#dc2626';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = ytBtnStyle.bg;
                          e.currentTarget.style.borderColor = ytBtnStyle.border;
                          e.currentTarget.style.color = ytBtnStyle.color;
                        }}
                      >
                        <Video size={16} className="shrink-0" />
                        <span>{lang === 'zh' ? 'YouTube 播放展示' : 'Watch on YouTube'}</span>
                        <ExternalLink size={13} className="opacity-70 shrink-0" />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-code text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border shadow-xs transition-all duration-300 cursor-pointer whitespace-nowrap min-w-[130px] sm:min-w-[155px]"
                        style={{
                          backgroundColor: ghBtnStyle.bg,
                          borderColor: ghBtnStyle.border,
                          color: ghBtnStyle.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isLight ? '#0f172a' : '#1e293b';
                          e.currentTarget.style.borderColor = isLight ? '#0f172a' : '#475569';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = ghBtnStyle.bg;
                          e.currentTarget.style.borderColor = ghBtnStyle.border;
                          e.currentTarget.style.color = ghBtnStyle.color;
                        }}
                      >
                        <GithubIcon className="w-4 h-4 shrink-0" />
                        <span>{lang === 'zh' ? '前往 GitHub 頁面' : 'GitHub Repository'}</span>
                        <ExternalLink size={13} className="opacity-70 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Side: Title, Desc, Tech Highlights FIRST, Honors SECOND */}
                <div className="w-full lg:w-7/12 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3.5">

                    {/* Project Title & AI-Assisted Badge */}
                    <div className="flex flex-wrap items-center gap-3 pr-24 sm:pr-28">
                      <h3 className="text-2xl sm:text-3xl font-extrabold group-hover:text-cyan-500 light:group-hover:text-sky-600 transition-colors tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        {title}
                      </h3>

                      {/* Prominent AI-Assisted Development Badge */}
                      {project.aiAssisted && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-code font-extrabold shadow-sm backdrop-blur-md transition-all border"
                          style={{
                            backgroundColor: isLight ? 'rgba(124, 58, 237, 0.08)' : 'rgba(6, 182, 212, 0.15)',
                            borderColor: isLight ? '#a855f7' : 'rgba(34, 211, 238, 0.6)',
                            color: isLight ? '#6b21a8' : '#22d3ee',
                            boxShadow: isLight ? '0 2px 10px rgba(168, 85, 247, 0.15)' : '0 2px 10px rgba(34, 211, 238, 0.2)',
                          }}
                        >
                          <Sparkles size={14} className={isLight ? 'text-purple-600 fill-purple-600 animate-pulse' : 'text-cyan-300 fill-cyan-300 animate-pulse'} />
                          <span>{lang === 'zh' ? '⚡ AI 輔助開發' : '⚡ AI-Assisted Dev'}</span>
                        </span>
                      )}
                    </div>

                    {/* Overview Bio */}
                    <p className="text-sm sm:text-base leading-relaxed font-normal" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                      {desc}
                    </p>

                    {/* Technical Contributions Box */}
                    {contribs && contribs.length > 0 && (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-code font-bold uppercase tracking-wider" style={{ color: isLight ? '#0369a1' : '#22d3ee' }}>
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

                  {/* Specialized Tools Tags (Unified Low-Saturation Palette) */}
                  <div className="pt-4 flex flex-wrap gap-2 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.07)' }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="tech-tag text-xs font-code px-3 py-1 rounded-lg font-bold border transition-transform hover:scale-105 shadow-xs"
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

        {/* Expand / Collapse All Projects Button */}
        {filteredProjects.length > 3 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="h-12 px-8 rounded-xl bg-slate-900 light:bg-white text-white light:text-slate-800 border-2 border-slate-700 light:border-slate-300 hover:border-cyan-500 light:hover:border-sky-500 hover:bg-slate-800 light:hover:bg-sky-50 font-bold text-sm font-code transition-all shadow-md inline-flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-cyan-500/20 light:hover:shadow-sky-500/20"
            >
              <span>
                {showAllProjects
                  ? (lang === 'zh' ? '收折專案作品清單' : 'Collapse Projects')
                  : (lang === 'zh' ? '檢視更多專案作品' : 'View More Projects')}
              </span>
              <ChevronDown size={18} className={`text-cyan-400 light:text-sky-600 transition-transform duration-300 ${showAllProjects ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
