/**
 * ============================================================================
 * 檔案名稱: CmsSkillsEditor.tsx
 * 所屬模組: Portfolio CMS (專業技能管理模組)
 * 責任描述: 負責管理三大技能類別、技能項目清單、斜線標籤分割與即時前臺標籤預覽。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、CmsDirtyContext、SectionTitleEditor、skillsHelper 與 CmsConfirmDialog。
 * 邊界處理: 支援預覽模式唯讀鎖定、智慧保護括號內斜線、未儲存二次確認彈窗防護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Layers,
  Code2,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import { SectionTitleEditor } from './SectionTitleEditor';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { CmsTagListEditor } from './CmsTagListEditor';
import { getLucideIconByName } from './CmsIconPickerModal';
import { CmsVisibilityToggle } from './CmsVisibilityToggle';
import defaultSkillsData from '../../data/skills-section.json';
import { splitSkillTokens } from '../../utils/skillsHelper';

interface SkillItem {
  label: string;
  rowType: string;
  content: string;
  visible?: boolean;
}

interface SkillCategory {
  category: string;
  catTier: string;
  catColor?: string;
  catType: string;
  icon?: string;
  visible?: boolean;
  items: SkillItem[];
}

interface SkillsFullData {
  zh: SkillCategory[];
  en: SkillCategory[];
}

export interface SkillsMeta {
  skills_title: string;
  skills_intro: string;
}

const DEFAULT_SKILLS_META: Record<'zh' | 'en', SkillsMeta> = {
  zh: {
    skills_title: '專業技能',
    skills_intro: '涵蓋互動應用開發、全端網頁架構與多媒體美學設計三大領域，結合扎實的軟體工程實踐與跨領域整合能力。',
  },
  en: {
    skills_title: 'Skills',
    skills_intro: 'Covering interactive application dev, fullstack architecture, and multimedia design aesthetics.',
  },
};


/** Automatic CIS category dot color indicator — 青(185°)→藍(205°)→紫(270°)→赤珊瑚紅(340°) */
const getCategoryDotColor = (catType: string, idx: number): string => {
  if (catType === 'fullstack') return '#00f0ff'; // 青
  if (catType === 'game')      return '#38bdf8'; // 藍
  if (catType === 'common')    return '#c084fc'; // 紫
  if (catType === 'media')     return '#ff4d6d'; // 賽博赤珊瑚紅
  const palette = ['#00f0ff', '#38bdf8', '#c084fc', '#ff4d6d'];
  return palette[idx % palette.length];
};

interface CmsSkillsEditorProps {
  isPreview?: boolean;
}

