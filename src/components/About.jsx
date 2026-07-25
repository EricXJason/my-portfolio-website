import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Award, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

export const About = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const statIconBg = isLight ? '#f1f5f9' : 'rgba(15,23,42,0.8)';
  const statIconBdr = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)';

  return (
    <section id="about" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('about_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
            {t('about_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Portrait Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 opacity-30 group-hover:opacity-70 blur-lg transition-all duration-500" aria-hidden="true" />
              <div className="relative rounded-3xl overflow-hidden glass-card border-2 border-cyan-500/30 p-2 shadow-2xl">
                <div
                  className="aspect-square w-full rounded-2xl overflow-hidden shadow-inner transition-all duration-500"
                  style={{
                    background: isLight
                      ? 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)'
                      : 'radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 60%, #030712 100%)'
                  }}
                >
                  <img
                    src={getAssetUrl('/assets/images/personal.png')}
                    alt="Che-Cheng Hsu Portrait"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
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
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
                {t('about_heading')}
              </h3>

              <p className="text-[var(--text-sub)] text-base sm:text-lg leading-relaxed font-medium">
                {t('about_p1')}
              </p>
            </div>

            {/* Achievement Stats — 3 Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

              <div className="glass-card p-4.5 rounded-2xl space-y-2 border border-[var(--border-color)] hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg border" style={{ backgroundColor: statIconBg, borderColor: statIconBdr }}>
                    <GraduationCap size={18} style={{ color: '#22d3ee' }} />
                  </div>
                  <span className="font-bold text-base text-[var(--text-main)]">{t('stat_exp')}</span>
                </div>
                <p className="text-xs text-[var(--text-sub)] font-medium">{t('stat_exp_label')}</p>
              </div>

              <div className="glass-card p-4.5 rounded-2xl space-y-2 border border-[var(--border-color)] hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg border" style={{ backgroundColor: statIconBg, borderColor: statIconBdr }}>
                    <Briefcase size={18} style={{ color: '#c084fc' }} />
                  </div>
                  <span className="font-bold text-base text-[var(--text-main)]">{t('stat_projects')}</span>
                </div>
                <p className="text-xs text-[var(--text-sub)] font-medium">{t('stat_projects_label')}</p>
              </div>

              {/* TOEIC — Score statistics card */}
              <div className="glass-card p-4.5 rounded-2xl space-y-2 border border-[var(--border-color)] hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg border" style={{ backgroundColor: statIconBg, borderColor: statIconBdr }}>
                    <Award size={18} style={{ color: '#fbbf24' }} />
                  </div>
                  <span className="font-bold text-base text-[var(--text-main)]">{t('stat_toeic')}</span>
                </div>
                <p className="text-xs text-[var(--text-sub)] font-medium">{t('stat_toeic_label')}</p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
