import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { X, ZoomIn, ShieldAlert, Layers, Box, Component, PenTool, Paintbrush, ChevronDown, ChevronUp } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

// Reorganized Multimedia Artworks Dataset
const artGalleryData = [
  // 3D Environments & Scenes
  { id: '3d-scene-01', cat: '3d-scene', img: '/assets/gallery/3d-scene/01.jpg' },
  { id: '3d-scene-02', cat: '3d-scene', img: '/assets/gallery/3d-scene/02.jpg' },
  { id: '3d-scene-03', cat: '3d-scene', img: '/assets/gallery/3d-scene/03.jpg' },

  // 3D Props & Assets
  { id: '3d-prop-01', cat: '3d-prop', img: '/assets/gallery/3d-prop/01.jpg' },
  { id: '3d-prop-02', cat: '3d-prop', img: '/assets/gallery/3d-prop/02.jpg' },
  { id: '3d-prop-03', cat: '3d-prop', img: '/assets/gallery/3d-prop/03.jpg' },
  { id: '3d-prop-04', cat: '3d-prop', img: '/assets/gallery/3d-prop/04.jpg' },
  { id: '3d-prop-05', cat: '3d-prop', img: '/assets/gallery/3d-prop/05.jpg' },

  // 2D Fine Sketches
  { id: 'sketch-01', cat: 'sketch', img: '/assets/gallery/sketch/01.jpg' },
  { id: 'sketch-02', cat: 'sketch', img: '/assets/gallery/sketch/02.jpg' },
  { id: 'sketch-03', cat: 'sketch', img: '/assets/gallery/sketch/03.jpg' },
  { id: 'sketch-04', cat: 'sketch', img: '/assets/gallery/sketch/04.jpg' },
  { id: 'sketch-05', cat: 'sketch', img: '/assets/gallery/sketch/05.jpg' },
  { id: 'sketch-06', cat: 'sketch', img: '/assets/gallery/sketch/06.jpg' },
  { id: 'sketch-07', cat: 'sketch', img: '/assets/gallery/sketch/07.jpg' },
  { id: 'sketch-08', cat: 'sketch', img: '/assets/gallery/sketch/08.jpg' },

  // 2D Marker Art
  { id: 'marker-01', cat: 'marker', img: '/assets/gallery/marker/01.jpg' },
  { id: 'marker-02', cat: 'marker', img: '/assets/gallery/marker/02.jpg' },
  { id: 'marker-03', cat: 'marker', img: '/assets/gallery/marker/03.jpg' },
  { id: 'marker-04', cat: 'marker', img: '/assets/gallery/marker/04.jpg' },
  { id: 'marker-05', cat: 'marker', img: '/assets/gallery/marker/05.jpg' },
  { id: 'marker-06', cat: 'marker', img: '/assets/gallery/marker/06.jpg' },
  { id: 'marker-07', cat: 'marker', img: '/assets/gallery/marker/07.jpg' },
  { id: 'marker-08', cat: 'marker', img: '/assets/gallery/marker/08.jpg' },
  { id: 'marker-09', cat: 'marker', img: '/assets/gallery/marker/09.jpg' },
  { id: 'marker-10', cat: 'marker', img: '/assets/gallery/marker/10.jpg' },
  { id: 'marker-11', cat: 'marker', img: '/assets/gallery/marker/11.jpg' },
  { id: 'marker-12', cat: 'marker', img: '/assets/gallery/marker/12.jpg' },
  { id: 'marker-13', cat: 'marker', img: '/assets/gallery/marker/13.jpg' },
];

export const ArtGallery = () => {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState('all');
  const [activeImage, setActiveImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredArt = artGalleryData.filter(
    (item) => activeTab === 'all' || item.cat === activeTab
  );

  const displayedArt = isExpanded ? filteredArt : filteredArt.slice(0, 4);

  const tabs = [
    { key: 'all', label: lang === 'zh' ? '全部作品' : 'All Works', icon: <Layers size={16} /> },
    { key: '3d-scene', label: lang === 'zh' ? '3D 場景' : '3D Environments', icon: <Box size={16} /> },
    { key: '3d-prop', label: lang === 'zh' ? '3D 物件' : '3D Assets & Props', icon: <Component size={16} /> },
    { key: 'sketch', label: lang === 'zh' ? '2D 素描' : '2D Sketches', icon: <PenTool size={16} /> },
    { key: 'marker', label: lang === 'zh' ? '2D 麥克筆' : '2D Marker Art', icon: <Paintbrush size={16} /> },
  ];

  return (
    <section id="gallery" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('gallery_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
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

        {/* Gallery Grid */}
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

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>
            <img
              src={getAssetUrl(activeImage.img)}
              alt="Artwork Full View"
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};
