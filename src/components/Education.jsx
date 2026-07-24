import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, ExternalLink, FileText, CheckCircle2, Gamepad2, Video, Box, Code } from 'lucide-react';

const driveLinks = {
  masterCert: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  bachelorCert: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  transcript: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  ranking: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  workshops: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  thesis1: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
  thesis2: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
};

// Workshops Dataset
const workshopsData = {
  zh: [
    {
      title: "2022 冒險者必學UE遊戲工程課研習",
      date: "2022/9 ~ 2022/11",
      org: "主辦單位：夢想方舟",
      icon: <Gamepad2 size={20} className="text-cyan-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "專業內容與技能學習：",
      btnText: "檢視研習證明",
      skills: [
        "掌握 Unreal Engine 遊戲引擎基礎架構與開發流程，熟悉核心機制運作。",
        "研習 Blueprint 開發邏輯，具備遊戲互動事件與邏輯控制之編程能力。",
        "學習 PBR 材質應用、動畫系統綁定、音效與粒子特效整合技術。",
        "實作遊戲互動階段運作流、場景渲染與後製合成效果處理。"
      ]
    },
    {
      title: "2023 VTuber 虛擬網紅快速開發應用研習課程",
      date: "2023/4 ~ 2023/4",
      org: "主辦單位：國立虎尾科技大學多媒體設計系 × 愛迪斯科技股份有限公司",
      icon: <Video size={20} className="text-purple-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "專業內容與技能學習：",
      btnText: "檢視研習證明",
      skills: [
        "學習 VRoid Studio，掌握從角色設定到即時動態呈現之完整流程。",
        "熟悉 動作捕捉系統 之設備操作、數據錄製與虛擬角色骨骼驅動應用。",
        "理解元宇宙虛擬角色創作設計實務，強化跨領域互動媒體與數位內容產出技能。"
      ]
    },
    {
      title: "2023 T大使計畫-PBR流程的次世代3D模型製作",
      date: "2023/6 ~ 2023/10",
      org: "主辦單位：數位發展部 T大使計畫 × 樂美館股份有限公司",
      icon: <Box size={20} className="text-emerald-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "專業內容與技能學習：",
      btnText: "檢視研習證明",
      skills: [
        "接受為期 18 週之次世代遊戲美術產業實戰培訓，深入學習 PBR 標準開發流程。",
        "掌握高低模製作、烘焙、拆 UV 等精密建模技術。",
        "熟練繪製物理材質貼圖與渲染調校，具備符合遊戲產業標準之次世代 3D 資產製作能力。"
      ]
    },
    {
      title: "2026 AI 賦能：Java & Angular 全端整合開發實戰養成班",
      date: "2026/7 ~ 2026/12",
      org: "主辦單位：勞動部高屏澎東分署 × 高雄市電腦商業同業公會",
      icon: <Code size={20} className="text-amber-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "專業內容與技能學習：",
      btnText: "檢視研習證明",
      skills: [
        "AI 賦能與開發流程：運用 AI 工具輔助系統分析、生成測試代碼與 Code Review，提升開發效率。",
        "前端技術與框架：掌握 HTML5/CSS3、JavaScript/TypeScript、Bootstrap 及 Angular 框架。",
        "後端開發與微服務：運用 Java OOP、Spring Boot、Hibernate 打造 RESTful API 及微服務架構。",
        "資料庫與資安實務：具備 ER Model 設計、MySQL/SQL 語法優化及資訊安全防護實作經驗。",
        "專案管理與團隊實作：使用 Git/GitHub 進行版本控制與 CI/CD 流程構建。"
      ]
    }
  ],
  en: [
    {
      title: "2022 UE Game Engineering Workshop for Adventurers",
      date: "2022/9 ~ 2022/11",
      org: "Organizer: Dream Ark",
      icon: <Gamepad2 size={20} className="text-cyan-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "Skills & Content Mastered:",
      btnText: "View Proof",
      skills: [
        "Mastered Unreal Engine core architecture, event logic, and game dev pipelines.",
        "Studied Blueprint programming for interactive events, state flows, and logic control.",
        "Applied PBR texturing, animation rigging, audio synchronization, and particle VFX.",
        "Executed real-time scene rendering, cinematic camera setups, and post-processing."
      ]
    },
    {
      title: "2023 VTuber Rapid Development & MoCap Workshop",
      date: "2023/4 ~ 2023/4",
      org: "Organizer: NFU Multimedia Design × Axis 3D Technology",
      icon: <Video size={20} className="text-purple-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "Skills & Content Mastered:",
      btnText: "View Proof",
      skills: [
        "Learned VRoid Studio for character modeling, texture mapping, and real-time rendering.",
        "Operated optical motion capture hardware, bone rigging, and live avatar tracking.",
        "Understood metaverse avatar creation practices to enhance cross-disciplinary output."
      ]
    },
    {
      title: "2023 T-Ambassador Program - Next-Gen PBR 3D Modeling",
      date: "2023/6 ~ 2023/10",
      org: "Organizer: Ministry of Digital Affairs × Melody Co., Ltd.",
      icon: <Box size={20} className="text-emerald-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "Skills & Content Mastered:",
      btnText: "View Proof",
      skills: [
        "Completed 18 weeks of AAA game art production training adhering to PBR standards.",
        "Mastered high-to-low poly baking, UV unwrapping, topology optimization, and texturing.",
        "Rendered realistic physical textures using Substance Painter for game-ready assets."
      ]
    },
    {
      title: "2026 AI-Enabled Java & Angular Fullstack Bootcamp",
      date: "2026/7 ~ 2026/12",
      org: "Organizer: Ministry of Labor & Kaohsiung Computer Association",
      icon: <Code size={20} className="text-amber-400" />,
      driveLink: "https://drive.google.com/file/d/1B0q4F_g9oR3R0_g9oR3R0_g9oR3R0_g9/view?usp=sharing",
      skillsHeader: "Skills & Content Mastered:",
      btnText: "View Proof",
      skills: [
        "AI-Enabled Workflow: Leveraged LLM APIs and prompt engineering for code review and automated unit tests.",
        "Frontend Engineering: Mastered HTML5/CSS3, TypeScript, Bootstrap, and Angular with RxJS and REST APIs.",
        "Backend & Microservices: Built RESTful APIs using Java OOP, Spring Boot, Hibernate, and JUnit testing.",
        "Database & Security: ER modeling, SQL optimization, JDBC, and security protection (SQLi, XSS, CSRF).",
        "DevOps & Team Project: Employed Git/GitHub for version control, CI/CD pipelines, and fullstack deployment."
      ]
    }
  ]
};

