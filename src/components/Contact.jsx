import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { Copy, Briefcase, CheckCircle, ExternalLink } from 'lucide-react';

export const Contact = () => {
  const { t, lang } = useLang();
  const [toastMsg, setToastMsg] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      const isZh = lang === 'zh';
      setToastMsg(isZh ? `已複製 ${label}：${text}` : `Copied ${label}: ${text}`);
      setTimeout(() => setToastMsg(''), 3000);
    });
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="glass-card p-6 sm:p-12 rounded-3xl space-y-6 border border-cyan-500/30">
          <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block">
            {t('contact_subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('contact_title')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t('contact_desc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-code text-cyan-400">EMAIL</span>
              <div className="text-sm font-medium text-white flex items-center justify-between gap-2">
                <span className="break-all text-xs sm:text-sm">user46972@gmail.com</span>
                <button
                  onClick={() => copyToClipboard('user46972@gmail.com', 'Email')}
                  className="text-xs text-cyan-400 hover:underline cursor-pointer shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-code text-emerald-400">PHONE</span>
              <div className="text-sm font-medium text-white flex items-center justify-between gap-2">
                <span className="break-all text-xs sm:text-sm">0908-683-096</span>
                <button
                  onClick={() => copyToClipboard('0908-683-096', lang === 'zh' ? '電話' : 'Phone')}
                  className="text-xs text-emerald-400 hover:underline cursor-pointer shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-code text-purple-400">LINE ID</span>
              <div className="text-sm font-medium text-white break-words text-xs sm:text-sm">ericxjason</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => copyToClipboard('user46972@gmail.com', 'Email')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy size={16} />
              <span>{t('btn_copy_email')}</span>
            </button>

            <a
              href="https://drive.google.com/drive/folders/1xB0UrQ..."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              <span>{lang === 'zh' ? 'Google Drive 作品集' : 'Google Drive Portfolio'}</span>
            </a>
          </div>
        </div>

      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-400 text-cyan-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce max-w-[90vw]">
          <CheckCircle className="text-cyan-400 shrink-0" size={20} />
          <span className="text-sm font-medium break-words">{toastMsg}</span>
        </div>
      )}
    </section>
  );
};
