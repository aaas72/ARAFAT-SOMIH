import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Awards: React.FC = () => {
  const { t, locale } = useLanguage();
  const { header, items } = t.awards;
  
  const [activeImage, setActiveImage] = useState(items[0].img);

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen bg-background lg:overflow-hidden">
      {/* Left Column: Fixed Hero with Dynamic Background */}
      <section className="w-full lg:w-1/2 relative h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-75"
            style={{ backgroundImage: `url('${activeImage}')` }}
          ></motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

        <div className="relative z-10 h-full flex flex-col justify-end lg:justify-center items-start p-8 lg:p-0">
          <div className="w-full max-w-3xl lg:px-20">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-epilogue text-4xl lg:text-8xl font-black text-white mb-6 leading-[0.9] lg:leading-none tracking-tighter mix-blend-difference uppercase"
              dangerouslySetInnerHTML={{ __html: header.title }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-primary-container shadow-[0_0_15px_rgba(57,255,20,0.6)]"
            ></motion.div>
          </div>
        </div>
      </section>

      {/* Right Column: Scrollable List with Hover Effect */}
      <section className="w-full lg:w-1/2 h-auto lg:h-full bg-background lg:overflow-y-auto lg:scrollbar-hide">
        <style dangerouslySetInnerHTML={{
          __html: `
          .lg\\:scrollbar-hide::-webkit-scrollbar { display: none; }
          .lg\\:scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        <div className="w-full max-w-3xl px-8 lg:px-20 py-12 lg:py-24">
          <div className="flex flex-col">
            {items.map((award, idx) => (
              <motion.article
                key={idx}
                onMouseEnter={() => setActiveImage(award.img)}
                onClick={() => setActiveImage(award.img)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-baseline py-8 lg:py-10 border-b border-white/5 group cursor-pointer"
              >
                <div className="md:w-24 mb-3 md:mb-0">
                  <span className="font-mono text-gray-600 text-xs lg:text-sm group-hover:text-primary-container transition-colors tracking-tighter">{award.year}</span>
                </div>
                <div className="flex-1 pr-6">
                  <h2 className="font-epilogue text-xl lg:text-3xl font-bold text-white group-hover:text-primary-container transition-colors duration-300 leading-[1.1]">
                    {award.title}
                  </h2>
                  <p className="font-inter text-[9px] lg:text-xs text-gray-500 mt-3 uppercase tracking-[0.2em] font-bold opacity-60">
                    {award.category}
                  </p>
                </div>
                <div className={`hidden lg:flex items-center opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 text-primary-container ${locale === 'ar' ? 'rotate-180' : ''}`}>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 lg:mt-20 pt-8 lg:pt-10 border-t border-white/5 opacity-40"
          >
            <p className="font-inter text-gray-500 text-[9px] lg:text-[10px] tracking-[0.3em] uppercase leading-relaxed max-w-xs">
              {header.meta}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Awards;
