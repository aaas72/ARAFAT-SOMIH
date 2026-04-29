import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SEO: React.FC = () => {
  const { locale, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const fetchDynamicSEO = async () => {
      // 1. Determine logical page name from path
      const path = location.pathname;
      let pageKey = 'home';
      if (path.includes('about')) pageKey = 'about';
      else if (path.includes('work')) pageKey = 'work';
      else if (path.includes('awards')) pageKey = 'awards';

      // 2. Fetch dynamic content from Supabase
      const { data } = await supabase.from('site_content').select('*').eq('page', pageKey);
      
      let metaTitle = '';
      let metaDesc = '';

      if (data && data.length > 0) {
        const titleRow = data.find((row: any) => row.section === 'meta_title');
        const descRow = data.find((row: any) => row.section === 'meta_desc');

        if (titleRow) metaTitle = locale === 'ar' ? titleRow.content_ar : titleRow.content_en;
        if (descRow) metaDesc = locale === 'ar' ? descRow.content_ar : descRow.content_en;
      }

      // 3. Fallback to static if DB is empty
      let pageTitle = metaTitle || t.common.footer.branding;
      if (!metaTitle) {
        if (path === '/') {
          pageTitle = `${t.common.footer.branding} — ${locale === 'en' ? 'Sports Photographer' : 'مصور رياضي'}`;
        } else {
          const navItem = t.common.nav.find((item: any) => item.path === path);
          if (navItem) {
            pageTitle = `${navItem.name} | ${t.common.footer.branding}`;
          }
        }
      }

      const descriptionText = metaDesc || (locale === 'en' 
        ? "Professional sports photography capturing high-velocity drama and cinematic football moments."
        : "تصوير رياضي احترافي يوثق الدراما عالية السرعة ولحظات كرة القدم السينمائية.");

      // 4. Update Document Title
      document.title = pageTitle;

      // 5. Update Meta Description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', descriptionText);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = descriptionText;
        document.head.appendChild(meta);
      }

      // 6. Update Open Graph Tags (for Social Media sharing)
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
    };

    fetchDynamicSEO();
  }, [locale, t, location]);

  return null; // Invisible logic component
};

export default SEO;
