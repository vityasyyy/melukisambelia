# Melukis Sambelia

Portal informasi Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — dibangun oleh Tim KKN-PPM UGM Melukis Sambelia.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom design tokens
- **CMS:** Decap CMS (formerly Netlify CMS) — content managed via `/admin`
- **Validation:** Zod schemas for all content frontmatter
- **Maps:** Google Maps embed (no API key) + GIS manifest
- **Charts:** Recharts (air-tanah TMA/DHL data)
- **Animations:** Framer Motion
- **Deploy:** Vercel

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run cms          # Start Decap CMS local proxy (separate terminal)
npm run build        # Production build (includes GIS manifest + image checks)
npm run test         # Run unit tests (Vitest)
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run validate     # Validate content frontmatter
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (nav, footer, fonts)
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── changelog/          # Git-log changelog
│   ├── pariwisata/         # Tourism pages
│   ├── irigasi/            # Irrigation pages
│   ├── kesehatan/          # Health pages
│   ├── umkm/               # UMKM pages
│   ├── festival/           # Festival pages
│   ├── kegiatan/           # Activities pages
│   ├── peta/               # Interactive map page + PetaClient
│   ├── lingkungan/         # Environment pages
│   ├── air-tanah/          # Groundwater pages
│   ├── tentang-sambelia/   # About page
│   └── api/auth/           # Decap CMS OAuth endpoint
├── components/             # React components
│   ├── Nav.tsx             # Navigation
│   ├── Footer.tsx          # Footer
│   ├── DataCard.tsx        # Content card
│   ├── DetailModal*.tsx    # Map detail modal
│   ├── PageHero.tsx        # Page hero banner
│   ├── EmptyState.tsx      # Empty state message
│   └── ui/                 # Radix UI primitives
├── content/                # Markdown/MDX content (CMS-managed)
│   ├── _settings.md        # Site-wide settings
│   ├── _tentang.md         # About page prose
│   ├── _gismap.md          # GIS manifest metadata
│   ├── _gis_*.md           # GIS category metadata
│   ├── changelog.json      # Auto-generated git log
│   ├── pariwisata/         # Tourism entries (.mdx)
│   ├── irigasi/            # Irrigation entries (.md)
│   ├── kesehatan/          # Health entries (.md)
│   ├── umkm/               # UMKM entries (.md)
│   ├── festival/           # Festival entries (.md)
│   ├── kegiatan/           # Activity entries (.mdx)
│   ├── lingkungan/         # Environment entries (.md)
│   ├── desa/               # Village entries (.md)
│   └── air-tanah/          # Groundwater data (.md)
├── lib/                    # Core logic
│   ├── config.ts           # SITE_URL, REVALIDATE_SECONDS, etc.
│   ├── schemas.ts          # Zod schemas for all content types
│   ├── content.ts           # getCollection(), getEntry()
│   ├── settings.ts         # getSettings(), getPageSettings(), etc.
│   ├── map.ts              # Map marker aggregation
│   ├── map-types.ts        # MapLayer, MapMarker types
│   ├── gis-manifest.ts     # GIS file manifest reader
│   ├── jsonld.ts           # JSON-LD structured data
│   ├── links.ts            # URL helpers (petaLink)
│   └── utils.ts            # Tailwind merge utility
├── public/
│   ├── admin/config.yml    # Decap CMS configuration
│   ├── gis/                # GIS map files (GeoJSON, images, PDF)
│   ├── images/             # Static images
│   └── fonts/              # Custom fonts
├── scripts/
│   ├── build-gis-manifest.mjs  # Generate GIS manifest
│   ├── generate-changelog.mjs  # Generate changelog from git log
│   ├── generate-og.mjs          # Generate OG images
│   ├── check-images.mjs        # Verify image references
│   ├── import-xlsx.mjs         # Import Excel data
│   ├── make-placeholder.mjs    # Generate placeholder images
│   └── validate-content.mjs    # Validate frontmatter schemas
├── tests/                  # Vitest unit tests + Playwright e2e
└── docs/                   # Documentation
```

## Content Collections

| Collection | Folder | Format | CMS Editable |
|---|---|---|---|
| Pariwisata | `content/pariwisata/` | `.mdx` | Yes |
| Irigasi | `content/irigasi/` | `.md` | Yes |
| Kesehatan | `content/kesehatan/` | `.md` | Yes |
| UMKM | `content/umkm/` | `.md` | Yes |
| Festival | `content/festival/` | `.md` | Yes |
| Kegiatan | `content/kegiatan/` | `.mdx` | Yes |
| Lingkungan | `content/lingkungan/` | `.md` | Yes |
| Desa | `content/desa/` | `.md` | Yes |
| Air & Tanah | `content/air-tanah/` | `.md` | Yes (single file) |
| Settings | `content/_settings.md` | `.md` | Yes |
| Tentang | `content/_tentang.md` | `.md` | Yes |

Each entry has frontmatter validated by Zod schemas in `lib/schemas.ts`. Common fields include `order` (sort order) and `googleMapsUrl` (for map locations) on geospatial collections.

## CMS Access

- **Local:** Run `npm run dev` + `npm run cms`, then visit `http://localhost:3000/admin`
- **Production:** Visit `https://melukis-sambelia.vercel.app/admin` and login with GitHub

See [docs/CMS_GUIDE_NON_TECHNICAL.md](docs/CMS_GUIDE_NON_TECHNICAL.md) for a step-by-step guide for non-technical collaborators.

## Documentation

| Document | Description |
|---|---|
| [CONTENT_ADMIN_GUIDE.md](docs/CONTENT_ADMIN_GUIDE.md) | Complete field-by-field reference for all CMS collections and settings |
| [OPERATIONS_GUIDE.md](docs/OPERATIONS_GUIDE.md) | Daily operations: running locally, editing content, deploying, troubleshooting |
| [CMS_GUIDE_NON_TECHNICAL.md](docs/CMS_GUIDE_NON_TECHNICAL.md) | Step-by-step CMS guide for non-IT collaborators |
| [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | Technical guide for content contribution (frontmatter, GIS, verification) |
| [deploy-guide.md](docs/deploy-guide.md) | Step-by-step Vercel deployment and OAuth setup |
| [decap-oauth-setup.md](docs/decap-oauth-setup.md) | GitHub OAuth setup for Decap CMS |

## Configuration

- `lib/config.ts` — `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `REVALIDATE_SECONDS`
- `public/admin/config.yml` — Decap CMS collections and fields
- `content/_settings.md` — All site content text (hero, stats, page headers, empty states, footer)
- Environment variables: `NEXT_PUBLIC_SITE_URL` (overrides default URL), `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`

## License

© 2026 KKN-PPM UGM Melukis Sambelia