import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { t, locale } = useLanguage();
  const { hero, metadata } = t.home;
  const isRTL = locale === 'ar';

  const renderSubtext = (text: string) => {
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const word = part.slice(1, -1);
        return <span key={i} className="text-white font-bold">{word}</span>;
      }
      return part;
    });
  };

  return (
    <main className="flex-grow">
      <section className="relative h-screen w-full bg-[#0A0A0B] overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero Background"
            className="w-full h-full object-cover object-center mix-blend-luminosity opacity-30 scale-105"
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=2000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
        </div>

        {/* Massive Text Layer */}
        <div className="absolute inset-0 z-10 px-6 lg:px-0">
          <div className={`container mx-auto h-full flex flex-col justify-start pb-32 ${isRTL ? 'pt-24 md:pt-32 lg:pt-40' : 'pt-32 md:pt-48 lg:pt-64'}`}>
            <h1 className="font-epilogue text-[15vw] md:text-[12vw] lg:text-8xl font-black text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter mix-blend-difference m-0 p-0 select-none">
              {hero.title}<br />
              <span className="text-primary-container">{hero.highlight}</span><br />
              {hero.suffix}
            </h1>
            <div className="mt-6 md:mt-8 max-w-lg">
              <p className="font-inter text-gray-400 text-sm md:text-lg lg:text-xl leading-relaxed uppercase tracking-[0.2em] lg:tracking-widest font-light">
                {renderSubtext(hero.subtext)}
              </p>
            </div>
          </div>
        </div>

        {/* Floating UI Elements */}
        <div className="absolute bottom-10 lg:bottom-20 inset-x-0 z-20 px-6 lg:px-0">
          <div className="container mx-auto flex justify-center lg:justify-end">
            <Link
              to="/work"
              className="w-full lg:w-auto bg-primary-container text-black font-inter font-black uppercase text-[10px] tracking-widest px-8 lg:px-12 py-5 lg:py-6 flex items-center justify-center lg:justify-start gap-3 group shadow-brutalist hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-0 active:translate-y-0"
            >
              <span>{hero.cta}</span>
              <span className={`material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Technical Readout Overlay - Adaptive RTL/LTR */}
        <div className={`absolute top-32 z-20 hidden lg:flex flex-col opacity-20 text-white font-mono text-[10px] tracking-[0.5em] uppercase ${isRTL ? 'left-12 items-start text-left' : 'right-12 items-end text-right'}`}>
          <span>{metadata.lat}</span>
          <span>{metadata.lng}</span>
          <span>{metadata.location}</span>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
          <div className="h-full bg-primary-container w-1/3 animate-[loading_10s_ease-in-out_infinite]"></div>
        </div>
      </section>
    </main>
  );
};

export default Home;
