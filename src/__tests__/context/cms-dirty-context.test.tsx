/**
 * ============================================================================
 * 檔案名稱: cms-dirty-context.test.tsx
 * 所屬模組: Test Suite (CMS 髒污狀態與 beforeunload 防護單元測試)
 * 責任描述: 嚴格驗證 CmsDirtyContext 之狀態維護、錯誤邊界阻斷與
 *           原生 beforeunload 預防資料遺失防護機制。
 * 架構分層: Unit Tests (Vitest + Testing Library)
 * ============================================================================
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { CmsDirtyProvider, useCmsDirty } from '../../cms/context/CmsDirtyContext';

describe('CmsDirtyContext 單元測試', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未於 CmsDirtyProvider 包覆下調用 useCmsDirty 應拋出明確錯誤', () => {
    // 抑制測試過程中的 console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useCmsDirty())).toThrow(
      'useCmsDirty must be used within a CmsDirtyProvider'
    );

    consoleSpy.mockRestore();
  });

  it('Provider 預設初始狀態 isDirty 應為 false', () => {
    const { result } = renderHook(() => useCmsDirty(), {
      wrapper: ({ children }) => <CmsDirtyProvider>{children}</CmsDirtyProvider>,
    });

    expect(result.current.isDirty).toBe(false);
  });

  it('調用 setIsDirty(true) 應成功切換髒污狀態', () => {
    const { result } = renderHook(() => useCmsDirty(), {
      wrapper: ({ children }) => <CmsDirtyProvider>{children}</CmsDirtyProvider>,
    });

    act(() => {
      result.current.setIsDirty(true);
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.setIsDirty(false);
    });

    expect(result.current.isDirty).toBe(false);
  });

  it('當 isDirty 為 true 時，beforeunload 事件應被阻斷並設定 returnValue 防護', () => {
    const TestComponent = () => {
      const { isDirty, setIsDirty } = useCmsDirty();
      return (
        <div>
          <span data-testid="status">{isDirty ? 'dirty' : 'clean'}</span>
          <button onClick={() => setIsDirty(true)}>Make Dirty</button>
        </div>
      );
    };

    render(
      <CmsDirtyProvider>
        <TestComponent />
      </CmsDirtyProvider>
    );

    // 尚未 dirty 時，分發 beforeunload
    const eventBefore = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(eventBefore);
    expect(eventBefore.defaultPrevented).toBe(false);

    // 切換為 dirty
    fireEvent.click(screen.getByText('Make Dirty'));
    expect(screen.getByTestId('status').textContent).toBe('dirty');

    // 已 dirty 時，分發 beforeunload
    const eventAfter = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(eventAfter);
    expect(eventAfter.defaultPrevented).toBe(true);
  });
});
