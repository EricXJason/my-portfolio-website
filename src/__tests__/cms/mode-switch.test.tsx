/**
 * ============================================================================
 * 檔案名稱: mode-switch.test.tsx
 * 所屬模組: Test Suite (CMS 模式選擇與權限切換測試)
 * 責任描述: 驗證模式選擇畫面 (CmsModeSelectDialog) 之預覽直通、登入表單展開、
 *           以及返回使用者模式之二次確認防禦。
 * ============================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CmsModeSelectDialog } from '../../cms/components/CmsModeSelectDialog';
import { CmsModeProvider, useCmsMode } from '../../cms/context/CmsModeContext';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';

// 輔助組件：監看當前 CMS mode
const ModeViewer: React.FC = () => {
  const { mode } = useCmsMode();
  return <div data-testid="current-mode">{mode ?? 'none'}</div>;
};

const renderDialog = () => {
  return render(
    <MemoryRouter initialEntries={['/cms']}>
      <LangProvider>
        <ThemeProvider>
          <CmsModeProvider>
            <ModeViewer />
            <CmsModeSelectDialog />
          </CmsModeProvider>
        </ThemeProvider>
      </LangProvider>
    </MemoryRouter>
  );
};

describe('CMS 模式選擇畫面測試 (CmsModeSelectDialog)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('正確渲染管理者模式與預覽模式卡片及返回使用者模式按鈕', () => {
    renderDialog();

    expect(screen.getByText('選擇存取模式')).toBeInTheDocument();
    expect(screen.getByText('管理者模式')).toBeInTheDocument();
    expect(screen.getByText('管理者模式 預覽')).toBeInTheDocument();
    expect(screen.getByText('返回使用者模式')).toBeInTheDocument();
  });

  it('點擊「進入管理者模式 預覽」後，能成功切換為 preview 模式', async () => {
    const user = userEvent.setup();
    renderDialog();

    expect(screen.getByTestId('current-mode').textContent).toBe('none');

    const previewBtn = screen.getByText('進入管理者模式 預覽');
    await user.click(previewBtn);

    expect(screen.getByTestId('current-mode').textContent).toBe('preview');
  });

  it('在模式選擇畫面點擊「返回使用者模式」會彈出二次確認，按下「確認返回」後註冊 sessionStorage', async () => {
    const user = userEvent.setup();
    renderDialog();

    const returnBtn = screen.getByText('返回使用者模式');
    await user.click(returnBtn);

    // 驗證彈出確認對話框
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('確定要離開內容管理系統並返回使用者模式嗎？')).toBeInTheDocument();

    const confirmBtn = screen.getByText('確認返回');
    await user.click(confirmBtn);

    // 驗證標記已存入 sessionStorage
    expect(sessionStorage.getItem('portfolio_site_entered')).toBe('true');
    // 對話框關閉
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('點擊「進入管理者模式」卡片按鈕，展開帳號密碼登入表單', async () => {
    const user = userEvent.setup();
    renderDialog();

    const adminBtn = screen.getByText('進入管理者模式');
    await user.click(adminBtn);

    // 驗證表單輸入框出現
    expect(screen.getByPlaceholderText(/請輸入帳號/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/請輸入密碼/i)).toBeInTheDocument();
    expect(screen.getByText(/登入驗證/i)).toBeInTheDocument();
  });
});
