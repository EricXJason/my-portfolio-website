/**
 * ============================================================================
 * 檔案名稱: CmsHeader.tsx
 * 所屬模組: Portfolio CMS (頂部狀態與操作導覽列)
 * 責任描述: 負責管理 CMS 頂部麵包屑、當前分頁標題、深淺色切換開關、雙語國際化切換、
 *           可點擊「管理者模式」徽章（確認後返回模式選擇）與返回使用者模式按鈕。
 * 架構分層: CMS Presentation Layer (Layout Component)
 * 依賴關係: 依賴 ThemeContext、LangContext、CmsModeContext 與 CmsConfirmDialog。
 * 邊界處理: 點擊管理者模式徽章跳確認 dialog 再回到模式選擇、返回使用者模式附確認防護。
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, User, Shield, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { useCmsMode } from '../context/CmsModeContext';
import { CmsConfirmDialog, CmsConfirmDialogState, EMPTY_DIALOG } from './CmsConfirmDialog';

interface CmsHeaderProps {
  currentTabName: string;
  onOpenMobile: () => void;
  onExitToSite?: () => void;
  onSwitchMode?: () => void;
}

/**
 * CmsHeader
 * CMS 頂部導覽列：
 * 1. 「管理者模式」徽章可點擊 → 若有未儲存則觸發三選項對話框，否則返回模式選擇畫面。
 * 2. 「返回使用者模式」按鈕附 User icon，點擊後回到前臺（支援未儲存防護）。
 * 3. 雙語（EN/中）與深淺色即時切換開關。
 */
export const CmsHeader: React.FC<CmsHeaderProps> = ({
  currentTabName,
  onOpenMobile,
  onExitToSite,
  onSwitchMode,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const { mode, signOut } = useCmsMode();
  const [modeExitDialog, setModeExitDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);
  const navigate = useNavigate();

  const isLight = theme === 'light';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const isEn = lang === 'en';

  const handleReturnToSite = () => {
    if (onExitToSite) {
      onExitToSite();
    } else {
      navigate('/');
    }
  };

  // 點擊管理者模式徽章 → 若外部有未存檔攔截機制則交由外部處理三選項對話框
  const handleModeBadgeClick = () => {
    if (onSwitchMode) {
      onSwitchMode();
      return;
    }
    setModeExitDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Return to Mode Selection' : '返回存取模式選擇',
      message: isEn
        ? 'Are you sure you want to leave Admin Mode and return to the Access Mode Selection screen?'
        : '確定要離開管理者模式並返回存取模式選擇畫面嗎？',
      confirmText: isEn ? 'Confirm' : '確認',
      cancelText: isEn ? 'Cancel' : '取消',
      onConfirm: () => {
        setModeExitDialog(EMPTY_DIALOG);
        signOut();
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
      {/* 左側：行動端開關與導覽階層 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--card-inner)] lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-['Share_Tech_Mono']">
          <span className="text-[var(--text-sub)] hidden sm:inline">CMS</span>
          <span className="text-[var(--text-sub)]/50 hidden sm:inline">/</span>
          <span className="font-bold text-[var(--neon-cyan)] tracking-wide font-['Noto_Sans_TC']">
            {currentTabName}
          </span>
        </div>
      </div>

      {/* 退出模式二次確認對話框 */}
      <CmsConfirmDialog
        dialog={modeExitDialog}
        onClose={() => setModeExitDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 右側：功能動作按鈕 */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 語系切換器 (與前臺導覽列一致之風格) */}
        <button
          onClick={toggleLang}
          className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer font-tech text-xs font-bold active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
          style={{
            backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
            borderColor: borderCol,
          }}
          aria-label={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
          title={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
        >
          <div className="w-full h-full flex items-center justify-between pointer-events-none z-0">
            <span
              className="w-1/2 text-center text-[10px] sm:text-xs font-bold"
              style={{ color: lang === 'en' ? 'transparent' : (isLight ? '#475569' : '#94a3b8') }}
            >
              EN
            </span>
            <span
              className="w-1/2 text-center text-[10px] sm:text-xs font-bold"
              style={{ color: lang === 'zh' ? 'transparent' : (isLight ? '#475569' : '#94a3b8') }}
            >
              中
            </span>
          </div>
          <div
            className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm text-[10px] sm:text-xs font-black"
            style={{
              transform: lang === 'zh' ? 'translateX(100%)' : 'translateX(0%)',
              backgroundColor: isLight ? '#0369a1' : '#00f0ff',
              color: isLight ? '#ffffff' : '#030712',
            }}
          >
            {lang === 'en' ? 'EN' : '中'}
          </div>
        </button>

        {/* 外觀主題切換器 (與前臺導覽列一致之風格) */}
        <button
          onClick={toggleTheme}
          className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
          style={{
            backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
            borderColor: borderCol,
          }}
          aria-label={isLight ? '切換為深色模式' : '切換為淺色模式'}
          title={isLight ? '深色模式' : '淺色模式'}
        >
          <div className="w-full h-full flex items-center justify-between pointer-events-none z-0 px-1">
            <div className="w-1/2 flex items-center justify-center">
              <Sun size={12} className="text-amber-400 font-bold opacity-80" />
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <Moon size={12} className="text-cyan-400 font-bold opacity-80" />
            </div>
          </div>
          <div
            className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm"
            style={{
              transform: isLight ? 'translateX(0%)' : 'translateX(100%)',
              backgroundColor: isLight ? '#fbbf24' : '#00f0ff',
              color: '#0f172a',
            }}
          >
            {isLight ? (
              <Sun size={13} className="fill-current text-slate-900" />
            ) : (
              <Moon size={13} className="fill-current text-slate-900" />
            )}
          </div>
        </button>

        {/* 模式徽章（點擊管理者模式，經確認後返回模式選擇） */}
        {mode === 'admin' && (
          <button
            type="button"
            onClick={handleModeBadgeClick}
            title={isEn ? 'Click to return to mode selection' : '點擊可返回存取模式選擇'}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 hover:opacity-80"
            style={{
              backgroundColor: isLight ? 'rgba(3,105,161,0.1)' : 'rgba(0,240,255,0.1)',
              borderColor: isLight ? 'rgba(3,105,161,0.35)' : 'rgba(0,240,255,0.35)',
              color: isLight ? '#0369a1' : '#00f0ff',
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isEn ? 'Admin Mode' : '管理者模式'}</span>
          </button>
        )}
        {mode === 'preview' && (
          <button
            type="button"
            onClick={handleModeBadgeClick}
            title={isEn ? 'Click to return to mode selection' : '點擊可返回存取模式選擇'}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 hover:opacity-80"
            style={{
              backgroundColor: isLight ? 'rgba(109,40,217,0.1)' : 'rgba(168,85,247,0.1)',
              borderColor: isLight ? 'rgba(109,40,217,0.35)' : 'rgba(168,85,247,0.3)',
              color: isLight ? '#6d28d9' : '#c084fc',
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isEn ? 'Admin Mode (Preview)' : '管理者模式 預覽'}</span>
          </button>
        )}

        {/* 返回使用者模式按鈕（具備使用者圖示） */}
        <button
          type="button"
          onClick={handleReturnToSite}
          className="flex items-center gap-1.5 px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold text-[var(--neon-cyan)] bg-[var(--cat-icon-bg)] hover:bg-[var(--cat-icon-border)] border-[var(--cat-icon-border)] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
          title={lang === 'en' ? 'Return to User Mode' : '返回使用者模式'}
        >
          <User className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Return to User Mode' : '返回使用者模式'}</span>
        </button>
      </div>
    </header>
  );
};

export default CmsHeader;
