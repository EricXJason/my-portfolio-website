/**
 * ============================================================================
 * 檔案名稱: CmsApp.tsx
 * 所屬模組: Portfolio CMS (後臺管理系統根應用元件)
 * 責任描述: 負責管理 CMS 整體版面佈局、存取權限模式選擇阻斷、未儲存表單攔截與分頁模組動態渲染。
 * 架構分層: CMS Application Root Layer
 * 依賴關係: 依賴 React Router DOM、LangContext、ThemeContext、CmsDirtyContext、CmsModeContext 及各模組編輯器。
 * 邊界處理: 阻斷未授權模式存取、嚴密攔截未儲存頁面切換、支援對話框確認返回使用者模式。
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CmsSidebar, CMS_NAV_ITEMS } from './components/CmsSidebar';
import { CmsHeader } from './components/CmsHeader';
import { CmsHeroEditor } from './components/CmsHeroEditor';
import { CmsSiteSettingsEditor } from './components/CmsSiteSettingsEditor';
import { CmsAboutEditor } from './components/CmsAboutEditor';
import { CmsSkillsEditor } from './components/CmsSkillsEditor';
import { CmsProjectsEditor } from './components/CmsProjectsEditor';
import { CmsCertificationsEditor } from './components/CmsCertificationsEditor';
import { CmsExperienceEditor } from './components/CmsExperienceEditor';
import { CmsGalleryEditor } from './components/CmsGalleryEditor';
import { useLang } from '../context/LangContext';
import { CmsDirtyProvider, useCmsDirty } from './context/CmsDirtyContext';
import { CmsModeProvider, useCmsMode } from './context/CmsModeContext';
import { CmsModeSelectDialog } from './components/CmsModeSelectDialog';
import { CmsUnsavedModal } from './components/CmsUnsavedModal';
import { CmsConfirmDialog } from './components/CmsConfirmDialog';
import { BackToTop } from '../components/BackToTop';

const CmsAppInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('site-settings');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [pendingNav, setPendingNav] = useState<{ type: 'tab' | 'route' | 'mode'; target: string } | null>(null);
  const [showExitConfirmDialog, setShowExitConfirmDialog] = useState<boolean>(false);
  const [showSwitchModeConfirmDialog, setShowSwitchModeConfirmDialog] = useState<boolean>(false);

  const { lang } = useLang();
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const { isDirty, setIsDirty } = useCmsDirty();
  const { mode, signOut } = useCmsMode();

  // 依據當前模式派生是否為純預覽狀態 (preview)
  const isPreview = mode === 'preview';

  const currentItem = CMS_NAV_ITEMS.find((item) => item.id === activeTab);
  const currentTabName = currentItem
    ? (isEn ? currentItem.titleEn : currentItem.titleZh)
    : (isEn ? 'Site Settings' : '網站設定');

  // 若表單具備未儲存之變更，攔截切換頁籤行為並彈出防衛確認視窗
  const handleSelectTab = (targetTab: string) => {
    if (targetTab === activeTab) return;
    if (isDirty && !isPreview) {
      setPendingNav({ type: 'tab', target: targetTab });
    } else {
      setActiveTab(targetTab);
    }
  };

  // 攔截返回使用者模式前臺之行為（對話框確認與未儲存變更攔截防衛）
  const handleExitToSite = () => {
    if (isDirty && !isPreview) {
      setPendingNav({ type: 'route', target: '/' });
    } else {
      setShowExitConfirmDialog(true);
    }
  };

  // 攔截切換存取模式之行為（若有未儲存變更則彈出三選項防衛，無未儲存變更時亦彈出雙選項確認）
  const handleSwitchMode = () => {
    if (isDirty && !isPreview) {
      setPendingNav({ type: 'mode', target: 'mode-select' });
    } else {
      setShowSwitchModeConfirmDialog(true);
    }
  };

  // 未儲存變更：儲存變更並離開
  const handleSaveAndLeave = () => {
    const dest = pendingNav;
    // 廣播存檔事件讓各編輯器即時存檔
    window.dispatchEvent(new CustomEvent('portfolio_cms_trigger_save'));
    setPendingNav(null);
    setIsDirty(false);
    if (!dest) return;
    if (dest.type === 'tab') {
      setActiveTab(dest.target);
    } else if (dest.type === 'route') {
      try {
        sessionStorage.setItem('portfolio_site_entered', 'true');
      } catch {}
      navigate(dest.target);
    } else if (dest.type === 'mode') {
      signOut();
    }
  };

  // 未儲存變更：放棄變更並離開
  const handleDiscardAndLeave = () => {
    const dest = pendingNav;
    setPendingNav(null);
    setIsDirty(false);
    if (!dest) return;
    if (dest.type === 'tab') {
      setActiveTab(dest.target);
    } else if (dest.type === 'route') {
      try {
        sessionStorage.setItem('portfolio_site_entered', 'true');
      } catch {}
      navigate(dest.target);
    } else if (dest.type === 'mode') {
      signOut();
    }
  };

  // 未儲存變更：留在本頁
  const handleStayOnPage = () => {
    setPendingNav(null);
  };

  // ── 模式尚未選擇時：顯示全螢幕存取模式選擇視窗（含雙語、深淺色與返回使用者模式按鈕） ──
  if (mode === null) {
    return <CmsModeSelectDialog />;
  }

  // ── 已選擇權限模式後：渲染完整 Sidebar 與管理編輯面板 ──
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] flex flex-col font-['Inter',sans-serif] transition-colors duration-300">
      {/* ── 嚴格三鍵與 ESC 規範之未儲存對話框 ── */}
      <CmsUnsavedModal
        isOpen={Boolean(pendingNav)}
        onSaveAndLeave={handleSaveAndLeave}
        onDiscardAndLeave={handleDiscardAndLeave}
        onStayOnPage={handleStayOnPage}
      />

      {/* ── 確認返回使用者模式對話框 (無未儲存變更時) ── */}
      <CmsConfirmDialog
        dialog={{
          isOpen: showExitConfirmDialog,
          type: 'save',
          title: isEn ? 'Return to User Mode' : '返回使用者模式',
          message: isEn
            ? 'Are you sure you want to return to User Mode (Front-End Site)?'
            : '確定要離開內容管理系統並返回使用者模式嗎？',
          confirmText: isEn ? 'Confirm Return' : '確認返回',
          cancelText: isEn ? 'Stay on Page' : '留在本頁',
          onConfirm: () => {
            try {
              sessionStorage.setItem('portfolio_site_entered', 'true');
            } catch {}
            setShowExitConfirmDialog(false);
            navigate('/');
          },
        }}
        onClose={() => setShowExitConfirmDialog(false)}
        isEn={isEn}
      />

      {/* ── 確認切換存取模式對話框 (無未儲存變更時) ── */}
      <CmsConfirmDialog
        dialog={{
          isOpen: showSwitchModeConfirmDialog,
          type: 'save',
          title: isEn ? 'Switch Access Mode' : '切換存取模式',
          message: isEn
            ? 'Are you sure you want to leave the current mode and return to the Access Mode Selection screen?'
            : '確定要離開當前模式並返回存取模式選擇畫面嗎？',
          confirmText: isEn ? 'Confirm Switch' : '確認切換',
          cancelText: isEn ? 'Stay on Page' : '留在本頁',
          onConfirm: () => {
            setShowSwitchModeConfirmDialog(false);
            signOut();
          },
        }}
        onClose={() => setShowSwitchModeConfirmDialog(false)}
        isEn={isEn}
      />

      {/* ── CMS 導覽側邊欄 ── */}
      <CmsSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onExitToSite={handleExitToSite}
      />

      {/* ── 主內容視圖容器 ── */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* 頂部導覽列 */}
        <CmsHeader
          currentTabName={currentTabName}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          onExitToSite={handleExitToSite}
          onSwitchMode={handleSwitchMode}
        />

        {/* 預覽模式頂部橫幅 */}
        {isPreview && (
          <div
            className="mx-4 sm:mx-6 lg:mx-8 mt-4 flex items-center gap-3 px-4 py-3 border cyber-cut-sm text-xs font-['Noto_Sans_TC']"
            style={{
              backgroundColor: 'rgba(251,191,36,0.08)',
              borderColor: 'rgba(251,191,36,0.35)',
              color: '#fbbf24',
            }}
          >
            <span className="font-bold font-['Share_Tech_Mono'] shrink-0">
              {isEn ? '[ PREVIEW MODE ]' : '[ 預覽模式 ]'}
            </span>
            <span style={{ color: 'rgba(251,191,36,0.8)' }}>
              {isEn
                ? 'You are in read-only preview mode. All fields are disabled. Sign in as Admin to make changes.'
                : '您目前處於唯讀預覽模式，所有欄位已禁用。若需編輯，請以管理者身份登入。'}
            </span>
          </div>
        )}

        {/* 動態 CMS 模組視圖 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'site-settings' && <CmsSiteSettingsEditor isPreview={isPreview} />}
          {activeTab === 'home' && <CmsHeroEditor isPreview={isPreview} />}
          {activeTab === 'about' && <CmsAboutEditor isPreview={isPreview} />}
          {activeTab === 'skills' && <CmsSkillsEditor isPreview={isPreview} />}
          {activeTab === 'projects' && <CmsProjectsEditor isPreview={isPreview} />}
          {activeTab === 'awards' && <CmsCertificationsEditor isPreview={isPreview} />}
          {activeTab === 'experience' && <CmsExperienceEditor isPreview={isPreview} />}
          {activeTab === 'gallery' && <CmsGalleryEditor isPreview={isPreview} />}
        </main>
      </div>

      {/* ── 返回頂端浮動按鈕 ── */}
      <BackToTop />
    </div>
  );
};

export const CmsApp: React.FC = () => {
  return (
    <CmsModeProvider>
      <CmsDirtyProvider>
        <CmsAppInner />
      </CmsDirtyProvider>
    </CmsModeProvider>
  );
};

export default CmsApp;
