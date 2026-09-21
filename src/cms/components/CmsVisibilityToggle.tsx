/**
 * ============================================================================
 * 檔案名稱: CmsVisibilityToggle.tsx
 * 所屬模組: Portfolio CMS (全域統一前臺可視性開關)
 * 責任描述: 封裝工整、賽博科技風、固定青色主題的前臺顯示/隱藏切換控制元件。
 * 設計規範: 嚴格遵循直角/切角科技風（cyber-cut-sm rounded-none），開啟固定為青色（#00f0ff），
 *           關閉為暗灰科技黑底，杜絕雜色（嚴禁黃色/紅色圓角），提供一致的 UI/UX。
 * ============================================================================
 */

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLang } from '../../context/LangContext';

export interface CmsVisibilityToggleProps {
  visible?: boolean;
  checked?: boolean;
  onChange: (newVisible: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  showLabel?: boolean;
  className?: string;
  title?: string;
}

export const CmsVisibilityToggle: React.FC<CmsVisibilityToggleProps> = ({
  visible,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  showLabel = false,
  className = '',
  title,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';

  const isVisible = checked !== undefined ? checked : (visible !== undefined ? visible : true);

  const defaultTitle = isVisible
    ? (isEn ? 'Visible on site (Click to hide)' : '前臺正常展示中（點擊隱藏）')
    : (isEn ? 'Hidden from site (Click to show)' : '已從前臺隱藏（點擊恢復展示）');

  const displayText = label || (isVisible ? (isEn ? 'Show' : '顯示') : (isEn ? 'Hidden' : '隱藏'));

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange(!isVisible);
        }
      }}
      title={title || defaultTitle}
      aria-label={title || defaultTitle}
      className={`inline-flex items-center justify-center border-none bg-transparent select-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 shrink-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 p-1 hover:opacity-80 ${
        size === 'sm'
          ? (showLabel ? 'gap-1 text-[10px]' : 'w-7 h-7')
          : (showLabel ? 'gap-1.5 text-xs' : 'w-8 h-8')
      } ${
        isVisible
          ? 'text-[var(--neon-cyan)]'
          : 'text-slate-500 hover:text-slate-300'
      } ${className}`}
      style={{
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      {isVisible ? (
        <Eye className={size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} style={{ color: '#00f0ff' }} />
      ) : (
        <EyeOff className={size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
      )}
      {showLabel && (
        <span className="font-semibold tracking-wider font-mono text-xs">{displayText}</span>
      )}
    </button>
  );
};

export default CmsVisibilityToggle;
