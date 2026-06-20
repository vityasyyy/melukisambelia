# Melukis Sambelia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Melukis Sambelia KKN-PPM UGM team profile + data website — a static Next.js site with 9 content sections, a dual-map peta, and Decap CMS for non-technical editing.

**Architecture:** Next.js 14 App Router (static export) + shadcn/ui + Tailwind. Content lives as Markdown/MDX in `content/`, validated by zod schemas at build. `react-leaflet` powers the interactive map; marker data is aggregated from content collections. Decap CMS at `/admin` edits the same content via GitHub. Fonts (Gontserrat, Beautique Display) loaded locally via `next/font/local`.

**Tech Stack:** Next.js 14, TypeScript strict, Tailwind CSS v3, shadcn/ui (Radix), react-leaflet, leaflet, Decap CMS, MDX (@next/mdx), zod, vitest, Playwright, Vercel Analytics.

## Local-First Execution Principle

This plan runs **locally end-to-end before any deploy**. All tasks up to and including Phase 7 must build and run on the developer's machine with `npm run dev` and `npm run build`. The following rules apply:

1. **No deploy steps until local verification passes.** Phase 8 (Deployment) is gated behind a successful local `npm run build` + `npm run test:e2e` against the static `out/` output.
2. **Stub external integrations locally.** Specifically:
   - **Decap CMS OAuth** — Phase 6 configures Decap to use the `github` backend, but the OAuth proxy is a **stub** locally: Decap's `local_backend: true` flag is set so editors can run `npx decap-server` alongside `npm run dev` and edit content at `/admin` against the local filesystem with no GitHub auth. The real GitHub OAuth proxy (Task 25) is wired but not exercised until deploy.
   - **Vercel Analytics** — wrapped so it no-ops locally (analytics only fires on Vercel deploy; the component is harmless in dev but we verify it doesn't break the build).
   - **GIS files** — the `public/gis/` folder ships empty; the GisMap component's empty-state is the verified local behavior. Real GIS exports are dropped in later by the team.
3. **Seed/stub content everywhere.** Every content collection has at least one placeholder entry (Task 7) so pages render with real structure and fake data locally. The team replaces stubs via Decap later.
4. **Local verification gate before Phase 8:** Task 29 runs `npm run lint && npm run typecheck && npm test && npm run build` and serves `out/` locally. Only after that passes do we proceed to Task 30 (deploy).
5. **Decap `local_backend`** — add `local_backend: true` to `public/admin/config.yml` (Task 24) so `npx decap-server` works locally. This flag is ignored in production (Decap falls back to the configured GitHub backend).

---

## File Structure

### App routes (`app/`)
- `app/layout.tsx` — root layout: fonts, palette CSS vars, Nav, Footer, Analytics.
- `app/page.tsx` — Beranda.
- `app/profil-tim/page.tsx`
- `app/peta/page.tsx` — dual map (client component wrapper).
- `app/pariwisata/page.tsx` — index.
- `app/pariwisata/[slug]/page.tsx` — detail.
- `app/irigasi/page.tsx`
- `app/kesehatan/page.tsx`
- `app/festival/page.tsx`
- `app/kegiatan/page.tsx`
- `app/cerita/page.tsx`
- `app/cerita/[slug]/page.tsx`
- `app/umkm/page.tsx`
- `app/mitra/page.tsx`
- `app/admin/**` — Decap CMS static files.
- `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx` — metadata.
- `app/not-found.tsx` — custom 404.
- `app/globals.css` — Tailwind + palette CSS vars.

### Content layer (`content/` + `lib/`)
- `lib/schemas.ts` — zod schemas for every collection.
- `lib/content.ts` — loaders: read `.md(x)` from a collection dir, parse frontmatter with gray-matter, validate with zod, return typed arrays. MDX body kept raw for compile.
- `lib/map.ts` — `getMapMarkers()`: aggregates lat/lng-bearing items from pariwisata, irigasi, kesehatan, umkm into a typed `MapMarker[]` with `layer` discriminator.
- `lib/settings.ts` — loads `content/_settings.md` singleton, returns typed site config.
- `content/_settings.md`, `content/_gismap.md` — singletons.
- `content/tim/*.md`, `content/pariwisata/*.md(x)`, `content/irigasi/*.md`, `content/kesehatan/*.md`, `content/festival/*.md`, `content/kegiatan/*.md`, `content/cerita/*.md(x)`, `content/umkm/*.md`, `content/mitra/*.md`.

### Components (`components/`)
- `components/ui/*` — shadcn primitives (added via CLI, committed).
- `components/Nav.tsx`, `components/Footer.tsx`, `components/Logo.tsx`
- `components/StatCard.tsx`, `components/DataCard.tsx`, `components/StatusBadge.tsx`, `components/SectionHeader.tsx`, `components/GalleryStrip.tsx`, `components/MotifDivider.tsx`, `components/EmptyState.tsx`
- `components/MapPanel.tsx` — client; shadcn Tabs → InteractiveMap | GisMap.
- `components/InteractiveMap.tsx` — client; react-leaflet, layer toggles, markers.
- `components/GisMap.tsx` — client; auto-detect GeoJSON + image/PDF in `public/gis/`.
- `components/MiniMap.tsx` — client; single-marker Leaflet for detail pages.
- `components/MemberCard.tsx`, `components/FestivalTimeline.tsx`, `components/KegiatanRoadmap.tsx`, `components/MitraGrid.tsx`, `components/UmkmCard.tsx`

### Decap (`public/admin/`)
- `public/admin/index.html` — Decap CMS host.
- `public/admin/config.yml` — collections mirror the content model.

### Config
- `next.config.mjs` — `output: 'export'`, MDX, images `unoptimized`.
- `tailwind.config.ts`, `postcss.config.mjs`
- `components.json` — shadcn config.
- `tsconfig.json`, `package.json`, `.eslintrc.json`
- `vercel.json` — Decap OAuth proxy rewrites (or `app/api/auth/` serverless — see Task).

### Tests
- `tests/content.test.ts`, `tests/map.test.ts`, `tests/schemas.test.ts`
- `tests/e2e/smoke.spec.ts` — Playwright.

### Assets
- `public/images/` — content images + placeholders.
- `public/gis/` — GIS team data slot.
- `public/fonts/` — symlinked or copied from `assets/typefaces/` (next/font/local points here).

---

# Phase 1: Project Scaffold & Design System

## Task 1: Initialize Next.js project with TypeScript + Tailwind

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.eslintrc.json`, `.gitignore` (update)

- [ ] **Step 1: Scaffold Next.js**

Run:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```
Answer prompts to use the current directory. If it warns about existing files, allow it.

- [ ] **Step 2: Configure static export + MDX in `next.config.mjs`**

Replace `next.config.mjs` with:
```js
import createMDX from './mdx-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
}

const withMDX = createMDX(nextConfig)
export default withMDX
```

Create `mdx-config.mjs`:
```js
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('@next/mdx').MDXOptions} */
export default function createMDX(nextConfig) {
  return (nextConfig) => ({
    ...nextConfig,
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    mdx: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
    },
  })
}
```

- [ ] **Step 3: Install MDX + content deps**

Run:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx gray-matter zod remark-gfm rehype-slug rehype-autolink-headings
```

- [ ] **Step 4: Update `.gitignore` to keep `assets/` and `design/` tracked but ignore build output**

Ensure `.gitignore` contains (append, don't overwrite):
```
.next/
out/
.env*.local
```

- [ ] **Step 5: Verify dev server boots**

Run: `npm run dev`
Expected: server starts on http://localhost:3000, default page renders. Stop it with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 with TypeScript, Tailwind, MDX, static export"
```

## Task 2: Wire local fonts (Gontserrat + Beautique Display)

**Files:**
- Create: `public/fonts/gontserrat/`, `public/fonts/beautique-display/` (copies of the needed weights)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Copy font files into `public/fonts/`**

Run:
```bash
mkdir -p public/fonts/gontserrat public/fonts/beautique-display
cp assets/typefaces/gontserrat/Gontserrat-{Thin,Light,Regular,Medium,SemiBold,Bold,ExtraBold,Black}.ttf public/fonts/gontserrat/
cp assets/typefaces/gontserrat/Gontserrat-{Thin,Light,Regular,Medium,SemiBold,Bold,ExtraBold,Black}Italic.ttf public/fonts/gontserrat/
cp assets/typefaces/beautique-display/BeautiqueDisplay-{Light,Regular,Medium,Bold,Black}.otf public/fonts/beautique-display/
cp assets/typefaces/beautique-display/BeautiqueDisplay-{Light,Regular,Medium,Bold,Black}Italic.otf public/fonts/beautique-display/
cp assets/typefaces/beautique-display/BeautiqueDisplayCondensed-{Light,Regular,Medium,Bold,Black}.otf public/fonts/beautique-display/
```

- [ ] **Step 2: Configure `next/font/local` in `app/layout.tsx`**

Replace the contents of `app/layout.tsx` with:
```tsx
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const gontserrat = localFont({
  src: [
    { path: '../public/fonts/gontserrat/Gontserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Black.ttf', weight: '900', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Thin.ttf', weight: '100', style: 'normal' },
  ],
  variable: '--font-gontserrat',
  display: 'swap',
})

const beautique = localFont({
  src: [
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Regular.otf', weight: '400', style: 'italic' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Black.otf', weight: '900', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-beautique',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Melukis Sambelia — KKN-PPM UGM',
  description: 'Pemberdayaan pariwisata berkelanjutan dan pengembangan kawasan agropolitan di Kecamatan Sambelia, Kabupaten Lombok Timur, NTB.',
  metadataBase: new URL('https://melukis-sambelia.vercel.app'),
}

export const viewport: Viewport = {
  themeColor: '#0873B9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${gontserrat.variable} ${beautique.variable}`}>
      <body className="font-gontserrat bg-[#FFFCF7] text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify fonts load**

Run: `npm run dev`, open http://localhost:3000, inspect `<body>` computed styles → `font-family` resolves to Gontserrat. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire Gontserrat + Beautique Display fonts via next/font/local"
```

## Task 3: Define palette as CSS variables + Tailwind tokens

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Set CSS variables in `app/globals.css`**

Replace `app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Water / coast / interactive — blue */
    --water-50: #B3E7FB;
    --water-500: #14A8E1;
    --water-900: #0873B9;

    /* Agriculture / health / nature — green */
    --green-50: #DEF6AE;
    --green-500: #99BA57;
    --green-900: #667F37;

    /* Sand / festival — gold */
    --gold-100: #FFDFC0;
    --gold-50: #FFE09A;
    --gold-500: #F0AC6D;
    --tan-700: #AF7E4F;

    /* Culture / Sasak — terracotta */
    --terracotta-500: #E3795C;
    --brown-900: #742D1B;

    /* Neutrals */
    --white: #FFFFFF;
    --ink: #000000;
    --page-bg: #FFFCF7;
    --status-aktif: #99BA57;
    --status-berkembang: #F0AC6D;
    --status-persiapan: #6B7280;
  }
}

