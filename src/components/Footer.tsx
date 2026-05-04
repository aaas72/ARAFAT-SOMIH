import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const Footer: React.FC = () => {
  const { locale } = useLanguage();
  const isRTL = locale === 'ar';
  const [common, setCommon] = useState<any>({});

  useEffect(() => {
    const fetchCommon = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('page', 'common');
      if (data) {
        const mapped = data.reduce((acc: any, item: any) => {
          acc[item.section] = isRTL ? item.content_ar : item.content_en;
          return acc;
        }, {});
        setCommon(mapped);
      }
    };
    fetchCommon();
  }, [isRTL]);

  return (
    <footer className="w-full border-t border-white/10 bg-[#0A0A0B] py-12 lg:py-16 px-6 md:px-12 lg:px-20 xl:px-32" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8">
        <div className="flex flex-col gap-4 max-w-sm text-center lg:text-start">
          <div className="text-xl lg:text-lg font-black text-white italic tracking-tighter select-none">
            ARAFAT SOMIH
          </div>
          {common.footer_desc && (
            <p className={`text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] leading-relaxed ${isRTL ? 'font-tajawal' : 'font-inter'}`}>
              {common.footer_desc}
            </p>
          )}
        </div>

        <div className={`flex gap-6 lg:gap-8 flex-wrap justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Link to="/" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <Link to="/work" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'الأعمال' : 'Work'}</Link>
          <Link to="/awards" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'الجوائز' : 'Awards'}</Link>
          <Link to="/about" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'عني' : 'About'}</Link>
          {common.social_instagram && (
            <a href={common.social_instagram} target="_blank" rel="noreferrer" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">Instagram</a>
          )}
          {common.social_facebook && (
            <a href={common.social_facebook} target="_blank" rel="noreferrer" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">Facebook</a>
          )}
        </div>

        <div className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 text-center lg:text-end flex flex-col gap-2">
          <div>© {new Date().getFullYear()} ARAFAT SOMIH. {isRTL ? 'جميع الحقوق محفوظة' : 'ALL RIGHTS RESERVED'}</div>
          <a href="https://www.linkedin.com/in/abdellahsheikh/" target="_blank" rel="noreferrer" className="hover:text-primary-container transition-colors flex items-center justify-center lg:justify-end gap-1">
            <span>{isRTL ? 'بواسطة عبداللاه شيخ' : 'BY ABDELLAH SHEIKH'}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
