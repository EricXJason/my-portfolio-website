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
import { Menu, Sun, Moon, User, Shield, Eye, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { useCmsMode } from '../context/CmsModeContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
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
 * 1. 具備核心操作控制群：管理者模式(青)、全部還原預設(紫)、返回使用者模式(綠)。
 * 2. 雙語（EN/中）與深淺色即時切換開關。
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
  const { resetAllToDefaults } = usePortfolioData();
  const [modeExitDialog, setModeExitDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);
  const [resetAllDialog, setResetAllDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);
  const [returnToSiteDialog, setReturnToSiteDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const isLight = theme === 'light';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';
  const isEn = lang === 'en';

  const handleReturnToSite = () => {
    setReturnToSiteDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Return to Site' : '返回前臺網站',
      message: isEn
        ? 'Are you sure you want to leave the CMS and return to the user-facing site?'
        : '確定要離開 CMS 管理點並返回前臺網站嗎？',
      confirmText: isEn ? 'Return to Site' : '確認返回',
      cancelText: isEn ? 'Stay' : '留在 CMS',
      onConfirm: () => {
        setReturnToSiteDialog(EMPTY_DIALOG);
        if (onExitToSite) {
          onExitToSite();
        } else {
          navigate('/');
        }
      },
    });
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

  // 點擊全部還原預設按鈕 → 彈出高警示確認對話框
  const handleTriggerResetAll = () => {
    setResetAllDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Reset All Modules to Defaults' : '全部還原預設值',
      message: isEn
        ? 'Are you sure you want to restore ALL modules to original repository defaults? This will overwrite changes across all modules and synchronize to cloud and site.'
        : '確定要將全站所有模組全部還原至專案初始預設值嗎？這將覆蓋所有修改內容並同步重置雲端資料庫與前臺展示。',
      confirmText: isEn ? 'Confirm Reset All' : '確定全部還原',
      cancelText: isEn ? 'Cancel' : '取消',
      onConfirm: async () => {
        setIsResetting(true);
        setResetAllDialog(EMPTY_DIALOG);
        try {
          await resetAllToDefaults();
          setResetAllDialog({
            isOpen: true,
            type: 'save',
            title: isEn ? 'Reset Complete' : '還原完成',
            message: isEn
              ? 'All 9 modules have been successfully restored to their original default data.'
              : '全站所有 9 大模組已成功還原至最原始預設資料，頁面已同步更新，無須重新整理。',
            confirmText: isEn ? 'Got it' : '知道了',
            cancelText: '',
            onConfirm: () => setResetAllDialog(EMPTY_DIALOG),
          });
        } catch (e) {
          console.error('Reset all error:', e);
          setResetAllDialog({
            isOpen: true,
            type: 'delete',
            title: isEn ? 'Reset Failed' : '還原失敗',
            message: isEn
              ? 'Failed to reset modules. Please check your network connection and try again.'
              : '還原模組時發生錯誤，請檢查網路連線後再試一次。',
            confirmText: isEn ? 'Close' : '關閉',
            cancelText: '',
            onConfirm: () => setResetAllDialog(EMPTY_DIALOG),
          });
        } finally {
          setIsResetting(false);
        }
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between gap-2 overflow-hidden select-none">
      {/* 左側：行動端開關與導覽階層（強制單行不折行） */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-1.5 sm:p-2 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--card-inner)] lg:hidden cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-['Share_Tech_Mono'] shrink-0 whitespace-nowrap">
          <span className="text-[var(--text-sub)] hidden md:inline">CMS</span>
          <span className="text-[var(--text-sub)]/50 hidden md:inline">/</span>
          <span className="font-bold text-[var(--neon-cyan)] tracking-wide font-['Noto_Sans_TC'] whitespace-nowrap text-sm sm:text-base">
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

      {/* 一鍵還原全模組預設值二次確認對話框 */}
      <CmsConfirmDialog
        dialog={resetAllDialog}
        onClose={() => setResetAllDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 返回前臺使用者模式二次確認對話框 */}
      <CmsConfirmDialog
        dialog={returnToSiteDialog}
        onClose={() => setReturnToSiteDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 右側：功能動作按鈕與 4 色核心控制群（支援橫向安全防禦與階梯式響應字級） */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
        {/* 語系切換器 (與前臺導覽列一致之風格) */}
        <button
          onClick={toggleLang}
          className="w-[48px] sm:w-[56px] h-[28px] sm:h-[30px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer font-tech text-xs font-bold active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
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

        {/* 外觀主題切換器 (深色 / 淺色) */}
        <button
          onClick={toggleTheme}
          className="w-[48px] sm:w-[56px] h-[28px] sm:h-[30px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
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
              <Sun size={12} className="fill-current text-slate-900" />
            ) : (
              <Moon size={12} className="fill-current text-slate-900" />
            )}
          </div>
        </button>

        {/* ── 核心 4 色操作按鈕群（順序色：青、藍、紫、綠） ── */}

        {/* 按鈕 1：管理者模式 (青色 Cyan #00f0ff) */}
        {mode === 'admin' && (
          <button
            type="button"
            onClick={handleModeBadgeClick}
            title={isEn ? 'Admin Mode (Click to return to mode selection)' : '管理者模式（點擊可返回存取模式選擇）'}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: isLight ? 'rgba(3,105,161,0.1)' : 'rgba(0,240,255,0.1)',
              borderColor: isLight ? 'rgba(3,105,161,0.35)' : 'rgba(0,240,255,0.35)',
              color: isLight ? '#0369a1' : '#00f0ff',
            }}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">{isEn ? 'Admin Mode' : '管理者模式'}</span>
          </button>
        )}
        {mode === 'preview' && (
          <button
            type="button"
            onClick={handleModeBadgeClick}
            title={isEn ? 'Admin Preview (Click to return to mode selection)' : '管理者預覽（點擊可返回存取模式選擇）'}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: isLight ? 'rgba(3,105,161,0.1)' : 'rgba(0,240,255,0.1)',
              borderColor: isLight ? 'rgba(3,105,161,0.35)' : 'rgba(0,240,255,0.35)',
              color: isLight ? '#0369a1' : '#00f0ff',
            }}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">{isEn ? 'Admin Preview' : '管理者預覽'}</span>
          </button>
        )}

        {/* 按鈕 3：全部還原預設 (紫色 Purple/Violet #c084fc) */}
        <button
          type="button"
          onClick={handleTriggerResetAll}
          disabled={isResetting}
          className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 md:px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs disabled:opacity-50 shrink-0 whitespace-nowrap"
          style={{
            backgroundColor: isLight ? 'rgba(126,34,206,0.1)' : 'rgba(192,132,252,0.12)',
            borderColor: isLight ? 'rgba(126,34,206,0.35)' : 'rgba(192,132,252,0.4)',
            color: isLight ? '#7e22ce' : '#c084fc',
          }}
          title={isEn ? 'Reset all 9 modules to default baseline' : '將全站所有模組全部還原至預設值'}
        >
          <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline xl:hidden whitespace-nowrap">{isEn ? 'Reset Default' : '還原預設'}</span>
          <span className="hidden xl:inline whitespace-nowrap">{isEn ? 'Reset All' : '全部還原預設'}</span>
        </button>

        {/* 按鈕 4：返回使用者模式 (綠色 Emerald/Green #34d399) */}
        <button
          type="button"
          onClick={handleReturnToSite}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs shrink-0 whitespace-nowrap"
          style={{
            backgroundColor: isLight ? 'rgba(5,150,105,0.1)' : 'rgba(52,211,153,0.12)',
            borderColor: isLight ? 'rgba(5,150,105,0.35)' : 'rgba(52,211,153,0.4)',
            color: isLight ? '#059669' : '#34d399',
          }}
          title={isEn ? 'Return to User Mode' : '返回使用者模式 (前臺網站)'}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline lg:hidden whitespace-nowrap">{isEn ? 'Site' : '返回前臺'}</span>
          <span className="hidden lg:inline whitespace-nowrap">{isEn ? 'User Mode' : '返回使用者模式'}</span>
        </button>
      </div>
    </header>
  );
};

export default CmsHeader;
