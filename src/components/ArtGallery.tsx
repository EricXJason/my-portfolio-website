import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  ZoomIn,
  ShieldAlert,
  Layers,
  Box,
  Component,
  PenTool,
  Paintbrush,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  ArrowRight,
} from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import artGalleryDataJson from '../data/gallery-section.json';

interface Artwork {
  id: string;
  cat: string;
  img: string;
  embedUrl?: string;
}

const artGalleryData = artGalleryDataJson as Artwork[];

export const ArtGallery: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState('featured');
  const [activeImage, setActiveImage] = useState<Artwork | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Roulette State
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Featured artworks restricted strictly to 3D Scene and 3D Prop categories
  const displayFeatured = artGalleryData.filter(
    (item) => item.cat === '3d-scene' || item.cat === '3d-prop'
  );

  const filteredArt = artGalleryData.filter(
    (item) => activeTab === 'all' || item.cat === activeTab
  );

  const displayedArt = isExpanded ? filteredArt : filteredArt.slice(0, 8);

  const activeIndex = activeImage
    ? (activeTab === 'featured' ? displayFeatured : filteredArt).findIndex((item) => item.id === activeImage.id)
    : -1;

  const currentList = activeTab === 'featured' ? displayFeatured : filteredArt;

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentList.length === 0) return;
    const prevIdx = (activeIndex - 1 + currentList.length) % currentList.length;
    setActiveImage(currentList[prevIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentList.length === 0) return;
    const nextIdx = (activeIndex + 1) % currentList.length;
    setActiveImage(currentList[nextIdx]);
  };

  const handleCloseModal = () => {
    document.body.classList.remove('hide-custom-cursor');
    setActiveImage(null);
  };

  // Roulette auto-rotation effect
  useEffect(() => {
    if (activeTab !== 'featured' || !isAutoPlay || activeImage) return;
    const interval = setInterval(() => {
      setRouletteIndex((prev) => (prev + 1) % displayFeatured.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeTab, isAutoPlay, activeImage, displayFeatured.length]);

  useEffect(() => {
    if (!activeImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (currentList.length === 0) return;
        const prevIdx = (activeIndex - 1 + currentList.length) % currentList.length;
        setActiveImage(currentList[prevIdx]);
      } else if (e.key === 'ArrowRight') {
        if (currentList.length === 0) return;
        const nextIdx = (activeIndex + 1) % currentList.length;
        setActiveImage(currentList[nextIdx]);
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('hide-custom-cursor');
    };
  }, [activeImage, activeIndex, currentList]);

  // Tab buttons configuration matching Projects component styling
  const tabs = [
    { key: 'featured', label: lang === 'zh' ? '精選作品' : 'Featured Works', icon: <Star size={16} className="text-amber-400 fill-amber-400" /> },
    { key: 'all', label: lang === 'zh' ? '全部作品' : 'All Works', icon: <Layers size={16} /> },
    { key: '3d-scene', label: lang === 'zh' ? '3D 場景' : '3D Environments', icon: <Box size={16} /> },
    { key: '3d-prop', label: lang === 'zh' ? '3D 物件' : '3D Assets & Props', icon: <Component size={16} /> },
    { key: 'sketch', label: lang === 'zh' ? '2D 素描' : '2D Sketches', icon: <PenTool size={16} /> },
    { key: 'marker', label: lang === 'zh' ? '2D 麥克筆' : '2D Marker Art', icon: <Paintbrush size={16} /> },
  ];

  return (
    <section id="gallery" className="py-16 sm:py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('gallery_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-normal leading-relaxed">
            {t('gallery_note')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Category Tabs — Equal width & neat grid layout matching Projects */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-12 max-w-4xl mx-auto" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsExpanded(false);
              }}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`h-11 sm:h-12 px-3 sm:px-5 sm:min-w-[150px] rounded-xl text-xs sm:text-sm font-code font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm border-2 w-full sm:w-auto ${
                activeTab === tab.key
                  ? 'filter-btn-active bg-slate-900 text-white border-cyan-500 shadow-md shadow-cyan-500/20 scale-105'
                  : 'filter-btn-inactive bg-slate-900/60 dark:bg-slate-900/60 light:bg-white text-[var(--text-sub)] border-slate-800 dark:border-slate-800 light:border-slate-300 hover:border-cyan-600'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FEATURED ROULETTE CAROUSEL VIEW */}
        {activeTab === 'featured' ? (
          <div className="relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col items-center py-4 sm:py-6">

            {/* 3D Roulette Stage */}
            <div
              className="relative w-full h-[280px] sm:h-[380px] md:h-[420px] flex items-center justify-center perspective-1000 overflow-hidden"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {displayFeatured.map((art, idx) => {
                const total = displayFeatured.length;
                let offset = idx - rouletteIndex;
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                const isCenter = offset === 0;
                const absOffset = Math.abs(offset);

                // Calculate 3D transforms for card roulette
                const translateX = offset * (window.innerWidth < 640 ? 110 : 220);
                const scale = Math.max(0.65, 1 - absOffset * 0.16);
                const rotateY = offset * -18;
                const opacity = Math.max(0, 1 - absOffset * 0.35);
                const zIndex = 30 - absOffset * 5;

                if (absOffset > 2) return null; // Hide far off cards

                return (
                  <div
                    key={art.id}
                    onClick={() => {
                      if (isCenter) {
                        setActiveImage(art);
                      } else {
                        setRouletteIndex(idx);
                      }
                    }}
                    className={`absolute w-52 h-52 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-[var(--border-color)] hover:border-cyan-500/50 transition-all duration-700 ease-out shadow-2xl ${
                      isCenter
                        ? 'shadow-cyan-500/25 border-cyan-500/40'
                        : 'shadow-slate-950/60'
                    }`}
                    style={{
                      transform: `translate3d(${translateX}px, 0, ${-absOffset * 100}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    }}
                  >
                    <img
                      src={getAssetUrl(art.img)}
                      alt="Featured Artwork"
                      className="w-full h-full object-cover select-none"
                      decoding="async"
                    />

                    {/* Small top-right zoom icon */}
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 text-cyan-400 border border-cyan-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                      <ZoomIn size={14} />
                    </div>
                  </div>
                );
              })}

              {/* Roulette Prev / Next Controls */}
              <button
                onClick={() => setRouletteIndex((prev) => (prev - 1 + displayFeatured.length) % displayFeatured.length)}
                className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-700 light:border-slate-300 text-[var(--text-main)] shadow-xl transition-transform hover:scale-110 cursor-pointer"
                aria-label="Previous Featured Artwork"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setRouletteIndex((prev) => (prev + 1) % displayFeatured.length)}
                className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-700 light:border-slate-300 text-[var(--text-main)] shadow-xl transition-transform hover:scale-110 cursor-pointer"
                aria-label="Next Featured Artwork"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dots indicator with cyan active highlight */}
            <div className="flex items-center gap-2 mt-6 mb-8">
              {displayFeatured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setRouletteIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    rouletteIndex === idx ? 'w-8 bg-cyan-400 shadow-xs shadow-cyan-400/50' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* More Works Button (Switch to All Works Grid and Auto-Expand All) */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setIsExpanded(true);
                }}
                className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 light:border-slate-300 hover:border-cyan-500 text-[var(--text-main)] font-bold text-sm font-code transition-all shadow-md inline-flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-cyan-500/20"
              >
                <span>{lang === 'zh' ? '檢視更多美術作品' : 'View More Artworks'}</span>
                <ChevronDown size={18} className="text-cyan-400" />
              </button>
            </div>
          </div>
        ) : (
          /* TRADITIONAL GRID VIEW FOR OTHER TABS */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
              {displayedArt.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveImage(art)}
                  className="group glass-card rounded-2xl overflow-hidden cursor-pointer relative aspect-square max-h-52 sm:max-h-none border border-[var(--border-color)] hover:border-cyan-500/50 transition-all duration-300 shadow-sm"
                >
                  <img
                    src={getAssetUrl(art.img)}
                    alt="Artwork Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Small top-right zoom icon */}
                  <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 text-cyan-400 border border-cyan-500/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                    <ZoomIn size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Expand / Collapse Button */}
            {filteredArt.length > 8 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 light:border-slate-300 hover:border-cyan-500 text-[var(--text-main)] font-bold text-sm font-code transition-all shadow-md inline-flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-cyan-500/20"
                >
                  <span>
                    {isExpanded
                      ? (lang === 'zh' ? '收起美術作品' : 'Collapse Artworks')
                      : (lang === 'zh' ? '檢視更多美術作品' : 'View More Artworks')}
                  </span>
                  {isExpanded ? <ChevronUp size={18} className="text-cyan-400" /> : <ChevronDown size={18} className="text-cyan-400" />}
                </button>
              </div>
            )}
          </>
        )}

        {/* Human Authenticity Disclaimer Badge — Sleek Glassmorphic Pill */}
        <div className="mt-8 sm:mt-10 text-center">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border text-xs sm:text-sm font-code font-semibold tracking-wide shadow-sm transition-all hover:scale-105"
            style={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.7)',
              borderColor: isLight ? '#cbd5e1' : 'rgba(6,182,212,0.3)',
              boxShadow: isLight
                ? '0 4px 15px rgba(0,0,0,0.04)'
                : '0 4px 20px rgba(6,182,212,0.12)',
            }}
          >
            <ShieldAlert size={16} className="shrink-0" style={{ color: isLight ? '#0284c7' : '#22d3ee' }} />
            <span style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
              {lang === 'zh'
                ? '美術作品無任何 AI 參與'
                : 'Handcrafted artworks with NO AI involvement.'}
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal — Snug fit with proper mobile scaling */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`relative w-full border rounded-2xl overflow-hidden shadow-2xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all ${
              activeImage.embedUrl ? 'max-w-6xl' : 'max-w-5xl'
            }`}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0f172a',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
              boxShadow: isLight
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div
              className="w-full flex items-center justify-end pb-2.5 border-b mb-3"
              style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center gap-2.5">
                <a
                  href={getAssetUrl(activeImage.img)}
                  download={`artwork-${activeImage.id}.avif`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 px-3.5 rounded-xl border text-xs font-bold font-code transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-105"
                  style={{
                    backgroundColor: isLight ? '#f0f9ff' : 'rgba(6,182,212,0.12)',
                    borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
                    color: isLight ? '#0369a1' : '#22d3ee',
                  }}
                  title={lang === 'zh' ? '下載作品原圖' : 'Download Image'}
                >
                  <Download size={14} />
                  <span>{lang === 'zh' ? '下載圖片' : 'Download'}</span>
                </a>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl border transition-colors cursor-pointer hover:scale-105"
                  style={{
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                    color: isLight ? '#0f172a' : '#f8fafc',
                  }}
                  aria-label="Close Lightbox"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="relative w-full flex items-center justify-center">
              {currentList.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full shadow-2xl transition-all cursor-pointer group flex items-center justify-center border"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    boxShadow: isLight ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#06b6d4';
                    e.currentTarget.style.borderColor = '#22d3ee';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)';
                    e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = isLight ? '#0f172a' : '#ffffff';
                  }}
                  aria-label="Previous Image"
                  title={lang === 'zh' ? '上一張 (← 鍵盤左鍵)' : 'Previous (← Arrow)'}
                >
                  <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}

              {activeImage.embedUrl ? (
                <div
                  className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl"
                  onMouseEnter={() => document.body.classList.add('hide-custom-cursor')}
                  onMouseLeave={() => document.body.classList.remove('hide-custom-cursor')}
                >
                  <iframe
                    src={activeImage.embedUrl}
                    title={`ArtStation 3D View ${activeImage.id}`}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={getAssetUrl(activeImage.img)}
                  alt="Artwork View"
                  className="max-h-[65vh] sm:max-h-[78vh] w-auto max-w-full object-contain rounded-lg shadow-lg select-none"
                  decoding="async"
                />
              )}

              {currentList.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full shadow-2xl transition-all cursor-pointer group flex items-center justify-center border"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    boxShadow: isLight ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#06b6d4';
                    e.currentTarget.style.borderColor = '#22d3ee';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.85)';
                    e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = isLight ? '#0f172a' : '#ffffff';
                  }}
                  aria-label="Next Image"
                  title={lang === 'zh' ? '下一張 (→ 鍵盤右鍵)' : 'Next (→ Arrow)'}
                >
                  <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
