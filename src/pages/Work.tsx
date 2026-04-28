import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Skeleton Component
const Skeleton = () => (
  <div className="w-full h-[300px] lg:h-[400px] bg-[#1A1A1C] relative overflow-hidden animate-pulse flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 opacity-20">
      <span className="material-symbols-outlined text-4xl lg:text-5xl text-primary-container">photo_camera</span>
      <span className="font-inter font-bold text-[8px] lg:text-[10px] uppercase tracking-widest text-white">...</span>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
  </div>
);

const PhotoCard: React.FC<{ item: any, onClick: () => void }> = ({ item, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-full break-inside-avoid overflow-hidden bg-[#1A1A1C] cursor-pointer group/item transition-all duration-500 mb-4 lg:mb-gutter"
    >
      {!isLoaded && <Skeleton />}

      <img
        alt={item.title}
        className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:grayscale lg:group-hover/item:grayscale-0 lg:hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0 h-0'}`}
        src={item.imageUrl}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />

      {isLoaded && (
        <>
          <div className="absolute inset-0 border border-white/10 pointer-events-none lg:group-hover/item:border-primary-container transition-colors duration-300"></div>
          <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 bg-background/90 px-4 lg:px-6 py-2 lg:py-3 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 transition-opacity">
            <span className="font-inter font-black text-[11px] lg:text-body-md text-white uppercase tracking-widest">{item.title}</span>
          </div>
        </>
      )}
    </div>
  );
};

const Work: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { header, photos, loading, cta } = t.work;
  
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const visibleItems = photos.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && visibleCount < photos.length) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 6);
          setLoadingMore(false);
        }, 800);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadingMore, visibleCount, photos.length]);

  return (
    <div className="flex-grow pt-[80px] lg:pt-[100px] bg-background">
      <SectionHeader
        title={header.title}
        subtitle={header.subtitle}
        meta={header.meta}
      />

      <section className="container mx-auto px-6 lg:px-0 pb-16 lg:pb-section-gap">
        <div className="group columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-gutter space-y-4 lg:space-y-gutter">
          {visibleItems.map((item) => (
            <PhotoCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/work/${item.id}`)}
            />
          ))}
        </div>

        {/* Observer Trigger */}
        <div ref={loaderRef} className="w-full py-12 lg:py-20 flex justify-center items-center">
          {visibleCount < photos.length && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 border-2 border-primary-container/20 border-t-primary-container rounded-full animate-spin"></div>
              <span className="font-inter font-bold text-[8px] lg:text-[10px] uppercase tracking-[0.4em] text-primary-container animate-pulse">
                {loading}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Work;
