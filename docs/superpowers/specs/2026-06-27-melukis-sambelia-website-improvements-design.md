# Melukis Sambelia Website Improvements Design

**Date:** 2026-06-27
**Status:** Draft — pending user review
**Project:** KKN-PPM UGM Melukis Sambelia village profile website
**Stack:** Next.js 14 (App Router, static export), TypeScript, Tailwind CSS, Framer Motion, Leaflet, Recharts, Decap CMS

---

## Problem Statement

The website was built as a KKN program site but is being reframed as a **village profile website** for Kecamatan Sambelia. This requires: removing KKN-centric sections, integrating interdisciplinary cluster data from 7 project clusters, restructuring the information architecture, and adding polish. The current site has 11 flat navbar items, placeholder social links, an empty GIS pipeline, unused Recharts dependency, and several sections (Kegiatan, Mitra, SponsorCta) that don't belong in a village profile.

---

## Design Decisions

### D1. Information Architecture: Umbrella Grouping

**Decision:** Reduce 11 flat nav items to 5 visible items using dropdown groups.

| Position | Label | Type | Items |
|----------|-------|------|-------|
| 1 | **Profil** | dropdown | Tentang Sambelia, Cerita |
| 2 | **Peta** | top-level | — |
| 3 | **Data & Analisis** | dropdown | Pariwisata, Irigasi, Kesehatan, Air & Tanah, Lingkungan |
| 4 | **UMKM** | top-level | — |
| 5 | **Festival** | top-level | — |

**Rationale:** 11 flat items overwhelm navigation. Umbrella grouping reflects the content structure — narrative identity (Profil), central artifact (Peta), cluster data (Data & Analisis), economic life (UMKM), and special event (Festival). Festival gets top-level prominence as a special event, not buried in a group. UMKM stands alone as the economic anchor since "Ekonomi" with one item isn't worth a dropdown.

**Footer:** mirrors navbar with a lighter subset: Profil (Tentang, Cerita), Peta, Data & Analisis (Pariwisata, Irigasi, Kesehatan, Air & Tanah, Lingkungan), UMKM, Festival. All sections present but in grouped layout for scannability.

**Navbar UX:** Desktop uses hover-triggered dropdown menus (Framer Motion). Mobile uses accordion-style expand/collapse. The current flat list in `Nav.tsx` is replaced with a grouped structure.

### D2. Geotagging & Map Integration: Keep Separate Collections

**Decision:** Option B — keep separate content collections (pariwisata, irigasi, kesehatan, umkm), add `lat`/`lng` as required fields to UMKM schema (currently optional), add `kategori` enum to UMKM schema.

**UMKM `kategori` values:** `Kuliner | Jasa | Kerajinan | Pertanian | Perikanan | Lainnya`

**Migration:** Existing `product` field values map to `kategori`: `Anyaman` → `Kerajinan`, `Kuliner` → `Kuliner`, `Pertanian` → `Pertanian`, `lainnya` → `Lainnya`. The `product` field is replaced by `kategori` in the schema, CMS config, and all UMKM pages. The entry `content/umkm/kerajinan-anyaman.md` is renamed or updated.

**Map integration:** `lib/map.ts` already aggregates pariwisata, irigasi, kesehatan, and conditionally includes umkm markers (lines 25-30). Making `lat`/`lng` required on UMKM entries means all UMKM entries appear on the interactive map as a new `umkm` layer with its own color in `lib/map-types.ts`.

**UMKM page:** gets a category filter (chip/pill UI) using the `kategori` field, so visitors can filter by Kuliner, Jasa, etc.

### D3. Air & Tanah Section (New)

**Route:** `/air-tanah`
**Navbar group:** Data & Analisis
**Cluster:** Groundwater / Water Quality

**Content:**
- Intro section with cluster description
- Tabular TMA (Tinggi Muka Airtanah) measurements displayed as a data table
- Bar chart visualization of TMA data using Recharts (currently installed but unused)
- Cross-link to `/peta?tab=air` for iso-DHL and groundwater-level GIS maps
- Placeholder state when no data is available yet ("Data dari cluster akan diunggah")

**Data pipeline:**
1. Editor uploads XLSX/CSV file via Decap CMS media library (dedicated "Air & Tanah" collection)
2. File is committed to `data/` in the repo
3. Build script (`scripts/import-air-tanah.mjs`, extending existing `import-xlsx.mjs` pattern) converts XLSX → `public/data/air-tanah.json`
4. `/air-tanah` page reads JSON at build time and renders table + Recharts bar chart
5. Decap CMS commit triggers Vercel rebuild → chart updates

**Content schema (`lib/schemas.ts`):**
```typescript
export const airTanahSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
})
```