@layer base {
  body {
    background-color: var(--page-bg);
    color: var(--ink);
    font-family: var(--font-gontserrat), ui-sans-serif, system-ui, sans-serif;
  }
  .font-display {
    font-family: var(--font-beautique), var(--font-gontserrat), serif;
  }
}
```

- [ ] **Step 2: Map variables into `tailwind.config.ts`**

Replace `tailwind.config.ts` with:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        water: { 50: 'var(--water-50)', 500: 'var(--water-500)', 900: 'var(--water-900)' },
        green: { 50: 'var(--green-50)', 500: 'var(--green-500)', 900: 'var(--green-900)' },
        gold: { 50: 'var(--gold-50)', 100: 'var(--gold-100)', 500: 'var(--gold-500)' },
        tan: { 700: 'var(--tan-700)' },
        terracotta: { 500: 'var(--terracotta-500)' },
        brown: { 900: 'var(--brown-900)' },
        ink: 'var(--ink)',
        page: 'var(--page-bg)',
        status: {
          aktif: 'var(--status-aktif)',
          berkembang: 'var(--status-berkembang)',
          persiapan: 'var(--status-persiapan)',
        },
      },
      fontFamily: {
        gontserrat: ['var(--font-gontserrat)', 'sans-serif'],
        beautique: ['var(--font-beautique)', 'serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Verify Tailwind picks up tokens**

In `app/page.tsx` temporarily add:
```tsx
<div className="bg-water-900 text-page p-8 font-beautique text-3xl">Palette test</div>
```
Run `npm run dev`, open the page → blue background with cream text in Beautique. Remove the test line. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: define Sasak palette as CSS variables + Tailwind tokens"
```

## Task 4: Initialize shadcn/ui

**Files:**
- Create: `components.json`, `lib/utils.ts`, `components/ui/*` (added by CLI)

- [ ] **Step 1: Run shadcn init**

Run:
```bash
npx shadcn@latest init -d
```
Use defaults: style "new-york", base color "neutral", CSS variables yes, paths `components/ui`, `lib/utils`, alias `@/components`, `@/lib`. If it asks about overwriting `globals.css`, say no (we already set it up) — then manually merge any shadcn-required variables it lists.

- [ ] **Step 2: Add the primitives we need**

Run:
```bash
npx shadcn@latest add button card tabs accordion dialog sheet tooltip badge sonner select checkbox separator
```

- [ ] **Step 3: Verify a component renders**

In `app/page.tsx` temporarily:
```tsx
import { Button } from '@/components/ui/button'
<Button variant="default">Test</Button>
```
Run `npm run dev`, confirm button renders. Remove the test. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize shadcn/ui + core primitives"
```

## Task 5: Set up vitest + Playwright

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Install vitest**

Run:
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react jsdom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Create `tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```
(If `@testing-library/jest-dom` isn't installed: `npm install -D @testing-library/jest-dom`.)

- [ ] **Step 3: Add Playwright**

Run:
```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 4: Add test scripts to `package.json`**

Add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"lint": "next lint",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 5: Smoke-test vitest works**

Create `tests/sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
describe('sanity', () => {
  it('runs', () => { expect(1 + 1).toBe(2) })
})
```
Run: `npm test`
Expected: 1 passed. Delete `tests/sanity.test.ts` after.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: set up vitest + Playwright"
```

---

# Phase 2: Content Layer

## Task 6: Write zod schemas for all collections

**Files:**
- Create: `lib/schemas.ts`, `tests/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/schemas.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import {
  timSchema, pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, ceritaSchema, umkmSchema, mitraSchema,
  settingsSchema, gisMapSchema,
} from '@/lib/schemas'

describe('schemas validate good data', () => {
  it('tim', () => {
    const r = timSchema.safeParse({
      name: 'Siti', role: 'Ketua Pelaksana', division: 'Koor',
      photo: '/images/tim/siti.jpg', bio: 'Lulusan Sosiologi UGM.',
      instagram: 'sitiii', order: 1,
    })
    expect(r.success).toBe(true)
  })
  it('pariwisata with lat/lng', () => {
    const r = pariwisataSchema.safeParse({
      title: 'Pantai Berandangan', category: 'Pantai', village: 'Sugian',
      cover: '/images/pariwisata/berandangan.jpg', gallery: [],
      shortDesc: 'Pantai pasir putih.', body: 'MDX here', lat: -8.36, lng: 116.85,
      facilities: ['Toilet', 'Parkir'], accessNotes: '30 menit dari Sembalun',
    })
    expect(r.success).toBe(true)
  })
  it('irigasi', () => {
    const r = irigasiSchema.safeParse({
      name: 'Saluran Sugian', saluranType: 'Primer', village: 'Sugian',
      condition: 'Baik', lengthM: 1200, flowStatus: 'Mengalir',
      cover: '/images/irigasi/sugian.jpg', body: 'Detail saluran.', lat: -8.35, lng: 116.84,
    })
    expect(r.success).toBe(true)
  })
  it('kegiatan with milestones', () => {
    const r = kegiatanSchema.safeParse({
      title: 'Ekowisata Mangrove', status: 'Aktif', category: 'Ekowisata',
      cover: '/images/kegiatan/mangrove.jpg', summary: 'Konservasi mangrove.',
      body: 'Detail.', milestones: [{ date: '2026-07-01', label: 'Survei awal', done: true }],
    })
    expect(r.success).toBe(true)
  })
  it('settings', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Melukis Sambelia',
      stats: { luas: '1.742 km²', penduduk: '~150k', desaBinaan: '2', tahunProgram: '2026' },
      festivalDates: 'Juli - Agustus 2026',
      socials: { instagram: 'melukis.sambelia', tiktok: 'melukis.sambelia' },
      contact: { email: 'melukis.sambelia@ugm.ac.id', phone: '+62 812 0000 0000', address: 'Sambelia, Lombok Timur, NTB' },
    })
    expect(r.success).toBe(true)
  })
})

