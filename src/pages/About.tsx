import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const About: React.FC = () => {
  const { locale } = useLanguage();
  const isRTL = locale === 'ar';
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*');
      if (data) {
        const mapped = data.reduce((acc: any, item: any) => {
          if (!acc[item.page]) acc[item.page] = {};
          acc[item.page][item.section] = isRTL ? item.content_ar : item.content_en;
          return acc;
        }, {});
        setContent(mapped);
      }
      setLoading(false);
    };
    fetchContent();
  }, [isRTL]);

  const renderTitle = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const word = part.slice(1, -1);
        return <span key={i} className="text-primary-container">{word}</span>;
      }
      return (
        <React.Fragment key={i}>
          {part.split('\n').map((line, j, arr) => (
            <React.Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>;

  const about = content.about || {};
  const common = content.common || {};
  const profileImage = about.profile_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgepEKNnuoKVcH_X-c9Y0JFoxAJh_st3bAuszuklK5t2nE5GnEoQUXStg9vDDClznwfn8Uw7ybRw91fCsOuOiygj2Sup15zZUCGJsdnW_q5ADKVgTziXcHLO7EgZ6Wn5_e_KpUR5T5FCrbwUNN8reXjdv1Sp6kNY6hA8Whlj_sxJoIPH1eGoa94yTXTx7I_NRvK4Jmyfcj7C-MnqOJiinUr8pt0LKNc8zyLaR2mSK1w19KsHGtUQFbHavI0G-7SAFInso2Ee2mOg";

  return (
    <div className="flex-grow pt-32 pb-section-gap">
      {/* About Section: Contained */}
      <section className="max-w-7xl mx-auto px-gutter min-h-[819px] flex flex-col md:flex-row relative gap-12 lg:gap-20 py-32 items-stretch">
        {/* Left: Gritty Portrait */}
        <div className="w-full md:w-1/2 min-h-[512px] md:min-h-full relative overflow-hidden shadow-2xl border border-white/5">
          <img 
            alt="Photographer Portrait" 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105" 
            src={profileImage}
            style={{ filter: 'grayscale(100%) contrast(1.2)' }}
          />
          {/* Inner glow / depth */}
          <div className="absolute inset-0 border-[1px] border-white/20 pointer-events-none"></div>
          {/* Gradient mask for text overlay if needed on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden"></div>
        </div>

        {/* Right: Bio & Arsenal */}
        <div className="w-full md:w-1/2 bg-surface-container-low px-8 md:px-16 py-16 md:py-24 flex flex-col justify-center relative z-10 border-l border-white/5">
          <div className="max-w-xl ml-auto md:ml-0 md:mr-auto">
            <h1 className={`font-black text-5xl lg:text-[90px] text-primary mb-12 tracking-tighter uppercase break-words ${isRTL ? 'font-alexandria leading-[0.85]' : 'leading-[0.85]'}`}>
              {renderTitle(about.header_title || (isRTL ? "عرق،\nدموع &\n{انتصار}." : "Sweat,\nTears &\n{Triumph}."))}
            </h1>
            
            <div className="space-y-6 text-secondary mb-16">
              {about.bio_text ? (
                about.bio_text.split('\n\n').map((para: string, idx: number) => (
                  <p key={idx} className={`${idx === 0 ? 'text-lg lg:text-xl font-bold' : 'text-sm lg:text-[15px] font-medium'} text-gray-400 leading-relaxed opacity-90`}>
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="font-body-lg text-body-lg text-gray-400 leading-relaxed">
                    {isRTL ? "أنا لا ألتقط صوراً تقليدية للشركات. ألتقط الأجزاء من الثانية التي تصنع التاريخ المهني. الطاقة الحركية الخام والعفوية للرياضيين الذين يتجاوزون حدودهم القصوى." : "I don't shoot corporate headshots. I shoot the milliseconds that define a career. The raw, unfiltered kinetic energy of athletes pushing past their absolute limits."}
                  </p>
                  <p className="font-body-md text-body-md text-gray-400 leading-relaxed">
                    {isRTL ? "مع أكثر من عقد من الزمان على الخطوط الجانبية لمباريات كرة القدم الكبرى، وثّقت عدستي الشغف وراء المجد. الأمر لا يتعلق بالابتسامة المثالية؛ بل بالتوتر، الاصطدام، والانفجار العاطفي للرياضة الاحترافية. كل إطار هو شهادة على الدراما عالية السرعة." : "With over a decade on the sidelines of top-tier football, my lens has captured the grit behind the glory. It's not about the perfect smile; it's about the tension, the impact, and the explosive release of professional sports. Every frame is a testament to high-velocity drama."}
                  </p>
                </>
              )}
            </div>

            {/* Arsenal Section */}
            <div className="border-t border-white/10 pt-8 mt-12">
              <h3 className="font-label-caps text-label-caps text-surface-tint uppercase tracking-widest mb-6">
                {isRTL ? "العتاد الفني" : "The Arsenal"}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">photo_camera</span>
                  <span className="font-body-md text-body-md text-on-surface">{isRTL ? "هيكلين إطار كامل" : "Dual Full-Frame Bodies"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">lens_camera</span>
                  <span className="font-body-md text-body-md text-on-surface">400mm f/2.8 Prime</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">flash_on</span>
                  <span className="font-body-md text-body-md text-on-surface">{isRTL ? "مزامنة فلاش عالية" : "High-Speed Sync"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">memory</span>
                  <span className="font-body-md text-body-md text-on-surface">{isRTL ? "مساحات تخزين تيرابايت" : "Terabytes of Storage"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-gutter mt-section-gap grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Contact Header & Socials (Asymmetric Left) */}
        <div className="lg:col-span-5 lg:col-start-1">
          <h2 className={`font-black text-4xl lg:text-[70px] leading-[0.9] text-primary uppercase mb-16 tracking-tighter ${isRTL ? 'font-alexandria' : ''}`}>
            {renderTitle(isRTL ? "احجز\n{اللقطة}." : "Secure\n{The Shot}.")}
          </h2>
          <div className="flex flex-col gap-6 lg:gap-10 mt-16">
            {common.social_instagram && (
              <a href={common.social_instagram} className={`font-black text-4xl lg:text-[80px] leading-[0.85] text-secondary-fixed hover:text-primary-container transition-all tracking-tighter uppercase block break-words max-w-full ${isRTL ? 'font-alexandria hover:-translate-x-4' : 'hover:translate-x-4'}`} target="_blank" rel="noreferrer">Instagram</a>
            )}
            {common.social_facebook && (
              <a href={common.social_facebook} className={`font-black text-4xl lg:text-[80px] leading-[0.85] text-secondary-fixed hover:text-primary-container transition-all tracking-tighter uppercase block break-words max-w-full ${isRTL ? 'font-alexandria hover:-translate-x-4' : 'hover:translate-x-4'}`} target="_blank" rel="noreferrer">Facebook</a>
            )}
            <a href={`mailto:${common.contact_email}`} className={`font-black text-4xl lg:text-[80px] leading-[0.85] text-secondary-fixed hover:text-primary-container transition-all tracking-tighter uppercase block break-words max-w-full ${isRTL ? 'font-alexandria hover:-translate-x-4' : 'hover:translate-x-4'}`}>{isRTL ? 'البريد الإلكتروني' : 'Email'}</a>
          </div>
        </div>

        {/* Minimalist Form (Right Aligned) */}
        <div className="lg:col-span-6 lg:col-start-7 bg-surface-container-high p-8 md:p-12 relative group mt-16 lg:mt-0">
          {/* Electric Rim */}
          <div className="absolute inset-0 border border-white/10 group-focus-within:border-primary-container transition-colors duration-300 pointer-events-none"></div>
          <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase" htmlFor="name">{isRTL ? "تحديد الهوية" : "Identification"}</label>
              <input className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-body-lg text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors" id="name" name="name" placeholder={isRTL ? "اسمك / الوكالة" : "YOUR NAME / AGENCY"} type="text" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase" htmlFor="email">{isRTL ? "قناة الاتصال" : "Comms Channel"}</label>
              <input className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-body-lg text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors" id="email" name="email" placeholder={isRTL ? "البريد الإلكتروني" : "EMAIL ADDRESS"} type="email" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-secondary mb-2 block uppercase" htmlFor="inquiry">{isRTL ? "موجز المشروع" : "The Brief"}</label>
              <textarea className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-body-lg text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors resize-none" id="inquiry" name="inquiry" placeholder={isRTL ? "تفاصيل المهمة..." : "DETAILS OF THE ASSIGNMENT..."} rows={4}></textarea>
            </div>
            <button className="w-full bg-primary-container text-on-primary-container font-epilogue font-bold uppercase tracking-widest py-6 px-8 hover:bg-surface-tint transition-all active:scale-[0.98] mt-8 flex justify-between items-center group" type="submit">
              <span>{isRTL ? "إرسال الرسالة" : "Deploy Message"}</span>
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default About;
