# HydPropertyHub

HydPropertyHub is a premium Hyderabad real estate platform built with Next.js 15, TypeScript, Tailwind CSS, Shadcn-inspired UI, Supabase auth and database integration, and Cloudinary-ready image handling.

## Project structure

- `app/` - Next.js App Router pages and API routes
- `components/` - reusable UI and page-specific components
- `lib/` - utilities, SEO helpers, Supabase client and sample datasets
- `services/` - data access layer with Supabase fallback support
- `types/` - shared TypeScript models
- `public/` - static assets and robots.txt

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment example:

```bash
cp .env.example .env.local
```

3. Set your Supabase and Cloudinary credentials in `.env.local`.

4. Run the development server:

```bash
npm run dev
```

5. Open http://localhost:3000

## Features included

- Homepage with premium hero search, featured listings, localities, testimonials, and CTA
- Property listings page with filter sidebar, sort, and card preview
- Property details page with image gallery, video walkthrough, agent contact, and inquiry form
- Agent dashboard with listing analytics and lead summary
- Admin dashboard with approval workflow and agent management overview
- Supabase API endpoints for inquiries and favorites
- Dynamic metadata, sitemap, robots.txt, and SEO-friendly routes
- Mobile-first responsive UI with premium design cues

## Deployment

Deploy to Vercel with the following environment variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

Vercel automatically detects the Next.js app and builds using `npm run build`.

## Supabase schema

Recommended tables:

- `agents`
- `properties`
- `property_images`
- `property_videos`
- `inquiries`
- `favorites`

Use the supplied type definitions in `types/index.ts` as a schema reference.
