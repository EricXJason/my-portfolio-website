/**
 * ============================================================================
 * 檔案名稱: Projects.tsx
 * 所屬模組: Portfolio Website (專案作品模組)
 * 責任描述: 負責渲染前臺專案作品區塊、精選作品並排展示、完整列表收合展開與 16:9 彈窗詳細資訊。
 * 架構分層: Presentation Layer (React Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、TechIcon 與 projects-section.json 靜態資產。
 * 邊界處理: 支援四格自選動作按鈕、三按鈕佈局自適應（上二下一滿寬）、100% AI 徽章相容與無障礙鍵盤 Esc 關閉。
 * ============================================================================
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import projectsData from '../data/projects-section.json';
import {
  Trophy,
  Layers,
  Gamepad2,
  Globe,
  Star,
  Layout,
  FolderGit2,
  X,
  ChevronDown,
  ChevronUp,
  Cpu,
  LayoutDashboard,
  Code2,
} from 'lucide-react';
import { TechIcon } from './icons/TechIcon';
import { getAssetUrl } from '../utils/assetPath';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
  videoUrl?: string;
  websiteUrl?: string;
  liveUrl?: string;
  adminUrl?: string;
  githubUrl?: string;
  aiAssisted?: boolean;
  isFullAi?: boolean;
  buttonOrder?: string[];
  honors?: string[];
  honors_en?: string[];
  desc: string;
  desc_en?: string;
  contributions?: string[];
  contributions_en?: string[];
  tags: string[];
  date: string;
  date_en?: string;
  visible?: boolean;
  actions?: {
    custom1?: { label?: string; url: string; icon?: string };
    custom2?: { label?: string; url: string; icon?: string };
  };
}

/** 作品卡片容器（已移除 3D 視差效果，保留結構相容性） */
const Tilt3DCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isInteractive?: boolean;
}> = ({ children, className = '', style = {} }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};


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
  iconName?: string;
}

const categoryMap: Record<string, CategoryStyle> = {
  fullstack: {
    zh: '全端開發',
    en: 'Fullstack Dev',
    darkBg: 'rgba(0, 240, 255, 0.12)',
    darkBorder: 'rgba(0, 240, 255, 0.45)',
    darkText: '#00f0ff',
    lightBg: '#e0f2fe',
    lightBorder: '#0284c7',
    lightText: '#0369a1',
    iconName: 'fullstack',
  },
  interactive: {
    zh: '互動應用開發',
    en: 'Interactive App',
    darkBg: 'rgba(59, 130, 246, 0.16)',
    darkBorder: 'rgba(96, 165, 250, 0.55)',
    darkText: '#60a5fa',
    lightBg: '#eff6ff',
    lightBorder: '#3b82f6',
    lightText: '#1d4ed8',
    iconName: 'interactive',
  },
};

