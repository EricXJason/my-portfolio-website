/**
 * ============================================================================
 * 檔案名稱: ThemeContext.tsx
 * 所屬模組: State Management Layer (全域深淺色主題狀態管理模組)
 * 責任描述: 負責管理全域外觀模式（暗黑模式 'dark' 與明亮模式 'light'），並即時切換 HTML documentElement 樣式類別。
 * 架構分層: State Management Layer (React Context Provider)
 React Context API 結合 Custom Hook 狀態封裝模式。
 * 依賴關係: 依賴 React 原生 Context API。
 * 邊界處理: 未於 Provider 內部呼叫時拋出明確錯誤、根節點 class 清單防禦。
 * ============================================================================
 */

/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
