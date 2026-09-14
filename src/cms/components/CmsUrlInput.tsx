/**
 * ============================================================================
 * 檔案名稱: CmsUrlInput.tsx
 * 所屬模組: Portfolio CMS (通用表單輸入元件模組)
 * 責任描述: 負責提供標準化 URL 輸入框與緊鄰右側之「前往網址 (Visit URL)」按鈕，支援預覽模式下點擊前往。
 * 架構分層: CMS Presentation Layer (Form Input Component)
 * 依賴關係: 依賴 Lucide Icon (ExternalLink) 與 Tailwind 樣式系統。
 * 邊界處理: 空白網址防禦禁用、缺少協定自動補齊 https://、預覽模式輸入鎖定但維持前往連結可點擊。
 * ============================================================================
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface CmsUrlInputProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isEn?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const CmsUrlInput: React.FC<CmsUrlInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  isEn = false,
  className = '',
  icon,
}) => {
  const trimmedUrl = (value || '').trim();
  const hasValidUrl = trimmedUrl.length > 0;

  const handleTestUrl = () => {
    if (!hasValidUrl) return;
    const finalUrl = trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
      ? trimmedUrl
      : `https://${trimmedUrl}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-[var(--text-sub)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
          {icon}
          <span>{label}</span>
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3.5 py-2 text-xs border cyber-cut-sm bg-[var(--card-inner)] text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono'] transition-all"
        />
        <button
          type="button"
          onClick={handleTestUrl}
          disabled={!hasValidUrl}
          className={`shrink-0 px-3 py-2 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold flex items-center gap-1.5 transition-all select-none ${
            hasValidUrl
              ? 'bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/15 hover:border-[var(--neon-cyan)] cursor-pointer active:scale-95 shadow-xs'
              : 'bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] opacity-40 cursor-not-allowed'
          }`}
          title={isEn ? 'Open and visit this URL in a new tab' : '在新分頁開啟前往此網址'}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{isEn ? 'Visit URL' : '前往網址'}</span>
        </button>
      </div>
    </div>
  );
};
