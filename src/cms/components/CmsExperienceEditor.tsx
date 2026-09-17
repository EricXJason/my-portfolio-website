/**
 * ============================================================================
 * 檔案名稱: CmsExperienceEditor.tsx
 * 所屬模組: Portfolio CMS (經歷與學歷管理模組)
 * 責任描述: 負責管理學歷歷程、工作經歷、研習歷程與論文發表四大子維度之 CRUD 與拖曳排序。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、CmsDirtyContext、SectionTitleEditor、CmsDatePicker 與 CmsConfirmDialog。
 * 邊界處理: 嚴格落實 CIS 青藍紫階級循環與論文綠色規範，防範負數索引與未儲存狀態離開。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  Award,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import defaultExpData from '../../data/experience-section.json';
import { SectionTitleEditor } from './SectionTitleEditor';
import { CmsDatePicker } from './CmsDatePicker';
import { getLucideIconByName } from './CmsIconPickerModal';
import { CmsTagListEditor } from './CmsTagListEditor';
import { CmsUrlInput } from './CmsUrlInput';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';

// ── 型別定義 ────────────────────────────────────────────────────────────────
interface DegreeButton {
  key: string;
  label: string;
  linkKey: string;
  visible?: boolean;
}

interface DegreeItem {
  id: string;
  school: string;
  period: string;
  desc: string;
  type: string;
  iconType?: string;
  visible?: boolean;
  buttons?: DegreeButton[];
}

interface WorkItem {
  company: string;
  company_en?: string;
  role: string;
  role_en?: string;
  period: string;
  summary: string;
  summary_en?: string;
  iconType?: string;
  visible?: boolean;
  projectsHeader?: string;
  projectsHeader_en?: string;
  projects?: string[];
  projects_en?: string[];
  skillsHeader?: string;
  skillsHeader_en?: string;
  tags?: string[];
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
  visible?: boolean;
  showProof?: boolean; // [檢視研習證明] 按鈕開關
  hasCertificate?: boolean;
}

interface ThesisItem {
  title: string;
  venue: string;
  desc: string;
  date?: string;
  iconType?: string;
  driveLinkKey: string;
  btnText: string;
  slidesDriveLinkKey?: string;
  slidesBtnText?: string;
  award?: string;
  visible?: boolean;
  showFullText?: boolean; // [檢視論文全文] 按鈕開關
  showPresentation?: boolean; // 視論文簡報按鈕開關
}

interface ExperienceFullData {
  driveLinks: Record<string, string>;
  zh: {
    degrees: DegreeItem[];
    workExperiences: WorkItem[];
    workshops: WorkshopItem[];
    theses: ThesisItem[];
  };
  en: {
    degrees: DegreeItem[];
    workExperiences: WorkItem[];
    workshops: WorkshopItem[];
    theses: ThesisItem[];
  };
}

export interface ExpMetaTitles {
  exp_title?: string;
  exp_intro: string;
  degree_section_title: string;
  work_section_title: string;
  workshop_section_title: string;
  thesis_section_title: string;
}

const DEFAULT_EXP_META: Record<'zh' | 'en', ExpMetaTitles> = {
  zh: {
    exp_title: '經歷',
    exp_intro: '完整的學術研究歷程、專業產業實務經驗、原廠研習培訓與國際學術論文發表成果。',
    degree_section_title: '學歷',
    work_section_title: '工作經歷',
    workshop_section_title: '研習歷程',
    thesis_section_title: '論文與期刊',
  },
  en: {
    exp_title: 'Experience',
    exp_intro: 'Comprehensive academic research, professional work experience, industry training programs, and published research papers.',
    degree_section_title: 'Degrees',
    work_section_title: 'Work Experience',
    workshop_section_title: 'Workshops',
    thesis_section_title: 'Publications',
  },
};

// 顏色順序規範：青色 (Cyan) → 藍色 (Blue) → 紫色 (Purple) 依序循環
const COLOR_SEQUENCE = [
  { name: '青色 (Cyan)', hex: '#00f0ff', lightHex: '#0369a1', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { name: '藍色 (Blue)', hex: '#3b82f6', lightHex: '#1d4ed8', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { name: '紫色 (Purple)', hex: '#a855f7', lightHex: '#6d28d9', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
];

interface CmsExperienceEditorProps {
  isPreview?: boolean;
}

/**
 * CmsExperienceEditor
 * 經歷與學術全能編輯器：
 * 1. 嚴格落實顏色順序規範：青色 (Cyan) → 藍色 (Blue) → 紫色 (Purple) 循環，論文專屬綠色。
 * 2. 整合 SectionTitleEditor 支援全域區塊與各子項自訂標題。
 * 3. 支援學歷 (degrees)、工作經歷 (workExperiences)、研習 (workshops)、論文期刊 (theses) 四大區塊之全面 CRUD 與拖曳排序。
 * 4. 時間與期間欄位全面整合 CmsDatePicker。
 * 5. 全面符合方形科技風格 (cyber-cut-sm) 與 WCAG 無障礙規範。
 */
