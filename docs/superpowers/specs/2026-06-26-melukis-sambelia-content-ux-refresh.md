# Melukis Sambelia Content & UX Refresh

## Status

Design approved. Ready for implementation plan.

## Goal

Transform the existing Next.js static site for KKN-PPM UGM Melukis Sambelia into a content-rich, cross-linked community portal that surfaces real data from the six team divisions, supports quick-detail popups, fixes runtime errors, and lays the foundation for a future data hub.

## Context

The site is a Next.js 14 App Router project with `output: 'export'` and `images.unoptimized`. Content is stored as Markdown/MDX frontmatter files in `content/` and consumed via `getCollection()` / `getEntry()`. Maps use `react-leaflet`. The current site has pages for Beranda, Tentang Sambelia, Pariwisata, Irigasi, Kesehatan, UMKM, Kegiatan, Festival, Mitra, Cerita, and Peta.

## Owner Data Mapping

| Owner | Data | Existing Page | New Location |
|---|---|---|---|
| Bima | Geotagging wisata lokal | Pariwisata, Peta | Pariwisata detail + Peta Interaktif marker |
| Sekar | Data kesehatan (puskesmas, posyandu, kader) | Kesehatan | Kesehatan listing + Peta Interaktif marker |
| Dwin | Data kualitas air, TMA, peta iso-DHL, peta TMA | - | New tab inside Peta: **Air & TMA** |
| Alex | Peta irigasi, titik rawan kekeringan (jpg/pdf) | Irigasi | New tab inside Peta: **Irigasi & Kekeringan** |
| Den Bagus | Peta indeks vegetasi, kerawanan erosi, blue carbon (GIS) | Peta GIS | New tab inside Peta: **Vegetasi, Erosi & Blue Carbon** |
| Muadz | Promosi UMKM peyek mangrove | UMKM | UMKM listing + Peta Interaktif marker |

## Functional Requirements

### 1. Popup / Detail Modal System

- Add a reusable `DetailModal` component using Radix Dialog.
- On listing pages, each card supports two actions:
  1. Primary click opens the existing detail page.
  2. A visible "Lihat detail" action opens a modal with: cover image, chips, short description, rendered body prose, optional mini-map, and a link to the full detail page.
- Modal must be accessible (focus trap, ESC close, aria attributes) and mobile-friendly.
- On pages without detail pages (e.g., future Kualitas Air maps), the modal becomes the primary interaction.

### 2. Cross-Linking Between Pages

- Pariwisata detail pages link to the Peta page filtered to the matching marker/layer.
- UMKM cards link to the Peta page centered on the item location when coordinates are present.
- Irigasi accordion items link to Peta tab "Irigasi & Kekeringan".
- Kesehatan cards link to Peta tab "Interaktif" filtered to health markers.
- Kegiatan cards link to related content pages (e.g., Ekowisata → Pariwisata, Irigasi program → Irigasi).
- Peta Interaktif popups link to detail pages where available.

### 3. Peta Page Reorganization

The Peta page becomes a tabbed interface:

1. **Interaktif** — existing Leaflet map with pariwisata, irigasi, kesehatan, UMKM markers.
2. **GIS Tim** — existing manifest-based viewer for GeoJSON / image / PDF files.
3. **Air & TMA** — grid of downloadable/viewable assets for kualitas air, iso-DHL, TMA.
4. **Irigasi & Kekeringan** — grid of irigasi maps and titik rawan kekeringan assets.
5. **Vegetasi, Erosi & Blue Carbon** — grid of vegetasi, erosi, blue carbon assets.

Each thematic tab reads a grouped manifest of `public/gis/` files. Assets may be images (jpg/png/webp) or PDF; no conversion required. Leaflet only renders GeoJSON; image/PDF are shown inline or in an iframe.

### 4. Image & Description Cleanup

- Replace `heroImage` in `content/_settings.md` with a real nature photo from `assets/images/nature/`.
- Replace content cover images that currently use SVG placeholders with real photos or relevant assets where available.
- Rewrite content frontmatter and body text to remove placeholder language such as `±X km²`, `TBD 2026`, `*Catatan: Deskripsi ini adalah placeholder...*`.
- Add descriptive `alt` text throughout.

### 5. Leaflet Error Fix

- Fix dev-server 500 errors for `/pariwisata/marker-icon-2x.png` and `/pariwisata/marker-shadow.png` caused by Leaflet’s default icon URLs resolving to the current page path.
- Solution: explicitly configure `L.Icon.Default` to use static assets under `/images/design-system/` (existing custom icon) or remove default icon behavior entirely. No default PNGs should be requested from dynamic routes.

### 6. Lightweight SEO

- Add `generateMetadata` to each app page returning title, description, and Open Graph image `/og.png`.
- Keep `robots.ts` and `sitemap.ts`.
- Detail pages derive metadata from frontmatter.

## Non-Functional Requirements

- Keep build as static export (`output: 'export'`).
- Maintain existing lint, typecheck, and test passes.
- Prefer minimal, focused components; avoid large files.
- Add a `docs/CONTENT_GUIDE.md` explaining how team members add new content to the site.

## Future Path to Approach C

- Introduce a `/data` hub page grouping all thematic sections.
- Promote Air & TMA and Vegetasi/Erosi/Blue Carbon into first-class detail pages.
- Add cross-collection search/filter.
- Add schema.org JSON-LD for organizations, places, and events.

## Open Questions Resolved

- GIS formats: PDF and image are acceptable; GeoJSON only if already available.
- Popups: hybrid modal + detail page.
- SEO: lightweight, not over-engineered.
- Scope: Approach B (current implementation), with architecture that supports Approach C later.
