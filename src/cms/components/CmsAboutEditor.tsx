/**
 * ============================================================================
 * 檔案名稱: CmsAboutEditor.tsx
 * 所屬模組: Portfolio CMS (關於我管理模組)
 * 責任描述: 負責管理關於我模組之自介引言、主標題、內文段落與固定 3 張核心亮點卡片之編輯與拖曳排序。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、CmsDirtyContext、SectionTitleEditor、CmsIconPickerModal 與 CmsConfirmDialog。
 * 邊界處理: 固定 3 張亮點卡片不可任意增刪、卡片色彩依前臺槽位嚴格鎖定、未儲存狀態保護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  User,
  Sparkles,
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
import { usePortfolioData } from '../../context/PortfolioDataContext';
import defaultAboutData from '../../data/about-section.json';

interface StatItem {
  id: string;
  title: string;
  label: string;
  icon: string;
}

interface AboutLangData {
  title: string;
  intro: string;
  heading: string;
  p1: string;
  stats: StatItem[];
}

interface AboutFullData {
  zh: AboutLangData;
  en: AboutLangData;
}

interface CmsAboutEditorProps {
  isPreview?: boolean;
}

export const CmsAboutEditor: React.FC<CmsAboutEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<AboutFullData>(() => {
    if (data.about) {
      return data.about as unknown as AboutFullData;
    }
    const defaults = defaultAboutData as unknown as AboutFullData;
    try {
      const saved = localStorage.getItem('portfolio_about_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.zh || parsed.en)) {
          return {
            ...defaults,
            ...parsed,
          };
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return defaults;
  });

  useEffect(() => {
    if (data.about) {
      setFormData(data.about as unknown as AboutFullData);
    }
  }, [data.about]);

  // 區塊標題中繼資料（儲存於 portfolio_custom_translations）
  const [aboutMeta, setAboutMeta] = useState<{ zhTitle: string; enTitle: string }>(() => {
    if (data.site_translations) {
      const trans = data.site_translations as any;
      if (trans.zh?.about_section_title || trans.en?.about_section_title) {
        return {
          zhTitle: trans.zh?.about_section_title ?? '關於我',
          enTitle: trans.en?.about_section_title ?? 'About',
        };
      }
    }
    try {
      const saved = localStorage.getItem('portfolio_custom_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          zhTitle: parsed.zh?.about_section_title ?? '關於我',
          enTitle: parsed.en?.about_section_title ?? 'About',
        };
      }
    } catch {
      // 解析失敗回退至預設標題
    }
    return { zhTitle: '關於我', enTitle: 'About' };
  });

  // 聆聽廣播存檔事件
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('about', formData);
        } catch (e) {
          console.error('[CMS About] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 數據統計指標拖曳狀態
  const statDragRef = useRef<number | null>(null);
  const [statDragging, setStatDragging] = useState<number | null>(null);
  const [statDragOver, setStatDragOver] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (field: keyof AboutLangData, value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleStatChange = (
    index: number,
    field: 'title' | 'label' | 'icon' | 'id',
    value: string
  ) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updatedStats = [...prev[lang].stats];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      return { ...prev, [lang]: { ...prev[lang], stats: updatedStats } };
    });
  };

  // 數據統計指標拖放事件處理函式
  const handleStatDragStart = (e: React.DragEvent, idx: number) => {
    statDragRef.current = idx;
    setStatDragging(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleStatDragEnd = () => {
    setStatDragging(null);
    setStatDragOver(null);
    statDragRef.current = null;
  };
  const handleStatDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (statDragRef.current !== idx) setStatDragOver(idx);
  };
  const handleStatDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const sourceIdx = statDragRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) {
      setStatDragging(null); setStatDragOver(null); statDragRef.current = null;
      return;
    }
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (arr: StatItem[]) => {
        const newArr = [...arr];
        const [removed] = newArr.splice(sourceIdx, 1);
        newArr.splice(targetIdx, 0, removed);
        return newArr;
      };
      return {
        zh: { ...prev.zh, stats: reorder(prev.zh.stats) },
        en: { ...prev.en, stats: reorder(prev.en.stats) },
      };
    });
    setStatDragging(null); setStatDragOver(null); statDragRef.current = null;
  };

  const handleMoveStat = (fromIdx: number, toIdx: number) => {
    if (isPreview || fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (arr: StatItem[]) => {
        if (toIdx >= arr.length) return arr;
        const newArr = [...arr];
        const [removed] = newArr.splice(fromIdx, 1);
        newArr.splice(toIdx, 0, removed);
        return newArr;
      };
      return {
        zh: { ...prev.zh, stats: reorder(prev.zh.stats) },
        en: { ...prev.en, stats: reorder(prev.en.stats) },
      };
    });
  };

  /**
   * TODO: [後端端點對接] 儲存並同步更新「關於我」模組簡介與統計數據
   * 1. HTTP Method: PUT
   * 2. 預期端點: /api/v1/about
   * 3. 請求載荷 (Request Body):
   *    - Header: Authorization: Bearer <JWT_ACCESS_TOKEN>
   *    - Body: { data: AboutFullData, meta: { zhTitle: string, enTitle: string } }
   * 4. 預期回應:
   *    - 200 OK: { success: true, message: "關於我模組更新成功" }
   *    - 401 Unauthorized: 管理者憑證失效
   * 5. 當前狀態: 暫時採用本地持久化 (localStorage) 模擬更新，待後端 API 上線後切換為 apiClient.put()。
   */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "About" module to cloud and local cache?'
        : '確定要將「關於我」模組目前的修改內容儲存至雲端資料庫嗎？',
      confirmText: isEn ? 'Confirm Save' : '確定存檔',
      onConfirm: async () => {
        setIsDirty(false);
        try {
          localStorage.setItem('portfolio_about_data', JSON.stringify(formData));
          const existing = (() => {
            try { return JSON.parse(localStorage.getItem('portfolio_custom_translations') || '{}'); }
            catch { return {}; }
          })();
          existing.zh = { ...existing.zh, about_section_title: aboutMeta.zhTitle };
          existing.en = { ...existing.en, about_section_title: aboutMeta.enTitle };
          localStorage.setItem('portfolio_custom_translations', JSON.stringify(existing));
          window.dispatchEvent(new Event('portfolio_about_data_updated'));
          window.dispatchEvent(new Event('portfolio_translations_updated'));

          await updateDocument('about', formData);
          await updateDocument('site_translations', {
            ...(data.site_translations as any || {}),
            zh: { ...(data.site_translations as any)?.zh, about_section_title: aboutMeta.zhTitle },
            en: { ...(data.site_translations as any)?.en, about_section_title: aboutMeta.enTitle },
          });

          showToast(isEn ? '"About" module saved to cloud successfully!' : '「關於我」模組資料已成功存檔至雲端！');
        } catch {
          showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
        }
      },
    });
  };

  const triggerResetDialog = () => {
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? 'Are you sure you want to reset the "About" module to default?'
        : '確定要將「關於我」模組還原為初始預設值嗎？此操作僅會重置關於我模組的內容，不會影響其他模組。',
      confirmText: isEn ? 'Reset This Module' : '確定還原此模組',
      onConfirm: async () => {
        setIsDirty(false);
        const resetData = defaultAboutData as unknown as AboutFullData;
        try {
          localStorage.removeItem('portfolio_about_data');
          window.dispatchEvent(new Event('portfolio_about_data_updated'));
          setFormData(resetData);
          setAboutMeta({ zhTitle: '關於我', enTitle: 'About' });
          await updateDocument('about', resetData);
          showToast(isEn ? '"About" module restored to defaults!' : '「關於我」模組已還原為初始預設資料！');
        } catch {
          showToast(isEn ? 'Restored locally' : '已重設本地資料');
        }
      },
    });
  };

  const currentContent = formData[lang];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 border cyber-cut-sm bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs font-['Noto_Sans_TC'] shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
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
        <h1 className="text-2xl font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
          {isEn ? 'About' : '關於我'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isPreview ? undefined : triggerResetDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : (isEn ? 'Restore defaults for this module only' : '僅還原此模組預設值')}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>
          <button
            type="button"
            onClick={isPreview ? undefined : triggerSaveDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : undefined}
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'}`}
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* 區塊標題編輯器 (嚴格依語系隔離) */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'About' : '關於我'}
        zhValue={formData.zh.title}
        enValue={formData.en.title}
        onZhChange={(v) => {
          setIsDirty(true);
          setFormData((p) => ({ ...p, zh: { ...p.zh, title: v } }));
          setAboutMeta((p) => ({ ...p, zhTitle: v }));
        }}
        onEnChange={(v) => {
          setIsDirty(true);
          setFormData((p) => ({ ...p, en: { ...p.en, title: v } }));
          setAboutMeta((p) => ({ ...p, enTitle: v }));
        }}
        zhSubtitleValue={formData.zh.intro}
        enSubtitleValue={formData.en.intro}
        onZhSubtitleChange={(v) => {
          setIsDirty(true);
          setFormData((p) => ({ ...p, zh: { ...p.zh, intro: v } }));
        }}
        onEnSubtitleChange={(v) => {
          setIsDirty(true);
          setFormData((p) => ({ ...p, en: { ...p.en, intro: v } }));
        }}
        isPreview={isPreview}
      />

      {/* 第一分區：個人自介設定 */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <User className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'Profile Overview' : '個人自介設定'}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'Bio Heading' : '個人自介主標題'}
              </label>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                style={{
                  backgroundColor: (currentContent.heading || '').length > 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                  borderColor: (currentContent.heading || '').length > 60 ? '#f87171' : 'var(--border-color)',
                  color: (currentContent.heading || '').length > 60 ? '#f87171' : 'var(--text-sub)',
                }}
              >
                {(currentContent.heading || '').length} / 60
              </span>
            </div>
            <input
              type="text"
              value={currentContent.heading}
              onChange={(e) => handleFieldChange('heading', e.target.value)}
              disabled={isPreview}
              className={`w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-cyan)] transition-all font-['Noto_Sans_TC'] ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'Bio Paragraph' : '自介內文'}
              </label>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                style={{
                  backgroundColor: (currentContent.p1 || '').length > 300 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                  borderColor: (currentContent.p1 || '').length > 300 ? '#f87171' : 'var(--border-color)',
                  color: (currentContent.p1 || '').length > 300 ? '#f87171' : 'var(--text-sub)',
                }}
              >
                {(currentContent.p1 || '').length} / 300
              </span>
            </div>
            <textarea
              rows={4}
              value={currentContent.p1}
              onChange={(e) => handleFieldChange('p1', e.target.value)}
              disabled={isPreview}
              className={`w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-cyan)] transition-all font-['Noto_Sans_TC'] leading-relaxed resize-y ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* 第二分區：核心亮點卡片（完整增刪改查與拖曳排序） */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'Core Highlights' : '核心亮點卡片'}
            </h2>
            <span className="text-xs text-[var(--text-sub)] font-['Share_Tech_Mono'] ml-1">
              ({currentContent.stats.length})
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 border cyber-cut-sm text-[var(--neon-cyan)] bg-[var(--card-inner)]" style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}>
            {isEn ? 'FIXED 3 CARDS' : '固定 3 張亮點卡'}
          </span>
        </div>

        <p className="text-xs text-[var(--text-sub)]/60 font-['Share_Tech_Mono']">
          {isEn ? 'Drag grip handle to reorder the 3 highlight cards.' : '拖曳左側握把可調整 3 張核心亮點卡片的前臺顯示順序。'}
        </p>

        {/* 固定三張數據卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentContent.stats.slice(0, 3).map((stat, idx) => {
            const isDraggingThis = statDragging === idx;
            const isOverThis = statDragOver === idx;

            return (
              <div
                key={stat.id || idx}
                draggable={!isPreview}
                onDragStart={(e) => handleStatDragStart(e, idx)}
                onDragEnd={handleStatDragEnd}
                onDragOver={(e) => handleStatDragOver(e, idx)}
                onDragLeave={() => setStatDragOver(null)}
                onDrop={(e) => handleStatDrop(e, idx)}
                className={`relative p-4 border cyber-cut-sm bg-[var(--card-inner)] space-y-3.5 transition-all duration-150 ${
                  isDraggingThis ? 'opacity-40 scale-95' : ''
                } ${isOverThis ? 'ring-2 ring-[var(--neon-cyan)]/50 border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5' : 'border-[var(--border-color)]'}`}
              >
                {/* 卡片頂部標題 */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2">
                  <div className="flex items-center gap-2">
                    {!isPreview && (
                      <span
                        className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80 transition-opacity"
                        title={isEn ? 'Drag to reorder' : '拖曳排序'}
                      >
                        <GripVertical className="w-4 h-4 text-[var(--text-sub)]" />
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold px-2 py-0.5 border cyber-cut-sm bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30">
                      #{idx + 1} {isEn ? 'Highlight' : '核心亮點'}
                    </span>
                  </div>

                  {/* 向上/向下移動排序按鈕組 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isPreview || idx === 0}
                      onClick={() => handleMoveStat(idx, idx - 1)}
                      className="p-1 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={isEn ? 'Move Up' : '向上移動'}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={isPreview || idx === currentContent.stats.length - 1}
                      onClick={() => handleMoveStat(idx, idx + 1)}
                      className="p-1 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={isEn ? 'Move Down' : '向下移動'}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 標題 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                    {isEn ? 'Highlight Title' : '亮點名稱'}
                  </label>
                  <input
                    type="text"
                    value={stat.title}
                    onChange={(e) => handleStatChange(idx, 'title', e.target.value)}
                    disabled={isPreview}
                    className={`w-full px-3 py-2 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-sm font-bold text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* 欄位標籤 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                    {isEn ? 'Highlight Description' : '亮點說明'}
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    disabled={isPreview}
                    className={`w-full px-3 py-2 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-xs text-[var(--text-sub)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] ${isPreview ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
