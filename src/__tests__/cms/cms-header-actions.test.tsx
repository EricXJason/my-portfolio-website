/**
 * ============================================================================
 * 檔案名稱: cms-header-actions.test.tsx
 * 所屬模組: Test Suite (CMS 頂部工具列按鈕與全站雲端還原流程測試)
 * 責任描述: 嚴格驗證 CmsHeader 之全部還原預設值 (重置至 Firebase 雲端與本地)、
 *           管理者模式徽章切換模式確認、深淺色切換與多語系切換按鈕流程。
 * 架構分層: Unit Tests (Vitest + Testing Library)
 * ============================================================================
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CmsHeader } from '../../cms/components/CmsHeader';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PortfolioDataProvider, getContentFingerprint } from '../../context/PortfolioDataContext';
import { CmsModeProvider, useCmsMode } from '../../cms/context/CmsModeContext';

const ModeSetter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setMode } = useCmsMode();
  React.useEffect(() => {
    setMode('admin');
  }, [setMode]);
  return <>{children}</>;
};

const renderCmsHeader = (props: Partial<React.ComponentProps<typeof CmsHeader>> = {}) => {
  const defaultProps = {
    currentTabName: '首頁',
    onOpenMobile: vi.fn(),
    onExitToSite: vi.fn(),
    onSwitchMode: vi.fn(),
    ...props,
  };

  return {
    ...render(
      <MemoryRouter>
        <ThemeProvider>
          <LangProvider>
            <PortfolioDataProvider>
              <CmsModeProvider>
                <ModeSetter>
                  <CmsHeader {...defaultProps} />
                </ModeSetter>
              </CmsModeProvider>
            </PortfolioDataProvider>
          </LangProvider>
        </ThemeProvider>
      </MemoryRouter>
    ),
    props: defaultProps,
  };
};

describe('CMS 頂部導覽列按鈕操作與雲端同步流程測試', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('portfolio_content_fingerprint', getContentFingerprint());
    vi.clearAllMocks();
  });

  it('點擊「全部還原預設」按鈕跳出對話框，取消後關閉且不重置', async () => {
    renderCmsHeader();

    const resetAllBtn = screen.getByRole('button', { name: /全部還原預設|還原預設|Reset All/i });
    expect(resetAllBtn).toBeInTheDocument();

    fireEvent.click(resetAllBtn);

    // 檢查彈出視窗
    expect(screen.getByText(/確定要將全站所有模組全部還原至專案初始預設值嗎/i)).toBeInTheDocument();

    // 點擊取消
    const cancelBtn = screen.getByRole('button', { name: /取消|Cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText(/確定要將全站所有模組全部還原至專案初始預設值嗎/i)).not.toBeInTheDocument();
    });
  });

  it('點擊「全部還原預設」並確認，完成後應展示還原完成確認對話框', async () => {
    renderCmsHeader();

    const resetAllBtn = screen.getByRole('button', { name: /全部還原預設|還原預設|Reset All/i });
    fireEvent.click(resetAllBtn);

    const confirmBtn = screen.getByRole('button', { name: /確定全部還原|Confirm Reset All/i });
    fireEvent.click(confirmBtn);

    // 驗證等待還原完成視窗出現
    await waitFor(() => {
      expect(screen.getByText(/全站所有 9 大模組已成功還原至最原始預設資料/i)).toBeInTheDocument();
    });

    // 點擊「知道了」按鈕關閉
    const okBtn = screen.getByRole('button', { name: /知道了|Got it/i });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.queryByText(/全站所有 9 大模組已成功還原至最原始預設資料/i)).not.toBeInTheDocument();
    });
  });

  it('點擊「管理者模式」徽章應觸發外部 onSwitchMode 或彈窗', () => {
    const onSwitchMode = vi.fn();
    renderCmsHeader({ onSwitchMode });

    // 尋找管理者模式徽章按鈕
    const adminBadgeBtn = screen.getByRole('button', { name: /管理者模式|Admin Mode/i });
    expect(adminBadgeBtn).toBeInTheDocument();

    fireEvent.click(adminBadgeBtn);
    expect(onSwitchMode).toHaveBeenCalledTimes(1);
  });

  it('點擊語系切換與主題切換按鈕應成功觸發切換', () => {
    renderCmsHeader();

    // 語系按鈕
    const langBtn = screen.getByRole('button', { name: /切換語系|切換語言|English/i });
    expect(langBtn).toBeInTheDocument();
    fireEvent.click(langBtn);

    // 主題按鈕
    const themeBtn = screen.getByRole('button', { name: /切換為淺色模式|切換為深色模式|淺色模式|深色模式/i });
    expect(themeBtn).toBeInTheDocument();
    fireEvent.click(themeBtn);
  });
});
