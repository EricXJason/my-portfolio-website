import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { Copy, CheckCircle, ExternalLink, Phone, Mail, MessageCircle } from 'lucide-react';
import contactData from '../data/contact.json';

export const Contact = () => {
  const { t, lang } = useLang();
  const [toastMsg, setToastMsg] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      const isZh = lang === 'zh';
      setToastMsg(isZh ? `已複製 ${label}` : `Copied ${label}`);
      setTimeout(() => setToastMsg(''), 2800);
    });
  };

  const contactItems = [
    {
      label: 'Phone',
      labelZh: '電話',
      value: contactData.phone,
      color: '#34d399',
      colorBg: 'rgba(52,211,153,0.08)',
      colorBorder: 'rgba(52,211,153,0.25)',
      Icon: Phone,
    },
    {
      label: 'Email',
      labelZh: 'Email',
      value: contactData.email,
      color: '#22d3ee',
      colorBg: 'rgba(34,211,238,0.08)',
      colorBorder: 'rgba(34,211,238,0.25)',
      Icon: Mail,
    },
    {
      label: 'LINE ID',
      labelZh: 'LINE ID',
      value: contactData.lineId,
      color: '#a78bfa',
      colorBg: 'rgba(167,139,250,0.08)',
      colorBorder: 'rgba(167,139,250,0.25)',
      Icon: MessageCircle,
    },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

        <div className="glass-card p-6 sm:p-10 rounded-3xl space-y-6 border border-cyan-500/30">
          <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block">
            {t('contact_subtitle') !== 'contact_subtitle' ? t('contact_subtitle') : 'GET IN TOUCH'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--text-main)' }}>
            {lang === 'zh' ? '聯絡我' : 'Contact Me'}
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            {lang === 'zh'
              ? '歡迎透過以下方式聯繫，期待合作與交流的機會。'
              : 'Feel free to reach out via any of the channels below.'}
          </p>

          {/* 3 Contact Cards — always full-width content, never truncated */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-4 flex flex-col gap-2"
                style={{
                  backgroundColor: item.colorBg,
                  border: `1.5px solid ${item.colorBorder}`,
                  minWidth: 0,
                }}
              >
                {/* Label row */}
                <div className="flex items-center gap-1.5">
                  <item.Icon size={13} style={{ color: item.color, flexShrink: 0 }} />
                  <span
                    className="text-[10px] font-code font-bold tracking-widest uppercase"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Value + Copy button — always on same row, value never wraps or cuts */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <span
                    className="font-bold text-sm whitespace-nowrap"
                    style={{ color: 'var(--text-main)', minWidth: 0, flexShrink: 1 }}
                  >
                    {item.value}
                  </span>
                  <button
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="shrink-0 p-1.5 rounded-lg transition-all cursor-pointer hover:scale-110"
                    style={{ color: item.color, backgroundColor: `${item.colorBorder}` }}
                    aria-label={`Copy ${item.label}`}
                    title={`Copy ${item.label}`}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => copyToClipboard(contactData.email, 'Email')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                boxShadow: '0 4px 20px rgba(6,182,212,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(6,182,212,0.45)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,182,212,0.25)'; e.currentTarget.style.transform = ''; }}
            >
              <Copy size={16} />
              <span>{lang === 'zh' ? '複製 Email' : 'Copy Email'}</span>
            </button>

            <a
              href={contactData.googleDriveUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border-2 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                borderColor: 'rgba(99,102,241,0.4)',
                backgroundColor: 'rgba(99,102,241,0.08)',
                color: '#a78bfa',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.16)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = ''; }}
            >
              <ExternalLink size={16} />
              <span>{lang === 'zh' ? 'Google Drive 作品集' : 'Google Drive Portfolio'}</span>
            </a>
          </div>
        </div>

      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-[90vw]"
          style={{ animation: 'slideUp 0.3s ease' }}>
          <CheckCircle className="text-cyan-400 shrink-0" size={18} />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}
    </section>
  );
};
