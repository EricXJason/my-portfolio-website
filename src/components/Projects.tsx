import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import projectsData from '../data/projects-section.json';
import { Trophy, Layers, Gamepad2, Globe, Star, Layout, FolderGit2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { TechIcon } from './icons/TechIcon';
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
  honors?: string[];
  honors_en?: string[];
  desc: string;
  desc_en?: string;
  contributions?: string[];
  contributions_en?: string[];
  tags: string[];
  date: string;
}

interface ProjectsProps {
  onOpenYoutube: (ytId: string, title: string) => void;
}

interface CategoryStyle {
  zh: string;
  en: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
  lightBg: string;
  lightBorder: string;
  lightText: string;
}

const categoryMap: Record<string, CategoryStyle> = {
  interactive: {
    zh: '互動應用開發',
    en: 'Interactive App',
    darkBg: 'rgba(0, 240, 255, 0.18)',
    darkBorder: '#00f0ff',
    darkText: '#00f0ff',
    lightBg: '#e0f2fe',
    lightBorder: '#0284c7',
    lightText: '#0369a1',
  },
  frontend: {
    zh: '前端開發',
    en: 'Frontend Dev',
    darkBg: 'rgba(99, 102, 241, 0.22)',
    darkBorder: '#818cf8',
    darkText: '#a5b4fc',
    lightBg: '#e0e7ff',
    lightBorder: '#4338ca',
    lightText: '#3730a3',
  },
  fullstack: {
    zh: '全端開發',
    en: 'Fullstack Dev',
    darkBg: 'rgba(168, 85, 247, 0.20)',
    darkBorder: '#a855f7',
    darkText: '#c084fc',
    lightBg: '#f3e8ff',
    lightBorder: '#7c3aed',
    lightText: '#6b21a8',
  },
  linebot: {
    zh: 'LINE Bot',
    en: 'LINE Bot App',
    darkBg: 'rgba(16, 185, 129, 0.20)',
    darkBorder: '#10b981',
    darkText: '#34d399',
    lightBg: '#d1fae5',
    lightBorder: '#059669',
    lightText: '#065f46',
  },
};