export const CmsSkillsEditor: React.FC<CmsSkillsEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<SkillsFullData>(() => {
    if (data.skills) {
      return data.skills as unknown as SkillsFullData;
    }
    const defaults = defaultSkillsData as SkillsFullData;
    try {
      const saved = localStorage.getItem('portfolio_skills_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.zh || parsed.en)) {
          return {
            zh: parsed.zh || defaults.zh,
            en: parsed.en || defaults.en,
          };
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return defaults;
  });

  useEffect(() => {
    if (data.skills) {
      setFormData(data.skills as unknown as SkillsFullData);
    }
  }, [data.skills]);

  // 聆聽全域一鍵還原預設值事件
  useEffect(() => {
    const handleResetAll = () => {
      setFormData(defaultSkillsData as unknown as SkillsFullData);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 本地全域即時同步效應：開關或欄位變更時即時同步至本地 Context 與快照
  const isFirstSkillsSync = useRef(true);
  useEffect(() => {
    if (isFirstSkillsSync.current) {
      isFirstSkillsSync.current = false;
      return;
    }
    updateDocument('skills', formData, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_skills_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_skills_data_updated'));
    } catch {}
  }, [formData, updateDocument]);

  // 區塊標題與引言中繼資料（儲存於 portfolio_custom_translations）
  const [skillsMeta, setSkillsMeta] = useState<Record<'zh' | 'en', SkillsMeta>>(() => {
    if (data.site_translations) {
      const trans = data.site_translations as any;
      if (trans.zh?.skills_title || trans.en?.skills_title) {
        return {
          zh: {
            skills_title: trans.zh?.skills_title ?? DEFAULT_SKILLS_META.zh.skills_title,
            skills_intro: trans.zh?.skills_intro ?? DEFAULT_SKILLS_META.zh.skills_intro,
          },
          en: {
            skills_title: trans.en?.skills_title ?? DEFAULT_SKILLS_META.en.skills_title,
            skills_intro: trans.en?.skills_intro ?? DEFAULT_SKILLS_META.en.skills_intro,
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
            skills_title: parsed.zh?.skills_title ?? DEFAULT_SKILLS_META.zh.skills_title,
            skills_intro: parsed.zh?.skills_intro ?? DEFAULT_SKILLS_META.zh.skills_intro,
          },
          en: {
            skills_title: parsed.en?.skills_title ?? DEFAULT_SKILLS_META.en.skills_title,
            skills_intro: parsed.en?.skills_intro ?? DEFAULT_SKILLS_META.en.skills_intro,
          },
        };
      }
    } catch {
      // 忽略
    }
    return DEFAULT_SKILLS_META;
  });

  // 聆聽廣播存檔事件
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('skills', formData);
        } catch (e) {
          console.error('[CMS Skills] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 技能項目拖曳狀態
  const itemDragRef = useRef<number | null>(null);
  const [itemDragging, setItemDragging] = useState<number | null>(null);
  const [itemDragOver, setItemDragOver] = useState<number | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };

  const handleItemChange = (catIdx: number, itemIdx: number, field: 'label' | 'content' | 'visible', value: any) => {
    setIsDirty(true);
    if (field === 'visible') {
      showToast(value !== false ? (isEn ? 'Skill item visible on site!' : '已開啟該技能項目展示！') : (isEn ? 'Skill item hidden from site!' : '已從前臺隱藏該技能項目！'));
    }
    setFormData((prev) => {
      const updateCats = (cats: SkillCategory[], val: any) => {
        const copy = [...cats];
        if (copy[catIdx] && copy[catIdx].items[itemIdx]) {
          const itemsCopy = [...copy[catIdx].items];
          itemsCopy[itemIdx] = { ...itemsCopy[itemIdx], [field]: val };
          copy[catIdx] = { ...copy[catIdx], items: itemsCopy };
        }
        return copy;
      };

      // 跨語系同步：visible（顯示/隱藏）與 content（技能標籤）同步中英
      if (field === 'visible' || field === 'content') {
        return {
          zh: updateCats(prev.zh, value),
          en: updateCats(prev.en, value),
        };
      }

      // label 僅更新當前語系（標題可能有中英差異）
      return { ...prev, [lang]: updateCats(prev[lang], value) };
    });
  };

  const handleAddItem = (catIdx: number) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updatedCats = [...prev[lang]];
      const updatedItems = [...updatedCats[catIdx].items, { label: '', rowType: 'tech', content: '' }];
      updatedCats[catIdx] = { ...updatedCats[catIdx], items: updatedItems };
      return { ...prev, [lang]: updatedCats };
    });
    showToast(isEn ? 'New skill item added!' : '已成功新增一筆技能項目！');
  };

  const triggerDeleteItemDialog = (catIdx: number, itemIdx: number) => {
    const item = formData[lang]?.[catIdx]?.items?.[itemIdx];
    const name = item?.label || (isEn ? 'this skill item' : '此技能項目');
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Skill Item' : '確認刪除此技能項目',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete Item' : '確定刪除項目',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => {
          const updatedCats = [...prev[lang]];
          const updatedItems = updatedCats[catIdx].items.filter((_, i) => i !== itemIdx);
          updatedCats[catIdx] = { ...updatedCats[catIdx], items: updatedItems };
          return { ...prev, [lang]: updatedCats };
        });
        showToast(isEn ? 'Skill item deleted!' : '已刪除該筆技能項目！');
      },
    });
  };

  const handleMoveSkillItem = (catIdx: number, fromIdx: number, toIdx: number) => {
    if (isPreview || fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    setIsDirty(true);
    setFormData((prev) => {
      const updatedCats = [...prev[lang]];
      const newItems = [...updatedCats[catIdx].items];
      if (toIdx >= newItems.length) return prev;
      const [removed] = newItems.splice(fromIdx, 1);
      newItems.splice(toIdx, 0, removed);
      updatedCats[catIdx] = { ...updatedCats[catIdx], items: newItems };
      return { ...prev, [lang]: updatedCats };
    });
  };

  // 技能項目拖曳事件處理函式
  const handleItemDragStart = (e: React.DragEvent, idx: number) => {
    itemDragRef.current = idx; setItemDragging(idx); e.dataTransfer.effectAllowed = 'move';
  };
  const handleItemDragEnd = () => { setItemDragging(null); setItemDragOver(null); itemDragRef.current = null; };
  const handleItemDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); if (itemDragRef.current !== idx) setItemDragOver(idx); };
  const handleItemDrop = (e: React.DragEvent, targetIdx: number, catIdx: number) => {
    e.preventDefault();
    const sourceIdx = itemDragRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) { setItemDragging(null); setItemDragOver(null); itemDragRef.current = null; return; }
    setIsDirty(true);
    setFormData((prev) => {
      const updatedCats = [...prev[lang]];
      const newItems = [...updatedCats[catIdx].items];
      const [removed] = newItems.splice(sourceIdx, 1);
      newItems.splice(targetIdx, 0, removed);
      updatedCats[catIdx] = { ...updatedCats[catIdx], items: newItems };
      return { ...prev, [lang]: updatedCats };
    });
    setItemDragging(null); setItemDragOver(null); itemDragRef.current = null;
    showToast(isEn ? 'Skill order updated!' : '已更新技能排序順序！');
  };

  /**
   * [資料持久化] 儲存並更新專業技能分類與晶片標籤清單
   * 寫入本地快照並同步推送至 Firebase Firestore 雲端資料庫。
   */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn ? 'Are you sure you want to save the changes for the "Skills" module to cloud and local cache?' : '確定要儲存「專業技能」模組目前的修改內容至雲端資料庫嗎？',
      confirmText: isEn ? 'Confirm Save' : '確定存檔',
      onConfirm: async () => {
        setIsDirty(false);
        try {
          localStorage.setItem('portfolio_skills_data', JSON.stringify(formData));
          window.dispatchEvent(new Event('portfolio_skills_data_updated'));
          const existingCustom = localStorage.getItem('portfolio_custom_translations');
          const customObj = existingCustom ? JSON.parse(existingCustom) : { zh: {}, en: {} };
          customObj.zh = { ...(customObj.zh || {}), ...skillsMeta.zh };
          customObj.en = { ...(customObj.en || {}), ...skillsMeta.en };
          localStorage.setItem('portfolio_custom_translations', JSON.stringify(customObj));
          window.dispatchEvent(new Event('portfolio_translations_updated'));

          await updateDocument('skills', formData);
          await updateDocument('site_translations', {
            ...(data.site_translations as any || {}),
            zh: { ...(data.site_translations as any)?.zh, ...skillsMeta.zh },
            en: { ...(data.site_translations as any)?.en, ...skillsMeta.en },
          });

          showToast(isEn ? '"Skills" module saved to cloud successfully!' : '「專業技能」模組資料已成功存檔至雲端！');
        } catch {
          showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
        }
      },
    });
  };

  /** handleSetDefault — 將當前內容設為模組預設值基準 */
  const handleSetDefault = () => {
    try {
      localStorage.setItem('portfolio_skills_baseline', JSON.stringify(formData));
      showToast(isEn ? 'Current skills set as module default!' : '當前「專業技能」內容已設為預設值！');
    } catch {
      showToast(isEn ? 'Failed to set default' : '設定預設值失敗');
    }
  };

  const triggerResetDialog = () => {
    const baselineRaw = localStorage.getItem('portfolio_skills_baseline');
    const isBaseline = !!baselineRaw;
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? (isBaseline ? 'Reset this module to the pinned default state?' : 'Are you sure you want to reset the "Skills" module to default?')
        : (isBaseline ? '確定要將「專業技能」還原至設定的預設值嗎？' : '確定要將「專業技能」模組還原為初始預設值嗎？'),
      confirmText: isEn ? 'Reset This Module' : '確定還原此模組',
      onConfirm: async () => {
        setIsDirty(false);
        const resetData = baselineRaw ? (JSON.parse(baselineRaw) as SkillsFullData) : (defaultSkillsData as SkillsFullData);
        try {
          localStorage.removeItem('portfolio_skills_data');
          window.dispatchEvent(new Event('portfolio_skills_data_updated'));
          const existingCustom = localStorage.getItem('portfolio_custom_translations');
          if (existingCustom) {
            const customObj = JSON.parse(existingCustom);
            if (customObj.zh) { delete customObj.zh.skills_title; delete customObj.zh.skills_intro; }
            if (customObj.en) { delete customObj.en.skills_title; delete customObj.en.skills_intro; }
            localStorage.setItem('portfolio_custom_translations', JSON.stringify(customObj));
            window.dispatchEvent(new Event('portfolio_translations_updated'));
          }
          setFormData(resetData);
          setSkillsMeta(DEFAULT_SKILLS_META);
          setActiveCategoryIndex(0);
          await updateDocument('skills', resetData);
          showToast(isEn ? (isBaseline ? 'Restored to module defaults!' : '"Skills" module restored to defaults!') : (isBaseline ? '已還原至設定的預設值！' : '「專業技能」模組已還原為初始預設資料！'));
        } catch {
          showToast(isEn ? 'Restored locally' : '已重設本地資料');
        }
      },
    });
  };

  const categories = formData[lang] || [];
  const currentCategory = categories[activeCategoryIndex] || categories[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 - 嚴格方形直角科技風格，避開右下角 BackToTop 浮動按鈕 */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-24 right-6 sm:right-8 z-[10000] flex items-center gap-2.5 px-4 py-2.5 border cyber-cut-sm rounded-none bg-[var(--card-bg)]/95 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.35)] font-['Noto_Sans_TC'] text-xs sm:text-sm backdrop-blur-xl animate-fade-in pointer-events-none">
          <Check className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
          <span className="tracking-wide font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 二次確認模態對話框 (風格與語言選擇視窗統一) */}
      <CmsConfirmDialog
        dialog={dialog}
        onClose={() => setDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 頂部操作列 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] whitespace-nowrap">{isEn ? 'Skills' : '專業技能'}</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button type="button" onClick={isPreview ? undefined : triggerResetDialog} disabled={isPreview}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'}`}>
            <RotateCcw className="w-3.5 h-3.5" /><span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>
          <button type="button" onClick={isPreview ? undefined : handleSetDefault} disabled={isPreview}
            title={isEn ? 'Pin current skills as module default' : '將當前專業技能內容設為預設值'}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 cursor-pointer'}`}>
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /><span>{isEn ? 'Set as Default' : '設為預設值'}</span>
          </button>
          <button type="button" onClick={isPreview ? undefined : triggerSaveDialog} disabled={isPreview}
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'}`}>
            <Save className="w-4 h-4" /><span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* 區塊標題編輯器 (嚴格依語系隔離) */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'Skills' : '專業技能'}
        zhValue={skillsMeta.zh.skills_title}
        enValue={skillsMeta.en.skills_title}
        onZhChange={(v) => { setIsDirty(true); setSkillsMeta((p) => ({ ...p, zh: { ...p.zh, skills_title: v } })); }}
        onEnChange={(v) => { setIsDirty(true); setSkillsMeta((p) => ({ ...p, en: { ...p.en, skills_title: v } })); }}
        zhSubtitleValue={skillsMeta.zh.skills_intro}
        enSubtitleValue={skillsMeta.en.skills_intro}
        onZhSubtitleChange={(v) => { setIsDirty(true); setSkillsMeta((p) => ({ ...p, zh: { ...p.zh, skills_intro: v } })); }}
        onEnSubtitleChange={(v) => { setIsDirty(true); setSkillsMeta((p) => ({ ...p, en: { ...p.en, skills_intro: v } })); }}
        isPreview={isPreview}
      />

      {/* 4 大主專業技能固定分類標籤頁 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-[var(--text-sub)]/80 font-['Share_Tech_Mono']">
            {isEn ? '4 Core Skill Categories (Fixed Structure & Order)' : '4 大主專業技能分類 · 固定架構與順序'}
          </p>
          <span className="text-[11px] font-mono px-2 py-0.5 border cyber-cut-sm bg-cyan-500/10 text-[var(--neon-cyan)] border-cyan-500/30">
            {isEn ? 'CUSTOMIZABLE CATEGORIES' : '4 大主專業分類 · 可自由命名'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            const dotColor = getCategoryDotColor(cat.catType, idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-4 py-2.5 border cyber-cut-sm text-xs sm:text-sm font-['Noto_Sans_TC'] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--neon-cyan)]/15 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--text-sub)]/40'
                }`}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block', flexShrink: 0 }} />
                <span>{cat.category}</span>
                <span className="text-[10px] font-mono opacity-70">({cat.items.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 當前選取主技能類別與子項目編輯區 */}
      {currentCategory && (
        <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* 主分類鎖定資訊列 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 border cyber-cut-sm flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${getCategoryDotColor(currentCategory.catType, activeCategoryIndex)}20`,
                  borderColor: `${getCategoryDotColor(currentCategory.catType, activeCategoryIndex)}50`,
                  color: getCategoryDotColor(currentCategory.catType, activeCategoryIndex),
                }}
              >
                {React.createElement(getLucideIconByName(currentCategory.icon || 'layers'), {
                  className: 'w-5 h-5',
                })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <label className="text-xs font-mono text-[var(--neon-cyan)] font-bold shrink-0">
                    {isEn ? 'Category Name:' : '主分類名稱:'}
                  </label>
                  <input
                    type="text"
                    disabled={isPreview}
                    value={currentCategory.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIsDirty(true);
                      setFormData((prev) => {
                        const langList = [...(prev[lang] || [])];
                        if (langList[activeCategoryIndex]) {
                          langList[activeCategoryIndex] = {
                            ...langList[activeCategoryIndex],
                            category: val,
                          };
                        }
                        return { ...prev, [lang]: langList };
                      });
                    }}
                    className="px-3 py-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-main)] font-['Noto_Sans_TC'] font-bold text-base focus:border-[var(--neon-cyan)] focus:outline-none transition-colors w-full max-w-sm"
                    placeholder={isEn ? 'Enter category name' : '輸入分類名稱'}
                  />
                  <span className="text-[10px] font-mono px-2 py-0.5 border cyber-cut-sm bg-slate-800 text-slate-300 border-slate-700 w-fit shrink-0">
                    {currentCategory.catTier === 'primary' ? (isEn ? 'CORE TIER' : '核心領域') : (isEn ? 'SUPPORTING TIER' : '輔助領域')}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-sub)]/70 font-['Noto_Sans_TC'] mt-1">
                  {isEn
                    ? 'Custom category name supported. Manage subcategories and tags below.'
                    : '支援自訂主分類名稱；請於下方管理子分類領域、技術標籤與開關狀態。'}
                </p>
              </div>
            </div>
          </div>

          {/* 所屬技能項目列表 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)] tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                {isEn ? 'Skill Items' : '技能項目清單'}
              </h3>
              {!isPreview && (
                <button
                  type="button"
                  onClick={() => handleAddItem(activeCategoryIndex)}
                  className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] hover:bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--neon-cyan)] text-[var(--neon-cyan)] transition-colors cursor-pointer flex items-center justify-center"
                  title={isEn ? 'Add Item' : '新增項目'}
                  aria-label={isEn ? 'Add Item' : '新增項目'}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-[10px] text-[var(--text-sub)]/50 font-['Share_Tech_Mono']">
              {isEn ? 'Drag the grip to reorder items.' : '拖曳左側握把可調整技能項目順序。'}
            </p>

            <div className="space-y-3">
              {currentCategory.items.map((item, itemIdx) => {
                const isDraggingThis = itemDragging === itemIdx;
                const isOverThis = itemDragOver === itemIdx;
                return (
                  <div
                    key={itemIdx}
                    draggable={!isPreview}
                    onDragStart={(e) => handleItemDragStart(e, itemIdx)}
                    onDragEnd={handleItemDragEnd}
                    onDragOver={(e) => handleItemDragOver(e, itemIdx)}
                    onDragLeave={() => setItemDragOver(null)}
                    onDrop={(e) => handleItemDrop(e, itemIdx, activeCategoryIndex)}
                    className={`p-4 border cyber-cut-sm bg-[var(--card-inner)] grid grid-cols-1 md:grid-cols-12 gap-3 items-start transition-all duration-150 ${isDraggingThis ? 'opacity-40 scale-95' : ''} ${isOverThis ? 'ring-2 ring-[var(--neon-cyan)]/40 border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5' : 'border-[var(--border-color)]'}`}
                  >
                    {/* 拖曳抓取手把 */}
                    {!isPreview && (
                      <div className="md:col-span-1 flex items-center justify-center pt-6 opacity-40 hover:opacity-80 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-[var(--text-sub)]" />
                      </div>
                    )}

                    {/* 技能細項名稱輸入框 */}
                    <div className={`space-y-1 ${isPreview ? 'md:col-span-3' : 'md:col-span-3'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                            {isEn ? 'Skill Field' : '技能領域'}
                          </label>
                          {item.visible === false && (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 border cyber-cut-sm text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                              <EyeOff className="w-2.5 h-2.5" />
                              <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                            </span>
                          )}
                        </div>
                        <CmsVisibilityToggle
                          checked={item.visible !== false}
                          onChange={(val) => handleItemChange(activeCategoryIndex, itemIdx, 'visible' as any, val)}
                          disabled={isPreview}
                          size="sm"
                        />
                      </div>
                      <input type="text" value={item.label} disabled={isPreview} onChange={(e) => handleItemChange(activeCategoryIndex, itemIdx, 'label', e.target.value)}
                        className={`w-full px-3 py-2 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`} />
                    </div>

                    {/* 包含可拖曳標籤晶片之技術內容編輯區 */}
                    <div className={`space-y-1.5 ${isPreview ? 'md:col-span-9' : 'md:col-span-7'}`}>
                      <CmsTagListEditor
                        label={isEn ? 'Tech Stack & Tools' : '技術工具標籤清單'}
                        tags={splitSkillTokens(item.content)}
                        onChange={(tags) => handleItemChange(activeCategoryIndex, itemIdx, 'content', tags.join(' / '))}
                        disabled={isPreview}
                        placeholder={isEn ? 'Add tech tool...' : '新增技術工具...'}
                      />
                    </div>

                    {/* 操作動作：上移、下移與刪除項目按鈕組 */}
                    {!isPreview && (
                      <div className="md:col-span-1 flex items-center justify-end md:justify-center gap-1 pt-5">
                        <button
                          type="button"
                          disabled={itemIdx === 0}
                          onClick={() => handleMoveSkillItem(activeCategoryIndex, itemIdx, itemIdx - 1)}
                          className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title={isEn ? 'Move Up' : '往前調整順位'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={itemIdx === currentCategory.items.length - 1}
                          onClick={() => handleMoveSkillItem(activeCategoryIndex, itemIdx, itemIdx + 1)}
                          className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title={isEn ? 'Move Down' : '往後調整順位'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerDeleteItemDialog(activeCategoryIndex, itemIdx)}
                          className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 cursor-pointer transition-colors"
                          title={isEn ? 'Delete item' : '刪除此項目'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
