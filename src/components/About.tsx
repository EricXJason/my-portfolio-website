import React from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Award, GraduationCap, Briefcase, ExternalLink, LucideIcon, UserCheck } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import aboutData from '../data/about-section.json';

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

  const dataMap = aboutData as unknown as Record<Language, AboutSectionData> & { driveLinks: Record<string, string> };
  const currentData: AboutSectionData = dataMap[lang] ?? dataMap.zh;
  const driveLinks = dataMap.driveLinks;

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <section id="about" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">

          <h2 className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            <UserCheck size={32} style={{ color: cyanCol }} className="shrink-0" />
            <span>{currentData.title}</span>
          </h2>
          <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            {currentData.intro}
          </p>
        </div>

        {/* Master Container */}
        <div
          className="cyber-card p-6 sm:p-10 cyber-cut-corner max-w-6xl mx-auto border shadow-xl"
          style={{ backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)', borderColor: borderCol }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Portrait — Sleek, High-End Minimalist Cyber HUD Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 select-none">
                <div
                  className="relative w-full h-full border cyber-cut-corner p-2 shadow-xl hud-corner-brackets flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                  style={{
                    backgroundColor: isLight ? '#f8fafc' : '#080e1a',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)',
                    boxShadow: isLight
                      ? '0 4px 20px rgba(0, 0, 0, 0.05), 0 0 12px rgba(2, 132, 199, 0.12)'
                      : '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 240, 255, 0.18)',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden cyber-cut-sm">
                    <img
                      src={getAssetUrl('/assets/images/personal.avif')}
                      alt="許哲誠 (Che-Cheng Hsu) Portrait"
                      width="288"
                      height="288"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle Cyber Scanline Overlay Texture */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                  </div>
                </div>
              </div>
            </div>



            {/* Bio & Stat Gauges */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black font-hud leading-tight" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  {currentData.heading}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed font-tech" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
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
                    { border: isLight ? '#0284c7' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.1)', text: isLight ? '#0369a1' : '#00f0ff' },
                    { border: isLight ? '#7c3aed' : '#a855f7', bg: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.1)', text: isLight ? '#6b21a8' : '#c084fc' },
                    { border: isLight ? '#d97706' : '#f59e0b', bg: isLight ? '#fef3c7' : 'rgba(245,158,11,0.1)', text: isLight ? '#92400e' : '#fbbf24' },
                  ];
                  const accent = cardAccents[idx % cardAccents.length];

                  return (
                    <div
                      key={st.id}
                      className="p-4 border cyber-cut-sm flex flex-col justify-between gap-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-sm"
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
