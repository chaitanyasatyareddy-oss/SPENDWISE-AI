import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, CurrencyCode } from '../types';
import { getTranslationsForLanguage } from '../utils/i18n/languages';
import { TranslationSchema, SUPPORTED_LANGUAGES } from '../utils/i18n/translations';
import { CURRENCY_CONFIGS, formatCurrency } from '../utils/formatters';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  t: TranslationSchema;
  formatMoney: (amountInINR: number, showSymbol?: boolean) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('spendwise_locale') as LanguageCode) || 'en';
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('spendwise_currency') as CurrencyCode) || 'INR';
  });

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const isRtl = langMeta ? langMeta.isRtl : (language === 'ar' || language === 'ur');

  // Dynamically update document direction for RTL languages
  useEffect(() => {
    const root = document.documentElement;
    if (isRtl) {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl-layout');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl-layout');
    }
  }, [isRtl, language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('spendwise_locale', lang);
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('spendwise_currency', curr);
  };

  // Safe fallback proxy translations
  const t = getTranslationsForLanguage(language);

  const formatMoney = (amountInINR: number, showSymbol = true) => {
    return formatCurrency(amountInINR, currency, showSymbol);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatMoney,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