export const Projects: React.FC<ProjectsProps> = ({ onOpenYoutube: _onOpenYoutube }) => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // 渲染分類對應的 Lucide 圖示
  const renderCategoryIcon = (iconName?: string, size = 13, className = '') => {
    switch (iconName) {
      case 'interactive':
        return <Gamepad2 size={size} className={className} />;
      case 'frontend':
        return <Layout size={size} className={className} />;
      case 'fullstack':
        return <Globe size={size} className={className} />;
      default:
        return null;
    }
  };
  const [filter, setFilter] = useState('featured');
  const [showAllProjects, setShowAllProjects] = useState(false);
  // 收合按鈕容器參照 — 用於收合專案清單時平滑維持使用者視窗滾動位置
  const collapseButtonRef = useRef<HTMLDivElement | null>(null);

  // 專案詳細資訊彈窗狀態 (Lightbox Modal)
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectItem | null>(null);

  /**
   * [資料來源調度] 精選專案列表與技術展示資料
   * 由 PortfolioDataContext 提供統一資料驅動，具備可見度過濾與快照備援。
   */
  const { data } = usePortfolioData();
  const rawProjects = ((data.projects || projectsData) as ProjectItem[]);
  const projects = rawProjects.filter((p) => p.visible !== false);

  // 鍵盤按下 Escape 鍵時關閉專案詳細資訊彈窗
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

  // 依精選排序權重 (featuredOrder) 與預設序號 (order) 進行專案穩定排序
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
      const featuredItems = projects.filter((p) => p.featured && p.visible !== false);
      // 確保精選專案永不消失：若當前資料沒有標記 featured，自動回退使用預設之三大精選專案（且嚴格排除隱藏項目）
      const activeFeatured =
        featuredItems.length > 0
          ? featuredItems
          : rawProjects.filter((p) => p.featured && p.visible !== false);

      return showAllProjects
        ? allProjectsSorted
        : activeFeatured.sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
    }
    if (filter === 'all') {
      return allProjectsSorted;
    }
    return projects.filter((p) => p.category === filter && p.visible !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [filter, showAllProjects, projects, allProjectsSorted, rawProjects]);

  // 左右雙旗艦領域資料集：互動應用與遊戲引擎 (左最多 3) vs 現代全端與雲端架構 (右最多 3)（嚴格依 CMS 精選與 visible 過濾）
  const featuredInteractiveProjects = useMemo(() => {
    return projects
      .filter((p) => p.category === 'interactive' && p.featured && p.visible !== false)
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
      .slice(0, 3);
  }, [projects]);

  const featuredFullstackProjects = useMemo(() => {
    return projects
      .filter((p) => p.category === 'fullstack' && p.featured && p.visible !== false)
      .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
      .slice(0, 3);
  }, [projects]);

  const visibleProjects = useMemo(() => {
    if (filter === 'featured') {
      return targetProjectsList.slice(0, 6);
    }
    if (filter === 'all') {
      return showAllProjects ? targetProjectsList : targetProjectsList.slice(0, 4);
    }
    return targetProjectsList;
  }, [filter, showAllProjects, targetProjectsList]);

  const isFeaturedSideBySideView = filter === 'featured';

  // 專案類別篩選順序：精選作品 -> 全部作品 -> 全端開發 -> 互動應用
  const filters = [
    { key: 'featured', label: t('cat_featured'), icon: <Star size={15} className="text-amber-400 fill-amber-400" /> },
    { key: 'all', label: t('cat_all'), icon: <Layers size={15} /> },
    { key: 'fullstack', label: t('cat_fullstack'), icon: <Globe size={15} /> },
    { key: 'interactive', label: t('cat_interactive'), icon: <Gamepad2 size={15} /> },
  ];

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';
  const cyanCol = isLight ? '#0369a1' : '#00f0ff';

  const headerRef = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const gridRef   = useScrollReveal(0.05) as React.RefObject<HTMLDivElement>;
  const listRef   = useScrollReveal(0.05) as React.RefObject<HTMLDivElement>;

  const handleWatchVideo = (ytIdOrUrl: string) => {
    if (ytIdOrUrl.startsWith('http://') || ytIdOrUrl.startsWith('https://')) {
      window.open(ytIdOrUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://www.youtube.com/watch?v=${ytIdOrUrl}`, '_blank', 'noopener,noreferrer');
    }
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
    iconName: 'globe',
  };

  /**
   * 動作按鈕佈局引擎：
   * - 支援 4 種按鈕型態：示範影片 (Video)、線上成果 (Live Demo)、後臺展示 (Admin CMS)、原始碼 (GitHub)。
   * - 嚴格遵循 CMS 所配置之自訂按鈕順序 (buttonOrder)。
   * - 響應式佈局規則：
   *   - 0 個按鈕：顯示「⚡ 專案籌備與建置中」專用徽章
   *   - 1 個按鈕：單一滿寬橫幅
   *   - 2 個按鈕：左右雙欄並排
   *   - 3 個按鈕：上列左右雙欄並排，下列單一滿寬橫幅（寬版按鈕美學）
   *   - 4 個按鈕：四等分 2x2 方正網格
   */
  const renderProjectActionButtons = (project: ProjectItem, isCompact = false) => {
    const orderList = project.buttonOrder && project.buttonOrder.length > 0
      ? project.buttonOrder
      : ['video', 'live', 'admin', 'github'];

    type ButtonKey = 'video' | 'live' | 'admin' | 'github';
    const availableKeys: ButtonKey[] = [];

    for (const rawKey of orderList) {
      const key = rawKey as ButtonKey;
      if (key === 'video' && (project.ytId || project.videoUrl)) {
        if (!availableKeys.includes('video')) availableKeys.push('video');
      } else if (key === 'live' && (project.websiteUrl || project.liveUrl)) {
        if (!availableKeys.includes('live')) availableKeys.push('live');
      } else if (key === 'admin' && project.adminUrl) {
        if (!availableKeys.includes('admin')) availableKeys.push('admin');
      } else if (key === 'github' && project.githubUrl) {
        if (!availableKeys.includes('github')) availableKeys.push('github');
      }
    }

    const allKeys: ButtonKey[] = ['video', 'live', 'admin', 'github'];
    for (const key of allKeys) {
      if (!availableKeys.includes(key)) {
        if (key === 'video' && (project.ytId || project.videoUrl)) availableKeys.push('video');
        else if (key === 'live' && (project.websiteUrl || project.liveUrl)) availableKeys.push('live');
        else if (key === 'admin' && project.adminUrl) availableKeys.push('admin');
        else if (key === 'github' && project.githubUrl) availableKeys.push('github');
      }
    }

    if (availableKeys.length === 0) {
      return (
        <div
          className={`w-full ${isCompact ? 'py-1 px-2 text-[11px] h-8' : 'py-2.5 px-3 text-xs sm:text-sm'} border font-tech font-bold uppercase cyber-cut-sm flex items-center justify-center gap-1.5 opacity-80`}
          style={{
            backgroundColor: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.1)',
            borderColor: isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.25)',
            color: isLight ? '#64748b' : '#94a3b8',
          }}
        >
          <span>{lang === 'zh' ? '⚡ 專案籌備與建置中' : '⚡ IN DEVELOPMENT'}</span>
        </div>
      );
    }

    const renderSingleBtn = (key: ButtonKey, colSpanClass: string) => {
      const baseClass = `${colSpanClass} ${isCompact ? 'py-1.5 px-3 text-xs h-8.5' : 'py-2.5 px-3 text-xs sm:text-sm h-10'} border font-tech font-bold uppercase cyber-cut-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] shadow-xs whitespace-nowrap overflow-hidden`;

      if (key === 'video') {
        const vid = project.videoUrl || project.ytId || '';
        return (
          <button
            key="btn-video"
            type="button"
            onClick={() => handleWatchVideo(vid)}
            className={`${baseClass} cursor-pointer group/vidbtn`}
            style={{
              backgroundColor: isLight ? '#ffe4e6' : 'rgba(225, 29, 72, 0.16)',
              borderColor: isLight ? '#f43f5e' : 'rgba(244, 63, 94, 0.65)',
              color: isLight ? '#be123c' : '#fecdd3',
            }}
          >
            <TechIcon name="youtube" size={isCompact ? 14 : 15} className="shrink-0 fill-current text-red-500 transition-transform duration-300 group-hover/vidbtn:scale-110" />
            <span className="whitespace-nowrap transition-colors duration-200 group-hover/vidbtn:text-white">{lang === 'zh' ? '展示影片' : 'VIDEO'}</span>
          </button>
        );
      }

      if (key === 'live') {
        const url = project.websiteUrl || project.liveUrl;
        return (
          <a
            key="btn-live"
            href={url}
            target="_blank"
            rel="noreferrer"
            className={baseClass}
            style={{
              backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
              borderColor: cyanCol,
              color: isLight ? '#0369a1' : '#00f0ff',
            }}
          >
            <Globe size={isCompact ? 13 : 14} className="shrink-0" />
            <span className="whitespace-nowrap">{lang === 'zh' ? '前往前臺' : 'LIVE DEMO'}</span>
          </a>
        );
      }

      if (key === 'admin') {
        return (
          <a
            key="btn-admin"
            href={project.adminUrl}
            target="_blank"
            rel="noreferrer"
            className={baseClass}
            style={{
              backgroundColor: isLight ? '#f3e8ff' : 'rgba(168, 85, 247, 0.20)',
              borderColor: isLight ? '#a855f7' : '#c084fc',
              color: isLight ? '#6b21a8' : '#e9d5ff',
            }}
          >
            <LayoutDashboard size={isCompact ? 13 : 14} className="shrink-0" />
            <span className="whitespace-nowrap">{lang === 'zh' ? '前往後臺' : 'ADMIN CMS'}</span>
          </a>
        );
      }

      if (key === 'github') {
        return (
          <a
            key="btn-github"
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className={baseClass}
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
              borderColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.35)',
              color: isLight ? '#0f172a' : '#ffffff',
            }}
          >
            <TechIcon name="github" size={isCompact ? 14 : 15} className="shrink-0 fill-current" style={{ color: isLight ? '#0f172a' : '#ffffff' }} />
            <span className="whitespace-nowrap">{lang === 'zh' ? '專案代碼' : 'SOURCE'}</span>
          </a>
        );
      }

      return null;
    };

    const count = availableKeys.length;

    if (count === 1) {
      return (
        <div className="w-full flex justify-center">
          {renderSingleBtn(availableKeys[0], isCompact ? 'w-1/2 min-w-[160px]' : 'w-full')}
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className={`grid grid-cols-2 ${isCompact ? 'gap-2.5' : 'gap-2 sm:gap-2.5'} w-full`}>
          {renderSingleBtn(availableKeys[0], 'col-span-1')}
          {renderSingleBtn(availableKeys[1], 'col-span-1')}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className={`grid grid-cols-3 ${isCompact ? 'gap-2 sm:gap-2.5' : 'gap-2 sm:gap-2.5'} w-full`}>
          {renderSingleBtn(availableKeys[0], 'col-span-1')}
          {renderSingleBtn(availableKeys[1], 'col-span-1')}
          {renderSingleBtn(availableKeys[2], 'col-span-1')}
        </div>
      );
    }

    // 4 Buttons: 2x2 or 4x1 grid
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 ${isCompact ? 'gap-2' : 'gap-2 sm:gap-2.5'} w-full`}>
        {availableKeys.map((k) => renderSingleBtn(k, 'col-span-1'))}
      </div>
    );
  };

  return (
    <section id="projects" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* 區塊標題列 */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <FolderGit2 size={32} style={{ color: cyanCol }} className="shrink-0" />
            <span>{t('projects_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('projects_note')}
          </p>
        </div>

        {/* 分類篩選列 - 行動端 2 欄等寬網格 / 桌面端彈性換行 */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto mb-12" role="tablist">
          {filters.map((f, idx) => {
            const isLastOdd = idx === filters.length - 1 && filters.length % 2 !== 0;
            const isActive = filter === f.key;

            // 篩選按鈕專屬色系（精選為金色、全部為白色、全端為青色、互動為藍色）
            let customActiveStyle: React.CSSProperties = {};
            let hoverClass = '';

            if (f.key === 'featured') {
              hoverClass = 'hover:border-amber-400 hover:text-amber-300';
              if (isActive) {
                customActiveStyle = {
                  backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.16)',
                  color: isLight ? '#b45309' : '#fbbf24',
                  borderColor: isLight ? '#f59e0b' : '#f59e0b',
                  boxShadow: isLight ? '0 4px 14px rgba(245, 158, 11, 0.35)' : '0 0 14px rgba(245, 158, 11, 0.45)',
                };
              }
            } else if (f.key === 'all') {
              hoverClass = 'hover:border-white hover:text-white';
              if (isActive) {
                customActiveStyle = {
                  backgroundColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  borderColor: isLight ? '#0f172a' : '#ffffff',
                  boxShadow: isLight ? '0 4px 14px rgba(15, 23, 42, 0.30)' : '0 0 14px rgba(255, 255, 255, 0.45)',
                };
              }
            } else if (f.key === 'fullstack') {
              hoverClass = 'hover:border-cyan-400 hover:text-cyan-300';
              if (isActive) {
                customActiveStyle = {
                  backgroundColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.16)',
                  color: isLight ? '#ffffff' : '#00f0ff',
                  borderColor: isLight ? '#0284c7' : '#00f0ff',
                  boxShadow: isLight ? '0 4px 14px rgba(2, 132, 199, 0.35)' : '0 0 14px rgba(0, 240, 255, 0.45)',
                };
              }
            } else if (f.key === 'interactive') {
              hoverClass = 'hover:border-blue-400 hover:text-blue-300';
              if (isActive) {
                customActiveStyle = {
                  backgroundColor: isLight ? '#2563eb' : 'rgba(59, 130, 246, 0.18)',
                  color: isLight ? '#ffffff' : '#60a5fa',
                  borderColor: isLight ? '#2563eb' : '#3b82f6',
                  boxShadow: isLight ? '0 4px 14px rgba(37, 99, 235, 0.35)' : '0 0 14px rgba(59, 130, 246, 0.45)',
                };
              }
            }

            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setShowAllProjects(false);
                }}
                role="tab"
                aria-selected={isActive}
                style={customActiveStyle}
                className={`h-11 px-3 sm:px-6 w-full sm:w-auto border cyber-cut-sm font-tech text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap ${
                  isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isActive
                    ? 'filter-btn-active scale-[1.02] sm:scale-105 shadow-md'
                    : `filter-btn-inactive ${hoverClass}`
                }`}
              >
                <div className="flex items-center justify-center gap-2 whitespace-nowrap text-inherit">
                  {f.icon}
                  <span className="whitespace-nowrap">{f.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 精選作品模式：六個方塊完整左右對齊，RWD 依序排列且純線分隔 (Dual-Domain 6-Box Symmetrical Aligned Showcase) */}
        {isFeaturedSideBySideView ? (
          <div ref={gridRef} className="max-w-6xl mx-auto">
            {/* 宣告式卡片渲染輔助函式 (左側全端為青色系、右側互動為藍色系，內部自適應 stretch 實現 100% 左右等高) */}
            {(() => {
              const renderCompactCard = (project: ProjectItem | undefined, domain: 'fullstack' | 'interactive', pIdx: number, extraClasses = '') => {
                if (!project) return null;

                const isFullstack = domain === 'fullstack';
                const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
                const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
                const categoryObj = categoryMap[project.category] ?? (isFullstack ? categoryMap.fullstack : categoryMap.interactive);
                const categoryLabel = lang === 'zh' ? categoryObj.zh : categoryObj.en;
                const isPlaceholder = !project.image || project.image.includes('placeholder');

                // 顏色系統：左邊全端為青色 (Cyan)，右邊互動應用為藍色 (Blue)
                const cardBorder = isLight
                  ? (isFullstack ? '#7dd3fc' : '#93c5fd')
                  : (isFullstack ? 'rgba(0, 240, 255, 0.35)' : 'rgba(96, 165, 250, 0.45)');
                const cardBg = isLight
                  ? (isFullstack ? 'linear-gradient(145deg, #f0fdfa 0%, #ffffff 60%, #f8fafc 100%)' : 'linear-gradient(145deg, #eff6ff 0%, #ffffff 60%, #f8fafc 100%)')
                  : (isFullstack ? 'linear-gradient(145deg, rgba(0, 240, 255, 0.08) 0%, rgba(13, 23, 42, 0.52) 45%, rgba(6, 12, 24, 0.62) 100%)' : 'linear-gradient(145deg, rgba(59, 130, 246, 0.08) 0%, rgba(13, 23, 42, 0.52) 45%, rgba(6, 12, 24, 0.62) 100%)');
                const cardShadow = isLight
                  ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 4px 20px rgba(0,0,0,0.04)'
                  : (isFullstack ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 240, 255, 0.1)' : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(59, 130, 246, 0.1)');
                const headerBg = isLight
                  ? (isFullstack ? 'rgba(240, 253, 250, 0.9)' : 'rgba(239, 246, 255, 0.9)')
                  : (isFullstack ? 'rgba(0, 240, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)');
                const headerBorder = isLight
                  ? (isFullstack ? '#bae6fd' : '#bfdbfe')
                  : (isFullstack ? 'rgba(0, 240, 255, 0.22)' : 'rgba(96, 165, 250, 0.25)');
                const pillarBg = isFullstack ? '#00f0ff' : '#3b82f6';
                const pillarShadow = isFullstack ? '0 0 8px rgba(0, 240, 255, 0.7)' : '0 0 8px rgba(59, 130, 246, 0.7)';
                const titleHoverClass = isFullstack ? 'hover:text-cyan-400' : 'hover:text-blue-400';
                const thumbBorder = isLight
                  ? (isFullstack ? '#bae6fd' : '#bfdbfe')
                  : (isFullstack ? 'rgba(0, 240, 255, 0.25)' : 'rgba(96, 165, 250, 0.28)');
                const footerBorder = isLight
                  ? (isFullstack ? '#e0f2fe' : '#dbeafe')
                  : (isFullstack ? 'rgba(0, 240, 255, 0.18)' : 'rgba(96, 165, 250, 0.20)');

                return (
                  <div key={project.id} className={`${extraClasses} flex flex-col h-full`}>
                    <Tilt3DCard
                      isInteractive={!isFullstack}
                      className={`cyber-card border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-lg relative flex flex-col justify-between h-full flex-1 overflow-hidden group reveal-scale reveal-d${((pIdx % 3) + 1) as 1 | 2 | 3}`}
                      style={{
                        background: cardBg,
                        borderColor: cardBorder,
                        boxShadow: cardShadow,
                      }}
                    >
                      {/* 1. 頂部通欄 Header：作品名稱（左）＋ 右邊標籤（右） */}
                      <div
                        className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b flex items-center justify-between gap-3 min-w-0"
                        style={{
                          backgroundColor: headerBg,
                          borderColor: headerBorder,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-1.5 h-4 rounded-xs shrink-0 transition-all duration-300 group-hover:scale-y-125"
                            style={{
                              backgroundColor: pillarBg,
                              boxShadow: pillarShadow,
                            }}
                          />
                          <h4
                            className={`text-sm sm:text-base font-black font-hud uppercase tracking-tight cursor-pointer transition-colors leading-tight truncate ${titleHoverClass}`}
                            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                            onClick={() => setSelectedProjectModal(project)}
                            title={title}
                          >
                            {title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {(project.isFullAi || project.aiAssisted) && (
                            <span
                              className="px-2.5 py-1 border font-tech text-xs font-extrabold uppercase cyber-cut-sm flex items-center gap-1.5 shadow-xs shrink-0 whitespace-nowrap tracking-wide"
                              style={{
                                backgroundColor: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
                                borderColor: isLight ? '#34d399' : '#10b981',
                                color: isLight ? '#065f46' : '#34d399',
                              }}
                              title="AI-Assisted Dev"
                            >
                              <Cpu size={13} className="shrink-0 text-emerald-400" />
                              <span>{lang === 'zh' ? 'AI 輔助開發' : 'AI-Assisted Dev'}</span>
                            </span>
                          )}
                          <span
                            className="px-2.5 py-1 border font-tech text-xs font-extrabold uppercase cyber-cut-sm flex items-center gap-1.5 shadow-xs shrink-0 whitespace-nowrap tracking-wide"
                            style={{
                              backgroundColor: isLight ? categoryObj.lightBg : categoryObj.darkBg,
                              borderColor: isLight ? categoryObj.lightBorder : categoryObj.darkBorder,
                              color: isLight ? categoryObj.lightText : categoryObj.darkText,
                            }}
                          >
                            {renderCategoryIcon(categoryObj.iconName, 13, "shrink-0")}
                            <span>{categoryLabel}</span>
                          </span>
                        </div>
                      </div>

                      {/* 2. 中間主體：左側 16:9 圖片 vs 右側 敘述容器 (flex-1 搭配 h-full 實現左右卡片 100% 等高齊平) */}
                      <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch flex-1">
                        {/* 左側：圖片 保持 16 比 9 */}
                        <div
                          className="w-full aspect-video rounded-sm relative overflow-hidden bg-slate-950 border cyber-cut-sm cursor-pointer flex items-center justify-center group/thumb self-center"
                          style={{ borderColor: thumbBorder }}
                          onClick={() => setSelectedProjectModal(project)}
                        >
                          {isPlaceholder ? (
                            <div className="w-full h-full aspect-video p-3 flex flex-col items-center justify-center text-center space-y-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none">
                              <div className="w-7 h-7 rounded-sm flex items-center justify-center border border-slate-700/80 bg-slate-800/60 text-slate-400 group-hover/thumb:text-blue-400 transition-colors">
                                <Code2 size={15} />
                              </div>
                              <span className="font-tech text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                {lang === 'zh' ? '即將推出' : 'IN DEV'}
                              </span>
                              <span className="font-tech text-[8px] text-slate-500 uppercase tracking-widest">
                                PROTOTYPE
                              </span>
                            </div>
                          ) : (
                            <>
                              <img
                                src={getAssetUrl(project.image)}
                                alt={title}
                                width="640"
                                height="360"
                                className="w-full h-full aspect-video object-cover object-center transition-transform duration-500 group-hover/thumb:scale-105"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="card-scanline-laser opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                          )}
                        </div>

                        {/* 右側：敘述容器 (自適應填滿剩餘高度並垂直居中文字) */}
                        <div
                          className="p-3 sm:p-3.5 rounded-sm border flex items-center transition-colors h-full"
                          style={{
                            backgroundColor: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.45)',
                            borderColor: isLight ? '#e2e8f0' : 'rgba(51, 65, 85, 0.5)',
                          }}
                        >
                          <p
                            className="text-xs sm:text-[13px] font-tech leading-relaxed"
                            style={{ color: isLight ? '#334155' : '#cbd5e1' }}
                          >
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* 3. 底部通欄：按鈕區域 (mt-auto 確保永遠釘在最底端，與對側按鈕水平切齊) */}
                      <div
                        className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-t mt-auto"
                        style={{
                          backgroundColor: isLight ? '#f8fafc' : 'rgba(3, 7, 18, 0.6)',
                          borderColor: footerBorder,
                        }}
                      >
                        {renderProjectActionButtons(project, true)}
                      </div>
                    </Tilt3DCard>
                  </div>
                );
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                  {/* ── 行 1：全端開發 領域標頭 (青色) ── */}
                  <div
                    className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 flex items-center justify-center pb-2.5 border-b-2 relative"
                    style={{ borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.45)' }}
                  >
                    <h3
                      className="text-base sm:text-lg font-black font-hud uppercase tracking-wider text-center"
                      style={{ color: isLight ? '#0284c7' : '#00f0ff' }}
                    >
                      {lang === 'zh' ? categoryMap.fullstack.zh : categoryMap.fullstack.en}
                    </h3>
                  </div>

                  {/* ── 行 1：互動應用開發 領域標頭 (藍色) ── */}
                  <div
                    className="order-6 lg:order-none lg:col-start-2 lg:row-start-1 flex items-center justify-center pb-2.5 border-b-2 relative"
                    style={{ borderColor: isLight ? '#2563eb' : 'rgba(96, 165, 250, 0.55)' }}
                  >
                    <h3
                      className="text-base sm:text-lg font-black font-hud uppercase tracking-wider text-center"
                      style={{ color: isLight ? '#1d4ed8' : '#60a5fa' }}
                    >
                      {lang === 'zh' ? categoryMap.interactive.zh : categoryMap.interactive.en}
                    </h3>
                  </div>

                  {/* ── 行 2：配對 1 (左 1 全端 vs 右 1 互動，在同一 Row 嚴格等高切齊) ── */}
                  {renderCompactCard(featuredFullstackProjects[0], 'fullstack', 0, 'order-2 lg:order-none lg:col-start-1 lg:row-start-2')}
                  {renderCompactCard(featuredInteractiveProjects[0], 'interactive', 0, 'order-7 lg:order-none lg:col-start-2 lg:row-start-2')}

                  {/* ── 行 3：配對 2 (左 2 全端 vs 右 2 互動，在同一 Row 嚴格等高切齊) ── */}
                  {renderCompactCard(featuredFullstackProjects[1], 'fullstack', 1, 'order-3 lg:order-none lg:col-start-1 lg:row-start-3')}
                  {renderCompactCard(featuredInteractiveProjects[1], 'interactive', 1, 'order-8 lg:order-none lg:col-start-2 lg:row-start-3')}

                  {/* ── 行 4：配對 3 (左 3 全端 vs 右 3 互動，在同一 Row 嚴格等高切齊) ── */}
                  {renderCompactCard(featuredFullstackProjects[2], 'fullstack', 2, 'order-4 lg:order-none lg:col-start-1 lg:row-start-4')}
                  {renderCompactCard(featuredInteractiveProjects[2], 'interactive', 2, 'order-9 lg:order-none lg:col-start-2 lg:row-start-4')}

                  {/* ── RWD 行動端專屬分隔線 (僅於 < lg 螢幕顯示，單純俐落一條線，銜接舒適間距) ── */}
                  <div
                    className="order-5 block lg:hidden my-6 border-t col-span-1"
                    style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)' }}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
          /* STANDARD DETAILED LIST VIEW */
          <div ref={listRef} className="max-w-6xl mx-auto space-y-8">
            {visibleProjects.map((project, lIdx) => {
              const title = lang === 'zh' ? project.title_zh : (project.title_en || project.title_zh);
              const desc = lang === 'zh' ? project.desc : (project.desc_en || project.desc);
              const honorsList = lang === 'zh' ? project.honors : (project.honors_en || project.honors);
              const contribList = lang === 'zh' ? project.contributions : (project.contributions_en || project.contributions);
              const projectDate = lang === 'zh' ? project.date : (project.date_en || project.date);
              const categoryObj = categoryMap[project.category] ?? fallbackCategoryStyle;
              const categoryLabel = lang === 'zh' ? categoryObj.zh : categoryObj.en;

              return (
                <article
                  key={project.id}
                  className={`cyber-card p-6 sm:p-7 border cyber-cut-corner backdrop-blur-xl transition-all duration-300 shadow-lg relative reveal-left reveal-d${((lIdx % 3) + 1) as 1 | 2 | 3}`}
                  style={{
                    background: isLight
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
                      : 'linear-gradient(135deg, rgba(13, 23, 42, 0.52) 0%, rgba(6, 12, 24, 0.62) 100%)',
                    borderColor: borderCol,
                    boxShadow: isLight
                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 12px 30px rgba(15, 23, 42, 0.06)'
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                    {/* 左欄：媒體預覽與動作按鈕 */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* 專案封面縮圖 */}
                      <div
                        className="relative group overflow-hidden cyber-cut-corner border shadow-md aspect-video w-full"
                        style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.35)' }}
                      >
                        <img
                          src={getAssetUrl(project.image)}
                          alt={title}
                          width="640"
                          height="360"
                          className="w-full h-full aspect-video object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="card-scanline-laser opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* 操作按鈕橫列 */}
                      <div className="pt-1 w-full">
                        {renderProjectActionButtons(project)}
                      </div>
                    </div>

                    {/* 右欄：專案詳細內容 */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-4 flex-1">
                        <div className="border-b border-slate-700/30 pb-3 space-y-2.5">
                          <h3
                            className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight"
                            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                          >
                            {title}
                          </h3>
                          <div className="flex flex-row items-center flex-wrap gap-2 sm:gap-2.5">
                            <span
                              className="px-3 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shadow-xs w-fit flex items-center gap-1.5"
                              style={{
                                backgroundColor: isLight ? categoryObj.lightBg : categoryObj.darkBg,
                                borderColor: isLight ? categoryObj.lightBorder : categoryObj.darkBorder,
                                color: isLight ? categoryObj.lightText : categoryObj.darkText,
                              }}
                            >
                              {renderCategoryIcon(categoryObj.iconName, 13, "shrink-0")}
                              <span>{categoryLabel}</span>
                            </span>
                            {(project.isFullAi || project.aiAssisted) && (
                              <span className="px-2.5 py-1 border border-solid rounded-none font-tech text-xs sm:text-sm font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs transition-shadow"
                                style={{
                                  backgroundColor: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.12)',
                                  borderColor: isLight ? '#34d399' : '#10b981',
                                  color: isLight ? '#065f46' : '#a7f3d0',
                                  boxShadow: isLight ? 'none' : '0 0 6px rgba(16, 185, 129, 0.35)',
                                }}
                              >
                                <Cpu size={12} className="shrink-0" />
                                <span>{lang === 'zh' ? 'AI 輔助開發' : 'AI-Assisted Dev'}</span>
                              </span>
                            )}
                            <span className="text-xs sm:text-sm font-tech font-bold font-mono whitespace-nowrap" style={{ color: isLight ? '#334155' : '#a5f3fc' }}>
                              {projectDate}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                          {desc}
                        </p>

                        {/* 渲染核心技術貢獻與亮點項目列表 */}
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

                      {/* 完整技術標籤（固定於卡片底部） */}
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

        {/* 空狀態提示卡片 (分類查無作品時之回退) */}
        {visibleProjects.length === 0 && (
          <div
            className="max-w-3xl mx-auto p-10 sm:p-12 text-center border cyber-cut-corner backdrop-blur-xl space-y-4 my-8 shadow-lg reveal-scale"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
                : 'linear-gradient(135deg, rgba(13, 23, 42, 0.52) 0%, rgba(6, 12, 24, 0.62) 100%)',
              borderColor: borderCol,
              boxShadow: isLight
                ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 12px 30px rgba(15, 23, 42, 0.06)'
                : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 36px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-center text-slate-500">
              <FolderGit2 size={42} style={{ color: cyanCol }} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-hud uppercase tracking-wider" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
              {lang === 'zh' ? '目前尚無相關專案' : 'No Projects Available Yet'}
            </h3>
            <p className="text-xs sm:text-sm font-tech leading-relaxed" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
              {lang === 'zh' ? '專案準備中，敬請期待最新開發作品！' : 'Projects in development, stay tuned for upcoming releases!'}
            </p>
          </div>
        )}

        {/* 導覽動作按鈕：精選模式 (檢視更多) / 全部模式 (收合專案) */}
        {filter === 'featured' && (
          <div className="text-center mt-12 mb-4 relative z-10" id="expand-button-container">
            <button
              onClick={() => {
                setFilter('all');
                setShowAllProjects(true);
                const element = document.getElementById('projects');
                if (element) {
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="px-8 sm:px-10 py-3.5 border font-hud font-bold text-xs sm:text-sm uppercase tracking-widest cyber-cut-corner transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg inline-flex items-center gap-2.5"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: cyanCol,
                color: cyanCol,
                boxShadow: isLight ? '0 4px 12px rgba(2,132,199,0.15)' : '0 0 15px rgba(0,240,255,0.25)',
              }}
              aria-label={lang === 'zh' ? '檢視更多' : 'View More'}
            >
              <span>{lang === 'zh' ? '檢視更多' : 'VIEW MORE'}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {filter === 'all' && (
          <div ref={collapseButtonRef} className="text-center mt-12 mb-4 relative z-10" id="expand-button-container">
            <button
              onClick={() => {
                if (!showAllProjects) {
                  setShowAllProjects(true);
                } else {
                  // 平滑滾動至收合按鈕本身位置（而非頁首），維持使用者視覺焦點連續性
                  setShowAllProjects(false);
                  requestAnimationFrame(() => {
                    const el = collapseButtonRef.current;
                    if (el) {
                      const rect = el.getBoundingClientRect();
                      const headerOffset = 120;
                      window.scrollTo({
                        top: window.scrollY + rect.top - headerOffset,
                        behavior: 'smooth',
                      });
                    }
                  });
                }
              }}
              className="px-8 sm:px-10 py-3.5 border font-hud font-bold text-xs sm:text-sm uppercase tracking-widest cyber-cut-corner transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg inline-flex items-center gap-2.5"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: cyanCol,
                color: cyanCol,
                boxShadow: isLight ? '0 4px 12px rgba(2,132,199,0.15)' : '0 0 15px rgba(0,240,255,0.25)',
              }}
              aria-label={showAllProjects ? (lang === 'zh' ? '收起專案' : 'Collapse Projects') : (lang === 'zh' ? '檢視更多' : 'View More')}
            >
              <span>
                {showAllProjects
                  ? (lang === 'zh' ? '收起專案' : 'COLLAPSE PROJECTS')
                  : (lang === 'zh' ? '檢視更多' : 'VIEW MORE')}
              </span>
              {showAllProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}

        {/* 專案完整詳細資訊燈箱視窗（Lightbox 互動彈窗） */}
        {selectedProjectModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 lg:p-8 animate-fadeIn select-none"
            style={{
              backgroundColor: isLight ? 'rgba(248, 250, 252, 0.50)' : 'rgba(3, 7, 18, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onClick={() => setSelectedProjectModal(null)}
          >
            <div
              className="relative w-full max-w-6xl border cyber-cut-corner p-4 sm:p-7 lg:p-8 shadow-2xl transition-all duration-300 max-h-[94vh] sm:max-h-[90vh] lg:max-h-[88vh] overflow-y-auto modal-scroll-container"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#080e1a',
                borderColor: cyanCol,
                boxShadow: isLight
                  ? '0 20px 60px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(2, 132, 199, 0.2)'
                  : '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 240, 255, 0.25)',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 右上角關閉按鈕 */}
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 border cyber-cut-sm hover:scale-105 active:scale-95 transition-all cursor-pointer z-30"
                style={{
                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)',
                  borderColor: borderCol,
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
                aria-label="關閉視窗 (Close Modal)"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* 完美平衡之左右雙欄佈局 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* 左欄：媒體預覽與動作按鈕 */}
                <div className="lg:col-span-5 space-y-4">
                  {/* 16:9 高畫質多媒體預覽視窗 */}
                  <div className="aspect-video w-full overflow-hidden cyber-cut-corner border shadow-md relative" style={{ borderColor: borderCol }}>
                    <img
                      src={getAssetUrl(selectedProjectModal.image)}
                      alt={selectedProjectModal.title_zh}
                      loading="eager"
                      decoding="async"
                      width="800"
                      height="450"
                      className="w-full h-full aspect-video object-cover object-center"
                    />
                    <div className="card-scanline-laser opacity-85" />
                  </div>

                  {/* 操作按鈕橫列 */}
                  <div className="pt-1 w-full">
                    {renderProjectActionButtons(selectedProjectModal)}
                  </div>
                </div>

                {/* 右欄：專案詳細內容 (對齊全部作品排版) */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-full pr-0 sm:pr-6">
                  <div className="space-y-4 flex-1">
                    {/* 頂部標題列 */}
                    <div className="border-b border-slate-700/30 pb-3 space-y-2.5">
                      <h3
                        className="text-xl sm:text-2xl font-black font-hud uppercase tracking-tight"
                        style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                      >
                        {lang === 'zh' ? selectedProjectModal.title_zh : (selectedProjectModal.title_en || selectedProjectModal.title_zh)}
                      </h3>
                      <div className="flex flex-row items-center flex-wrap gap-2 sm:gap-2.5">
                        <span
                          className="px-3 py-1 border font-tech text-xs sm:text-sm font-bold uppercase tracking-wider cyber-cut-sm shadow-xs w-fit flex items-center gap-1.5"
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
                          {renderCategoryIcon((categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).iconName, 13, "shrink-0")}
                          <span>
                            {lang === 'zh'
                              ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).zh
                              : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).en}
                          </span>
                        </span>
                        {(selectedProjectModal.isFullAi || selectedProjectModal.aiAssisted) && (
                          <span className="px-2.5 py-1 border border-solid rounded-none font-tech text-xs sm:text-sm font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-xs transition-shadow"
                            style={{
                              backgroundColor: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.12)',
                              borderColor: isLight ? '#34d399' : '#10b981',
                              color: isLight ? '#065f46' : '#a7f3d0',
                              boxShadow: isLight ? 'none' : '0 0 6px rgba(16, 185, 129, 0.35)',
                            }}
                          >
                            <Cpu size={12} className="shrink-0" />
                            <span>{lang === 'zh' ? 'AI 輔助開發' : 'AI-Assisted Dev'}</span>
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-tech font-bold font-mono whitespace-nowrap" style={{ color: isLight ? '#334155' : '#a5f3fc' }}>
                          {lang === 'zh' ? selectedProjectModal.date : (selectedProjectModal.date_en || selectedProjectModal.date)}
                        </span>
                      </div>
                    </div>

                    {/* 詳細內容描述 */}
                    <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                      {lang === 'zh' ? selectedProjectModal.desc : (selectedProjectModal.desc_en || selectedProjectModal.desc)}
                    </p>

                    {/* 核心技術亮點 */}
                    {((lang === 'zh' ? selectedProjectModal.contributions : (selectedProjectModal.contributions_en || selectedProjectModal.contributions)) || []).length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-xs sm:text-sm font-hud font-bold uppercase tracking-wider" style={{ color: isLight ? (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).lightText : (categoryMap[selectedProjectModal.category] ?? fallbackCategoryStyle).darkText }}>
                          {lang === 'zh' ? '核心技術亮點：' : 'KEY HIGHLIGHTS:'}
                        </p>
                        <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1 pl-1" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                          {((lang === 'zh' ? selectedProjectModal.contributions : (selectedProjectModal.contributions_en || selectedProjectModal.contributions)) || []).map((cItem, cIdx) => (
                            <li key={cIdx} className="leading-relaxed">{cItem}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 榮譽與獲獎紀錄 (若存在) */}
                    {((lang === 'zh' ? selectedProjectModal.honors : (selectedProjectModal.honors_en || selectedProjectModal.honors)) || []).length > 0 && (
                      <div
                        className="p-3.5 border font-tech text-xs sm:text-sm space-y-1 cyber-cut-sm"
                        style={{
                          backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.15)',
                          borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.35)',
                          color: isLight ? '#b45309' : '#fbbf24',
                        }}
                      >
                        {((lang === 'zh' ? selectedProjectModal.honors : (selectedProjectModal.honors_en || selectedProjectModal.honors)) || []).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 font-bold">
                            <Trophy size={15} className="shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 底部固定技術標籤群組 */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 mt-auto">
                    {selectedProjectModal.tags.map((tTag, idx) => (
                      <span key={idx} className="tech-tag px-3 py-1 border text-xs sm:text-sm font-semibold inline-flex items-center">
                        <span>{tTag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
