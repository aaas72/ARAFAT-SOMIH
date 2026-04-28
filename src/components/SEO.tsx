import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

const SEO: React.FC = () => {
  const { locale, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // 1. Dynamic Page Titles
    const path = location.pathname;
    let pageTitle = t.common.footer.branding;

    if (path === '/') {
      pageTitle = `${t.common.footer.branding} — ${locale === 'en' ? 'Sports Photographer' : 'مصور رياضي'}`;
    } else {
      const navItem = t.common.nav.find((item: any) => item.path === path);
      if (navItem) {
        pageTitle = `${navItem.name} | ${t.common.footer.branding}`;
      }
    }

    document.title = pageTitle;

    // 2. Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionText = locale === 'en' 
      ? "Professional sports photography capturing high-velocity drama and cinematic football moments."
      : "تصوير رياضي احترافي يوثق الدراما عالية السرعة ولحظات كرة القدم السينمائية.";
    
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionText);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = descriptionText;
      document.head.appendChild(meta);
    }

    // 3. Open Graph Tags
    const updateOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOG('og:title', pageTitle);
    updateOG('og:description', descriptionText);
    updateOG('og:locale', locale === 'ar' ? 'ar_AR' : 'en_US');
    updateOG('og:type', 'website');

  }, [locale, t, location]);

  return null; // This component doesn't render anything UI-wise
};

export default SEO;
