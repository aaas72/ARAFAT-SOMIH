import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Loading: React.FC = () => {
  const { t, locale } = useLanguage();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cinematic Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-2 border-primary-container/10 border-t-primary-container rounded-full animate-spin"></div>
        <div className="absolute inset-0 m-auto w-8 h-8 bg-primary-container/20 rounded-full animate-pulse blur-sm"></div>
      </div>
      
      {/* Status Text */}
      <div className="overflow-hidden px-6 text-center">
        <p className={`text-[10px] font-black uppercase tracking-[0.4em] text-primary-container/60 animate-pulse ${isRTL ? 'font-tajawal' : 'font-inter'}`}>
          {t.common.loading}
        </p>
      </div>
    </div>
  );
};

export default Loading;