export const Education = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentWorkshops = workshopsData[lang] ?? workshopsData.zh;

  const btnBg = isLight ? '#ffffff' : '#0f172a';
  const btnBdr = isLight ? '#cbd5e1' : '#334155';

  return (
    <section id="experience" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 1. Education Section Header */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
              {t('exp_title')}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
              {t('exp_intro')}
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
          </div>

          {/* Education Timeline Cards */}
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Master Degree Card */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                      {t('edu_master')}
                    </h3>
                    <p className="text-xs sm:text-sm font-code text-[var(--text-sub)] mt-0.5">2024.09 - 2026.06</p>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
                {t('edu_master_desc')}
              </p>

              {/* Master Proof Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={driveLinks.masterCert}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-cyan-400" />
                  <span>{t('btn_certificate')}</span>
                </a>
                <a
                  href={driveLinks.transcript}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-cyan-400" />
                  <span>{t('btn_transcript')}</span>
                </a>
              </div>
            </div>

            {/* Bachelor Degree Card */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                      {t('edu_bachelor')}
                    </h3>
                    <p className="text-xs sm:text-sm font-code text-[var(--text-sub)] mt-0.5">2019.09 - 2023.06</p>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
                {t('edu_bachelor_desc')}
              </p>

              {/* Bachelor Proof Action Buttons — All 3 buttons present */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={driveLinks.bachelorCert}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-purple-400" />
                  <span>{t('btn_certificate')}</span>
                </a>
                <a
                  href={driveLinks.transcript}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-purple-400" />
                  <span>{t('btn_transcript')}</span>
                </a>
                <a
                  href={driveLinks.ranking}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-purple-400" />
                  <span>{t('btn_ranking')}</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Bilingual Workshops Section */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {t('workshop_section_title')}
            </h3>
            <div className="w-12 h-1 bg-purple-500 mx-auto rounded-full" aria-hidden="true" />
          </div>

          <div className="space-y-6">
            {currentWorkshops.map((ws, wIdx) => (
              <div key={wIdx} className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border" style={{ backgroundColor: btnBg, borderColor: btnBdr }}>
                      {ws.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)]">
                        {ws.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-code text-cyan-600 dark:text-cyan-400 font-bold mt-1">
                        {ws.org} ({ws.date})
                      </p>
                    </div>
                  </div>

                  <a
                    href={ws.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-4 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors flex items-center gap-2 shadow-xs shrink-0"
                    style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                  >
                    <ExternalLink size={14} className="text-cyan-400" />
                    <span>{ws.btnText}</span>
                  </a>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-code font-bold text-[var(--text-sub)] uppercase tracking-wider block">
                    {ws.skillsHeader}
                  </span>
                  <ul className="space-y-2 pl-1">
                    {ws.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                        <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Thesis Section */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {t('thesis_section_title')}
            </h3>
            <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full" aria-hidden="true" />
          </div>

          <div className="space-y-6">
            
            {/* Thesis 1 */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-cyan-400 shrink-0" />
                  <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)]">
                    {t('thesis_1_title')}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-code text-xs font-bold shrink-0">
                  {t('thesis_1_award')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-code text-[var(--text-sub)]">{t('thesis_1_venue')}</p>
              <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">{t('thesis_1_desc')}</p>
              
              <div className="pt-2">
                <a
                  href={driveLinks.thesis1}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-cyan-400" />
                  <span>{t('btn_view_paper')}</span>
                </a>
              </div>
            </div>

            {/* Thesis 2 */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/40 pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-purple-400 shrink-0" />
                  <h4 className="font-extrabold text-lg sm:text-xl text-[var(--text-main)]">
                    {t('thesis_2_title')}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-code text-xs font-bold shrink-0">
                  {t('thesis_2_award')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-code text-[var(--text-sub)]">{t('thesis_2_venue')}</p>
              <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">{t('thesis_2_desc')}</p>
              
              <div className="pt-2">
                <a
                  href={driveLinks.thesis2}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border text-xs font-bold text-[var(--text-main)] transition-colors shadow-xs"
                  style={{ backgroundColor: btnBg, borderColor: btnBdr }}
                >
                  <ExternalLink size={14} className="text-purple-400" />
                  <span>{t('btn_view_paper')}</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
