import React, { createContext, useContext, useState, useEffect } from 'react';

// Import JSON data for English
import enCommon from '../data/en/common.json';
import enHome from '../data/en/home.json';
import enAbout from '../data/en/about.json';
import enWork from '../data/en/work.json';
import enAwards from '../data/en/awards.json';
import enAdmin from '../data/en/admin.json';

// Import JSON data for Arabic
import arCommon from '../data/ar/common.json';
import arHome from '../data/ar/home.json';
import arAbout from '../data/ar/about.json';
import arWork from '../data/ar/work.json';
import arAwards from '../data/ar/awards.json';
import arAdmin from '../data/ar/admin.json';

type Locale = 'en' | 'ar';

// Define a flexible type for the translation object to satisfy TypeScript
// while maintaining the structure needed by the components.
interface LanguageContextType {
  locale: Locale;
  language: Locale; // Alias for locale to fix TS errors in components
  setLocale: (locale: Locale) => void;
  t: {
    common: any;
    home: any;
    about: any;
    work: any;
    awards: any;
    admin: any;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, any> = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    work: enWork,
    awards: enAwards,
    admin: enAdmin,
  },
  ar: {
    common: arCommon,
    home: arHome,
    about: arAbout,
    work: arWork,
    awards: arAwards,
    admin: arAdmin,
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    return (saved as Locale) || 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Note: Fonts are now managed via CSS [lang="ar"] selectors in index.css 
    // to allow for more granular control (Headings vs Body).
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, language: locale, setLocale, t: translations[locale] }}>
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
