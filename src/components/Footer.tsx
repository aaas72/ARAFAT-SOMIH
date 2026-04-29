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
    <footer className="w-full border-t border-white/10 bg-[#0A0A0B] py-12 lg:py-16 px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8">
        <div className="text-xl lg:text-lg font-black text-white italic tracking-tighter select-none">
          ARAFAT SOMIH
        </div>
        
        <div className="flex gap-6 lg:gap-8">
          <Link to="/" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <Link to="/work" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">{isRTL ? 'الأعمال' : 'Work'}</Link>
          {common.social_instagram && (
            <a href={common.social_instagram} target="_blank" rel="noreferrer" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">Instagram</a>
          )}
          {common.social_twitter && (
            <a href={common.social_twitter} target="_blank" rel="noreferrer" className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-primary-container transition-colors">Twitter / X</a>
          )}
        </div>

        <div className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 text-center lg:text-right">
          © {new Date().getFullYear()} ARAFAT SOMIH. {isRTL ? 'جميع الحقوق محفوظة' : 'ALL RIGHTS RESERVED'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
