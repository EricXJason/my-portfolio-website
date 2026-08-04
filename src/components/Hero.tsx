import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MessageSquare, Copy, Check, ExternalLink, Sparkles, LucideIcon } from 'lucide-react';
import heroData from '../data/hero-section.json';

interface HeroProps {
  soundPlaying: boolean;
}

interface HeroSectionData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  links: {
    github: string;
    artstation: string;
  };
  contacts: {
    phone: string;
    email: string;
    line: string;
  };
}

interface ContactItem {
  key: string;
  labelZh: string;
  labelEn: string;
  value: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const Hero: React.FC<HeroProps> = ({ soundPlaying }) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const dataMap = heroData as unknown as {
    links: { github: string; artstation: string };
    contacts: { phone: string; email: string; line: string };
    zh: HeroSectionData;
    en: HeroSectionData;
  };
  const currentData: HeroSectionData = dataMap[lang] ?? dataMap.zh;
  const links = dataMap.links;
  const contacts = dataMap.contacts;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cardBg     = isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.75)';
  const cardBdr    = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.09)';
  const copyBtnCol = isLight ? '#475569' : '#94a3b8';

  const iconCyan    = isLight ? '#f0f9ff' : 'rgba(6, 182, 212, 0.15)';
  const iconPurple  = isLight ? '#faf5ff' : 'rgba(168, 85, 247, 0.15)';
  const iconEmerald = isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)';

  const contactList: ContactItem[] = [
    {
      key: 'phone',
      labelZh: '電話',
      labelEn: 'PHONE',
      value: contacts.phone,
      Icon: Phone,
      color: isLight ? '#0284c7' : '#06b6d4',
      bgColor: iconCyan,
    },
    {
      key: 'email',
      labelZh: 'Email',
      labelEn: 'EMAIL',
      value: contacts.email,
      Icon: Mail,
      color: isLight ? '#7e22ce' : '#a855f7',
      bgColor: iconPurple,
    },
    {
      key: 'line',
      labelZh: 'LINE ID',
      labelEn: 'LINE ID',
      value: contacts.line,
      Icon: MessageSquare,
      color: isLight ? '#047857' : '#10b981',
      bgColor: iconEmerald,
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden select-text"
    >
      {/* Background Ambient Glow Orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
        style={{ background: isLight ? 'rgba(14, 165, 233, 0.12)' : 'rgba(6, 182, 212, 0.12)' }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
        style={{ background: isLight ? 'rgba(168, 85, 247, 0.10)' : 'rgba(168, 85, 247, 0.12)' }}
      />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center gap-7 sm:gap-8 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">

          {/* Specialization Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-code font-bold max-w-full backdrop-blur-md shadow-xs transition-transform hover:scale-105"
            style={{
              backgroundColor: isLight ? '#f0f9ff' : 'rgba(15, 23, 42, 0.8)',
              borderColor: isLight ? '#bae6fd' : 'rgba(6, 182, 212, 0.35)',
              color: isLight ? '#0369a1' : '#22d3ee',
              boxShadow: isLight ? '0 2px 10px rgba(2, 132, 199, 0.1)' : '0 2px 12px rgba(6, 182, 212, 0.15)',
            }}
          >
            <Sparkles size={13} className="animate-pulse shrink-0" style={{ color: isLight ? '#0284c7' : '#22d3ee' }} />
            <span className="truncate">{currentData.badge}</span>
          </div>

          {/* Hero Title Container & Brand Avatar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">

            {/* Circular Logo Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative flex items-center justify-center">
              {soundPlaying && (
                <div
                  className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-audio-ring blur-md pointer-events-none z-0 opacity-70"
                  aria-hidden="true"
                />
              )}

              <div
                className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2.5px] shadow-xl animate-logo-glow flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                title={soundPlaying ? 'BGM Active' : 'JasonProduction Logo'}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm tracking-wider shadow-inner"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#030712',
                    color: isLight ? '#0369a1' : '#22d3ee',
                  }}
                >
                  &lt;JP/&gt;
                </div>
              </div>
            </div>

            {/* Main Name Title */}
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight cursor-default leading-tight"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              <span className="inline-block hover:scale-105 transition-transform duration-300">
                {currentData.title}
              </span>
            </h1>
          </div>

          {/* Specialty Subtitle Pill */}
          <div
            className="px-5 sm:px-8 py-3 sm:py-3.5 rounded-2xl border max-w-full text-center flex items-center justify-center shadow-sm backdrop-blur-md transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.6)',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
              boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.04)' : '0 4px 25px rgba(0, 0, 0, 0.3)',
            }}
          >
            <p className="text-sm sm:text-xl lg:text-2xl font-bold font-code tracking-wide bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 light:from-sky-600 light:via-indigo-600 light:to-purple-600 bg-clip-text text-transparent animate-shimmer-text sm:whitespace-nowrap whitespace-normal text-center break-words leading-relaxed">
              {currentData.subtitle}
            </p>
          </div>

          {/* Bio Overview Text */}
          <p
            className="text-base sm:text-lg max-w-2xl xl:max-w-3xl leading-relaxed font-normal"
            style={{ color: isLight ? '#475569' : '#cbd5e1' }}
          >
            {currentData.description}
          </p>

          {/* Equal Sized CTA External Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none pt-1">
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-60 h-12 sm:h-13 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-md"
              style={{
                backgroundColor: isLight ? '#0f172a' : '#0f172a',
                border: `2px solid ${isLight ? '#0f172a' : '#475569'}`,
                color: '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isLight ? '#0284c7' : '#22d3ee';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight ? '#0f172a' : '#475569';
              }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>{lang === 'zh' ? 'GitHub 專頁' : 'GitHub Profile'}</span>
              <ExternalLink size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            </a>

            <a
              href={links.artstation}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-60 h-12 sm:h-13 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-md"
              style={{ backgroundColor: '#13ACFE', border: '1px solid #0ea5e9', color: '#ffffff' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0095e0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#13ACFE'; }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M0 17.723l2.027 3.51a1.815 1.815 0 001.57.907h16.806a1.815 1.815 0 001.57-.907l2.027-3.51H0zm23.518-2.673l-7.79-13.49A1.815 1.815 0 0014.158.653H9.842a1.815 1.815 0 00-1.57.907L.482 15.05h6.634l3.197-5.537h3.374l3.197 5.537h6.634zM12 7.747l-1.95 3.377h3.9L12 7.747z"/>
              </svg>
              <span>{lang === 'zh' ? 'ArtStation 作品集' : 'ArtStation Portfolio'}</span>
              <ExternalLink size={13} style={{ color: 'rgba(255,255,255,0.85)', flexShrink: 0 }} />
            </a>
          </div>

          {/* 3 Contact Info Cards Grid */}
          <div className="w-full max-w-4xl xl:max-w-5xl mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full">
              {contactList.map((item) => {
                const label = lang === 'zh' ? item.labelZh : item.labelEn;
                const isCopied = copiedKey === item.key;

                return (
                  <div
                    key={item.key}
                    className="flex items-center rounded-2xl border p-3 shadow-xs transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: cardBg,
                      borderColor: cardBdr,
                      minWidth: 0,
                      boxShadow: isLight ? '0 4px 15px rgba(0,0,0,0.03)' : '0 4px 20px rgba(0,0,0,0.25)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = isLight ? '#7dd3fc' : 'rgba(6, 182, 212, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = cardBdr;
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl shadow-xs"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <item.Icon size={17} style={{ color: item.color }} />
                    </div>

                    <div className="flex-1 min-w-0 px-3 text-left">
                      <p className="text-xs font-code font-extrabold uppercase tracking-wider leading-none mb-1" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                        {label}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-bold font-code leading-tight truncate"
                        style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        title={item.value}
                      >
                        {item.value}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(item.value, item.key)}
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                      style={{
                        color: isCopied ? '#10b981' : copyBtnCol,
                        backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)',
                      }}
                      title={`Copy ${label}`}
                      aria-label={`Copy ${label}`}
                    >
                      {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
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

export default Hero;
