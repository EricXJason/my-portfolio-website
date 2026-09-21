/**
 * ============================================================================
 * 檔案名稱: About.tsx
 * 所屬模組: Presentation Layer (關於我核心簡介模組)
 * 責任描述: 負責展示個人自傳、核心專長專業定位與三大成就指標卡片（學歷、專案、語言檢定）。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合滾動浮現 (Scroll Reveal) 與動態多層次色階渲染。
 * 依賴關係: 依賴 LangContext、ThemeContext、about-section.json 與 useScrollReveal。
 * 邊界處理: 圖示映射不存在時回退至預設 Award 圖示、支援雙語動態防護。
 * ============================================================================
 */

import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Award, GraduationCap, Briefcase, LucideIcon, UserCheck, ChevronDown, BookOpen } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import aboutData from '../data/about-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface StatItem {
  id: string;
  title: string;
  label: string;
  icon: string;
}

interface BioData {
  title: string;
  p1_title: string;
  p1: string;
  p2_title: string;
  p2: string;
  p3_title: string;
  p3: string;
}

interface AboutSectionData {
  title: string;
  intro: string;
  heading: string;
  p1: string;
  bio?: BioData;
  stats: StatItem[];
}

const iconMap: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  briefcase:  Briefcase,
  award:      Award,
};

/**
 * About (關於我模組)
 * 遵循極致科技風 (Sci-Fi Cyber) 與高對比度規範。
 */
