import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MessageSquare, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

const contactInfo = {
  phone: '0908-683-096',
  email: 'user46972@gmail.com',
  line: 'ericxjason',
};

const externalLinks = {
  github: 'https://github.com/ericxjason',
  artstation: 'https://www.artstation.com/ericxjason',
};

export const Hero = () => {
  const { t } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  /* Theme-aware style tokens */
  const cardBg     = isLight ? '#ffffff' : 'rgba(15,23,42,0.65)';
  const cardBdr    = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)';
  const copyBtnCol = isLight ? '#94a3b8' : '#64748b';

  const iconCyan    = isLight ? 'rgba(6,182,212,0.09)'   : 'rgba(6,182,212,0.14)';
  const iconPurple  = isLight ? 'rgba(124,58,237,0.07)'  : 'rgba(168,85,247,0.14)';
  const iconEmerald = isLight ? 'rgba(16,185,129,0.08)'  : 'rgba(16,185,129,0.14)';

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden select-text"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.07)' }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? 'rgba(124,58,237,0.05)' : 'rgba(124,58,237,0.07)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">

          {/* Specialization Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-code font-bold max-w-full"
            style={{
              backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.7)',
              borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
              color: isLight ? '#0369a1' : '#22d3ee',
            }}
          >
            <Sparkles size={13} className="animate-pulse shrink-0" style={{ color: isLight ? '#0891b2' : '#22d3ee' }} />
            <span className="truncate">{t('hero_badge_spec')}</span>
          </div>

          {/* Hero Name Title */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight cursor-default"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              {t('hero_title')}
            </span>
          </h1>

          {/* Specialty Subtitle Pill */}
          <div
            className="px-4 sm:px-6 py-3 rounded-2xl border max-w-full overflow-x-auto"
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.5)',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-sm sm:text-xl lg:text-2xl font-extrabold font-code tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
              {t('hero_subtitle_pc')}
            </p>
          </div>

          {/* Professional Overview Bio */}
          <p
            className="text-base sm:text-lg max-w-2xl leading-relaxed font-medium"
            style={{ color: isLight ? '#475569' : '#94a3b8' }}
          >
            {t('hero_desc')}
          </p>

          {/* Equal Sized CTA External Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
            {/* GitHub Profile Button */}
            <a
              href={externalLinks.github}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-56 h-12 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-sm"
              style={{
                backgroundColor: '#0f172a',
                border: `2px solid ${isLight ? '#334155' : '#475569'}`,
                color: '#ffffff',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22d3ee'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? '#334155' : '#475569'; }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>{t('btn_github')}</span>
              <ExternalLink size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
            </a>

            {/* ArtStation Portfolio Button */}
            <a
              href={externalLinks.artstation}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-56 h-12 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer shadow-sm"
              style={{ backgroundColor: '#13ACFE', border: '1px solid #0ea5e9', color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0095e0'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#13ACFE'; }}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M0 17.723l2.027 3.51a1.815 1.815 0 001.57.907h16.806a1.815 1.815 0 001.57-.907l2.027-3.51H0zm23.518-2.673l-7.79-13.49A1.815 1.815 0 0014.158.653H9.842a1.815 1.815 0 00-1.57.907L.482 15.05h6.634l3.197-5.537h3.374l3.197 5.537h6.634zM12 7.747l-1.95 3.377h3.9L12 7.747z"/>
              </svg>
              <span>{t('btn_artstation')}</span>
              <ExternalLink size={13} style={{ color: 'rgba(255,255,255,0.8)', flexShrink: 0 }} />
            </a>
          </div>

          {/* ── Contact Info Cards Section (Guaranteed Full Display & Zero Truncation) ── */}
          <div className="w-full max-w-4xl mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              
              {/* Phone Card */}
              <div
                className="flex items-stretch rounded-2xl border overflow-hidden shadow-xs"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}
              >
                <div className="shrink-0 flex items-center justify-center w-12" style={{ backgroundColor: iconCyan }}>
                  <Phone size={16} style={{ color: '#06b6d4' }} />
                </div>
                <div className="flex-1 py-3 px-3.5 text-left">
                  <p className="text-[10px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>Phone</p>
                  <p className="text-sm font-bold font-code whitespace-nowrap" style={{ color: 'var(--text-main)' }}>{contactInfo.phone}</p>
                </div>
                <button
                  onClick={() => handleCopy(contactInfo.phone, 'phone')}
                  className="shrink-0 px-3 flex items-center justify-center cursor-pointer transition-colors"
                  style={{ color: copiedKey === 'phone' ? '#10b981' : copyBtnCol }}
                  title="Copy Phone"
                >
                  {copiedKey === 'phone' ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>

              {/* Email Card */}
              <div
                className="flex items-stretch rounded-2xl border overflow-hidden shadow-xs"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}
              >
                <div className="shrink-0 flex items-center justify-center w-12" style={{ backgroundColor: iconPurple }}>
                  <Mail size={16} style={{ color: '#a855f7' }} />
                </div>
                <div className="flex-1 py-3 px-3.5 text-left">
                  <p className="text-[10px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>Email</p>
                  <p className="text-xs sm:text-sm font-bold font-code whitespace-nowrap" style={{ color: 'var(--text-main)' }}>{contactInfo.email}</p>
                </div>
                <button
                  onClick={() => handleCopy(contactInfo.email, 'email')}
                  className="shrink-0 px-3 flex items-center justify-center cursor-pointer transition-colors"
                  style={{ color: copiedKey === 'email' ? '#10b981' : copyBtnCol }}
                  title="Copy Email"
                >
                  {copiedKey === 'email' ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>

              {/* LINE ID Card */}
              <div
                className="flex items-stretch rounded-2xl border overflow-hidden shadow-xs"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}
              >
                <div className="shrink-0 flex items-center justify-center w-12" style={{ backgroundColor: iconEmerald }}>
                  <MessageSquare size={16} style={{ color: '#10b981' }} />
                </div>
                <div className="flex-1 py-3 px-3.5 text-left">
                  <p className="text-[10px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>LINE ID</p>
                  <p className="text-sm font-bold font-code whitespace-nowrap" style={{ color: 'var(--text-main)' }}>{contactInfo.line}</p>
                </div>
                <button
                  onClick={() => handleCopy(contactInfo.line, 'line')}
                  className="shrink-0 px-3 flex items-center justify-center cursor-pointer transition-colors"
                  style={{ color: copiedKey === 'line' ? '#10b981' : copyBtnCol }}
                  title="Copy LINE ID"
                >
                  {copiedKey === 'line' ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
