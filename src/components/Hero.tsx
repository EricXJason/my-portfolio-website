import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MessageSquare, Copy, Check } from 'lucide-react';
import { TechIcon } from './icons/TechIcon';
import { SciFiRobotAvatar } from './SciFiRobotAvatar';
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

  const contactList = [
    {
      key: 'phone',
      labelZh: '聯絡電話',
      labelEn: 'PHONE',
      value: contacts.phone,
      Icon: Phone,
      color: isLight ? '#0369a1' : '#00f0ff',
      bgColor: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)',
    },
    {
      key: 'email',
      labelZh: '電子郵件',
      labelEn: 'EMAIL',
      value: contacts.email,
      Icon: Mail,
      color: isLight ? '#6d28d9' : '#a855f7',
      bgColor: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)',
    },
    {
      key: 'line',
      labelZh: 'LINE ID',
      labelEn: 'LINE ID',
      value: contacts.line,
      Icon: MessageSquare,
      color: isLight ? '#047857' : '#10b981',
      bgColor: isLight ? '#d1fae5' : 'rgba(16,185,129,0.12)',
    },
  ];

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  return (
    <section
      id="home"
      className="min-h-screen pt-20 pb-12 sm:pt-24 sm:pb-16 flex items-center justify-center relative overflow-hidden select-text"
    >
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full select-text">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4 max-w-5xl mx-auto select-text">

          {/* Interactive Sci-Fi Robot Mecha Avatar with Eye Tracking */}
          <div className="hero-stagger hero-stagger-1">
            <SciFiRobotAvatar soundPlaying={soundPlaying} />
          </div>

          {/* Hero Main Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 hero-stagger hero-stagger-2">
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black font-hud tracking-tight cursor-default leading-tight"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              <span className="inline-block transition-transform duration-300 hover:scale-105">
                {currentData.title}
              </span>
            </h1>
          </div>

          {/* Subtitle Matrix (High-Contrast AAA Gradient on Light Mode) */}
          <div className="max-w-full text-center flex items-center justify-center -mt-0.5 sm:-mt-1 hero-stagger hero-stagger-3">
            <p
              className="text-sm sm:text-lg lg:text-xl font-bold font-tech tracking-wider uppercase select-text"
              style={{
                backgroundImage: isLight
                  ? 'linear-gradient(90deg, #0369a1 0%, #1d4ed8 50%, #6d28d9 100%)'
                  : 'linear-gradient(90deg, #00f0ff 0%, #38bdf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isLight
                  ? 'drop-shadow(0 1px 2px rgba(2, 132, 199, 0.15))'
                  : 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.35))',
              }}
            >
              {currentData.subtitle}
            </p>
          </div>

          {/* Description */}
          <p
            className="text-sm sm:text-base max-w-3xl lg:max-w-4xl leading-relaxed font-normal select-text text-balance mx-auto hero-stagger hero-stagger-4"
            style={{ color: isLight ? '#334155' : '#cbd5e1' }}
          >
            {currentData.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none pt-1 hero-stagger hero-stagger-5">
            {/* GitHub Profile Button */}
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-[230px] lg:w-[245px] h-11 sm:h-12 px-4 sm:px-5 cyber-cut-corner font-hud font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer border group shrink-0"
              style={{
                backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
                borderColor: isLight ? '#0f172a' : 'rgba(255, 255, 255, 0.35)',
                color: isLight ? '#0f172a' : '#ffffff',
                boxShadow: isLight ? '0 2px 10px rgba(15, 23, 42, 0.08)' : '0 0 15px rgba(255,255,255,0.1)',
              }}
            >
              <TechIcon name="github" size={16} className="shrink-0 fill-current" color={isLight ? '#0f172a' : '#ffffff'} />
              <span className="whitespace-nowrap">{lang === 'zh' ? 'GitHub 專頁' : 'GitHub Profile'}</span>
            </a>

            {/* ArtStation Portfolio Button */}
            <a
              href={links.artstation}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-[230px] lg:w-[245px] h-11 sm:h-12 px-4 sm:px-5 cyber-cut-corner font-hud font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer border group shrink-0"
              style={{
                backgroundColor: isLight ? '#0284c7' : 'rgba(7, 20, 38, 0.95)',
                borderColor: isLight ? '#0284c7' : '#13ACFE',
                color: '#ffffff',
                boxShadow: isLight ? '0 4px 14px rgba(2, 132, 199, 0.25)' : '0 0 15px rgba(19,172,254,0.25)',
              }}
            >
              <TechIcon name="artstation" size={16} className="shrink-0 fill-current" color="#ffffff" />
              <span className="font-extrabold whitespace-nowrap">{lang === 'zh' ? 'ArtStation 作品集' : 'ArtStation Portfolio'}</span>
            </a>
          </div>

          {/* Contact Cards */}
          <div className="w-full max-w-xs md:max-w-none mx-auto mt-2 sm:mt-3 select-text hero-stagger hero-stagger-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full select-text">
              {contactList.map((item) => {
                const label = lang === 'zh' ? item.labelZh : item.labelEn;
                const isCopied = copiedKey === item.key;

                return (
                  <div
                    key={item.key}
                    className="w-full md:w-[280px] lg:w-[295px] shrink-0 flex items-center justify-between border cyber-cut-sm px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-xl select-text"
                    style={{
                      backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.85)',
                      borderColor: borderCol,
                      boxShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.04)' : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 select-text">
                      <div
                        className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 border cyber-cut-sm"
                        style={{
                          backgroundColor: item.bgColor,
                          borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.3)',
                        }}
                      >
                        <item.Icon size={15} style={{ color: item.color }} />
                      </div>

                      <div className="text-left select-text min-w-0">
                        <p className="text-[10px] font-tech font-bold uppercase tracking-wider select-text leading-none mb-0.5" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                          {label}
                        </p>
                        <p
                          className="text-xs sm:text-sm font-bold font-mono leading-tight whitespace-nowrap select-text"
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.value, item.key)}
                      className="shrink-0 w-7 h-7 sm:w-7.5 sm:h-7.5 border cyber-cut-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ml-2 shadow-xs"
                      style={{
                        backgroundColor: isLight ? '#f1f5f9' : 'rgba(30, 41, 59, 0.8)',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)',
                      }}
                      title={lang === 'zh' ? `複製 ${label}` : `Copy ${label}`}
                      aria-label={`Copy ${label}`}
                    >
                      {isCopied ? (
                        <Check size={13} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Copy size={13} style={{ color: isLight ? '#475569' : '#94a3b8' }} className="shrink-0" />
                      )}
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