export const About: React.FC = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const { data } = usePortfolioData();
  const isLight = theme === 'light';
  const [isBioOpen, setIsBioOpen] = React.useState(false);

  const headerRef = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const cardRef   = useScrollReveal(0.08) as React.RefObject<HTMLDivElement>;

  const rawAbout = data.about || aboutData;
  const dataMap = rawAbout as unknown as Record<Language, AboutSectionData>;
  const currentData: AboutSectionData = dataMap[lang] ?? dataMap.zh;
  const avatarSrc = (rawAbout as any)?.avatarUrl || getAssetUrl('/assets/images/personal.webp');

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0369a1' : '#00f0ff';

  return (
    <section id="about" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* 頂部標題列 */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <UserCheck size={32} style={{ color: cyanCol }} className="shrink-0" />
            <span>{currentData.title}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {currentData.intro}
          </p>
        </div>

        {/* 關於我主內容容器 — 頂級科幻毛玻璃面板 (Sci-Fi Glassmorphism HUD Panel) */}
        <div
          ref={cardRef}
          className="cyber-card p-6 sm:p-10 cyber-cut-corner max-w-6xl mx-auto border shadow-2xl relative overflow-hidden backdrop-blur-xl"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(241, 245, 249, 0.80) 100%)'
              : 'linear-gradient(135deg, rgba(10, 18, 34, 0.52) 0%, rgba(5, 10, 20, 0.62) 100%)',
            borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)',
            boxShadow: isLight
              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 20px 40px rgba(15, 23, 42, 0.08)'
              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), inset 0 0 24px rgba(0, 240, 255, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* 微弱 HUD 科技微網紋裝飾 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.18) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

            {/* 個人形象照容器 */}
            <div className="lg:col-span-5 flex justify-center reveal-left">
              <div className="relative group w-60 h-60 sm:w-64 sm:h-64 lg:w-72 lg:h-72 select-none">
                <div
                  className="relative w-full h-full border cyber-cut-corner p-2 shadow-xl hud-corner-brackets flex items-center justify-center overflow-hidden transition-all duration-500 backdrop-blur-md"
                  style={{
                    backgroundColor: isLight
                      ? 'rgba(248, 250, 252, 0.88)'
                      : 'rgba(5, 10, 22, 0.45)',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.45)',
                    boxShadow: isLight
                      ? '0 10px 30px rgba(2, 132, 199, 0.14), 0 0 0 1px #e2e8f0'
                      : '0 10px 35px rgba(0, 0, 0, 0.7), 0 0 22px rgba(0, 240, 255, 0.22)',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden cyber-cut-sm">
                    {/* 個人形象照 — 支援 CMS 雲端自訂與預設資源 */}
                    <img
                      src={avatarSrc}
                      alt="許哲誠 (Che-Cheng Hsu) Portrait"
                      width="288"
                      height="288"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 select-none pointer-events-none"
                      style={{
                        filter: isLight
                          ? 'brightness(1.0) contrast(1.02) saturate(1.02)'
                          : 'brightness(0.88) contrast(1.06) saturate(0.96)',
                      }}
                    />

                    {/* 邊緣科技暗角 — 暗黑模式：青色光暈 / 明亮模式：柔和藍光 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: isLight
                          ? 'radial-gradient(ellipse at center, transparent 55%, rgba(2, 132, 199, 0.07) 100%)'
                          : 'radial-gradient(ellipse at center, transparent 52%, rgba(0, 240, 255, 0.14) 100%)',
                        boxShadow: isLight
                          ? 'inset 0 0 14px rgba(2, 132, 199, 0.10)'
                          : 'inset 0 0 18px rgba(0, 240, 255, 0.18)',
                      }}
                    />

                    {/* 掃描線覆蓋層 — 微弱細緻且不遮蔽面部 */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
                        opacity: isLight ? 0.35 : 0.45,
                      }}
                    />

                    {/* 戰術幾何轉角裝飾括號 */}
                    <div className={`absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                  </div>
                </div>
              </div>
            </div>



            {/* 自我介紹與數據儀表板 */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black font-hud leading-tight reveal-right" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  {currentData.heading}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed font-tech reveal-right reveal-d2" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                  {currentData.p1}
                </p>
              </div>

              {/* 核心成就指標卡（支援 CMS visible 開關與自適應三維科技色彩體系） */}
              {(() => {
                const visibleStats = (currentData.stats || []).filter((st: any) => st.visible !== false);
                if (visibleStats.length === 0) return null;

                const gridColsClass =
                  visibleStats.length === 1
                    ? 'grid-cols-1 max-w-sm'
                    : visibleStats.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-3';

                return (
                  <div className={`grid ${gridColsClass} gap-4 pt-2`}>
                    {visibleStats.map((st: any, idx: number) => {
                  const IconComponent = iconMap[st.icon] ?? Award;

                  // 全站標準色彩順序：idx 0 (青) / idx 1 (天藍) / idx 2 (紫)
                  const getAccentTheme = (index: number) => {
                    if (index === 0) {
                      return {
                        border: isLight ? '#7dd3fc' : 'rgba(0, 240, 255, 0.5)',
                        bg: isLight ? '#f0f9ff' : 'rgba(0, 240, 255, 0.12)',
                        cardBorder: isLight ? '#bae6fd' : 'rgba(0, 240, 255, 0.35)',
                        text: isLight ? '#0891b2' : '#00f0ff',
                        glow: isLight ? 'none' : '0 0 16px rgba(0, 240, 255, 0.1)',
                      };
                    }
                    if (index === 1) {
                      return {
                        border: isLight ? '#93c5fd' : 'rgba(56, 189, 248, 0.5)',
                        bg: isLight ? '#f0f9ff' : 'rgba(56, 189, 248, 0.12)',
                        cardBorder: isLight ? '#bfdbfe' : 'rgba(56, 189, 248, 0.35)',
                        text: isLight ? '#0284c7' : '#38bdf8',
                        glow: isLight ? 'none' : '0 0 16px rgba(56, 189, 248, 0.1)',
                      };
                    }
                    // idx 2 (金色：多益證照獎牌)
                    return {
                      border: isLight ? '#fde047' : 'rgba(234, 179, 8, 0.5)',
                      bg: isLight ? '#fefce8' : 'rgba(234, 179, 8, 0.12)',
                      cardBorder: isLight ? '#fef08a' : 'rgba(234, 179, 8, 0.35)',
                      text: isLight ? '#b45309' : '#eab308',
                      glow: isLight ? 'none' : '0 0 16px rgba(234, 179, 8, 0.15)',
                    };
                  };

                  const cardAccent = getAccentTheme(idx);

                  return (
                    <div
                      key={idx}
                      className={`p-4 border cyber-cut-sm flex flex-col justify-between gap-3 backdrop-blur-xl transition-all duration-300 shadow-sm stat-reveal reveal-d${(idx + 1) as 1 | 2 | 3}`}
                      style={{
                        background: isLight
                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.80) 100%)'
                          : 'linear-gradient(135deg, rgba(14, 23, 42, 0.50) 0%, rgba(8, 14, 26, 0.60) 100%)',
                        borderColor: cardAccent.cardBorder,
                        boxShadow: `${cardAccent.glow}, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="p-1.5 border cyber-cut-sm shrink-0 transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundColor: cardAccent.bg, borderColor: cardAccent.border, color: cardAccent.text }}
                          >
                            <IconComponent size={16} />
                          </div>
                          <span className="font-hud font-bold text-xs uppercase tracking-wider truncate" style={{ color: cardAccent.text }}>
                            {st.title}
                          </span>
                        </div>
                        <p className="text-xs font-tech font-bold leading-tight" style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}>
                          {st.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

            </div>
          </div>

          {/* 工程自傳折疊收納模組 (Engineering Biography Compact HUD Panel) */}
          {currentData.bio && (
            <div
              className="mt-8 border cyber-cut-corner relative overflow-hidden backdrop-blur-md transition-all duration-500 shadow-xl"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 14, 26, 0.70)',
                borderColor: isLight
                  ? (isBioOpen ? '#93c5fd' : '#cbd5e1')
                  : (isBioOpen ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 240, 255, 0.28)'),
                boxShadow: isLight
                  ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                  : (isBioOpen ? '0 10px 35px rgba(0, 240, 255, 0.08), 0 0 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.35)'),
              }}
            >
              {/* 頂部 HUD 科技橫幅條（收合時為精簡直覺的科技橫條，展開時為卡片 Header） */}
              <div
                onClick={() => !isBioOpen && setIsBioOpen(true)}
                className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-all duration-300 select-none ${
                  !isBioOpen ? 'cursor-pointer group hover:bg-cyan-500/5' : ''
                }`}
                style={{
                  borderBottom: isBioOpen ? (isLight ? '1px solid #e2e8f0' : '1px solid rgba(0, 240, 255, 0.2)') : 'none',
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="p-2 border cyber-cut-sm flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: isLight ? '#f0f9ff' : 'rgba(0, 240, 255, 0.12)',
                      borderColor: isLight ? '#bae6fd' : 'rgba(0, 240, 255, 0.4)',
                      color: cyanCol,
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg font-black font-hud tracking-wide truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      {currentData.bio.title}
                    </h4>
                  </div>
                </div>

                {/* 僅在未展開時顯示「展開閱讀自傳」按鈕，展開後頂部不放按鈕，全域只保留底部唯一收合按鈕 */}
                {!isBioOpen && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBioOpen(true);
                      }}
                      className="px-3.5 py-1.5 border font-hud font-bold text-xs uppercase tracking-wider cyber-cut-sm transition-all duration-300 group-hover:scale-105 flex items-center gap-1.5 shadow-sm cursor-pointer"
                      style={{
                        backgroundColor: isLight ? '#ffffff' : '#080e1a',
                        borderColor: cyanCol,
                        color: cyanCol,
                        boxShadow: isLight ? '0 2px 8px rgba(2,132,199,0.12)' : '0 0 12px rgba(0,240,255,0.2)',
                      }}
                    >
                      <span>{lang === 'zh' ? '檢視自傳' : 'VIEW BIO'}</span>
                      <ChevronDown size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* 展開時的完整 3 大篇章容器 */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  isBioOpen ? 'grid-rows-[1fr] opacity-100 p-5 sm:p-7 pt-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none p-0'
                }`}
              >
                <div className="overflow-hidden space-y-4">
                  {/* 段落一：背景與思維轉折（規則色 1：青色） */}
                  <div
                    className="p-5 border-l-4 border cyber-cut-sm transition-all duration-300"
                    style={{
                      backgroundColor: isLight ? 'rgba(240, 249, 255, 0.65)' : 'rgba(0, 240, 255, 0.04)',
                      borderColor: isLight ? '#bae6fd' : 'rgba(0, 240, 255, 0.25)',
                      borderLeftColor: isLight ? '#0891b2' : '#00f0ff',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded border" style={{ color: isLight ? '#0891b2' : '#00f0ff', borderColor: isLight ? '#7dd3fc' : 'rgba(0, 240, 255, 0.3)' }}>
                        01
                      </span>
                      <h5 className="font-hud font-black text-sm sm:text-base tracking-wide" style={{ color: isLight ? '#0c4a6e' : '#e0f2fe' }}>
                        {currentData.bio.p1_title}
                      </h5>
                    </div>
                    <p className="font-tech text-xs sm:text-sm leading-relaxed sm:leading-loose text-justify" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                      {currentData.bio.p1}
                    </p>
                  </div>

                  {/* 段落二：全端與互動工程實踐（規則色 2：天藍色） */}
                  <div
                    className="p-5 border-l-4 border cyber-cut-sm transition-all duration-300"
                    style={{
                      backgroundColor: isLight ? 'rgba(240, 249, 255, 0.65)' : 'rgba(56, 189, 248, 0.04)',
                      borderColor: isLight ? '#bfdbfe' : 'rgba(56, 189, 248, 0.25)',
                      borderLeftColor: isLight ? '#0284c7' : '#38bdf8',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded border" style={{ color: isLight ? '#0284c7' : '#38bdf8', borderColor: isLight ? '#93c5fd' : 'rgba(56, 189, 248, 0.3)' }}>
                        02
                      </span>
                      <h5 className="font-hud font-black text-sm sm:text-base tracking-wide" style={{ color: isLight ? '#0369a1' : '#bae6fd' }}>
                        {currentData.bio.p2_title}
                      </h5>
                    </div>
                    <p className="font-tech text-xs sm:text-sm leading-relaxed sm:leading-loose text-justify" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                      {currentData.bio.p2}
                    </p>
                  </div>

                  {/* 段落三：在當前 AI 時代我的觀點（規則色 3：紫色） */}
                  <div
                    className="p-5 border-l-4 border cyber-cut-sm transition-all duration-300"
                    style={{
                      backgroundColor: isLight ? 'rgba(250, 245, 255, 0.65)' : 'rgba(192, 132, 252, 0.04)',
                      borderColor: isLight ? '#e9d5ff' : 'rgba(192, 132, 252, 0.25)',
                      borderLeftColor: isLight ? '#7e22ce' : '#c084fc',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded border" style={{ color: isLight ? '#7e22ce' : '#c084fc', borderColor: isLight ? '#d8b4fe' : 'rgba(192, 132, 252, 0.3)' }}>
                        03
                      </span>
                      <h5 className="font-hud font-black text-sm sm:text-base tracking-wide" style={{ color: isLight ? '#581c87' : '#f3e8ff' }}>
                        {currentData.bio.p3_title}
                      </h5>
                    </div>
                    <p className="font-tech text-xs sm:text-sm leading-relaxed sm:leading-loose text-justify" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                      {currentData.bio.p3}
                    </p>
                  </div>

                  {/* 底部收合動作按鈕 */}
                  <div className="text-center pt-3 pb-1">
                    <button
                      type="button"
                      onClick={() => setIsBioOpen(false)}
                      className="px-8 py-2 border font-hud font-bold text-xs uppercase tracking-widest cyber-cut-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-2"
                      style={{
                        backgroundColor: isLight ? '#ffffff' : '#080e1a',
                        borderColor: cyanCol,
                        color: cyanCol,
                        boxShadow: isLight ? '0 2px 8px rgba(2,132,199,0.12)' : '0 0 12px rgba(0,240,255,0.2)',
                      }}
                    >
                      <span>{lang === 'zh' ? '收起自傳' : 'COLLAPSE BIO'}</span>
                      <ChevronDown size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default About;
