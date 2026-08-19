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
