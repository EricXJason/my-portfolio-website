import React, { createContext, useContext, useState } from 'react';
import i18n from '../data/site-translations.json';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('zh');

  const setLangDirect = (l) => setLang(l);

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const t = (key) => {
    return i18n[lang]?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLangDirect, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
