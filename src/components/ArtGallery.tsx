import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { X, ZoomIn, ShieldAlert, Layers, Box, Component, PenTool, Paintbrush, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('all');
  const [activeImage, setActiveImage] = useState<Artwork | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredArt = artGalleryData.filter(
    (item) => activeTab === 'all' || item.cat === activeTab
  );

  const displayedArt = isExpanded ? filteredArt : filteredArt.slice(0, 4);

  const activeIndex = activeImage
    ? filteredArt.findIndex((item) => item.id === activeImage.id)
    : -1;

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (filteredArt.length === 0) return;
    const prevIdx = (activeIndex - 1 + filteredArt.length) % filteredArt.length;
    setActiveImage(filteredArt[prevIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (filteredArt.length === 0) return;
    const nextIdx = (activeIndex + 1) % filteredArt.length;
    setActiveImage(filteredArt[nextIdx]);
  };

  const handleCloseModal = () => {
    document.body.classList.remove('hide-custom-cursor');
    setActiveImage(null);
  };

  useEffect(() => {
    if (!activeImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (filteredArt.length === 0) return;
        const prevIdx = (activeIndex - 1 + filteredArt.length) % filteredArt.length;
        setActiveImage(filteredArt[prevIdx]);
      } else if (e.key === 'ArrowRight') {
        if (filteredArt.length === 0) return;
        const nextIdx = (activeIndex + 1) % filteredArt.length;
        setActiveImage(filteredArt[nextIdx]);
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('hide-custom-cursor');
    };
  }, [activeImage, activeIndex, filteredArt]);

  const tabs = [
    { key: 'all', label: lang === 'zh' ? '全部作品' : 'All Works', icon: <Layers size={16} /> },
    { key: '3d-scene', label: lang === 'zh' ? '3D 場景' : '3D Environments', icon: <Box size={16} /> },
    { key: '3d-prop', label: lang === 'zh' ? '3D 物件' : '3D Assets & Props', icon: <Component size={16} /> },
    { key: 'sketch', label: lang === 'zh' ? '2D 素描' : '2D Sketches', icon: <PenTool size={16} /> },
    { key: 'marker', label: lang === 'zh' ? '2D 麥克筆' : '2D Marker Art', icon: <Paintbrush size={16} /> },
  ];

  return (
    <section id="gallery" className="py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('gallery_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-normal leading-relaxed">
            {t('gallery_note')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsExpanded(false);
              }}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`h-12 px-6 rounded-xl text-sm font-code font-bold transition-all flex items-center gap-2.5 cursor-pointer shadow-sm border-2 ${
                activeTab === tab.key
                  ? 'filter-btn-active bg-slate-900 text-white border-purple-500 shadow-md shadow-purple-500/20'
                  : 'filter-btn-inactive bg-slate-900/60 text-[var(--text-sub)] border-slate-800 hover:border-purple-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid — Non-modal view strictly uses static preview images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedArt.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveImage(art)}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer relative aspect-square border border-[var(--border-color)] hover:border-purple-500/50 transition-all duration-300 shadow-sm"
            >
              <img
                src={getAssetUrl(art.img)}
                alt="Artwork Preview"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-center justify-center">
                <div className="p-3 rounded-full bg-purple-600/90 text-white shadow-xl group-hover:scale-110 transition-transform">
                  <ZoomIn size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {filteredArt.length > 4 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 light:border-slate-300 hover:border-purple-500 text-[var(--text-main)] font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>
                {isExpanded
                  ? (lang === 'zh' ? '收起美術作品' : 'Collapse Gallery')
                  : (lang === 'zh' ? '檢視更多美術作品' : 'View More Artworks')}
              </span>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        )}

        {/* Human Authenticity Disclaimer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 text-sm font-code text-[var(--text-sub)] shadow-sm font-medium">
            <ShieldAlert size={16} className="text-emerald-500 shrink-0" />
            <span>
              {lang === 'zh'
                ? '美術作品無任何 AI 參與'
                : 'Handcrafted artworks with NO AI involvement.'}
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal — Edge-to-edge snugly filled container with zero empty whitespace */}
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
                  download={`artwork-${activeImage.id}.webp`}
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

            {/* Main Content Area — Fits 16:9 3D iframe & static images snugly without whitespace */}
            <div className="relative w-full flex items-center justify-center">
              {filteredArt.length > 1 && (
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
                    e.currentTarget.style.backgroundColor = '#9333ea';
                    e.currentTarget.style.borderColor = '#c084fc';
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
                  className="max-h-[78vh] w-auto max-w-full object-contain rounded-lg shadow-lg select-none"
                  decoding="async"
                />
              )}

              {filteredArt.length > 1 && (
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
                    e.currentTarget.style.backgroundColor = '#9333ea';
                    e.currentTarget.style.borderColor = '#c084fc';
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
