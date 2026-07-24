import React, { createContext, useContext, useState } from 'react';
import { i18n } from '../data/i18n';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('zh');

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const t = (key) => {
    return i18n[lang]?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
