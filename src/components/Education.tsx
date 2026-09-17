/**
 * ============================================================================
 * 檔案名稱: Education.tsx
 * 所屬模組: Portfolio Website (學歷與經歷展示模組)
 * 責任描述: 負責展示碩博士學位、工作經歷、原廠研習證書與國際學術論文，提供動態顏色階層與高度區別度之圖示呈現。
 * 架構分層: Presentation Layer (React UI Component)
 Presentational Component 搭配語意圖示對照與主題/語系雙軌適配。
 * 依賴關係: 依賴 LangContext、ThemeContext、experience-section.json 與 CmsIconPickerModal 之 getLucideIconByName。
 * 邊界處理: 確保即便 JSON 缺少特定 iconType，仍依語意與項次提供 100% 絕對明確區隔之圖示回退。
 * ============================================================================
 */

import React, { useState } from 'react';
import { useLang, Language } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  GraduationCap,
  ExternalLink,
  Briefcase,
  Building2,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  School,
  FolderGit2,
  CheckCircle2,
  Palette,
  Presentation,
  Code2,
  Box,
  Video,
  Gamepad2,
} from 'lucide-react';
import eduData from '../data/experience-section.json';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getLucideIconByName } from '../cms/components/CmsIconPickerModal';

interface DegreeButton {
  key: string;
  label: string;
  linkKey: string;
}

interface DegreeItem {
  id: string;
  school: string;
  period: string;
  desc: string;
  type: string;
  iconType?: string;
  buttons: DegreeButton[];
}

interface WorkExperienceItem {
  company: string;
  company_en?: string;
  role: string;
  role_en?: string;
  period: string;
  summary: string;
  summary_en?: string;
  iconType?: string;
  projectsHeader: string;
  projectsHeader_en?: string;
  projects: string[];
  projects_en?: string[];
  skillsHeader: string;
  skillsHeader_en?: string;
  tags: string[];
}

interface WorkshopItem {
  title: string;
  date: string;
  org: string;
  iconType: string;
  driveLinkKey: string;
  btnText: string;
  skillsHeader: string;
  skills: string[];
  showProof?: boolean;
}

interface ThesisItem {
  date?: string;
  title: string;
  venue: string;
  desc: string;
  iconType?: string;
  driveLinkKey: string;
  btnText: string;
  slidesDriveLinkKey?: string;
  slidesBtnText?: string;
  award?: string;
  showFullText?: boolean;
  showPresentation?: boolean;
}

interface SectionData {
  degrees: DegreeItem[];
  workExperiences: WorkExperienceItem[];
  workshops: WorkshopItem[];
  theses: ThesisItem[];
}

