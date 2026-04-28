import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t, locale } = useLanguage();
  const { title, bio, arsenal, contact } = t.about;
  const isRTL = locale === 'ar';

  const renderTitle = (text: string) => {
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const word = part.slice(1, -1);
        return <span key={i} className="text-primary-container">{word}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex-grow pt-24 lg:pt-32 pb-16 lg:pb-section-gap bg-background overflow-x-hidden">
      {/* About Section: Split Screen */}
      <section className="min-h-screen lg:min-h-[819px] flex flex-col lg:flex-row relative gap-12 lg:gap-20 py-16 lg:py-32 container mx-auto px-6 lg:px-0">
        {/* Left: Gritty Portrait */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[819px] lg:min-h-full relative overflow-hidden order-1">
          <img
            alt="Photographer Portrait"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src="https://res.cloudinary.com/asdev1/image/upload/v1777334285/profile_hewum0.jpg"
            style={{ filter: 'grayscale(100%) contrast(1.2)' }}
          />
          <div className="absolute inset-0 border-[1px] border-white/20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden"></div>
        </div>

        {/* Right: Bio & Arsenal */}
        <div className="w-full lg:w-1/2 bg-surface-container-low px-8 lg:px-16 py-12 lg:py-24 flex flex-col justify-center relative z-10 border-s border-white/5 order-2">
          <div className="max-w-xl ml-auto lg:ml-0 lg:mr-auto">
            <motion.h1
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-epilogue text-5xl lg:text-7xl text-primary font-bold mb-8 uppercase break-words ${isRTL ? 'leading-[0.8] tracking-normal' : 'leading-[0.9] tracking-tighter'}`}
            >
              {renderTitle(title)}
            </motion.h1>

            <div className="space-y-6 text-gray-400 mb-12 lg:mb-16">
              {bio.map((paragraph, idx) => (
                <p key={idx} className="font-inter text-body-md lg:text-body-lg text-gray-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Arsenal Section */}
            <div className="border-t border-white/10 pt-8 mt-12">
              <h3 className="font-inter font-bold text-[10px] lg:text-label-caps text-surface-tint uppercase tracking-widest mb-6">
                {arsenal.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {arsenal.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant text-2xl">{item.icon}</span>
                    <span className="font-inter text-sm lg:text-body-md text-on-surface">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto mt-20 lg:mt-section-gap grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter items-start px-6 lg:px-0">
        {/* Contact Header & Socials */}
        <div className="lg:col-span-5 lg:col-start-1">
          <h2 className={`font-epilogue text-5xl lg:text-7xl font-black text-primary uppercase mb-12 lg:mb-16 tracking-tighter leading-[0.8] ${isRTL ? 'tracking-normal' : ''}`}>
            {renderTitle(contact.title)}
          </h2>
          <div className="flex flex-col gap-4 mt-12 lg:mt-20">
            {contact.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className={`font-epilogue text-5xl md:text-8xl font-black text-secondary-fixed hover:text-primary-container transition-all duration-300 tracking-[0.02em] uppercase inline-block w-fit leading-[0.8] ${isRTL ? 'lg:hover:-translate-x-4 tracking-normal' : 'lg:hover:translate-x-4'}`}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        {/* Minimalist Form */}
        <div className="lg:col-span-6 lg:col-start-7 bg-surface-container-high p-8 lg:p-12 relative group mt-16 lg:mt-0">
          <div className="absolute inset-0 border border-white/10 group-focus-within:border-primary-container transition-colors duration-300 pointer-events-none"></div>

          <form className="space-y-8 relative z-10">
            <div>
              <label className="font-inter font-bold text-[10px] lg:text-label-caps text-secondary mb-2 block uppercase tracking-widest">
                {contact.form.idLabel}
              </label>
              <input
                className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-inter text-body-md lg:text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors"
                placeholder={contact.form.idPlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="font-inter font-bold text-[10px] lg:text-label-caps text-secondary mb-2 block uppercase tracking-widest">
                {contact.form.commsLabel}
              </label>
              <input
                className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-inter text-body-md lg:text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors"
                placeholder={contact.form.commsPlaceholder}
                type="email"
              />
            </div>
            <div>
              <label className="font-inter font-bold text-[10px] lg:text-label-caps text-secondary mb-2 block uppercase tracking-widest">
                {contact.form.briefLabel}
              </label>
              <textarea
                className="w-full bg-transparent border-b border-white/20 focus:border-primary-container border-t-0 border-l-0 border-r-0 rounded-none px-0 py-4 font-inter text-body-md lg:text-body-lg text-primary placeholder-on-tertiary-container focus:ring-0 transition-colors resize-none"
                placeholder={contact.form.briefPlaceholder}
                rows={4}
              />
            </div>
            <button
              className="w-full bg-primary-container text-on-primary-container font-epilogue font-bold uppercase tracking-widest py-6 px-8 hover:bg-surface-tint transition-all active:scale-[0.98] mt-8 flex justify-between items-center group"
              type="submit"
            >
              <span>{contact.form.submit}</span>
              <span className={`material-symbols-outlined group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default About;
