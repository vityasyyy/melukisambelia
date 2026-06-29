# Deployment Guide — Melukis Sambelia

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** with access to `vityasyyy/melukisambelia` on GitHub
- **Vercel CLI** (`npm i -g vercel`) or Vercel dashboard access
- **Decap CMS** local proxy for content editing (`npm run cms`)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Clear stale Next.js cache (important after dependency changes)
rm -rf .next

# 3. Start dev server
npm run dev

# 4. (Optional) Start Decap CMS local proxy in another terminal
npm run cms
```

The site runs at `http://localhost:3000`.  
The CMS admin is at `http://localhost:3000/admin` (requires `npm run cms` running on port 8081).

---

## Environment Variables

Create `.env.local` from `.env.example`:

```env
# No required env vars for basic deployment.
# If adding features, add vars here.
```

---

## Build & Type Check

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Unit tests
npm run test

# E2E tests (requires dev server running)
npm run test:e2e

# Production build
npm run build
```

The build script (`prebuild`) automatically runs:
1. `scripts/build-gis-manifest.mjs` — scans `public/gis/` for GIS files
2. `scripts/generate-og.mjs` — generates Open Graph images
3. `scripts/check-images.mjs` — validates image references

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
# 1. Link project (first time only)
vercel link

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (Git Integration)

1. Push to `main` branch on GitHub
2. Vercel auto-deploys from the `main` branch
3. Production URL: `https://melukis-sambelia.vercel.app`

### Vercel Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (uses `prebuild` automatically)
- **Output Directory:** `.next` (default)
- **Node.js Version:** 18.x
- **Root Directory:** `./` (default)

---

## CMS Admin (Decap CMS)

The CMS admin panel is at `/admin`. For local editing, run:

```bash
npm run cms
```

This starts the Decap gateway on port 8081. The admin page at `http://localhost:3000/admin` will auto-detect the gateway.

For production, the CMS uses GitHub backend with OAuth via the Vercel serverless function at `/api/auth`.

### CMS Collections

| Collection | Type | Folder/File |
|---|---|---|
| Pariwisata | Folder | `content/pariwisata/*.mdx` |
| Irigasi | Folder | `content/irigasi/*.md` |
| Kesehatan | Folder | `content/kesehatan/*.md` |
| Festival | Folder | `content/festival/*.md` |
| Cerita | Folder | `content/cerita/*.mdx` |
| UMKM | Folder | `content/umkm/*.md` |
| Air & Tanah | Single file | `content/air-tanah/air-tanah.md` |
| Desa Binaan | Folder | `content/desa/*.md` |
| Tentang Sambelia | Single file | `content/_tentang.md` |
| Pengaturan Situs | Single file | `content/_settings.md` |
| Peta GIS | Single file | `content/_gismap.md` |
| GIS Umum | Single file | `content/_gis_umum.md` |
| GIS Air | Single file | `content/_gis_air.md` |
| GIS Irigasi | Single file | `content/_gis_irigasi.md` |
| GIS Vegetasi | Single file | `content/_gis_vegetasi.md` |

---

## Content Editing Workflow

1. **Local:** Run `npm run cms` + `npm run dev`, edit at `localhost:3000/admin`
2. **Production:** Edit at `melukis-sambelia.vercel.app/admin` — changes commit directly to GitHub

### What's Editable via CMS

- All page hero text (kicker, title, intro)
- All SEO metadata (title, description)
- Section headers on all pages
- Jejaki cards (7 homepage preview cards)
- Footer tagline and copyright
- Empty state messages per collection
- GIS metadata per category
- All content collections (pariwisata, irigasi, etc.)
- Site settings (stats, socials, contact, festival dates)

### What Stays in Code (structural, not content)

- Navigation labels and routes
- Button labels ("Buka di Google Maps", "Lihat detail", etc.)
- Map layer names and colors
- UMKM kategori filter labels
- Layout and styling

---

## Troubleshooting

### ChunkLoadError on dev server
Clear the `.next` cache:
```bash
rm -rf .next && npm run dev
```

### Air & Tanah data not showing
The collection uses `content/air-tanah/` (hyphenated) with a `dir` override in `lib/content.ts`. If you rename the folder, update the schema map.

### CMS returns empty entries
Make sure `npm run cms` is running and the `content/` folder paths in `public/admin/config.yml` match actual file paths.

---

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom design tokens
- **Animations:** Framer Motion
- **CMS:** Decap CMS (formerly Netlify CMS)
- **Maps:** Google Maps embed (no API key)
- **Deployment:** Vercel
- **Content:** Markdown/MDX with YAML frontmatter, validated by Zod schemas