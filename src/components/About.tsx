import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Award, GraduationCap, Briefcase, ExternalLink, LucideIcon, UserCheck } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import aboutData from '../data/about-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface StatItem {
  id: string;
  title: string;
  label: string;
  icon: string;
  proofKey?: string;
  btnLabel?: string;
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
  briefcase: Briefcase,
  award: Award,
};

export const About: React.FC = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const headerRef = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const cardRef   = useScrollReveal(0.08) as React.RefObject<HTMLDivElement>;

  const dataMap = aboutData as unknown as Record<Language, AboutSectionData> & { driveLinks: Record<string, string> };
  const currentData: AboutSectionData = dataMap[lang] ?? dataMap.zh;
  const driveLinks = dataMap.driveLinks;

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0369a1' : '#00f0ff';

  return (
    <section id="about" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 space-y-3">

          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <UserCheck size={32} style={{ color: cyanCol }} className="shrink-0" />
            <span>{currentData.title}</span>
          </h2>
          <p className="text-sm sm:text-base font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            {currentData.intro}
          </p>
        </div>

        {/* Master Container */}
        <div
          ref={cardRef}
          className="cyber-card p-6 sm:p-10 cyber-cut-corner max-w-6xl mx-auto border shadow-xl"
          style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)', borderColor: borderCol }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Portrait */}
            <div className="lg:col-span-5 flex justify-center reveal-left">
              <div className="relative group w-60 h-60 sm:w-64 sm:h-64 lg:w-72 lg:h-72 select-none">
                <div
                  className="relative w-full h-full border cyber-cut-corner p-2 shadow-xl hud-corner-brackets flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                  style={{
                    backgroundColor: isLight
                      ? 'rgba(248, 250, 252, 0.95)'
                      : 'rgba(5, 10, 22, 0.92)',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.45)',
                    boxShadow: isLight
                      ? '0 10px 30px rgba(2, 132, 199, 0.14), 0 0 0 1px #e2e8f0'
                      : '0 10px 35px rgba(0, 0, 0, 0.7), 0 0 22px rgba(0, 240, 255, 0.22)',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden cyber-cut-sm">
                    {/* Portrait Photo — natural fill, head fully visible */}
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

                    {/* Cyber Rim Vignette — dark mode: cyan glow / light mode: subtle blue */}
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

                    {/* Scanline overlay — subtle, does not obscure face */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
                        opacity: isLight ? 0.35 : 0.45,
                      }}
                    />

                    {/* Tactical Corner Accent Brackets */}
                    <div className={`absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                    <div className={`absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none ${isLight ? 'border-sky-600' : 'border-cyan-400'}`} />
                  </div>
                </div>
              </div>
            </div>



            {/* Bio & Stat Gauges */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black font-hud leading-tight reveal-right" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  {currentData.heading}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed font-tech reveal-right reveal-d2" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                  {currentData.p1}
                </p>
              </div>

              {/* Stat Cards with Distinct Color Hierarchy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {currentData.stats.map((st, idx) => {
                  const IconComponent = iconMap[st.icon] ?? Award;
                  const proofUrl = st.proofKey ? driveLinks[st.proofKey] : null;

                  // Distinct color hierarchy by sequence/importance
                  const cardAccents = [
                    { border: isLight ? '#7dd3fc' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.1)', text: isLight ? '#0369a1' : '#00f0ff' },
                    { border: isLight ? '#c084fc' : '#a855f7', bg: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.1)', text: isLight ? '#6d28d9' : '#c084fc' },
                    { border: isLight ? '#fcd34d' : '#f59e0b', bg: isLight ? '#fef3c7' : 'rgba(245,158,11,0.1)', text: isLight ? '#92400e' : '#fbbf24' },
                  ];
                  const accent = cardAccents[idx % cardAccents.length];

                  return (
                    <div
                      key={st.id}
                      className={`p-4 border cyber-cut-sm flex flex-col justify-between gap-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-sm stat-reveal reveal-d${(idx + 1) as 1 | 2 | 3}`}
                      style={{
                        backgroundColor: isLight ? '#ffffff' : 'rgba(3,7,18,0.8)',
                        borderColor: isLight ? accent.border : borderCol,
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 border cyber-cut-sm"
                            style={{ backgroundColor: accent.bg, borderColor: accent.border, color: accent.text }}
                          >
                            <IconComponent size={16} />
                          </div>
                          <span className="font-hud font-bold text-xs uppercase tracking-wider" style={{ color: accent.text }}>
                            {st.title}
                          </span>
                        </div>
                        <p className="text-xs font-tech font-bold leading-tight" style={{ color: isLight ? '#0f172a' : '#cbd5e1' }}>
                          {st.label}
                        </p>
                      </div>

                      {proofUrl && (
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 px-2 border font-tech text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                          style={{
                            backgroundColor: accent.bg,
                            borderColor: accent.border,
                            color: accent.text,
                          }}
                        >
                          <ExternalLink size={12} />
                          <span>{st.btnLabel}</span>
                        </a>
                      )}
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
