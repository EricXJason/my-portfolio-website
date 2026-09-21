/**
 * ============================================================================
 * 檔案名稱: CmsCertificationsEditor.tsx
 * 所屬模組: Portfolio CMS (專業證照管理模組)
 * 責任描述: 負責管理多益能力證明、各類證照群組分類、證照項目增刪與拖曳排序。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、CmsDirtyContext、SectionTitleEditor 與 CmsConfirmDialog。
 * 邊界處理: 限制分類不可全數刪除、多益分數格式保護、雙語資料隔離與二次確認彈窗防護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Award,
  FolderLock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Pencil,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import defaultCertsData from '../../data/certifications-section.json';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { SectionTitleEditor } from './SectionTitleEditor';
import { CmsVisibilityToggle } from './CmsVisibilityToggle';
import { CmsUrlInput } from './CmsUrlInput';

interface CertItem {
  name: string;
  org: string;
  linkKey: string;
  visible?: boolean;
}

interface CertGroup {
  group: string;
  iconType: string;
  visible?: boolean;
  items: CertItem[];
}

interface CertificationsFullData {
  toeic: { score: string; driveUrl: string; visible?: boolean };
  driveFolderUrl: string;
  driveLinks: Record<string, string>;
  zh: CertGroup[];
  en: CertGroup[];
}

export interface AwardsMeta {
  awards_title: string;
  awards_intro: string;
}

const DEFAULT_AWARDS_META: Record<'zh' | 'en', AwardsMeta> = {
  zh: {
    awards_title: '專業證照',
    awards_intro: '具備國家級技術士技能檢定與多項多媒體、3D 建模及 Office 原廠國際專業認證。',
  },
  en: {
    awards_title: 'Credentials',
    awards_intro: 'Holding national technician licenses and international professional software certifications.',
  },
};

interface CmsCertificationsEditorProps {
  isPreview?: boolean;
}

export const CmsCertificationsEditor: React.FC<CmsCertificationsEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<CertificationsFullData>(() => {
    if (data.certifications) {
      return data.certifications as unknown as CertificationsFullData;
    }
    const defaults = defaultCertsData as CertificationsFullData;
    try {
      const saved = localStorage.getItem('portfolio_certifications_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...defaults,
            ...parsed,
          };
        }
      }
    } catch { /* fallback */ }
    return defaults;
  });

  useEffect(() => {
    if (data.certifications) {
      setFormData(data.certifications as unknown as CertificationsFullData);
    }
  }, [data.certifications]);

  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('certifications', formData);
        } catch (e) {
          console.error('[CMS Certifications] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  // 聆聽全域一鍵還原預設值事件
  useEffect(() => {
    const handleResetAll = () => {
      setFormData(defaultCertsData as unknown as CertificationsFullData);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 本地全域即時同步效應：開關或欄位變更時即時同步至本地 Context 與快照，前臺立即反應
  const isFirstCertsSync = useRef(true);
  useEffect(() => {
    if (isFirstCertsSync.current) {
      isFirstCertsSync.current = false;
      return;
    }
    updateDocument('certifications', formData, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_certifications_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_certifications_data_updated'));
    } catch {}
  }, [formData, updateDocument]);

  const [awardsMeta, setAwardsMeta] = useState<Record<'zh' | 'en', AwardsMeta>>(() => {
    if (data.site_translations) {
      const trans = data.site_translations as any;
      if (trans.zh?.awards_title || trans.en?.awards_title) {
        return {
          zh: {
            awards_title: trans.zh?.awards_title ?? DEFAULT_AWARDS_META.zh.awards_title,
            awards_intro: trans.zh?.awards_intro ?? DEFAULT_AWARDS_META.zh.awards_intro,
          },
          en: {
            awards_title: trans.en?.awards_title ?? DEFAULT_AWARDS_META.en.awards_title,
            awards_intro: trans.en?.awards_intro ?? DEFAULT_AWARDS_META.en.awards_intro,
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
            awards_title: parsed.zh?.awards_title ?? DEFAULT_AWARDS_META.zh.awards_title,
            awards_intro: parsed.zh?.awards_intro ?? DEFAULT_AWARDS_META.zh.awards_intro,
          },
          en: {
            awards_title: parsed.en?.awards_title ?? DEFAULT_AWARDS_META.en.awards_title,
            awards_intro: parsed.en?.awards_intro ?? DEFAULT_AWARDS_META.en.awards_intro,
          },
        };
      }
    } catch { /* 讀取失敗回退至預設值 */ }
    return DEFAULT_AWARDS_META;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 群組重新排序拖曳狀態
  const [draggingGroupIdx, setDraggingGroupIdx] = useState<number | null>(null);
  const [dragOverGroupIdx, setDragOverGroupIdx] = useState<number | null>(null);
  // 群組內項目重新排序拖曳狀態
  const [draggingItem, setDraggingItem] = useState<{ groupIdx: number; itemIdx: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ groupIdx: number; itemIdx: number } | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };

  /* ── Meta ── */
  const handleMetaChange = (field: keyof AwardsMeta, value: string, targetLang?: 'zh' | 'en') => {
    setIsDirty(true);
    const l = targetLang || lang;
    setAwardsMeta((prev) => ({ ...prev, [l]: { ...prev[l], [field]: value } }));
  };

  /* ── TOEIC / Drive folder ── */
  const handleToeicChange = (field: 'score' | 'driveUrl', value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, toeic: { ...prev.toeic, [field]: value } }));
  };
  const handleDriveFolderChange = (value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, driveFolderUrl: value }));
  };

  /* ── Group name (strictly separated by current language) ── */
  const handleGroupNameChange = (groupIdx: number, newName: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = [...prev[lang]];
      updated[groupIdx] = { ...updated[groupIdx], group: newName };
      return { ...prev, [lang]: updated };
    });
  };



  /* ── Cert item field change ── */
  const handleCertItemChange = (
    groupIdx: number,
    itemIdx: number,
    field: 'name' | 'org',
    value: string
  ) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updatedGroups = [...prev[lang]];
      const updatedItems = [...updatedGroups[groupIdx].items];
      updatedItems[itemIdx] = { ...updatedItems[itemIdx], [field]: value };
      updatedGroups[groupIdx] = { ...updatedGroups[groupIdx], items: updatedItems };
      return { ...prev, [lang]: updatedGroups };
    });
  };

  const handleCertLinkChange = (linkKey: string, url: string) => {
    if (!linkKey) return;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      driveLinks: { ...prev.driveLinks, [linkKey]: url },
    }));
  };

  /* ── Add cert ── */
  const handleAddCertItem = (groupIdx: number) => {
    setIsDirty(true);
    const newKey = `cert_${Date.now()}`;
    setFormData((prev) => {
      const updatedZh = [...prev.zh];
      const updatedEn = [...prev.en];
      updatedZh[groupIdx] = { ...updatedZh[groupIdx], items: [...updatedZh[groupIdx].items, { name: '新專業證照', org: '發證機關', linkKey: newKey }] };
      updatedEn[groupIdx] = { ...updatedEn[groupIdx], items: [...updatedEn[groupIdx].items, { name: 'New Certification', org: 'Issuing Org', linkKey: newKey }] };
      return { ...prev, zh: updatedZh, en: updatedEn, driveLinks: { ...prev.driveLinks, [newKey]: '' } };
    });
    showToast(isEn ? 'New certification added!' : '已新增一筆證照！');
  };

  /* ── Add group ── */
  const handleAddGroup = () => {
    setIsDirty(true);
    const newGroup: CertGroup = { group: isEn ? 'New Category' : '新分類', iconType: 'award', items: [] };
    setFormData((prev) => ({
      ...prev,
      zh: [...prev.zh, { ...newGroup, group: '新證照分類' }],
      en: [...prev.en, { ...newGroup, group: 'New Category' }],
    }));
    showToast(isEn ? 'New category added!' : '已新增分類！');
  };

  /* ── Delete cert (with dialog) ── */
  const confirmDeleteCert = (groupIdx: number, itemIdx: number) => {
    const item = (formData[lang][groupIdx]?.items[itemIdx]);
    const name = item?.name ?? '';
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Delete Certification' : '刪除證照',
      message: isEn
        ? `Are you sure you want to delete "${name}"? This cannot be undone.`
        : `確定要刪除「${name}」？此操作無法復原。`,
      confirmText: isEn ? 'Delete' : '確定刪除',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => {
          const updatedZh = [...prev.zh];
          const updatedEn = [...prev.en];
          const linkKey = updatedZh[groupIdx]?.items[itemIdx]?.linkKey;
          updatedZh[groupIdx] = { ...updatedZh[groupIdx], items: updatedZh[groupIdx].items.filter((_, i) => i !== itemIdx) };
          updatedEn[groupIdx] = { ...updatedEn[groupIdx], items: updatedEn[groupIdx].items.filter((_, i) => i !== itemIdx) };
          const updatedLinks = { ...prev.driveLinks };
          if (linkKey) delete updatedLinks[linkKey];
          return { ...prev, zh: updatedZh, en: updatedEn, driveLinks: updatedLinks };
        });
        showToast(isEn ? 'Certification removed!' : '已刪除此證照！');
      },
    });
  };

  /* ── Delete group (with dialog) ── */
  const confirmDeleteGroup = (groupIdx: number) => {
    const name = (formData[lang][groupIdx]?.group) ?? '';
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Delete Category' : '刪除分類',
      message: isEn
        ? `Delete category "${name}" and all its certifications? This cannot be undone.`
        : `確定要刪除分類「${name}」及其所有證照？此操作無法復原。`,
      confirmText: isEn ? 'Delete Category' : '確定刪除分類',
      onConfirm: () => {
        setIsDirty(true);
        setFormData((prev) => ({
          ...prev,
          zh: prev.zh.filter((_, i) => i !== groupIdx),
          en: prev.en.filter((_, i) => i !== groupIdx),
        }));
        showToast(isEn ? 'Category removed!' : '已刪除此分類！');
      },
    });
  };

  /* ── Item move up/down within group ── */
  const moveItemUp = (groupIdx: number, itemIdx: number) => {
    if (itemIdx <= 0) return;
    setIsDirty(true);
    setFormData((prev) => {
      const swap = (arr: CertGroup[]) => {
        const g = [...arr];
        const items = [...g[groupIdx].items];
        [items[itemIdx - 1], items[itemIdx]] = [items[itemIdx], items[itemIdx - 1]];
        g[groupIdx] = { ...g[groupIdx], items };
        return g;
      };
      return { ...prev, zh: swap(prev.zh), en: swap(prev.en) };
    });
  };
  const moveItemDown = (groupIdx: number, itemIdx: number) => {
    const total = formData[lang][groupIdx]?.items.length ?? 0;
    if (itemIdx >= total - 1) return;
    setIsDirty(true);
    setFormData((prev) => {
      const swap = (arr: CertGroup[]) => {
        const g = [...arr];
        const items = [...g[groupIdx].items];
        [items[itemIdx], items[itemIdx + 1]] = [items[itemIdx + 1], items[itemIdx]];
        g[groupIdx] = { ...g[groupIdx], items };
        return g;
      };
      return { ...prev, zh: swap(prev.zh), en: swap(prev.en) };
    });
  };

  /* ── Group move up/down ── */
  const moveGroupUp = (groupIdx: number) => {
    if (groupIdx <= 0) return;
    setIsDirty(true);
    setFormData((prev) => {
      const swapArr = (arr: CertGroup[]) => {
        const g = [...arr];
        [g[groupIdx - 1], g[groupIdx]] = [g[groupIdx], g[groupIdx - 1]];
        return g;
      };
      return { ...prev, zh: swapArr(prev.zh), en: swapArr(prev.en) };
    });
  };
  const moveGroupDown = (groupIdx: number) => {
    const total = formData[lang].length;
    if (groupIdx >= total - 1) return;
    setIsDirty(true);
    setFormData((prev) => {
      const swapArr = (arr: CertGroup[]) => {
        const g = [...arr];
        [g[groupIdx], g[groupIdx + 1]] = [g[groupIdx + 1], g[groupIdx]];
        return g;
      };
      return { ...prev, zh: swapArr(prev.zh), en: swapArr(prev.en) };
    });
  };

  /* ── Drag: group ── */
  const handleGroupDragStart = (idx: number) => setDraggingGroupIdx(idx);
  const handleGroupDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverGroupIdx(idx);
  };
  const handleGroupDrop = (targetIdx: number) => {
    if (draggingGroupIdx === null || draggingGroupIdx === targetIdx) {
      setDraggingGroupIdx(null); setDragOverGroupIdx(null); return;
    }
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (arr: CertGroup[]) => {
        const g = [...arr];
        const [moved] = g.splice(draggingGroupIdx, 1);
        g.splice(targetIdx, 0, moved);
        return g;
      };
      return { ...prev, zh: reorder(prev.zh), en: reorder(prev.en) };
    });
    setDraggingGroupIdx(null); setDragOverGroupIdx(null);
    showToast(isEn ? 'Category order updated!' : '已更新證照分類排序！');
  };

  /* ── Drag: item ── */
  const handleItemDragStart = (groupIdx: number, itemIdx: number) => setDraggingItem({ groupIdx, itemIdx });
  const handleItemDragOver = (e: React.DragEvent, groupIdx: number, itemIdx: number) => {
    e.preventDefault();
    setDragOverItem({ groupIdx, itemIdx });
  };
  const handleItemDrop = (targetGroupIdx: number, targetItemIdx: number) => {
    if (!draggingItem) { setDragOverItem(null); return; }
    const { groupIdx: srcGroup, itemIdx: srcItem } = draggingItem;
    if (srcGroup === targetGroupIdx && srcItem === targetItemIdx) { setDraggingItem(null); setDragOverItem(null); return; }
    if (srcGroup !== targetGroupIdx) { setDraggingItem(null); setDragOverItem(null); return; } // cross-group not supported
    setIsDirty(true);
    setFormData((prev) => {
      const reorder = (arr: CertGroup[]) => {
        const g = [...arr];
        const items = [...g[srcGroup].items];
        const [moved] = items.splice(srcItem, 1);
        items.splice(targetItemIdx, 0, moved);
        g[srcGroup] = { ...g[srcGroup], items };
        return g;
      };
      return { ...prev, zh: reorder(prev.zh), en: reorder(prev.en) };
    });
    setDraggingItem(null); setDragOverItem(null);
    showToast(isEn ? 'Certification order updated!' : '已更新證照項目排序！');
  };

  /* ── Save / Reset dialogs ── */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Save all changes to the "Certifications" module?'
        : '確定要儲存「專業證照」模組目前的修改內容嗎？',
      confirmText: isEn ? 'Save' : '確定存檔',
      onConfirm: doSave,
    });
  };

  /** handleSetDefault — 將當前證照資料設為預設值基準 */
  const handleSetDefault = () => {
    try {
      localStorage.setItem('portfolio_certifications_baseline', JSON.stringify(formData));
      showToast(isEn ? 'Current certifications set as module default!' : '當前「專業證照」內容已設為預設值！');
    } catch {
      showToast(isEn ? 'Failed to set default' : '設定預設值失敗');
    }
  };

  const triggerResetDialog = () => {
    const baselineRaw = localStorage.getItem('portfolio_certifications_baseline');
    const isBaseline = !!baselineRaw;
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Restore Defaults' : '確認還原此模組預設',
      message: isEn
        ? (isBaseline ? 'Reset the "Certifications" module to the pinned default state?' : 'Reset the "Certifications" module to its original defaults? Other modules are not affected.')
        : (isBaseline ? '確定要將「專業證照」還原至設定的預設值嗎？' : '確定要將「專業證照」模組還原為初始預設值嗎？此操作不會影響其他模組。'),
      confirmText: isEn ? 'Restore' : '確定還原預設',
      onConfirm: doReset,
    });
  };

  /**
   * [資料持久化] 儲存並更新國際證照與獲獎榮譽清單
   * 同步更新至本地快照與 Firebase Firestore 雲端資料庫。
   */
  const doSave = async () => {
    setIsDirty(false);
    try {
      localStorage.setItem('portfolio_certifications_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_certifications_data_updated'));
      const saved = localStorage.getItem('portfolio_custom_translations');
      const translations = saved ? JSON.parse(saved) : { zh: {}, en: {} };
      translations.zh = { ...(translations.zh || {}), ...awardsMeta.zh };
      translations.en = { ...(translations.en || {}), ...awardsMeta.en };
      localStorage.setItem('portfolio_custom_translations', JSON.stringify(translations));
      window.dispatchEvent(new Event('portfolio_translations_updated'));

      await updateDocument('certifications', formData);
      await updateDocument('site_translations', {
        ...(data.site_translations as any || {}),
        zh: { ...(data.site_translations as any)?.zh, ...awardsMeta.zh },
        en: { ...(data.site_translations as any)?.en, ...awardsMeta.en },
      });

      showToast(isEn ? '"Certifications" module saved to cloud successfully!' : '「專業證照」模組已成功存檔至雲端！');
    } catch {
      showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
    }
  };

  const doReset = async () => {
    setIsDirty(false);
    const baselineRaw = localStorage.getItem('portfolio_certifications_baseline');
    const isBaseline = !!baselineRaw;
    const resetData = baselineRaw ? (JSON.parse(baselineRaw) as CertificationsFullData) : (defaultCertsData as CertificationsFullData);
    try {
      localStorage.removeItem('portfolio_certifications_data');
      window.dispatchEvent(new Event('portfolio_certifications_data_updated'));
      const saved = localStorage.getItem('portfolio_custom_translations');
      if (saved) {
        const t = JSON.parse(saved);
        ['awards_title', 'awards_intro'].forEach((k) => { delete t?.zh?.[k]; delete t?.en?.[k]; });
        localStorage.setItem('portfolio_custom_translations', JSON.stringify(t));
        window.dispatchEvent(new Event('portfolio_translations_updated'));
      }
      setFormData(resetData);
      setAwardsMeta(DEFAULT_AWARDS_META);
      await updateDocument('certifications', resetData);
      showToast(isEn ? (isBaseline ? 'Restored to module defaults!' : '"Certifications" restored to defaults!') : (isBaseline ? '已還原至設定的預設值！' : '「專業證照」模組已還原為預設！'));
    } catch {
      showToast(isEn ? 'Restored locally' : '已重設本地資料');
    }
  };

  const currentGroups = formData[lang] || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 - 嚴格方形直角科技風格，避開右下角 BackToTop 浮動按鈕 */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-24 right-6 sm:right-8 z-[10000] flex items-center gap-2.5 px-4 py-2.5 border cyber-cut-sm rounded-none bg-[var(--card-bg)]/95 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.35)] font-['Noto_Sans_TC'] text-xs sm:text-sm backdrop-blur-xl animate-fade-in pointer-events-none">
          <Check className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
          <span className="tracking-wide font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 操作確認對話框 */}
      <CmsConfirmDialog dialog={dialog} onClose={() => setDialog(EMPTY_DIALOG)} isEn={isEn} />

      {/* 頂部操作列 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-black font-['Orbitron',sans-serif] tracking-wide text-[var(--text-main)] whitespace-nowrap">
          {isEn ? 'Certifications & Awards' : '專業證照'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={isPreview ? undefined : triggerResetDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : (isEn ? 'Restore defaults for this module only' : '僅還原此模組預設值')}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>
          <button
            type="button"
            onClick={isPreview ? undefined : handleSetDefault}
            disabled={isPreview}
            title={isEn ? 'Pin current certifications as module default' : '將當前專業證照內容設為預設值'}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 cursor-pointer'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Set as Default' : '設為預設值'}</span>
          </button>
          <button
            type="button"
            onClick={isPreview ? undefined : triggerSaveDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : undefined}
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* 第零分區：區塊主標題設定 */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'Certifications' : '專業證照'}
        zhValue={awardsMeta.zh.awards_title}
        enValue={awardsMeta.en.awards_title}
        onZhChange={(val: string) => handleMetaChange('awards_title', val, 'zh')}
        onEnChange={(val: string) => handleMetaChange('awards_title', val, 'en')}
        zhSubtitleValue={awardsMeta.zh.awards_intro}
        enSubtitleValue={awardsMeta.en.awards_intro}
        onZhSubtitleChange={(val: string) => handleMetaChange('awards_intro', val, 'zh')}
        onEnSubtitleChange={(val: string) => handleMetaChange('awards_intro', val, 'en')}
        isPreview={isPreview}
      />

      {/* 第一分區：語言檢定與雲端資料夾 */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-[var(--neon-cyan)]" />
            <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'Language Score & Cloud Storage' : '語言檢定與雲端證照庫'}
            </h2>
          </div>
          <CmsVisibilityToggle
            checked={formData.toeic.visible !== false}
            onChange={(val) => {
              setIsDirty(true);
              setFormData((prev) => ({
                ...prev,
                toeic: { ...prev.toeic, visible: val },
              }));
              showToast(val ? (isEn ? 'TOEIC card visible on site!' : '已開啟多益成績卡片展示！') : (isEn ? 'TOEIC card hidden from site!' : '已從前臺隱藏多益成績卡片！'));
            }}
            disabled={isPreview}
            size="sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'TOEIC Score Title' : '多益英文成績'}
            </label>
            <input
              type="text"
              value={formData.toeic.score}
              onChange={(e) => handleToeicChange('score', e.target.value)}
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-bold font-['Noto_Sans_TC']"
            />
          </div>
          <div className="space-y-1.5">
            <CmsUrlInput
              label={isEn ? 'Score Certificate Drive URL' : '多益成績證明雲端連結'}
              value={formData.toeic.driveUrl}
              onChange={(val) => handleToeicChange('driveUrl', val)}
              placeholder="https://drive.google.com/file/d/..."
              disabled={isPreview}
              isEn={isEn}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <CmsUrlInput
              label={isEn ? 'All Certifications Cloud Folder URL' : '全證照雲端資料夾公開連結'}
              value={formData.driveFolderUrl}
              onChange={(val) => handleDriveFolderChange(val)}
              placeholder="https://drive.google.com/drive/folders/..."
              disabled={isPreview}
              isEn={isEn}
            />
          </div>
        </div>
      </div>

      {/* 第二分區：證照類別（可拖曳排序） */}
      <div className="space-y-4">
        {/* 類別頂部標題列 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'Certification Categories' : '證照分類管理'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddGroup}
            className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] hover:bg-[var(--card-bg)] border-[var(--border-color)] hover:border-amber-400 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? 'Add Category' : '新增分類'}
            aria-label={isEn ? 'Add Category' : '新增分類'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {currentGroups.map((group, groupIdx) => {
          const canGroupUp = groupIdx > 0;
          const canGroupDown = groupIdx < currentGroups.length - 1;
          const isDragTarget = dragOverGroupIdx === groupIdx && draggingGroupIdx !== groupIdx;

          return (
            <div
              key={groupIdx}
              draggable
              onDragStart={() => handleGroupDragStart(groupIdx)}
              onDragOver={(e) => handleGroupDragOver(e, groupIdx)}
              onDrop={() => handleGroupDrop(groupIdx)}
              onDragEnd={() => { setDraggingGroupIdx(null); setDragOverGroupIdx(null); }}
              className={`border cyber-cut-sm bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-4 transition-all duration-150 ${
                draggingGroupIdx === groupIdx ? 'opacity-40' : ''
              } ${isDragTarget ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-[var(--border-color)]'}`}
            >
              {/* 群組頂部標題列 */}
              <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-color)] pb-3 gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  {/* 拖曳控制手把 */}
                  <span
                    className="cursor-grab active:cursor-grabbing text-[var(--text-sub)] hover:text-amber-400 shrink-0 transition-colors"
                    title={isEn ? 'Drag to reorder' : '拖曳排序'}
                  >
                    <GripVertical className="w-4 h-4" />
                  </span>

                  {/* 向上/向下排序箭頭按鈕組 */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveGroupUp(groupIdx)}
                      disabled={!canGroupUp}
                      title={isEn ? 'Move Up' : '上移'}
                      className={`p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] transition-colors ${canGroupUp ? 'text-[var(--text-sub)] hover:text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/10 cursor-pointer' : 'opacity-20 cursor-not-allowed text-[var(--text-sub)]'}`}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGroupDown(groupIdx)}
                      disabled={!canGroupDown}
                      title={isEn ? 'Move Down' : '下移'}
                      className={`p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] transition-colors ${canGroupDown ? 'text-[var(--text-sub)] hover:text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/10 cursor-pointer' : 'opacity-20 cursor-not-allowed text-[var(--text-sub)]'}`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 可編輯之分類群組名稱 */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Pencil className="w-3 h-3 text-[var(--text-sub)] shrink-0" />
                    <input
                      type="text"
                      value={group.group}
                      onChange={(e) => handleGroupNameChange(groupIdx, e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border cyber-cut-sm bg-transparent border-transparent hover:border-[var(--border-color)] focus:border-amber-400 focus:bg-[var(--card-inner)] text-sm font-bold text-[var(--text-main)] focus:outline-none font-['Noto_Sans_TC'] transition-all"
                      title={isEn ? 'Edit category name' : '編輯分類名稱'}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAddCertItem(groupIdx)}
                    className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] hover:bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--neon-cyan)] text-[var(--neon-cyan)] flex items-center justify-center transition-colors cursor-pointer"
                    title={isEn ? 'Add Cert' : '新增證照'}
                    aria-label={isEn ? 'Add Cert' : '新增證照'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  {currentGroups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => confirmDeleteGroup(groupIdx)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/10 cursor-pointer transition-colors"
                      title={isEn ? 'Delete category' : '刪除此分類'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 證照項目網格列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item, itemIdx) => {
                  const driveLink = formData.driveLinks[item.linkKey] || '';
                  const canItemUp = itemIdx > 0;
                  const canItemDown = itemIdx < group.items.length - 1;
                  const isItemDragTarget =
                    dragOverItem?.groupIdx === groupIdx &&
                    dragOverItem?.itemIdx === itemIdx &&
                    draggingItem?.groupIdx === groupIdx &&
                    draggingItem?.itemIdx !== itemIdx;

                  return (
                    <div
                      key={itemIdx}
                      draggable
                      onDragStart={() => handleItemDragStart(groupIdx, itemIdx)}
                      onDragOver={(e) => handleItemDragOver(e, groupIdx, itemIdx)}
                      onDrop={() => handleItemDrop(groupIdx, itemIdx)}
                      onDragEnd={() => { setDraggingItem(null); setDragOverItem(null); }}
                      className={`p-4 border cyber-cut-sm bg-[var(--card-inner)] space-y-3 transition-all duration-100 ${
                        draggingItem?.groupIdx === groupIdx && draggingItem?.itemIdx === itemIdx ? 'opacity-40' : ''
                      } ${isItemDragTarget ? 'border-[var(--neon-cyan)] shadow-[0_0_12px_rgba(0,240,255,0.25)]' : 'border-[var(--border-color)]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="cursor-grab active:cursor-grabbing text-[var(--text-sub)] hover:text-[var(--neon-cyan)] transition-colors"
                            title={isEn ? 'Drag to reorder' : '拖曳排序'}
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => moveItemUp(groupIdx, itemIdx)}
                              disabled={!canItemUp}
                              title={isEn ? 'Move Up' : '上移'}
                              className={`p-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] transition-colors ${canItemUp ? 'text-[var(--text-sub)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 cursor-pointer' : 'opacity-20 cursor-not-allowed text-[var(--text-sub)]'}`}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItemDown(groupIdx, itemIdx)}
                              disabled={!canItemDown}
                              title={isEn ? 'Move Down' : '下移'}
                              className={`p-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] transition-colors ${canItemDown ? 'text-[var(--text-sub)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 cursor-pointer' : 'opacity-20 cursor-not-allowed text-[var(--text-sub)]'}`}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[var(--neon-cyan)]">
                            #{itemIdx + 1}
                          </span>
                          {item.visible === false && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 border cyber-cut-sm text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                              <EyeOff className="w-2.5 h-2.5" />
                              <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CmsVisibilityToggle
                            checked={item.visible !== false}
                            onChange={(checked) => {
                              setIsDirty(true);
                              setFormData((prev) => {
                                const groups = [...(prev[lang] || [])];
                                const items = [...groups[groupIdx].items];
                                items[itemIdx] = { ...items[itemIdx], visible: checked };
                                groups[groupIdx] = { ...groups[groupIdx], items };
                                return { ...prev, [lang]: groups };
                              });
                              showToast(checked ? (isEn ? 'Certification visible on site!' : '已開啟此證照前臺展示！') : (isEn ? 'Certification hidden from site!' : '已從前臺隱藏此證照！'));
                            }}
                            disabled={isPreview}
                            size="sm"
                          />

                          <button
                            type="button"
                            onClick={() => confirmDeleteCert(groupIdx, itemIdx)}
                            className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/50 hover:bg-rose-500/10 cursor-pointer transition-colors"
                            title={isEn ? 'Delete certification' : '刪除此證照'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                          {isEn ? 'Certification Name' : '證照名稱'}
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleCertItemChange(groupIdx, itemIdx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC']"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                          {isEn ? 'Issuing Authority' : '發證機構'}
                        </label>
                        <input
                          type="text"
                          value={item.org}
                          onChange={(e) => handleCertItemChange(groupIdx, itemIdx, 'org', e.target.value)}
                          className="w-full px-3 py-1.5 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-xs text-[var(--text-sub)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC']"
                        />
                      </div>

                      <CmsUrlInput
                        label={isEn ? 'Certificate Drive URL' : '證照證明雲端連結'}
                        value={driveLink}
                        onChange={(val) => handleCertLinkChange(item.linkKey, val)}
                        placeholder="https://drive.google.com/file/d/..."
                        disabled={isPreview}
                        isEn={isEn}
                      />
                    </div>
                  );
                })}

                {group.items.length === 0 && (
                  <div className="md:col-span-2 py-8 text-center text-[var(--text-sub)] text-sm font-['Noto_Sans_TC'] border border-dashed border-[var(--border-color)] cyber-cut-sm">
                    {isEn ? 'No certifications yet. Click "+" above to add one.' : '尚無證照。點擊上方「+」按鈕來新增。'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
