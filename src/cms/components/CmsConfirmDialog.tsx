/**
 * ============================================================================
 * 檔案名稱: CmsConfirmDialog.tsx
 * 所屬模組: Portfolio CMS (全域通用二次確認對話框)
 * 責任描述: 負責管理 CMS 各模組存檔、還原預設、刪除與離開確認之模態視窗渲染及鍵盤快捷監聽。
 * 架構分層: CMS Presentation Layer (Modal Component)
 * 依賴關係: 依賴 ThemeContext 與 Lucide 向量圖示庫。
 * 邊界處理: 嚴格遵循 React Rules of Hooks 無條件調用 useEffect、支援 ESC 與外層點擊取消、全方形賽博風格保證。
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Save, Trash2, RotateCcw, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface CmsConfirmDialogState {
  isOpen: boolean;
  type: 'save' | 'reset' | 'delete' | null;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;
}

interface CmsConfirmDialogProps {
  dialog: CmsConfirmDialogState;
  onClose: () => void;
  isEn: boolean;
}

export const EMPTY_DIALOG: CmsConfirmDialogState = {
  isOpen: false,
  type: null,
  title: '',
  message: '',
  confirmText: '',
  cancelText: undefined,
  onConfirm: undefined,
};

export const CmsConfirmDialog: React.FC<CmsConfirmDialogProps> = ({
  dialog,
  onClose,
  isEn,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (!dialog.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog.isOpen, onClose]);

  if (!dialog.isOpen) return null;

  const isDanger = dialog.type === 'reset' || dialog.type === 'delete';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)';
  const cyanCol   = isLight ? '#0284c7' : '#00f0ff';
  const roseCol   = '#f43f5e';

  const IconComponent =
    dialog.type === 'delete' ? Trash2
    : dialog.type === 'reset' ? RotateCcw
    : Save;

  const accentColor = isDanger ? roseCol : cyanCol;

  const handleConfirm = () => {
    if (dialog.onConfirm) dialog.onConfirm();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 select-none"
      style={{
        backgroundColor: isLight ? 'rgba(248, 250, 252, 0.70)' : 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md border cyber-cut-corner p-6 sm:p-7 shadow-2xl flex flex-col gap-5 hud-corner-brackets"
        style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 14, 26, 0.98)',
          borderColor: isDanger
            ? (isLight ? '#fda4af' : 'rgba(244, 63, 94, 0.55)')
            : borderCol,
          boxShadow: isDanger
            ? (isLight
                ? '0 20px 50px rgba(244,63,94,0.12), 0 0 0 1px rgba(255,255,255,0.8)'
                : '0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(244,63,94,0.25)')
            : (isLight
                ? '0 20px 50px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.8)'
                : '0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(0,240,255,0.18)'),
          '--hud-bracket-color': accentColor,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉對話框按鈕 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors cursor-pointer"
          style={{ color: isLight ? '#64748b' : 'rgba(148,163,184,0.7)' }}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 圖示與標題列 */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border cyber-cut-sm flex items-center justify-center shrink-0"
            style={{
              borderColor: isDanger
                ? (isLight ? roseCol : 'rgba(244,63,94,0.5)')
                : (isLight ? cyanCol : 'rgba(0,240,255,0.4)'),
              backgroundColor: isDanger
                ? (isLight ? '#fff1f2' : 'rgba(244,63,94,0.12)')
                : (isLight ? '#f0f9ff' : 'rgba(0,240,255,0.10)'),
              color: accentColor,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <h3
            className="text-base font-black font-hud uppercase tracking-wide leading-tight"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            {dialog.title}
          </h3>
        </div>

        {/* 提示訊息內容 */}
        <p
          className="text-xs sm:text-sm font-['Noto_Sans_TC'] leading-relaxed"
          style={{ color: isLight ? '#475569' : '#94a3b8' }}
        >
          {dialog.message}
        </p>

        {/* 操作按鈕組：[取消] [確認] */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-11 border cyber-cut-corner font-bold text-sm font-tech transition-all cursor-pointer flex items-center justify-center hover:bg-slate-500/10 active:scale-[0.97]"
            style={{
              borderColor: isLight ? '#cbd5e1' : 'rgba(148,163,184,0.3)',
              color: isLight ? '#475569' : '#94a3b8',
              backgroundColor: isLight ? '#f8fafc' : 'rgba(15,23,42,0.6)',
            }}
          >
            {dialog.cancelText || (isEn ? 'Cancel' : '取消')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 border cyber-cut-corner font-bold text-sm font-tech transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              backgroundColor: isDanger
                ? (isLight ? '#fff1f2' : 'rgba(244,63,94,0.18)')
                : (isLight ? '#f0f9ff' : 'rgba(0,240,255,0.15)'),
              borderColor: isDanger
                ? (isLight ? roseCol : 'rgba(244,63,94,0.6)')
                : (isLight ? cyanCol : '#00f0ff'),
              color: isDanger ? roseCol : cyanCol,
            }}
          >
            {dialog.confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CmsConfirmDialog;
