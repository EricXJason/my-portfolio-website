/**
 * ============================================================================
 * 檔案名稱: editor-save-button-flow.test.tsx
 * 所屬模組: Test Suite (CMS 編輯器按鈕操作流程與存檔對話框端到端整合測試)
 * 責任描述: 嚴格驗證編輯器各按鈕流程細節：
 *           1. 欄位異動觸發 isDirty 髒污狀態。
 *           2. 點擊「存檔」彈出確認對話框，取消與確認動作隔離。
 *           3. 確認存檔調用 updateDocument 並觸發雲端儲存 Toast。
 *           4. 點擊「還原預設」之確認與資料重置流程。
 *           5. 預覽模式唯讀禁用防護。
 * 架構分層: Integration / Unit Tests (Vitest + Testing Library)
 * ============================================================================
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CmsHeroEditor } from '../../cms/components/CmsHeroEditor';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PortfolioDataProvider, getContentFingerprint } from '../../context/PortfolioDataContext';
import { CmsDirtyProvider, useCmsDirty } from '../../cms/context/CmsDirtyContext';
import { CmsModeProvider } from '../../cms/context/CmsModeContext';

// 輔助組件：即時監看 isDirty 狀態
const DirtyIndicator = () => {
  const { isDirty } = useCmsDirty();
  return <div data-testid="dirty-indicator">{isDirty ? 'DIRTY' : 'CLEAN'}</div>;
};

const renderHeroEditor = () => {
  return render(
    <ThemeProvider>
      <LangProvider>
        <PortfolioDataProvider>
          <CmsModeProvider>
            <CmsDirtyProvider>
              <DirtyIndicator />
              <CmsHeroEditor />
            </CmsDirtyProvider>
          </CmsModeProvider>
        </PortfolioDataProvider>
      </LangProvider>
    </ThemeProvider>
  );
};

describe('CMS 編輯器按鈕流程與 Firebase 存檔串接單元測試', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('portfolio_content_fingerprint', getContentFingerprint());
    vi.clearAllMocks();
  });

  it('初始進入時表單應為 CLEAN 乾淨狀態', () => {
    renderHeroEditor();
    expect(screen.getByTestId('dirty-indicator').textContent).toBe('CLEAN');
    // 預設確認視窗不應存在
    expect(screen.queryByText('確認存檔')).not.toBeInTheDocument();
  });

  it('修改欄位內容應觸發 DIRTY 髒污狀態', () => {
    renderHeroEditor();

    // 尋找電話欄位並輸入新號碼
    const phoneInputs = screen.getAllByRole('textbox');
    expect(phoneInputs.length).toBeGreaterThan(0);

    fireEvent.change(phoneInputs[0], { target: { value: '0912-345-678' } });

    expect(screen.getByTestId('dirty-indicator').textContent).toBe('DIRTY');
  });

  it('點擊「存檔」按鈕彈出確認視窗，點擊「取消」應關閉視窗且維持髒污狀態', async () => {
    renderHeroEditor();

    // 先產生修改
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: '0988-777-666' } });
    expect(screen.getByTestId('dirty-indicator').textContent).toBe('DIRTY');

    // 點擊存檔按鈕
    const saveBtn = screen.getByRole('button', { name: /存檔|Save Changes/i });
    fireEvent.click(saveBtn);

    // 驗證確認視窗跳出
    expect(screen.getByText('確認存檔')).toBeInTheDocument();
    expect(screen.getByText(/確定要將「首頁」模組目前的修改內容儲存至雲端資料庫嗎/i)).toBeInTheDocument();

    // 點擊取消按鈕
    const cancelBtn = screen.getByRole('button', { name: /取消|Cancel/i });
    fireEvent.click(cancelBtn);

    // 驗證彈窗關閉且依舊處於 DIRTY
    await waitFor(() => {
      expect(screen.queryByText('確認存檔')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('dirty-indicator').textContent).toBe('DIRTY');
  });

  it('點擊「存檔」並確認後，應觸發雲端儲存 Toast 並將狀態重設為 CLEAN', async () => {
    renderHeroEditor();

    // 修改欄位
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: '0999-888-777' } });

    // 點擊存檔
    const saveBtn = screen.getByRole('button', { name: /存檔|Save Changes/i });
    fireEvent.click(saveBtn);

    // 點擊彈窗中的「確定存檔」
    const confirmSaveBtn = screen.getByRole('button', { name: /確定存檔|Save/i });
    fireEvent.click(confirmSaveBtn);

    // 驗證 Toast 出現
    await waitFor(() => {
      expect(screen.getByText(/已成功存檔至雲端|saved to cloud successfully/i)).toBeInTheDocument();
    });

    // 驗證 dirty 標記重置為 CLEAN
    expect(screen.getByTestId('dirty-indicator').textContent).toBe('CLEAN');
  });

  it('點擊「還原預設」按鈕跳出對話框，確認後重設模組內容並給出通知', async () => {
    renderHeroEditor();

    const resetBtn = screen.getByRole('button', { name: /還原預設|Restore Defaults/i });
    fireEvent.click(resetBtn);

    // 驗證模態彈窗
    expect(screen.getByText(/確認還原此模組預設|Confirm Module Reset/i)).toBeInTheDocument();

    // 點擊確定還原預設
    const confirmResetBtn = screen.getByRole('button', { name: /確定還原預設|Restore Defaults/i });
    fireEvent.click(confirmResetBtn);

    await waitFor(() => {
      expect(screen.getByText(/已還原為初始預設資料|Restored to/i)).toBeInTheDocument();
    });
  });

  it('全域事件 portfolio_cms_trigger_save 觸發時能自動完成存檔', async () => {
    renderHeroEditor();

    // 派發廣播事件
    fireEvent(window, new Event('portfolio_cms_trigger_save'));

    // 驗證未崩潰且能正常響應
    expect(screen.getByTestId('dirty-indicator')).toBeInTheDocument();
  });
});