export const CmsExperienceEditor: React.FC<CmsExperienceEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  // ── 主要資料 State ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<ExperienceFullData>(() => {
    if (data.experience) {
      return data.experience as unknown as ExperienceFullData;
    }
    const defaults = defaultExpData as unknown as ExperienceFullData;
    try {
      const saved = localStorage.getItem('portfolio_experience_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.zh || parsed.en)) {
          return {
            driveLinks: { ...defaults.driveLinks, ...(parsed.driveLinks || {}) },
            zh: {
              degrees: (parsed.zh?.degrees && parsed.zh.degrees.length >= defaults.zh.degrees.length) ? parsed.zh.degrees : defaults.zh.degrees,
              workExperiences: (parsed.zh?.workExperiences && parsed.zh.workExperiences.length >= defaults.zh.workExperiences.length) ? parsed.zh.workExperiences : defaults.zh.workExperiences,
              workshops: (parsed.zh?.workshops && parsed.zh.workshops.length >= defaults.zh.workshops.length) ? parsed.zh.workshops : defaults.zh.workshops,
              theses: (parsed.zh?.theses && parsed.zh.theses.length >= defaults.zh.theses.length) ? parsed.zh.theses : defaults.zh.theses,
            },
            en: {
              degrees: (parsed.en?.degrees && parsed.en.degrees.length >= defaults.en.degrees.length) ? parsed.en.degrees : defaults.en.degrees,
              workExperiences: (parsed.en?.workExperiences && parsed.en.workExperiences.length >= defaults.en.workExperiences.length) ? parsed.en.workExperiences : defaults.en.workExperiences,
              workshops: (parsed.en?.workshops && parsed.en.workshops.length >= defaults.en.workshops.length) ? parsed.en.workshops : defaults.en.workshops,
              theses: (parsed.en?.theses && parsed.en.theses.length >= defaults.en.theses.length) ? parsed.en.theses : defaults.en.theses,
            },
          };
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return defaults;
  });

  useEffect(() => {
    if (data.experience) {
      setFormData(data.experience as unknown as ExperienceFullData);
    }
  }, [data.experience]);

  // 聆聽廣播存檔事件
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('experience', formData);
        } catch (e) {
          console.error('[CMS Experience] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  // 聆聽全域一鍵還原預設值事件
  useEffect(() => {
    const handleResetAll = () => {
      setFormData(defaultExpData as unknown as ExperienceFullData);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 本地全域即時同步效應：開關或欄位變更時即時同步至本地 Context 與快照，前臺立即反應
  const isFirstExpSync = useRef(true);
  useEffect(() => {
    if (isFirstExpSync.current) {
      isFirstExpSync.current = false;
      return;
    }
    updateDocument('experience', formData, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_experience_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_experience_data_updated'));
    } catch {}
  }, [formData, updateDocument]);

  const [expMeta, setExpMeta] = useState<Record<'zh' | 'en', ExpMetaTitles>>(() => {
    if (data.site_translations) {
      const trans = data.site_translations as any;
      if (trans.zh?.exp_title || trans.en?.exp_title) {
        return {
          zh: {
            exp_title: trans.zh?.exp_title ?? DEFAULT_EXP_META.zh.exp_title,
            exp_intro: trans.zh?.exp_intro ?? DEFAULT_EXP_META.zh.exp_intro,
            degree_section_title: trans.zh?.degree_section_title ?? DEFAULT_EXP_META.zh.degree_section_title,
            work_section_title: trans.zh?.work_section_title ?? DEFAULT_EXP_META.zh.work_section_title,
            workshop_section_title: trans.zh?.workshop_section_title ?? DEFAULT_EXP_META.zh.workshop_section_title,
            thesis_section_title: trans.zh?.thesis_section_title ?? DEFAULT_EXP_META.zh.thesis_section_title,
          },
          en: {
            exp_title: trans.en?.exp_title ?? DEFAULT_EXP_META.en.exp_title,
            exp_intro: trans.en?.exp_intro ?? DEFAULT_EXP_META.en.exp_intro,
            degree_section_title: trans.en?.degree_section_title ?? DEFAULT_EXP_META.en.degree_section_title,
            work_section_title: trans.en?.work_section_title ?? DEFAULT_EXP_META.en.work_section_title,
            workshop_section_title: trans.en?.workshop_section_title ?? DEFAULT_EXP_META.en.workshop_section_title,
            thesis_section_title: trans.en?.thesis_section_title ?? DEFAULT_EXP_META.en.thesis_section_title,
          },
        };
      }
    }
    try {
      const saved = localStorage.getItem('portfolio_custom_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          zh: {
            exp_title: parsed.zh?.exp_title ?? DEFAULT_EXP_META.zh.exp_title,
            exp_intro: parsed.zh?.exp_intro ?? DEFAULT_EXP_META.zh.exp_intro,
            degree_section_title: parsed.zh?.degree_section_title ?? DEFAULT_EXP_META.zh.degree_section_title,
            work_section_title: parsed.zh?.work_section_title ?? DEFAULT_EXP_META.zh.work_section_title,
            workshop_section_title: parsed.zh?.workshop_section_title ?? DEFAULT_EXP_META.zh.workshop_section_title,
            thesis_section_title: parsed.zh?.thesis_section_title ?? DEFAULT_EXP_META.zh.thesis_section_title,
          },
          en: {
            exp_title: parsed.en?.exp_title ?? DEFAULT_EXP_META.en.exp_title,
            exp_intro: parsed.en?.exp_intro ?? DEFAULT_EXP_META.en.exp_intro,
            degree_section_title: parsed.en?.degree_section_title ?? DEFAULT_EXP_META.en.degree_section_title,
            work_section_title: parsed.en?.work_section_title ?? DEFAULT_EXP_META.en.work_section_title,
            workshop_section_title: parsed.en?.workshop_section_title ?? DEFAULT_EXP_META.en.workshop_section_title,
            thesis_section_title: parsed.en?.thesis_section_title ?? DEFAULT_EXP_META.en.thesis_section_title,
          },
        };
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return DEFAULT_EXP_META;
  });

  const [activeSubTab, setActiveSubTab] = useState<'degrees' | 'work' | 'workshops' | 'theses'>('degrees');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  /** 解析歷程時間字串之最終結束時間數值 (由新至舊自動降序排序核心) */
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── 通用雲端硬碟連結處理 ──────────────────────────────────────────────────
  const handleDriveLinkChange = (linkKey: string, url: string) => {
    if (!linkKey) return;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      driveLinks: {
        ...prev.driveLinks,
        [linkKey]: url,
      },
    }));
  };

  // ── 學歷 (Degrees) 欄位變更（支援跨語系結構同步） ─────────────────────────
  const handleDegreeChange = (idx: number, field: keyof DegreeItem, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const syncFields: (keyof DegreeItem)[] = ['period', 'visible', 'type', 'iconType'];
      const shouldSync = syncFields.includes(field);

      const updateLang = (l: 'zh' | 'en') => {
        const arr = [...(prev[l]?.degrees || [])];
        if (arr[idx]) {
          arr[idx] = { ...arr[idx], [field]: value };
        }
        return arr;
      };

      if (shouldSync) {
        return {
          ...prev,
          zh: { ...prev.zh, degrees: updateLang('zh') },
          en: { ...prev.en, degrees: updateLang('en') },
        };
      }

      return {
        ...prev,
        [lang]: { ...prev[lang], degrees: updateLang(lang) },
      };
    });
  };

  const handleDegreeButtonToggle = (degIdx: number, btnIdx: number, checked: boolean) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updateLang = (l: 'zh' | 'en') => {
        const arr = [...(prev[l]?.degrees || [])];
        if (arr[degIdx]) {
          const targetDeg = { ...arr[degIdx] };
          const btns = [...(targetDeg.buttons || [])];
          if (btns[btnIdx]) {
            btns[btnIdx] = { ...btns[btnIdx], visible: checked };
          }
          targetDeg.buttons = btns;
          arr[degIdx] = targetDeg;
        }
        return arr;
      };

      return {
        ...prev,
        zh: { ...prev.zh, degrees: updateLang('zh') },
        en: { ...prev.en, degrees: updateLang('en') },
      };
    });
  };

  const handleAddDegree = () => {
    setIsDirty(true);
    const newId = `degree_${Date.now()}`;
    const newDegZh: DegreeItem = {
      id: newId,
      school: '國立新學校 — 專業系所 (最高學歷)',
      period: '2024.09 - 2026.06',
      desc: '主修專業方向、研習核心技術與畢業專案成果。',
      type: 'other',
      buttons: [
        { key: 'cert', label: '畢業證書', linkKey: `${newId}DiplomaDriveUrl` },
        { key: 'transcript', label: '歷年成績單', linkKey: `${newId}TranscriptDriveUrl` },
      ],
    };
    const newDegEn: DegreeItem = {
      id: newId,
      school: 'National University — Department (Highest Degree)',
      period: '2024.09 - 2026.06',
      desc: 'Majored in core engineering focus, key workshops, and graduation accomplishments.',
      type: 'other',
      buttons: [
        { key: 'cert', label: 'Diploma', linkKey: `${newId}DiplomaDriveUrl` },
        { key: 'transcript', label: 'Transcript', linkKey: `${newId}TranscriptDriveUrl` },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      zh: { ...prev.zh, degrees: [newDegZh, ...(prev.zh?.degrees || [])] },
      en: { ...prev.en, degrees: [newDegEn, ...(prev.en?.degrees || [])] },
    }));
    showToast(isEn ? 'Added new degree entry!' : '已成功新增一筆學歷紀錄！');
  };

  const triggerDeleteDegreeDialog = (idx: number) => {
    const item = formData[lang]?.degrees?.[idx];
    const name = item?.school || (isEn ? 'this degree entry' : '此學歷紀錄');
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Degree' : '確認刪除此學歷',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete Degree' : '確定刪除學歷',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => ({
          ...prev,
          zh: { ...prev.zh, degrees: prev.zh?.degrees.filter((_, i) => i !== idx) },
          en: { ...prev.en, degrees: prev.en?.degrees.filter((_, i) => i !== idx) },
        }));
        showToast(isEn ? 'Degree entry removed!' : '已刪除該筆學歷！');
      },
    });
  };

  // ── 工作經歷 (Work Experiences) CRUD 與跨語系同步 ────────────────────────
  const handleWorkChange = (idx: number, field: keyof WorkItem, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const syncFields: (keyof WorkItem)[] = ['period', 'visible', 'iconType'];
      const shouldSync = syncFields.includes(field);

      const updateLang = (l: 'zh' | 'en') => {
        const arr = [...(prev[l]?.workExperiences || [])];
        if (arr[idx]) {
          arr[idx] = { ...arr[idx], [field]: value };
        }
        return arr;
      };

      if (shouldSync) {
        return {
          ...prev,
          zh: { ...prev.zh, workExperiences: updateLang('zh') },
          en: { ...prev.en, workExperiences: updateLang('en') },
        };
      }

      return {
        ...prev,
        [lang]: { ...prev[lang], workExperiences: updateLang(lang) },
      };
    });
  };

  const handleAddWork = () => {
    setIsDirty(true);
    const newWorkZh: WorkItem = {
      company: '新公司或組織名稱',
      company_en: 'New Company or Organization',
      role: '資深軟體工程師 / 研發人員',
      role_en: 'Senior Software Engineer / Developer',
      period: '2024/01 ~ 2026/06',
      summary: '負責系統架構規劃、全端工程開發與新興技術整合。',
      summary_en: 'Spearheaded system architecture, fullstack development, and tech integration.',
      projectsHeader: '參與核心專案成果',
      projectsHeader_en: 'Key Project Achievements',
      projects: ['核心專案一：主導微服務重構與效能調校', '核心專案二：跨平臺前端互動研發'],
      projects_en: ['Core Project 1: Microservices refactoring', 'Core Project 2: Cross-platform interaction'],
      skillsHeader: '技術與核心範疇',
      skillsHeader_en: 'Technical Core Scope',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages'],
    };

    setFormData((prev) => ({
      ...prev,
      zh: { ...prev.zh, workExperiences: [newWorkZh, ...(prev.zh?.workExperiences || [])] },
      en: { ...prev.en, workExperiences: [newWorkZh, ...(prev.en?.workExperiences || [])] },
    }));
    showToast(isEn ? 'Added new work experience!' : '已成功新增一筆工作經歷！');
  };

  const triggerDeleteWorkDialog = (idx: number) => {
    const item = formData[lang]?.workExperiences?.[idx];
    const name = (isEn ? item?.role_en || item?.role : item?.role) || (isEn ? 'this work experience' : '此工作經歷');
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Work Experience' : '確認刪除此工作經歷',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete Work' : '確定刪除工作經歷',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => ({
          ...prev,
          zh: { ...prev.zh, workExperiences: prev.zh?.workExperiences.filter((_, i) => i !== idx) },
          en: { ...prev.en, workExperiences: prev.en?.workExperiences.filter((_, i) => i !== idx) },
        }));
        showToast(isEn ? 'Work experience removed!' : '已刪除該筆工作經歷！');
      },
    });
  };

  // ── 研習歷程 (Workshops) CRUD 與跨語系同步 ─────────────────────────────
  const handleWorkshopChange = (idx: number, field: keyof WorkshopItem, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const syncFields: (keyof WorkshopItem)[] = ['date', 'visible', 'iconType', 'hasCertificate', 'driveLinkKey'];
      const shouldSync = syncFields.includes(field);

      const updateLang = (l: 'zh' | 'en') => {
        const arr = [...(prev[l]?.workshops || [])];
        if (arr[idx]) {
          arr[idx] = { ...arr[idx], [field]: value };
        }
        return arr;
      };

      if (shouldSync) {
        return {
          ...prev,
          zh: { ...prev.zh, workshops: updateLang('zh') },
          en: { ...prev.en, workshops: updateLang('en') },
        };
      }

      return {
        ...prev,
        [lang]: { ...prev[lang], workshops: updateLang(lang) },
      };
    });
  };

  const handleAddWorkshop = () => {
    setIsDirty(true);
    const linkKey = `workshopProof_${Date.now()}`;
    const newWsZh: WorkshopItem = {
      title: '2026 新一代雲端架構與 AI 整合實戰工作坊',
      date: '2026/03 ~ 2026/06',
      org: '主辦單位：國際雲端科技聯盟',
      iconType: 'code',
      driveLinkKey: linkKey,
      btnText: '檢視研習證明',
      skillsHeader: '專業內容與技能學習',
      skills: ['掌握雲端無伺服器架構與邊緣部署流程', 'AI 代理人與端點安全性實作'],
    };
    const newWsEn: WorkshopItem = {
      title: '2026 Next-Gen Cloud Architecture & AI Workshop',
      date: '2026/03 ~ 2026/06',
      org: 'Organizer: Global Cloud Technology Alliance',
      iconType: 'code',
      driveLinkKey: linkKey,
      btnText: 'View Proof',
      skillsHeader: 'Skills & Content Mastered',
      skills: ['Mastered cloud serverless architectures and edge deployments', 'AI agent endpoint security implementation'],
    };

    setFormData((prev) => ({
      ...prev,
      zh: { ...prev.zh, workshops: [newWsZh, ...(prev.zh?.workshops || [])] },
      en: { ...prev.en, workshops: [newWsEn, ...(prev.en?.workshops || [])] },
    }));
    showToast(isEn ? 'Added new workshop!' : '已成功新增一筆研習歷程！');
  };

  const triggerDeleteWorkshopDialog = (idx: number) => {
    const item = formData[lang]?.workshops?.[idx];
    const name = item?.title || (isEn ? 'this workshop entry' : '此研習歷程');
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Workshop' : '確認刪除此研習歷程',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete Workshop' : '確定刪除研習',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => ({
          ...prev,
          zh: { ...prev.zh, workshops: prev.zh?.workshops.filter((_, i) => i !== idx) },
          en: { ...prev.en, workshops: prev.en?.workshops.filter((_, i) => i !== idx) },
        }));
        showToast(isEn ? 'Workshop entry removed!' : '已刪除該筆研習歷程！');
      },
    });
  };

  // ── 學術論文 (Theses) 欄位變更與跨語系同步 ────────────────────────────────
  const handleThesisChange = (idx: number, field: keyof ThesisItem, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const syncFields: (keyof ThesisItem)[] = [
        'date',
        'visible',
        'iconType',
        'showFullText',
        'showPresentation',
        'driveLinkKey',
        'slidesDriveLinkKey',
      ];
      const shouldSync = syncFields.includes(field);

      const updateLang = (l: 'zh' | 'en') => {
        const arr = [...(prev[l]?.theses || [])];
        if (arr[idx]) {
          arr[idx] = { ...arr[idx], [field]: value };
        }
        return arr;
      };

      if (shouldSync) {
        return {
          ...prev,
          zh: { ...prev.zh, theses: updateLang('zh') },
          en: { ...prev.en, theses: updateLang('en') },
        };
      }

      return {
        ...prev,
        [lang]: { ...prev[lang], theses: updateLang(lang) },
      };
    });
  };

  const handleAddThesis = () => {
    setIsDirty(true);
    const linkKey = `thesisPaper_${Date.now()}`;
    const slidesKey = `thesisSlides_${Date.now()}`;
    const newThZh: ThesisItem = {
      title: '新學術論文或期刊發表標題',
      venue: '國際學術研討會 / 專業期刊名稱',
      desc: '研究核心摘要、方法論與學術理論創新貢獻說明。',
      date: '2026/06',
      iconType: 'file-text',
      driveLinkKey: linkKey,
      btnText: '檢視論文全文',
      slidesDriveLinkKey: slidesKey,
      slidesBtnText: '檢視發表簡報',
      award: '',
    };
    const newThEn: ThesisItem = {
      title: 'New Research Paper Title',
      venue: 'International Conference / Journal',
      desc: 'Research summary, methodology, and core theoretical contributions.',
      date: '2026/06',
      iconType: 'file-text',
      driveLinkKey: linkKey,
      btnText: 'View Paper',
      slidesDriveLinkKey: slidesKey,
      slidesBtnText: 'View Slides',
      award: '',
    };

    setFormData((prev) => ({
      ...prev,
      zh: { ...prev.zh, theses: [newThZh, ...(prev.zh?.theses || [])] },
      en: { ...prev.en, theses: [newThEn, ...(prev.en?.theses || [])] },
    }));
    showToast(isEn ? 'Added new thesis / publication!' : '已成功新增一筆論文/期刊發表！');
  };

  const triggerDeleteThesisDialog = (idx: number) => {
    const item = formData[lang]?.theses?.[idx];
    const name = item?.title || (isEn ? 'this thesis entry' : '此論文項目');
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Thesis' : '確認刪除此論文/期刊',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete Thesis' : '確定刪除論文',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => ({
          ...prev,
          zh: { ...prev.zh, theses: prev.zh?.theses.filter((_, i) => i !== idx) },
          en: { ...prev.en, theses: prev.en?.theses.filter((_, i) => i !== idx) },
        }));
        showToast(isEn ? 'Thesis entry removed!' : '已刪除該筆論文！');
      },
    });
  };
  const sortDegrees = (list: DegreeItem[]) => [...(list || [])].sort((a, b) => parseEndDateValue(b.period) - parseEndDateValue(a.period));
  const sortWork = (list: WorkItem[]) => [...(list || [])].sort((a, b) => parseEndDateValue(b.period) - parseEndDateValue(a.period));
  const sortWorkshops = (list: WorkshopItem[]) => [...(list || [])].sort((a, b) => parseEndDateValue(b.date) - parseEndDateValue(a.date));
  const sortTheses = (list: ThesisItem[]) => [...(list || [])].sort((a, b) => parseEndDateValue(b.date) - parseEndDateValue(a.date));

  // ── 儲存與重設 ─────────────────────────────────────────────────────────────
  /**
   * TODO: [後端端點對接] 儲存並同步更新學歷、經歷、研習與論文期刊資料
   * 1. HTTP Method: PUT
   * 2. 預期端點: /api/v1/experience
   * 3. 請求載荷 (Request Body):
   *    - Header: Authorization: Bearer <JWT_ACCESS_TOKEN>
   *    - Body: { data: ExperienceFullData, meta: ExpMetaTitles }
   * 4. 預期回應:
   *    - 200 OK: { success: true, message: "經歷與學歷資料更新成功" }
   *    - 401 Unauthorized: 權限不足
   * 5. 當前狀態: 暫時採用本地持久化 (localStorage) 模擬更新，待後端 API 上線後切換為 apiClient.put()。
   */
  const handleSaveConfirm = async () => {
    try {
      const sortedFormData = {
        ...formData,
        zh: {
          ...formData.zh,
          degrees: sortDegrees(formData.zh?.degrees || []),
          workExperiences: sortWork(formData.zh?.workExperiences || []),
          workshops: sortWorkshops(formData.zh?.workshops || []),
          theses: sortTheses(formData.zh?.theses || []),
        },
        en: {
          ...formData.en,
          degrees: sortDegrees(formData.en?.degrees || []),
          workExperiences: sortWork(formData.en?.workExperiences || []),
          workshops: sortWorkshops(formData.en?.workshops || []),
          theses: sortTheses(formData.en?.theses || []),
        },
      };
      setFormData(sortedFormData);
      localStorage.setItem('portfolio_experience_data', JSON.stringify(sortedFormData));
      const curTranslations = JSON.parse(localStorage.getItem('portfolio_custom_translations') || '{}');
      const updatedTranslations = {
        ...curTranslations,
        zh: { ...curTranslations.zh, ...expMeta.zh },
        en: { ...curTranslations.en, ...expMeta.en },
      };
      localStorage.setItem('portfolio_custom_translations', JSON.stringify(updatedTranslations));

      window.dispatchEvent(new Event('portfolio_experience_data_updated'));
      window.dispatchEvent(new Event('portfolio_custom_translations_updated'));

      await updateDocument('experience', sortedFormData);
      await updateDocument('site_translations', {
        ...(data.site_translations as any || {}),
        zh: { ...(data.site_translations as any)?.zh, ...expMeta.zh },
        en: { ...(data.site_translations as any)?.en, ...expMeta.en },
      });

      setIsDirty(false);
      showToast(isEn ? 'Experience changes saved to cloud successfully!' : '經歷與學術資料已儲存至雲端資料庫！');
    } catch {
      showToast(isEn ? 'Failed to save to cloud' : '存檔失敗，請檢查網路連線');
    }
    setDialog(EMPTY_DIALOG);
  };

  const handleResetConfirm = async () => {
    try {
      localStorage.removeItem('portfolio_experience_data');
      const savedTrans = localStorage.getItem('portfolio_custom_translations');
      if (savedTrans) {
        const transObj = JSON.parse(savedTrans);
        const keysToRemove = ['exp_title', 'exp_intro', 'degree_section_title', 'work_section_title', 'workshop_section_title', 'thesis_section_title'];
        if (transObj.zh) keysToRemove.forEach((k) => delete transObj.zh[k]);
        if (transObj.en) keysToRemove.forEach((k) => delete transObj.en[k]);
        localStorage.setItem('portfolio_custom_translations', JSON.stringify(transObj));
      }
    } catch {
      // 忽略例外
    }
    const defaults = defaultExpData as unknown as ExperienceFullData;
    setFormData(defaults);
    setExpMeta(DEFAULT_EXP_META);
    setIsDirty(false);
    window.dispatchEvent(new Event('portfolio_experience_data_updated'));
    window.dispatchEvent(new Event('portfolio_custom_translations_updated'));
    try {
      await updateDocument('experience', defaults);
      showToast(isEn ? 'Reset to default data' : '已重設回預設資料');
    } catch {
      showToast(isEn ? 'Restored locally' : '已重設本地資料');
    }
    setDialog(EMPTY_DIALOG);
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 border cyber-cut-sm bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs font-['Noto_Sans_TC'] shadow-lg backdrop-blur-xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 確認對話框（統一視覺風格，與多語系選擇彈窗一致） */}
      <CmsConfirmDialog
        dialog={dialog}
        onClose={() => setDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 頂部控制列（全站統一標準樣式） */}
      <div className="flex items-center justify-between p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
          {isEn ? 'Experience & Academic' : '經歷與學術'}
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isPreview}
            onClick={() =>
              setDialog({
                isOpen: true,
                type: 'reset',
                title: isEn ? 'Reset Experience Data' : '重設經歷與學術資料',
                message: isEn
                  ? 'Are you sure you want to reset all experience data to default? Unsaved changes will be lost.'
                  : '確定要將所有學歷、工作經歷、研習與論文資料重設為初始預設值嗎？此操作無法撤銷。',
                confirmText: isEn ? 'Confirm Reset' : '確認重設',
                onConfirm: handleResetConfirm,
              })
            }
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : (isEn ? 'Restore defaults for this module only' : '僅還原此模組預設值')}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>

          <button
            type="button"
            disabled={isPreview}
            onClick={() =>
              setDialog({
                isOpen: true,
                type: 'save',
                title: isEn ? 'Save Experience Changes' : '確認儲存經歷變更',
                message: isEn
                  ? 'All modifications will be saved to local cache and synchronized with the frontend site.'
                  : '確定要儲存所有學歷、經歷、研習與論文的變更嗎？儲存後將即時同步至前臺網站。',
                confirmText: isEn ? 'Save Changes' : '確認儲存',
                onConfirm: handleSaveConfirm,
              })
            }
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : undefined}
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* ── 區塊主標題與副標題自訂編輯器 ── */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'Education & Experience' : '學歷與經歷'}
        zhValue={expMeta.zh.exp_title ?? '學歷與經歷'}
        enValue={expMeta.en.exp_title ?? 'Education & Experience'}
        onZhChange={(val: string) => {
          setIsDirty(true);
          setExpMeta((p) => ({ ...p, zh: { ...p.zh, exp_title: val } }));
        }}
        onEnChange={(val: string) => {
          setIsDirty(true);
          setExpMeta((p) => ({ ...p, en: { ...p.en, exp_title: val } }));
        }}
        zhSubtitleValue={expMeta.zh.exp_intro}
        enSubtitleValue={expMeta.en.exp_intro}
        onZhSubtitleChange={(val: string) => {
          setIsDirty(true);
          setExpMeta((p) => ({ ...p, zh: { ...p.zh, exp_intro: val } }));
        }}
        onEnSubtitleChange={(val: string) => {
          setIsDirty(true);
          setExpMeta((p) => ({ ...p, en: { ...p.en, exp_intro: val } }));
        }}
        isPreview={isPreview}
      />

      {/* ── 四大子區塊切換頁籤（固定色彩規範：學歷→青、工作→藍、研習→紫、論文→綠）── */}
      {(() => {
        // 子分頁固定主題強調色對照表 — 嚴格遵循 CIS 色彩順序規範
        const TAB_ACCENTS: Record<string, {
          activeBg: string; activeBorder: string; activeText: string;
          addBg: string; addBorder: string; addText: string;
        }> = {
          degrees: {
            activeBg:     isLight ? 'rgba(2,132,199,0.1)'   : 'rgba(0,240,255,0.1)',
            activeBorder: isLight ? '#0284c7'                : '#00f0ff',
            activeText:   isLight ? '#0369a1'                : '#00f0ff',
            addBg:        isLight ? 'rgba(2,132,199,0.1)'   : 'rgba(0,240,255,0.1)',
            addBorder:    isLight ? '#0284c7'                : '#00f0ff',
            addText:      isLight ? '#0369a1'                : '#00f0ff',
          },
          work: {
            activeBg:     isLight ? 'rgba(56,189,248,0.1)'  : 'rgba(56,189,248,0.15)',
            activeBorder: isLight ? '#0284c7'                : '#38bdf8',
            activeText:   isLight ? '#0284c7'                : '#38bdf8',
            addBg:        isLight ? 'rgba(56,189,248,0.1)'  : 'rgba(56,189,248,0.15)',
            addBorder:    isLight ? '#0284c7'                : '#38bdf8',
            addText:      isLight ? '#0284c7'                : '#38bdf8',
          },
          workshops: {
            activeBg:     isLight ? 'rgba(124,58,237,0.1)'  : 'rgba(168,85,247,0.12)',
            activeBorder: isLight ? '#7c3aed'                : '#a855f7',
            activeText:   isLight ? '#6d28d9'                : '#c084fc',
            addBg:        isLight ? 'rgba(124,58,237,0.1)'  : 'rgba(168,85,247,0.12)',
            addBorder:    isLight ? '#7c3aed'                : '#a855f7',
            addText:      isLight ? '#6d28d9'                : '#c084fc',
          },
          theses: {
            activeBg:     isLight ? 'rgba(5,150,105,0.1)'   : 'rgba(16,185,129,0.12)',
            activeBorder: isLight ? '#059669'                : '#10b981',
            activeText:   isLight ? '#047857'                : '#34d399',
            addBg:        isLight ? 'rgba(5,150,105,0.1)'   : 'rgba(16,185,129,0.12)',
            addBorder:    isLight ? '#059669'                : '#10b981',
            addText:      isLight ? '#047857'                : '#34d399',
          },
        };

        const currentAddAccent = TAB_ACCENTS[activeSubTab];

        return (
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-3">
            {[
              { id: 'degrees',   labelZh: '學歷歷程',     labelEn: 'Degrees',               icon: GraduationCap, count: formData[lang]?.degrees?.length || 0 },
              { id: 'work',      labelZh: '工作經歷',     labelEn: 'Work Experience',        icon: Briefcase,     count: formData[lang]?.workExperiences?.length || 0 },
              { id: 'workshops', labelZh: '研習歷程',     labelEn: 'Workshops',              icon: Award,         count: formData[lang]?.workshops?.length || 0 },
              { id: 'theses',    labelZh: '論文與期刊',   labelEn: 'Theses & Publications',  icon: BookOpen,      count: formData[lang]?.theses?.length || 0 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              const accent = TAB_ACCENTS[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className="flex items-center gap-2 px-4 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer"
                  style={
                    isActive
                      ? {
                          backgroundColor: accent.activeBg,
                          borderColor: accent.activeBorder,
                          color: accent.activeText,
                          boxShadow: `0 2px 12px ${accent.activeBorder}33`,
                        }
                      : {
                          backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.7)',
                          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)',
                          color: isLight ? '#64748b' : '#94a3b8',
                        }
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{isEn ? tab.labelEn : tab.labelZh}</span>
                  <span
                    className="px-1.5 py-0.5 border cyber-cut-sm text-[10px] font-mono"
                    style={
                      isActive
                        ? { borderColor: accent.activeBorder, color: accent.activeText }
                        : { borderColor: 'var(--border-color)', color: 'var(--text-sub)' }
                    }
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}

            {/* 新增按鈕：隨當前子頁籤之代表主題色動態調整 */}
            <div className="ml-auto">
              <button
                type="button"
                disabled={isPreview}
                onClick={
                  activeSubTab === 'degrees'
                    ? handleAddDegree
                    : activeSubTab === 'work'
                    ? handleAddWork
                    : activeSubTab === 'workshops'
                    ? handleAddWorkshop
                    : handleAddThesis
                }
                className="flex items-center gap-1.5 px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs hover:opacity-80 active:scale-[0.98]"
                style={{
                  backgroundColor: currentAddAccent.addBg,
                  borderColor: currentAddAccent.addBorder,
                  color: currentAddAccent.addText,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? activeSubTab === 'degrees'
                      ? 'Add Degree'
                      : activeSubTab === 'work'
                      ? 'Add Work'
                      : activeSubTab === 'workshops'
                      ? 'Add Workshop'
                      : 'Add Publication'
                    : activeSubTab === 'degrees'
                    ? '新增學歷'
                    : activeSubTab === 'work'
                    ? '新增工作經歷'
                    : activeSubTab === 'workshops'
                    ? '新增研習'
                    : '新增論文'}
                </span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── 子頁籤 1：學歷列表 ── */}
      {activeSubTab === 'degrees' && (
        <div className="space-y-4">
          <div className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] flex items-center justify-between px-1">
            <span>{isEn ? 'Entries sorted chronologically by end date' : '學歷項目依結束時間自動排序'}</span>
            <span className="text-[10px] font-mono">Total: {formData[lang]?.degrees?.length || 0}</span>
          </div>

          {(formData[lang]?.degrees || []).map((deg, idx) => {
            const colorSpec = COLOR_SEQUENCE[idx % COLOR_SEQUENCE.length];

            return (
              <div
                key={deg.id || idx}
                className="border cyber-cut-sm p-5 space-y-4 transition-all"
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                }}
              >
                {/* 標題列排版 */}
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold ${colorSpec.badge}`}>
                      #{idx + 1}
                    </span>
                    {deg.visible === false && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border cyber-cut-sm text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 項目顯示/隱藏開關 */}
                    <label
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-bold font-mono border-[var(--border-color)] hover:border-[var(--neon-cyan)] bg-[var(--card-inner)] cursor-pointer select-none"
                      title={deg.visible !== false ? '點擊於前臺隱藏此學歷' : '點擊於前臺顯示此學歷'}
                    >
                      {deg.visible !== false ? (
                        <Eye className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <input
                        type="checkbox"
                        checked={deg.visible !== false}
                        disabled={isPreview}
                        onChange={(e) => handleDegreeChange(idx, 'visible' as any, e.target.checked)}
                        className="sr-only"
                      />
                      <span>{deg.visible !== false ? (isEn ? 'Show' : '顯示') : (isEn ? 'Hidden' : '隱藏')}</span>
                    </label>

                    {/* 固定學歷語意圖示展示 */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-mono border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] select-none opacity-85"
                      title={isEn ? 'Fixed Degree Semantic Icon' : '固定學位語意圖示'}
                    >
                      {React.createElement(getLucideIconByName(deg.type === 'master' || deg.id === 'master' || idx === 0 ? 'graduation-cap' : 'school'), {
                        className: 'w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0',
                      })}
                      <span className="truncate max-w-[80px]">
                        {deg.type === 'master' || deg.id === 'master' || idx === 0 ? (isEn ? 'Master' : '碩士') : (isEn ? 'Bachelor' : '學士')}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isPreview}
                      onClick={() => triggerDeleteDegreeDialog(idx)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                      title={isEn ? 'Delete degree' : '刪除此筆學歷'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 學校名稱與就讀期間輸入框 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'School & Department' : '學校與系所名稱'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={deg.school}
                      onChange={(e) => handleDegreeChange(idx, 'school', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Period (Date Picker)' : '就讀期間 (支援日期選擇器)'}
                    </label>
                    <CmsDatePicker
                      value={deg.period}
                      onChange={(val) => handleDegreeChange(idx, 'period', val)}
                      disabled={isPreview}
                      placeholder="YYYY.MM - YYYY.MM"
                    />
                  </div>
                </div>

                {/* 詳細內容描述 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                      {isEn ? 'Description & Achievements' : '主修方向與研究成果簡介'}
                    </label>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                      style={{
                        backgroundColor: (deg.desc || '').length > 200 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                        borderColor: (deg.desc || '').length > 200 ? '#f87171' : 'var(--border-color)',
                        color: (deg.desc || '').length > 200 ? '#f87171' : 'var(--text-sub)',
                      }}
                    >
                      {(deg.desc || '').length} / 200
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    disabled={isPreview}
                    value={deg.desc}
                    onChange={(e) => handleDegreeChange(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none resize-none"
                    style={{ borderColor: borderCol }}
                  />
                </div>

                {/* 學位操作按鈕組與佐證連結 */}
                {deg.buttons && deg.buttons.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                        {isEn ? 'Attached Proof Documents & Buttons (Drive Links):' : '附帶佐證證明檔案與操作按鈕（雲端硬碟連結）：'}
                      </span>
                      <span className="text-[10px] text-[var(--text-sub)]">
                        {isEn ? 'Each button can be toggled independently' : '每個按鈕皆可獨立開啟或隱藏'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {deg.buttons.map((btn, bIdx) => (
                        <div key={bIdx} className="p-3 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-main)]">
                              {btn.label}
                            </span>
                            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-mono">
                              <input
                                type="checkbox"
                                checked={btn.visible !== false}
                                disabled={isPreview}
                                onChange={(e) => handleDegreeButtonToggle(idx, bIdx, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--neon-cyan)] relative"></div>
                              <span className={btn.visible !== false ? 'text-[var(--neon-cyan)]' : 'text-slate-500'}>
                                {btn.visible !== false ? (isEn ? 'ON' : '顯示') : (isEn ? 'OFF' : '隱藏')}
                              </span>
                            </label>
                          </div>
                          <CmsUrlInput
                            label={isEn ? `${btn.label} Drive Link` : `${btn.label}雲端連結`}
                            value={formData.driveLinks?.[btn.linkKey] || ''}
                            onChange={(val) => handleDriveLinkChange(btn.linkKey, val)}
                            placeholder="https://drive.google.com/file/d/..."
                            disabled={isPreview || btn.visible === false}
                            isEn={isEn}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 子頁籤 2：工作經歷列表 ── */}
      {activeSubTab === 'work' && (
        <div className="space-y-4">
          <div className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] flex items-center justify-between px-1">
            <span>{isEn ? 'Entries sorted chronologically by end date' : '工作經歷項目依結束時間自動排序'}</span>
            <span className="text-[10px] font-mono">Total: {formData[lang]?.workExperiences?.length || 0}</span>
          </div>

          {(formData[lang]?.workExperiences || []).map((work, idx) => {
            const colorSpec = COLOR_SEQUENCE[idx % COLOR_SEQUENCE.length];

            return (
              <div
                key={idx}
                className="border cyber-cut-sm p-5 space-y-4 transition-all"
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                }}
              >
                {/* 標題列排版 */}
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold ${colorSpec.badge}`}>
                      #{idx + 1}
                    </span>
                    {work.visible === false && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border cyber-cut-sm text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 項目顯示/隱藏開關 */}
                    <label
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-bold font-mono border-[var(--border-color)] hover:border-[var(--neon-cyan)] bg-[var(--card-inner)] cursor-pointer select-none"
                      title={work.visible !== false ? '點擊於前臺隱藏此經歷' : '點擊於前臺顯示此經歷'}
                    >
                      {work.visible !== false ? (
                        <Eye className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <input
                        type="checkbox"
                        checked={work.visible !== false}
                        disabled={isPreview}
                        onChange={(e) => handleWorkChange(idx, 'visible' as any, e.target.checked)}
                        className="sr-only"
                      />
                      <span>{work.visible !== false ? (isEn ? 'Show' : '顯示') : (isEn ? 'Hidden' : '隱藏')}</span>
                    </label>

                    {/* 固定工作經歷語意圖示展示 */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-mono border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] select-none opacity-85"
                      title={isEn ? 'Fixed Work Semantic Icon' : '固定經歷語意圖示'}
                    >
                      {React.createElement(getLucideIconByName(work.iconType || (idx === 0 ? 'school' : (idx === 1 ? 'palette' : 'building-2'))), {
                        className: 'w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0',
                      })}
                      <span className="truncate max-w-[80px]">
                        {work.iconType || (idx === 0 ? 'school' : (idx === 1 ? 'palette' : 'building-2'))}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isPreview}
                      onClick={() => triggerDeleteWorkDialog(idx)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                      title={isEn ? 'Delete work experience' : '刪除此筆經歷'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 公司名稱與擔任職稱 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Company / Organization' : '任職單位 / 公司名稱'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={isEn ? (work.company_en ?? work.company) : work.company}
                      onChange={(e) => handleWorkChange(idx, isEn ? 'company_en' : 'company', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Role / Title' : '擔任職稱'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={isEn ? (work.role_en ?? work.role) : work.role}
                      onChange={(e) => handleWorkChange(idx, isEn ? 'role_en' : 'role', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>
                </div>

                {/* 在職期間 */}
                <div>
                  <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                    {isEn ? 'Period (Date Picker)' : '任職期間 (支援日期選擇器)'}
                  </label>
                  <CmsDatePicker
                    value={work.period}
                    onChange={(val) => handleWorkChange(idx, 'period', val)}
                    disabled={isPreview}
                    placeholder="YYYY/MM ~ YYYY/MM"
                  />
                </div>

                {/* 職務內容摘要說明 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                      {isEn ? 'Job Summary' : '職責概述與成就說明'}
                    </label>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                      style={{
                        backgroundColor: (isEn ? (work.summary_en ?? work.summary) : work.summary || '').length > 300 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                        borderColor: (isEn ? (work.summary_en ?? work.summary) : work.summary || '').length > 300 ? '#f87171' : 'var(--border-color)',
                        color: (isEn ? (work.summary_en ?? work.summary) : work.summary || '').length > 300 ? '#f87171' : 'var(--text-sub)',
                      }}
                    >
                      {(isEn ? (work.summary_en ?? work.summary) : work.summary || '').length} / 300
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    disabled={isPreview}
                    value={isEn ? (work.summary_en ?? work.summary) : work.summary}
                    onChange={(e) => handleWorkChange(idx, isEn ? 'summary_en' : 'summary', e.target.value)}
                    className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none resize-none"
                    style={{ borderColor: borderCol }}
                  />
                </div>

                {/* 專案成果與主要貢獻多行文字輸入框 */}
                <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                      {isEn ? 'Key Projects / Key Contributions (One item per line, free formatting):' : '參與專案 / 核心貢獻列表 (每行一項，自由排版)：'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--neon-cyan)]">
                        {(isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).length} {isEn ? 'lines' : '行'}
                      </span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                        style={{
                          backgroundColor: ((isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).join('\n')).length > 500 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                          borderColor: ((isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).join('\n')).length > 500 ? '#f87171' : 'var(--border-color)',
                          color: ((isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).join('\n')).length > 500 ? '#f87171' : 'var(--text-sub)',
                        }}
                      >
                        {((isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).join('\n')).length} / 500
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    disabled={isPreview}
                    value={(isEn ? (work.projects_en || work.projects || []) : (work.projects || [])).join('\n')}
                    onChange={(e) => {
                      handleWorkChange(idx, isEn ? 'projects_en' : 'projects', e.target.value.split('\n'));
                    }}
                    placeholder={isEn ? 'Enter key contributions or project achievements, one item per line...' : '請輸入參與專案或核心貢獻，每行一項，可自由調整換行與段落排版...'}
                    className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none resize-y font-['Noto_Sans_TC'] leading-relaxed"
                    style={{ borderColor: borderCol }}
                  />
                </div>

                {/* 技能標籤群組（採用 CmsTagListEditor 標籤編輯器） */}
                <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-2">
                  <CmsTagListEditor
                    label={isEn ? 'Skills Tags' : '技術關鍵字標籤 (Tags)'}
                    tags={work.tags || []}
                    onChange={(newTags) => handleWorkChange(idx, 'tags', newTags)}
                    disabled={isPreview}
                    placeholder={isEn ? 'Add tech tag...' : '新增技術標籤...'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 子頁籤 3：研習工作坊列表 ── */}
      {activeSubTab === 'workshops' && (
        <div className="space-y-4">
          <div className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] flex items-center justify-between px-1">
            <span>{isEn ? 'Entries sorted chronologically by end date' : '研習項目依結束時間自動排序'}</span>
            <span className="text-[10px] font-mono">Total: {formData[lang]?.workshops?.length || 0}</span>
          </div>

          {(formData[lang]?.workshops || []).map((ws, idx) => {
            const colorSpec = COLOR_SEQUENCE[idx % COLOR_SEQUENCE.length];

            return (
              <div
                key={idx}
                className="border cyber-cut-sm p-5 space-y-4 transition-all"
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
                  borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                }}
              >
                {/* 標題列排版 */}
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold ${colorSpec.badge}`}>
                      #{idx + 1}
                    </span>
                    {ws.visible === false && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border cyber-cut-sm text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 項目顯示/隱藏開關 */}
                    <label
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-bold font-mono border-[var(--border-color)] hover:border-[var(--neon-cyan)] bg-[var(--card-inner)] cursor-pointer select-none"
                      title={ws.visible !== false ? '點擊於前臺隱藏此研習' : '點擊於前臺顯示此研習'}
                    >
                      {ws.visible !== false ? (
                        <Eye className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <input
                        type="checkbox"
                        checked={ws.visible !== false}
                        disabled={isPreview}
                        onChange={(e) => handleWorkshopChange(idx, 'visible' as any, e.target.checked)}
                        className="sr-only"
                      />
                      <span>{ws.visible !== false ? (isEn ? 'Show' : '顯示') : (isEn ? 'Hidden' : '隱藏')}</span>
                    </label>

                    {/* 固定研習語意圖示展示 */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-mono border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] select-none opacity-85"
                      title={isEn ? 'Fixed Workshop Semantic Icon' : '固定研習語意圖示'}
                    >
                      {React.createElement(getLucideIconByName(ws.iconType || 'code'), {
                        className: 'w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0',
                      })}
                      <span className="truncate max-w-[80px]">
                        {ws.iconType || 'code'}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isPreview}
                      onClick={() => triggerDeleteWorkshopDialog(idx)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                      title={isEn ? 'Delete workshop' : '刪除此筆研習歷程'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 研習名稱、圖示與舉辦日期 */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Workshop Title' : '研習課程主題'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={ws.title}
                      onChange={(e) => handleWorkshopChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Icon' : '代表圖示'}
                    </label>
                    {(() => {
                      const defaultWsIcons = ['code', 'box', 'video', 'gamepad-2'];
                      const curIcon = ws.iconType || (defaultWsIcons[idx % defaultWsIcons.length] || 'code');
                      const WsIcon = getLucideIconByName(curIcon);
                      return (
                        <div
                          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 border cyber-cut-sm bg-[var(--card-inner)] text-[var(--text-main)] select-none opacity-80"
                          style={{ borderColor: borderCol }}
                        >
                          <WsIcon className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
                          <span className="text-[11px] font-mono truncate">{curIcon}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Date (Date Picker)' : '研習日期 (支援選擇器)'}
                    </label>
                    <CmsDatePicker
                      value={ws.date}
                      onChange={(val) => handleWorkshopChange(idx, 'date', val)}
                      disabled={isPreview}
                      placeholder="YYYY/M ~ YYYY/M"
                    />
                  </div>
                </div>

                {/* 主辦單位與雲端佐證連結 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Host Organization' : '主辦與協辦單位'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={ws.org}
                      onChange={(e) => handleWorkshopChange(idx, 'org', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div className="p-3 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        {isEn ? 'Proof Document Button' : '「檢視研習證明」按鈕'}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-mono">
                        <input
                          type="checkbox"
                          checked={ws.showProof !== false}
                          disabled={isPreview}
                          onChange={(e) => handleWorkshopChange(idx, 'showProof' as any, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--neon-cyan)] relative"></div>
                        <span className={ws.showProof !== false ? 'text-[var(--neon-cyan)]' : 'text-slate-500'}>
                          {ws.showProof !== false ? (isEn ? 'SHOW' : '顯示按鈕') : (isEn ? 'HIDE' : '關閉隱藏')}
                        </span>
                      </label>
                    </div>
                    <CmsUrlInput
                      label={isEn ? 'Proof Drive URL' : '研習證明雲端連結'}
                      value={formData.driveLinks?.[ws.driveLinkKey] || ''}
                      onChange={(val) => handleDriveLinkChange(ws.driveLinkKey, val)}
                      placeholder="https://drive.google.com/file/d/..."
                      disabled={isPreview || ws.showProof === false}
                      isEn={isEn}
                    />
                  </div>
                </div>

                {/* 學習技能多行文字輸入框 */}
                <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                      {isEn ? 'Key Skills & Learnings (One item per line, free formatting):' : '專業內容與技能學習條目 (每行一項，自由排版)：'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--neon-cyan)]">
                        {(ws.skills || []).length} {isEn ? 'lines' : '行'}
                      </span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                        style={{
                          backgroundColor: ((ws.skills || []).join('\n')).length > 500 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                          borderColor: ((ws.skills || []).join('\n')).length > 500 ? '#f87171' : 'var(--border-color)',
                          color: ((ws.skills || []).join('\n')).length > 500 ? '#f87171' : 'var(--text-sub)',
                        }}
                      >
                        {((ws.skills || []).join('\n')).length} / 500
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    disabled={isPreview}
                    value={(ws.skills || []).join('\n')}
                    onChange={(e) => {
                      handleWorkshopChange(idx, 'skills', e.target.value.split('\n'));
                    }}
                    placeholder={isEn ? 'Enter key skills or learning outcomes, one item per line...' : '請輸入專業內容與技能學習條目，每行一項，可自由調整換行與排版...'}
                    className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none resize-y font-['Noto_Sans_TC'] leading-relaxed"
                    style={{ borderColor: borderCol }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 子頁籤 4：學術論文與發表列表 ── */}
      {activeSubTab === 'theses' && (
        <div className="space-y-4">
          <div className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] flex items-center justify-between px-1">
            <span>{isEn ? 'Entries sorted chronologically by end date' : '論文項目依發表時間自動排序'}</span>
            <span className="text-[10px] font-mono">Total: {formData[lang]?.theses?.length || 0}</span>
          </div>

          {(formData[lang]?.theses || []).map((th, idx) => {
            return (
              <div
                key={idx}
                className="border cyber-cut-sm p-5 space-y-4 transition-all"
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
                  borderColor: isLight ? 'rgba(16,185,129,0.35)' : 'rgba(16,185,129,0.3)',
                }}
              >
                {/* 標題列排版 */}
                <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      #{idx + 1}
                    </span>
                    {th.visible === false && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border cyber-cut-sm text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 項目顯示/隱藏開關 */}
                    <label
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-bold font-mono border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 text-emerald-300 cursor-pointer select-none"
                      title={th.visible !== false ? '點擊於前臺隱藏此論文/期刊' : '點擊於前臺顯示此論文/期刊'}
                    >
                      {th.visible !== false ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <input
                        type="checkbox"
                        checked={th.visible !== false}
                        disabled={isPreview}
                        onChange={(e) => handleThesisChange(idx, 'visible' as any, e.target.checked)}
                        className="sr-only"
                      />
                      <span>{th.visible !== false ? (isEn ? 'Show' : '顯示') : (isEn ? 'Hidden' : '隱藏')}</span>
                    </label>

                    {/* 固定學術發表語意圖示展示 */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-[11px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-300 select-none opacity-85"
                      title={isEn ? 'Fixed Publication Semantic Icon' : '固定論文語意圖示'}
                    >
                      {React.createElement(getLucideIconByName(th.iconType || (idx === 0 ? 'file-text' : 'presentation')), {
                        className: 'w-3.5 h-3.5 text-emerald-400 shrink-0',
                      })}
                      <span className="font-bold">
                        {th.iconType || (idx === 0 ? 'file-text' : 'presentation')}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isPreview}
                      onClick={() => triggerDeleteThesisDialog(idx)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                      title={isEn ? 'Delete thesis' : '刪除此論文/期刊'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 論文題目與發表會議/期刊輸入框 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Thesis / Publication Title' : '論文或發表標題'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={th.title}
                      onChange={(e) => handleThesisChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Conference / Journal Venue' : '發表研討會 / 期刊單位'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={th.venue}
                      onChange={(e) => handleThesisChange(idx, 'venue', e.target.value)}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>
                </div>

                {/* 論文摘要與詳細描述 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)]">
                      {isEn ? 'Abstract & Core Contribution' : '研究架構與貢獻摘要'}
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    disabled={isPreview}
                    value={th.desc}
                    onChange={(e) => handleThesisChange(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none resize-y leading-relaxed font-['Noto_Sans_TC']"
                    style={{ borderColor: borderCol }}
                  />
                </div>

                {/* 獲獎榮譽與論文全文佐證連結 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                      {isEn ? 'Award / Recognition (Optional)' : '獲獎殊榮 (可選填)'}
                    </label>
                    <input
                      type="text"
                      disabled={isPreview}
                      value={th.award || ''}
                      onChange={(e) => handleThesisChange(idx, 'award', e.target.value)}
                      placeholder={isEn ? 'e.g. Best Paper Award' : '例如：大會最佳論文獎'}
                      className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none"
                      style={{ borderColor: borderCol }}
                    />
                  </div>

                  <div className="p-3 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        {isEn ? 'Paper Full-text Button' : '「檢視論文全文」按鈕'}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-mono">
                        <input
                          type="checkbox"
                          checked={th.showFullText !== false}
                          disabled={isPreview}
                          onChange={(e) => handleThesisChange(idx, 'showFullText' as any, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-400 relative"></div>
                        <span className={th.showFullText !== false ? 'text-emerald-400' : 'text-slate-500'}>
                          {th.showFullText !== false ? (isEn ? 'SHOW' : '顯示') : (isEn ? 'HIDE' : '隱藏')}
                        </span>
                      </label>
                    </div>
                    <CmsUrlInput
                      label={isEn ? 'Paper Full-text Link' : '論文全文雲端連結'}
                      value={(th.driveLinkKey && formData.driveLinks?.[th.driveLinkKey]) || ''}
                      onChange={(val) => th.driveLinkKey && handleDriveLinkChange(th.driveLinkKey, val)}
                      placeholder="https://drive.google.com/file/d/..."
                      disabled={isPreview || th.showFullText === false}
                      isEn={isEn}
                    />
                  </div>

                  <div className="p-3 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        {isEn ? 'Slides Presentation Button' : '「論文簡報」按鈕'}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-[10px] font-mono">
                        <input
                          type="checkbox"
                          checked={th.showPresentation !== false}
                          disabled={isPreview}
                          onChange={(e) => handleThesisChange(idx, 'showPresentation' as any, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-400 relative"></div>
                        <span className={th.showPresentation !== false ? 'text-emerald-400' : 'text-slate-500'}>
                          {th.showPresentation !== false ? (isEn ? 'SHOW' : '顯示') : (isEn ? 'HIDE' : '隱藏')}
                        </span>
                      </label>
                    </div>
                    <CmsUrlInput
                      label={isEn ? 'Slides Link' : '發表簡報雲端連結'}
                      value={(th.slidesDriveLinkKey && formData.driveLinks?.[th.slidesDriveLinkKey]) || ''}
                      onChange={(val) => {
                        const key = th.slidesDriveLinkKey || `thesisSlides_${idx}_${Date.now()}`;
                        if (!th.slidesDriveLinkKey) {
                          handleThesisChange(idx, 'slidesDriveLinkKey', key);
                        }
                        handleDriveLinkChange(key, val);
                      }}
                      placeholder="https://drive.google.com/file/d/..."
                      disabled={isPreview || th.showPresentation === false}
                      isEn={isEn}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CmsExperienceEditor;
