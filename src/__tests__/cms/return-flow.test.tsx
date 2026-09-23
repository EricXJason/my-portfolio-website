/**
 * ============================================================================
 * 檔案名稱: return-flow.test.tsx
 * 所屬模組: Test Suite (CMS 返回使用者模式端對端資料流防禦測試)
 * 責任描述: 嚴密驗證「點擊返回 -> 單次確認 -> 設置 sessionStorage -> 導航」完整鏈路，
 *           徹底防杜雙重彈窗與未存檔遺失缺陷。
 * ============================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { CmsHeader } from '../../cms/components/CmsHeader';
import { CmsConfirmDialog } from '../../cms/components/CmsConfirmDialog';
import { CmsUnsavedModal } from '../../cms/components/CmsUnsavedModal';
import { CmsModeProvider } from '../../cms/context/CmsModeContext';
import { CmsDirtyProvider, useCmsDirty } from '../../cms/context/CmsDirtyContext';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PortfolioDataProvider } from '../../context/PortfolioDataContext';

// 模擬組件：重現 CmsAppInner 與 CmsHeader 之間的連動行為
const MockCmsHarness: React.FC<{ initialDirty?: boolean }> = ({ initialDirty = false }) => {
  const { isDirty, setIsDirty } = useCmsDirty();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ type: string; target: string } | null>(null);
  const [currentRoute, setCurrentRoute] = useState('/cms');

  // 初始化 dirty 狀態
  React.useEffect(() => {
    if (initialDirty) setIsDirty(true);
  }, [initialDirty, setIsDirty]);

  const handleExitToSite = () => {
    if (isDirty) {
      setPendingNav({ type: 'route', target: '/' });
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleSaveAndLeave = () => {
    sessionStorage.setItem('portfolio_site_entered', 'true');
    setIsDirty(false);
    setPendingNav(null);
    setCurrentRoute('/');
  };

  const handleDiscardAndLeave = () => {
    sessionStorage.setItem('portfolio_site_entered', 'true');
    setIsDirty(false);
    setPendingNav(null);
    setCurrentRoute('/');
  };

  return (
    <div>
      <div data-testid="current-route">{currentRoute}</div>
      <button data-testid="set-dirty-btn" onClick={() => setIsDirty(true)}>
        Set Dirty
      </button>
      <CmsHeader
        currentTabName="網站設定"
        onOpenMobile={vi.fn()}
        onExitToSite={handleExitToSite}
      />

      {/* 單一確認返回對話框 */}
      <CmsConfirmDialog
        dialog={{
          isOpen: showExitConfirm,
          type: 'save',
          title: '返回使用者模式',
          message: '確定要離開內容管理系統並返回使用者模式嗎？',
          confirmText: '確認返回',
          cancelText: '留在本頁',
          onConfirm: () => {
            sessionStorage.setItem('portfolio_site_entered', 'true');
            setShowExitConfirm(false);
            setCurrentRoute('/');
          },
        }}
        onClose={() => setShowExitConfirm(false)}
      />

      {/* 未存檔三選項對話框 */}
      <CmsUnsavedModal
        isOpen={Boolean(pendingNav)}
        onSaveAndLeave={handleSaveAndLeave}
        onDiscardAndLeave={handleDiscardAndLeave}
        onStayOnPage={() => setPendingNav(null)}
      />
    </div>
  );
};

import { MemoryRouter } from 'react-router-dom';

const renderHarness = (initialDirty = false) => {
  return render(
    <MemoryRouter initialEntries={['/cms']}>
      <PortfolioDataProvider>
        <LangProvider>
          <ThemeProvider>
            <CmsModeProvider>
              <CmsDirtyProvider>
                <MockCmsHarness initialDirty={initialDirty} />
              </CmsDirtyProvider>
            </CmsModeProvider>
          </ThemeProvider>
        </LangProvider>
      </PortfolioDataProvider>
    </MemoryRouter>
  );
};

describe('CMS 返回使用者模式資料流防禦測試 (Return Flow Guard)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('在無未存檔變更時，點擊「返回使用者模式」只彈出單一確認對話框，且確認後順暢導航並標記 sessionStorage', async () => {
    const user = userEvent.setup();
    renderHarness(false);

    expect(screen.getByTestId('current-route').textContent).toBe('/cms');

    // 點擊頂部返回按鈕
    const returnBtn = screen.getByTitle('返回使用者模式 (前臺網站)');
    await user.click(returnBtn);

    // 驗證只出現一個對話框
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs.length).toBe(1);
    expect(screen.getByText('確定要離開內容管理系統並返回使用者模式嗎？')).toBeInTheDocument();

    // 點擊「確認返回」
    const confirmBtn = screen.getByText('確認返回');
    await user.click(confirmBtn);

    // 驗證成功導回 / 且註冊了 sessionStorage
    expect(screen.getByTestId('current-route').textContent).toBe('/');
    expect(sessionStorage.getItem('portfolio_site_entered')).toBe('true');
    // 驗證對話框完全消失，絕無第二層對話框殘留
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('在表單已修改 (dirty) 時，點擊返回前臺必須彈出三選項未儲存阻斷視窗 (CmsUnsavedModal)', async () => {
    const user = userEvent.setup();
    renderHarness(false);

    // 標記為未存檔髒污狀態
    const setDirtyBtn = screen.getByTestId('set-dirty-btn');
    await user.click(setDirtyBtn);

    const returnBtn = screen.getByTitle('返回使用者模式 (前臺網站)');
    await user.click(returnBtn);

    // 驗證彈出未儲存變更阻斷視窗
    expect(screen.getByText('未儲存修改提示')).toBeInTheDocument();
    expect(screen.getByText('儲存變更並離開')).toBeInTheDocument();
    expect(screen.getByText('放棄變更並離開')).toBeInTheDocument();
    expect(screen.getByText('留在本頁')).toBeInTheDocument();

    // 選擇「放棄變更並離開」
    const discardBtn = screen.getByText('放棄變更並離開');
    await user.click(discardBtn);

    expect(screen.getByTestId('current-route').textContent).toBe('/');
    expect(sessionStorage.getItem('portfolio_site_entered')).toBe('true');
  });
});
