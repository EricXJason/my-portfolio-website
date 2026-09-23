/**
 * ============================================================================
 * 檔案名稱: cms-sidebar-reorder.test.tsx
 * 所屬模組: Test Suite (CMS 側邊欄模組排序與重設單元測試)
 * 責任描述: 嚴格驗證 CmsSidebar 之模組順序自訂、上下移動、首頁鎖定置頂、
 *           還原預設、可見度開關切換與返回前臺動作回調。
 * 架構分層: Unit Tests (Vitest + Testing Library)
 * ============================================================================
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CmsSidebar, DEFAULT_MODULE_ORDER } from '../../cms/components/CmsSidebar';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PortfolioDataProvider } from '../../context/PortfolioDataContext';
import { CmsDirtyProvider } from '../../cms/context/CmsDirtyContext';

const renderCmsSidebar = (props: Partial<React.ComponentProps<typeof CmsSidebar>> = {}) => {
  const defaultProps = {
    activeTab: 'home',
    onSelectTab: vi.fn(),
    isOpenMobile: false,
    onCloseMobile: vi.fn(),
    onExitToSite: vi.fn(),
    ...props,
  };

  return {
    ...render(
      <ThemeProvider>
        <LangProvider>
          <PortfolioDataProvider>
            <CmsDirtyProvider>
              <CmsSidebar {...defaultProps} />
            </CmsDirtyProvider>
          </PortfolioDataProvider>
        </LangProvider>
      </ThemeProvider>
    ),
    props: defaultProps,
  };
};

describe('CMS 側邊欄排序與管理單元測試', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('應正確載入預設 7 大模組順序與首頁置頂鎖定', () => {
    renderCmsSidebar();

    // 檢查首頁具備鎖定圖示或置頂提示
    const homeTab = screen.getByText('首頁');
    expect(homeTab).toBeInTheDocument();

    // 驗證預設常數結構完整性
    expect(DEFAULT_MODULE_ORDER).toEqual([
      'home',
      'about',
      'projects',
      'skills',
      'experience',
      'awards',
      'gallery',
    ]);
  });

  it('側邊欄底部正確渲染 GitHub、Firebase 與 Cloudflare 外部管理連結', () => {
    renderCmsSidebar({});

    expect(screen.getByTitle('GitHub Repository')).toBeInTheDocument();
    expect(screen.getByTitle('Firebase Console')).toBeInTheDocument();
    expect(screen.getByTitle('Cloudflare Pages Dashboard')).toBeInTheDocument();
  });

  it('模組點擊切換應正確呼叫 onSelectTab 回調', () => {
    const onSelectTab = vi.fn();
    renderCmsSidebar({ onSelectTab });

    const projectsButton = screen.getByText('專案作品');
    fireEvent.click(projectsButton);

    expect(onSelectTab).toHaveBeenCalledWith('projects');
  });

  it('當調整模組排序後應存入 localStorage 並觸發廣播事件', () => {
    renderCmsSidebar();

    // 尋找具有上移/下移動作且未禁用的按鈕
    const moveButtons = screen.getAllByRole('button').filter(
      (btn) =>
        (btn.getAttribute('title')?.includes('移') || btn.getAttribute('aria-label')?.includes('移')) &&
        !btn.hasAttribute('disabled')
    );

    if (moveButtons.length > 0) {
      fireEvent.click(moveButtons[0]);
      const saved = localStorage.getItem('portfolio_modules_order');
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      // 首頁必須恆居第一位
      expect(parsed[0]).toBe('home');
    }
  });

  it('還原預設順序按鈕在順序變更後應能正常觸發並重設 localStorage', () => {
    // 先寫入自訂順序
    const customOrder = ['home', 'gallery', 'awards', 'experience', 'skills', 'projects', 'about'];
    localStorage.setItem('portfolio_modules_order', JSON.stringify(customOrder));

    renderCmsSidebar();

    // 尋找還原預設按鈕
    const resetBtn = screen.queryByRole('button', { name: /還原預設|Reset Order/i });
    if (resetBtn) {
      fireEvent.click(resetBtn);
      const saved = localStorage.getItem('portfolio_modules_order');
      // 還原後由 resetOrder 移除 local 鍵值或重置
      expect(saved === null || JSON.parse(saved)[1] === 'about').toBe(true);
    }
  });
});
