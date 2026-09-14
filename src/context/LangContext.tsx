/**
 * ============================================================================
 * 檔案名稱: LangContext.tsx
 * 所屬模組: State Management Layer (全域多國語系狀態管理模組)
 * 責任描述: 負責管理全域語言狀態（正體中文 'zh' 與英文 'en'）、HTML lang 標籤動態注入與字詞字典查詢。
 * 架構分層: State Management Layer (React Context Provider)
 React Context API 結合 Provider 狀態注入模式。
 * 依賴關係: 依賴 site-translations.json 靜態雙語字典。
 * 邊界處理: 查無語系鍵值時自動回退原鍵名、自動同步 document.documentElement.lang。
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../data/site-translations.json';

export type Language = 'zh' | 'en';

interface LangContextType {
  lang: Language;
  toggleLang: () => void;
  setLangDirect: (l: Language) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('zh');

  const setLangDirect = (l: Language) => setLang(l);

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  }, [lang]);

  /**
   * TODO: [後端端點對接] 於正式接入後端 API 後，改由後端動態取得自訂生產字典
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/translations
   * 3. 預期回應: 200 OK: Record<Language, Record<string, string>>
   * 4. 當前狀態: 使用者模式嚴格使用本地標準 site-translations.json，與 CMS 暫存隔離，待後端上線後再進行對接。
   */
  const t = (key: string): string => {
    const translations = (i18n as Record<Language, Record<string, string>>)[lang];
    return translations?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLangDirect, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = (): LangContextType => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
