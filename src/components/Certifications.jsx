import React from 'react';
import { useLang } from '../context/LangContext';
import { Languages, Box, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

const driveFolderLink = "https://drive.google.com/drive/folders/1cUZ24IncYkmTiAZAA1xbxjWp9Bu_jXS8?usp=sharing";

const certData = {
  zh: [
    {
      group: '國家級技術士技能檢定',
      icon: <Languages size={20} className="text-cyan-400" />,
      items: [
        { name: '丙級電腦輔助機械製圖技術士', org: '勞動部國家技能檢定' },
        { name: '丙級電腦輔助立體製圖技術士', org: '勞動部國家技能檢定' },
        { name: '丙級電腦硬體裝修技術士', org: '勞動部國家技能檢定' },
      ],
    },
    {
      group: '多媒體與軟體原廠國際認證',
      icon: <Box size={20} className="text-purple-400" />,
      items: [
        { name: '3dsMax ACU 國際認證', org: 'Autodesk Certified User' },
        { name: 'AutoCAD ACU 國際認證', org: 'Autodesk Certified User' },
        { name: 'ACP Photoshop 國際認證', org: 'Adobe Certified Professional' },
        { name: 'ACP Dreamweaver 國際認證', org: 'Adobe Certified Professional' },
        { name: 'ACP Flash 國際認證', org: 'Adobe Certified Professional' },
        { name: 'MOS Access Expert 國際認證', org: 'Microsoft Office Specialist' },
        { name: 'MOS Excel Expert 國際認證', org: 'Microsoft Office Specialist' },
        { name: 'MOS Word Expert / PowerPoint 認證', org: 'Microsoft Office Specialist' },
      ],
    },
  ],
  en: [
    {
      group: 'National Skill Licenses',
      icon: <Languages size={20} className="text-cyan-400" />,
      items: [
        { name: 'Level-C Computer Aided Drafting Technician', org: 'Ministry of Labor' },
        { name: 'Level-C Computer Aided 3D Modeling Technician', org: 'Ministry of Labor' },
        { name: 'Level-C Computer Hardware Maintenance Technician', org: 'Ministry of Labor' },
      ],
    },
    {
      group: 'Software Int\'l Certifications',
      icon: <Box size={20} className="text-purple-400" />,
      items: [
        { name: 'Autodesk 3dsMax ACU', org: 'Autodesk Certified User' },
        { name: 'Autodesk AutoCAD ACU', org: 'Autodesk Certified User' },
        { name: 'ACP Photoshop', org: 'Adobe Certified Professional' },
        { name: 'ACP Dreamweaver', org: 'Adobe Certified Professional' },
        { name: 'ACP Flash', org: 'Adobe Certified Professional' },
        { name: 'MOS Access Expert', org: 'Microsoft Office Specialist' },
        { name: 'MOS Excel Expert', org: 'Microsoft Office Specialist' },
        { name: 'MOS Word Expert & PowerPoint', org: 'Microsoft Office Specialist' },
      ],
    },
  ],
};

export const Certifications = () => {
  const { t, lang } = useLang();
  const groups = certData[lang] ?? certData.zh;

  return (
    <section id="awards" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          {lang === 'en' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-2">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span className="text-xs font-code text-cyan-400 tracking-widest uppercase font-bold">
                {t('awards_subtitle')}
              </span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('awards_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
            {t('awards_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Horizontal Wide Card Container */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-[var(--border-color)] shadow-xl max-w-5xl mx-auto space-y-8">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 light:border-slate-300">
                  {group.icon}
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] tracking-wide">
                  {group.group}
                </h3>
              </div>

              {/* Grid of Scaled Cert Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((cert, idx) => (
                  <a
                    key={idx}
                    href={driveFolderLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 hover:border-cyan-400 transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <CheckCircle2 size={18} className="text-cyan-500 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm sm:text-base font-bold text-[var(--text-main)] truncate">
                          {cert.name}
                        </p>
                        <p className="text-xs text-[var(--text-sub)] font-code truncate mt-0.5">{cert.org}</p>
                      </div>
                    </div>
                    <ExternalLink size={15} className="text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Master Google Drive Folder Access Button */}
          <div className="pt-6 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-center">
            <a
              href={driveFolderLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border-2 border-slate-700 light:border-slate-300 hover:border-cyan-400 text-[var(--text-main)] hover:text-cyan-400 font-code text-sm font-bold transition-all shadow-md"
            >
              <ExternalLink size={16} className="text-cyan-400" />
              <span>{t('btn_view_drive_folder')}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
