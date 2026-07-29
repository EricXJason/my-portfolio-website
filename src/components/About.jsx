import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Award, GraduationCap, Briefcase, ExternalLink } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';
import aboutData from '../data/about-section.json';

const iconMap = {
  graduation: GraduationCap,
  briefcase: Briefcase,
  award: Award,
};

export const About = () => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const currentData = aboutData[lang] ?? aboutData.zh;
  const driveLinks = aboutData.driveLinks;

  const statIconBg = isLight ? '#f1f5f9' : 'rgba(15,23,42,0.8)';
  const statIconBdr = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)';

  return (
    <section id="about" className="py-24 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
            {currentData.title}
          </h2>
          <p className="text-sm sm:text-base font-normal leading-relaxed" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            {currentData.intro}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* High-End Portrait Avatar with Theme-Tailored Multilayer Shadows */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-52 h-52 sm:w-60 sm:h-60 xl:w-68 xl:h-68">

              {/* Elegant Subtle Ambient Backdrop Glow */}
              <div
                className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none group-hover:scale-105"
                style={{
                  background: isLight
                    ? 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(168,85,247,0.1) 70%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(6,182,212,0.28) 0%, rgba(168,85,247,0.2) 70%, transparent 100%)',
                }}
                aria-hidden="true"
              />

              {/* Avatar Main Circle Frame with Theme-Tailored Multilayer Shadows */}
              <div
                className="relative w-full h-full rounded-full p-1.5 transition-all duration-500 group-hover:scale-[1.03]"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#0b0f19',
                  border: `1.5px solid ${isLight ? '#cbd5e1' : 'rgba(6,182,212,0.35)'}`,
                  boxShadow: isLight
                    ? '0 20px 40px -10px rgba(14, 165, 233, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08)'
                    : '0 20px 45px -10px rgba(6, 182, 212, 0.3), 0 0 30px rgba(168, 85, 247, 0.18)',
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden shadow-inner">
                  <img
                    src={getAssetUrl('/assets/images/personal.png')}
                    alt="Che-Cheng Hsu Portrait"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Bio + Achievement Stats */}
          <div className="lg:col-span-7 space-y-8">

            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {currentData.heading}
              </h3>

              {/* Comfortable High Contrast Body Text */}
              <p className="text-base sm:text-lg leading-relaxed font-medium" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                {currentData.p1}
              </p>
            </div>

            {/* Achievement Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {currentData.stats.map((st) => {
                const IconComponent = iconMap[st.icon] ?? Award;
                const proofUrl = st.proofKey ? driveLinks[st.proofKey] : null;

                return (
                  <div
                    key={st.id}
                    className="glass-card p-4.5 rounded-2xl space-y-2 border border-[var(--border-color)] hover:-translate-y-1 transition-transform flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg border" style={{ backgroundColor: statIconBg, borderColor: statIconBdr }}>
                          <IconComponent size={18} style={{ color: st.id === 'exp' ? '#22d3ee' : st.id === 'projects' ? '#c084fc' : '#fbbf24' }} />
                        </div>
                        <span className="font-bold text-base" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {st.title}
                        </span>
                      </div>
                      <p className="text-xs font-medium" style={{ color: isLight ? '#475569' : '#cbd5e1' }}>
                        {st.label}
                      </p>
                    </div>

                    {proofUrl && (
                      <div className="pt-2">
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-8 px-3 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:scale-105"
                          style={{
                            backgroundColor: isLight ? '#fffbeb' : 'rgba(245,158,11,0.12)',
                            borderColor: isLight ? '#fcd34d' : 'rgba(245,158,11,0.3)',
                            color: isLight ? '#b45309' : '#fbbf24',
                          }}
                        >
                          <ExternalLink size={12} />
                          <span>{st.btnLabel}</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
