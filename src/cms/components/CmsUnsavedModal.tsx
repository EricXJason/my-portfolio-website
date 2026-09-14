/**
 * ============================================================================
 * 檔案名稱: CmsUnsavedModal.tsx
 * 所屬模組: Portfolio CMS (未儲存變更三鍵確認對話框)
 * 責任描述: 負責於使用者跳轉頁面或離開系統時，針對未儲存髒污表單提供「儲存並離開」、「放棄並離開」、「留在本頁」三向安全防護。
 * 架構分層: CMS Presentation Layer (Modal Component)
 * 依賴關係: 依賴 LangContext 與 ThemeContext。
 * 邊界處理: 支援 ESC 鍵與 X 按鈕預設為留在本頁、鏡像對齊前臺語言選擇彈窗方形科技切角風格。
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { AlertTriangle, X, Save, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

interface CmsUnsavedModalProps {
  isOpen: boolean;
  onSaveAndLeave: () => void;
  onDiscardAndLeave: () => void;
  onStayOnPage: () => void;
}

/**
 * 嚴格統一風格之未儲存變更確認對話框
 * 1. 符合前臺語言選擇 dialog 方形切角科技風 (cyber-cut-corner, hud-corner-brackets)
 * 2. 嚴格落實由左至右三鍵順序：
 *    [儲存變更並離開] | [放棄變更並離開] | [留在本頁]
 * 3. 點擊右上角「X」與鍵盤「ESC」皆為「留在本頁」
 * 4. 嚴格相容深淺色模式與 WCAG 對比標準
 */
export const CmsUnsavedModal: React.FC<CmsUnsavedModalProps> = ({
  isOpen,
  onSaveAndLeave,
  onDiscardAndLeave,
  onStayOnPage,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // 監聽鍵盤 ESC 鍵：留在本頁
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        onStayOnPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onStayOnPage]);

  if (!isOpen) return null;

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.4)';
  const bracketCol = isLight ? '#0284c7' : '#00f0ff';

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
      style={{
        backgroundColor: isLight ? 'rgba(248, 250, 252, 0.65)' : 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onStayOnPage}
      role="dialog"
      aria-modal="true"
      aria-label="未儲存變更提示"
    >
      <div
        className="relative w-full max-w-lg border cyber-cut-corner p-6 sm:p-7 shadow-2xl flex flex-col gap-5 hud-corner-brackets transition-all duration-300"
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
        <div className="w-full flex items-center justify-between border-b pb-3.5" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 border p-[2px] cyber-cut-sm flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.12)',
                borderColor: isLight ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)',
              }}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-black font-['Noto_Sans_TC'] tracking-wide" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {isEn ? 'Unsaved Modifications' : '未儲存修改提示'}
              </h3>
              <p className="text-[11px] font-['Share_Tech_Mono'] text-[var(--text-sub)]">
                {isEn ? 'ACTION CONFIRMATION REQUIRED' : '系統操作前置確認'}
              </p>
            </div>
          </div>

          {/* 右上角 X：留在本頁 */}
          <button
            type="button"
            onClick={onStayOnPage}
            className="p-1.5 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)' }}
            title={isEn ? 'Stay on Page (ESC)' : '留在本頁 (ESC)'}
            aria-label="留在本頁"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 訊息內容主體 */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-['Noto_Sans_TC'] leading-relaxed" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
            {isEn
              ? 'You have uncommitted modifications in this module. Choose whether you want to save the current data before leaving, discard your edits, or remain on the current page.'
              : '您在當前模組中有尚未存檔的編輯資料。請選擇是否要在離開前「儲存變更」，或是「放棄變更」，亦可選擇「留在本頁」繼續編輯。'}
          </p>
        </div>

        {/* 操作按鈕組：嚴格順序 [儲存變更並離開] | [放棄變更並離開] | [留在本頁] */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          {/* 按鈕 1: 儲存變更並離開 */}
          <button
            type="button"
            onClick={onSaveAndLeave}
            className="flex-1 sm:flex-initial px-4 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
            style={{
              backgroundColor: cyanCol,
              color: '#030712',
              borderColor: cyanCol,
            }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEn ? 'Save & Leave' : '儲存變更並離開'}</span>
          </button>

          {/* 按鈕 2: 放棄變更並離開 */}
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="flex-1 sm:flex-initial px-4 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-rose-500 hover:bg-rose-500/10"
            style={{
              backgroundColor: isLight ? '#fff1f2' : 'rgba(244, 63, 94, 0.08)',
              borderColor: isLight ? '#fecdd3' : 'rgba(244, 63, 94, 0.35)',
            }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{isEn ? 'Discard & Leave' : '放棄變更並離開'}</span>
          </button>

          {/* 按鈕 3: 留在本頁 */}
          <button
            type="button"
            onClick={onStayOnPage}
            className="flex-1 sm:flex-initial px-4 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#080e1a',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
              color: isLight ? '#0f172a' : '#cbd5e1',
            }}
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Stay on Page' : '留在本頁'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
