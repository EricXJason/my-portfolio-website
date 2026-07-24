import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { Send, Mail, SendHorizontal, CheckCircle2 } from 'lucide-react';

export const MessageBoard = () => {
  const { t } = useLang();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMailto = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert(t('zh') === 'zh' ? '請填寫必填欄位 (姓名、信箱與留言內容)' : 'Please fill all required fields (Name, Email, Message)');
      return;
    }

    const emailTo = "user46972@gmail.com";
    const mailSubject = `[作品集聯絡] ${formData.subject || '合作洽談'} - ${formData.name}`;
    const mailBody = `你好，我是 ${formData.name} (${formData.email})\n\n聯絡主旨: ${formData.subject || '無'}\n\n留言內容:\n${formData.message}\n\n---\n來自 許哲誠 個人作品集聯絡信件`;

    // Open native mail client pre-filled with form contents
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.open(mailtoUrl, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="message-board" className="py-16 relative bg-slate-950/20 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block mb-2">
            INTERACTIVE MESSAGE BOARD
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            科技感留言板 / 聯絡表單
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            填寫表單後將為您一鍵自動開啟信箱，留言內容會直接發送至我的 Email！
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Message Board Form Card */}
        <div className="glass-card p-8 rounded-3xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Grid Corner Decor */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-500/10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-cyan-500/10 pointer-events-none" />

          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">信件發送就緒！</h3>
              <p className="text-slate-400 text-sm max-w-md">
                已自動為您開啟電子郵件客戶端。若無自動跳出，您也可以點擊下方「複製留言內容」寄送至 user46972@gmail.com。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMailto} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-code text-cyan-400 block font-semibold">
                    訪客姓名 / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="例如：王小明"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-code text-cyan-400 block font-semibold">
                    電子信箱 / Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="例如：example@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-code text-cyan-400 block font-semibold">
                  洽談主旨 / Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="例如：遊戲開發合作洽談 / Unity 工程師職缺邀請"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans text-sm"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-code text-cyan-400 block font-semibold">
                  留言內容 / Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="請輸入您的留言或合作需求..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SendHorizontal size={16} />
                  <span>一鍵傳送郵件</span>
                </button>
                
                <a
                  href="mailto:user46972@gmail.com"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-500 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Mail size={14} />
                  直接手動寄信
                </a>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
