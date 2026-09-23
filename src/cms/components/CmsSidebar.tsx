/**
 * ============================================================================
 * 檔案名稱: CmsSidebar.tsx
 * 所屬模組: Portfolio CMS (側邊欄導覽系統)
 * 責任描述: 負責管理 CMS 各模組選單導覽、模組上下排序拖曳、快捷外鏈導航與響應式抽屜開合。
 * 架構分層: CMS Presentation Layer (Layout Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、TechIcon 與前臺共用導覽設定。
 * 邊界處理: 鎖定首頁置頂不可移位、阻斷無權限非活躍存取、防範拖曳越界與響應式遮罩同步。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Home,
  User,
  Cpu,
  FolderGit2,
  Award,
  Briefcase,
  Image,
  X,
  RotateCcw,
  Lock,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { TechIcon } from '../../components/icons/TechIcon';
import { CmsVisibilityToggle } from './CmsVisibilityToggle';

export interface NavItem {
  id: string;
  titleZh: string;
  titleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAccent?: boolean;
}

export const DEFAULT_MODULE_ORDER = [
  'home',
  'about',
  'projects',
  'skills',
  'experience',
  'awards',
  'gallery',
];

export const DEFAULT_MODULE_VISIBILITY: Record<string, boolean> = {
  home: true,
  about: true,
  projects: true,
  skills: true,
  experience: true,
  awards: true,
  gallery: true,
};

export const CMS_NAV_ITEMS: NavItem[] = [
  {
    id: 'site-settings',
    titleZh: '網站設定',
    titleEn: 'Site Settings',
    icon: Settings,
  },
  {
    id: 'home',
    titleZh: '首頁',
    titleEn: 'Home',
    icon: Home,
  },
  {
    id: 'about',
    titleZh: '關於我',
    titleEn: 'About',
    icon: User,
  },
  {
    id: 'projects',
    titleZh: '專案作品',
    titleEn: 'Projects',
    icon: FolderGit2,
  },
  {
    id: 'skills',
    titleZh: '專業技能',
    titleEn: 'Skills',
    icon: Cpu,
  },
  {
    id: 'experience',
    titleZh: '經歷',
    titleEn: 'Experience',
    icon: Briefcase,
  },
  {
    id: 'awards',
    titleZh: '專業證照',
    titleEn: 'Awards',
    icon: Award,
  },
  {
    id: 'gallery',
    titleZh: '美術畫廊',
    titleEn: 'Art Gallery',
    icon: Image,
  },
];

const NAV_ITEM_MAP: Record<string, NavItem> = CMS_NAV_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, NavItem>);

interface CmsSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onExitToSite?: () => void;
}

export const CmsSidebar: React.FC<CmsSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onExitToSite,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [moduleOrder, setModuleOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_modules_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const withoutHome = parsed.filter((id: string) => id !== 'home' && NAV_ITEM_MAP[id]);
          return ['home', ...withoutHome];
        }
      }
    } catch {
      // 解析失敗回退至預設值
    }
    return DEFAULT_MODULE_ORDER;
  });

  // 側邊選單模組拖放排序狀態
  const dragSourceRef = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    const handleOrderUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolio_modules_order');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const withoutHome = parsed.filter((id: string) => id !== 'home' && NAV_ITEM_MAP[id]);
            setModuleOrder(['home', ...withoutHome]);
            return;
          }
        }
      } catch {
        // 解析失敗回退至預設順序
      }
      setModuleOrder(DEFAULT_MODULE_ORDER);
    };

    window.addEventListener('portfolio_modules_order_updated', handleOrderUpdate);
    window.addEventListener('storage', handleOrderUpdate);
    return () => {
      window.removeEventListener('portfolio_modules_order_updated', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, []);

  // 模組可見度狀態（除首頁恆常置頂鎖定外，其餘皆可個別於前臺開關）
  const [moduleVisibility, setModuleVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('portfolio_modules_visibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_MODULE_VISIBILITY, ...parsed, home: true };
        }
      }
    } catch {}
    return DEFAULT_MODULE_VISIBILITY;
  });

  useEffect(() => {
    const handleVisUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolio_modules_visibility');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setModuleVisibility({ ...DEFAULT_MODULE_VISIBILITY, ...parsed, home: true });
            return;
          }
        }
      } catch {}
      setModuleVisibility(DEFAULT_MODULE_VISIBILITY);
    };

    window.addEventListener('portfolio_modules_visibility_updated', handleVisUpdate);
    window.addEventListener('storage', handleVisUpdate);
    return () => {
      window.removeEventListener('portfolio_modules_visibility_updated', handleVisUpdate);
      window.removeEventListener('storage', handleVisUpdate);
    };
  }, []);

  const { isDirty: _isDirty, setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  const handleToggleModuleVisibility = async (moduleId: string, visible: boolean) => {
    if (moduleId === 'home') return;
    const next = { ...moduleVisibility, [moduleId]: visible, home: true };
    setModuleVisibility(next);
    setIsDirty(true); // 標記未存檔狀態，離開時強制跳出警告確認
    try {
      localStorage.setItem('portfolio_modules_visibility', JSON.stringify(next));
      window.dispatchEvent(new Event('portfolio_modules_visibility_updated'));
    } catch {}

    // 即時同步推送到 Firestore 的 site_settings
    try {
      const curSettings = data.site_settings || {};
      await updateDocument('site_settings', {
        ...curSettings,
        modules_visibility: next,
      });
    } catch (e) {
      console.error('[CmsSidebar]: Failed to persist modules_visibility to Firestore:', e);
    }
  };

  /**
   * [模組排序持久化] 儲存全站模組自訂排版順序
   * 更新至 local 儲存層與狀態事件匯流排，使全站各導覽組件即時同步。
   */
  const saveOrder = async (newOrder: string[]) => {
    const sanitized = ['home', ...newOrder.filter((id) => id !== 'home')];
    setModuleOrder(sanitized);
    setIsDirty(true); // 標記未存檔狀態
    try {
      localStorage.setItem('portfolio_modules_order', JSON.stringify(sanitized));
      window.dispatchEvent(new Event('portfolio_modules_order_updated'));
    } catch {
      // 忽略例外
    }

    // 即時同步推送到 Firestore 的 site_settings
    try {
      const curSettings = data.site_settings || {};
      await updateDocument('site_settings', {
        ...curSettings,
        modules_order: sanitized,
      });
    } catch (e) {
      console.error('[CmsSidebar]: Failed to persist modules_order to Firestore:', e);
    }
  };

  const resetOrder = async () => {
    setModuleOrder(DEFAULT_MODULE_ORDER);
    setIsDirty(true); // 標記未存檔狀態
    try {
      localStorage.removeItem('portfolio_modules_order');
      window.dispatchEvent(new Event('portfolio_modules_order_updated'));
    } catch {
      // 忽略例外
    }

    try {
      const curSettings = data.site_settings || {};
      await updateDocument('site_settings', {
        ...curSettings,
        modules_order: DEFAULT_MODULE_ORDER,
      });
    } catch (e) {
      console.error('[CmsSidebar]: Failed to reset modules_order in Firestore:', e);
    }
  };

  // ── 側邊選單拖曳事件處理函式 ────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (itemId === 'home') return;
    dragSourceRef.current = itemId;
    setDraggingId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
    dragSourceRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (itemId === 'home' || dragSourceRef.current === itemId) return;
    setDragOverId(itemId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = dragSourceRef.current;
    if (!sourceId || sourceId === targetId || targetId === 'home') {
      setDraggingId(null);
      setDragOverId(null);
      dragSourceRef.current = null;
      return;
    }

    const sourceIdx = moduleOrder.indexOf(sourceId);
    const targetIdx = moduleOrder.indexOf(targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const newOrder = [...moduleOrder];
    const [removed] = newOrder.splice(sourceIdx, 1);
    newOrder.splice(targetIdx, 0, removed);
    saveOrder(newOrder);

    setDraggingId(null);
    setDragOverId(null);
    dragSourceRef.current = null;
  };

  const handleMoveModule = (itemId: string, direction: 'up' | 'down') => {
    if (itemId === 'home') return;
    const currentIdx = moduleOrder.indexOf(itemId);
    if (currentIdx === -1) return;
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 1 || targetIdx >= moduleOrder.length) return;

    const newOrder = [...moduleOrder];
    const [removed] = newOrder.splice(currentIdx, 1);
    newOrder.splice(targetIdx, 0, removed);
    saveOrder(newOrder);
  };

  const getItemTitle = (item: NavItem): string => {
    return isEn ? item.titleEn : item.titleZh;
  };

  const isOrderModified =
    moduleOrder.length !== DEFAULT_MODULE_ORDER.length ||
    moduleOrder.some((id, i) => id !== DEFAULT_MODULE_ORDER[i]);

  const siteSettingsItem = NAV_ITEM_MAP['site-settings'];
  const orderedNavItems: NavItem[] = moduleOrder
    .map((id) => NAV_ITEM_MAP[id])
    .filter(Boolean);

  return (
    <>
      {/* 行動端背景遮罩 */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* 側邊欄容器 — 方正科技設計 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ease-out backdrop-blur-xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 側邊欄品牌標頭 */}
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 border p-[2px] cyber-cut-sm flex items-center justify-center shadow-md shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isLight ? '#e0f2fe' : '#080e1a',
                borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.5)',
              }}
            >
              <div
                className="font-hud font-black text-[11px] tracking-wider"
                style={{ color: isLight ? '#0284c7' : '#00f0ff' }}
              >
                &lt;JP/&gt;
              </div>
            </div>
            <div className="font-['Orbitron',sans-serif] font-bold text-sm tracking-wider text-[var(--text-main)]">
              PORTFOLIO <span className="text-[var(--neon-cyan)]">CMS</span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--card-inner)] lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 模組導覽清單 — 嚴格筆直對齊之基準線 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {/* 網站設定置底釘選 — 固定不參與拖曳 */}
          {siteSettingsItem && (
            <div className="mb-2.5">
              <button
                type="button"
                onClick={() => {
                  onSelectTab(siteSettingsItem.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] transition-all cursor-pointer ${
                  activeTab === siteSettingsItem.id
                    ? 'bg-[var(--cat-icon-bg)] text-[var(--neon-cyan)] border-[var(--cat-icon-border)] font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--card-inner)] border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Settings
                      className={`w-4 h-4 ${
                        activeTab === siteSettingsItem.id
                          ? 'text-[var(--neon-cyan)]'
                          : 'text-[var(--text-sub)]'
                      }`}
                    />
                  </div>
                  <span className="truncate">{getItemTitle(siteSettingsItem)}</span>
                </div>
              </button>
            </div>
          )}

          {/* 可拖曳模組項目（科技感方形對齊樣式） */}
          {orderedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHome = item.id === 'home';
            const isDragging = draggingId === item.id;
            const isOver = dragOverId === item.id;
            const itemIdx = moduleOrder.indexOf(item.id);

            return (
              <div
                key={item.id}
                draggable={!isHome}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`group relative flex items-center border cyber-cut-sm transition-all duration-150 ${
                  isDragging ? 'opacity-40 scale-95' : ''
                } ${
                  isOver && !isHome
                    ? 'ring-1 ring-[var(--neon-cyan)]/50 bg-[var(--neon-cyan)]/5'
                    : 'border-transparent'
                }`}
              >
                <div
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-['Noto_Sans_TC'] transition-all ${
                    isActive
                      ? 'bg-[var(--cat-icon-bg)] text-[var(--neon-cyan)] border-[var(--cat-icon-border)] font-bold shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--card-inner)] border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[var(--neon-cyan)]'
                            : item.isAccent
                            ? 'text-amber-400'
                            : 'text-[var(--text-sub)]'
                        }`}
                      />
                    </div>
                    <span className="truncate">{getItemTitle(item)}</span>
                  </button>

                  <div className="flex items-center gap-0.5 shrink-0">
                    {/* 首頁鎖定徽章（不可調整順序） */}
                    {isHome && (
                      <span
                        title={isEn ? 'Locked at top' : '置頂鎖定'}
                        className="p-1 border cyber-cut-sm text-[var(--neon-cyan)] bg-[var(--card-bg)] border-[var(--border-color)]/60 flex items-center justify-center"
                      >
                        <Lock className="w-3 h-3 text-[var(--neon-cyan)]" />
                      </span>
                    )}

                    {/* 右側：前臺顯示開關、上移、下移與拖曳手把按鈕組 */}
                    {!isHome && (
                      <div className="flex items-center gap-1.5">
                        <div onClick={(e) => e.stopPropagation()}>
                          <CmsVisibilityToggle
                            checked={moduleVisibility[item.id] !== false}
                            onChange={(val) => handleToggleModuleVisibility(item.id, val)}
                            size="sm"
                            title={
                              moduleVisibility[item.id] !== false
                                ? (isEn ? 'Visible on website — Click to hide' : '於前臺展示中（點擊隱藏此模組）')
                                : (isEn ? 'Hidden from website — Click to show' : '已從前臺隱藏（點擊恢復展示）')
                            }
                          />
                        </div>
                        <button
                          type="button"
                          disabled={itemIdx <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveModule(item.id, 'up');
                          }}
                          className="p-1 text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title={isEn ? 'Move module up' : '向上移動順位'}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={itemIdx >= moduleOrder.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveModule(item.id, 'down');
                          }}
                          className="p-1 text-[var(--text-sub)] hover:text-[var(--neon-cyan)] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          title={isEn ? 'Move module down' : '向下移動順位'}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <div
                          className="p-1 text-[var(--text-sub)] opacity-70 hover:opacity-100 hover:text-[var(--neon-cyan)] transition-opacity cursor-grab active:cursor-grabbing"
                          title={isEn ? 'Drag to reorder module' : '拖曳調整模組順序'}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 重設排序控制項（固定於最下方） */}
          {isOrderModified && (
            <div className="flex items-center justify-center pt-3 pb-1">
              <button
                type="button"
                onClick={resetOrder}
                title={isEn ? 'Reset to default order' : '還原預設順序'}
                className="flex items-center gap-1.5 px-3 py-1.5 border cyber-cut-sm text-[11px] font-['Noto_Sans_TC'] text-[var(--neon-cyan)] bg-[var(--card-inner)] border-[var(--border-color)] hover:border-[var(--neon-cyan)] cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isEn ? 'Reset Order' : '還原順序'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 底部外部管理控制臺快速連結（GitHub、Firebase、Cloudflare Pages） */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--card-inner)]/50">
          <div className="grid grid-cols-3 gap-2">
            {/* 1. GitHub 存放庫連結 */}
            <a
              href="https://github.com/EricXJason/my-portfolio-website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold transition-all hover:scale-105 group"
              style={{
                backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.8)',
                borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)',
                color: isLight ? '#0f172a' : '#cbd5e1',
              }}
              title="GitHub Repository"
            >
              <TechIcon name="github" size={16} className="mb-1 group-hover:scale-110 transition-transform" />
              <span className="truncate">GitHub</span>
            </a>

            {/* 2. Firebase 主控臺連結 */}
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold transition-all hover:scale-105 group"
              style={{
                backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.8)',
                borderColor: isLight ? '#cbd5e1' : 'rgba(245,158,11,0.25)',
                color: isLight ? '#b45309' : '#fbbf24',
              }}
              title="Firebase Console"
            >
              <TechIcon name="firebase" size={16} className="mb-1 group-hover:scale-110 transition-transform" />
              <span className="truncate">Firebase</span>
            </a>

            {/* 3. Cloudflare Pages 主控臺連結 */}
            <a
              href="https://dash.cloudflare.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold transition-all hover:scale-105 group"
              style={{
                backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.8)',
                borderColor: isLight ? '#cbd5e1' : 'rgba(249,115,22,0.25)',
                color: isLight ? '#c2410c' : '#fb923c',
              }}
              title="Cloudflare Pages Dashboard"
            >
              <TechIcon name="cloudflare" size={16} className="mb-1 group-hover:scale-110 transition-transform" />
              <span className="truncate">Cloudflare</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CmsSidebar;
