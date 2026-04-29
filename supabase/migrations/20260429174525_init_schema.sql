-- Supabase Database Schema for PITCH_SIGHT

-- 1. Photos (Work items)
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_order INT DEFAULT 0,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_ar TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    camera TEXT,
    lens TEXT,
    aperture TEXT,
    shutter TEXT,
    iso TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Awards
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    category_en TEXT NOT NULL,
    category_ar TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Site Content (Translations and Strings)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL, -- 'home', 'work', 'awards', 'about', 'common'
    section TEXT NOT NULL, -- 'header_title', 'header_subtitle', 'meta', etc.
    content_en TEXT,
    content_ar TEXT,
    UNIQUE(page, section)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public Read Access for Photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Awards" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Site Content" ON public.site_content FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_order ON public.photos(display_order);
CREATE INDEX IF NOT EXISTS idx_awards_year ON public.awards(year DESC);
CREATE INDEX IF NOT EXISTS idx_site_content_page ON public.site_content(page);

-- SEED DATA (Current project content)

-- Photos (Work)
INSERT INTO public.photos (display_order, title_en, title_ar, category_en, category_ar, image_url, description_en, description_ar, camera, lens, aperture, shutter, iso)
VALUES 
(1, 'The Golden Touch', 'اللمسة الذهبية', 'Action', 'حركة', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000', 'Professional capture during a high-intensity match session.', 'توثيق احترافي للحظة احتكاك عالية الكثافة.', 'Sony A1 Professional', '400mm f/2.8 Prime', 'f/2.8', '1/4000s', '1600'),
(2, 'Midnight Clash', 'صدام منتصف الليل', 'Tactical', 'تكتيكي', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=2000', 'Tactical perspective from the high stands.', 'منظور تكتيكي من زاوية علوية.', 'Sony A1 Professional', '70-200mm f/2.8', 'f/2.8', '1/2000s', '3200'),
(3, 'Coliseum', 'الكولوسيوم', 'Atmosphere', 'أجواء', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=2000', 'The scale of the arena.', 'هيبة الميدان.', 'Sony A1 Professional', '16-35mm f/2.8', 'f/8.0', '1/500s', '400');

-- Awards
INSERT INTO public.awards (year, title_en, title_ar, category_en, category_ar, image_url)
VALUES 
('2024', 'INTERNATIONAL EDITORIAL EXCELLENCE', 'التميز التحريري الدولي', 'Photo Essay - The Gritty Reality of Training Camp', 'مقال مصور - الواقع القاسي لمعسكر التدريب', 'https://res.cloudinary.com/asdev1/image/upload/v1777336480/awards_1_lrgc4b.jpg'),
('2023', 'BRITISH PRESS AWARDS', 'جوائز الصحافة البريطانية', 'Sports Photographer of the Year', 'مصور الرياضة لهذا العام', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000'),
('2020', 'NATIONAL GEOGRAPHIC CAPTURE', 'ناشيونال جيوغرافيك كابتشر', 'Nature Meets Sport - Alpine Downhill', 'الطبيعة تلتقي بالرياضة - الهبوط الألبي', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=2000');

-- Site Content (Headers)
INSERT INTO public.site_content (page, section, content_en, content_ar)
VALUES 
('work', 'header_title', 'The {Decisive} Moment.', 'اللحظة {الفارقة}.'),
('work', 'header_subtitle', 'High-velocity optics capturing the raw, kinetic drama of professional football.', 'عدسات متخصصة توثق الدراما الحركية الصرفة لملاعب كرة القدم العالمية.'),
('awards', 'header_title', 'AWARDS &<br />RECOGNITION', 'الجوائز والتقدير'),
('home', 'hero_title', 'Cinematic Sports Photography', 'تصوير رياضي سينمائي');
