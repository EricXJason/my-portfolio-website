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
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import { SectionTitleEditor } from './SectionTitleEditor';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { CmsTagListEditor } from './CmsTagListEditor';
import { getLucideIconByName } from './CmsIconPickerModal';
import defaultSkillsData from '../../data/skills-section.json';
import { splitSkillTokens } from '../../utils/skillsHelper';

interface SkillItem {
  label: string;
  rowType: string;
  content: string;
}

interface SkillCategory {
  category: string;
  catTier: string;
  catColor?: string;
  catType: string;
  icon?: string;
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


/** Automatic CIS category dot color indicator */
const getCategoryDotColor = (catType: string, idx: number): string => {
  if (catType === 'game') return '#00f0ff';
  if (catType === 'fullstack') return '#a855f7';
  if (catType === 'media') return '#10b981';
  const palette = ['#00f0ff', '#a855f7', '#10b981', '#3b82f6'];
  return palette[idx % palette.length];
};

interface CmsSkillsEditorProps {
  isPreview?: boolean;
}

export const CmsSkillsEditor: React.FC<CmsSkillsEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<SkillsFullData>(() => {
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

  const [skillsMeta, setSkillsMeta] = useState<Record<'zh' | 'en', SkillsMeta>>(() => {
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
      // 解析失敗回退至預設值
    }
    return DEFAULT_SKILLS_META;
  });

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 技能項目拖曳狀態
  const itemDragRef = useRef<number | null>(null);
  const [itemDragging, setItemDragging] = useState<number | null>(null);
  const [itemDragOver, setItemDragOver] = useState<number | null>(null);

  // 技能分類拖曳狀態
  const catDragRef = useRef<number | null>(null);
  const [catDragging, setCatDragging] = useState<number | null>(null);
  const [catDragOver, setCatDragOver] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCategoryNameChange = (catIdx: number, value: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updatedCats = [...prev[lang]];
      updatedCats[catIdx] = { ...updatedCats[catIdx], category: value };
      return { ...prev, [lang]: updatedCats };
    });
  };


  // 新增技能分類（同時建立中英文版本）
  const handleAddCategory = () => {
    setIsDirty(true);
    const newCatZh: SkillCategory = {
      category: '新分類',
      catTier: 'secondary',
      catType: 'other',
      items: [{ label: '技能領域', rowType: 'tech', content: '' }],
    };
    const newCatEn: SkillCategory = {
      category: 'New Category',
      catTier: 'secondary',
      catType: 'other',
      items: [{ label: 'Skill Field', rowType: 'tech', content: '' }],
    };
    setFormData((prev) => ({
      zh: [...prev.zh, newCatZh],
      en: [...prev.en, newCatEn],
    }));
    setActiveCategoryIndex(formData[lang].length);
    showToast(isEn ? 'New category added!' : '已成功新增一個技能分類！');
  };


  const handleItemChange = (catIdx: number, itemIdx: number, field: 'label' | 'content', value: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updatedCats = [...prev[lang]];
      const updatedItems = [...updatedCats[catIdx].items];
      updatedItems[itemIdx] = { ...updatedItems[itemIdx], [field]: value };
      updatedCats[catIdx] = { ...updatedCats[catIdx], items: updatedItems };
      return { ...prev, [lang]: updatedCats };
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

  const handleMoveCategory = (fromIdx: number, toIdx: number) => {
    if (isPreview || fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (cats: SkillCategory[]) => {
        if (toIdx >= cats.length) return cats;
        const copy = [...cats];
        const [removed] = copy.splice(fromIdx, 1);
        copy.splice(toIdx, 0, removed);
        return copy;
      };
      return {
        zh: reorder(prev.zh),
        en: reorder(prev.en),
      };
    });
    setActiveCategoryIndex(toIdx);
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
  };

  // 技能分類拖曳事件處理函式（同時重排中英雙語分類順序）
  const handleCatDragStart = (e: React.DragEvent, idx: number) => {
    catDragRef.current = idx; setCatDragging(idx); e.dataTransfer.effectAllowed = 'move';
  };
  const handleCatDragEnd = () => { setCatDragging(null); setCatDragOver(null); catDragRef.current = null; };
  const handleCatDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); if (catDragRef.current !== idx) setCatDragOver(idx); };
  const handleCatDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const sourceIdx = catDragRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) { setCatDragging(null); setCatDragOver(null); catDragRef.current = null; return; }
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (arr: SkillCategory[]) => {
        const newArr = [...arr];
        const [removed] = newArr.splice(sourceIdx, 1);
        newArr.splice(targetIdx, 0, removed);
        return newArr;
      };
      return { zh: reorder(prev.zh), en: reorder(prev.en) };
    });
    setActiveCategoryIndex(targetIdx);
    setCatDragging(null); setCatDragOver(null); catDragRef.current = null;
  };

  /**
   * TODO: [後端端點對接] 儲存並更新專業技能分類與晶片標籤清單
   * 1. HTTP Method: PUT
   * 2. 預期端點: /api/v1/skills
   * 3. 請求載荷 (Request Body):
   *    - Header: Authorization: Bearer <JWT_ACCESS_TOKEN>
   *    - Body: { data: SkillCategoryData, meta: SkillsMeta }
   * 4. 預期回應:
   *    - 200 OK: { success: true, message: "技能資料更新成功" }
   *    - 401 Unauthorized: 憑證無效
   * 5. 當前狀態: 暫時採用本地持久化 (localStorage) 模擬更新，待後端 API 上線後切換為 apiClient.put()。
   */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn ? 'Are you sure you want to save the changes for the "Skills" module?' : '確定要儲存「專業技能」模組目前的修改內容嗎？',
      confirmText: isEn ? 'Confirm Save' : '確定存檔',
      onConfirm: () => {
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
        } catch { /* ignore */ }
        showToast(isEn ? '"Skills" module saved successfully!' : '「專業技能」模組資料已成功存檔！');
      },
    });
  };

  const triggerResetDialog = () => {
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn ? 'Are you sure you want to reset the "Skills" module to default?' : '確定要將「專業技能」模組還原為初始預設值嗎？',
      confirmText: isEn ? 'Reset This Module' : '確定還原此模組',
      onConfirm: () => {
        setIsDirty(false);
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
        } catch { /* ignore */ }
        setFormData(defaultSkillsData as SkillsFullData);
        setSkillsMeta(DEFAULT_SKILLS_META);
        setActiveCategoryIndex(0);
        showToast(isEn ? '"Skills" module restored to defaults!' : '「專業技能」模組已還原為初始預設資料！');
      },
    });
  };

  const categories = formData[lang] || [];
  const currentCategory = categories[activeCategoryIndex] || categories[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 border cyber-cut-sm bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs font-['Noto_Sans_TC'] shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" /><span>{toastMessage}</span>
        </div>
      )}

      {/* 二次確認模態對話框 (風格與語言選擇視窗統一) */}
      <CmsConfirmDialog
        dialog={dialog}
        onClose={() => setDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 頂部操作列 */}
      <div className="flex items-center justify-between p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
        <h1 className="text-2xl font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">{isEn ? 'Skills' : '專業技能'}</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={isPreview ? undefined : triggerResetDialog} disabled={isPreview}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'}`}>
            <RotateCcw className="w-3.5 h-3.5" /><span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
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

      {/* 分類標籤頁與新增按鈕 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-[var(--text-sub)]/60 font-['Share_Tech_Mono']">
            {isEn ? 'Drag tabs to reorder categories' : '拖曳分頁標籤可調整分類順序'}
          </p>
          {!isPreview && (
            <button type="button" onClick={handleAddCategory}
              className="flex items-center gap-1.5 px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 hover:bg-[var(--neon-cyan)]/10 transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>{isEn ? 'Add Category' : '新增分類'}</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCategoryIndex;
            const isDraggingThis = catDragging === idx;
            const isOverThis = catDragOver === idx;
            const dotColor = getCategoryDotColor(cat.catType, idx);
            return (
              <div
                key={idx}
                draggable={!isPreview}
                onDragStart={(e) => handleCatDragStart(e, idx)}
                onDragEnd={handleCatDragEnd}
                onDragOver={(e) => handleCatDragOver(e, idx)}
                onDragLeave={() => setCatDragOver(null)}
                onDrop={(e) => handleCatDrop(e, idx)}
                className={`relative transition-all duration-150 ${isDraggingThis ? 'opacity-40 scale-95' : ''} ${isOverThis ? 'ring-2 ring-[var(--neon-cyan)]/60' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`px-4 py-2.5 border cyber-cut-sm text-xs sm:text-sm font-['Noto_Sans_TC'] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--neon-cyan)]/15 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--text-sub)]/40'
                  }`}
                >
                  {!isPreview && <GripVertical className="w-3.5 h-3.5 opacity-40" />}
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block', flexShrink: 0 }} />
                  <span>{cat.category}</span>
                  <span className="text-[10px] font-mono opacity-70">({cat.items.length})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 當前選取技能類別編輯器 */}
      {currentCategory && (
        <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* 技能類別頂部標題列 */}
          <div className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--neon-cyan)]" />
                <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'Category Settings' : '分類設定'}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isPreview || activeCategoryIndex === 0}
                  onClick={() => handleMoveCategory(activeCategoryIndex, activeCategoryIndex - 1)}
                  className="px-2.5 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  title={isEn ? 'Move category earlier' : '向前移動分類'}
                >
                  <ArrowUp className="w-3 h-3 -rotate-90" />
                  <span className="hidden sm:inline">{isEn ? 'Move Earlier' : '前移分類'}</span>
                </button>
                <button
                  type="button"
                  disabled={isPreview || activeCategoryIndex === categories.length - 1}
                  onClick={() => handleMoveCategory(activeCategoryIndex, activeCategoryIndex + 1)}
                  className="px-2.5 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  title={isEn ? 'Move category later' : '向後移動分類'}
                >
                  <ArrowDown className="w-3 h-3 -rotate-90" />
                  <span className="hidden sm:inline">{isEn ? 'Move Later' : '後移分類'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 技能類別名稱輸入框 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">{isEn ? 'Category Name' : '分類名稱'}</label>
                <input type="text" value={currentCategory.category} onChange={(e) => handleCategoryNameChange(activeCategoryIndex, e.target.value)} disabled={isPreview}
                  className={`w-full px-3 py-2 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm font-bold text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`} />
              </div>

              {/* 技能類別向量圖示（固定規格） */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">{isEn ? 'Category Icon (Fixed)' : '分類代表圖示 (固定)'}</label>
                <div className="w-full px-3 py-2 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-xs text-[var(--text-main)] flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    {React.createElement(getLucideIconByName(currentCategory.icon || 'layers'), {
                      className: 'w-4 h-4 text-[var(--neon-cyan)] shrink-0',
                    })}
                    <span className="font-mono text-[11px] truncate">{currentCategory.icon || (isEn ? 'Default' : '預設圖示')}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-sub)]/60 font-mono shrink-0">
                    {isEn ? 'Fixed' : '固定圖示'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 所屬技能項目列表 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)] tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                {isEn ? 'Skill Items' : '技能項目清單'}
                <span className="font-mono opacity-70">({currentCategory.items.length})</span>
              </h3>
              {!isPreview && (
                <button type="button" onClick={() => handleAddItem(activeCategoryIndex)}
                  className="px-3 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold bg-[var(--card-inner)] hover:bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--neon-cyan)] text-[var(--neon-cyan)] transition-colors cursor-pointer flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />{isEn ? 'Add Item' : '新增項目'}
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
                      <label className="text-[11px] font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">{isEn ? 'Skill Field' : '技能領域'}</label>
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
