# Melukis Sambelia — Design Spec

**Date:** 2026-06-20
**Status:** Approved
**Project:** Melukis Sambelia — KKN-PPM UGM profile + data website

## 1. Overview

Profile + informative website for **Melukis Sambelia**, the KKN-PPM UGM team in Kecamatan Sambelia, Kabupaten Lombok Timur, NTB. The site documents the team's community empowerment work (sustainable tourism, agropolitan development) and serves as a living data archive for irrigation, health, tourism potential, and the Festival Pesona Sambelia — editable by non-technical team members via Decap CMS.

Melukis Sambelia is a gerakan pengabdian masyarakat / program KKN-PPM UGM focusing on sustainable tourism empowerment and agropolitan development in Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat. The program promotes local Sasak traditions. Key activities:

- **Festival Pesona Sambelia** — features local culture: Peresean, Pawai Dulangan, Gendang Beleq.
- **Pengembangan Desa Wisata** — focused on Desa Sugian and Desa Labuhan Pandan, advancing destinations such as Pantai Berandangan and Taman Wisata Air Kramat Suci.

**Goals**
- Profile the team and program (KKN-PPM UGM precedent format, like biakelok / cakrawalarote / lembaran-bayan / karimunkemujan).
- Surface structured data: irigasi, kesehatan, pariwisata, festival, kegiatan, umkm, mitra, cerita.
- Interactive peta with Decap-driven markers + a slot for the team's GIS output.
- Fully static, free hosting, Git-based editing.

**Non-goals (v1)**
- English / i18n. Structure folders so EN can be added later without rework, but ship ID-only.
- User accounts beyond Decap editors.
- Backend / database — content lives in Git.
- Real-time data or live feeds.

## 2. Stack

