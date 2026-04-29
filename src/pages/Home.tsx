import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

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
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            alt="Hero Background"
            className="w-full h-full object-cover object-center mix-blend-luminosity"
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=2000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
        </motion.div>

        {/* Massive Text Layer */}
        <div className="absolute inset-0 z-10 px-6 md:px-12 lg:px-20 xl:px-32">
          <div className={`container mx-auto h-full flex flex-col justify-start pb-32 ${isRTL ? 'pt-16 md:pt-20 lg:pt-24' : 'pt-20 md:pt-28 lg:pt-32'}`}>
            <motion.h1 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-epilogue text-[15vw] md:text-[12vw] lg:text-8xl font-black text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter mix-blend-difference m-0 p-0 select-none"
            >
              {hero.title}<br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="text-primary-container"
              >
                {hero.highlight}
              </motion.span><br />
              {hero.suffix}
            </motion.h1>
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="mt-6 md:mt-8 max-w-lg"
            >
              <p className="font-inter text-gray-400 text-sm md:text-lg lg:text-xl leading-relaxed uppercase tracking-[0.2em] lg:tracking-widest font-light">
                {renderSubtext(hero.subtext)}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating UI Elements */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 lg:bottom-20 inset-x-0 z-20 px-6 md:px-12 lg:px-20 xl:px-32"
        >
          <div className="container mx-auto flex justify-center lg:justify-end">
            <Link
              to="/work"
              className="w-full lg:w-auto bg-primary-container text-black font-inter font-black uppercase text-[10px] tracking-widest px-8 lg:px-12 py-5 lg:py-6 flex items-center justify-center lg:justify-start gap-3 group shadow-brutalist hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-0 active:translate-y-0"
            >
              <span>{hero.cta}</span>
              <span className={`material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
            </Link>
          </div>
        </motion.div>

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
