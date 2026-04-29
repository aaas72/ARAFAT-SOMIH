import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

const PhotoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language, locale } = useLanguage();
  const detailT = t.work.detail;
  
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data) {
          setPhoto(data);
        } else {
          console.error('Photo not found or error:', error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPhoto();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white font-tajawal">{detailT.loading}</div>;
  if (!photo) return <div className="min-h-screen bg-background flex items-center justify-center text-white font-tajawal">{detailT.notFound}</div>;

  const isRTL = locale === 'ar';
  
  const metadataEntries = [
    { label: detailT.labels.camera, value: photo.camera, icon: 'photo_camera' },
    { label: detailT.labels.lens, value: photo.lens, icon: 'camera' },
    { label: detailT.labels.aperture, value: photo.aperture, icon: 'camera_front' },
    { label: detailT.labels.shutter, value: photo.shutter, icon: 'shutter_speed' },
    { label: detailT.labels.iso, value: photo.iso, icon: 'iso' }
  ].filter(item => item.value);

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen bg-background pt-[80px] lg:pt-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Massive Hero Image Column (75% Desktop) */}
      <section className={`w-full lg:w-[75%] h-[50vh] lg:h-screen relative bg-[#0A0A0B] border-b-2 lg:border-b-0 ${isRTL ? 'lg:border-l-2' : 'lg:border-r-2'} border-primary-container lg:sticky lg:top-0 order-1 lg:order-1 overflow-hidden`}>
        <div className="absolute inset-0 z-0 opacity-40 blur-xl scale-110">
          <img
            src={photo.image_url}
            className="w-full h-full object-cover grayscale contrast-150"
            alt="Ambient background"
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 lg:p-12">
          <motion.img
            key={photo.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            alt={language === 'ar' ? photo.title_ar : photo.title_en}
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            src={photo.image_url}
          />
        </div>
      </section>

      {/* Metadata Sidebar (25% Desktop) */}
      <aside className={`w-full lg:w-[25%] bg-[#1A1A1C] border-white/5 flex flex-col p-8 lg:p-10 lg:overflow-y-auto order-2 lg:order-2 ${isRTL ? 'border-r' : 'border-l'}`}>
        <nav className="mb-12 lg:mb-16">
          <Link
            to="/work"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:text-primary-container hover:border-primary-container transition-all duration-300 font-inter font-bold uppercase text-[10px] tracking-widest mt-4 lg:mt-16"
          >
            <span className={`material-symbols-outlined text-sm transform ${isRTL ? 'rotate-180' : 'rotate-0'}`}>arrow_back</span>
            <span>{detailT.back}</span>
          </Link>
        </nav>

        <header className="mb-10">
          <motion.h1
            key={`title-${photo.id}`}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-epilogue text-3xl lg:text-4xl text-white mb-5 uppercase tracking-tighter border-primary-container ps-5 leading-tight ${isRTL ? 'border-r-4 text-right pr-5 ps-0' : 'border-l-4 text-left'} `}
          >
            {language === 'ar' ? photo.title_ar : photo.title_en}
          </motion.h1>
          <p className={`font-inter text-sm lg:text-body-md text-gray-400 leading-relaxed opacity-80 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? photo.description_ar : photo.description_en}
          </p>
        </header>

        <div className="w-full h-px bg-white/10 mb-12 lg:mb-12 relative">
          <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 w-12 h-px bg-primary-container`}></div>
        </div>

        <section className="mb-10">
          <h3 className={`font-inter font-bold text-[10px] text-gray-600 mb-6 uppercase tracking-[0.3em] ${isRTL ? 'text-right' : 'text-left'}`}>
            {detailT.metadataTitle}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {metadataEntries.map((item, idx) => (
              <div key={idx} className={`flex flex-col gap-1.5 p-4 bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors ${idx === 4 ? 'col-span-2 lg:col-span-1 xl:col-span-2' : ''} ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}>
                <span className="material-symbols-outlined text-primary-container text-lg">{item.icon}</span>
                <span className="font-inter font-bold text-[9px] text-gray-500 uppercase tracking-widest">{item.label}</span>
                <span className="font-inter font-black text-xs text-white uppercase">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
};

export default PhotoDetail;
