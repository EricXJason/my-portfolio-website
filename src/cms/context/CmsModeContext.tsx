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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

export type CmsMode = 'admin' | 'preview' | null;

interface CmsModeContextType {
  mode: CmsMode;
  setMode: (mode: CmsMode) => void;
  signOut: () => void;
}

const CmsModeContext = createContext<CmsModeContextType | undefined>(undefined);

export const CmsModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<CmsMode>(() => {
    try {
      const saved = localStorage.getItem('portfolio_cms_mode') as CmsMode;
      if (saved === 'admin' || saved === 'preview') {
        return saved;
      }
    } catch {}
    return null;
  });

  const setMode = (newMode: CmsMode) => {
    setModeState(newMode);
    try {
      if (newMode) {
        localStorage.setItem('portfolio_cms_mode', newMode);
      } else {
        localStorage.removeItem('portfolio_cms_mode');
      }
    } catch {}
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Firebase Auth Token 仍然有效，維持 admin 模式
        setMode('admin');
      } else {
        // 若 Firebase 未登入且目前是 admin，則同步重設
        const currentSaved = localStorage.getItem('portfolio_cms_mode');
        if (currentSaved === 'admin') {
          setMode(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const signOut = () => {
    try {
      if (auth) {
        firebaseSignOut(auth).catch(() => {});
      }
    } catch {}
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
