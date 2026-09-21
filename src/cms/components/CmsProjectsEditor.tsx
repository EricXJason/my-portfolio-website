/**
 * ============================================================================
 * 檔案名稱: CmsProjectsEditor.tsx
 * 所屬模組: Portfolio CMS (專案作品管理模組)
 * 責任描述: 負責管理專案作品列表、精選作品順序、日期選擇器、獲獎補助與技術標籤編輯。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、CmsDirtyContext、SectionTitleEditor、CmsDatePicker 與 CmsConfirmDialog。
 * 邊界處理: 保障至少 1 個專案不可刪盡、日期區間校驗、雙語資料隔離與二次確認彈窗防護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  FolderGit2,
  Star,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Globe,
  LayoutDashboard,
  Cpu,
  Video,
  Bot,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import { SectionTitleEditor } from './SectionTitleEditor';
import { CmsDatePicker } from './CmsDatePicker';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsTagListEditor } from './CmsTagListEditor';
import { CmsVisibilityToggle } from './CmsVisibilityToggle';
import { TechIcon } from '../../components/icons/TechIcon';
import { ExternalLink } from 'lucide-react';
import { CmsUrlInput } from './CmsUrlInput';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import defaultProjectsData from '../../data/projects-section.json';

interface ProjectItem {
  id: string;
  title_zh: string;
  title_en: string;
  category: string;
  featured: boolean;
  featuredOrder?: number;
  order: number;
  image: string;
  ytId?: string;
  videoUrl?: string;
  websiteUrl?: string;
  liveUrl?: string;
  adminUrl?: string;
  githubUrl?: string;
  aiAssisted?: boolean;
  isFullAi?: boolean;
  buttonOrder?: string[];
  honors?: string[];
  honors_en?: string[];
  desc: string;
  desc_en: string;
  contributions: string[];
  contributions_en?: string[];
  tags: string[];
  date: string;
  date_en: string;
  visible?: boolean;
}

export interface ProjectsMeta {
  projects_title: string;
  projects_note: string;
}

const DEFAULT_PROJECTS_META: Record<'zh' | 'en', ProjectsMeta> = {
  zh: {
    projects_title: '專案作品',
    projects_note: '所有作品皆提供真實預覽與互動連結，點擊可查看示範影片、線上成果或 GitHub 原始碼。',
  },
  en: {
    projects_title: 'Projects',
    projects_note: 'All projects feature authentic previews and interactive links to explore video demos, live sites, or GitHub repositories.',
  },
};

interface CmsProjectsEditorProps {
  isPreview?: boolean;
}

export const CmsProjectsEditor: React.FC<CmsProjectsEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (data.projects && Array.isArray(data.projects)) {
      return data.projects as ProjectItem[];
    }
    const defaults = defaultProjectsData as ProjectItem[];
    try {
      const saved = localStorage.getItem('portfolio_projects_data');
      if (saved) {
        const parsed = JSON.parse(saved) as ProjectItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 檢查本地暫存是否具備有效的精選專案，若為舊暫存（精選數為 0）則強制繼承前臺 defaults 的精選專案設定
          const hasSavedFeatured = parsed.some((p) => !!p.featured);
          const defaultIds = new Set(defaults.map((d) => d.id));
          const mergedDefaults = defaults.map((defaultProj) => {
            const savedProj = parsed.find((p) => p.id === defaultProj.id);
            if (!savedProj) return defaultProj;
            return {
              ...defaultProj,
              ...savedProj,
              // 前臺預設值優先保障：若前臺明確設定 isFullAi 為 true（如個人作品集網站），以前臺設定為基準預設值
              isFullAi: defaultProj.isFullAi !== undefined ? defaultProj.isFullAi : !!savedProj.isFullAi,
              category: (savedProj.category && savedProj.category !== 'linebot') ? savedProj.category : defaultProj.category,
              featured: hasSavedFeatured ? (savedProj.featured ?? defaultProj.featured ?? false) : (defaultProj.featured ?? false),
              featuredOrder: hasSavedFeatured ? (savedProj.featuredOrder ?? defaultProj.featuredOrder) : defaultProj.featuredOrder,
              visible: savedProj.visible !== undefined ? savedProj.visible : (defaultProj.visible ?? true),
              desc: (savedProj.desc && !savedProj.desc.includes('整合自研視覺化 CMS 內容管理後臺系統')) ? savedProj.desc : defaultProj.desc,
              desc_en: (savedProj.desc_en && !savedProj.desc_en.includes('TypeScript, Vite, and Tailwind CSS. Integrates a custom visual CMS admin dashboard')) ? savedProj.desc_en : defaultProj.desc_en,
              contributions: (savedProj.contributions && savedProj.contributions.length > 0) ? savedProj.contributions : defaultProj.contributions,
              contributions_en: (savedProj.contributions_en && savedProj.contributions_en.length > 0) ? savedProj.contributions_en : defaultProj.contributions_en,
              tags: (savedProj.tags && savedProj.tags.length > 0)
                ? savedProj.tags
                    .filter((t: string) => t !== 'Firebase Storage' && t !== 'i18n')
                    .map((t: string) => {
                      if (t === 'React 18') return 'React';
                      if (t === 'GitHub Actions (CI)') return 'GitHub Actions';
                      return t;
                    })
                : defaultProj.tags,
              // 影片網址防呆防護：若 saved 專案中儲存的是舊版 ytId 裸 ID，強制升級為標準完整 URL
              videoUrl: (() => {
                const v = (savedProj.videoUrl || savedProj.ytId || defaultProj.videoUrl || defaultProj.ytId || '').trim();
                if (!v) return '';
                return v.startsWith('http://') || v.startsWith('https://') ? v : `https://www.youtube.com/watch?v=${v}`;
              })(),
              ytId: (() => {
                const v = (savedProj.videoUrl || savedProj.ytId || defaultProj.videoUrl || defaultProj.ytId || '').trim();
                if (!v) return '';
                return v.startsWith('http://') || v.startsWith('https://') ? v : `https://www.youtube.com/watch?v=${v}`;
              })(),
            };
          });

          // 保留所有非預設清單內的自訂新增專案
          const customProjects = parsed.filter((p) => !defaultIds.has(p.id));
          return [...mergedDefaults, ...customProjects];
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return defaults;
  });

  useEffect(() => {
    if (data.projects && Array.isArray(data.projects)) {
      setProjects(data.projects as ProjectItem[]);
    }
  }, [data.projects]);

  // 聆聽全域一鍵還原預設值廣播事件
  useEffect(() => {
    const handleResetAll = () => {
      setProjects(defaultProjectsData as ProjectItem[]);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 聆聽廣播存檔事件
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('projects', projects);
        } catch (e) {
          console.error('[CMS Projects] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [projects, isPreview, updateDocument]);

  // ── 本地全域即時連動效應 ──
  // 無論處於管理員模式還是預覽模式，專案作品的任何變更（visible 開關、精選順序、拖曳排序、欄位編輯）
  // 均立即同步至全域 Context 與本地快取，並廣播通知前臺 0 毫秒即時刷新渲染。
  const isFirstProjectsSync = useRef(true);
  useEffect(() => {
    if (isFirstProjectsSync.current) {
      isFirstProjectsSync.current = false;
      return;
    }
    updateDocument('projects', projects, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
      window.dispatchEvent(new Event('portfolio_projects_data_updated'));
    } catch (e) {
      console.warn('[CMS Projects] Local sync error:', e);
    }
  }, [projects, updateDocument]);

  const [projectsMeta, setProjectsMeta] = useState<Record<'zh' | 'en', ProjectsMeta>>(() => {
    try {
      const saved = localStorage.getItem('portfolio_custom_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          zh: {
            projects_title: parsed.zh?.projects_title ?? DEFAULT_PROJECTS_META.zh.projects_title,
            projects_note: parsed.zh?.projects_note ?? DEFAULT_PROJECTS_META.zh.projects_note,
          },
          en: {
            projects_title: parsed.en?.projects_title ?? DEFAULT_PROJECTS_META.en.projects_title,
            projects_note: parsed.en?.projects_note ?? DEFAULT_PROJECTS_META.en.projects_note,
          },
        };
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return DEFAULT_PROJECTS_META;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(
    projects[0]?.id || 'awakening'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 專案列表項目拖放狀態
  const projDragRef = useRef<string | null>(null);
  const [projDragging, setProjDragging] = useState<string | null>(null);
  const [projDragOver, setProjDragOver] = useState<string | null>(null);

  // 專案按鈕順序拖放狀態
  const btnDragRef = useRef<number | null>(null);
  const [btnDragging, setBtnDragging] = useState<number | null>(null);
  const [btnDragOver, setBtnDragOver] = useState<number | null>(null);

  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };

  const activeProjectIndex = projects.findIndex((p) => p.id === activeProjectId);
  const activeProject = projects[activeProjectIndex] || projects[0];

  const isInteractive = activeProject.category === 'interactive';
  const interactiveFeaturedCount = projects.filter(
    (p) => p.featured && p.category === 'interactive'
  ).length;
  const fullstackFeaturedCount = projects.filter(
    (p) => p.featured && (p.category === 'fullstack' || p.category === 'frontend')
  ).length;
  const currentCatFeaturedCount = isInteractive
    ? interactiveFeaturedCount
    : fullstackFeaturedCount;

  const handleToggleFeatured = (checked: boolean) => {
    if (activeProjectIndex === -1) return;

    if (checked) {
      if (currentCatFeaturedCount >= 3 && !activeProject.featured) {
        showToast(
          isEn
            ? (isInteractive
                ? 'Maximum of 3 featured Interactive projects allowed. Uncheck another first.'
                : 'Maximum of 3 featured Fullstack projects allowed. Uncheck another first.')
            : (isInteractive
                ? '精選互動作品最多僅能設定 3 項，請先取消同分類其他專案的精選標記。'
                : '精選全端作品最多僅能設定 3 項，請先取消同分類其他專案的精選標記。')
        );
        return;
      }
      // 自動挑選同分類中 [1, 2, 3] 順位中尚未被使用的最小序號
      const sameCatProjects = projects.filter((p) =>
        isInteractive
          ? p.category === 'interactive'
          : p.category === 'fullstack' || p.category === 'frontend'
      );
      const usedOrders = new Set(
        sameCatProjects
          .filter((p) => p.featured && p.id !== activeProject.id && p.featuredOrder != null)
          .map((p) => p.featuredOrder)
      );
      let nextOrder = 1;
      for (let i = 1; i <= 3; i++) {
        if (!usedOrders.has(i)) {
          nextOrder = i;
          break;
        }
      }

      setIsDirty(true);
      setProjects((prev) => {
        const updated = [...prev];
        updated[activeProjectIndex] = {
          ...updated[activeProjectIndex],
          featured: true,
          featuredOrder: nextOrder,
        };
        return updated;
      });
      showToast(isEn ? `Project set as Featured #${nextOrder}!` : `已設定為精選作品第 ${nextOrder} 順位！`);
    } else {
      setIsDirty(true);
      setProjects((prev) => {
        const updated = [...prev];
        updated[activeProjectIndex] = {
          ...updated[activeProjectIndex],
          featured: false,
          featuredOrder: undefined,
        };
        return updated;
      });
      showToast(isEn ? 'Removed from featured projects.' : '已取消精選作品標記。');
    }
  };

  const handleFeaturedOrderChange = (newOrder: number) => {
    if (activeProjectIndex === -1) return;
    const oldOrder = activeProject.featuredOrder ?? 1;
    if (oldOrder === newOrder) return;

    setIsDirty(true);
    setProjects((prev) => {
      const updated = [...prev];
      // 檢查同分類順位衝突並自動互換兩者順序
      const conflictIdx = updated.findIndex(
        (p) =>
          p.id !== activeProject.id &&
          p.featured &&
          (isInteractive
            ? p.category === 'interactive'
            : p.category === 'fullstack' || p.category === 'frontend') &&
          p.featuredOrder === newOrder
      );
      if (conflictIdx !== -1) {
        updated[conflictIdx] = {
          ...updated[conflictIdx],
          featuredOrder: oldOrder,
        };
      }
      updated[activeProjectIndex] = {
        ...updated[activeProjectIndex],
        featuredOrder: newOrder,
      };
      return updated;
    });
    showToast(isEn ? `Featured order updated to #${newOrder}!` : `精選順序已更新為第 ${newOrder} 順位！`);
  };

  const handleFieldChange = <K extends keyof ProjectItem>(field: K, value: ProjectItem[K]) => {
    if (activeProjectIndex === -1) return;
    setIsDirty(true);
    setProjects((prev) => {
      const updated = [...prev];
      const curProj = { ...updated[activeProjectIndex], [field]: value };
      // 關鍵規則：所有被隱藏的物件必須脫離精選作品
      if (field === 'visible' && value === false) {
        curProj.featured = false;
        curProj.featuredOrder = undefined;
      }
      // 跨語系開發期程自動同步
      if (field === 'date') {
        curProj.date_en = value as string;
      } else if (field === 'date_en') {
        curProj.date = value as string;
      }
      updated[activeProjectIndex] = curProj;
      return updated;
    });
  };

  const handleAddProject = () => {
    setIsDirty(true);
    const newId = `project-${Date.now().toString(36)}`;
    const newProj: ProjectItem = {
      id: newId,
      title_zh: '新專案名稱',
      title_en: 'New Project Title',
      category: 'interactive',
      featured: false,
      visible: true,
      order: projects.length + 1,
      image: '/assets/images/proj-placeholder.webp',
      ytId: '',
      videoUrl: '',
      websiteUrl: '',
      liveUrl: '',
      adminUrl: '',
      githubUrl: '',
      isFullAi: false,
      buttonOrder: ['video', 'live', 'admin', 'github'],
      honors: [],
      honors_en: [],
      desc: '',
      desc_en: '',
      contributions: [],
      contributions_en: [],
      tags: ['React', 'TypeScript'],
      date: '2026',
      date_en: '2026',
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newId);
    showToast(isEn ? 'New project added!' : '已成功建立新專案！');
  };

  // 專案列表拖曳事件處理函式
  const handleProjDragStart = (e: React.DragEvent, id: string) => {
    projDragRef.current = id; setProjDragging(id); e.dataTransfer.effectAllowed = 'move';
  };
  const handleProjDragEnd = () => { setProjDragging(null); setProjDragOver(null); projDragRef.current = null; };
  const handleProjDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (projDragRef.current !== id) setProjDragOver(id); };
  const handleProjDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = projDragRef.current;
    if (!sourceId || sourceId === targetId) { setProjDragging(null); setProjDragOver(null); projDragRef.current = null; return; }
    setIsDirty(true);
    setProjects((prev) => {
      const sourceIdx = prev.findIndex((p) => p.id === sourceId);
      const targetIdx = prev.findIndex((p) => p.id === targetId);
      if (sourceIdx === -1 || targetIdx === -1) return prev;
      const newProjs = [...prev];
      const [removed] = newProjs.splice(sourceIdx, 1);
      newProjs.splice(targetIdx, 0, removed);
      return newProjs.map((p, i) => ({ ...p, order: i + 1 }));
    });
    setProjDragging(null); setProjDragOver(null); projDragRef.current = null;
    showToast(isEn ? 'Project order updated!' : '已更新專案排序順位！');
  };

  const handleMoveProjectOrder = (id: string, direction: 'up' | 'down') => {
    setIsDirty(true);
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated.map((p, i) => ({ ...p, order: i + 1 }));
    });
    showToast(isEn ? 'Project order updated!' : '已更新專案排序順位！');
  };

  /**
   * [專案實體刪除] 刪除指定 ID 之專案作品實體
   * 從目前編輯狀態中移除並標記變更，待儲存時一併同步。
   */
  const triggerDeleteDialog = () => {
    if (!activeProject) return;
    setDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Delete Project' : '確認刪除此專案',
      message: isEn
        ? `Are you sure you want to delete "${activeProject.title_en || activeProject.title_zh}"? This cannot be undone.`
        : `確定要刪除「${activeProject.title_zh || activeProject.title_en}」專案嗎？此操作將移除該專案資料。`,
      confirmText: isEn ? 'Delete Project' : '確定刪除專案',
      onConfirm: () => {
        setIsDirty(true);
        const remaining = projects.filter((p) => p.id !== activeProjectId);
        setProjects(remaining);
        if (remaining.length > 0) {
          setActiveProjectId(remaining[0].id);
        }
        showToast(isEn ? 'Project removed!' : '該專案作品已成功刪除！');
      },
    });
  };

  /**
   * [資料持久化] 儲存並更新所有專案作品列表與自訂排序
   * 寫入本地快照並同步推送至 Firebase Firestore 雲端資料庫。
   */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "Projects" module to cloud and local cache?'
        : '確定要將「專案作品」模組目前的修改內容儲存至雲端資料庫嗎？',
      confirmText: isEn ? 'Confirm Save' : '確定存檔',
      onConfirm: async () => {
        setIsDirty(false);
        try {
          localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
          window.dispatchEvent(new Event('portfolio_projects_data_updated'));

          const existingCustom = localStorage.getItem('portfolio_custom_translations');
          const customObj = existingCustom ? JSON.parse(existingCustom) : { zh: {}, en: {} };
          customObj.zh = { ...(customObj.zh || {}), ...projectsMeta.zh };
          customObj.en = { ...(customObj.en || {}), ...projectsMeta.en };
          localStorage.setItem('portfolio_custom_translations', JSON.stringify(customObj));
          window.dispatchEvent(new Event('portfolio_translations_updated'));

          await updateDocument('projects', projects);
          await updateDocument('site_translations', {
            ...(data.site_translations as any || {}),
            zh: { ...(data.site_translations as any)?.zh, ...projectsMeta.zh },
            en: { ...(data.site_translations as any)?.en, ...projectsMeta.en },
          });

          showToast(isEn ? '"Projects" module saved to cloud successfully!' : '「專案作品」模組資料已成功存檔至雲端！');
        } catch {
          showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
        }
      },
    });
  };

  /** handleSetDefault — 將當前專案資料設為預設值基準 */
  const handleSetDefault = () => {
    try {
      localStorage.setItem('portfolio_projects_baseline', JSON.stringify(projects));
      showToast(isEn ? 'Current projects set as module default!' : '當前「專案作品」內容已設為預設值！');
    } catch {
      showToast(isEn ? 'Failed to set default' : '設定預設值失敗');
    }
  };

  const triggerResetDialog = () => {
    const baselineRaw = localStorage.getItem('portfolio_projects_baseline');
    const isBaseline = !!baselineRaw;
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? (isBaseline ? 'Reset projects to the pinned default state?' : 'Are you sure you want to reset the "Projects" module to default?')
        : (isBaseline ? '確定要將「專案作品」還原至設定的預設值嗎？' : '確定要將「專案作品」模組還原為初始預設值嗎？此操作僅會重置專案作品模組的內容，不會影響其他模組。'),
      confirmText: isEn ? 'Restore Defaults' : '確定還原預設',
      onConfirm: async () => {
        setIsDirty(false);
        const defaultList = baselineRaw ? (JSON.parse(baselineRaw) as ProjectItem[]) : (defaultProjectsData as ProjectItem[]);
        try {
          localStorage.removeItem('portfolio_projects_data');
          window.dispatchEvent(new Event('portfolio_projects_data_updated'));

          const existingCustom = localStorage.getItem('portfolio_custom_translations');
          if (existingCustom) {
            const customObj = JSON.parse(existingCustom);
            if (customObj.zh) {
              delete customObj.zh.projects_title;
              delete customObj.zh.projects_note;
            }
            if (customObj.en) {
              delete customObj.en.projects_title;
              delete customObj.en.projects_note;
            }
            localStorage.setItem('portfolio_custom_translations', JSON.stringify(customObj));
            window.dispatchEvent(new Event('portfolio_translations_updated'));
          }
        } catch {
          // 忽略例外
        }
        setProjects(defaultList);
        setProjectsMeta(DEFAULT_PROJECTS_META);
        setActiveProjectId(defaultList[0]?.id || '');
        try {
          await updateDocument('projects', defaultList);
          showToast(isEn ? (isBaseline ? 'Restored to module defaults!' : '"Projects" restored to initial defaults!') : (isBaseline ? '已還原至設定的預設值！' : '「專案作品」模組已還原為初始預設資料！'));
        } catch {
          showToast(isEn ? 'Restored locally' : '已重設本地資料');
        }
      },
    });
  };



  // 將陣列轉換為多行字串以供 textarea 編輯器綁定
  const honorsArray = isEn ? (activeProject?.honors_en || []) : (activeProject?.honors || []);
  const honorsText = honorsArray.join('\n');

  const contributionsArray = isEn
    ? (activeProject?.contributions_en || activeProject?.contributions || [])
    : (activeProject?.contributions || []);
  const contributionsText = contributionsArray.join('\n');

  // 字數計數器徽章渲染輔助函式
  const renderCharCountBadge = (currLen: number, maxLen: number) => {
    const isOver = currLen > maxLen;
    return (
      <span
        className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
        style={{
          backgroundColor: isOver ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
          borderColor: isOver ? '#f87171' : 'var(--border-color)',
          color: isOver ? '#f87171' : 'var(--text-sub)',
        }}
      >
        {currLen} / {maxLen}
      </span>
    );
  };

  const buttonDefinitions: Record<string, { label_zh: string; label_en: string; icon: React.ReactNode; color: string }> = {
    live: {
      label_zh: '前往前臺',
      label_en: 'Live Demo',
      icon: <Globe className="w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0" />,
      color: '#00f0ff',
    },
    admin: {
      label_zh: '前往後臺',
      label_en: 'Admin CMS',
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
      color: '#c084fc',
    },
    video: {
      label_zh: '展示影片',
      label_en: 'Video',
      icon: <TechIcon name="youtube" size={14} className="text-rose-400 shrink-0 fill-current" />,
      color: '#f43f5e',
    },
    github: {
      label_zh: '專案代碼',
      label_en: 'Source Code',
      icon: <TechIcon name="github" size={14} className="text-slate-300 shrink-0 fill-current" />,
      color: '#94a3b8',
    },
  };

  const isButtonConfigured = (key: string) => {
    if (!activeProject) return false;
    if (key === 'video') return !!(activeProject.ytId || activeProject.videoUrl);
    if (key === 'live') return !!(activeProject.websiteUrl || activeProject.liveUrl);
    if (key === 'admin') return !!activeProject.adminUrl;
    if (key === 'github') return !!activeProject.githubUrl;
    return false;
  };

  const handleMoveButtonOrder = (key: string, direction: 'up' | 'down') => {
    if (!activeProject) return;
    const currentOrder = activeProject.buttonOrder && activeProject.buttonOrder.length > 0
      ? [...activeProject.buttonOrder]
      : ['live', 'admin', 'video', 'github'];

    const allKeys = ['live', 'admin', 'video', 'github'];
    for (const k of allKeys) {
      if (!currentOrder.includes(k)) currentOrder.push(k);
    }

    const idx = currentOrder.indexOf(key);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentOrder.length) return;

    const temp = currentOrder[idx];
    currentOrder[idx] = currentOrder[targetIdx];
    currentOrder[targetIdx] = temp;

    handleFieldChange('buttonOrder', currentOrder);
    showToast(isEn ? 'Button order updated!' : '已更新動作按鈕排列順序！');
  };

  const handleBtnDragStart = (e: React.DragEvent, idx: number) => {
    if (isPreview) return;
    btnDragRef.current = idx;
    setBtnDragging(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBtnDragEnd = () => {
    setBtnDragging(null);
    setBtnDragOver(null);
    btnDragRef.current = null;
  };

  const handleBtnDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (btnDragRef.current !== idx) setBtnDragOver(idx);
  };

  const handleBtnDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const sourceIdx = btnDragRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx || isPreview || !activeProject) {
      setBtnDragging(null);
      setBtnDragOver(null);
      btnDragRef.current = null;
      return;
    }
    const currentOrder = activeProject.buttonOrder && activeProject.buttonOrder.length > 0
      ? [...activeProject.buttonOrder]
      : ['live', 'admin', 'video', 'github'];
    const allKeys = ['live', 'admin', 'video', 'github'];
    for (const k of allKeys) {
      if (!currentOrder.includes(k)) currentOrder.push(k);
    }
    const [removed] = currentOrder.splice(sourceIdx, 1);
    currentOrder.splice(targetIdx, 0, removed);
    handleFieldChange('buttonOrder', currentOrder);
    setBtnDragging(null);
    setBtnDragOver(null);
    btnDragRef.current = null;
    showToast(isEn ? 'Button order updated!' : '已更新動作按鈕排列順序！');
  };

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
        <h1 className="text-2xl font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] whitespace-nowrap">
          {isEn ? 'Projects' : '專案作品'}
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={isPreview ? undefined : triggerResetDialog}
            disabled={isPreview}
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
            onClick={isPreview ? undefined : handleSetDefault}
            disabled={isPreview}
            title={isEn ? 'Pin current projects as module default' : '將當前專案作品內容設為預設值'}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
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
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* 區塊標題編輯器 (嚴格依語系隔離) */}
      <SectionTitleEditor
        sectionLabel={isEn ? 'Projects' : '專案作品'}
        zhValue={projectsMeta.zh.projects_title}
        enValue={projectsMeta.en.projects_title}
        onZhChange={(v) => { setIsDirty(true); setProjectsMeta((p) => ({ ...p, zh: { ...p.zh, projects_title: v } })); }}
        onEnChange={(v) => { setIsDirty(true); setProjectsMeta((p) => ({ ...p, en: { ...p.en, projects_title: v } })); }}
        zhSubtitleValue={projectsMeta.zh.projects_note}
        enSubtitleValue={projectsMeta.en.projects_note}
        onZhSubtitleChange={(v) => { setIsDirty(true); setProjectsMeta((p) => ({ ...p, zh: { ...p.zh, projects_note: v } })); }}
        onEnSubtitleChange={(v) => { setIsDirty(true); setProjectsMeta((p) => ({ ...p, en: { ...p.en, projects_note: v } })); }}
        isPreview={isPreview}
      />

      {/* ── 主工作區 (垂直專案清單與詳細編輯面板) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左側欄：垂直專案選擇器（佔 4 欄寬度） */}
        <div className="lg:col-span-4 space-y-3">
          {/* 頂部卡片：專案總覽與操作按鈕 */}
          <div className="p-4 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] flex items-center justify-between gap-2 shadow-sm">
            <div>
              <h2 className="text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[var(--neon-cyan)]" />
                <span>{isEn ? 'Projects List' : '專案作品清單'}</span>
              </h2>
            </div>

            {!isPreview && (
              <button
                type="button"
                onClick={handleAddProject}
                className="p-2 border cyber-cut-sm bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] hover:bg-[var(--neon-cyan)]/90 flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] cursor-pointer"
                title={isEn ? 'Add Project' : '新增專案'}
                aria-label={isEn ? 'Add Project' : '新增專案'}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-[var(--text-sub)]/60 font-['Noto_Sans_TC'] px-1">
            {isEn
              ? 'Click to edit; use ▲/▼ or drag vertically to reorder'
              : '點選專案進行編輯，可點擊 ▲/▼ 或垂直拖曳調整順位'}
          </p>

          {/* 垂直專案列表（嚴格垂直排列，零水平溢出） */}
          <div className="space-y-2">
            {projects.map((proj, idx) => {
              const isActive = proj.id === activeProjectId;
              const title = isEn ? (proj.title_en || proj.title_zh) : (proj.title_zh || proj.title_en);
              const isDraggingThis = projDragging === proj.id;
              const isOverThis = projDragOver === proj.id;

              return (
                <div
                  key={proj.id}
                  draggable={!isPreview}
                  onDragStart={(e) => handleProjDragStart(e, proj.id)}
                  onDragEnd={handleProjDragEnd}
                  onDragOver={(e) => handleProjDragOver(e, proj.id)}
                  onDragLeave={() => setProjDragOver(null)}
                  onDrop={(e) => handleProjDrop(e, proj.id)}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`group relative p-3 border cyber-cut-sm transition-all duration-150 cursor-pointer ${
                    isDraggingThis ? 'opacity-40 scale-95' : ''
                  } ${isOverThis ? 'ring-2 ring-[var(--neon-cyan)]' : ''} ${
                    isActive
                      ? 'bg-[var(--neon-cyan)]/15 border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--border-color)]/80 hover:bg-[var(--card-inner)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* 左側：拖曳手把、序號與專案標題 */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {!isPreview && (
                        <div
                          className="cursor-grab active:cursor-grabbing p-0.5 text-[var(--text-sub)] hover:text-[var(--neon-cyan)] opacity-40 group-hover:opacity-100 shrink-0"
                          title={isEn ? 'Drag vertically to reorder' : '垂直拖曳調整順序'}
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border cyber-cut-sm shrink-0 ${
                          isActive
                            ? 'bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] border-[var(--neon-cyan)]'
                            : 'bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)]'
                        }`}
                      >
                        #{idx + 1}
                      </span>

                      <div className="min-w-0">
                        <span
                          className={`text-xs font-bold font-['Noto_Sans_TC'] block truncate ${
                            isActive ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-main)]'
                          }`}
                        >
                          {title}
                        </span>

                        {/* 狀態徽章橫列 */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {/* 類別徽章 */}
                          <span className="text-[9px] font-['Noto_Sans_TC'] px-1.5 py-0.2 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)]">
                            {proj.category === 'interactive'
                              ? (isEn ? 'Interactive App' : '互動應用開發')
                              : proj.category === 'frontend'
                              ? (isEn ? 'Frontend Dev' : '前端開發')
                              : proj.category === 'fullstack'
                              ? (isEn ? 'Fullstack Dev' : '全端開發')
                              : proj.category}
                          </span>

                          {/* 精選推薦徽章 */}
                          {proj.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-400 font-mono font-bold px-1 py-0.2 bg-amber-400/10 border border-amber-400/30 cyber-cut-sm">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              <span>#{proj.featuredOrder || 1}</span>
                            </span>
                          )}

                          {/* 100% AI 開發標籤徽章 */}
                          {proj.isFullAi && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 font-mono font-bold px-1 py-0.2 bg-emerald-400/10 border border-emerald-400/30 cyber-cut-sm">
                              <Bot className="w-2.5 h-2.5" />
                              <span>AI</span>
                            </span>
                          )}

                          {/* 隱藏狀態徽章 */}
                          {proj.visible === false && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-rose-400 font-mono font-bold px-1 py-0.2 bg-rose-400/10 border border-rose-400/30 cyber-cut-sm">
                              <EyeOff className="w-2.5 h-2.5" />
                              <span>{isEn ? 'HIDDEN' : '隱藏'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 右側：快速顯示/隱藏開關與垂直重排序按鈕組 */}
                    {!isPreview && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* 專案顯示/隱藏快速開關 (眼睛圖示切換) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newVisible = proj.visible === false ? true : false;
                            setIsDirty(true);
                            setProjects((prev) =>
                              prev.map((p) => (p.id === proj.id ? { ...p, visible: newVisible } : p))
                            );
                            showToast(
                              newVisible
                                ? (isEn ? `"${title}" is now visible on site!` : `已開啟「${title}」前臺展示！`)
                                : (isEn ? `"${title}" is now hidden from site!` : `已從前臺隱藏「${title}」！`)
                            );
                          }}
                          className={`p-1.5 border cyber-cut-sm transition-all cursor-pointer ${
                            proj.visible !== false
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-[var(--neon-cyan)] hover:bg-cyan-500/25 hover:border-cyan-500 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                              : 'bg-rose-500/15 border-rose-500/50 text-rose-400 hover:bg-rose-500/30 hover:border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                          }`}
                          title={
                            proj.visible !== false
                              ? (isEn ? 'Visible on site — Click to hide' : '前臺正常展示中（點擊直接隱藏）')
                              : (isEn ? 'Hidden from site — Click to show' : '已從前臺隱藏（點擊恢復展示）')
                          }
                        >
                          {proj.visible !== false ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* 垂直重排序按鈕組 */}
                        <div className="flex flex-col gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveProjectOrder(proj.id, 'up');
                            }}
                            className="p-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                            title={isEn ? 'Move project up' : '向上移動順位'}
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === projects.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveProjectOrder(proj.id, 'down');
                            }}
                            className="p-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                            title={isEn ? 'Move project down' : '向下移動順位'}
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側欄：當前選取專案詳細資訊編輯器（佔 8 欄寬度） */}
        <div className="lg:col-span-8">
          {activeProject && (
            <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[var(--neon-cyan)]" />
              <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'Project Information' : '專案基本資訊與屬性'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={triggerDeleteDialog}
                  className="px-3 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isEn ? 'Delete Project' : '刪除此專案'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 標題 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'Project Title' : '專案標題'}
                </label>
                {renderCharCountBadge((isEn ? activeProject.title_en : activeProject.title_zh || '').length, 50)}
              </div>
              <input
                type="text"
                value={isEn ? activeProject.title_en : activeProject.title_zh}
                onChange={(e) =>
                  handleFieldChange(isEn ? 'title_en' : 'title_zh', e.target.value)
                }
                placeholder=""
                className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC']"
              />
            </div>

            {/* 專案類別（嚴格單選下拉選單） */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'Project Category (Single Select)' : '專案類型 (單選)'}
              </label>
              <select
                value={activeProject.category}
                onChange={(e) => {
                  handleFieldChange('category', e.target.value as any);
                  showToast(isEn ? 'Project category updated!' : '已更新專案類型分類！');
                }}
                className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] cursor-pointer"
              >
                <option value="interactive">{isEn ? 'Interactive App' : '互動應用開發'}</option>
                <option value="frontend">{isEn ? 'Frontend Dev' : '前端開發'}</option>
                <option value="fullstack">{isEn ? 'Fullstack Dev' : '全端開發'}</option>
              </select>
            </div>

            {/* 100% AI 輔助開發核取方塊 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'AI Attribution' : 'AI 開發技術標記'}
              </label>
              <label className="flex items-center gap-2.5 px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] hover:border-emerald-500/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!activeProject.isFullAi}
                  disabled={isPreview}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleFieldChange('isFullAi', checked);
                    showToast(
                      checked
                        ? (isEn ? 'AI attribution marked!' : '已標記為 AI 輔助開發！')
                        : (isEn ? 'AI attribution removed!' : '已取消 AI 輔助開發標記！')
                    );
                  }}
                  className="w-4 h-4 rounded-none text-emerald-500 focus:ring-0 focus:outline-none cursor-pointer"
                />
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] whitespace-nowrap">
                  {isEn ? 'AI-Assisted Dev' : 'AI 輔助開發'}
                </span>
                {activeProject.isFullAi && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold whitespace-nowrap">
                    {isEn ? 'AI-Assisted' : 'AI 輔助'}
                  </span>
                )}
              </label>
            </div>

            {/* 專案開發日期區間 */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                {isEn ? 'Development Date Range' : '開發期程 (支援日期選擇器)'}
              </label>
              <CmsDatePicker
                value={isEn ? activeProject.date_en : activeProject.date}
                onChange={(val) => handleFieldChange(isEn ? 'date_en' : 'date', val)}
                placeholder="YYYY/MM ~ YYYY/MM"
                disabled={isPreview}
              />
            </div>

            {/* 專案顯示開關 (超高自由度可視性) */}
            <div className="p-3.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] md:col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeProject.visible !== false ? (
                  <Eye className="w-4 h-4 text-[var(--neon-cyan)]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <span className="text-xs sm:text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] block">
                    {isEn ? 'Display Project on Website' : '於網站中顯示此專案 (可視性)'}
                  </span>
                  <span className="text-[10px] text-[var(--text-sub)]">
                    {activeProject.visible !== false
                      ? (isEn ? 'Visible on front-end website' : '前臺正常展示中')
                      : (isEn ? 'Hidden from front-end website' : '已從前臺網站隱藏（自動脫離精選）')}
                  </span>
                </div>
              </div>
              <CmsVisibilityToggle
                checked={activeProject.visible !== false}
                onChange={(val) => {
                  handleFieldChange('visible', val);
                  const title = activeProject.title_zh || activeProject.title_en || '專案';
                  showToast(
                    val
                      ? (isEn ? `"${title}" is now visible on site!` : `已開啟「${title}」前臺展示！`)
                      : (isEn ? `"${title}" is now hidden from site!` : `已從前臺隱藏「${title}」！`)
                  );
                }}
                size="md"
              />
            </div>

            {/* 精選專案設定（互動 3 項、全端 3 項上限，精選排序 1-3，隱藏專案強制排除） */}
            <div className="p-4 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] md:col-span-2 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2.5">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={activeProject.featured}
                    disabled={activeProject.visible === false || (!activeProject.featured && currentCatFeaturedCount >= 3)}
                    onChange={(e) => handleToggleFeatured(e.target.checked)}
                    className="w-4 h-4 rounded-none text-[var(--neon-cyan)] focus:ring-0 focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${activeProject.featured ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-sub)]'}`} />
                    <span className="text-xs sm:text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                      {isEn ? 'Mark as Featured Project' : '標記為精選專案 (於首頁展現)'}
                    </span>
                    {activeProject.visible === false && (
                      <span className="text-[11px] text-rose-400 font-mono">
                        {isEn ? '(Hidden projects cannot be featured)' : '(隱藏之專案無法設為精選)'}
                      </span>
                    )}
                  </div>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  {/* 分類獨立計數器 */}
                  <span
                    className="text-xs font-mono px-2 py-0.5 border cyber-cut-sm font-bold"
                    style={{
                      backgroundColor:
                        currentCatFeaturedCount >= 3
                          ? activeProject.featured
                            ? 'rgba(245,158,11,0.12)'
                            : 'rgba(239,68,68,0.12)'
                          : 'rgba(0,240,255,0.1)',
                      borderColor:
                        currentCatFeaturedCount >= 3
                          ? activeProject.featured
                            ? 'rgba(245,158,11,0.35)'
                            : 'rgba(239,68,68,0.35)'
                          : 'rgba(0,240,255,0.35)',
                      color:
                        currentCatFeaturedCount >= 3
                          ? activeProject.featured
                            ? '#f59e0b'
                            : '#ef4444'
                          : 'var(--neon-cyan)',
                    }}
                  >
                    {isInteractive
                      ? (isEn ? `Interactive: ${interactiveFeaturedCount}/3` : `精選互動: ${interactiveFeaturedCount}/3`)
                      : (isEn ? `Fullstack: ${fullstackFeaturedCount}/3` : `精選全端: ${fullstackFeaturedCount}/3`)}
                  </span>
                </div>
              </div>

              {activeProject.featured && (
                <div className="space-y-2 pt-2.5 border-t border-[var(--border-color)]/60">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] shrink-0">
                      {isEn ? 'Featured Display Order:' : '精選作品順序：'}
                    </label>
                    <select
                      value={activeProject.featuredOrder ?? 1}
                      disabled={isPreview}
                      onChange={(e) => handleFeaturedOrderChange(Number(e.target.value))}
                      className="px-3 py-1.5 border cyber-cut-sm bg-[var(--card-bg)] border-[var(--border-color)] text-xs font-bold text-[var(--neon-cyan)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono'] cursor-pointer shrink-0 min-w-[210px]"
                    >
                      <option value={1}>{isEn ? 'Order 1 (1st Priority)' : '第 1 順位 (最優先)'}</option>
                      <option value={2}>{isEn ? 'Order 2 (2nd Priority)' : '第 2 順位'}</option>
                      <option value={3}>{isEn ? 'Order 3 (3rd Priority)' : '第 3 順位'}</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-[var(--text-sub)]/70 font-['Noto_Sans_TC'] leading-relaxed">
                    {isEn
                      ? 'Selecting a priority already in use will automatically swap orders.'
                      : '若選取已被其他專案佔用之順位，系統將自動對調順序。'}
                  </p>
                </div>
              )}
            </div>

            {/* 封面圖片選擇器與即時上傳元件 */}
            <div className="space-y-1.5 md:col-span-2">
              <CmsImagePicker
                label={isEn ? 'Cover Image' : '專案封面圖片'}
                value={activeProject.image}
                onChange={(val) => handleFieldChange('image', val)}
                disabled={isPreview}
                aspectRatio="16:9"
                previewHeight="h-auto"
                presetGroupFilter="專案封面"
                folder="projects"
              />
            </div>

            {/* 四大選填行動按鈕與顯示順序管理器 */}
            <div className="p-4 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] md:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--neon-cyan)]" />
                  <h3 className="text-xs sm:text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                    {isEn ? 'Action Buttons (Optional 4 Slots & Order Control)' : '專案動作按鈕設定 (選填 4 格按鈕 & 順序調度)'}
                  </h3>
                </div>
                <span className="text-[11px] text-[var(--text-sub)]/70 font-['Noto_Sans_TC']">
                  {isEn ? 'Leave empty to hide button' : '無填寫之項目於前臺自動隱藏'}
                </span>
              </div>

              {/* 四大行動按鈕網址輸入區塊 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. 展示影片網址 */}
                <CmsUrlInput
                  label={isEn ? '1. Demo Video URL' : '1. 展示影片網址'}
                  icon={<Video className="w-3.5 h-3.5 text-rose-400" />}
                  value={activeProject.videoUrl || activeProject.ytId || ''}
                  onChange={(val) => {
                    handleFieldChange('videoUrl', val);
                    handleFieldChange('ytId', val);
                  }}
                  disabled={isPreview}
                  placeholder="https://www.youtube.com/watch?v=..."
                  isEn={isEn}
                />

                {/* 2. 即時線上展示網址 */}
                <CmsUrlInput
                  label={isEn ? '2. Live Demo URL (Front-end)' : '2. 前往網站前臺 (線上 Demo 連結)'}
                  value={activeProject.websiteUrl || activeProject.liveUrl || ''}
                  onChange={(val) => {
                    handleFieldChange('websiteUrl', val);
                    handleFieldChange('liveUrl', val);
                  }}
                  placeholder="https://example.com"
                  disabled={isPreview}
                  isEn={isEn}
                  icon={<Globe className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />}
                />

                {/* 3. 後臺管理系統網址 */}
                <CmsUrlInput
                  label={isEn ? '3. Admin CMS URL (Back-end)' : '3. 前往後臺網站 (管理後臺 CMS 連結)'}
                  value={activeProject.adminUrl || ''}
                  onChange={(val) => handleFieldChange('adminUrl', val)}
                  placeholder="https://example.com/cms"
                  disabled={isPreview}
                  isEn={isEn}
                  icon={<LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />}
                />

                {/* 4. GitHub 原始碼存放庫網址 */}
                <CmsUrlInput
                  label={isEn ? '4. GitHub Repository URL' : '4. 專案代碼 (GitHub 倉庫連結)'}
                  value={activeProject.githubUrl || ''}
                  onChange={(val) => handleFieldChange('githubUrl', val)}
                  placeholder="https://github.com/..."
                  disabled={isPreview}
                  isEn={isEn}
                  icon={<FolderGit2 className="w-3.5 h-3.5 text-slate-300" />}
                />
              </div>

              {/* 按鈕自訂顯示順序控制器 */}
              <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-['Noto_Sans_TC'] whitespace-nowrap text-[var(--text-main)]">
                    {isEn ? 'Button Display Sequence Order' : '按鈕前臺顯示順序控制'}
                  </span>
                </div>

                {(() => {
                  const currentOrder = activeProject.buttonOrder && activeProject.buttonOrder.length > 0
                    ? [...activeProject.buttonOrder]
                    : ['live', 'admin', 'video', 'github'];
                  const allKeys = ['live', 'admin', 'video', 'github'];
                  for (const k of allKeys) {
                    if (!currentOrder.includes(k)) currentOrder.push(k);
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentOrder.map((key, idx) => {
                        const def = buttonDefinitions[key] || {
                          label_zh: key,
                          label_en: key,
                          icon: null,
                          color: '#cbd5e1',
                        };
                        const configured = isButtonConfigured(key);
                        const isDragging = btnDragging === idx;
                        const isOver = btnDragOver === idx;
                        return (
                          <div
                            key={key}
                            draggable={!isPreview}
                            onDragStart={(e) => handleBtnDragStart(e, idx)}
                            onDragEnd={handleBtnDragEnd}
                            onDragOver={(e) => handleBtnDragOver(e, idx)}
                            onDrop={(e) => handleBtnDrop(e, idx)}
                            className={`p-3 border cyber-cut-sm bg-[var(--card-bg)] flex items-center justify-between gap-3 min-w-0 transition-all ${
                              isDragging ? 'opacity-30 scale-95' : ''
                            } ${isOver ? 'ring-2 ring-[var(--neon-cyan)] scale-[1.02]' : ''}`}
                            style={{ borderColor: configured ? def.color : 'var(--border-color)' }}
                          >
                            <div className="flex items-center gap-2 shrink-0">
                              {!isPreview && (
                                <span
                                  className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80 transition-opacity shrink-0"
                                  title={isEn ? 'Drag to reorder' : '拖曳排序'}
                                >
                                  <GripVertical className="w-3.5 h-3.5 text-[var(--text-sub)]" />
                                </span>
                              )}
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {def.icon}
                                <span className="text-xs font-bold font-['Noto_Sans_TC'] whitespace-nowrap text-[var(--text-main)]">
                                  {isEn ? def.label_en : def.label_zh}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${configured ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`}
                                title={configured ? (isEn ? 'Configured & visible' : '已填寫且前臺顯示') : (isEn ? 'Empty / Hidden' : '未填寫（前臺隱藏）')}
                              />
                              <button
                                type="button"
                                disabled={isPreview || idx === 0}
                                onClick={() => handleMoveButtonOrder(key, 'up')}
                                className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                title={isEn ? 'Move earlier in sequence' : '向前調整順位'}
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={isPreview || idx === currentOrder.length - 1}
                                onClick={() => handleMoveButtonOrder(key, 'down')}
                                className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                title={isEn ? 'Move later in sequence' : '向後調整順位'}
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 專案精簡摘要說明 */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'Project Summary Description' : '專案核心摘要敘述'}
                </label>
                {renderCharCountBadge((isEn ? activeProject.desc_en : activeProject.desc || '').length, 250)}
              </div>
              <textarea
                rows={3}
                value={isEn ? activeProject.desc_en : activeProject.desc}
                onChange={(e) =>
                  handleFieldChange(isEn ? 'desc_en' : 'desc', e.target.value)
                }
                placeholder=""
                className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] leading-relaxed"
              />
            </div>

            {/* 個人核心貢獻清單（一行一項） */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'Core Architecture Contributions' : '核心技術亮點與重要貢獻清單'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                    {isEn ? 'One contribution point per line' : '每一行代表一項重點項目'}
                  </span>
                  {renderCharCountBadge(contributionsText.length, 500)}
                </div>
              </div>
              <textarea
                rows={4}
                value={contributionsText}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                  handleFieldChange(isEn ? 'contributions_en' : 'contributions', lines);
                }}
                placeholder=""
                className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-xs text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] leading-relaxed"
              />
            </div>

            {/* 獲獎與榮譽記錄（一行一項） */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'Honors & Grants (Optional)' : '獲獎紀錄與專案補助 (選填)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                    {isEn ? 'One award per line' : '每一行代表一項獲獎紀錄'}
                  </span>
                  {renderCharCountBadge(honorsText.length, 200)}
                </div>
              </div>
              <textarea
                rows={2}
                value={honorsText}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                  handleFieldChange(isEn ? 'honors_en' : 'honors', lines);
                }}
                placeholder=""
                className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-xs text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] leading-relaxed"
              />
            </div>

            {/* 可拖曳排序與可刪除之技術標籤清單 */}
            <div className="space-y-2 md:col-span-2">
              <CmsTagListEditor
                label={isEn ? 'Tech Stack Tags' : '技術標籤清單'}
                tags={activeProject.tags || []}
                onChange={(newTags) => {
                  handleFieldChange('tags', newTags);
                  showToast(isEn ? 'Tech tags updated!' : '已更新技術標籤清單！');
                }}
                disabled={isPreview}
                placeholder={isEn ? 'Add tech tag...' : '新增標籤...'}
              />
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