**TMA data JSON structure (`public/data/air-tanah.json`):**
```typescript
type TmaMeasurement = {
  location: string   // e.g. "Sumur Pantai Berandangan"
  date: string       // e.g. "2026-01" or "Jan 2026"
  tmaMeters: number  // groundwater level in meters
  dhlMsiemens: number // specific electrical conductivity (DHL) in mS/cm
}

type AirTanahData = {
  title: string
  description: string
  credit: string
  measurements: TmaMeasurement[]
}
```

The build script (`scripts/import-air-tanah.mjs`) reads the XLSX/CSV and outputs this JSON structure. The `/air-tanah` page reads the JSON at build time and renders: a summary table of measurements, a Recharts bar chart of TMA values by location, and a cross-link to the GIS map tab.

**New CMS collection:** "Air & Tanah" with fields for title, description, credit, and a file widget for the TMA data upload. The CMS collection manages the metadata markdown file; the actual tabular data lives in the JSON artifact from the build script.

### D4. Lingkungan Section (New)

**Route:** `/lingkungan`
**Navbar group:** Data & Analisis
**Cluster:** Environmental (vegetation index, erosion susceptibility, blue carbon)

**Content:**
- Intro section with cluster description
- Thumbnail gallery of GIS map previews (vegetation index, erosion, blue carbon)
- Each thumbnail deep-links to `/peta?tab=vegetasi` for the full interactive map
- Placeholder state when no GIS files are available yet

**Data source:** `public/gis/manifest.json` (already has `vegetasi` category, currently empty). The GIS pipeline is fully built — cluster delivers GeoJSON/images/PDFs to `public/gis/vegetasi/`, the build script updates the manifest, and `GisMap.tsx` renders them on the map page.

**No new content schema needed** — the existing `gisMapSchema` and `GisFile` type handle this. The `/lingkungan` page reads `public/gis/manifest.json` and filters for `category: 'vegetasi'` files to build the gallery.

### D5. Removals

The following are KKN-program-centric and don't belong in a village profile:

| Remove | Files/locations | Notes |
|--------|----------------|-------|
| `/kegiatan` (Program Unggulan) | `app/kegiatan/`, `content/kegiatan/`, `kegiatanSchema`, CMS "Kegiatan" collection, nav link, footer link, all cross-links, `content/_settings.md` if referenced | Entire section gone |
| `/mitra` (Partners/Sponsors) | `app/mitra/`, `content/mitra/` (11 entries), `mitraSchema`, CMS "Mitra" collection, nav link, footer link, `MitraGrid.tsx` | Confirmed: KKN sponsors, not village stakeholders |
| `SponsorCta` ("Dukung Kami") | `components/SponsorCta.tsx`, homepage usage at `app/page.tsx:92`, `app/page.tsx:11` | Fundraising CTA, not village profile |
| `timSchema` + `content/tim/` | CMS "Tim" collection, `timSchema` in `schemas.ts` | KKN team roster, not village content |
| Favicon (Vercel default) | `app/favicon.ico` | Replace with the village logo (`color_logo_sambel.svg` → converted to `.ico`) |

**Homepage impact:** After removals, the homepage sections become:
1. Hero (keep, fix crop)
2. "01 — TENTANG" stats (keep)
3. "02 — JEJAKI" preview cards → **7 cards** (Pariwisata, Irigasi, Kesehatan, Air & Tanah, Lingkungan, UMKM, Festival)
4. Kilas Sambelia gallery (keep, fix empty-gallery bug)
5. ~~SponsorCta~~ → removed
6. ~~"04 — MITRA"~~ → removed

**Sitemap update:** `app/sitemap.ts` static routes must remove `/kegiatan` and `/mitra`, add `/air-tanah` and `/lingkungan`.

**Cross-reference cleanup:** Any links to `/kegiatan`, `/mitra`, or SponsorCta across all components, pages, and content files must be removed.

### D6. Real Social Links

**Decision:** Update `content/_settings.md` socials with real handles.

```yaml
socials:
  instagram: melukis.sambelia
  tiktok: melukis.sambelia
```

These are already `melukis.sambelia` — verify these are the correct real handles (not placeholder). The user confirmed `@melukis.sambelia` for both platforms.

### D7. Hero Image Crop Fix

**Problem:** The hero image is too zoomed in, not showing the boat and beach.

**Solution:** In `components/HeroAnimation.tsx`, adjust the background image `object-position` from its current default (center) to a custom position that reveals the beach/boat area. This is a CSS `object-position` or `background-position` change — not an animation change. The Framer Motion zoom animation (1.08→1) may also be reduced to 1.04→1 or removed if the static crop alone solves the problem.

**Also review:** the hero image path (`heroImage` in `_settings.md`) to confirm it's the best available photo for showing Sambelia's coastline.

