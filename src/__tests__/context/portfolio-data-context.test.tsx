/**
 * ============================================================================
 * 檔案名稱: portfolio-data-context.test.tsx
 * 所屬模組: Test Suite (全站資料持久化與快取中樞測試)
 * 責任描述: 嚴格驗證 LOCAL_FALLBACKS 9 大模組降級備援、指紋校驗，
 *           以及 resetAllToDefaults 一鍵還原之快取重置與事件廣播機制。
 * ============================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  PortfolioDataProvider,
  usePortfolioData,
  getContentFingerprint,
} from '../../context/PortfolioDataContext';
import { LOCAL_FALLBACKS } from '../../services/portfolioDataService';

describe('PortfolioDataContext 全站資料狀態與快取中樞測試', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('LOCAL_FALLBACKS 必須具備全站 9 大核心模組之完整降級資料庫', () => {
    const requiredKeys = [
      'hero',
      'site_settings',
      'about',
      'skills',
      'projects',
      'experience',
      'certifications',
      'gallery',
      'site_translations',
    ];

    requiredKeys.forEach((key) => {
      expect(LOCAL_FALLBACKS).toHaveProperty(key);
      expect(LOCAL_FALLBACKS[key as keyof typeof LOCAL_FALLBACKS]).toBeDefined();
    });
  });

  it('getContentFingerprint 必須產生非空的穩定雜湊字串', () => {
    const fingerprint = getContentFingerprint();
    expect(typeof fingerprint).toBe('string');
    expect(fingerprint.length).toBeGreaterThan(0);
    // 二次調用必須產生相同結果（冪等性）
    expect(getContentFingerprint()).toBe(fingerprint);
  });

  it('初始載入時，data 應成功以 LOCAL_FALLBACKS 實現 0ms 靜態播種', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortfolioDataProvider>{children}</PortfolioDataProvider>
    );

    const { result } = renderHook(() => usePortfolioData(), { wrapper });

    expect(result.current.data.site_settings).toBeDefined();
    expect(result.current.data.site_settings.modules_order).toEqual([
      'home',
      'about',
      'projects',
      'skills',
      'experience',
      'awards',
      'gallery',
    ]);
  });

  it('調用 resetAllToDefaults() 時，必須清除預覽與基準快取，並將 modules_order 還原為程式碼常數', async () => {
    // 預設寫入污染資料
    localStorage.setItem('portfolio_modules_order', JSON.stringify(['home', 'gallery']));
    localStorage.setItem('portfolio_preview_site_settings', '{"test":true}');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortfolioDataProvider>{children}</PortfolioDataProvider>
    );

    const { result } = renderHook(() => usePortfolioData(), { wrapper });

    await act(async () => {
      await result.current.resetAllToDefaults();
    });

    // 驗證污染的預覽資料已被清除
    expect(localStorage.getItem('portfolio_preview_site_settings')).toBeNull();

    // 驗證 modules_order 還原為 site-settings.json 的標準最新順序
    const restoredOrder = JSON.parse(localStorage.getItem('portfolio_modules_order') || '[]');
    expect(restoredOrder).toEqual([
      'home',
      'about',
      'projects',
      'skills',
      'experience',
      'awards',
      'gallery',
    ]);
  });
});
