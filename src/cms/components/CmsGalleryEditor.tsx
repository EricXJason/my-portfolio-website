/**
 * ============================================================================
 * 檔案名稱: CmsGalleryEditor.tsx
 * 所屬模組: Portfolio CMS (美術畫廊管理模組)
 * 責任描述: 負責管理美術畫廊之 3D 模型、2D 繪畫、精選作品順位 (上限 10 件) 與分類過濾。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、CmsDirtyContext、SectionTitleEditor 與 CmsConfirmDialog。
 * 邊界處理: 所有作品皆支援封面圖片上傳以供輪盤展示，3D 物件支援選填 3D 檢視器嵌入連結；精選作品上限 10 件並支援順位微調互換。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  GripVertical,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import defaultGalleryData from '../../data/gallery-section.json';
import { SectionTitleEditor } from './SectionTitleEditor';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsUrlInput } from './CmsUrlInput';
import { CmsVisibilityToggle } from './CmsVisibilityToggle';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export interface GalleryItem {
  id: string;
  cat: string;
  img?: string;
  embedUrl?: string;
  featured?: boolean;
  featuredOrder?: number;
  visible?: boolean;
}

export interface GalleryMeta {
  gallery_title: string;
  gallery_note: string;
}

const DEFAULT_GALLERY_META: Record<'zh' | 'en', GalleryMeta> = {
  zh: {
    gallery_title: '美術畫廊',
    gallery_note: '展示個人 3D 場景建模、3D 精細物件、2D 麥克筆設計與素描作品，點擊圖片即可放大預覽。',
  },
  en: {
    gallery_title: 'Art Gallery',
    gallery_note: 'Showcasing personal 3D environments, 3D props, 2D marker designs, and detailed sketches.',
  },
};

const MAX_FEATURED = 10;

interface CmsGalleryEditorProps {
  isPreview?: boolean;
}

/**
 * CmsGalleryEditor
 * 美術畫廊管理編輯器：
 * 1. 所有作品（含 3D 場景與 3D 物件）：均支援封面圖片上傳與選擇，以供前臺 3D 輪盤與列表預覽。
 * 2. 3D 物件（3d-prop, 3d-scene）：支援互動 3D 嵌入連結，點開燈箱彈窗後即時展示 3D 互動模型。
 * 3. 精選作品管理：最多標記 10 件精選作品，支援順位下拉互換與微調。
 * 4. 支援全方位分類篩選、新增、刪除與拖曳排序。
 */