describe('schemas reject bad data', () => {
  it('tim rejects bad division', () => {
    const r = timSchema.safeParse({ name: 'x', role: 'x', division: 'TidakAda', photo: '', bio: '', instagram: '', order: 1 })
    expect(r.success).toBe(false)
  })
  it('pariwisata rejects out-of-range lat', () => {
    const r = pariwisataSchema.safeParse({
      title: 'x', category: 'Pantai', village: 'Sugian', cover: '', gallery: [],
      shortDesc: '', body: '', lat: 95, lng: 0, facilities: [], accessNotes: '',
    })
    expect(r.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test — expect fail (module missing)**

Run: `npm test`
Expected: FAIL, `Cannot find module '@/lib/schemas'`.

- [ ] **Step 3: Implement `lib/schemas.ts`**

```ts
import { z } from 'zod'

export const timSchema = z.object({
  name: z.string(),
  role: z.string(),
  division: z.enum(['Koor', 'Pariwisata', 'Irigasi', 'Kesehatan', 'Publikasi', 'Media', 'Dana', 'Logistik']),
  photo: z.string(),
  bio: z.string(),
  instagram: z.string().optional().default(''),
  order: z.number().int(),
})

export const pariwisataSchema = z.object({
  title: z.string(),
  category: z.enum(['Pantai', 'Budaya', 'Desa Wisata', 'Air', 'Trekking']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  shortDesc: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  facilities: z.array(z.string()).default([]),
  accessNotes: z.string().default(''),
})

export const irigasiSchema = z.object({
  name: z.string(),
  saluranType: z.enum(['Primer', 'Sekunder', 'Tersier']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  condition: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat']),
  lengthM: z.number().nonnegative(),
  flowStatus: z.enum(['Mengalir', 'Kering', 'Mengalir Sebagian']),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const kesehatanSchema = z.object({
  facilityName: z.string(),
  type: z.enum(['Posyandu', 'Puskesmas', 'Bidan', 'Polides']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cadresCount: z.number().int().nonnegative().default(0),
  stuntingProgram: z.boolean().default(false),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const festivalSchema = z.object({
  eventName: z.string(),
  schedule: z.string(),
  venue: z.string(),
  description: z.string(),
  cover: z.string(),
  registrationUrl: z.string().url().optional(),
  body: z.string().default(''),
})

export const milestoneSchema = z.object({
  date: z.string(),
  label: z.string(),
  done: z.boolean().default(false),
})

export const kegiatanSchema = z.object({
  title: z.string(),
  status: z.enum(['Aktif', 'Berkembang', 'Persiapan']),
  category: z.enum(['Ekowisata', 'Irigasi', 'Kesehatan', 'Pariwisata', 'Ekonomi']),
  cover: z.string(),
  summary: z.string(),
  body: z.string(),
  milestones: z.array(milestoneSchema).default([]),
})

export const ceritaSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  cover: z.string(),
  excerpt: z.string(),
  body: z.string(),
})

export const umkmSchema = z.object({
  name: z.string(),
  owner: z.string(),
  product: z.enum(['Kerajinan', 'Kuliner', 'Pertanian', 'Anyaman', 'lainnya']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  contact: z.string(),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  body: z.string(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
})

export const mitraSchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string().url(),
  tier: z.enum(['Utama', 'Pendukung', 'Media']),
  order: z.number().int(),
})

export const settingsSchema = z.object({
  heroImage: z.string(),
  heroTagline: z.string(),
  stats: z.object({
    luas: z.string(),
    penduduk: z.string(),
    desaBinaan: z.string(),
    tahunProgram: z.string(),
  }),
  festivalDates: z.string(),
  socials: z.object({
    instagram: z.string().optional().default(''),
    tiktok: z.string().optional().default(''),
  }),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
})

export const gisMapSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
})

export type Tim = z.infer<typeof timSchema>
export type Pariwisata = z.infer<typeof pariwisataSchema>
export type Irigasi = z.infer<typeof irigasiSchema>
export type Kesehatan = z.infer<typeof kesehatanSchema>
export type Festival = z.infer<typeof festivalSchema>
export type Kegiatan = z.infer<typeof kegiatanSchema>
export type Cerita = z.infer<typeof ceritaSchema>
export type Umkm = z.infer<typeof umkmSchema>
export type Mitra = z.infer<typeof mitraSchema>
export type Settings = z.infer<typeof settingsSchema>
export type GisMap = z.infer<typeof gisMapSchema>
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add zod schemas for all content collections"
```

## Task 7: Content loaders + settings

**Files:**
- Create: `lib/content.ts`, `lib/settings.ts`, `tests/content.test.ts`
- Create: `content/_settings.md`, `content/_gismap.md`
- Create: seed content: one file per collection (placeholder)

- [ ] **Step 1: Write failing test**

`tests/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { getCollection, getEntry } from '@/lib/content'

describe('content loaders', () => {
  it('reads tim collection', () => {
    const items = getCollection('tim')
    expect(items.length).toBeGreaterThan(0)
    expect(items[0].name).toBeTruthy()
  })
  it('reads pariwisata and finds by slug', () => {
    const items = getCollection('pariwisata')
    expect(items.length).toBeGreaterThan(0)
    const first = items[0] as any
    const found = getEntry('pariwisata', first.slug)
    expect(found).toBeTruthy()
  })
  it('returns empty array for unknown collection', () => {
    expect(getCollection('doesnotexist')).toEqual([])
  })
})
```

- [ ] **Step 2: Run — expect fail**

Run: `npm test`
Expected: FAIL, module missing.

- [ ] **Step 3: Implement `lib/content.ts`**

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  timSchema, pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, ceritaSchema, umkmSchema, mitraSchema,
  type Tim, type Pariwisata, type Irigasi, type Kesehatan,
  type Festival, type Kegiatan, type Cerita, type Umkm, type Mitra,
} from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

type SchemaMap = {
  tim: { schema: typeof timSchema; ext: string }
  pariwisata: { schema: typeof pariwisataSchema; ext: string }
  irigasi: { schema: typeof irigasiSchema; ext: string }
  kesehatan: { schema: typeof kesehatanSchema; ext: string }
  festival: { schema: typeof festivalSchema; ext: string }
  kegiatan: { schema: typeof kegiatanSchema; ext: string }
  cerita: { schema: typeof ceritaSchema; ext: string }
  umkm: { schema: typeof umkmSchema; ext: string }
  mitra: { schema: typeof mitraSchema; ext: string }
}

const SCHEMAS: SchemaMap = {
  tim: { schema: timSchema, ext: 'md' },
  pariwisata: { schema: pariwisataSchema, ext: 'mdx' },
  irigasi: { schema: irigasiSchema, ext: 'md' },
  kesehatan: { schema: kesehatanSchema, ext: 'md' },
  festival: { schema: festivalSchema, ext: 'md' },
  kegiatan: { schema: kegiatanSchema, ext: 'md' },
  cerita: { schema: ceritaSchema, ext: 'mdx' },
  umkm: { schema: umkmSchema, ext: 'md' },
  mitra: { schema: mitraSchema, ext: 'md' },
}

export type CollectionName = keyof SchemaMap
export type CollectionItem<C extends CollectionName> =
  C extends 'tim' ? Tim & { slug: string } :
  C extends 'pariwisata' ? Pariwisata & { slug: string } :
  C extends 'irigasi' ? Irigasi & { slug: string } :
  C extends 'kesehatan' ? Kesehatan & { slug: string } :
  C extends 'festival' ? Festival & { slug: string } :
  C extends 'kegiatan' ? Kegiatan & { slug: string } :
  C extends 'cerita' ? Cerita & { slug: string } :
  C extends 'umkm' ? Umkm & { slug: string } :
  C extends 'mitra' ? Mitra & { slug: string } :
  never

export function getCollection<C extends CollectionName>(name: C): CollectionItem<C>[] {
  const dir = path.join(CONTENT_DIR, name)
  if (!fs.existsSync(dir)) return []
  const { schema, ext } = SCHEMAS[name]
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(`.${ext}`))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const parsed = schema.safeParse({ ...data, body: content })
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in ${name}/${file}:\n${parsed.error.toString()}`)
      }
      const slug = file.replace(/\.(md|mdx)$/, '')
      return { ...parsed.data, slug } as CollectionItem<C>
    })
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
}

export function getEntry<C extends CollectionName>(name: C, slug: string): CollectionItem<C> | null {
  const items = getCollection(name)
  return items.find((i) => i.slug === slug) ?? null
}
```

- [ ] **Step 4: Create seed content**

`content/_settings.md`:
```markdown
---
heroImage: /images/hero-placeholder.jpg
heroTagline: Pemberdayaan pariwisata berkelanjutan & agropolitan Sambelia
stats:
  luas: "—"
  penduduk: "—"
  desaBinaan: "2"
  tahunProgram: "2026"
festivalDates: TBD
socials:
  instagram: melukis.sambelia
  tiktok: melukis.sambelia
contact:
  email: melukis.sambelia@ugm.ac.id
  phone: ""
  address: "Kecamatan Sambelia, Kabupaten Lombok Timur, NTB"
---
```

`content/_gismap.md`:
```markdown
---
title: Peta GIS Tim Melukis Sambelia
description: Peta tematik hasil kerja GIS tim Melukis Sambelia.
credit: Tim GIS Melukis Sambelia
---
```

`content/tim/koordinator.md`:
```markdown
---
name: Koordinator Tim
role: Ketua Pelaksana
division: Koor
photo: /images/placeholders/person.svg
bio: Koordinator KKN-PPM UGM Melukis Sambelia.
instagram: ""
order: 1
---
```

`content/pariwisata/pantai-berandangan.mdx`:
```markdown
---
title: Pantai Berandangan
category: Pantai
village: Sugian
cover: /images/placeholders/beach.svg
gallery: []
shortDesc: Pantai pasir putih di Desa Sugian.
lat: -8.36
lng: 116.85
facilities: []
accessNotes: ""
---
Detail destinasi akan diisi tim.
```

`content/irigasi/saluran-sugian.md`:
```markdown
---
name: Saluran Irigasi Sugian
saluranType: Primer
village: Sugian
condition: Baik
lengthM: 0
flowStatus: Mengalir
cover: /images/placeholders/irrigation.svg
body: Data saluran akan diisi tim.
lat: -8.35
lng: 116.84
---
```

`content/kesehatan/posyandu-sugian.md`:
```markdown
---
facilityName: Posyandu Sugian
type: Posyandu
village: Sugian
cadresCount: 0
stuntingProgram: true
cover: /images/placeholders/health.svg
body: Data fasilitas kesehatan akan diisi tim.
lat: -8.355
lng: 116.845
---
```

`content/festival/peresean.md`:
```markdown
---
eventName: Peresean
schedule: TBD
venue: Sambelia
description: Pertunjukan tradisional adu kekuatan Sasak.
cover: /images/placeholders/festival.svg
body: Detail pertunjukan akan diisi tim.
---
```

`content/kegiatan/ekowisata-mangrove.md`:
```markdown
---
title: Ekowisata Mangrove
status: Persiapan
category: Ekowisata
cover: /images/placeholders/program.svg
summary: Pengembangan wisata berbasis konservasi mangrove.
body: Detail program akan diisi tim.
milestones: []
---
```

`content/cerita/catatan-lapangan-1.mdx`:
```markdown
---
title: Catatan Lapangan #1
author: Koordinator Tim
date: 2026-06-20
cover: /images/placeholders/story.svg
excerpt: Catatan awal tim Melukis Sambelia.
---
Cerita akan diisi tim.
```

`content/umkm/contoh-umkm.md`:
```markdown
---
name: UMKM Contoh
owner: —
product: Kerajinan
village: Sugian
contact: ""
cover: /images/placeholders/umkm.svg
gallery: []
body: Data UMKM akan diisi tim.
---
```

`content/mitra/ugm.md`:
```markdown
---
name: Universitas Gadjah Mada
logo: /images/placeholders/mitra.svg
url: https://ugm.ac.id
tier: Utama
order: 1
---
```

Create placeholder SVGs by copying the motif:
```bash
mkdir -p public/images/placeholders public/gis
cp assets/design-system/bunga_sambel.svg public/images/placeholders/person.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/beach.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/irrigation.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/health.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/festival.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/program.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/story.svg
cp assets/design-system/bunga_sambel.svg public/images/placeholders/umkm.svg
cp assets/design-system/bw_logo_sambel.svg public/images/placeholders/mitra.svg
cp assets/design-system/color_logo_sambel.svg public/images/hero-placeholder.svg
```

- [ ] **Step 5: Implement `lib/settings.ts`**

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { settingsSchema, gisMapSchema, type Settings, type GisMap } from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getSettings(): Settings {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, '_settings.md'), 'utf8')
  const { data } = matter(raw)
  return settingsSchema.parse(data)
}

export function getGisMap(): GisMap {
  const file = path.join(CONTENT_DIR, '_gismap.md')
  if (!fs.existsSync(file)) return { title: 'Peta GIS Tim', description: '', credit: '' }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return gisMapSchema.parse(data)
}
```

- [ ] **Step 6: Run tests — expect pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: content loaders, settings, seed content"
```

## Task 8: Map marker aggregator

**Files:**
- Create: `lib/map.ts`, `tests/map.test.ts`

- [ ] **Step 1: Write failing test**

`tests/map.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { getMapMarkers } from '@/lib/map'

describe('getMapMarkers', () => {
  it('aggregates markers from content collections', () => {
    const markers = getMapMarkers()
    expect(markers.length).toBeGreaterThan(0)
    const layers = new Set(markers.map((m) => m.layer))
    expect(layers.has('pariwisata')).toBe(true)
  })
  it('each marker has lat/lng/slug/title/layer', () => {
    const markers = getMapMarkers()
    for (const m of markers) {
      expect(typeof m.lat).toBe('number')
      expect(typeof m.lng).toBe('number')
      expect(typeof m.slug).toBe('string')
      expect(typeof m.title).toBe('string')
      expect(['pariwisata', 'irigasi', 'kesehatan', 'umkm']).toContain(m.layer)
    }
  })
})
```

- [ ] **Step 2: Run — expect fail**

Run: `npm test`
Expected: FAIL, module missing.

- [ ] **Step 3: Implement `lib/map.ts`**

```ts
import { getCollection } from '@/lib/content'

export type MapLayer = 'pariwisata' | 'irigasi' | 'kesehatan' | 'umkm'

export type MapMarker = {
  layer: MapLayer
  slug: string
  title: string
  lat: number
  lng: number
  href: string
}

export function getMapMarkers(): MapMarker[] {
  const markers: MapMarker[] = []

  const pariwisata = getCollection('pariwisata')
  for (const p of pariwisata) {
    markers.push({ layer: 'pariwisata', slug: p.slug, title: p.title, lat: p.lat, lng: p.lng, href: `/pariwisata/${p.slug}` })
  }

  const irigasi = getCollection('irigasi')
  for (const i of irigasi) {
    markers.push({ layer: 'irigasi', slug: i.slug, title: i.name, lat: i.lat, lng: i.lng, href: `/irigasi` })
  }

  const kesehatan = getCollection('kesehatan')
  for (const k of kesehatan) {
    markers.push({ layer: 'kesehatan', slug: k.slug, title: k.facilityName, lat: k.lat, lng: k.lng, href: `/kesehatan` })
  }

  const umkm = getCollection('umkm')
  for (const u of umkm) {
    if (u.lat !== undefined && u.lng !== undefined) {
      markers.push({ layer: 'umkm', slug: u.slug, title: u.name, lat: u.lat, lng: u.lng, href: `/umkm` })
    }
  }

  return markers
}

export const LAYER_COLORS: Record<MapLayer, string> = {
  pariwisata: '#14A8E1',
  irigasi: '#99BA57',
  kesehatan: '#667F37',
  umkm: '#F0AC6D',
}
```

- [ ] **Step 4: Run — expect pass**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: map marker aggregator from content collections"
```

---

# Phase 3: Shared UI Components

## Task 9: Logo + Nav + Footer

**Files:**
- Create: `components/Logo.tsx`, `components/Nav.tsx`, `components/Footer.tsx`
- Modify: `app/layout.tsx` (mount Nav/Footer)

- [ ] **Step 1: Create `components/Logo.tsx`**

```tsx
import Image from 'next/image'

export function Logo({ variant = 'color', className }: { variant?: 'color' | 'bw'; className?: string }) {
  const src = variant === 'bw' ? '/images/design-system/bw_logo_sambel.svg' : '/images/design-system/color_logo_sambel.svg'
  return (
    <Image
      src={src}
      alt="Melukis Sambelia"
      width={160}
      height={48}
      className={className}
      priority
    />
  )
}
```

Copy design-system SVGs into public:
```bash
mkdir -p public/images/design-system
cp assets/design-system/*.svg public/images/design-system/
```

- [ ] **Step 2: Create `components/Nav.tsx`**

```tsx
import Link from 'next/link'
import { Logo } from './Logo'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/profil-tim', label: 'Profil Tim' },
  { href: '/peta', label: 'Peta' },
  { href: '/pariwisata', label: 'Pariwisata' },
  { href: '/irigasi', label: 'Irigasi' },
  { href: '/kesehatan', label: 'Kesehatan' },
  { href: '/festival', label: 'Festival' },
  { href: '/cerita', label: 'Cerita' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur border-b border-tan-700/20">
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/"><Logo className="h-10 w-auto" /></Link>
        <ul className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-ink hover:text-water-900 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Create `components/Footer.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'

export function Footer() {
  const s = getSettings()
  return (
    <footer className="bg-brown-900 text-page mt-20">
      <div className="mx-auto max-w-content px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Image src="/images/design-system/bw_logo_sambel.svg" alt="Melukis Sambelia" width={180} height={54} />
          <p className="mt-3 text-sm text-page/70">KKN-PPM UGM Melukis Sambelia 2026</p>
          <p className="text-sm text-page/60">{s.contact.address}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Navigasi</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/profil-tim">Profil Tim</Link></li>
            <li><Link href="/peta">Peta</Link></li>
            <li><Link href="/pariwisata">Pariwisata</Link></li>
            <li><Link href="/cerita">Cerita</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Sosial</h3>
          {s.socials.instagram && <p><a href={`https://instagram.com/${s.socials.instagram}`} className="text-sm hover:underline">@{s.socials.instagram}</a></p>}
          {s.socials.tiktok && <p><a href={`https://tiktok.com/@${s.socials.tiktok}`} className="text-sm hover:underline">@{s.socials.tiktok}</a></p>}
          <p className="text-sm text-page/60 mt-2">{s.contact.email}</p>
          <div className="mt-4 flex gap-2">
            <Image src="/images/design-system/logo_kkn_ugm.svg" alt="KKN-PPM UGM" width={48} height={48} />
            <Image src="/images/design-system/logo_ugm_text.svg" alt="UGM" width={120} height={48} />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-page/50 py-4">© 2026 KKN-PPM UGM Melukis Sambelia</div>
    </footer>
  )
}
```

- [ ] **Step 4: Mount in `app/layout.tsx`**

Update the `<body>` in `app/layout.tsx`:
```tsx
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

// ... inside <body>:
<body className="font-gontserrat bg-page text-ink antialiased min-h-screen flex flex-col">
  <Nav />
  <main className="flex-1">{children}</main>
  <Footer />
</body>
```

- [ ] **Step 5: Verify**

Run `npm run dev`, open http://localhost:3000 → nav + footer render with logos. Stop.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Logo, Nav, Footer components"
```

## Task 10: Reusable display components

**Files:**
- Create: `components/SectionHeader.tsx`, `components/StatCard.tsx`, `components/DataCard.tsx`, `components/StatusBadge.tsx`, `components/MotifDivider.tsx`, `components/GalleryStrip.tsx`, `components/EmptyState.tsx`

- [ ] **Step 1: Create all components**

`components/SectionHeader.tsx`:
```tsx
export function SectionHeader({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-water-900">{kicker}</p>
      <h2 className="mt-1 font-beautique text-4xl md:text-5xl text-brown-900">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-ink/70">{intro}</p>}
    </header>
  )
}
```

`components/StatCard.tsx`:
```tsx
export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-white p-6 text-center">
      <div className="font-beautique text-3xl text-water-900">{value}<span className="text-sm text-ink/60 ml-1">{unit}</span></div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">{label}</div>
    </div>
  )
}
```

`components/DataCard.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'

export function DataCard({
  href, image, title, chips = [], desc,
}: {
  href: string
  image: string
  title: string
  chips?: { label: string; color?: string }[]
  desc?: string
}) {
  return (
    <Link href={href} className="group block rounded-2xl border border-tan-700/30 bg-gold-100/40 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-brown-900 group-hover:text-terracotta-500">{title}</h3>
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {chips.map((c) => (
              <span key={c.label} className="rounded-full px-2 py-0.5 text-xs" style={c.color ? { backgroundColor: c.color + '22', color: c.color } : undefined}>
                {c.label}
              </span>
            ))}
          </div>
        )}
        {desc && <p className="mt-2 text-sm text-ink/70 line-clamp-2">{desc}</p>}
      </div>
    </Link>
  )
}
```

`components/StatusBadge.tsx`:
```tsx
export function StatusBadge({ status }: { status: 'Aktif' | 'Berkembang' | 'Persiapan' }) {
  const map = {
    Aktif: 'bg-status-aktif/20 text-status-aktif',
    Berkembang: 'bg-status-berkembang/20 text-status-berkembang',
    Persiapan: 'bg-status-persiapan/20 text-status-persiapan',
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>{status}</span>
}
```

`components/MotifDivider.tsx`:
```tsx
import Image from 'next/image'

export function MotifDivider({ motif = 'cincin_sambel', className }: { motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'; className?: string }) {
  return (
    <div className={`flex justify-center opacity-20 ${className}`}>
      <Image src={`/images/design-system/${motif}.svg`} alt="" width={120} height={40} aria-hidden />
    </div>
  )
}
```

`components/GalleryStrip.tsx`:
```tsx
import Image from 'next/image'

export function GalleryStrip({ images, altPrefix = 'Galeri' }: { images: string[]; altPrefix?: string }) {
  if (images.length === 0) return null
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {images.map((src, i) => (
        <div key={i} className="relative h-40 w-60 shrink-0 rounded-xl overflow-hidden">
          <Image src={src} alt={`${altPrefix} ${i + 1}`} fill className="object-cover" sizes="240px" />
        </div>
      ))}
    </div>
  )
}
```

`components/EmptyState.tsx`:
```tsx
import { MotifDivider } from './MotifDivider'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <MotifDivider className="mb-4" />
      <p className="text-ink/60">{message}</p>
    </div>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: reusable display components (StatCard, DataCard, etc.)"
```

---

# Phase 4: Page Routes

## Task 11: Beranda

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement Beranda**

`app/page.tsx`:
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'

export default function Beranda() {
  const s = getSettings()
  const pariwisata = getCollection('pariwisata').slice(0, 1)
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival').slice(0, 1)
  const kegiatan = getCollection('kegiatan').slice(0, 1)
  const umkm = getCollection('umkm').slice(0, 1)
  const mitra = getCollection('mitra').filter((m) => m.tier === 'Utama')

  const previews = [
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/placeholders/beach.svg', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/placeholders/irrigation.svg', title: 'Irigasi', desc: 'Data saluran irigasi.' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/placeholders/health.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/placeholders/festival.svg', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.' },
    { href: '/kegiatan', image: kegiatan[0]?.cover ?? '/images/placeholders/program.svg', title: 'Kegiatan', desc: 'Program unggulan tim.' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/placeholders/umkm.svg', title: 'UMKM', desc: 'UMKM lokal Sambelia.' },
  ]

  return (
    <>
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center text-center">
        <Image src={s.heroImage} alt="Sambelia" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-brown-900/50" />
        <div className="relative z-10 px-4">
          <h1 className="font-beautique text-5xl md:text-7xl text-page">Melukis Sambelia</h1>
          <p className="mt-4 text-lg text-page/90 max-w-xl mx-auto">{s.heroTagline}</p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link href="/peta" className="rounded-full bg-water-900 px-6 py-3 font-medium text-page hover:bg-water-500">Jelajahi Peta</Link>
            <Link href="/festival" className="rounded-full border border-page px-6 py-3 font-medium text-page hover:bg-page/10">Festival Pesona</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16">
        <SectionHeader kicker="01 — TENTANG" title="Tentang Sambelia" intro="Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Luas" value={s.stats.luas} />
          <StatCard label="Penduduk" value={s.stats.penduduk} />
          <StatCard label="Desa Binaan" value={s.stats.desaBinaan} />
          <StatCard label="Tahun Program" value={s.stats.tahunProgram} />
        </div>
      </section>

      <MotifDivider className="my-8" />

      <section className="mx-auto max-w-content px-4 py-8">
        <SectionHeader kicker="02 — JEJAKI" title="Jejaki Sambelia" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => <DataCard key={p.href} {...p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16">
        <SectionHeader kicker="03 — MITRA" title="Bersama Mitra Kami" />
        <div className="flex flex-wrap gap-8 items-center">
          {mitra.map((m) => (
            <Image key={m.slug} src={m.logo} alt={m.name} width={140} height={60} className="opacity-70" />
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify**

Run `npm run dev`, open http://localhost:3000 → hero, stats, preview cards, mitra. Stop.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Beranda page"
```

## Task 12: Profil Tim

**Files:**
- Create: `app/profil-tim/page.tsx`, `components/MemberCard.tsx`

- [ ] **Step 1: Create MemberCard**

`components/MemberCard.tsx`:
```tsx
import Image from 'next/image'
import type { Tim } from '@/lib/schemas'

export function MemberCard({ member }: { member: Tim & { slug: string } }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-white overflow-hidden">
      <div className="relative aspect-square">
        <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brown-900">{member.name}</h3>
        <p className="text-sm text-ink/70">{member.role}</p>
        <span className="mt-2 inline-block rounded-full bg-water-50 px-2 py-0.5 text-xs text-water-900">{member.division}</span>
        {member.instagram && (
          <a href={`https://instagram.com/${member.instagram}`} className="mt-2 block text-xs text-ink/60 hover:text-terracotta-500">@{member.instagram}</a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create page**

`app/profil-tim/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { MemberCard } from '@/components/MemberCard'

export default function ProfilTimPage() {
  const members = getCollection('tim')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="PROFIL TIM" title="Tim Melukis Sambelia" intro="Mahasiswa Universitas Gadjah Mada periode 2026." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => <MemberCard key={m.slug} member={m} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev   # verify, stop
git add -A
git commit -m "feat: Profil Tim page"
```

## Task 13: Pariwisata (index + detail)

**Files:**
- Create: `app/pariwisata/page.tsx`, `app/pariwisata/[slug]/page.tsx`, `components/MiniMap.tsx`

- [ ] **Step 1: Create MiniMap (shared, used by detail pages)**

`components/MiniMap.tsx`:
```tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default icon path for bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: '/images/design-system/cincin_sambel.svg',
  iconSize: [24, 24],
})

export function MiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-64 w-full rounded-2xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Marker position={[lat, lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}
```

- [ ] **Step 2: Install leaflet deps**

```bash
npm install leaflet react-leaflet @types/leaflet
```

- [ ] **Step 3: Create pariwisata index**

`app/pariwisata/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'

export default function PariwisataPage() {
  const items = getCollection('pariwisata')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="PARIWISATA" title="Potensi Wisata Sambelia" intro="Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan." />
      {items.length === 0 ? (
        <EmptyState message="Belum ada data wisata. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <DataCard
              key={p.slug}
              href={`/pariwisata/${p.slug}`}
              image={p.cover}
              title={p.title}
              chips={[{ label: p.category, color: '#14A8E1' }, { label: p.village, color: '#99BA57' }]}
              desc={p.shortDesc}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create detail page (dynamic, static export needs `generateStaticParams`)**

`app/pariwisata/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { GalleryStrip } from '@/components/GalleryStrip'
import { MiniMap } from '@/components/MiniMap'
import Link from 'next/link'

export function generateStaticParams() {
  return getCollection('pariwisata').map((p) => ({ slug: p.slug }))
}

export default function PariwisataDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('pariwisata', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-content px-4 py-16">
      <Link href="/pariwisata" className="text-sm text-water-900 hover:underline">← Kembali</Link>
      <SectionHeader kicker={item.category} title={item.title} intro={item.shortDesc} />
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-water-50 px-3 py-1 text-water-900">{item.village}</span>
        {item.facilities.map((f) => <span key={f} className="rounded-full bg-gold-100 px-3 py-1">{f}</span>)}
      </div>
      <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: item.body }} />
      <GalleryStrip images={item.gallery} altPrefix={item.title} />
      <div className="mt-8">
        <MiniMap lat={item.lat} lng={item.lng} title={item.title} />
      </div>
    </article>
  )
}
```

Note: For MDX bodies, a full MDX runtime compile in static export is complex. v1 renders body as plain text via `dangerouslySetInnerHTML` only for `.md` collections; for `.mdx` (pariwisata, cerita) we use `next-mdx-remote/rsc` client compile. If that proves heavy, fall back to rendering `body` as plain `<pre>` text for v1 and iterate. Document this tradeoff in a code comment.

- [ ] **Step 5: Verify + commit**

```bash
npm run dev   # verify index + detail
git add -A
git commit -m "feat: Pariwisata index + detail + MiniMap"
```

## Task 14: Irigasi

**Files:**
- Create: `app/irigasi/page.tsx`

- [ ] **Step 1: Create page**

`app/irigasi/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function IrigasiPage() {
  const items = getCollection('irigasi')
  const totalLength = items.reduce((sum, i) => sum + i.lengthM, 0)
  const conditionCounts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.condition] = (acc[i.condition] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="IRIGASI" title="Data Saluran Irigasi" intro="Saluran irigasi di Kecamatan Sambelia." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Saluran" value={String(items.length)} />
        <StatCard label="Total Panjang" value={String(totalLength)} unit="m" />
        <StatCard label="Kondisi Baik" value={String(conditionCounts['Baik'] ?? 0)} />
        <StatCard label="Rusak" value={String((conditionCounts['Rusak Ringan'] ?? 0) + (conditionCounts['Rusak Berat'] ?? 0))} />
      </div>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data irigasi. Tim akan menambahkan segera." />
      ) : (
        <Accordion type="single" collapsible>
          {items.map((i) => (
            <AccordionItem key={i.slug} value={i.slug}>
              <AccordionTrigger>
                <span className="font-semibold text-brown-900">{i.name}</span>
                <span className="ml-3 text-xs text-ink/60">{i.saluranType} · {i.village} · {i.condition}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-ink/70">Panjang: {i.lengthM} m · Status aliran: {i.flowStatus}</p>
                <p className="mt-2 text-sm">{i.body}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev   # verify
git add -A
git commit -m "feat: Irigasi page"
```

## Task 15: Kesehatan

**Files:**
- Create: `app/kesehatan/page.tsx`

- [ ] **Step 1: Create page**

`app/kesehatan/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { DataCard } from '@/components/DataCard'

export default function KesehatanPage() {
  const items = getCollection('kesehatan')
  const posyandu = items.filter((i) => i.type === 'Posyandu').length
  const puskesmas = items.filter((i) => i.type === 'Puskesmas').length
  const cadres = items.reduce((s, i) => s + i.cadresCount, 0)
  const stunting = items.filter((i) => i.stuntingProgram).length

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="KESEHATAN" title="Fasilitas & Program Kesehatan" intro="Posyandu, puskesmas, dan program stunting di Sambelia." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Posyandu" value={String(posyandu)} />
        <StatCard label="Puskesmas" value={String(puskesmas)} />
        <StatCard label="Kader" value={String(cadres)} />
        <StatCard label="Program Stunting" value={String(stunting)} />
      </div>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data kesehatan. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((k) => (
            <DataCard
              key={k.slug}
              href="/kesehatan"
              image={k.cover}
              title={k.facilityName}
              chips={[{ label: k.type, color: '#667F37' }, { label: k.village, color: '#99BA57' }, ...(k.stuntingProgram ? [{ label: 'Stunting', color: '#E3795C' }] : [])]}
              desc={`Kader: ${k.cadresCount}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: Kesehatan page"
```

## Task 16: Festival

**Files:**
- Create: `app/festival/page.tsx`, `components/FestivalTimeline.tsx`

- [ ] **Step 1: Create FestivalTimeline**

`components/FestivalTimeline.tsx`:
```tsx
import Image from 'next/image'
import type { Festival } from '@/lib/schemas'

export function FestivalTimeline({ events }: { events: (Festival & { slug: string })[] }) {
  return (
    <ol className="relative border-l-2 border-terracotta-500 pl-6 space-y-8">
      {events.map((e) => (
        <li key={e.slug} className="relative">
          <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-terracotta-500" />
          <div className="rounded-2xl border border-tan-700/30 bg-gold-100/40 overflow-hidden">
            <div className="relative aspect-video">
              <Image src={e.cover} alt={e.eventName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="p-4">
              <h3 className="font-beautique text-2xl text-brown-900">{e.eventName}</h3>
              <p className="text-sm text-ink/70">{e.schedule} · {e.venue}</p>
              <p className="mt-2 text-sm">{e.description}</p>
              {e.registrationUrl && (
                <a href={e.registrationUrl} className="mt-3 inline-block rounded-full bg-water-900 px-4 py-2 text-sm text-page">Daftar</a>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
```

- [ ] **Step 2: Create page**

`app/festival/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'

export default function FestivalPage() {
  const events = getCollection('festival')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="FESTIVAL" title="Festival Pesona Sambelia" intro="Peresean, Pawai Dulangan, Gendang Beleq — perayaan budaya Sasak." />
      {events.length === 0 ? (
        <EmptyState message="Jadwal festival akan diumumkan." />
      ) : (
        <FestivalTimeline events={events} />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: Festival page + timeline"
```

## Task 17: Kegiatan

**Files:**
- Create: `app/kegiatan/page.tsx`, `components/KegiatanRoadmap.tsx`

- [ ] **Step 1: Create KegiatanRoadmap**

`components/KegiatanRoadmap.tsx`:
```tsx
import Image from 'next/image'
import type { Kegiatan } from '@/lib/schemas'
import { StatusBadge } from '@/components/StatusBadge'

export function KegiatanRoadmap({ items }: { items: (Kegiatan & { slug: string })[] }) {
  return (
    <div className="space-y-6">
      {items.map((k) => (
        <div key={k.slug} className="rounded-2xl border border-tan-700/30 bg-white overflow-hidden md:flex">
          <div className="relative aspect-video md:w-64 shrink-0">
            <Image src={k.cover} alt={k.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 256px" />
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-brown-900">{k.title}</h3>
              <StatusBadge status={k.status} />
            </div>
            <span className="text-xs text-ink/60">{k.category}</span>
            <p className="mt-2 text-sm text-ink/70">{k.summary}</p>
            {k.milestones.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {k.milestones.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span>{m.done ? '✓' : '○'}</span>
                    <span className={m.done ? 'line-through text-ink/40' : ''}>{m.label}</span>
                    <span className="text-ink/40 text-xs">— {m.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create page**

`app/kegiatan/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { KegiatanRoadmap } from '@/components/KegiatanRoadmap'
import { EmptyState } from '@/components/EmptyState'

export default function KegiatanPage() {
  const items = getCollection('kegiatan')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="KEGIATAN" title="Program Unggulan" intro="Roadmap program pemberdayaan Melukis Sambelia." />
      {items.length === 0 ? (
        <EmptyState message="Belum ada program. Tim akan menambahkan segera." />
      ) : (
        <KegiatanRoadmap items={items} />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: Kegiatan page + roadmap"
```

## Task 18: Cerita

**Files:**
- Create: `app/cerita/page.tsx`, `app/cerita/[slug]/page.tsx`

- [ ] **Step 1: Create index**

`app/cerita/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'

export default function CeritaPage() {
  const items = getCollection('cerita')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="CERITA" title="Cerita dari Sambelia" intro="Catatan lapangan tim Melukis Sambelia." />
      {items.length === 0 ? (
        <EmptyState message="Belum ada cerita. Tim akan menulis segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <DataCard
              key={c.slug}
              href={`/cerita/${c.slug}`}
              image={c.cover}
              title={c.title}
              chips={[{ label: c.author, color: '#742D1B' }, { label: c.date, color: '#AF7E4F' }]}
              desc={c.excerpt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create detail**

`app/cerita/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'

export function generateStaticParams() {
  return getCollection('cerita').map((c) => ({ slug: c.slug }))
}

export default function CeritaDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('cerita', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/cerita" className="text-sm text-water-900 hover:underline">← Kembali</Link>
      <SectionHeader kicker={item.date} title={item.title} intro={`Oleh ${item.author}`} />
      <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: item.body }} />
    </article>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: Cerita index + detail"
```

## Task 19: UMKM

**Files:**
- Create: `app/umkm/page.tsx`, `components/UmkmCard.tsx`

- [ ] **Step 1: Create UmkmCard**

`components/UmkmCard.tsx`:
```tsx
import Image from 'next/image'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item }: { item: Umkm & { slug: string } }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-gold-100/40 overflow-hidden">
      <div className="relative aspect-video">
        <Image src={item.cover} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brown-900">{item.name}</h3>
        <p className="text-sm text-ink/70">{item.owner}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs">{item.product}</span>
          <span className="rounded-full bg-water-50 px-2 py-0.5 text-xs text-water-900">{item.village}</span>
        </div>
        {item.contact && <p className="mt-2 text-xs text-ink/60">{item.contact}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create page**

`app/umkm/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'

export default function UmkmPage() {
  const items = getCollection('umkm')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="UMKM" title="UMKM Lokal Sambelia" intro="Kerajinan, kuliner, dan produk lokal." />
      {items.length === 0 ? (
        <EmptyState message="Belum ada data UMKM. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => <UmkmCard key={u.slug} item={u} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: UMKM page"
```

## Task 20: Mitra

**Files:**
- Create: `app/mitra/page.tsx`, `components/MitraGrid.tsx`

- [ ] **Step 1: Create MitraGrid**

`components/MitraGrid.tsx`:
```tsx
import Image from 'next/image'
import type { Mitra } from '@/lib/schemas'

export function MitraGrid({ items }: { items: (Mitra & { slug: string })[] }) {
  const tiers = ['Utama', 'Pendukung', 'Media'] as const
  return (
    <div className="space-y-12">
      {tiers.map((tier) => {
        const tierItems = items.filter((m) => m.tier === tier)
        if (tierItems.length === 0) return null
        return (
          <div key={tier}>
            <h3 className="font-beautique text-2xl text-brown-900 mb-4">Mitra {tier}</h3>
            <div className="flex flex-wrap gap-8 items-center">
              {tierItems.map((m) => (
                <a key={m.slug} href={m.url} target="_blank" rel="noopener noreferrer">
                  <Image src={m.logo} alt={m.name} width={160} height={60} className="opacity-70 hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create page**

`app/mitra/page.tsx`:
```tsx
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { MitraGrid } from '@/components/MitraGrid'
import { EmptyState } from '@/components/EmptyState'

export default function MitraPage() {
  const items = getCollection('mitra')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="MITRA" title="Mitra Kami" intro="Mitra program Melukis Sambelia." />
      {items.length === 0 ? <EmptyState message="Belum ada mitra." /> : <MitraGrid items={items} />}
    </div>
  )
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add -A
git commit -m "feat: Mitra page"
```

---

# Phase 5: Peta (Dual Map)

## Task 21: InteractiveMap (Leaflet, layer toggles, markers)

**Files:**
- Create: `components/InteractiveMap.tsx`

- [ ] **Step 1: Create the component**

`components/InteractiveMap.tsx`:
```tsx
'use client'
import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { LAYER_COLORS, type MapLayer, type MapMarker } from '@/lib/map'

delete (L.Icon.Default.prototype as any)._getIconUrl

const ALL_LAYERS: MapLayer[] = ['pariwisata', 'irigasi', 'kesehatan', 'umkm']
const LAYER_LABELS: Record<MapLayer, string> = {
  pariwisata: 'Pariwisata',
  irigasi: 'Irigasi',
  kesehatan: 'Kesehatan',
  umkm: 'UMKM',
}

export function InteractiveMap({ markers }: { markers: MapMarker[] }) {
  const [enabled, setEnabled] = useState<Set<MapLayer>>(new Set(ALL_LAYERS))

  const visible = useMemo(
    () => markers.filter((m) => enabled.has(m.layer)),
    [markers, enabled],
  )

  const toggle = (layer: MapLayer) => {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(layer)) next.delete(layer)
      else next.add(layer)
      return next
    })
  }

  return (
    <div className="grid md:grid-cols-[1fr,200px] gap-4">
      <MapContainer center={[-8.36, 116.85]} zoom={12} scrollWheelZoom={false} className="h-[60vh] w-full rounded-2xl">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        {visible.map((m) => (
          <CircleMarker
            key={`${m.layer}-${m.slug}`}
            center={[m.lat, m.lng]}
            radius={8}
            pathOptions={{ color: LAYER_COLORS[m.layer], fillColor: LAYER_COLORS[m.layer], fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{m.title}</strong>
              <br />
              <span style={{ color: LAYER_COLORS[m.layer] }}>{LAYER_LABELS[m.layer]}</span>
              <br />
              <Link href={m.href}>Lihat detail</Link>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <aside className="space-y-2">
        <h3 className="font-semibold text-sm">Lapisan</h3>
        {ALL_LAYERS.map((layer) => {
          const count = markers.filter((m) => m.layer === layer).length
          const isEnabled = enabled.has(layer)
          return (
            <button
              key={layer}
              onClick={() => toggle(layer)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${isEnabled ? 'border-tan-700/40 bg-white' : 'border-tan-700/10 bg-white/40 opacity-50'}`}
            >
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: LAYER_COLORS[layer] }} />
                {LAYER_LABELS[layer]}
              </span>
              <span className="text-xs text-ink/60">{count}</span>
            </button>
          )
        })}
        {visible.length === 0 && <p className="text-xs text-ink/50">Tidak ada titik pada lapisan aktif.</p>}
      </aside>
    </div>
  )
}
```

Note: We use `CircleMarker` instead of `Marker` to avoid Leaflet's default icon asset path issues in bundlers; circles colored per layer are also clearer on a dense map.

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: InteractiveMap with layer toggles + colored markers"
```

## Task 22: GisMap (auto-detect GeoJSON + image/PDF)

**Files:**
- Create: `components/GisMap.tsx`

- [ ] **Step 1: Create the component**

`components/GisMap.tsx`:
```tsx
'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'

type GisFile = { type: 'geojson'; name: string; url: string } | { type: 'image'; name: string; url: string } | { type: 'pdf'; name: string; url: string }

const GIS_DIR_MANIFEST = '/gis/manifest.json'

export function GisMap({ title, description, credit }: { title: string; description: string; credit: string }) {
  const [files, setFiles] = useState<GisFile[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    fetch(GIS_DIR_MANIFEST)
      .then((r) => (r.ok ? r.json() : []))
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [])

  const activeFile = files.find((f) => f.name === active) ?? files[0] ?? null

  return (
    <div>
      <header className="mb-4">
        <h3 className="font-beautique text-2xl text-brown-900">{title}</h3>
        {description && <p className="text-sm text-ink/70">{description}</p>}
        {credit && <p className="text-xs text-ink/50"> oleh {credit}</p>}
      </header>

      {files.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tan-700/40 p-8 text-center text-ink/60">
          Peta GIS tim belum tersedia. Letakkan file GeoJSON atau gambar di folder <code>public/gis/</code>.
        </p>
      ) : (
        <div className="grid md:grid-cols-[200px,1fr] gap-4">
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.name}>
                <button
                  onClick={() => setActive(f.name)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${activeFile?.name === f.name ? 'bg-water-50 text-water-900' : 'hover:bg-white'}`}
                >
                  {f.name} <span className="text-xs text-ink/40">({f.type})</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-tan-700/30 overflow-hidden">
            {activeFile?.type === 'geojson' && (
              <MapContainer center={[-8.36, 116.85]} zoom={12} className="h-[60vh] w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <GeoJSON data={fetch(activeFile.url).then((r) => r.json()) as any} />
              </MapContainer>
            )}
            {activeFile?.type === 'image' && (
              <div className="relative h-[60vh] w-full">
                <Image src={activeFile.url} alt={activeFile.name} fill className="object-contain" sizes="100vw" />
              </div>
            )}
            {activeFile?.type === 'pdf' && (
              <iframe src={activeFile.url} title={activeFile.name} className="h-[60vh] w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

Note: The GeoJSON `data` prop expects a parsed object, not a Promise. The proper approach is to fetch the GeoJSON in a `useEffect` and store the parsed object in state, then pass it to `<GeoJSON>`. The snippet above is illustrative; the implementer must wire an async fetch + state for the GeoJSON data. Update before merging.

- [ ] **Step 2: Create a manifest builder script**

Because static export can't list a directory at runtime, we generate a manifest at build time.

Create `scripts/build-gis-manifest.mjs`:
```js
import fs from 'fs'
import path from 'path'

const GIS_DIR = path.join(process.cwd(), 'public', 'gis')
const manifest = []

if (fs.existsSync(GIS_DIR)) {
  for (const file of fs.readdirSync(GIS_DIR)) {
    if (file === 'manifest.json') continue
    const ext = path.extname(file).slice(1).toLowerCase()
    const type = ext === 'geojson' || ext === 'json' ? 'geojson' : ext === 'pdf' ? 'pdf' : 'image'
    manifest.push({ type, name: file.replace(/\.[^.]+$/, ''), url: `/gis/${file}` })
  }
}

fs.writeFileSync(path.join(GIS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`Wrote gis manifest: ${manifest.length} files`)
```

Add to `package.json` scripts:
```json
"prebuild": "node scripts/build-gis-manifest.mjs"
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: GisMap component + manifest builder (GeoJSON/image/PDF auto-detect)"
```

## Task 23: Peta page (dual tab)

**Files:**
- Create: `app/peta/page.tsx`, `components/MapPanel.tsx`

- [ ] **Step 1: Create MapPanel wrapper (client)**

`components/MapPanel.tsx`:
```tsx
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InteractiveMap } from './InteractiveMap'
import { GisMap } from './GisMap'
import type { MapMarker } from '@/lib/map'

export function MapPanel({ markers, gis }: { markers: MapMarker[]; gis: { title: string; description: string; credit: string } }) {
  return (
    <Tabs defaultValue="interaktif">
      <TabsList>
        <TabsTrigger value="interaktif">Peta Interaktif</TabsTrigger>
        <TabsTrigger value="gis">Peta GIS Tim</TabsTrigger>
      </TabsList>
      <TabsContent value="interaktif"><InteractiveMap markers={markers} /></TabsContent>
      <TabsContent value="gis"><GisMap {...gis} /></TabsContent>
    </Tabs>
  )
}
```

- [ ] **Step 2: Create the page**

`app/peta/page.tsx`:
```tsx
import { getMapMarkers } from '@/lib/map'
import { getGisMap } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { MapPanel } from '@/components/MapPanel'

export default function PetaPage() {
  const markers = getMapMarkers()
  const gis = getGisMap()
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="02 — PETA" title="Peta Sambelia" intro="Jelajahi titik wisata, irigasi, kesehatan, dan UMKM, atau buka peta GIS tim." />
      <MapPanel markers={markers} gis={gis} />
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`, open http://localhost:3000/peta → both tabs render. Interactive tab shows markers + layer toggles. GIS tab shows empty-state (no files yet). Stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Peta page with dual-map tabs"
```

---

# Phase 6: Decap CMS

## Task 24: Decap CMS admin + config

**Files:**
- Create: `public/admin/index.html`, `public/admin/config.yml`

- [ ] **Step 1: Create admin host**

`public/admin/index.html`:
```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager — Melukis Sambelia</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create config.yml (with `local_backend` for local-first editing)**

`public/admin/config.yml`:
```yaml
local_backend: true

backend:
  name: github
  repo: miapalovaara/melukisambelia
  branch: main
  auth_type: oauth
  proxy_url: /api/auth
  base_url: /
  auth_endpoint: api/auth

media_folder: "public/images"
public_folder: "/images"

collections:
  - name: "tim"
    label: "Tim"
    folder: "content/tim"
    create: true
    extension: "md"
    fields:
      - { label: "Nama", name: "name", widget: "string" }
      - { label: "Peran", name: "role", widget: "string" }
      - { label: "Divisi", name: "division", widget: "select", options: ["Koor", "Pariwisata", "Irigasi", "Kesehatan", "Publikasi", "Media", "Dana", "Logistik"] }
      - { label: "Foto", name: "photo", widget: "image" }
      - { label: "Bio", name: "bio", widget: "text" }
      - { label: "Instagram", name: "instagram", widget: "string", required: false }
      - { label: "Urutan", name: "order", widget: "number" }

  - name: "pariwisata"
    label: "Pariwisata"
    folder: "content/pariwisata"
    create: true
    extension: "mdx"
    format: "mdx"
    fields:
      - { label: "Judul", name: "title", widget: "string" }
      - { label: "Kategori", name: "category", widget: "select", options: ["Pantai", "Budaya", "Desa Wisata", "Air", "Trekking"] }
      - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Galeri", name: "gallery", widget: "list", field: { name: "image", label: "Gambar", widget: "image" }, required: false }
      - { label: "Deskripsi Singkat", name: "shortDesc", widget: "string" }
      - { label: "Konten", name: "body", widget: "markdown" }
      - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
      - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }
      - { label: "Fasilitas", name: "facilities", widget: "list", required: false }
      - { label: "Catatan Akses", name: "accessNotes", widget: "string", required: false }

  - name: "irigasi"
    label: "Irigasi"
    folder: "content/irigasi"
    create: true
    extension: "md"
    fields:
      - { label: "Nama Saluran", name: "name", widget: "string" }
      - { label: "Tipe", name: "saluranType", widget: "select", options: ["Primer", "Sekunder", "Tersier"] }
      - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
      - { label: "Kondisi", name: "condition", widget: "select", options: ["Baik", "Rusak Ringan", "Rusak Berat"] }
      - { label: "Panjang (m)", name: "lengthM", widget: "number" }
      - { label: "Status Aliran", name: "flowStatus", widget: "select", options: ["Mengalir", "Kering", "Mengalir Sebagian"] }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Konten", name: "body", widget: "markdown" }
      - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
      - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }

  - name: "kesehatan"
    label: "Kesehatan"
    folder: "content/kesehatan"
    create: true
    extension: "md"
    fields:
      - { label: "Nama Fasilitas", name: "facilityName", widget: "string" }
      - { label: "Tipe", name: "type", widget: "select", options: ["Posyandu", "Puskesmas", "Bidan", "Polides"] }
      - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
      - { label: "Jumlah Kader", name: "cadresCount", widget: "number" }
      - { label: "Program Stunting", name: "stuntingProgram", widget: "boolean" }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Konten", name: "body", widget: "markdown" }
      - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
      - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }

  - name: "festival"
    label: "Festival"
    folder: "content/festival"
    create: true
    extension: "md"
    fields:
      - { label: "Nama Acara", name: "eventName", widget: "string" }
      - { label: "Jadwal", name: "schedule", widget: "string" }
      - { label: "Lokasi", name: "venue", widget: "string" }
      - { label: "Deskripsi", name: "description", widget: "string" }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "URL Pendaftaran", name: "registrationUrl", widget: "string", required: false }
      - { label: "Konten", name: "body", widget: "markdown" }

  - name: "kegiatan"
    label: "Kegiatan"
    folder: "content/kegiatan"
    create: true
    extension: "md"
    fields:
      - { label: "Judul", name: "title", widget: "string" }
      - { label: "Status", name: "status", widget: "select", options: ["Aktif", "Berkembang", "Persiapan"] }
      - { label: "Kategori", name: "category", widget: "select", options: ["Ekowisata", "Irigasi", "Kesehatan", "Pariwisata", "Ekonomi"] }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Ringkasan", name: "summary", widget: "string" }
      - { label: "Konten", name: "body", widget: "markdown" }
      - label: "Milestone"
        name: "milestones"
        widget: "list"
        required: false
        fields:
          - { label: "Tanggal", name: "date", widget: "string" }
          - { label: "Label", name: "label", widget: "string" }
          - { label: "Selesai", name: "done", widget: "boolean" }

  - name: "cerita"
    label: "Cerita"
    folder: "content/cerita"
    create: true
    extension: "mdx"
    format: "mdx"
    fields:
      - { label: "Judul", name: "title", widget: "string" }
      - { label: "Penulis", name: "author", widget: "relation", collection: "tim", value_field: "name", search_fields: ["name"] }
      - { label: "Tanggal", name: "date", widget: "datetime" }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Ringkasan", name: "excerpt", widget: "string" }
      - { label: "Konten", name: "body", widget: "markdown" }

  - name: "umkm"
    label: "UMKM"
    folder: "content/umkm"
    create: true
    extension: "md"
    fields:
      - { label: "Nama UMKM", name: "name", widget: "string" }
      - { label: "Pemilik", name: "owner", widget: "string" }
      - { label: "Produk", name: "product", widget: "select", options: ["Kerajinan", "Kuliner", "Pertanian", "Anyaman", "lainnya"] }
      - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
      - { label: "Kontak", name: "contact", widget: "string" }
      - { label: "Cover", name: "cover", widget: "image" }
      - { label: "Galeri", name: "gallery", widget: "list", field: { name: "image", label: "Gambar", widget: "image" }, required: false }
      - { label: "Konten", name: "body", widget: "markdown" }
      - { label: "Latitude", name: "lat", widget: "number", value_type: "float", required: false }
      - { label: "Longitude", name: "lng", widget: "number", value_type: "float", required: false }

  - name: "mitra"
    label: "Mitra"
    folder: "content/mitra"
    create: true
    extension: "md"
    fields:
      - { label: "Nama", name: "name", widget: "string" }
      - { label: "Logo", name: "logo", widget: "image" }
      - { label: "URL", name: "url", widget: "string" }
      - { label: "Tingkat", name: "tier", widget: "select", options: ["Utama", "Pendukung", "Media"] }
      - { label: "Urutan", name: "order", widget: "number" }

  - name: "settings"
    label: "Pengaturan Situs"
    folder: "content"
    create: false
    extension: "md"
    files:
      - label: "Pengaturan"
        name: "_settings"
        file: "content/_settings.md"
        fields:
          - { label: "Gambar Hero", name: "heroImage", widget: "image" }
          - { label: "Tagline Hero", name: "heroTagline", widget: "string" }
          - label: "Statistik"
            name: "stats"
            widget: "object"
            fields:
              - { label: "Luas", name: "luas", widget: "string" }
              - { label: "Penduduk", name: "penduduk", widget: "string" }
              - { label: "Desa Binaan", name: "desaBinaan", widget: "string" }
              - { label: "Tahun Program", name: "tahunProgram", widget: "string" }
          - { label: "Tanggal Festival", name: "festivalDates", widget: "string" }
          - label: "Sosial"
            name: "socials"
            widget: "object"
            fields:
              - { label: "Instagram", name: "instagram", widget: "string", required: false }
              - { label: "TikTok", name: "tiktok", widget: "string", required: false }
          - label: "Kontak"
            name: "contact"
            widget: "object"
            fields:
              - { label: "Email", name: "email", widget: "string" }
              - { label: "Telepon", name: "phone", widget: "string", required: false }
              - { label: "Alamat", name: "address", widget: "string" }

      - label: "Peta GIS"
        name: "_gismap"
        file: "content/_gismap.md"
        fields:
          - { label: "Judul", name: "title", widget: "string" }
          - { label: "Deskripsi", name: "description", widget: "string", required: false }
          - { label: "Kredit", name: "credit", widget: "string", required: false }
```

Note: Replace `repo: miapalovaara/melukisambelia` with the actual GitHub repo path if different. Decap's nested `settings` collection uses the `files` form (singletons); verify syntax against Decap docs — if `folder` + `files` together isn't supported, split into two separate `name: "settings"` and `name: "gismap"` collections each with a single `files` entry.

- [ ] **Step 3: Verify admin loads locally (stub mode)**

Run in one terminal:
```bash
npm run dev
```
In another terminal:
```bash
npx decap-server
```
Open http://localhost:3000/admin → Decap CMS UI loads and, because `local_backend: true` is set and `decap-server` is running, it should present the collections editable against the local `content/` folder **without GitHub login**. Verify you can see the seeded collections (tim, pariwisata, etc.). Stop both servers.

This is the local-first editing path — no OAuth needed until deploy.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Decap CMS admin + config for all collections"
```

## Task 25: Decap OAuth proxy (Vercel serverless) — DEPLOY-TIME ONLY

> **Local-first note:** This task wires the OAuth handler so it's ready for deploy, but it is **not exercised locally**. Local editing uses `local_backend: true` + `decap-server` (Task 24). Do not block local progress on OAuth env vars; create the files and `.env.example` so the code is in place, but skip live OAuth testing until Phase 8.

**Files:**
- Create: `app/api/auth/[...decap].ts`, `vercel.json` (optional)

- [ ] **Step 1: Install the proxy**

Run:
```bash
npm install @i-xi-dev/decap-cms-github-oauth-provider
```
(If this package isn't available, use `decap-oauth` or implement a minimal OAuth flow manually per Decap's docs. The key requirement: an endpoint at `/api/auth` that handles the GitHub OAuth code exchange and redirects back to `/admin/`.)

- [ ] **Step 2: Create the serverless handler**

`app/api/auth/[...decap].ts`:
```ts
import { createOAuthProvider } from '@i-xi-dev/decap-cms-github-oauth-provider'

const handler = createOAuthProvider({
  clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
  clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
})

export { handler as GET, handler as POST }
```

Note: Static export (`output: 'export'`) does NOT emit API routes. So this OAuth handler requires either (a) deploying on Vercel with the API route excluded from export via `exportPathMap` overrides (Vercel runs API routes alongside static), or (b) using a separate Vercel serverless function. The cleanest path: keep `output: 'export'` for the static site, and add the OAuth provider as a standalone Vercel Serverless Function in `api/auth.ts` at the repo root (Vercel auto-detects). See Vercel "Functions" docs. Confirm with the platform's behavior at deploy time.

- [ ] **Step 3: Document env vars**

Create `.env.example`:
```
GITHUB_OAUTH_CLIENT_ID=your_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_client_secret
```
And add to the project README (or a new `docs/decap-setup.md`) the steps to create a GitHub OAuth app (Authorization callback URL = `https://melukis-sambelia.vercel.app/api/auth`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Decap OAuth proxy serverless handler + env docs"
```

---

# Phase 7: Polish & Metadata

## Task 26: Custom 404 + robots + sitemap + OG image

**Files:**
- Create: `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`

- [ ] **Step 1: 404 page**

`app/not-found.tsx`:
```tsx
import Link from 'next/link'
import { MotifDivider } from '@/components/MotifDivider'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center">
      <h1 className="font-beautique text-6xl text-brown-900">404</h1>
      <p className="mt-4 text-ink/70">Halaman tidak ditemukan.</p>
      <MotifDivider className="my-6" />
      <Link href="/" className="rounded-full bg-water-900 px-6 py-3 text-page">Kembali ke Beranda</Link>
    </div>
  )
}
```

- [ ] **Step 2: robots**

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/', disallow: ['/admin'] },
    sitemap: 'https://melukis-sambelia.vercel.app/sitemap.xml',
  }
}
```

- [ ] **Step 3: sitemap**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'

const BASE = 'https://melukis-sambelia.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/profil-tim', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/kegiatan', '/cerita', '/umkm', '/mitra']
  const dynamic: MetadataRoute.Sitemap = [
    ...getCollection('pariwisata').map((p) => ({ url: `${BASE}/pariwisata/${p.slug}`, lastModified: new Date() })),
    ...getCollection('cerita').map((c) => ({ url: `${BASE}/cerita/${c.slug}`, lastModified: new Date() })),
  ]
  return [...staticRoutes.map((r) => ({ url: `${BASE}${r}`, lastModified: new Date() })), ...dynamic]
}
```

- [ ] **Step 4: OG image (dynamic)**

`app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#FFFCF7', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontSize: 80, color: '#742D1B', fontFamily: 'serif' }}>Melukis Sambelia</div>
        <div style={{ fontSize: 28, color: '#0873B9' }}>KKN-PPM UGM · Sambelia, Lombok Timur</div>
      </div>
    ),
    size,
  )
}
```

Note: `next/og`'s `ImageResponse` does not work with `output: 'export'` at build time for dynamic OG generation. For static export, generate a static `public/og.png` at build via a script instead. Replace this file with a build-time script `scripts/generate-og.mjs` using `@vercel/og` or `satori` to write `public/og.png`, and reference it in metadata. Confirm before merging.

- [ ] **Step 5: Reference OG in metadata**

In `app/layout.tsx`, extend `metadata`:
```ts
openGraph: {
  images: ['/og.png'],
  title: 'Melukis Sambelia — KKN-PPM UGM',
  description: 'Pemberdayaan pariwisata berkelanjutan dan agropolitan Sambelia.',
  type: 'website',
  locale: 'id_ID',
},
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: 404, robots, sitemap, OG image metadata"
```

## Task 27: Vercel Analytics

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install + wire**

Run:
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`, add:
```tsx
import { Analytics } from '@vercel/analytics/react'
// ... inside <body> at the end, after <Footer />:
<Analytics />
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Vercel Analytics"
```

## Task 28: Playwright smoke E2E

**Files:**
- Create: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write the smoke test**

`tests/e2e/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test'

const ROUTES = ['/', '/profil-tim', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/kegiatan', '/cerita', '/umkm', '/mitra']

for (const route of ROUTES) {
  test(`loads ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
}

test('peta tabs switch', async ({ page }) => {
  await page.goto('/peta')
  await expect(page.getByRole('tab', { name: 'Peta Interaktif' })).toBeVisible()
  await page.getByRole('tab', { name: 'Peta GIS Tim' }).click()
  await expect(page.getByText(/Peta GIS/i)).toBeVisible()
})

test('admin loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveTitle(/Content Manager/i)
})
```

- [ ] **Step 2: Run E2E against the dev server**

```bash
npm run test:e2e
```
Expected: all tests pass (admin will show the Decap UI; if `decap-server` is running, the collections load locally without login). If the admin test is flaky without `decap-server`, guard it with a skip when the server isn't present — but the UI shell should still appear.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: Playwright smoke E2E for all routes + peta + admin"
```

## Task 29: Local production build verification — LOCAL-FIRST GATE

> **This is the gate before any deploy.** Everything above must pass here, against the static export served locally, before Phase 8 begins.

**Files:** none (verification only)

- [ ] **Step 1: Run full checks**

```bash
npm run lint && npm run typecheck && npm test && npm run build
```
Expected: lint clean, typecheck clean, tests pass, build produces `out/` directory with all static pages.

- [ ] **Step 2: Serve the export locally and smoke-test**

```bash
npx serve out -l 3001
```
Open http://localhost:3001 — verify beranda, peta, and one detail page render. Stop.

- [ ] **Step 3: Commit any fixes**

If the build surfaced issues (e.g. MDX rendering, leaflet SSR), fix them and commit:
```bash
git add -A
git commit -m "fix: production build issues"
```

---

# Phase 8: Deployment

> **Gated behind Task 29.** Do not start this phase until the local-first gate passes: `npm run lint && npm run typecheck && npm test && npm run build` all green, and `out/` served locally renders beranda + peta + a detail page correctly.

## Task 30: Deploy to Vercel + Decap OAuth setup — DEPLOY ONLY

**Files:** none (configuration in Vercel dashboard)

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Import project on Vercel**

In Vercel dashboard: New Project → import the GitHub repo. Framework preset: Next.js. Build command `npm run build`, output directory `out`. Add env vars:
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`

Deploy.

- [ ] **Step 3: Create GitHub OAuth app**

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
- Application name: Melukis Sambelia CMS
- Homepage URL: `https://melukis-sambelia.vercel.app`
- Authorization callback URL: `https://melukis-sambelia.vercel.app/api/auth`

Copy Client ID + generate Client Secret → set as Vercel env vars (redeploy).

- [ ] **Step 4: Verify admin login**

Open `https://melukis-sambelia.vercel.app/admin` → log in with GitHub → confirm collections appear and editing a test entry commits to the repo and triggers a redeploy.

- [ ] **Step 5: Final commit (any deploy config tweaks)**

If `vercel.json` is needed for the API route to coexist with static export, add it and commit:
```bash
git add -A
git commit -m "chore: Vercel deploy config"
git push
```

---

## Self-Review Notes (for the implementer)

**Known tradeoffs to resolve during implementation:**
1. **MDX body rendering** — Tasks 13 & 18 use `dangerouslySetInnerHTML` with raw body text for v1. For true MDX (components, embeds), wire `next-mdx-remote/rsc` per detail page. If time-boxed, ship plain markdown rendering first and upgrade.
2. **GisMap GeoJSON fetch** — Task 22's `<GeoJSON data={...}>` needs an async fetch + state in a `useEffect`; the snippet is illustrative.
3. **Static export + API routes** — Task 25's OAuth handler can't live under `output: 'export'`. Use a root-level `api/auth.ts` Vercel Serverless Function, or switch to a non-export Next.js deploy. Confirm Vercel's behavior.
4. **OG image** — Task 26: `next/og` doesn't work with static export at build. Generate a static `public/og.png` via a build script instead.
5. **Decap `settings` collection** — Task 24: verify the nested `folder` + `files` syntax; split into two singleton collections if Decap rejects it.

**Spec coverage check:**
- Beranda ✓ (Task 11)
- Profil Tim ✓ (Task 12)
- Peta dual map ✓ (Tasks 21-23)
- Pariwisata index+detail ✓ (Task 13)
- Irigasi ✓ (Task 14)
- Kesehatan ✓ (Task 15)
- Festival ✓ (Task 16)
- Kegiatan ✓ (Task 17)
- Cerita index+detail ✓ (Task 18)
- UMKM ✓ (Task 19)
- Mitra ✓ (Task 20)
- Admin/Decap ✓ (Tasks 24-25)
- 404/robots/sitemap/OG ✓ (Task 26)
- Analytics ✓ (Task 27)
- Tests ✓ (Tasks 6-8 unit, Task 28 E2E, Task 29 build)
- Deploy ✓ (Task 30)
- Fonts ✓ (Task 2)
- Palette ✓ (Task 3)
- shadcn ✓ (Task 4)
- Content model + schemas ✓ (Tasks 6-8)
- Assets wired ✓ (Tasks 9, 22)