### D8. Kilas Sambelia Gallery Bug Fix

**Problem:** `KilasSambelia.tsx` renders `null` because all `gallery` fields in content entries are empty arrays (`[]`). The component returns nothing when `items.length === 0`.

**Solution:** Add a fallback path. When galleries are empty, the component uses each entry's `cover` image instead. This makes the gallery work immediately with existing assets, and automatically becomes richer when clusters deliver gallery photos.

**Fallback logic:**
```typescript
const items = [
  ...pariwisata.flatMap((p) =>
    p.gallery.length > 0
      ? p.gallery.map((src) => ({ src, alt: p.title, href: `/pariwisata/${p.slug}` }))
      : [{ src: p.cover, alt: p.title, href: `/pariwisata/${p.slug}` }]
  ),
  ...umkm.flatMap((u) =>
    u.gallery.length > 0
      ? u.gallery.map((src) => ({ src, alt: u.name, href: `/umkm` }))
      : [{ src: u.cover, alt: u.name, href: `/umkm` }]
  ),
].filter(/* existing exclusions */)
```

### D9. Tentang Sambelia — "Fokus Program" → "Potensi Desa"

**Decision:** Reframe the "03 — PROGRAM / Fokus Program" section on `/tentang-sambelia` to "03 — POTENSI DESA / Potensi Desa". Keep the two-card layout but rewrite copy:

- "Pariwisata Berkelanjutan" → village-focused copy about Sambelia's tourism potential
- "Kawasan Agropolitan" → village-focused copy about agricultural potential

The section kicker changes from "PROGRAM" to "POTENSI DESA", and the intro text changes from program-focused to village-focused language.

### D10. Animation & Polish Pass

**Decision:** Targeted micro-interactions only, bounded scope. Not "more animation everywhere."

**Finite list of animation additions:**
1. **Hero parallax** — subtle scroll-driven parallax on the hero image (translateY-based, respects `prefers-reduced-motion`)
2. **Section-header reveal** — extend existing `FadeIn` usage to all section headers consistently
3. **Card hover micro-interaction refinement** — enhance existing `DataCard` transitions with subtle shadow+scale curve
4. **Map marker entrance animation** — staggered fade-in for Leaflet markers on initial load
5. **Page-transition fade** — subtle opacity transition on route changes (App Router)
6. **Festival countdown pulse** — gentle pulse animation on the countdown digits (existing `CountdownStrip`)

