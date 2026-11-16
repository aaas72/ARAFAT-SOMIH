# Arafat Somih — Sports Photography Portfolio

A bilingual (Arabic / English) portfolio website built for a professional football photographer. Visitors browse a cinematic gallery of match photography, awards and the photographer's story, while the owner manages all content from a private dashboard — no code changes needed.

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)

## Features

- **Work gallery** — curated photo archive with a dedicated detail page for each shot
- **Awards** — record of competitions and recognitions
- **About** — the photographer's story and background
- **Bilingual** — instant Arabic / English switching with full RTL support
- **Admin dashboard** — secure login to add, edit and remove works, awards, About content and general site text
- **Motion design** — smooth page and gallery transitions with Framer Motion
- **SEO** — per-page meta tags for sharing and search engines

## Architecture

```text
src/
├── pages/              # Home, Work, PhotoDetail, Awards, About, Admin
├── components/         # Navbar, Footer, SEO, SectionHeader, Loading
├── context/            # LanguageContext (AR / EN, direction)
├── data/ar · data/en   # Static UI copy per language
└── lib/supabase.ts     # Supabase client
supabase/migrations/    # Tables (photos, awards, site_content) and access policies
```

Content is stored in Supabase with public read access and is edited through the authenticated admin dashboard.

## Getting Started

**Requirements:** Node.js 20+, a Supabase project

```bash
npm install
```

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Apply the migration in `supabase/migrations/`, then:

```bash
npm run dev       # development server
npm run deploy    # build and publish to GitHub Pages
```

## Author

Designed and developed by **Abdellah Sheikh** — [abdellahsheikh.dev](https://abdellahsheikh.dev) · [LinkedIn](https://www.linkedin.com/in/abdellahsheikh)
