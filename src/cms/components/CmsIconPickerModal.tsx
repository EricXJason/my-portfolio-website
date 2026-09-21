/**
 * ============================================================================
 * 檔案名稱: CmsIconPickerModal.tsx
 * 所屬模組: Portfolio CMS (全域通用圖示選擇彈窗)
 * 責任描述: 負責管理 CMS 各模組之 200+ 大規模 Lucide 向量圖示選擇、即時搜尋與分類篩選。
 * 架構分層: CMS Presentation Layer (Modal Component)
 * 依賴關係: 依賴 ThemeContext 與 Lucide 向量圖示庫。
 * 邊界處理: 彈窗選項內部純圖標展示（無文字）、支援 ESC 鍵快速關閉、搜尋過濾與高對比賽博切角樣式。
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import {
  type IconEntry,
  ICON_LIBRARY,
  getLucideIconByName,
} from '../../utils/iconHelper';

export { type IconEntry, ICON_LIBRARY, getLucideIconByName };

interface CmsIconPickerModalProps {
  isOpen: boolean;
  currentIconName: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
}

/**
 * CmsIconPickerModal
 * 全站 CMS 通用圖示選擇彈窗：
 * 1. 具備即時搜尋列 (Search Bar)
 * 2. 涵蓋 200+ 個高品質官方 Lucide 圖示
 * 3. 圖標選項採用純向量圖示呈現（完全去除文字，高密度俐落方塊）
 * 4. 採用前臺語言選擇 dialog 方形切角 HUD 風格 (cyber-cut-corner, hud-corner-brackets)
 * 5. 支援 ESC 鍵與點擊外部關閉
 */
export const CmsIconPickerModal: React.FC<CmsIconPickerModalProps> = ({
  isOpen,
  currentIconName,
  onSelectIcon,
  onClose,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ESC 鍵關閉
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  // 過濾圖示
  const filteredIcons = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return ICON_LIBRARY.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.labelZh.toLowerCase().includes(term) ||
        item.labelEn.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, activeCategory]);

  if (!isOpen) return null;

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)';
  const bracketCol = isLight ? '#0284c7' : '#00f0ff';

  const categories = [
    { id: 'all', zh: '全部', en: 'All' },
    { id: 'academic', zh: '學術', en: 'Academic' },
    { id: 'dev', zh: '軟體', en: 'Dev' },
    { id: 'hardware', zh: '硬體', en: 'Hardware' },
    { id: 'multimedia', zh: '媒體', en: 'Media' },
    { id: 'business', zh: '商務', en: 'Business' },
    { id: 'security', zh: '資安', en: 'Security' },
    { id: 'tools', zh: '工具', en: 'Tools' },
    { id: 'general', zh: '通用', en: 'General' },
  ];

  const CurrentIconComp = getLucideIconByName(currentIconName);

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
      style={{
        backgroundColor: isLight ? 'rgba(248, 250, 252, 0.65)' : 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="圖示選擇器"
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] border cyber-cut-corner p-5 sm:p-7 shadow-2xl flex flex-col gap-3.5 hud-corner-brackets transition-all duration-300"
        style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 14, 26, 0.96)',
          borderColor: borderCol,
          boxShadow: isLight
            ? '0 20px 50px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)'
            : '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.25)',
          '--hud-bracket-color': bracketCol,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 頂部標題列 */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 border p-[2px] cyber-cut-sm flex items-center justify-center shrink-0"
              style={{
                borderColor: cyanCol,
                backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)',
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: cyanCol }} />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Noto_Sans_TC'] tracking-wide" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {isEn ? 'Universal Icon Library' : '全域圖示庫選擇器'}
              </h3>
              <p className="text-[11px] font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                {isEn ? `${ICON_LIBRARY.length} ICONS AVAILABLE` : `已載入 ${ICON_LIBRARY.length} 款向量圖示`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)' }}
            title={isEn ? 'Close (ESC)' : '關閉 (ESC)'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 搜尋列 */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-sub)] opacity-60 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEn ? 'Search icons by name...' : '搜尋圖示名稱或關鍵字...'}
            className="w-full pl-10 pr-9 py-2 text-xs border cyber-cut-sm bg-[var(--card-inner)] text-[var(--text-main)] outline-none font-['Noto_Sans_TC'] transition-colors"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)' }}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 分類篩選 Tab */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-[11px] font-['Noto_Sans_TC'] font-semibold border cyber-cut-sm shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)] opacity-70 hover:opacity-100'
                }`}
                style={{
                  borderColor: isActive ? cyanCol : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'),
                  backgroundColor: isActive
                    ? (isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)')
                    : 'transparent',
                }}
              >
                {isEn ? cat.en : cat.zh}
              </button>
            );
          })}
        </div>

        {/* 純圖標方塊網格 (完全無文字，高密度俐落方塊) */}
        <div className="flex-1 overflow-y-auto pr-1 max-h-[50vh] grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 p-1">
          {filteredIcons.map((item) => {
            const IconComp = item.component;
            const isSelected = item.name === currentIconName;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onSelectIcon(item.name);
                  onClose();
                }}
                className={`group relative flex items-center justify-center h-10 w-full border cyber-cut-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-[0_0_12px_rgba(0,240,255,0.35)] scale-105 z-10'
                    : 'hover:scale-105 hover:border-[var(--neon-cyan)]'
                }`}
                style={{
                  backgroundColor: isSelected
                    ? (isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.2)')
                    : (isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)'),
                  borderColor: isSelected
                    ? cyanCol
                    : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'),
                }}
                title={item.name}
              >
                {isSelected && (
                  <span
                    className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                    style={{ backgroundColor: cyanCol, color: '#030712' }}
                  >
                    ✓
                  </span>
                )}
                <IconComp
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-sub)] group-hover:text-[var(--text-main)]'
                  }`}
                  style={{ color: isSelected ? cyanCol : undefined }}
                />
              </button>
            );
          })}

          {filteredIcons.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[var(--text-sub)] gap-2">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-xs font-['Noto_Sans_TC']">
                {isEn ? 'No icons found matching your keyword.' : '查無符合此關鍵字的圖示。'}
              </p>
            </div>
          )}
        </div>

        {/* 頁尾資訊：簡潔圖示預覽與關閉 */}
        <div className="flex items-center justify-between pt-2 border-t text-[11px] font-mono text-[var(--text-sub)]" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase opacity-70">{isEn ? 'Active:' : '目前圖示:'}</span>
            <div className="w-6 h-6 border cyber-cut-sm flex items-center justify-center bg-[var(--card-inner)]" style={{ borderColor: cyanCol }}>
              <CurrentIconComp className="w-3.5 h-3.5" style={{ color: cyanCol }} />
            </div>
            <span className="text-[10px] font-mono opacity-80">{currentIconName || 'star'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] cursor-pointer"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)' }}
          >
            {isEn ? 'Cancel' : '取消'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CmsIconPickerModal;