export const Education: React.FC = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  /**
   * TODO: [後端端點對接] 取得使用者模式學歷、經歷、研習與論文詳細資料
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/experience
   * 3. 請求參數:
   *    - Query Params: lang (string, 'zh' | 'en' | 'ja')
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: { zh: SectionData, en: SectionData, ja: SectionData, driveLinks: Record<string, string> } }
   *    - 500 Internal Server Error: 伺服器讀取學經歷資料失敗
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，直接採用本地靜態 JSON 資料 (experience-section.json) 驅動，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const { data } = usePortfolioData();
  const dataMap = ((data.experience || eduData) as unknown as Record<Language, SectionData> & { driveLinks: Record<string, string> });
  const currentData: SectionData = dataMap[lang] ?? dataMap.zh;
  const driveLinks = dataMap.driveLinks || (eduData as any).driveLinks;

  const [showAllWorkshops, setShowAllWorkshops] = useState(false);
  const [showAllTheses, setShowAllTheses] = useState(false);

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const cyanCol = isLight ? '#0369a1' : '#00f0ff';

  const headerRef    = useScrollReveal(0.15) as React.RefObject<HTMLDivElement>;
  const degreesRef   = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
  const workRef      = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
  const workshopsRef = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;
  const thesesRef    = useScrollReveal(0.06) as React.RefObject<HTMLDivElement>;

  // 經歷與學歷項目色彩順序循環規範：賽博青 → 高亮電光天藍 → 亮紫色
  const sequenceAccents = [
    // 1: 霓虹賽博青 (Electric Cyan)
    { main: isLight ? '#0284c7' : '#00f0ff', bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)', border: isLight ? '#38bdf8' : '#00f0ff' },
    // 2: 極光電光天藍 (Vivid Hyper Sky Blue - 告別暗濁、高對比 14:1)
    { main: isLight ? '#0284c7' : '#38bdf8', bg: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)', border: isLight ? '#38bdf8' : '#38bdf8' },
    // 3: 亮紫色 (Electric Violet)
    { main: isLight ? '#7c3aed' : '#c084fc', bg: isLight ? '#f3e8ff' : 'rgba(192, 132, 252, 0.15)', border: isLight ? '#c084fc' : '#c084fc' },
  ];

  // 3 distinct cyber theme colors for Degree Buttons: (1: 畢業證書 -> Cyan, 2: 歷年成績單 -> Vivid Sky Blue, 3: 系排名證明 -> Purple)
  const degreeButtonStyles: Record<string, { bg: string; border: string; text: string }> = {
    cert: {
      bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
      border: isLight ? '#0284c7' : '#00f0ff',
      text: isLight ? '#0369a1' : '#00f0ff',
    },
    transcript: {
      bg: isLight ? '#e0f2fe' : 'rgba(56, 232, 255, 0.15)',
      border: isLight ? '#0284c7' : '#38e8ff',
      text: isLight ? '#0284c7' : '#38e8ff',
    },
    ranking: {
      bg: isLight ? '#f3e8ff' : 'rgba(168, 85, 247, 0.15)',
      border: isLight ? '#9333ea' : '#c084fc',
      text: isLight ? '#6b21a8' : '#e9d5ff',
    },
  };

  const defaultBtnStyle = {
    bg: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
    border: isLight ? '#0284c7' : '#00f0ff',
    text: isLight ? '#0369a1' : '#00f0ff',
  };

  // 頂級科幻毛玻璃面板風格 (Sci-Fi Glassmorphism Section Style: 真正清透半透明 0.52~0.62 + 頂部 1px 鏡面高光)
  const glassSectionCardStyle: React.CSSProperties = {
    background: isLight
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.85) 100%)'
      : 'linear-gradient(135deg, rgba(13, 23, 42, 0.52) 0%, rgba(6, 12, 24, 0.62) 100%)',
    borderColor: isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.22)',
    boxShadow: isLight
      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 20px 40px rgba(15, 23, 42, 0.08)'
      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), inset 0 0 24px rgba(0, 240, 255, 0.03), 0 25px 50px -12px rgba(0, 0, 0, 0.65)',
  };

  /** 解析歷程時間字串之最終結束時間數值 (降序排序核心，支援 'YYYY/MM ~ YYYY/MM'、'YYYY.MM - YYYY.MM'、'YYYY/MM') */
  const parseEndDateValue = (dateStr?: string): number => {
    if (!dateStr) return 0;
    const parts = dateStr.split(/[~–—\-至]/);
    const endPart = parts[parts.length - 1].trim();
    const match = endPart.match(/(\d{4})[./\-](\d{1,2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      return year * 100 + month;
    }
    const yearMatch = endPart.match(/(\d{4})/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10) * 100;
    }
    return 0;
  };

  /** 解析時間字串為兩行結構（起點、迄點、是否為區間） */
  const parseTimelinePeriod = (raw?: string) => {
    if (!raw) return { start: '', end: 'PRESENT', isRange: false };
    const parts = raw.split(/[~–—\-至]/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        start: parts[0],
        end: parts[1],
        isRange: true,
      };
    }
    return {
      start: '',
      end: parts[0] || raw,
      isRange: false,
    };
  };

  /** 渲染頂級科幻雙行 HUD 時間數據膠囊 (2-Line Chrono Capsule: 兩行優雅排版，徹底解決橫向溢出邊緣問題) */
  const renderChronoCapsule = (periodStr: string, accent: { main: string; border: string }, isSinglePub = false) => {
    const parsed = parseTimelinePeriod(periodStr);

    return (
      <div
        className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 border cyber-cut-sm transition-all duration-300 group-hover:scale-[1.02] shadow-sm backdrop-blur-md select-none"
        style={{
          background: isLight ? 'rgba(240, 249, 255, 0.94)' : 'rgba(8, 14, 28, 0.85)',
          borderColor: isLight ? accent.border : `${accent.main}55`,
          boxShadow: isLight
            ? '0 2px 8px rgba(15, 23, 42, 0.05)'
            : `inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 0 14px ${accent.main}18`,
        }}
      >
        {/* 呼吸狀態燈指示點 */}
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
          style={{ backgroundColor: accent.main, boxShadow: `0 0 6px ${accent.main}` }}
        />

        {parsed.isRange ? (
          <div className="flex flex-col items-end leading-tight">
            {/* 第一行：起始時間 (精緻科技灰) */}
            <span
              className="font-hud text-[10px] sm:text-[11px] font-bold tracking-wider opacity-85"
              style={{ color: isLight ? '#475569' : '#94a3b8' }}
            >
              {parsed.start}
            </span>
            {/* 第二行：結束時間 (高亮科技色 + ~ 前綴) */}
            <div
              className="flex items-center gap-0.5 font-hud font-extrabold text-[11px] sm:text-xs tracking-wider"
              style={{ color: accent.main }}
            >
              <span className="text-[10px] opacity-75 font-mono">~</span>
              <span>{parsed.end}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end leading-tight">
            <span
              className="font-hud text-xs sm:text-[13px] font-black tracking-wider"
              style={{ color: accent.main }}
            >
              {parsed.end}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="experience" className="py-20 relative select-text">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-16">

        {/* 章節主標題列 */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto space-y-3">
          <h2
            className="text-3xl sm:text-5xl font-black font-hud uppercase tracking-tight flex items-center justify-center gap-3 reveal-up"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            <Briefcase size={32} className="shrink-0" style={{ color: isLight ? '#0369a1' : '#22d3ee' }} />
            <span>{t('exp_title')}</span>
          </h2>
          <p className="text-base sm:text-lg font-tech leading-relaxed reveal-up reveal-d2" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
            {t('exp_intro')}
          </p>
        </div>

        {/* 學歷與經歷主容器 */}
        <div className="max-w-6xl mx-auto space-y-12">

          {/* 第一子區塊：學歷學位 */}
          <div
            id="education-degrees"
            ref={degreesRef}
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-2xl reveal-scale relative overflow-hidden backdrop-blur-xl"
            style={glassSectionCardStyle}
          >
            <div className="flex items-center gap-3 border-b border-slate-700/40 pb-4 relative z-10">
              <div
                className="p-3 border cyber-cut-sm shrink-0"
                style={{
                  backgroundColor: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)',
                  borderColor: isLight ? '#38bdf8' : 'rgba(0,240,255,0.35)',
                  color: cyanCol,
                }}
              >
                <GraduationCap size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('degree_section_title')}
              </h3>
            </div>

            {/* 學歷時間線導軌容器 */}
            <div className="space-y-0 relative z-10">
              {(() => {
                const list = [...currentData.degrees]
                  .filter((deg: any) => deg.visible !== false)
                  .sort((a, b) => parseEndDateValue(b.period) - parseEndDateValue(a.period));
                return list.map((deg, dIdx) => {
                  const accent = sequenceAccents[dIdx % sequenceAccents.length];

                  return (
                    <div key={deg.id} className="relative flex items-center gap-2 sm:gap-4 md:gap-6 group py-4 sm:py-5 first:pt-2 last:pb-2">
                      {/* 左欄：HUD 時間數據膠囊徽章（雙行優雅防邊緣擠壓） */}
                      <div className="w-24 sm:w-28 md:w-32 shrink-0 flex items-center justify-end select-none">
                        {renderChronoCapsule(deg.period, accent)}
                      </div>

                      {/* 中欄：連續垂直導軌線 + 雙向水平微光連接臂 + 雙環同心發光節點 */}
                      <div className="relative flex items-center justify-center shrink-0 w-8 sm:w-10 self-stretch">
                        {/* 垂直連貫導軌：零粗斑物理無縫對接 */}
                        <div
                          className={`absolute w-[2px] pointer-events-none ${
                            dIdx === 0 && list.length > 1
                              ? 'top-1/2 -bottom-5'
                              : dIdx === list.length - 1 && list.length > 1
                              ? '-top-5 bottom-1/2'
                              : list.length === 1
                              ? 'hidden'
                              : '-top-5 -bottom-5'
                          }`}
                          style={{
                            backgroundColor: isLight ? '#cbd5e1' : 'rgba(56, 189, 248, 0.4)',
                          }}
                        />

                        {/* 水平向左微光連接臂（直抵左側時間膠囊） */}
                        <div
                          className="absolute right-1/2 left-[-10px] sm:left-[-16px] md:left-[-24px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(270deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 水平向右微光連接臂（直抵右側卡片連接口） */}
                        <div
                          className="absolute left-1/2 right-[-14px] sm:right-[-20px] md:right-[-26px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 雙環同心圓節點 */}
                        <div
                          className="relative z-10 shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 sm:border-[3px] flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-md"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#030712',
                            borderColor: accent.main,
                            boxShadow: `0 0 12px ${accent.main}`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: accent.main }}
                          />
                        </div>
                      </div>

                      {/* 右欄：毛玻璃經歷卡片 + 左側 HUD 連接口凹槽 */}
                      <div
                        className="flex-1 min-w-0 p-5 sm:p-6 border cyber-cut-sm space-y-4 transition-all duration-300 shadow-lg group-hover:border-slate-400 backdrop-blur-md relative"
                        style={{
                          background: isLight
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.82) 100%)'
                            : 'linear-gradient(135deg, rgba(14, 23, 42, 0.50) 0%, rgba(6, 11, 22, 0.60) 100%)',
                          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                          boxShadow: isLight
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(15, 23, 42, 0.05)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.45)',
                        }}
                      >
                        {/* 左側微型連接口指示標 (HUD Port Indicator) */}
                        <div
                          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b transition-colors duration-300 pointer-events-none"
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : '#0a1426',
                            borderColor: accent.main,
                          }}
                        />

                        <div className="border-b border-slate-700/30 pb-3">
                          {(() => {
                            const DegIcon = deg.iconType
                              ? getLucideIconByName(deg.iconType)
                              : (deg.type === 'master' || deg.id === 'master' || dIdx === 0 ? GraduationCap : School);
                            return (
                              <h4 className="text-lg sm:text-xl font-black font-hud uppercase flex items-center gap-2.5" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                <DegIcon size={20} className="shrink-0" style={{ color: accent.main }} />
                                <span>{deg.school}</span>
                              </h4>
                            );
                          })()}
                        </div>

                        <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                          {deg.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                          {deg.buttons.filter((btn: any) => btn.visible !== false).map((btn, bIdx) => {
                            const styleKey = btn.key || (bIdx === 0 ? 'cert' : bIdx === 1 ? 'transcript' : 'ranking');
                            const btnStyle = degreeButtonStyles[styleKey] ?? defaultBtnStyle;
                            const url = driveLinks[btn.linkKey];
                            if (!url) return null;

                            return (
                              <a
                                key={bIdx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 sm:px-6 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                                style={{
                                  backgroundColor: btnStyle.bg,
                                  borderColor: btnStyle.border,
                                  color: btnStyle.text,
                                }}
                              >
                                <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{btn.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 第二子區塊：工作經歷 */}
          <div
            id="work-experience"
            ref={workRef}
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-2xl reveal-scale relative overflow-hidden backdrop-blur-xl"
            style={glassSectionCardStyle}
          >
            {/* 微弱 HUD 科技微網紋裝飾 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
              style={{
                backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="flex items-center gap-3 border-b border-slate-700/40 pb-4 relative z-10">
              <div
                className="p-3 border cyber-cut-sm shrink-0"
                style={{
                  backgroundColor: isLight ? '#e0f2fe' : 'rgba(56,232,255,0.15)',
                  borderColor: isLight ? '#38bdf8' : '#38e8ff',
                  color: isLight ? '#0284c7' : '#38e8ff',
                }}
              >
                <Building2 size={22} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {t('work_section_title')}
              </h3>
            </div>

            {/* 工作經歷時間線導軌容器 */}
            <div className="space-y-0 relative z-10">
              {(() => {
                const list = [...currentData.workExperiences]
                  .filter((job: any) => job.visible !== false)
                  .sort((a, b) => parseEndDateValue(b.period) - parseEndDateValue(a.period));
                return list.map((job, jIdx) => {
                  const accent = sequenceAccents[jIdx % sequenceAccents.length];

                  return (
                    <div key={(job as any).id || job.company || jIdx} className="relative flex items-center gap-2 sm:gap-4 md:gap-6 group py-4 sm:py-5 first:pt-2 last:pb-2">
                      {/* 左欄：HUD 時間數據膠囊徽章（雙行優雅防邊緣擠壓） */}
                      <div className="w-24 sm:w-28 md:w-32 shrink-0 flex items-center justify-end select-none">
                        {renderChronoCapsule(job.period, accent)}
                      </div>

                      {/* 中欄：連續垂直導軌線 + 雙向水平微光連接臂 + 雙環同心發光節點 */}
                      <div className="relative flex items-center justify-center shrink-0 w-8 sm:w-10 self-stretch">
                        {/* 垂直連貫導軌：零粗斑物理無縫對接 */}
                        <div
                          className={`absolute w-[2px] pointer-events-none ${
                            jIdx === 0 && list.length > 1
                              ? 'top-1/2 -bottom-5'
                              : jIdx === list.length - 1 && list.length > 1
                              ? '-top-5 bottom-1/2'
                              : list.length === 1
                              ? 'hidden'
                              : '-top-5 -bottom-5'
                          }`}
                          style={{
                            backgroundColor: isLight ? '#cbd5e1' : 'rgba(56, 189, 248, 0.4)',
                          }}
                        />

                        {/* 水平向左微光連接臂（直抵左側時間膠囊） */}
                        <div
                          className="absolute right-1/2 left-[-10px] sm:left-[-16px] md:left-[-24px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(270deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 水平向右微光連接臂（直抵右側卡片連接口） */}
                        <div
                          className="absolute left-1/2 right-[-14px] sm:right-[-20px] md:right-[-26px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 雙環同心圓節點 */}
                        <div
                          className="relative z-10 shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 sm:border-[3px] flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-md"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#030712',
                            borderColor: accent.main,
                            boxShadow: `0 0 12px ${accent.main}`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: accent.main }}
                          />
                        </div>
                      </div>

                      {/* 右欄：毛玻璃經歷卡片 + 左側 HUD 連接口凹槽 */}
                      <div
                        className="flex-1 min-w-0 p-5 sm:p-6 border cyber-cut-sm space-y-4 transition-all duration-300 shadow-lg group-hover:border-slate-400 backdrop-blur-md relative"
                        style={{
                          background: isLight
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.82) 100%)'
                            : 'linear-gradient(135deg, rgba(14, 23, 42, 0.50) 0%, rgba(6, 11, 22, 0.60) 100%)',
                          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                          boxShadow: isLight
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(15, 23, 42, 0.05)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.45)',
                        }}
                      >
                        {/* 左側微型連接口指示標 (HUD Port Indicator) */}
                        <div
                          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b transition-colors duration-300 pointer-events-none"
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : '#0a1426',
                            borderColor: accent.main,
                          }}
                        />
                        <div className="border-b border-slate-700/30 pb-3">
                          {(() => {
                            const defaultJobIcon = jIdx === 0 ? School : (jIdx === 1 ? Palette : Building2);
                            const JobIcon = job.iconType ? getLucideIconByName(job.iconType) : defaultJobIcon;
                            return (
                              <h4 className="text-lg sm:text-xl font-black font-hud uppercase flex items-center gap-2.5" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                <JobIcon size={20} className="shrink-0" style={{ color: accent.main }} />
                                <span>{lang === 'zh' ? job.company : (job.company_en || job.company)} • {lang === 'zh' ? job.role : (job.role_en || job.role)}</span>
                              </h4>
                            );
                          })()}
                        </div>

                        <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                          {lang === 'zh' ? job.summary : (job.summary_en || job.summary)}
                        </p>

                        {/* 關鍵專案貢獻與亮點清單 */}
                        {job.projects && (
                          <div className="space-y-2 pt-1">
                            <p className="font-tech text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5" style={{ color: accent.main }}>
                              <FolderGit2 size={16} className="shrink-0" />
                              <span>{lang === 'zh' ? job.projectsHeader : (job.projectsHeader_en || job.projectsHeader)}：</span>
                            </p>
                            <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1.5 pl-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                              {(lang === 'zh' ? job.projects : (job.projects_en || job.projects)).map((proj, pIdx) => (
                                <li key={pIdx} className="leading-relaxed">{proj}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 技能標籤群組 */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {job.tags.map((tg, tIdx) => (
                            <span key={tIdx} className="tech-tag px-3 py-1 border text-xs sm:text-sm font-semibold">
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 第三子區塊：原廠研習與專業進修 */}
          <div
            id="workshops"
            ref={workshopsRef}
            className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-2xl reveal-scale relative overflow-hidden backdrop-blur-xl"
            style={glassSectionCardStyle}
          >
            {/* 微弱 HUD 科技微網紋裝飾 */}
            <div className="flex items-center justify-between border-b border-slate-700/40 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 border cyber-cut-sm shrink-0"
                  style={{
                    backgroundColor: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)',
                    borderColor: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)',
                    color: isLight ? '#7c3aed' : '#c084fc',
                  }}
                >
                  <Award size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                  {t('workshop_section_title')}
                </h3>
              </div>
            </div>

            {/* 專業研習時間線導軌容器 */}
            <div className="space-y-0 relative z-10">
              {(() => {
                const sortedAll = [...currentData.workshops]
                  .filter((ws: any) => ws.visible !== false)
                  .sort((a, b) => parseEndDateValue(b.date) - parseEndDateValue(a.date));
                const list = showAllWorkshops ? sortedAll : sortedAll.slice(0, 2);
                return list.map((ws, wIdx) => {
                  const accent = sequenceAccents[wIdx % sequenceAccents.length];

                  return (
                    <div key={(ws as any).id || ws.title || wIdx} className="relative flex items-center gap-2 sm:gap-4 md:gap-6 group py-4 sm:py-5 first:pt-2 last:pb-2">
                      {/* 左欄：HUD 時間數據膠囊徽章（雙行優雅防邊緣擠壓） */}
                      <div className="w-24 sm:w-28 md:w-32 shrink-0 flex items-center justify-end select-none">
                        {renderChronoCapsule(ws.date, accent)}
                      </div>

                      {/* 中欄：連續垂直導軌線 + 雙向水平微光連接臂 + 雙環同心發光節點 */}
                      <div className="relative flex items-center justify-center shrink-0 w-8 sm:w-10 self-stretch">
                        {/* 垂直連貫導軌：零粗斑物理無縫對接 */}
                        <div
                          className={`absolute w-[2px] pointer-events-none ${
                            wIdx === 0 && list.length > 1
                              ? 'top-1/2 -bottom-5'
                              : wIdx === list.length - 1 && list.length > 1
                              ? '-top-5 bottom-1/2'
                              : list.length === 1
                              ? 'hidden'
                              : '-top-5 -bottom-5'
                          }`}
                          style={{
                            backgroundColor: isLight ? '#cbd5e1' : 'rgba(56, 189, 248, 0.4)',
                          }}
                        />

                        {/* 水平向左微光連接臂（直抵左側時間膠囊） */}
                        <div
                          className="absolute right-1/2 left-[-10px] sm:left-[-16px] md:left-[-24px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(270deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 水平向右微光連接臂（直抵右側卡片連接口） */}
                        <div
                          className="absolute left-1/2 right-[-14px] sm:right-[-20px] md:right-[-26px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                            boxShadow: `0 0 6px ${accent.main}40`,
                          }}
                        />

                        {/* 雙環同心圓節點 */}
                        <div
                          className="relative z-10 shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 sm:border-[3px] flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-md"
                          style={{
                            backgroundColor: isLight ? '#ffffff' : '#030712',
                            borderColor: accent.main,
                            boxShadow: `0 0 12px ${accent.main}`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: accent.main }}
                          />
                        </div>
                      </div>

                      {/* 右欄：毛玻璃經歷卡片 + 左側 HUD 連接口凹槽 */}
                      <div
                        className="flex-1 min-w-0 p-5 sm:p-6 border cyber-cut-sm space-y-4 transition-all duration-300 shadow-lg group-hover:border-slate-400 backdrop-blur-md relative"
                        style={{
                          background: isLight
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.82) 100%)'
                            : 'linear-gradient(135deg, rgba(14, 23, 42, 0.50) 0%, rgba(6, 11, 22, 0.60) 100%)',
                          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                          boxShadow: isLight
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(15, 23, 42, 0.05)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.45)',
                        }}
                      >
                        {/* 左側微型連接口指示標 (HUD Port Indicator) */}
                        <div
                          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b transition-colors duration-300 pointer-events-none"
                          style={{
                            backgroundColor: isLight ? '#f8fafc' : '#0a1426',
                            borderColor: accent.main,
                          }}
                        />
                        {/* 標題列 */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                          <div className="flex-1 min-w-0">
                            {(() => {
                              const defaultWsIcons = [Code2, Box, Video, Gamepad2];
                              const WsIcon = ws.iconType
                                ? getLucideIconByName(ws.iconType)
                                : (defaultWsIcons[wIdx % defaultWsIcons.length] || BookOpen);
                              return (
                                <h4 className="text-base sm:text-lg font-hud font-bold uppercase flex items-start sm:items-center gap-2 leading-snug" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                  <WsIcon size={18} className="shrink-0 mt-0.5 sm:mt-0" style={{ color: accent.main }} />
                                  <span>{ws.title}</span>
                                </h4>
                              );
                            })()}
                            <p className="text-xs sm:text-sm font-tech font-semibold pl-6 mt-1" style={{ color: isLight ? '#475569' : '#cbd5e1' }}>
                              {ws.org}
                            </p>
                          </div>

                          {/* [檢視研習證明] 支援可視性開關 */}
                          {ws.showProof !== false && ws.driveLinkKey && driveLinks[ws.driveLinkKey] && (
                            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                              <a
                                href={driveLinks[ws.driveLinkKey]}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group"
                                style={{
                                  backgroundColor: accent.bg,
                                  borderColor: accent.border,
                                  color: accent.main,
                                }}
                              >
                                <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{ws.btnText}</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* 研習技能詳細條列清單 */}
                        {ws.skills && ws.skills.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="font-tech text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5" style={{ color: accent.main }}>
                              <CheckCircle2 size={15} className="shrink-0" />
                              <span>{ws.skillsHeader || (lang === 'zh' ? '專業內容與技能學習：' : 'SKILLS & KEY LEARNINGS:')}</span>
                            </p>
                            <ul className="list-disc list-inside text-xs sm:text-sm font-tech space-y-1 pl-2" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>
                              {ws.skills.map((sk, skIdx) => (
                                <li key={skIdx} className="leading-relaxed">{sk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {currentData.workshops.length > 2 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowAllWorkshops(!showAllWorkshops)}
                  className="px-5 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm cursor-pointer hover:scale-105 transition-all shadow-sm inline-flex items-center gap-2"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#080e1a',
                    borderColor: cyanCol,
                    color: cyanCol,
                  }}
                >
                  <span>
                    {showAllWorkshops
                      ? (lang === 'zh' ? '收起研習證明' : 'COLLAPSE WORKSHOPS')
                      : (lang === 'zh' ? '檢視更多' : 'VIEW MORE')}
                  </span>
                  {showAllWorkshops ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            )}
          </div>

          {/* 第四子區塊：學術論文與國際期刊 */}
          {currentData.theses && currentData.theses.length > 0 && (
            <div
              id="publications"
              ref={thesesRef}
              className="cyber-card p-6 sm:p-7 border cyber-cut-corner space-y-6 shadow-2xl reveal-scale relative overflow-hidden backdrop-blur-xl"
              style={glassSectionCardStyle}
            >
              <div className="flex items-center justify-between border-b border-slate-700/40 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 border cyber-cut-sm shrink-0"
                    style={{
                      backgroundColor: isLight ? '#d1fae5' : 'rgba(16,185,129,0.12)',
                      borderColor: isLight ? '#34d399' : 'rgba(16,185,129,0.35)',
                      color: isLight ? '#047857' : '#10b981',
                    }}
                  >
                    <BookOpen size={22} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-hud uppercase" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {t('thesis_section_title')}
                  </h3>
                </div>
              </div>

              {/* 學術論文時間線導軌容器 */}
              <div className="space-y-0 relative z-10">
                {(() => {
                  const sortedTheses = [...currentData.theses]
                    .filter((th: any) => th.visible !== false)
                    .sort((a, b) => parseEndDateValue(b.date) - parseEndDateValue(a.date));
                  const list = showAllTheses ? sortedTheses : sortedTheses.slice(0, 3);
                  return list.map((th, thIdx) => {
                    const accent = sequenceAccents[thIdx % sequenceAccents.length];
                    const pubDate = th.date || (th.venue.includes('2025') ? '2025/04' : '2026/07');

                    return (
                      <div key={(th as any).id || th.title || thIdx} className="relative flex items-center gap-2 sm:gap-4 md:gap-6 group py-4 sm:py-5 first:pt-2 last:pb-2">
                        {/* 左欄：HUD 雙行時間數據膠囊（Chrono Capsule: 兩行排版，徹底杜絕文字往左爆出切穿外框） */}
                        <div className="w-20 sm:w-24 md:w-28 shrink-0 flex items-center justify-end select-none">
                          {renderChronoCapsule(pubDate, accent, true)}
                        </div>

                        {/* 中欄：連續垂直導軌線 + 雙向水平微光連接臂 + 雙環同心發光節點 */}
                        <div className="relative flex items-center justify-center shrink-0 w-8 sm:w-10 self-stretch">
                          {/* 垂直連貫導軌：零粗斑物理無縫對接 */}
                          <div
                            className={`absolute w-[2px] pointer-events-none ${
                              thIdx === 0 && list.length > 1
                                ? 'top-1/2 -bottom-5'
                                : thIdx === list.length - 1 && list.length > 1
                                ? '-top-5 bottom-1/2'
                                : list.length === 1
                                ? 'hidden'
                                : '-top-5 -bottom-5'
                            }`}
                            style={{
                              backgroundColor: isLight ? '#cbd5e1' : 'rgba(56, 189, 248, 0.4)',
                            }}
                          />

                          {/* 水平向左微光連接臂（直抵左側時間膠囊） */}
                          <div
                            className="absolute right-1/2 left-[-10px] sm:left-[-16px] md:left-[-24px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(270deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                              boxShadow: `0 0 6px ${accent.main}40`,
                            }}
                          />

                          {/* 水平向右微光連接臂（直抵右側卡片連接口） */}
                          <div
                            className="absolute left-1/2 right-[-14px] sm:right-[-20px] md:right-[-26px] h-[1.5px] pointer-events-none transition-all duration-300 opacity-60 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}99 65%, transparent 100%)`,
                              boxShadow: `0 0 6px ${accent.main}40`,
                            }}
                          />

                          {/* 雙環同心圓節點 */}
                          <div
                            className="relative z-10 shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 sm:border-[3px] flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-md"
                            style={{
                              backgroundColor: isLight ? '#ffffff' : '#030712',
                              borderColor: accent.main,
                              boxShadow: `0 0 12px ${accent.main}`,
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: accent.main }}
                            />
                          </div>
                        </div>

                        {/* 右欄：毛玻璃經歷卡片 + 左側 HUD 連接口凹槽 */}
                        <div
                          className="flex-1 min-w-0 p-5 sm:p-6 border cyber-cut-sm space-y-4 transition-all duration-300 shadow-lg group-hover:border-slate-400 backdrop-blur-md relative"
                          style={{
                            background: isLight
                              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.82) 100%)'
                              : 'linear-gradient(135deg, rgba(14, 23, 42, 0.50) 0%, rgba(6, 11, 22, 0.60) 100%)',
                            borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                            boxShadow: isLight
                              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 8px 24px rgba(15, 23, 42, 0.05)'
                              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 12px 30px rgba(0, 0, 0, 0.45)',
                          }}
                        >
                          {/* 左側微型連接口指示標 (HUD Port Indicator) */}
                          <div
                            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b transition-colors duration-300 pointer-events-none"
                            style={{
                              backgroundColor: isLight ? '#f8fafc' : '#0a1426',
                              borderColor: accent.main,
                            }}
                          />
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-700/30 pb-3">
                            <div className="flex-1 min-w-0">
                              {(() => {
                                const defaultThIcons = [FileText, Presentation];
                                const ThIcon = th.iconType
                                  ? getLucideIconByName(th.iconType)
                                  : (defaultThIcons[thIdx % defaultThIcons.length] || FileText);
                                return (
                                  <h4 className="text-base sm:text-lg md:text-xl font-hud font-bold uppercase flex items-start gap-2.5 leading-snug" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                                    <ThIcon size={20} className="shrink-0 mt-0.5" style={{ color: accent.main }} />
                                    <span>{th.title}</span>
                                  </h4>
                                );
                              })()}
                              <p className="text-xs sm:text-sm font-tech font-semibold pl-7 mt-1" style={{ color: accent.main }}>
                                {th.venue}
                              </p>
                            </div>

                            {/* 操作按鈕 — 改為上下垂直排列 */}
                            <div className="flex flex-col gap-2 shrink-0 pt-2 md:pt-0 w-full sm:w-auto">
                              {/* 「檢視論文全文」— 支援開關 */}
                              {th.showFullText !== false && th.driveLinkKey && driveLinks[th.driveLinkKey] && (
                                <a
                                  href={driveLinks[th.driveLinkKey]}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-4 py-2 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group min-w-[140px]"
                                  style={{
                                    backgroundColor: isLight ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
                                    borderColor: isLight ? '#059669' : '#10b981',
                                    color: isLight ? '#047857' : '#34d399',
                                  }}
                                >
                                  <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>{th.btnText}</span>
                                </a>
                              )}

                              {/* 「檢視論文簡報」— 支援開關 */}
                              {th.showPresentation !== false && th.slidesDriveLinkKey && driveLinks[th.slidesDriveLinkKey] && (
                                <a
                                  href={driveLinks[th.slidesDriveLinkKey]}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-4 py-2 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs group min-w-[140px]"
                                  style={{
                                    backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.15)',
                                    borderColor: isLight ? '#38bdf8' : '#00f0ff',
                                    color: isLight ? '#0369a1' : '#00f0ff',
                                  }}
                                >
                                  <ExternalLink size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                                  <span>{th.slidesBtnText}</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* 詳細內容描述 */}
                          <p className="text-sm sm:text-base font-tech leading-relaxed" style={{ color: isLight ? '#1e293b' : '#e2e8f0' }}>
                            {th.desc}
                          </p>

                          {th.award && (
                            <div
                              className="p-3.5 border font-tech text-xs sm:text-sm font-bold flex items-center gap-2 cyber-cut-sm"
                              style={{
                                backgroundColor: isLight ? '#d1fae5' : 'rgba(16,185,129,0.15)',
                                borderColor: isLight ? '#34d399' : 'rgba(16,185,129,0.35)',
                                color: isLight ? '#047857' : '#34d399',
                              }}
                            >
                              <Award size={16} className="shrink-0" />
                              <span>{th.award}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {currentData.theses.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllTheses(!showAllTheses)}
                    className="px-5 py-2.5 border font-tech text-xs sm:text-sm font-bold uppercase cyber-cut-sm cursor-pointer hover:scale-105 transition-all shadow-sm inline-flex items-center gap-2"
                    style={{
                      backgroundColor: isLight ? '#ffffff' : '#080e1a',
                      borderColor: cyanCol,
                      color: cyanCol,
                    }}
                  >
                    <span>
                      {showAllTheses
                        ? (lang === 'zh' ? '收起論文發表' : 'COLLAPSE PUBLICATIONS')
                        : (lang === 'zh' ? '檢視更多' : 'VIEW MORE')}
                    </span>
                    {showAllTheses ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default Education;
