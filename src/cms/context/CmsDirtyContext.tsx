/**
 * ============================================================================
 * 檔案名稱: CmsDirtyContext.tsx
 * 所屬模組: Portfolio CMS (全域表單髒污狀態上下文)
 * 責任描述: 負責追蹤 CMS 編輯器欄位異動狀態，提供 beforeunload 與路由切換之安全攔截依據。
 * 架構分層: CMS Context State Layer
 * 依賴關係: React 原生 Context API。
 * 邊界處理: 監聽瀏覽器 beforeunload 避免關閉分頁遺失資料、支援全域狀態重置。
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CmsDirtyContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

const CmsDirtyContext = createContext<CmsDirtyContextType | undefined>(undefined);

export const CmsDirtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // 當表單處於已修改 (dirty) 狀態時，掛載瀏覽器原生 beforeunload 防誤關閉警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <CmsDirtyContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </CmsDirtyContext.Provider>
  );
};

export const useCmsDirty = (): CmsDirtyContextType => {
  const context = useContext(CmsDirtyContext);
  if (!context) {
    throw new Error('useCmsDirty must be used within a CmsDirtyProvider');
  }
  return context;
};
