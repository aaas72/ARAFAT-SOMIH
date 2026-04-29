import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import exifr from 'exifr';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const AutoTextArea: React.FC<{ value: string, onChange: (val: string) => void, dir: string, className?: string }> = ({ value, onChange, dir, className }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
  useEffect(() => { adjustHeight(); }, [value]);
  return <textarea ref={textAreaRef} className={className} value={value} onChange={(e) => { onChange(e.target.value); adjustHeight(); }} dir={dir} rows={1} style={{ overflow: 'hidden' }} />;
};

const Admin: React.FC = () => {
  const { t, locale, setLocale } = useLanguage();
  const isRTL = locale === 'ar';
  const adminT = t.admin;

  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('photos');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [photos, setPhotos] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [groupedContent, setGroupedContent] = useState<{ [key: string]: any[] }>({});
  const [pendingEdits, setPendingEdits] = useState<Record<string, {content_ar: string, content_en: string}>>({});

  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const awardFileInputRef = useRef<HTMLInputElement>(null);
  const genericImageInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  const [photoForm, setPhotoForm] = useState({
    title_en: '', title_ar: '', category_en: 'Action', category_ar: 'حركة',
    description_en: '', description_ar: '', camera: '', lens: '',
    aperture: '', shutter: '', iso: '', display_order: 1, image_url: ''
  });

  const [awardForm, setAwardForm] = useState({ year: '2024', title_en: '', title_ar: '', category_en: '', category_ar: '', image_url: '' });

  const translateKey = (key: string) => adminT.keys[key] || key;
  const isImageField = (key: string) => key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('logo');
  const isSingleValueField = (key: string) => ['contact_email', 'contact_phone', 'social_instagram', 'social_twitter', 'social_facebook', 'location_city'].includes(key) || isImageField(key);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) fetchData(); }, [session, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'photos') {
      const { data } = await supabase.from('photos').select('*').order('display_order', { ascending: true });
      if (data) setPhotos(data);
    } else if (activeTab === 'awards') {
      const { data } = await supabase.from('awards').select('*').order('year', { ascending: false });
      if (data) setAwards(data);
    } else if (['about', 'common'].includes(activeTab)) {
      const { data } = await supabase.from('site_content').select('*').eq('page', activeTab);
      if (data) {
        // Migration: Rename social_twitter to social_facebook if found
        const migratedData = data.map(item => {
          if (item.section === 'social_twitter') {
            return { ...item, section: 'social_facebook' };
          }
          return item;
        });
        
        migratedData.sort((a, b) => (isImageField(a.section) && !isImageField(b.section) ? -1 : 1));
        setGroupedContent({ [activeTab]: migratedData });
        setPendingEdits({});
      }
    }
    setLoading(false);
  };

  const uploadFile = async (file: File, folder: string = 'site-content') => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 2500, useWebWorker: true };
    const compressedFile = await imageCompression(file, options);
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from('work-photos').upload(`${folder}/${fileName}`, compressedFile);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('work-photos').getPublicUrl(data.path);
    return publicUrl;
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = photoForm.image_url;
      const file = fileInputRef.current?.files?.[0];
      if (file) imageUrl = await uploadFile(file, 'works');
      if (editingId) await supabase.from('photos').update({ ...photoForm, image_url: imageUrl }).eq('id', editingId);
      else await supabase.from('photos').insert([{ ...photoForm, image_url: imageUrl }]);
      setStatus({ type: 'success', msg: adminT.status.saved });
      cancelEdit(); fetchData();
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setLoading(false); }
  };

  const handleAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = awardForm.image_url;
      const file = awardFileInputRef.current?.files?.[0];
      if (file) imageUrl = await uploadFile(file, 'awards');
      if (editingId) await supabase.from('awards').update({ ...awardForm, image_url: imageUrl }).eq('id', editingId);
      else await supabase.from('awards').insert([{ ...awardForm, image_url: imageUrl }]);
      setStatus({ type: 'success', msg: adminT.status.saved });
      cancelEdit(); fetchData();
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setLoading(false); }
  };

  const handleGenericImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadId) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, 'site-content');
      await supabase.from('site_content').update({ content_ar: url, content_en: url }).eq('id', currentUploadId);
      setStatus({ type: 'success', msg: adminT.status.updated });
      fetchData();
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setLoading(false); setCurrentUploadId(null); }
  };

  const handleContentChange = (id: string, field: 'content_ar' | 'content_en', value: string, forceSync = false) => {
    setPendingEdits(prev => {
      const currentItem = groupedContent[activeTab].find(i => i.id === id);
      const existing = prev[id] || { content_ar: currentItem.content_ar, content_en: currentItem.content_en };
      const updated = { ...existing, [field]: value };
      if (forceSync) {
        updated.content_en = value;
        updated.content_ar = value;
      }
      return { ...prev, [id]: updated };
    });
  };

  const saveContentChanges = async () => {
    setLoading(true);
    try {
      for (const [id, values] of Object.entries(pendingEdits)) {
        const item = groupedContent[activeTab].find(i => i.id === id);
        await supabase.from('site_content').update({ ...values, section: item.section }).eq('id', id);
      }
      setStatus({ type: 'success', msg: adminT.status.changes_saved });
      setPendingEdits({}); fetchData();
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setLoading(false); }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'photos') { setPhotoForm({ ...item }); setPreviewUrl(item.image_url); }
    else if (activeTab === 'awards') { setAwardForm({ ...item }); setPreviewUrl(item.image_url); }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null); setPreviewUrl(null); setShowForm(false);
    setPhotoForm({ title_en: '', title_ar: '', category_en: 'Action', category_ar: 'حركة', description_en: '', description_ar: '', camera: '', lens: '', aperture: '', shutter: '', iso: '', display_order: 1, image_url: '' });
    setAwardForm({ year: '2024', title_en: '', title_ar: '', category_en: '', category_ar: '', image_url: '' });
    setPendingEdits({});
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md bg-[#151517] p-8 md:p-12 border border-white/5 text-center shadow-2xl rounded-sm">
          <h1 className="font-epilogue text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">{adminT.login.title}</h1>
          <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); const {error} = await supabase.auth.signInWithPassword({email, password}); if(error) alert(error.message); setLoading(false); }} className="space-y-4">
            <input type="email" placeholder={adminT.login.email} className="w-full bg-black border border-white/10 p-4 md:p-5 text-white text-center outline-none focus:border-primary-container" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder={adminT.login.password} className="w-full bg-black border border-white/10 p-4 md:p-5 text-white text-center outline-none focus:border-primary-container" value={password} onChange={e => setPassword(e.target.value)} required />
            <button disabled={loading} className="w-full py-4 md:py-5 bg-primary-container text-black font-black uppercase text-sm">{loading ? adminT.login.checking : adminT.login.submit}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-20 md:pt-24 pb-20 px-4 md:px-10 lg:px-20 font-tajawal" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <header className={`flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 gap-6 ${isRTL ? 'border-r-4 md:border-r-8 pr-4 md:pr-8' : 'border-l-4 md:border-l-8 pl-4 md:pl-8'} border-primary-container`}>
          <h1 className="font-epilogue text-3xl md:text-6xl font-black uppercase tracking-tight leading-none text-center md:text-right">
            {adminT.header.title} <span className="text-primary-container">{adminT.header.subtitle}</span>
          </h1>
          <div className="flex gap-4">
            <button onClick={() => supabase.auth.signOut()} className="px-8 py-3 border border-white/10 text-white font-black text-xs hover:bg-white hover:text-black transition-all uppercase tracking-widest">{adminT.header.logout}</button>
          </div>
        </header>

        <nav className="flex gap-2 md:gap-8 mb-10 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-md z-40">
          <TabButton active={activeTab === 'photos'} onClick={() => { setActiveTab('photos'); cancelEdit(); }} icon="photo_library" label={adminT.tabs.photos} />
          <TabButton active={activeTab === 'awards'} onClick={() => { setActiveTab('awards'); cancelEdit(); }} icon="emoji_events" label={adminT.tabs.awards} />
          <TabButton active={activeTab === 'about'} onClick={() => { setActiveTab('about'); cancelEdit(); }} icon="person" label={adminT.tabs.about} />
          <TabButton active={activeTab === 'common'} onClick={() => { setActiveTab('common'); cancelEdit(); }} icon="public" label={adminT.tabs.common} />
        </nav>

        <div className="flex flex-col gap-10">
            {(activeTab === 'photos' || activeTab === 'awards') && (
              <div className="flex justify-between items-center bg-[#151517] p-6 border border-white/5 rounded-sm">
                 <h2 className="text-xl md:text-2xl font-black uppercase flex items-center gap-4">
                    <span className="w-2 h-6 bg-primary-container"></span>
                    {activeTab === 'photos' ? adminT.sections.gallery : adminT.sections.awards_record}
                 </h2>
                 <button onClick={() => setShowForm(!showForm)} className={`px-6 py-3 font-black text-xs uppercase flex items-center gap-3 transition-all ${showForm ? 'bg-white text-black' : 'bg-primary-container text-black hover:bg-white'}`}>
                    <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
                    {showForm ? adminT.actions.close : (activeTab === 'photos' ? adminT.sections.add_work : adminT.sections.add_award)}
                 </button>
              </div>
            )}

            <AnimatePresence>
               {showForm && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    {activeTab === 'photos' ? (
                       <form onSubmit={handlePhotoSubmit} className="bg-[#151517] p-6 md:p-10 border border-primary-container/20 space-y-6 shadow-2xl rounded-sm mb-10">
                          <h3 className="font-black text-lg md:text-xl text-primary-container">{editingId ? adminT.sections.edit_work : adminT.sections.new_work}</h3>
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                             <div onClick={() => fileInputRef.current?.click()} className="lg:col-span-4 aspect-square bg-black border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-primary-container transition-all group overflow-hidden">
                                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center opacity-40"><span className="material-symbols-outlined text-4xl">add_a_photo</span><p className="text-[10px] font-bold mt-2">{adminT.fields.select_photo}</p></div>}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (file) { setPreviewUrl(URL.createObjectURL(file)); const exif = await exifr.parse(file); if (exif) setPhotoForm({...photoForm, camera: exif.Model || '', lens: exif.LensModel || '', aperture: exif.FNumber ? `f/${exif.FNumber}` : '', shutter: exif.ExposureTime ? (exif.ExposureTime < 1 ? `1/${Math.round(1/exif.ExposureTime)}s` : `${exif.ExposureTime}s`) : '', iso: String(exif.ISO || '')}); } }} />
                             </div>
                             <div className="lg:col-span-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label={adminT.fields.title_ar} value={photoForm.title_ar} onChange={v => setPhotoForm({...photoForm, title_ar: v})} required /><Input label={adminT.fields.title_en} value={photoForm.title_en} onChange={v => setPhotoForm({...photoForm, title_en: v})} required isEn /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><TextArea label={adminT.fields.desc_ar} value={photoForm.description_ar} onChange={v => setPhotoForm({...photoForm, description_ar: v})} required /><TextArea label={adminT.fields.desc_en} value={photoForm.description_en} onChange={v => setPhotoForm({...photoForm, description_en: v})} required isEn /></div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><Input label={adminT.fields.camera} value={photoForm.camera} onChange={v => setPhotoForm({...photoForm, camera: v})} isEn required /><Input label={adminT.fields.iso} value={photoForm.iso} onChange={v => setPhotoForm({...photoForm, iso: v})} isEn required /><Input label={adminT.fields.display_order} value={photoForm.display_order} onChange={v => setPhotoForm({...photoForm, display_order: Number(v)})} isEn required /></div>
                                <div className="flex gap-4">
                                   <button disabled={loading} className="flex-grow py-5 bg-primary-container text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-lg">{editingId ? adminT.actions.update : adminT.actions.publish}</button>
                                   <button type="button" onClick={cancelEdit} className="px-8 py-5 border border-white/10 font-black text-xs uppercase hover:bg-white/5 transition-all">{adminT.actions.cancel}</button>
                                </div>
                             </div>
                          </div>
                       </form>
                    ) : (
                       <form onSubmit={handleAwardSubmit} className="bg-[#151517] p-6 md:p-10 border border-primary-container/20 space-y-6 shadow-2xl rounded-sm mb-10">
                          <h3 className="font-black text-lg md:text-xl text-primary-container">{editingId ? adminT.sections.edit_award : adminT.sections.new_award}</h3>
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                             <div onClick={() => awardFileInputRef.current?.click()} className="lg:col-span-4 aspect-video bg-black border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-primary-container transition-all group overflow-hidden">
                                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center opacity-40"><span className="material-symbols-outlined text-4xl">military_tech</span><p className="text-[10px] font-bold mt-2">{adminT.fields.select_photo}</p></div>}
                                <input type="file" ref={awardFileInputRef} className="hidden" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) setPreviewUrl(URL.createObjectURL(file)); }} />
                             </div>
                             <div className="lg:col-span-8 space-y-6">
                                <Input label={adminT.fields.year} value={awardForm.year} onChange={v => setAwardForm({...awardForm, year: v})} required />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label={adminT.fields.title_ar} value={awardForm.title_ar} onChange={v => setAwardForm({...awardForm, title_ar: v})} required /><Input label={adminT.fields.title_en} value={awardForm.title_en} onChange={v => setAwardForm({...awardForm, title_en: v})} required isEn /></div>
                                <div className="flex gap-4">
                                   <button disabled={loading} className="flex-grow py-5 bg-primary-container text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-lg">{editingId ? adminT.actions.save : adminT.actions.publish}</button>
                                   <button type="button" onClick={cancelEdit} className="px-8 py-5 border border-white/10 font-black text-xs uppercase hover:bg-white/5 transition-all">{adminT.actions.cancel}</button>
                                </div>
                             </div>
                          </div>
                       </form>
                    )}
                 </motion.div>
               )}
            </AnimatePresence>

            {activeTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {photos.map(p => (
                  <div key={p.id} className="group relative aspect-video bg-[#151517] border border-white/5 overflow-hidden rounded-sm shadow-xl">
                    <img src={p.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 lg:opacity-0 group-hover:opacity-100 transition-all">
                      <div className="flex gap-2 w-full justify-between items-center">
                         <p className={`text-[10px] font-black uppercase tracking-widest text-primary-container truncate ${isRTL ? 'font-tajawal' : 'font-inter'}`}>{isRTL ? p.title_ar : p.title_en}</p>
                         <div className="flex gap-2">
                            <button onClick={() => startEdit(p)} className="w-8 h-8 bg-primary-container text-black rounded-full flex items-center justify-center hover:scale-110 transition-all"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                            <button onClick={() => { if(confirm(adminT.actions.confirm_delete)) supabase.from('photos').delete().eq('id', p.id).then(() => fetchData()) }} className="w-8 h-8 bg-black/70 text-primary-container border border-primary-container/20 rounded-full flex items-center justify-center hover:scale-110 transition-all"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'awards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {awards.map(a => (
                  <div key={a.id} className="bg-[#151517] p-4 md:p-6 border border-white/5 flex gap-4 md:gap-8 items-center group hover:border-primary-container/30 transition-all rounded-sm shadow-xl">
                     <div className="w-20 md:w-32 aspect-square bg-black overflow-hidden flex-shrink-0 border border-white/5">
                        {a.image_url ? <img src={a.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined text-3xl">emoji_events</span></div>}
                     </div>
                     <div className="flex-grow flex justify-between items-center">
                        <div className="space-y-1">
                           <span className="text-2xl md:text-3xl font-black text-primary-container opacity-50 group-hover:opacity-100 transition-all">{a.year}</span>
                           <p className="font-black text-sm md:text-lg truncate max-w-[120px] md:max-w-full">{isRTL ? a.title_ar : a.title_en}</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isRTL ? a.category_ar : a.category_en}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => startEdit(a)} className="w-8 h-8 md:w-10 md:h-10 bg-primary-container text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"><span className="material-symbols-outlined text-sm">edit</span></button>
                           <button onClick={() => { if(confirm(adminT.actions.confirm_delete)) supabase.from('awards').delete().eq('id', a.id).then(() => fetchData()) }} className="w-8 h-8 md:w-10 md:h-10 bg-black/70 text-primary-container border border-primary-container/20 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {['about', 'common'].includes(activeTab) && (
              <div className="flex flex-col gap-8 md:gap-12">
                <input type="file" ref={genericImageInputRef} className="hidden" accept="image/*" onChange={handleGenericImageUpload} />
                {Object.keys(groupedContent).map(page => (
                  <div key={page} className="bg-[#151517] p-6 md:p-10 border border-white/5 shadow-2xl h-fit rounded-sm">
                     <div className={`flex items-center gap-3 mb-8 md:mb-10 ${isRTL ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                        <span className="w-1.5 h-6 md:w-2 md:h-8 bg-primary-container"></span>
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none">{translateKey(page)}</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 h-fit">
                        {groupedContent[page].map(item => (
                          <div key={item.id} className="flex flex-col h-fit">
                             <p className="text-[12px] font-black uppercase text-primary-container tracking-widest mb-4">{translateKey(item.section)}</p>
                             {isImageField(item.section) ? (
                               <div className="space-y-3 w-full max-w-md mb-6">
                                  <div onClick={() => { if(!loading) { setCurrentUploadId(item.id); genericImageInputRef.current?.click(); } }} className="w-full aspect-square bg-black/50 border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary-container transition-all relative overflow-hidden rounded-sm group-image">
                                     {item.content_ar ? <img src={item.content_ar} className={`w-full h-full object-cover transition-transform duration-700 group-image-hover:scale-110 ${loading && currentUploadId === item.id ? 'opacity-20' : ''}`} /> : <span className="material-symbols-outlined text-4xl opacity-20">image</span>}
                                     <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-all ${loading && currentUploadId === item.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                                        {loading && currentUploadId === item.id ? (
                                          <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-[11px] font-black uppercase text-primary-container tracking-widest">{adminT.actions.saving}</p>
                                          </div>
                                        ) : <span className="material-symbols-outlined text-white text-3xl">cloud_upload</span>}
                                     </div>
                                  </div>
                                  <p className="text-[9px] text-gray-500 text-center uppercase font-bold tracking-widest">{adminT.fields.change_photo}</p>
                               </div>
                             ) : isSingleValueField(item.section) ? (
                               <div className="space-y-2 h-fit">
                                  <AutoTextArea className="w-full bg-black/50 border border-white/10 p-4 text-sm text-white focus:border-primary-container outline-none transition-all resize-none font-inter" value={pendingEdits[item.id]?.content_ar ?? item.content_ar} onChange={val => handleContentChange(item.id, 'content_ar', val, true)} dir="ltr" />
                               </div>
                             ) : (
                               <div className="flex flex-col gap-4 h-fit">
                                  <div className="space-y-2 h-fit">
                                     <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{adminT.fields.ar_label}</label>
                                     <AutoTextArea className="w-full bg-black/50 border border-white/10 p-4 text-sm text-white focus:border-primary-container outline-none transition-all resize-none font-tajawal" value={pendingEdits[item.id]?.content_ar ?? item.content_ar} onChange={val => handleContentChange(item.id, 'content_ar', val)} dir="rtl" />
                                  </div>
                                  <div className="space-y-2 h-fit">
                                     <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{adminT.fields.en_label}</label>
                                     <AutoTextArea className="w-full bg-black/50 border border-white/10 p-4 text-sm text-white focus:border-primary-container outline-none transition-all resize-none font-inter" value={pendingEdits[item.id]?.content_en ?? item.content_en} onChange={val => handleContentChange(item.id, 'content_en', val)} dir="ltr" />
                                  </div>
                               </div>
                             )}
                          </div>
                        ))}
                     </div>
                     {Object.keys(pendingEdits).length > 0 && (
                       <div className={`mt-12 flex border-t border-white/10 pt-6 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                         <button onClick={saveContentChanges} disabled={loading} className="px-10 py-4 bg-primary-container text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                           {loading ? adminT.actions.saving : adminT.actions.save_changes}
                         </button>
                       </div>
                     )}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
      <AnimatePresence>{status && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-6 ${isRTL ? 'right-6 md:right-10' : 'left-6 md:left-10'} bg-primary-container text-black px-6 md:px-10 py-4 md:py-5 font-black uppercase text-xs tracking-widest shadow-2xl z-50 border-r-8 border-black flex items-center gap-3`}><span className="material-symbols-outlined">done_all</span>{status.msg}</motion.div>}</AnimatePresence>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col md:flex-row items-center gap-2 md:gap-4 px-4 md:px-8 py-4 md:py-5 transition-all border-b-2 md:border-b-4 flex-1 md:flex-none ${active ? 'border-primary-container text-white bg-white/[0.04]' : 'border-transparent text-gray-500 hover:text-white'}`}>
    <span className="material-symbols-outlined text-xl md:text-2xl">{icon}</span>
    <span className="font-black text-[10px] md:text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const Input: React.FC<{ label: string, value: any, onChange: (v: string) => void, isEn?: boolean, required?: boolean }> = ({ label, value, onChange, isEn, required }) => (
  <div className="flex flex-col gap-1.5 md:gap-2"><label className="text-[10px] md:text-[12px] text-gray-500 font-black uppercase tracking-widest">{label}</label><input className={`bg-black/50 border border-white/10 p-3 md:p-4 text-white text-sm outline-none focus:border-primary-container transition-all ${isEn ? 'font-inter' : 'font-tajawal'}`} value={value} onChange={e => onChange(e.target.value)} required={required} dir={isEn ? 'ltr' : 'rtl'} /></div>
);

const TextArea: React.FC<{ label: string, value: string, onChange: (v: string) => void, isEn?: boolean, required?: boolean }> = ({ label, value, onChange, isEn, required }) => (
  <div className="flex flex-col gap-1.5 md:gap-2"><label className="text-[10px] md:text-[12px] text-gray-500 font-black uppercase tracking-widest">{label}</label><textarea className={`bg-black/50 border border-white/10 p-3 md:p-4 text-white text-sm outline-none focus:border-primary-container transition-all ${isEn ? 'font-inter' : 'font-tajawal'} resize-none`} value={value} onChange={e => onChange(e.target.value)} required={required} rows={3} dir={isEn ? 'ltr' : 'rtl'} /></div>
);

export default Admin;
