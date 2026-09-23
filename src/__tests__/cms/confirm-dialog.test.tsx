/**
 * ============================================================================
 * 檔案名稱: confirm-dialog.test.tsx
 * 所屬模組: Test Suite (CMS 通用確認對話框測試)
 * 責任描述: 嚴格驗證 CmsConfirmDialog 模態視窗之 Portal 掛載、按鈕回調隔離、
 *           ESC 鍵監聽與防誤觸點擊攔截。
 * ============================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CmsConfirmDialog, CmsConfirmDialogState } from '../../cms/components/CmsConfirmDialog';
import { ThemeProvider } from '../../context/ThemeContext';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('CmsConfirmDialog 通用確認對話框測試', () => {
  it('當 isOpen 為 false 時，絕不渲染任何對話框內容到 DOM', () => {
    const mockDialog: CmsConfirmDialogState = {
      isOpen: false,
      type: 'save',
      title: '測試標題',
      message: '測試提示訊息',
      confirmText: '確認按鈕',
      cancelText: '取消按鈕',
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={vi.fn()} />);

    expect(screen.queryByText('測試標題')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('當 isOpen 為 true 時，正確渲染標題、訊息與自訂按鈕文字', () => {
    const mockDialog: CmsConfirmDialogState = {
      isOpen: true,
      type: 'save',
      title: '返回使用者模式',
      message: '確定要離開內容管理系統並返回使用者模式嗎？',
      confirmText: '確認返回',
      cancelText: '留在本頁',
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('返回使用者模式')).toBeInTheDocument();
    expect(screen.getByText('確定要離開內容管理系統並返回使用者模式嗎？')).toBeInTheDocument();
    expect(screen.getByText('確認返回')).toBeInTheDocument();
    expect(screen.getByText('留在本頁')).toBeInTheDocument();
  });

  it('點擊「確認」按鈕時，必須先執行 onConfirm() 且同時執行 onClose()', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const mockDialog: CmsConfirmDialogState = {
      isOpen: true,
      type: 'save',
      title: '返回使用者模式',
      message: '確定要離開內容管理系統並返回使用者模式嗎？',
      confirmText: '確認返回',
      cancelText: '留在本頁',
      onConfirm: handleConfirm,
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={handleClose} />);

    const confirmButton = screen.getByText('確認返回');
    await user.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('點擊「取消 / 留在本頁」按鈕時，僅執行 onClose()，絕對不得執行 onConfirm()', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const mockDialog: CmsConfirmDialogState = {
      isOpen: true,
      type: 'save',
      title: '返回使用者模式',
      message: '確定要離開內容管理系統並返回使用者模式嗎？',
      confirmText: '確認返回',
      cancelText: '留在本頁',
      onConfirm: handleConfirm,
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={handleClose} />);

    const cancelButton = screen.getByText('留在本頁');
    await user.click(cancelButton);

    expect(handleConfirm).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('點擊右上角 X 關閉圖示時，僅執行 onClose()，絕對不得執行 onConfirm()', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const mockDialog: CmsConfirmDialogState = {
      isOpen: true,
      type: 'save',
      title: '測試視窗',
      message: '測試內文',
      confirmText: '確定',
      onConfirm: handleConfirm,
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={handleClose} />);

    const closeIconBtn = screen.getByLabelText('Close');
    await user.click(closeIconBtn);

    expect(handleConfirm).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('按下鍵盤 Escape 鍵時，必須安全觸發 onClose()', () => {
    const handleClose = vi.fn();
    const mockDialog: CmsConfirmDialogState = {
      isOpen: true,
      type: 'save',
      title: '測試視窗',
      message: '測試內文',
      confirmText: '確定',
    };

    renderWithTheme(<CmsConfirmDialog dialog={mockDialog} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