All animations respect `prefers-reduced-motion` (already wired via Framer Motion's `useReducedMotion`). Performance consideration: static export means all JS ships to client; keep animation bundle impact minimal by reusing Framer Motion (already in bundle).

### D11. Digitalization Cluster

**Decision:** No new page. Content folds into existing pages:
- "Digital village profile" content → `/tentang-sambelia` (Potensi Desa section or geography section)
- "Promotional materials for Sugian's local processed products" → `/umkm` (as UMKM entries with `kategori` filter)

### D12. CMS Configuration Updates

**Decap CMS (`public/admin/config.yml`) changes:**
- Remove collections: Kegiatan, Mitra, Tim
- Add collection: Air & Tanah (with dedicated file upload for TMA data)
- Update UMKM collection: replace `product` enum with `kategori` enum (`Kuliner | Jasa | Kerajinan | Pertanian | Perikanan | Lainnya`), make `lat`/`lng` required (not optional)
- Update Pariwisata, Irigasi, Kesehatan collections: no schema changes, but verify all fields still match
- Add Lingkungan section description to the GIS map settings if needed

---

## Phase Plan

### Phase 1: Quick Wins (no IA dependency)

These can be done independently and shipped immediately:

1. **Replace favicon** — `app/favicon.ico` → convert `color_logo_sambel.svg` to `.ico`
2. **Fix hero image crop** — adjust `object-position` in `HeroAnimation.tsx`
3. **Remove Kegiatan** — delete page, content, schema, CMS collection, cross-links
4. **Remove Mitra** — delete page, content, schema, CMS collection, cross-links
5. **Remove SponsorCta** — delete component + homepage usage
6. **Remove tim** — delete schema, content folder, CMS collection
7. **Update social links** — confirm `@melukis.sambelia` handles are correct, update `_settings.md`
8. **Fix Kilas Sambelia** — add cover-image fallback when galleries are empty
9. **Reframe "Fokus Program" → "Potensi Desa"** — update `/tentang-sambelia` copy
10. **Update sitemap** — remove deleted routes, add new routes

### Phase 2: IA & New Sections (structural changes)

1. **Restructure navbar** — implement 3-group + 2-top-level layout in `Nav.tsx` and `Footer.tsx`
2. **UMKM schema migration** — replace `product` with `kategori`, make `lat`/`lng` required, update CMS config, update UMKM pages with category filter
3. **Create `/air-tanah` page** — page component, content schema, Recharts bar chart, table view, cross-link to `/peta?tab=air`
4. **Create `/lingkungan` page** — page component, GIS manifest gallery, deep-links to `/peta?tab=vegetasi`
5. **Update homepage "Jejaki" grid** — 7 cards (replace Kegiatan with Air & Tanah, add Lingkungan, reorder)
6. **Add UMKM to map** — make `lat`/`lng` required in UMKM schema, add `umkm` layer color to `map-types.ts`
7. **Update Decap CMS config** — remove deleted collections, add Air & Tanah, update UMKM fields

### Phase 3: Data & Animation Polish

1. **TMA XLSX→JSON pipeline** — extend `scripts/import-xlsx.mjs` with `tma` sheet mapper, output `public/data/air-tanah.json`
2. **Populate GIS data** — coordinate with clusters to deliver GeoJSON/PDFs to `public/gis/` folders, run manifest builder
3. **Populate real content** — work with clusters to fill pariwisata, irigasi, kesehatan, umkm entries with real data and gallery images
4. **Animation polish pass** — implement the 6 bounded micro-interactions from D10
5. **Gallery image population** — as clusters deliver photos, populate `gallery` fields so Kilas Sambelia shows richer content

---

## File Impact Summary

### New Files
- `app/air-tanah/page.tsx` — Air & Tanah page
- `app/lingkungan/page.tsx` — Lingkungan page
- `lib/schemas.ts` — add `airTanahSchema`
- `scripts/import-air-tanah.mjs` — TMA data importer (or extend `import-xlsx.mjs`)

### Modified Files
- `app/page.tsx` — remove SponsorCta, remove Mitra section, update Jejaki grid to 7 cards, remove kegiatan import
- `app/layout.tsx` — update metadata description to village-profile framing
- `app/tentang-sambelia/page.tsx` — reframe "Fokus Program" → "Potensi Desa"
- `app/sitemap.ts` — remove /kegiatan, /mitra; add /air-tanah, /lingkungan
- `components/Nav.tsx` — restructure to grouped nav (3 groups + 2 top-level)
- `components/Footer.tsx` — mirror new nav structure, remove mitra links
- `components/HeroAnimation.tsx` — adjust object-position for hero crop
- `components/KilasSambelia.tsx` — add cover-image fallback when galleries are empty
- `components/Logo.tsx` — no changes needed (already used for navbar)
- `lib/schemas.ts` — add `airTanahSchema`, remove `kegiatanSchema`, `mitraSchema`, `timSchema`, update `umkmSchema` (replace `product` with `kategori`, make lat/lng required)
- `lib/content.ts` — remove kegiatan, mitra, tim collection handling (if any)
- `lib/map.ts` — update UMKM marker logic (lat/lng now required)
- `lib/map-types.ts` — add umkm layer color
- `public/admin/config.yml` — remove Kegiatan, Mitra, Tim collections; add Air & Tanah collection; update UMKM fields
- `content/_settings.md` — verify/update social handles
- `app/favicon.ico` — replace with logo

### Deleted Files
- `app/kegiatan/` (entire directory)
- `app/mitra/` (entire directory)
- `content/kegiatan/` (entire directory)
- `content/mitra/` (entire directory, 11 entries)
- `content/tim/` (entire directory, 4 entries)
- `components/SponsorCta.tsx`
- `components/MitraGrid.tsx` (only used by mitra page)

### Content Migrations
- `content/umkm/kerajinan-anyaman.md` — rename file to match new slug (e.g. `kerajinan-sambelia.md`), update `product: Anyaman` → `kategori: Kerajinan`, ensure `lat` and `lng` are present
- All UMKM entries — replace `product` field with `kategori`, add `lat`/`lng` values if missing
- All UMKM entries — add `kategori` based on existing `product` value mapping

---

## Open Items

1. **Confirm real Instagram/TikTok handles** — user said `@melukis.sambelia` for both; verify these URLs resolve (instagram.com/melukis.sambelia, tiktok.com/@melukis.sambelia)
2. **GIS data delivery** — groundwater and environment clusters have not yet delivered files. Pages ship with placeholder state until data arrives.
3. **TMA data availability** — no XLSX/CSV file exists yet. Air & Tanah page ships with placeholder/explanatory state until cluster delivers data.
4. **Gallery images** — pariwisata and umkm entries have empty galleries. Kilas Sambelia will show cover images as fallback until real gallery photos are provided.
5. **Hero image** — current image may need to be replaced or re-cropped. The crop adjustment should be tested visually to confirm the boat/beach is visible.