- **Next.js 14** App Router, `output: 'export'` (static). TypeScript strict.
- **shadcn/ui** (Radix + Tailwind) for interactive primitives — Tabs, Accordion, Dialog, Card, Sheet, Tooltip, Sonner (toasts). Fully themeable; no framework lock-in.
- **Tailwind CSS v3** with CSS variables for the palette (mapped from the team's 15-color system).
- **react-leaflet** + OpenStreetMap tiles for the interactive map. Marker data sourced from content collections.
- **Decap CMS** at `/admin`, GitHub-backend, commits to repo, Vercel auto-deploys. GitHub OAuth via Vercel serverless proxy (production).
- **MDX** for rich content (cerita, festival pages); plain Markdown + frontmatter for data collections.
- **zod** schemas validate frontmatter at build time.
- **Fonts:** Gontserrat (headings, UI, body — `next/font/local`, files in `assets/typefaces/gontserrat/`) and Beautique Display (decorative display — `next/font/local`, files in `assets/typefaces/beautique-display/`, includes Regular/Medium/Bold/Black + italics + Condensed variants). Both self-hosted, `display: swap`.
- **Deploy:** Vercel, GitHub-connected. `melukis-sambelia.vercel.app` or custom domain.

## 3. Visual Language

### Palette (team-provided 15 colors, mapped to semantic roles)

CSS variables in `:root`, surfaced as Tailwind tokens (`bg-brand`, `text-water`, etc.).

**Water / coast / interactive — blue family** (irigasi, peta, links, primary actions)
- `--water-50: #B3E7FB` — soft fills, hover bg
- `--water-500: #14A8E1` — secondary accent, info chips
- `--water-900: #0873B9` — primary buttons, nav active, link underline

**Agriculture / health / nature — green family** (irigasi, kesehatan, desa wisata)
- `--green-50: #DEF6AE` — soft fills
- `--green-500: #99BA57` — accent, status-aktif
- `--green-900: #667F37` — section headers for agri/health

**Sand / festival warmth — gold family** (festival, umkm, cards, page bg tint)
- `--gold-100: #FFDFC0` — card backgrounds
- `--gold-50: #FFE09A` — soft fills, highlights
- `--gold-500: #F0AC6D` — secondary accent, dividers
- `--tan-700: #AF7E4F` — borders, muted text on light

**Culture / Sasak identity — terracotta family** (brand, festival, Peresean / Gendang Beleq)
- `--terracotta-500: #E3795C` — brand primary, festival accent, hero gradient
- `--brown-900: #742D1B` — footer, deep section dividers, display text on light

**Neutrals**
- `--white: #FFFFFF`, `--ink: #000000`
- **Page background: `#FFFCF7`** (warm off-white blend of white + gold-100).

**Status colors (kegiatan)**
- `--status-aktif: #99BA57` (green-500)
- `--status-berkembang: #F0AC6D` (gold-500)
- `--status-persiapan: #6B7280` (slate, neutral — not from team palette)

### Typography
- **Gontserrat** — headings (700/800/Black), UI labels, nav, buttons, body text. Used throughout for all non-decorative text.
- **Beautique Display** — hero wordmark, festival section display, page titles on culture-heavy pages. Decorative serif, used sparingly. Condensed variant available for tight hero layouts.

Both loaded via `next/font/local` from `assets/typefaces/`. Weights subsetted to what's used to keep bundle small.

### Decoration & assets (from `assets/`)
- `color_logo_sambel.svg` — primary logo in nav + footer.
- `bw_logo_sambel.svg` — monochrome variant for dark sections / footer.
- `batik_sambel.svg`, `bunga_sambel.svg`, `cincin_sambel.svg` — Sasak motifs, used as: section dividers, card-corner ornaments, hero overlay, peta panel background watermark.
- `logo_kkn_ugm.svg`, `logo_ugm_text.svg` — used in footer + beranda crediting.

### Layout
- Max content width 1200px; full-bleed heroes / section dividers.
- Section headers: kicker (e.g. `01 — IRIGASI`) in Gontserrat uppercase tracked + Gontserrat bold title + optional intro paragraph.
- Cards: `rounded-2xl`, soft shadow, `gold-100` or white bg, `tan-700` hairline borders.
- Mobile-first; all references read well on mobile.

### Reusable components (in `components/`)
- `StatCard` — label + big number + unit.
- `DataCard` — image + title + meta chips + desc + "Pelajari" link. Reused across pariwisata / irigasi / kesehatan / umkm.
- `StatusBadge` — Aktif / Berkembang / Persiapan.
- `SectionHeader` — kicker + title + intro.
- `GalleryStrip` — horizontal-scroll photo strip.
- `MotifDivider` — SVG ornament divider (uses `batik_sambel` / `cincin_sambel`).
- `MapPanel` — the dual Leaflet / GIS tabbed view.
- `Logo` — color / BW variants via prop.

## 4. Information Architecture

```
/ (Beranda)
/profil-tim
/peta                      ← dual map (Leaflet + GIS slot)
/pariwisata
  /pariwisata/[slug]        ← per-destinasi detail
/irigasi
/kesehatan
/festival
/kegiatan
/cerita
  /cerita/[slug]
/umkm
/mitra
/admin                     ← Decap CMS
```

Nav (desktop): Beranda · Profil Tim · Peta · Pariwisata · Irigasi · Kesehatan · Festival · Cerita. (Kegiatan / UMKM / Mitra reachable from footer + beranda section cards — keeps nav uncluttered.)

## 5. Content Model (Decap collections)

All in `content/<collection>/*.md(x)` with YAML frontmatter. Decap `config.yml` mirrors these.

**tim** — `name`, `role` (free text, e.g. "Ketua Pelaksana", "Anggota Divisi Media"), `division` (enum: Koor / Pariwisata / Irigasi / Kesehatan / Publikasi / Media / Dana / Logistik), `photo`, `bio`, `instagram`, `order` (integer, sort weight).

**pariwisata** — `title`, `category` (enum: Pantai / Budaya / Desa Wisata / Air / Trekking), `village` (enum: Sugian / Labuhan Pandan / lainnya), `cover`, `gallery[]`, `shortDesc`, `body` (MDX), `lat`, `lng`, `facilities[]`, `accessNotes`. *Marker auto-appears on peta.*

**irigasi** — `name`, `saluranType` (enum: Primer / Sekunder / Tersier), `village`, `condition` (enum: Baik / Rusak Ringan / Rusak Berat), `lengthM`, `flowStatus` (enum: Mengalir / Kering / Mengalir Sebagian), `cover`, `body`, `lat`, `lng`. *Marker auto-appears on peta (irigasi layer).*

**kesehatan** — `facilityName`, `type` (enum: Posyandu / Puskesmas / Bidan / Polides), `village`, `cadresCount`, `stuntingProgram` (boolean), `cover`, `body`, `lat`, `lng`. *Marker auto-appears on peta (kesehatan layer).*

**festival** — `eventName` (Peresean / Pawai Dulangan / Gendang Beleq / lainnya), `schedule` (datetime), `venue`, `description`, `cover`, `registrationUrl` (optional), `body`. Single-page festival aggregates these.

**kegiatan** — `title`, `status` (enum: Aktif / Berkembang / Persiapan), `category` (enum: Ekowisata / Irigasi / Kesehatan / Pariwisata / Ekonomi), `cover`, `summary`, `body`, `milestones[]` (each milestone = `{ date: datetime, label: string, done: boolean }`).

**cerita** — `title`, `author` (ref tim — Decap `relation` widget to `tim.name`, stored as the name string; resolved to a member at build for the bio card), `date`, `cover`, `excerpt`, `body` (MDX, supports embeds).

**umkm** — `name`, `owner`, `product` (enum: Kerajinan / Kuliner / Pertanian / Anyaman / lainnya), `village`, `contact`, `cover`, `gallery[]`, `body`, `lat`, `lng`. *Optional peta marker.*

**mitra** — `name`, `logo`, `url`, `tier` (enum: Utama / Pendukung / Media), `order`.

**Site config** (`content/_settings.md`): hero image, hero tagline, stats (`{ luas: string, penduduk: string, desaBinaan: string, tahunProgram: string }`), festival dates, social links (instagram, tiktok, etc.), contact (email, phone, address). Edited via Decap "Settings" collection.

**GIS map** (`content/_gismap.md` singleton): Decap-editable metadata (title, description, credit). The actual data files live in `public/gis/`: the peta GIS tab auto-detects and renders both any `*.geojson` files (as Leaflet overlay layers) and any image / PDF at `public/gis/map.{png,webp,pdf}` (as displayed media). Editors upload files via Decap media library or drop them in `public/gis/` directly. If both GeoJSON and image exist, show both with a sub-toggle.

## 6. Page Specifications

### Beranda (`/`)
1. **Hero** — full-bleed Sambelia coast placeholder, dark gradient, `color_logo_sambel` + "Melukis Sambelia" in Beautique Display, tagline (from site config), CTA buttons ("Jelajahi Peta" → `/peta`, "Festival Pesona" → `/festival`).
2. **Tentang Sambelia** — kicker `01`, stat grid (Luas / Penduduk / Desa Binaan / Tahun Program), short intro paragraph.
3. **Section previews** — 6 DataCards linking to Pariwisata / Irigasi / Kesehatan / Festival / Kegiatan / UMKM, each with a representative placeholder image + 1-line teaser.
4. **Peta teaser** — embedded small Leaflet preview (Sambelia center, all layers) + "Buka Peta" → `/peta`.
5. **Mitra strip** — utama-tier logos.
6. **Footer** — `bw_logo_sambel`, KKN-PPM UGM credit, social links (Instagram @melukis.sambelia), nav sitemap.

### Profil Tim (`/profil-tim`)
- Hero with team group photo placeholder.
- Grid of member cards (DataCard variant): photo, name, role chip, division chip, hover-reveal bio snippet, Instagram link.
- Filter by division (shadcn Tabs or Select).

### Peta (`/peta`) — dual map
- `SectionHeader` `02 — PETA SAMBELIA`.
- shadcn Tabs: **"Peta Interaktif"** | **"Peta GIS Tim"**.
- **Tab 1 (Interaktif):** full-height `react-leaflet` map, center Sambelia `[ -8.36, 116.85 ]` zoom 12, OSM tiles. Layer toggle (shadcn checkbox group) for: Pariwisata / Irigasi / Kesehatan / UMKM. Markers from content collections, colored by layer (pariwisata=water-500, irigasi=green-500, kesehatan=green-900, umkm=gold-500). Click marker → popup with card + "Lihat detail" link. Legend panel.
- **Tab 2 (GIS Tim):** flexible slot. v1 renders any GeoJSON file dropped in `public/gis/*.geojson` as a Leaflet layer (auto-detect) *and* renders any image / PDF placed at `public/gis/map.{png,webp,pdf}`. If both exist, show both with a sub-toggle. Editors swap via Decap "GIS Map" singleton. *This adapts to whatever the GIS team exports — they will support both.*
- Below map: short explainer of how the two maps relate + credit.

### Pariwisata (`/pariwisata` + `/pariwisata/[slug]`)
- Index: filter chips by category + village, grid of DataCards.
- Detail: cover hero, title (Beautique), meta chips (village / category / facilities), MDX body, gallery strip, embedded single-marker Leaflet mini-map, "Kembali" + related cards.

### Irigasi (`/irigasi`)
- Stat strip (total saluran / total length / condition breakdown).
- Table-or-cards view toggle (shadcn Tabs). Cards show cover, name, type chip, condition badge, flow status, village. Click → expandable detail (shadcn Accordion) or modal (shadcn Dialog) with body + map pin.

### Kesehatan (`/kesehatan`)
- Stat strip (posyandu count / puskesmas count / cadres total / stunting-program coverage).
- Cards per facility. Stunting-program highlight section (cards flagged).
- Mini-map of facilities.

### Festival (`/festival`)
- Hero with `batik_sambel` overlay, terracotta gradient, "Festival Pesona Sambelia" in Beautique.
- Schedule timeline (shadcn timeline / ordered list) of festival events.
- Per-event cards: Peresean, Pawai Dulangan, Gendang Beleq — each with cover, description, schedule, venue, registration CTA if present.
- Gallery strip placeholder.

### Kegiatan (`/kegiatan`)
- Roadmap-style section (like Cakrawala roadmap): horizontal / vertical timeline of program milestones.
- Cards with StatusBadge (Aktif / Berkembang / Persiapan), category chip, cover, summary, expandable body.

### Cerita (`/cerita` + `/cerita/[slug]`)
- Blog index: cards with cover, title, author, date, excerpt.
- Detail: article layout (prose Tailwind typography), author bio card, cover, MDX body, related stories.

### UMKM (`/umkm`)
- Grid of business cards: logo / cover, name, owner, product chip, village, contact button (WhatsApp / IG).
- Filter by product type.

### Mitra (`/mitra`)
- Tiered logo grid (Utama / Pendukung / Media). Click → external link.

### Admin (`/admin`)
- Decap CMS. Login via GitHub OAuth (via Vercel serverless proxy for production). Branch `main`. Collections mirror content model above. Media folder `public/images`.

## 7. Decap CMS Configuration

- Backend: `github` with OAuth via Vercel serverless proxy (`decap-proxy` or equivalent). Branch `main`.
- `media_folder: "public/images"`, `public_folder: "/images"`.
- One collection per content type, listed in §5. Widgets: `image` (with media library), `list`, `object`, `select`, `datetime`, `markdown`, `mdx` (via `decap-cms-mdx` widget — verify availability; fallback plain markdown for MDX-capable collections).
- "Settings" singleton for site-wide config (hero, stats, socials, contact).
- "GIS Map" singleton for swapping the GIS tab's data.

## 8. Error Handling & Edge States

- Empty collection → friendly "Belum ada data. Tim akan menambahkan segera." with motif divider (not a 404).
- Missing image → placeholder motif (`bunga_sambel` tinted).
- Invalid frontmatter → build fails with clear zod error pointing to file / field.
- Map with zero markers in a layer → "Lapisan ini belum memiliki titik." message inside the map panel.
- 404 → custom page with `bw_logo_sambel` + motif + "Kembali ke beranda".

## 9. Testing

- **Build:** `npm run build` must pass (static export). CI on Vercel.
- **Lint:** `next lint`, TypeScript strict `tsc --noEmit`.
- **Unit (vitest):** content loaders (`lib/content.ts`) return validated typed arrays; map aggregator (`lib/map.ts`) merges layers correctly; zod schemas reject bad frontmatter.
- **E2E (Playwright):** smoke test — load beranda, navigate to each section, open peta, toggle layers, click a marker, open admin (login gate). Run on PR.
- **Visual:** screenshot beranda + peta on mobile / desktop in CI (Playwright).

## 10. Accessibility

- shadcn / Radix primitives are ARIA-compliant by default.
- Color contrast: verify all text-on-color combos meet WCAG AA (terracotta-on-cream, brown-on-gold, etc.).
- Map: keyboard-focusable markers (Leaflet default), screen-reader-friendly popup content.
- Images: `alt` from frontmatter `shortDesc` or explicit `alt` field.

## 11. Performance

- Static export → CDN-served, fast.
- `next/image` with `unoptimized` (static export) + AVIF / WebP source assets committed to `public/images`. Editors upload via Decap; admin README documents recommended sizes.
- Leaflet loaded only on `/peta` + pages with mini-maps (dynamic import, no SSR).
- Fonts: `next/font/local` self-hosted, `display: swap`.
- Target: Lighthouse 90+ on all metrics for beranda.

## 12. SEO & Metadata

- `app/layout.tsx` exports `metadata` + `viewport` (Next.js metadata API).
- Favicon + OG image derived from `color_logo_sambel.svg` + hero placeholder.
- `robots.txt` + `sitemap.xml` generated via Next.js metadata route handlers.
- Theme-color meta: `--water-900` (#0873B9) for browser chrome.

## 13. Analytics

- **Vercel Analytics** (free, privacy-friendly, no consent banner needed) enabled on all pages.

## 14. Out of Scope / Future

- EN locale (folder structure prepared).
- Search across cerita / pariwisata (Pagefind can be added later).
- PWA / offline.
- Form submissions (festival registration currently external link).

## 15. Open Items — Resolved

1. **Fonts** — Gontserrat + Beautique Display present locally in `assets/typefaces/`; wired via `next/font/local`.
2. **Page background** — `#FFFCF7` (warm off-white).
3. **Body font** — Gontserrat throughout (no Inter).
4. **GIS export** — team will support both GeoJSON and image / PDF; dual-map Tab 2 auto-renders both if present.
5. **Decap auth** — GitHub OAuth via Vercel serverless proxy.