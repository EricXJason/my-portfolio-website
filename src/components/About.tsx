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
import { Award, GraduationCap, Briefcase, LucideIcon, UserCheck } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import aboutData from '../data/about-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface StatItem {
  id: string;
  title: string;
  label: string;
  icon: string;
}

interface AboutSectionData {
  title: string;
  intro: string;
  heading: string;
  p1: string;
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

  const headerRef = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const cardRef   = useScrollReveal(0.08) as React.RefObject<HTMLDivElement>;

  const dataMap = (data.about || aboutData) as unknown as Record<Language, AboutSectionData>;
  const currentData: AboutSectionData = dataMap[lang] ?? dataMap.zh;

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
                    {/* 個人形象照 — 自然填滿且頭部完整可見 */}
                    <img
                      src={getAssetUrl('/assets/images/personal.webp')}
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

              {/* 核心成就指標卡（合理化三維科技色彩體系：藝術青、架構藍、認證金） */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {currentData.stats.map((st, idx) => {
                  const IconComponent = iconMap[st.icon] ?? Award;

                  // 還原為早期版本配色：idx 0 (青) / idx 1 (紫) / idx 2 (金)
                  const getAccentTheme = (index: number) => {
                    if (index === 0) {
                      return {
                        border: isLight ? '#7dd3fc' : 'rgba(0, 240, 255, 0.5)',
                        bg: isLight ? '#f0f9ff' : 'rgba(0, 240, 255, 0.12)',
                        cardBorder: isLight ? '#bae6fd' : 'rgba(0, 240, 255, 0.35)',
                        text: isLight ? '#0284c7' : '#00f0ff',
                        glow: isLight ? 'none' : '0 0 16px rgba(0, 240, 255, 0.1)',
                      };
                    }
                    if (index === 1) {
                      return {
                        border: isLight ? '#d8b4fe' : 'rgba(192, 132, 252, 0.5)',
                        bg: isLight ? '#faf5ff' : 'rgba(168, 85, 247, 0.12)',
                        cardBorder: isLight ? '#e9d5ff' : 'rgba(192, 132, 252, 0.35)',
                        text: isLight ? '#7e22ce' : '#c084fc',
                        glow: isLight ? 'none' : '0 0 16px rgba(168, 85, 247, 0.1)',
                      };
                    }
                    return {
                      border: isLight ? '#fde047' : 'rgba(234, 179, 8, 0.5)',
                      bg: isLight ? '#fefce8' : 'rgba(234, 179, 8, 0.12)',
                      cardBorder: isLight ? '#fef08a' : 'rgba(234, 179, 8, 0.35)',
                      text: isLight ? '#ca8a04' : '#eab308',
                      glow: isLight ? 'none' : '0 0 16px rgba(234, 179, 8, 0.1)',
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

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
