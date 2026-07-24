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

/* ── Single contact card: icon stripe | label + value | copy button ── */
const ContactCard = ({ icon, iconColor, iconBg, label, value, cardBg, cardBdr, copyBtnCol, onCopy, copied }) => (
  <div
    className="flex items-stretch rounded-2xl border overflow-hidden"
    style={{ backgroundColor: cardBg, borderColor: cardBdr, minWidth: 0 }}
  >
    {/* Colored icon stripe */}
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: '46px', backgroundColor: iconBg }}
    >
      {React.cloneElement(icon, { size: 16, style: { color: iconColor } })}
    </div>

    {/* Label + value — flex-1 + min-w-0 allow truncation */}
    <div className="flex-1 py-3 px-3" style={{ minWidth: 0, overflow: 'hidden' }}>
      <p className="text-[9px] font-code font-bold uppercase tracking-widest mb-0.5"
        style={{ color: '#64748b' }}>{label}</p>
      <p
        className="text-sm font-bold font-code"
        style={{
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value}
      </p>
    </div>

    {/* Copy button */}
    <button
      onClick={onCopy}
      className="shrink-0 px-3 flex items-center cursor-pointer transition-colors"
      style={{ color: copied ? '#10b981' : copyBtnCol }}
      title="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  </div>
);

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

  /* ── Theme-aware color tokens ── */
  const cardBg     = isLight ? '#ffffff' : 'rgba(15,23,42,0.65)';
  const cardBdr    = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)';
  const copyBtnCol = isLight ? '#94a3b8' : '#64748b';

  /* Icon accent backgrounds — always soft tint, never dark blob in light mode */
  const iconCyan    = isLight ? 'rgba(6,182,212,0.09)'   : 'rgba(6,182,212,0.14)';
  const iconPurple  = isLight ? 'rgba(124,58,237,0.07)'  : 'rgba(168,85,247,0.14)';
  const iconEmerald = isLight ? 'rgba(16,185,129,0.08)'  : 'rgba(16,185,129,0.14)';

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden select-text"
    >
      {/* Ambient glow blobs — subtle, non-distracting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? 'rgba(6,182,212,0.05)' : 'rgba(6,182,212,0.07)' }} />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: isLight ? 'rgba(124,58,237,0.05)' : 'rgba(124,58,237,0.07)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">

          {/* Badge pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-code font-bold"
            style={{
              backgroundColor: isLight ? '#f0f9ff' : 'rgba(15,23,42,0.7)',
              borderColor: isLight ? '#bae6fd' : 'rgba(6,182,212,0.3)',
              color: isLight ? '#0369a1' : '#22d3ee',
            }}
          >
            <Sparkles size={13} className="animate-pulse" style={{ color: isLight ? '#0891b2' : '#22d3ee' }} />
            <span>{t('hero_badge_spec')}</span>
          </div>

          {/* Name — REDUCED: was text-8xl → now text-5xl sm:text-6xl lg:text-7xl */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight cursor-default"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              {t('hero_title')}
            </span>
          </h1>

          {/* Speciality subtitle — gradient pill */}
          <div
            className="px-6 py-3 rounded-2xl border"
            style={{
              backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.5)',
              borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-base sm:text-xl lg:text-2xl font-extrabold font-code tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
              {t('hero_subtitle_pc')}
            </p>
          </div>

          {/* Bio */}
          <p
            className="text-base sm:text-lg max-w-2xl leading-relaxed font-medium"
            style={{ color: isLight ? '#475569' : '#94a3b8' }}
          >
            {t('hero_desc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* GitHub */}
            <a
              href={externalLinks.github}
              target="_blank"
              rel="noreferrer"
              className="h-11 px-6 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              style={{
                backgroundColor: '#0f172a',
                border: `2px solid ${isLight ? '#334155' : '#475569'}`,
                color: '#ffffff',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22d3ee'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isLight ? '#334155' : '#475569'; }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>{t('btn_github')}</span>
              <ExternalLink size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />
            </a>

            {/* ArtStation */}
            <a
              href={externalLinks.artstation}
              target="_blank"
              rel="noreferrer"
              className="h-11 px-6 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              style={{ backgroundColor: '#13ACFE', border: '1px solid #0ea5e9', color: '#ffffff' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0095e0'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#13ACFE'; }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M0 17.723l2.027 3.51a1.815 1.815 0 001.57.907h16.806a1.815 1.815 0 001.57-.907l2.027-3.51H0zm23.518-2.673l-7.79-13.49A1.815 1.815 0 0014.158.653H9.842a1.815 1.815 0 00-1.57.907L.482 15.05h6.634l3.197-5.537h3.374l3.197 5.537h6.634zM12 7.747l-1.95 3.377h3.9L12 7.747z"/>
              </svg>
              <span>{t('btn_artstation')}</span>
              <ExternalLink size={12} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
            </a>
          </div>

          {/* ── Contact Row ──
              Desktop (sm+): single row, 3 cards side-by-side, full width, no wrapping
              Mobile (<sm): 3 separate stacked cards
              Each card individually enforces text ellipsis for single-line display
          */}
          <div className="w-full max-w-3xl">
            {/* Mobile: stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              <ContactCard
                icon={<Phone />} iconColor="#06b6d4" iconBg={iconCyan}
                label="Phone" value={contactInfo.phone}
                cardBg={cardBg} cardBdr={cardBdr} copyBtnCol={copyBtnCol}
                onCopy={() => handleCopy(contactInfo.phone, 'phone')}
                copied={copiedKey === 'phone'}
              />
              <ContactCard
                icon={<Mail />} iconColor="#a855f7" iconBg={iconPurple}
                label="Email" value={contactInfo.email}
                cardBg={cardBg} cardBdr={cardBdr} copyBtnCol={copyBtnCol}
                onCopy={() => handleCopy(contactInfo.email, 'email')}
                copied={copiedKey === 'email'}
              />
              <ContactCard
                icon={<MessageSquare />} iconColor="#10b981" iconBg={iconEmerald}
                label="LINE ID" value={contactInfo.line}
                cardBg={cardBg} cardBdr={cardBdr} copyBtnCol={copyBtnCol}
                onCopy={() => handleCopy(contactInfo.line, 'line')}
                copied={copiedKey === 'line'}
              />
            </div>

            {/* Desktop: single flex row, no wrap, each card takes equal space */}
            <div className="hidden sm:flex gap-3 w-full">
              {/* Phone card */}
              <div className="flex-1 min-w-0 flex items-stretch rounded-2xl border overflow-hidden"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}>
                <div className="shrink-0 flex items-center justify-center w-[46px]" style={{ backgroundColor: iconCyan }}>
                  <Phone size={16} style={{ color: '#06b6d4' }} />
                </div>
                <div className="flex-1 py-3 px-3" style={{ minWidth: 0, overflow: 'hidden' }}>
                  <p className="text-[9px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>Phone</p>
                  <p className="text-sm font-bold font-code" style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={contactInfo.phone}>{contactInfo.phone}</p>
                </div>
                <button onClick={() => handleCopy(contactInfo.phone, 'phone')} className="shrink-0 px-3 flex items-center cursor-pointer" style={{ color: copiedKey === 'phone' ? '#10b981' : copyBtnCol }} title="Copy">
                  {copiedKey === 'phone' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              {/* Email card */}
              <div className="flex-1 min-w-0 flex items-stretch rounded-2xl border overflow-hidden"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}>
                <div className="shrink-0 flex items-center justify-center w-[46px]" style={{ backgroundColor: iconPurple }}>
                  <Mail size={16} style={{ color: '#a855f7' }} />
                </div>
                <div className="flex-1 py-3 px-3" style={{ minWidth: 0, overflow: 'hidden' }}>
                  <p className="text-[9px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>Email</p>
                  <p className="text-sm font-bold font-code" style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={contactInfo.email}>{contactInfo.email}</p>
                </div>
                <button onClick={() => handleCopy(contactInfo.email, 'email')} className="shrink-0 px-3 flex items-center cursor-pointer" style={{ color: copiedKey === 'email' ? '#10b981' : copyBtnCol }} title="Copy">
                  {copiedKey === 'email' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              {/* LINE card */}
              <div className="flex-1 min-w-0 flex items-stretch rounded-2xl border overflow-hidden"
                style={{ backgroundColor: cardBg, borderColor: cardBdr }}>
                <div className="shrink-0 flex items-center justify-center w-[46px]" style={{ backgroundColor: iconEmerald }}>
                  <MessageSquare size={16} style={{ color: '#10b981' }} />
                </div>
                <div className="flex-1 py-3 px-3" style={{ minWidth: 0, overflow: 'hidden' }}>
                  <p className="text-[9px] font-code font-bold uppercase tracking-widest mb-0.5" style={{ color: '#64748b' }}>LINE ID</p>
                  <p className="text-sm font-bold font-code" style={{ color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={contactInfo.line}>{contactInfo.line}</p>
                </div>
                <button onClick={() => handleCopy(contactInfo.line, 'line')} className="shrink-0 px-3 flex items-center cursor-pointer" style={{ color: copiedKey === 'line' ? '#10b981' : copyBtnCol }} title="Copy">
                  {copiedKey === 'line' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
