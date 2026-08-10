import React, { useState, useEffect, useCallback } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Layers,
  Box,
  Component,
  PenTool,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  Star,
  Camera,
  Palette
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

  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 40;

  // Featured artworks strictly for 3D Scene and 3D Prop categories
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

  const handlePrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentList.length === 0) return;
    const prevIdx = (activeIndex - 1 + currentList.length) % currentList.length;
    setActiveImage(currentList[prevIdx]);
  }, [activeIndex, currentList]);

  const handleNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentList.length === 0) return;
    const nextIdx = (activeIndex + 1) % currentList.length;
    setActiveImage(currentList[nextIdx]);
  }, [activeIndex, currentList]);

  const handleCloseModal = useCallback(() => {
    document.body.classList.remove('hide-custom-cursor');
    setActiveImage(null);
  }, []);

  const handleRouletteTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleRouletteTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleRouletteTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      setRouletteIndex((prev) => (prev + 1) % displayFeatured.length);
    } else if (distance < -minSwipeDistance) {
      setRouletteIndex((prev) => (prev - 1 + displayFeatured.length) % displayFeatured.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsAutoPlay(true);
  };

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
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape' || e.code === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.classList.remove('hide-custom-cursor');
    };
  }, [activeImage, handlePrevImage, handleNextImage, handleCloseModal]);

  const tabs = [
    { key: 'featured', label: lang === 'zh' ? '精選作品' : 'Featured Works', icon: <Star size={14} className="text-amber-400 fill-amber-400" /> },
    { key: 'all', label: lang === 'zh' ? '全部作品' : 'All Works', icon: <Layers size={14} /> },
    { key: '3d-scene', label: lang === 'zh' ? '3D 場景' : '3D Environments', icon: <Box size={14} /> },
    { key: '3d-prop', label: lang === 'zh' ? '3D 物件' : '3D Assets & Props', icon: <Component size={14} /> },
    { key: 'sketch', label: lang === 'zh' ? '2D 素描' : '2D Sketches', icon: <PenTool size={14} /> },
    { key: 'marker', label: lang === 'zh' ? '2D 麥克筆' : '2D Marker Art', icon: <Paintbrush size={14} /> },
  ];

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <section id="gallery" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div
            className="inline-flex items-center gap-2 font-tech text-xs font-bold uppercase tracking-wider px-3.5 py-1 border cyber-cut-sm shadow-sm"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#080e1a',
              borderColor: borderCol,
              color: cyanCol,
            }}
          >
            <Camera size={14} />
            <span>{lang === 'zh' ? '美術畫廊與 3D 視覺展覽' : 'ART & 3D GALLERY'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            <Palette size={32} className="text-cyan-400 shrink-0" />
            <span>{t('gallery_title')}</span>
          </h2>
          <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            {t('gallery_note')}
          </p>
        </div>

        {/* Category Filter Bar — Flexible Wrap with Zero Text Truncation */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-5xl mx-auto mb-12" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsExpanded(false);
              }}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`h-11 px-5 sm:px-6 border cyber-cut-sm font-tech text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap shrink-0 ${
                activeTab === tab.key
                  ? 'filter-btn-active scale-105 shadow-md'
                  : 'filter-btn-inactive'
              }`}
            >
              <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* FEATURED 3D COVER-FLOW CAROUSEL (SQUARE SCI-FI TACTICAL FRAME & BUTTONS) */}
        {activeTab === 'featured' ? (
          <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center py-6 select-none">

            {/* Carousel Outer Track Window */}
            <div
              className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] flex items-center justify-center overflow-hidden touch-pan-y"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              onTouchStart={handleRouletteTouchStart}
              onTouchMove={handleRouletteTouchMove}
              onTouchEnd={handleRouletteTouchEnd}
            >
              {/* Square Sci-Fi Left Arrow Button (Closer to center on PC viewports) */}
              <button
                onClick={() => setRouletteIndex((prev) => (prev - 1 + displayFeatured.length) % displayFeatured.length)}
                className="absolute left-2 sm:left-4 md:left-8 lg:left-16 xl:left-24 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 border cyber-cut-sm rounded-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
                style={{
                  backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(11,19,41,0.90)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(51,65,85,0.8)',
                  color: isLight ? '#0f172a' : '#38bdf8',
                }}
                aria-label="Previous Artwork"
              >
                <ChevronLeft size={22} />
              </button>

              {/* 5-Card CoverFlow Depth Stack (100% Square 90° Corners) */}
              {displayFeatured.map((art, idx) => {
                const total = displayFeatured.length;
                let offset = idx - rouletteIndex;
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                const isCenter = offset === 0;
                const absOffset = Math.abs(offset);

                // Render strictly 5 cards (Center, Left-1, Left-2, Right-1, Right-2)
                if (absOffset > 2) return null;

                // Responsive Card Dimensions & Spacing (1:1 Perfect Squares)
                const cardSize = windowWidth < 640 ? 210 : windowWidth < 1024 ? 280 : 350;
                const spacing = windowWidth < 640 ? 85 : windowWidth < 1024 ? 115 : 145;

                const translateX = offset * spacing;
                const scale = isCenter ? 1.0 : absOffset === 1 ? 0.85 : 0.70;
                const opacity = isCenter ? 1.0 : absOffset === 1 ? 0.92 : 0.80;
                const zIndex = 30 - absOffset * 10;

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
                    className={`absolute aspect-square overflow-hidden cursor-pointer transition-all duration-500 ease-out group border ${
                      isCenter
                        ? isLight
                          ? 'border border-sky-500/80 shadow-[0_0_10px_rgba(2,132,199,0.15)]'
                          : 'border border-cyan-400/80 shadow-[0_0_12px_rgba(0,240,255,0.18)]'
                        : isLight
                        ? 'border border-slate-300 hover:border-sky-400'
                        : 'border border-slate-800 hover:border-slate-700'
                    }`}
                    style={{
                      width: `${cardSize}px`,
                      height: `${cardSize}px`,
                      minWidth: `${cardSize}px`,
                      minHeight: `${cardSize}px`,
                      maxWidth: `${cardSize}px`,
                      maxHeight: `${cardSize}px`,
                      aspectRatio: '1 / 1',
                      borderRadius: '0px',
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      opacity,
                      zIndex,
                      backgroundColor: isLight ? '#ffffff' : '#080e1a',
                    }}
                  >
                    <img
                      src={getAssetUrl(art.img)}
                      alt={`許哲誠美術作品 - ${art.cat} (${art.id})`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full aspect-square object-cover rounded-none transition-transform duration-700 group-hover:scale-105"
                      style={{ width: '100%', height: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '0px' }}
                    />

                    {/* Subtle Dimming Overlay for Background Side Cards (Clear & Vivid, fades out on hover) */}
                    {!isCenter && (
                      <div
                        className="absolute inset-0 transition-opacity duration-300 pointer-events-none rounded-none group-hover:opacity-0"
                        style={{
                          backgroundColor: absOffset === 1 ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.25)',
                          borderRadius: '0px',
                        }}
                      />
                    )}

                  </div>
                );
              })}

              {/* Square Sci-Fi Right Arrow Button (Closer to center on PC viewports) */}
              <button
                onClick={() => setRouletteIndex((prev) => (prev + 1) % displayFeatured.length)}
                className="absolute right-2 sm:right-4 md:right-8 lg:right-16 xl:right-24 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 border cyber-cut-sm rounded-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
                style={{
                  backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(11,19,41,0.90)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(51,65,85,0.8)',
                  color: isLight ? '#0f172a' : '#38bdf8',
                }}
                aria-label="Next Artwork"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2 mt-6">
              {displayFeatured.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setRouletteIndex(dotIdx)}
                  className={`h-1.5 transition-all cursor-pointer ${
                    dotIdx === rouletteIndex
                      ? 'w-8 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)] rounded-none'
                      : 'w-2.5 bg-slate-600 hover:bg-slate-400 rounded-none'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

          </div>
        ) : (
          /* STANDARD GRID VIEW — CLEAN NO OVERLAY ZOOM BUTTONS */
          <div
            className="cyber-card p-6 border cyber-cut-corner max-w-6xl mx-auto space-y-6 shadow-xl"
            style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)', borderColor: borderCol }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedArt.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveImage(art)}
                  className="group relative overflow-hidden cyber-cut-sm border cursor-pointer aspect-square w-full shadow-md transition-all hover:-translate-y-1 hover:border-cyan-400"
                  style={{
                    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)',
                  }}
                >
                  <img
                    src={getAssetUrl(art.img)}
                    alt={`許哲誠美術作品縮圖 (${art.id})`}
                    className="w-full h-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>

            {filteredArt.length > 8 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-6 py-2.5 border font-tech text-xs font-bold uppercase cyber-cut-sm cursor-pointer transition-all hover:scale-105 shadow-sm inline-flex items-center gap-2"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#080e1a',
                    borderColor: cyanCol,
                    color: cyanCol,
                  }}
                >
                  <span>
                    {isExpanded
                      ? (lang === 'zh' ? '收起畫廊' : 'COLLAPSE GALLERY')
                      : (lang === 'zh' ? '查看全系列美術作品' : 'VIEW ALL ARTWORKS')}
                  </span>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Preview Modal — 3D iFrame Viewer if embedUrl exists */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 select-none"
          style={{
            backgroundColor: isLight ? 'rgba(15,23,42,0.85)' : 'rgba(3,7,18,0.92)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-5xl w-full border cyber-cut-corner p-4 space-y-4 shadow-2xl hud-corner-brackets"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#080e1a',
              borderColor: borderCol,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.2)' }}>
              <div className="flex items-center gap-2" />

              <button
                onClick={handleCloseModal}
                className="p-1.5 border cyber-cut-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                style={{
                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.05)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
                aria-label="關閉視窗 (Close Lightbox Modal)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Display 3D iFrame Viewer if embedUrl exists, else High Res Image */}
            <div
              className={`relative flex items-center justify-center overflow-hidden border bg-slate-950 ${
                activeImage.embedUrl ? 'w-full aspect-video shadow-2xl' : 'max-h-[72vh] min-h-[300px] sm:min-h-[480px]'
              }`}
              style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}
            >
              {activeImage.embedUrl ? (
                <iframe
                  src={activeImage.embedUrl}
                  title={`3D Model Viewer (${activeImage.id})`}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  loading="lazy"
                />
              ) : (
                <img
                  src={getAssetUrl(activeImage.img)}
                  alt={`許哲誠美術作品預覽 (${activeImage.id})`}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[72vh] w-auto object-contain"
                />
              )}
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex items-center justify-between font-tech text-xs font-bold pt-1">
              <button
                onClick={handlePrevImage}
                className="flex items-center gap-1.5 px-3 py-1.5 border cyber-cut-sm transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.8)',
                  borderColor: borderCol,
                  color: cyanCol,
                }}
              >
                <ChevronLeft size={16} />
                <span>{lang === 'zh' ? '上一張' : 'PREV'}</span>
              </button>

              <a
                href={getAssetUrl(activeImage.img)}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-1.5 border cyber-cut-sm transition-all hover:scale-105 cursor-pointer shadow-xs"
                style={{
                  backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.15)',
                  borderColor: isLight ? '#fcd34d' : 'rgba(245, 158, 11, 0.4)',
                  color: isLight ? '#b45309' : '#fbbf24',
                }}
              >
                <Download size={14} />
                <span>{lang === 'zh' ? '下載' : 'DOWNLOAD'}</span>
              </a>

              <button
                onClick={handleNextImage}
                className="flex items-center gap-1.5 px-3 py-1.5 border cyber-cut-sm transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.8)',
                  borderColor: borderCol,
                  color: cyanCol,
                }}
              >
                <span>{lang === 'zh' ? '下一張' : 'NEXT'}</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default ArtGallery;