export const Projects: React.FC<ProjectsProps> = ({ onOpenYoutube: _onOpenYoutube }) => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('featured');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const preExpandScrollPos = useRef<number>(0);

  // Full Project Detail Lightbox Modal State
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectItem | null>(null);

  const projects = projectsData as ProjectItem[];

  // Close Project Detail Modal on Escape key press
  useEffect(() => {
    if (!selectedProjectModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        setSelectedProjectModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedProjectModal]);

  // Sort projects by featuredOrder for featured items first, then by order
  const allProjectsSorted = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.featured && b.featured) {
        return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
      }
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }, [projects]);

  const targetProjectsList = useMemo(() => {
    if (filter === 'featured') {
      return showAllProjects
        ? allProjectsSorted
        : projects.filter((p) => p.featured).sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
    }
    if (filter === 'all') {
      return allProjectsSorted;
    }
    return projects.filter((p) => p.category === filter).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [filter, showAllProjects, projects, allProjectsSorted]);

  const visibleProjects = showAllProjects
    ? targetProjectsList
    : (filter === 'featured' ? targetProjectsList.slice(0, 3) : targetProjectsList.slice(0, 4));

  const isFeaturedSideBySideView = filter === 'featured' && !showAllProjects;

  // Swapped Filter Order: Featured -> All -> Interactive -> Frontend -> Fullstack
  const filters = [
    { key: 'featured', label: t('cat_featured'), icon: <Star size={15} className="text-amber-400 fill-amber-400" /> },
    { key: 'all', label: t('cat_all'), icon: <Layers size={15} /> },
    { key: 'interactive', label: t('cat_interactive'), icon: <Gamepad2 size={15} /> },
    { key: 'frontend', label: t('cat_frontend'), icon: <Layout size={15} /> },
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={15} /> },
  ];

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  const handleWatchVideo = (ytId: string) => {
    window.open(`https://www.youtube.com/watch?v=${ytId}`, '_blank', 'noopener,noreferrer');
  };

  const fallbackCategoryStyle: CategoryStyle = {
    zh: '專案類型',
    en: 'Project',
    darkBg: 'rgba(0, 240, 255, 0.15)',
    darkBorder: '#00f0ff',
    darkText: '#00f0ff',
    lightBg: '#e0f2fe',
    lightBorder: '#0284c7',
    lightText: '#0369a1',
  };

  return (
    <section id="projects" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">

          <h2 className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            <FolderGit2 size={34} style={{ color: cyanCol }} className="shrink-0" />
            <span>{t('projects_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('projects_note')}
          </p>
        </div>

        {/* Filter Bar - Mobile 2-Column Equal-Width Grid / Desktop Flex Wrap */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto mb-12" role="tablist">
          {filters.map((f, idx) => {
            const isLastOdd = idx === filters.length - 1 && filters.length % 2 !== 0;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setShowAllProjects(false);
                }}
                role="tab"
                aria-selected={filter === f.key}
                className={`h-11 px-3 sm:px-6 w-full sm:w-auto border cyber-cut-sm font-tech text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap ${
                  isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  filter === f.key
                    ? 'filter-btn-active scale-[1.02] sm:scale-105 shadow-md'
                    : 'filter-btn-inactive'
                }`}
              >
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  {f.icon}
                  <span className="whitespace-nowrap">{f.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* FEATURED MODE: 3 EQUAL CORE REPRESENTATIVE PROJECTS SIDE-BY-SIDE GRID */}
        {isFeaturedSideBySideView ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {visibleProjects.map((project) => {
              const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
              const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
              const categoryObj = categoryMap[project.category] ?? fallbackCategoryStyle;
              const categoryLabel = lang === 'zh' ? categoryObj.zh : categoryObj.en;

              return (
                <article
                  key={project.id}
                  className="cyber-card p-6 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)',
                    borderColor: borderCol,
                  }}
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Top Category Badge & Date */}
                      <div className="flex flex-row items-center justify-between gap-2 pb-3 border-b border-slate-700/40">
                        <span
                          className="px-3 py-1 border font-tech text-xs font-bold uppercase tracking-wider cyber-cut-sm shadow-xs w-fit"
                          style={{
                            backgroundColor: isLight ? categoryObj.lightBg : categoryObj.darkBg,
                            borderColor: isLight ? categoryObj.lightBorder : categoryObj.darkBorder,
                            color: isLight ? categoryObj.lightText : categoryObj.darkText,
                          }}
                        >
                          {categoryLabel}
                        </span>
                        <span className="text-xs font-tech font-bold font-mono whitespace-nowrap" style={{ color: isLight ? '#334155' : '#a5f3fc' }}>
                          {project.date}
                        </span>
                      </div>

                      {/* Image Thumbnail — Click opens full Detail Modal */}
                      <div
                        className="relative group overflow-hidden cyber-cut-corner border shadow-md cursor-pointer aspect-video w-full"
                        style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.35)' }}
                        onClick={() => setSelectedProjectModal(project)}
                      >
                        <img
                          src={getAssetUrl(project.image)}
                          alt={title}
                          className="w-full h-full aspect-video object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="card-scanline-laser opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <h3
                        className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight cursor-pointer hover:text-cyan-400 transition-colors"
                        style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        onClick={() => setSelectedProjectModal(project)}
                      >
                        {title}
                      </h3>

                      {/* Full Project Description */}
                      <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                        {desc}
                      </p>
                    </div>

                    {/* Full Tech Tags Chips — mt-auto pins tags to bottom for horizontal alignment */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-auto">
                      {project.tags.map((tTag, idx) => (
                        <span key={idx} className="tech-tag px-2.5 py-1 border text-xs font-semibold inline-flex items-center">
                          <span>{tTag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons — Video, Website & GitHub Buttons */}
                  <div className="pt-4 mt-2 border-t border-slate-700/30">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      {project.ytId && (
                        <button
                          onClick={() => handleWatchVideo(project.ytId!)}
                          className="flex-1 min-w-[105px] py-2.5 px-4 sm:px-5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105 shadow-xs"
                          style={{
                            backgroundColor: isLight ? '#ffe4e6' : 'rgba(225, 29, 72, 0.25)',
                            borderColor: isLight ? '#f43f5e' : '#e11d48',
                            color: isLight ? '#be123c' : '#fda4af',
                          }}
                        >
                          <TechIcon name="youtube" size={16} className="text-rose-500 shrink-0 fill-current" />
                          <span>{lang === 'zh' ? '展示影片' : 'VIDEO'}</span>
                        </button>
                      )}

                      {project.websiteUrl && (
                        <a
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 min-w-[105px] py-2.5 px-4 sm:px-5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-1.5 transition-all hover:scale-105 shadow-xs"
                          style={{
                            backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                            borderColor: cyanCol,
                            color: isLight ? '#075985' : '#00f0ff',
                          }}
                        >
                          <Globe size={15} className="shrink-0" />
                          <span>{lang === 'zh' ? '前往網站' : 'WEBSITE'}</span>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 min-w-[105px] py-2.5 px-4 sm:px-5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-1.5 transition-all hover:scale-105 shadow-xs"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
                            borderColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.35)',
                            color: isLight ? '#0f172a' : '#ffffff',
                          }}
                        >
                          <TechIcon name="github" size={16} className="shrink-0 fill-current" style={{ color: isLight ? '#0f172a' : '#ffffff' }} />
                          <span>{lang === 'zh' ? '專案原始碼' : 'SOURCE'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* STANDARD DETAILED LIST VIEW */
          <div className="max-w-6xl mx-auto space-y-8">
            {visibleProjects.map((project) => {
              const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
              const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
              const honorsList = lang === 'zh' ? project.honors : (project.honors_en || project.honors);
              const contribList = lang === 'zh' ? project.contributions : (project.contributions_en || project.contributions);
              const categoryObj = categoryMap[project.category] ?? fallbackCategoryStyle;
              const categoryLabel = lang === 'zh' ? categoryObj.zh : categoryObj.en;

              return (
                <article
                  key={project.id}
                  className="cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg relative"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.92)',
                    borderColor: borderCol,
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                    {/* Left Column: Media Preview + Action Buttons */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Image Thumbnail — Click opens full Detail Modal */}
                      <div
                        className="relative group overflow-hidden cyber-cut-corner border shadow-md cursor-pointer aspect-video w-full"
                        style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.35)' }}
                        onClick={() => setSelectedProjectModal(project)}
                      >
                        <img
                          src={getAssetUrl(project.image)}
                          alt={title}
                          className="w-full h-full aspect-video object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="card-scanline-laser opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {project.ytId && (
                          <button
                            onClick={() => handleWatchVideo(project.ytId!)}
                            className="flex-1 min-w-[130px] py-2 px-3 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 shadow-xs"
                            style={{
                              backgroundColor: isLight ? '#ffe4e6' : 'rgba(225, 29, 72, 0.25)',
                              borderColor: isLight ? '#f43f5e' : '#e11d48',
                              color: isLight ? '#be123c' : '#fda4af',
                            }}
                          >
                            <TechIcon name="youtube" size={16} className="text-rose-500 shrink-0 fill-current" />
                            <span>{lang === 'zh' ? '觀看展示影片' : 'WATCH VIDEO'}</span>
                          </button>
                        )}

                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 min-w-[120px] py-2.5 px-4 sm:px-5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xs"
                            style={{
                              backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                              borderColor: cyanCol,
                              color: isLight ? '#0369a1' : '#00f0ff',
                            }}
                          >
                            <Globe size={15} className="shrink-0" />
                            <span>{lang === 'zh' ? '前往網站' : 'WEBSITE'}</span>
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 min-w-[120px] py-2.5 px-4 sm:px-5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xs"
                            style={{
                              backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
                              borderColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.35)',
                              color: isLight ? '#0f172a' : '#ffffff',
                            }}
                          >
                            <TechIcon name="github" size={16} className="shrink-0 fill-current" style={{ color: isLight ? '#0f172a' : '#ffffff' }} />
                            <span>{lang === 'zh' ? '專案原始碼' : 'SOURCE CODE'}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Project Details */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/30 pb-3">
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight cursor-pointer hover:text-cyan-400 transition-colors"
                              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                              onClick={() => setSelectedProjectModal(project)}
                            >
                              {title}
                            </h3>
                          </div>
                          <div className="flex flex-row items-center gap-2.5 sm:gap-3 shrink-0">
                            <span
                              className="px-3 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shadow-xs w-fit"
                              style={{
                                backgroundColor: isLight ? categoryObj.lightBg : categoryObj.darkBg,
                                borderColor: isLight ? categoryObj.lightBorder : categoryObj.darkBorder,
                                color: isLight ? categoryObj.lightText : categoryObj.darkText,
                              }}
                            >
                              {categoryLabel}
                            </span>
                            <span className="text-xs sm:text-sm font-tech font-bold font-mono whitespace-nowrap" style={{ color: isLight ? '#334155' : '#a5f3fc' }}>
                              {project.date}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                          {desc}
                        </p>

                        {/* Render 核心技術亮點 Bullet Points List in Standard Detailed List View */}
                        {contribList && contribList.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-xs sm:text-sm font-hud font-bold uppercase tracking-wider" style={{ color: isLight ? categoryObj.lightText : categoryObj.darkText }}>
                              {lang === 'zh' ? '核心技術亮點：' : 'KEY HIGHLIGHTS:'}
                            </p>
                            <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1 pl-1" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                              {contribList.map((cItem, cIdx) => (
                                <li key={cIdx} className="leading-relaxed">{cItem}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {honorsList && honorsList.length > 0 && (
                          <div
                            className="p-3.5 border font-tech text-xs sm:text-sm space-y-1 cyber-cut-sm"
                            style={{
                              backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.15)',
                              borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.35)',
                              color: isLight ? '#b45309' : '#fbbf24',
                            }}
                          >
                            {honorsList.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 font-bold">
                                <Trophy size={15} className="shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Full Tech Tags — mt-auto pins tags to bottom */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 mt-auto">
                        {project.tags.map((tTag, idx) => (
                          <span key={idx} className="tech-tag px-3 py-1 border text-xs sm:text-sm font-semibold inline-flex items-center">
                            <span>{tTag}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Expand / Switch to All Projects Button Container */}
        {(filter === 'featured' || targetProjectsList.length > 3) && (
          <div className="text-center mt-12" id="expand-button-container">
            <button
              onClick={() => {
                if (filter === 'featured') {
                  preExpandScrollPos.current = window.scrollY;
                  setFilter('all');
                  setShowAllProjects(true);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                } else if (!showAllProjects) {
                  preExpandScrollPos.current = window.scrollY;
                  setShowAllProjects(true);
                } else {
                  setShowAllProjects(false);
                  window.scrollTo({ top: preExpandScrollPos.current, behavior: 'smooth' });
                }
              }}
              className="px-7 sm:px-9 py-3.5 border font-hud font-bold text-xs sm:text-sm uppercase tracking-widest cyber-cut-corner transition-all hover:scale-105 cursor-pointer shadow-lg inline-flex items-center gap-2.5"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: cyanCol,
                color: cyanCol,
              }}
            >
              <span>
                {filter === 'featured'
                  ? (lang === 'zh' ? '檢視更多' : 'VIEW MORE')
                  : showAllProjects
                  ? (lang === 'zh' ? '收起專案' : 'COLLAPSE PROJECTS')
                  : (lang === 'zh' ? '檢視更多' : 'VIEW MORE')}
              </span>
              {filter === 'featured' ? (
                <ChevronDown size={16} />
              ) : showAllProjects ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        )}

        {/* PROJECT FULL DETAIL LIGHTBOX MODAL */}
        {selectedProjectModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={() => setSelectedProjectModal(null)}
          >
            <div
              className="relative max-w-3xl w-full border cyber-cut-corner backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: cyanCol,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-700/40 pb-4">
                <div className="space-y-2 pr-4">
                  <h3 className="font-hud font-black text-2xl sm:text-3xl uppercase tracking-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {lang === 'zh' ? selectedProjectModal.title_zh : (selectedProjectModal.title_en || selectedProjectModal.title_zh)}
                  </h3>
                  <div className="flex flex-row items-center gap-2.5 sm:gap-3">
                    <span
                      className="px-3 py-0.5 border font-tech text-xs font-bold uppercase tracking-wider cyber-cut-sm w-fit"
                      style={{
                        backgroundColor: isLight
                          ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).lightBg
                          : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).darkBg,
                        borderColor: isLight
                          ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).lightBorder
                          : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).darkBorder,
                        color: isLight
                          ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).lightText
                          : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).darkText,
                      }}
                    >
                      {lang === 'zh'
                        ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).zh
                        : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).en}
                    </span>
                    <span className="text-xs font-tech font-bold font-mono whitespace-nowrap" style={{ color: isLight ? '#334155' : '#a5f3fc' }}>
                      {selectedProjectModal.date}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="p-2 border cyber-cut-sm hover:scale-105 transition-all cursor-pointer shrink-0"
                  style={{
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)',
                    borderColor: borderCol,
                    color: isLight ? '#0f172a' : '#ffffff',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* 16:9 Media Preview */}
              <div className="aspect-video w-full overflow-hidden cyber-cut-corner border shadow-md relative" style={{ borderColor: borderCol }}>
                <img
                  src={getAssetUrl(selectedProjectModal.image)}
                  alt={selectedProjectModal.title_zh}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full aspect-video object-cover object-center"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="font-hud font-bold text-sm sm:text-base uppercase tracking-wider" style={{ color: cyanCol }}>
                  {lang === 'zh' ? '專案完整簡介：' : 'FULL PROJECT DESCRIPTION:'}
                </h4>
                <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                  {lang === 'zh' ? selectedProjectModal.desc : (selectedProjectModal.desc_en || selectedProjectModal.desc)}
                </p>
              </div>

              {/* Full Contributions List */}
              {((lang === 'zh' ? selectedProjectModal.contributions : (selectedProjectModal.contributions_en || selectedProjectModal.contributions)) || []).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-hud font-bold text-sm sm:text-base uppercase tracking-wider" style={{ color: cyanCol }}>
                    {lang === 'zh' ? '核心貢獻與技術重點：' : 'KEY CONTRIBUTIONS & TECHNICAL HIGHLIGHTS:'}
                  </h4>
                  <ul className="list-disc list-inside text-sm font-tech space-y-2 pl-1" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                    {((lang === 'zh' ? selectedProjectModal.contributions : (selectedProjectModal.contributions_en || selectedProjectModal.contributions)) || []).map((cItem, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">{cItem}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Honors List */}
              {((lang === 'zh' ? selectedProjectModal.honors : (selectedProjectModal.honors_en || selectedProjectModal.honors)) || []).length > 0 && (
                <div
                  className="p-4 border font-tech text-xs sm:text-sm space-y-1.5 cyber-cut-sm"
                  style={{
                    backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.15)',
                    borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.35)',
                    color: isLight ? '#b45309' : '#fbbf24',
                  }}
                >
                  {((lang === 'zh' ? selectedProjectModal.honors : (selectedProjectModal.honors_en || selectedProjectModal.honors)) || []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 font-bold">
                      <Trophy size={16} className="shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Full Tech Tags */}
              <div className="space-y-2">
                <h4 className="font-hud font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: cyanCol }}>
                  {lang === 'zh' ? '技術棧與工具：' : 'TECH STACK & TOOLS:'}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedProjectModal.tags.map((tTag, idx) => (
                    <span key={idx} className="tech-tag px-3 py-1 border text-xs sm:text-sm font-semibold inline-flex items-center">
                      <span>{tTag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/30">
                {selectedProjectModal.ytId && (
                  <button
                    onClick={() => handleWatchVideo(selectedProjectModal.ytId!)}
                    className="flex-1 py-2.5 px-4 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#ffe4e6' : 'rgba(225, 29, 72, 0.25)',
                      borderColor: isLight ? '#f43f5e' : '#e11d48',
                      color: isLight ? '#be123c' : '#fda4af',
                    }}
                  >
                    <TechIcon name="youtube" size={16} className="text-rose-500 shrink-0 fill-current" />
                    <span>{lang === 'zh' ? '觀看 YouTube 展示影片' : 'WATCH YOUTUBE VIDEO'}</span>
                  </button>
                )}

                {selectedProjectModal.websiteUrl && (
                  <a
                    href={selectedProjectModal.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-5 sm:px-6 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                      borderColor: cyanCol,
                      color: isLight ? '#0369a1' : '#00f0ff',
                    }}
                  >
                    <Globe size={15} className="shrink-0" />
                    <span>{lang === 'zh' ? '前往專案網站' : 'VISIT WEBSITE'}</span>
                  </a>
                )}

                {selectedProjectModal.githubUrl && (
                  <a
                    href={selectedProjectModal.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-5 sm:px-6 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#ffffff' : '#080e1a',
                      borderColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.35)',
                      color: isLight ? '#0f172a' : '#ffffff',
                    }}
                  >
                    <TechIcon name="github" size={16} className="shrink-0 fill-current" style={{ color: isLight ? '#0f172a' : '#ffffff' }} />
                    <span>{lang === 'zh' ? '專案原始碼' : 'SOURCE CODE'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