export const CmsGalleryEditor: React.FC<CmsGalleryEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (data.gallery && Array.isArray(data.gallery)) {
      return data.gallery as GalleryItem[];
    }
    const defaults = defaultGalleryData as GalleryItem[];
    try {
      const saved = localStorage.getItem('portfolio_gallery_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 檢查本地暫存是否具備有效的精選作品標記，若為舊暫存（精選數為 0）則強制繼承前臺 defaults 的精選設定
          const hasSavedFeatured = parsed.some((p: GalleryItem) => !!p.featured);
          return defaults.map((defaultItem) => {
            const savedItem = parsed.find((p: GalleryItem) => p.id === defaultItem.id);
            if (!savedItem) return defaultItem;
            return {
              ...defaultItem,
              ...savedItem,
              featured: hasSavedFeatured ? (savedItem.featured ?? defaultItem.featured ?? false) : (defaultItem.featured ?? false),
              featuredOrder: hasSavedFeatured ? (savedItem.featuredOrder ?? defaultItem.featuredOrder) : defaultItem.featuredOrder,
            };
          });
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return defaults;
  });

  useEffect(() => {
    if (data.gallery && Array.isArray(data.gallery)) {
      setItems(data.gallery as GalleryItem[]);
    }
  }, [data.gallery]);

  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('gallery', items);
        } catch (e) {
          console.error('[CMS Gallery] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [items, isPreview, updateDocument]);

  // 聆聽全域一鍵還原預設值事件
  useEffect(() => {
    const handleResetAll = () => {
      setItems(defaultGalleryData as GalleryItem[]);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 本地全域即時同步效應：開關或項目變更時即時同步至本地 Context 與快照，前臺立即反應
  const isFirstGallerySync = useRef(true);
  useEffect(() => {
    if (isFirstGallerySync.current) {
      isFirstGallerySync.current = false;
      return;
    }
    updateDocument('gallery', items, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_gallery_data', JSON.stringify(items));
      window.dispatchEvent(new Event('portfolio_gallery_data_updated'));
    } catch {}
  }, [items, updateDocument]);

  const [galleryMeta, setGalleryMeta] = useState<Record<'zh' | 'en', GalleryMeta>>(() => {
    if (data.site_translations) {
      const trans = data.site_translations as any;
      if (trans.zh?.gallery_title || trans.en?.gallery_title) {
        return {
          zh: {
            gallery_title: trans.zh?.gallery_title ?? DEFAULT_GALLERY_META.zh.gallery_title,
            gallery_note: trans.zh?.gallery_note ?? DEFAULT_GALLERY_META.zh.gallery_note,
          },
          en: {
            gallery_title: trans.en?.gallery_title ?? DEFAULT_GALLERY_META.en.gallery_title,
            gallery_note: trans.en?.gallery_note ?? DEFAULT_GALLERY_META.en.gallery_note,
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
            gallery_title: parsed.zh?.gallery_title ?? DEFAULT_GALLERY_META.zh.gallery_title,
            gallery_note: parsed.zh?.gallery_note ?? DEFAULT_GALLERY_META.zh.gallery_note,
          },
          en: {
            gallery_title: parsed.en?.gallery_title ?? DEFAULT_GALLERY_META.en.gallery_title,
            gallery_note: parsed.en?.gallery_note ?? DEFAULT_GALLERY_META.en.gallery_note,
          },
        };
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return DEFAULT_GALLERY_META;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 拖曳狀態管理
  const dragSourceIdxRef = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };

  const featuredCount = items.filter((it) => it.featured).length;

  const handleItemChange = (index: number, field: keyof GalleryItem, value: any) => {
    setIsDirty(true);
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCategoryChange = (index: number, newCat: string) => {
    setIsDirty(true);
    const isNew3D = newCat === '3d-prop' || newCat === '3d-scene';
    setItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], cat: newCat };
      if (isNew3D) {
        // 3D 物件只能有 3D 連結，清除/不使用自訂圖片
        target.img = target.img || '/assets/gallery/3d-prop/01.webp';
      } else {
        // 非 3D 物件嚴格移除 3D 連結
        target.embedUrl = undefined;
      }
      updated[index] = target;
      return updated;
    });
  };

  // ── 精選作品切換 (最多 10 個) ──────────────────────────────────────────
  const handleToggleFeatured = (index: number, checked: boolean) => {
    setIsDirty(true);
    const targetItem = items[index];
    if (checked) {
      if (featuredCount >= MAX_FEATURED && !targetItem.featured) {
        showToast(
          isEn
            ? `Maximum of ${MAX_FEATURED} featured artworks allowed. Uncheck another artwork first.`
            : `精選作品最多僅能設定 ${MAX_FEATURED} 件，請先取消其他作品的精選標記。`
        );
        return;
      }
      // 自動指派最小可用順位 (1..10)
      const usedOrders = items
        .filter((it) => it.featured && it.id !== targetItem.id && it.featuredOrder != null)
        .map((it) => it.featuredOrder as number);
      let nextOrder = 1;
      for (let i = 1; i <= MAX_FEATURED; i++) {
        if (!usedOrders.includes(i)) {
          nextOrder = i;
          break;
        }
      }
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          featured: true,
          featuredOrder: nextOrder,
        };
        return updated;
      });
      showToast(isEn ? `Artwork set as Featured #${nextOrder}!` : `已設定為精選作品第 ${nextOrder} 順位！`);
    } else {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          featured: false,
          featuredOrder: undefined,
        };
        return updated;
      });
      showToast(isEn ? 'Removed from featured artworks.' : '已取消精選作品標記。');
    }
  };

  // ── 精選作品順位互換 ──────────────────────────────────────────────────────
  const handleFeaturedOrderChange = (index: number, newOrder: number) => {
    setIsDirty(true);
    const targetItem = items[index];
    const oldOrder = targetItem.featuredOrder ?? 1;
    setItems((prev) => {
      return prev.map((it) => {
        if (it.id === targetItem.id) {
          return { ...it, featuredOrder: newOrder };
        }
        if (it.featured && it.featuredOrder === newOrder) {
          return { ...it, featuredOrder: oldOrder };
        }
        return it;
      });
    });
    showToast(isEn ? `Featured order updated to #${newOrder}!` : `精選順序已更新為第 ${newOrder} 順位！`);
  };

  const handleShiftFeaturedOrder = (index: number, direction: 'up' | 'down') => {
    const targetItem = items[index];
    if (!targetItem.featured || !targetItem.featuredOrder) return;
    const currentOrder = targetItem.featuredOrder;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    if (targetOrder < 1 || targetOrder > featuredCount) return;
    handleFeaturedOrderChange(index, targetOrder);
  };

  const handleAddItem = () => {
    setIsDirty(true);
    const isCat3D = activeCategory === '3d-prop' || activeCategory === '3d-scene' || activeCategory === 'all';
    const chosenCat = activeCategory === 'all' || activeCategory === 'featured' ? '3d-prop' : activeCategory;
    const newItem: GalleryItem = {
      id: `art-${Date.now()}`,
      cat: chosenCat,
      embedUrl: isCat3D ? 'https://www.artstation.com/embed/67608316' : undefined,
      img: isCat3D ? undefined : '/assets/gallery/sketch/01.webp',
      featured: false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(isEn ? 'New gallery item created!' : '已成功新增一件美術畫廊作品！');
  };

  const handleDeleteItem = (index: number) => {
    const item = items[index];
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Delete Artwork' : '刪除作品',
      message: isEn
        ? `Are you sure you want to delete artwork "${item.id}"? This cannot be undone.`
        : `確定要刪除作品「${item.id}」嗎？此操作無法復原。`,
      confirmText: isEn ? 'Delete' : '確定刪除',
      onConfirm: () => {
        setIsDirty(true);
        setItems((prev) => prev.filter((_, i) => i !== index));
        showToast(isEn ? 'Item deleted!' : '已刪除該作品項目！');
      },
    });
  };

  // ── 拖曳排序 ─────────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragSourceIdxRef.current = index;
    setDraggingIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
    dragSourceIdxRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSourceIdxRef.current === index) return;
    setDragOverIdx(index);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const sourceIdx = dragSourceIdxRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) {
      handleDragEnd();
      return;
    }

    setIsDirty(true);
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });

    handleDragEnd();
    showToast(isEn ? 'Gallery item reordered!' : '畫廊作品順序已更新！');
  };

  const handleMoveItem = (fromIdx: number, toIdx: number) => {
    if (isPreview || fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    setIsDirty(true);
    setItems((prev) => {
      if (toIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    showToast(isEn ? 'Gallery item reordered!' : '畫廊作品順序已更新！');
  };

  /**
   * [資料持久化] 儲存並更新美術畫廊與 3D 多媒體展品清單
   * 寫入本地快照並同步推送至 Firebase Firestore 雲端資料庫。
   */
  const doSave = async () => {
    setIsDirty(false);
    try {
      localStorage.setItem('portfolio_gallery_data', JSON.stringify(items));
      window.dispatchEvent(new Event('portfolio_gallery_data_updated'));

      const saved = localStorage.getItem('portfolio_custom_translations');
      const translations = saved ? JSON.parse(saved) : { zh: {}, en: {} };
      if (!translations.zh) translations.zh = {};
      if (!translations.en) translations.en = {};
      translations.zh.gallery_title = galleryMeta.zh.gallery_title;
      translations.zh.gallery_note = galleryMeta.zh.gallery_note;
      translations.en.gallery_title = galleryMeta.en.gallery_title;
      translations.en.gallery_note = galleryMeta.en.gallery_note;
      localStorage.setItem('portfolio_custom_translations', JSON.stringify(translations));
      window.dispatchEvent(new Event('portfolio_translations_updated'));

      await updateDocument('gallery', items);
      await updateDocument('site_translations', {
        ...(data.site_translations as any || {}),
        zh: {
          ...(data.site_translations as any)?.zh,
          gallery_title: galleryMeta.zh.gallery_title,
          gallery_note: galleryMeta.zh.gallery_note,
        },
        en: {
          ...(data.site_translations as any)?.en,
          gallery_title: galleryMeta.en.gallery_title,
          gallery_note: galleryMeta.en.gallery_note,
        },
      });

      showToast(isEn ? '"Art Gallery" module saved to cloud successfully!' : '「美術畫廊」模組資料已成功存檔至雲端！');
    } catch {
      showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
    }
  };

  /** handleSetDefault — 將當前畫廊資料設為預設值基準 */
  const handleSetDefault = () => {
    try {
      localStorage.setItem('portfolio_gallery_baseline', JSON.stringify(items));
      showToast(isEn ? 'Current gallery set as module default!' : '當前「美術畫廊」內容已設為預設值！');
    } catch {
      showToast(isEn ? 'Failed to set default' : '設定預設值失敗');
    }
  };

  const doReset = async () => {
    setIsDirty(false);
    const baselineRaw = localStorage.getItem('portfolio_gallery_baseline');
    const isBaseline = !!baselineRaw;
    const resetData = baselineRaw ? (JSON.parse(baselineRaw) as GalleryItem[]) : (defaultGalleryData as GalleryItem[]);
    try {
      localStorage.removeItem('portfolio_gallery_data');
      window.dispatchEvent(new Event('portfolio_gallery_data_updated'));

      const saved = localStorage.getItem('portfolio_custom_translations');
      if (saved) {
        const translations = JSON.parse(saved);
        if (translations.zh) {
          delete translations.zh.gallery_title;
          delete translations.zh.gallery_note;
        }
        if (translations.en) {
          delete translations.en.gallery_title;
          delete translations.en.gallery_note;
        }
        localStorage.setItem('portfolio_custom_translations', JSON.stringify(translations));
        window.dispatchEvent(new Event('portfolio_translations_updated'));
      }
      setItems(resetData);
      setGalleryMeta(DEFAULT_GALLERY_META);
      await updateDocument('gallery', resetData);
      showToast(isEn ? (isBaseline ? 'Restored to module defaults!' : '"Art Gallery" restored to defaults!') : (isBaseline ? '已還原至設定的預設值！' : '「美術畫廊」模組已還原為初始預設資料！'));
    } catch {
      showToast(isEn ? 'Restored locally' : '已重設本地資料');
    }
  };

  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "Art Gallery" module?'
        : '確定要儲存「美術畫廊」模組目前的修改內容嗎？',
      confirmText: isEn ? 'Save' : '確定存檔',
      onConfirm: doSave,
    });
  };

  const triggerResetDialog = () => {
    const baselineRaw = localStorage.getItem('portfolio_gallery_baseline');
    const isBaseline = !!baselineRaw;
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? (isBaseline ? 'Reset the "Art Gallery" module to the pinned default state?' : 'Are you sure you want to reset the "Art Gallery" module to default?')
        : (isBaseline ? '確定要將「美術畫廊」還原至設定的預設值嗎？' : '確定要將「美術畫廊」模組還原為初始預設值嗎？此操作僅會重置美術畫廊模組的內容，不會影響其他模組。'),
      confirmText: isEn ? 'Restore Defaults' : '確定還原預設',
      onConfirm: doReset,
    });
  };

  const filteredItems =
    activeCategory === 'all'
      ? items
      : activeCategory === 'featured'
      ? items.filter((it) => it.featured).sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
      : items.filter((item) => item.cat === activeCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case '3d-scene':
        return isEn ? '3D Environments' : '3D 場景';
      case '3d-prop':
        return isEn ? '3D Assets & Props' : '3D 物件';
      case 'sketch':
        return isEn ? '2D Sketches' : '2D 素描';
      case 'marker':
        return isEn ? '2D Marker Art' : '2D 麥克筆';
      default:
        return cat;
    }
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 - 嚴格方形直角科技風格，避開右下角 BackToTop 浮動按鈕 */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-24 right-6 sm:right-8 z-[10000] flex items-center gap-2.5 px-4 py-2.5 border cyber-cut-sm rounded-none bg-[var(--card-bg)]/95 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.35)] font-['Noto_Sans_TC'] text-xs sm:text-sm backdrop-blur-xl animate-fade-in pointer-events-none">
          <Check className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
          <span className="tracking-wide font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 二次確認對話框 */}
      <CmsConfirmDialog dialog={dialog} onClose={() => setDialog(EMPTY_DIALOG)} isEn={isEn} />

      {/* 頂部操作列 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-['Orbitron',sans-serif] tracking-wide text-[var(--text-main)] flex items-center gap-2.5 whitespace-nowrap">
            <ImageIcon className="w-6 h-6 text-[var(--neon-cyan)] shrink-0" />
            <span>{isEn ? 'Art Gallery' : '美術畫廊'}</span>
          </h1>
          <p className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] mt-1">
            {isEn ? 'Manage 3D game models, PBR textures, and 2D perspective artworks' : '管理 3D 遊戲硬表面模型、PBR 材質貼圖與 2D 手繪透視作品集'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={isPreview ? undefined : triggerResetDialog}
            disabled={isPreview}
            className="flex items-center gap-1.5 px-3.5 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold text-[var(--text-sub)] hover:text-rose-400 border-[var(--border-color)] hover:border-rose-400/40 bg-[var(--card-inner)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>

          <button
            type="button"
            onClick={isPreview ? undefined : handleSetDefault}
            disabled={isPreview}
            title={isEn ? 'Pin current gallery as module default' : '將當前美術畫廊內容設為預設值'}
            className="flex items-center gap-1.5 px-3.5 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold text-[var(--text-sub)] hover:text-amber-400 border-[var(--border-color)] hover:border-amber-400/40 bg-[var(--card-inner)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Set as Default' : '設為預設值'}</span>
          </button>

          <button
            type="button"
            onClick={isPreview ? undefined : triggerSaveDialog}
            disabled={isPreview}
            className="flex items-center gap-1.5 px-5 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold text-[var(--neon-cyan-fg)] bg-[var(--neon-cyan)] hover:bg-cyan-400 border-cyan-300 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* ── 區塊主標題自訂編輯器 ── */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'Art Gallery' : '美術畫廊'}
        zhValue={galleryMeta.zh.gallery_title}
        enValue={galleryMeta.en.gallery_title}
        onZhChange={(val: string) => {
          setIsDirty(true);
          setGalleryMeta((prev) => ({ ...prev, zh: { ...prev.zh, gallery_title: val } }));
        }}
        onEnChange={(val: string) => {
          setIsDirty(true);
          setGalleryMeta((prev) => ({ ...prev, en: { ...prev.en, gallery_title: val } }));
        }}
        zhSubtitleValue={galleryMeta.zh.gallery_note}
        enSubtitleValue={galleryMeta.en.gallery_note}
        onZhSubtitleChange={(val: string) => {
          setIsDirty(true);
          setGalleryMeta((prev) => ({ ...prev, zh: { ...prev.zh, gallery_note: val } }));
        }}
        onEnSubtitleChange={(val: string) => {
          setIsDirty(true);
          setGalleryMeta((prev) => ({ ...prev, en: { ...prev.en, gallery_note: val } }));
        }}
        isPreview={isPreview}
      />

      {/* 分類分頁標籤與新增按鈕 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', labelZh: '全部作品', labelEn: 'All Works' },
            { id: 'featured', labelZh: `★ 精選作品 (${featuredCount}/${MAX_FEATURED})`, labelEn: `★ Featured (${featuredCount}/${MAX_FEATURED})`, isAccent: true },
            { id: '3d-scene', labelZh: '3D 場景', labelEn: '3D Environments' },
            { id: '3d-prop', labelZh: '3D 物件', labelEn: '3D Assets & Props' },
            { id: 'sketch', labelZh: '2D 素描', labelEn: '2D Sketches' },
            { id: 'marker', labelZh: '2D 麥克筆', labelEn: '2D Marker Art' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? cat.isAccent
                    ? 'bg-amber-500/15 text-amber-300 border-amber-400 shadow-xs'
                    : 'bg-[var(--cat-icon-bg)] text-[var(--neon-cyan)] border-[var(--cat-icon-border)] shadow-xs'
                  : 'bg-[var(--card-bg)] text-[var(--text-sub)] hover:text-[var(--text-main)] border-[var(--border-color)]'
              }`}
            >
              {isEn ? cat.labelEn : cat.labelZh}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          disabled={isPreview}
          className="flex items-center justify-center p-2 border cyber-cut-sm text-[var(--neon-cyan)] bg-[var(--cat-icon-bg)] hover:bg-cyan-500/20 border-[var(--cat-icon-border)] transition-all cursor-pointer disabled:opacity-40 shadow-xs shrink-0"
          title={isEn ? 'Add Artwork' : '新增作品'}
          aria-label={isEn ? 'Add Artwork' : '新增作品'}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 畫廊藝術作品網格列表（支援拖曳排序） */}
      <div className="space-y-3">
        <div className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] flex items-center justify-between px-1">
          <span>
            {activeCategory === 'featured'
              ? (isEn ? 'Featured Artworks (Max 10, rendered in order in front-end 3D wheel):' : '精選作品清單（最多 10 件，依設定順序呈現於前臺 3D 輪盤）：')
              : (isEn ? 'Drag items to reorder gallery artwork sequence:' : '按住左側把手可拖曳調整畫廊作品排序順序：')}
          </span>
          {activeCategory === 'featured' && (
            <span className="text-[10px] font-mono text-[var(--neon-cyan)]">
              {isEn ? `Featured: ${featuredCount}/${MAX_FEATURED}` : `精選：${featuredCount}/${MAX_FEATURED}`}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const actualIndex = items.findIndex((it) => it.id === item.id);
            const isDragging = draggingIdx === actualIndex;
            const isOver = dragOverIdx === actualIndex;
            const is3DItem = item.cat === '3d-prop' || item.cat === '3d-scene';

            return (
              <div
                key={item.id}
                draggable={!isPreview && activeCategory === 'all'}
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDrop={(e) => handleDrop(e, actualIndex)}
                className={`border cyber-cut-sm p-4 space-y-3 transition-all ${
                  isDragging ? 'opacity-40 scale-95' : ''
                } ${isOver ? 'ring-2 ring-[var(--neon-cyan)]' : ''}`}
                style={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
                  borderColor: item.featured
                    ? isLight ? 'rgba(245,158,11,0.5)' : 'rgba(245,158,11,0.45)'
                    : isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                }}
              >
                {/* 標題列排版 */}
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)]/60 pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {!isPreview && activeCategory === 'all' && (
                      <div className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-sub)] hover:text-[var(--neon-cyan)]">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    <span className="px-2.5 py-0.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      #{actualIndex + 1}
                    </span>
                    <span className="px-2 py-0.5 border cyber-cut-sm text-[10px] font-['Noto_Sans_TC'] text-[var(--text-sub)] border-[var(--border-color)]">
                      {getCategoryLabel(item.cat)}
                    </span>
                    {item.featured && (
                      <span className="px-2 py-0.5 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold bg-amber-400/15 text-amber-300 border-amber-400/40">
                        ★ #{item.featuredOrder || 1}
                      </span>
                    )}
                    {item.visible === false && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 border cyber-cut-sm text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        <span>{isEn ? 'HIDDEN' : '已隱藏'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* 作品顯示/隱藏開關 */}
                    <CmsVisibilityToggle
                      checked={item.visible !== false}
                      onChange={(val) => {
                        setIsDirty(true);
                        setItems((prev) => {
                          const updated = [...prev];
                          updated[actualIndex] = { ...updated[actualIndex], visible: val };
                          return updated;
                        });
                      }}
                      disabled={isPreview}
                      size="sm"
                    />

                    <button
                      type="button"
                      disabled={isPreview || actualIndex === 0}
                      onClick={() => handleMoveItem(actualIndex, actualIndex - 1)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={isEn ? 'Move Up' : '往前調整順位'}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isPreview || actualIndex === items.length - 1}
                      onClick={() => handleMoveItem(actualIndex, actualIndex + 1)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title={isEn ? 'Move Down' : '往後調整順位'}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isPreview}
                      onClick={() => handleDeleteItem(actualIndex)}
                      className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-40"
                      title={isEn ? 'Delete artwork' : '刪除此作品'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 作品類別選擇群組 */}
                <div>
                  <label className="block text-[11px] font-['Noto_Sans_TC'] font-semibold text-[var(--text-sub)] mb-1">
                    {isEn ? 'Category' : '作品分類'}
                  </label>
                  <select
                    disabled={isPreview}
                    value={item.cat}
                    onChange={(e) => handleCategoryChange(actualIndex, e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border cyber-cut-sm bg-transparent outline-none cursor-pointer font-['Noto_Sans_TC']"
                    style={{ borderColor: borderCol, backgroundColor: isLight ? '#f8fafc' : '#080e1a' }}
                  >
                    <option value="3d-scene">{isEn ? '3D Environments' : '3D 場景'}</option>
                    <option value="3d-prop">{isEn ? '3D Assets & Props' : '3D 物件'}</option>
                    <option value="sketch">{isEn ? '2D Sketches' : '2D 素描'}</option>
                    <option value="marker">{isEn ? '2D Marker Art' : '2D 麥克筆'}</option>
                  </select>
                </div>

                {/* ── 精選作品設定 (最多 10 項 & 順位互換微調) ────────────────── */}
                <div
                  className="p-3 border cyber-cut-sm space-y-2 transition-colors"
                  style={{
                    backgroundColor: item.featured
                      ? isLight ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.08)'
                      : 'var(--card-inner)',
                    borderColor: item.featured ? 'rgba(245,158,11,0.35)' : 'var(--border-color)',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        disabled={isPreview || (!item.featured && featuredCount >= MAX_FEATURED)}
                        checked={item.featured || false}
                        onChange={(e) => handleToggleFeatured(actualIndex, e.target.checked)}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                      <span className="text-xs font-bold font-['Noto_Sans_TC'] flex items-center gap-1.5 text-[var(--text-main)]">
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-sub)]'}`} />
                        <span>{isEn ? 'Mark as Featured Artwork (Display on 3D Wheel)' : '標記為精選作品（於前臺 3D 輪盤展示）'}</span>
                      </span>
                    </label>

                    {item.featured && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[var(--text-sub)] font-mono">
                          {isEn ? 'Order:' : '順位:'}
                        </span>
                        <select
                          disabled={isPreview}
                          value={item.featuredOrder ?? 1}
                          onChange={(e) => handleFeaturedOrderChange(actualIndex, Number(e.target.value))}
                          className="px-2 py-0.5 border cyber-cut-sm bg-[var(--card-bg)] border-amber-400/50 text-amber-400 text-xs font-mono font-bold cursor-pointer outline-none"
                        >
                          {Array.from({ length: Math.max(featuredCount, 1) }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>#{num}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={isPreview || (item.featuredOrder ?? 1) <= 1}
                          onClick={() => handleShiftFeaturedOrder(actualIndex, 'up')}
                          className="p-1 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-[10px] text-[var(--text-sub)] hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                          title={isEn ? 'Move Up' : '順位上移'}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={isPreview || (item.featuredOrder ?? 1) >= featuredCount}
                          onClick={() => handleShiftFeaturedOrder(actualIndex, 'down')}
                          className="p-1 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-[10px] text-[var(--text-sub)] hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                          title={isEn ? 'Move Down' : '順位下移'}
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 作品封面圖片選擇器（所有作品皆需封面圖供輪盤與列表預覽） ── */}
                <div>
                  <CmsImagePicker
                    label={isEn ? 'Artwork Cover Image (Required for Wheel Preview)' : '作品封面圖片（輪盤與列表預覽必需）'}
                    value={item.img || ''}
                    onChange={(val) => handleItemChange(actualIndex, 'img', val)}
                    disabled={isPreview}
                    aspectRatio="16:9"
                    previewHeight="h-auto"
                    presetGroupFilter="美術畫廊"
                    folder="gallery"
                  />
                </div>

                {/* ── 3D 物件專屬：互動 3D 嵌入連結（點開後於燈箱展示） ── */}
                {is3DItem && (
                  <div className="pt-2 border-t border-[var(--border-color)]">
                    <CmsUrlInput
                      label={isEn ? 'Interactive 3D Embed URL (Sketchfab / ArtStation 3D Viewer)' : '互動 3D 嵌入網址（如 Sketchfab / ArtStation 3D 檢視器，點開後展示）'}
                      value={item.embedUrl || ''}
                      onChange={(val) => handleItemChange(actualIndex, 'embedUrl', val)}
                      placeholder="https://sketchfab.com/models/.../embed"
                      disabled={isPreview}
                      isEn={isEn}
                    />
                    {item.embedUrl && (
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                        <span className="truncate">{isEn ? 'Linked 3D Viewer: ' : '已關聯 3D 檢視器：'}{item.embedUrl}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CmsGalleryEditor;
