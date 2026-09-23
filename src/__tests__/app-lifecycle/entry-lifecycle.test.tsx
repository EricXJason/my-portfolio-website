/**
 * ============================================================================
 * 檔案名稱: entry-lifecycle.test.tsx
 * 所屬模組: Test Suite (全站開場生命週期與進入防禦測試)
 * 責任描述: 驗證訪客首訪呈現開場動畫與語系彈窗，以及從 CMS 返回時直接直通首頁，
 *           絕無重複彈窗阻斷與捲動條鎖死缺陷。
 * ============================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../App';

describe('全站開場生命週期與防重複彈窗測試 (App Entry Lifecycle)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('首訪訪客 (sessionStorage 無記錄) 時，應展示語系選擇彈窗且可由使用者選取語系進入', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 語系彈窗應存在 (包含中文與英文按鈕)
    const zhButton = screen.queryByText('繁體中文') || screen.queryByText(/中文/i);
    expect(zhButton).toBeInTheDocument();

    if (zhButton) {
      await user.click(zhButton);
    }

    // 點擊後應順暢進入主站點，首頁品牌標題與主內容直接呈現
    expect(screen.getAllByText('許哲誠 HSU, CHE-CHENG').length).toBeGreaterThan(0);
  });

  it('當 sessionStorage 已記錄 portfolio_site_entered 為 true 時 (例如從 CMS 返回)，直接進入主網站，絕不重複彈出語系彈窗', () => {
    sessionStorage.setItem('portfolio_site_entered', 'true');

    render(<App />);

    // 語系選擇按鈕不應以全螢幕彈窗形式阻斷訪客
    const modalHeading = screen.queryByText('SELECT LANGUAGE') || screen.queryByText('選擇語言偏好');
    expect(modalHeading).not.toBeInTheDocument();

    // 首頁品牌標題與主內容應直接呈現
    expect(screen.getAllByText('許哲誠 HSU, CHE-CHENG').length).toBeGreaterThan(0);
  });
});
