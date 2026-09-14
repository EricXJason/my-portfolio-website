/**
 * ============================================================================
 * 檔案名稱: CmsModeContext.tsx
 * 所屬模組: Portfolio CMS (存取權限模式上下文)
 * 責任描述: 負責管理 CMS 當前存取狀態（管理者模式 'admin'、預覽模式 'preview' 或未選擇 null）。
 * 架構分層: CMS Context State Layer
 * 依賴關係: React 原生 Context API。
 * 邊界處理: 預設為 null 阻斷側邊欄存取、提供登出重置狀態函式。
 * ============================================================================
 */

import React, { createContext, useContext, useState } from 'react';

export type CmsMode = 'admin' | 'preview' | null;

interface CmsModeContextType {
  mode: CmsMode;
  setMode: (mode: CmsMode) => void;
  signOut: () => void;
}

const CmsModeContext = createContext<CmsModeContextType | undefined>(undefined);

export const CmsModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CmsMode>(null);

  const signOut = () => {
    setMode(null);
  };

  return (
    <CmsModeContext.Provider value={{ mode, setMode, signOut }}>
      {children}
    </CmsModeContext.Provider>
  );
};

export const useCmsMode = (): CmsModeContextType => {
  const context = useContext(CmsModeContext);
  if (!context) {
    throw new Error('useCmsMode must be used within a CmsModeProvider');
  }
  return context;
};
