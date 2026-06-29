# Sambelia Kecamatan Portal Rebrand — Design Spec

**Date:** 2025-06-30
**Project:** Rebrand Melukis Sambelia (KKN team portal) → Sambelia (kecamatan portal)
**Approach:** B — Rebrand + Reframe (consistent kecamatan voice, no structural changes)

## Goal

Reposition the website from a KKN-PPM UGM team project site to a semi-official Kecamatan Sambelia information portal. The KKN team identity is downplayed to a footer credit line. All content, copy, and metadata speaks from the voice of the kecamatan, not the team.

## Decisions

- **Brand:** "Sambelia" (not "Portal Sambelia", not "Sambelia Lombok Timur")
- **Desa coverage:** Expand from 2 desa binaan to all 7 desa/kelurahan in Kecamatan Sambelia
- **Cerita section:** Rename to "Kegiatan" (route `/cerita` → `/kegiatan`)
- **Team credit:** Footer line only — "Dikembangkan oleh KKN-PPM UGM Melukis Sambelia"
- **No new sections:** Kegiatan doubles as berita/activities; Peta stays as-is
- **URL:** Keep melukisambelia as-is

## Section 1: Branding & Metadata

| Item | Current | New |
|------|---------|-----|
| Site title (default) | `Melukis Sambelia — KKN-PPM UGM` | `Sambelia` |
| Title template | `%s — Melukis Sambelia` | `%s — Sambelia` |
| Hero tagline | "Pemberdayaan pariwisata berkelanjutan & pengembangan kawasan agropolitan di Sambelia, Lombok Timur" | "Jelajahi Kecamatan Sambelia — pariwisata, data, dan potensi daerah di Lombok Timur" |
| Footer tagline | "Profil Desa Sambelia — KKN-PPM UGM 2026" | "Portal Kecamatan Sambelia, Lombok Timur" |
| Footer copyright | "© 2026 KKN-PPM UGM Melukis Sambelia" | "© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia" |
| Logo alt text | "Melukis Sambelia" | "Sambelia" |
| Nav aria-label | "Beranda Melukis Sambelia" | "Beranda Sambelia" |
| JSON-LD name | "Melukis Sambelia" | "Sambelia" |
| JSON-LD publisher type | "Organization" | "GovernmentOrganization" |
| JSON-LD publisher name | "KKN-PPM UGM Melukis Sambelia" | "Kecamatan Sambelia" |
| JSON-LD description | "Portal komunitas KKN-PPM UGM Melukis Sambelia..." | "Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa." |
| OG title | "Melukis Sambelia — KKN-PPM UGM" | "Sambelia — Portal Kecamatan Sambelia" |
| OG description | "Pemberdayaan pariwisata berkelanjutan dan agropolitan Sambelia." | "Portal informasi Kecamatan Sambelia: pariwisata, data kesehatan, irigasi, UMKM, dan peta tematik." |

### Stat cards

| Current | New |
|---------|-----|
| Luas: ±125 km² | Luas: ±125 km² (unchanged) |
| Penduduk: ±20.000 jiwa | Penduduk: ±20.000 jiwa (unchanged) |
| Desa Binaan: 2 | Desa/Kelurahan: 7 |
| Tahun Program: 2026 | Kabupaten: Lombok Timur |

## Section 2: Cerita → Kegiatan Route Rebrand

### Route change
- `/cerita` → `/kegiatan`
- `/cerita/[slug]` → `/kegiatan/[slug]`
- Add `next.config.mjs` redirect: `/cerita` → `/kegiatan`, `/cerita/:slug` → `/kegiatan/:slug`

### Content migration
- Move `content/cerita/*.mdx` → `content/kegiatan/*.mdx`
- Collection name in code: `cerita` → `kegiatan` everywhere

### UI label changes

| Location | Current | New |
|----------|---------|-----|
| Nav (Profil dropdown) | "Cerita" | "Kegiatan" |
| Footer nav link | "Cerita" | "Kegiatan" |
| Homepage section kicker | "06 — CERITA" | "06 — KEGIATAN" |
| Homepage section title | "Cerita dari Sambelia" | "Kegiatan Sambelia" |
| Kegiatan page hero kicker | "CERITA" | "KEGIATAN" |
| Kegiatan page hero title | "Cerita dari Sambelia" | "Kegiatan Sambelia" |
| Kegiatan page hero intro | "Catatan lapangan, refleksi, dan kisah tim Melukis Sambelia" | "Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia" |
| CTA button | "Baca semua cerita →" | "Lihat semua kegiatan →" |
| Empty state | "Belum ada cerita. Tim akan menambahkan segera." | "Belum ada kegiatan. Informasi akan ditambahkan segera." |
| SEO title | "Cerita dari Sambelia" | "Kegiatan Sambelia" |
| SEO description | "Catatan lapangan, refleksi, dan kisah tim KKN-PPM UGM..." | "Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia." |

### Component rename
- `CeritaStats.tsx` → `KegiatanStats.tsx`
- `app/cerita/` → `app/kegiatan/`

### Schema changes
- `ceritaSchema` → `kegiatanSchema` (structure unchanged: title, author, date, cover, excerpt, body)

## Section 3: Desa Expansion (2 → 7)

### New desa content files
Add 5 new `.md` files to `content/desa/`:

1. `sambelia.md` — Desa Sambelia (kecamatan capital)
2. `rarang.md` — Desa Rarang
3. `sambelia-rarang-selatan.md` — Desa Sambelia Rarang Selatan
4. `tembayar.md` — Desa Tembayar
5. `paok-motong.md` — Desa Paok Motong

(Exact names to be verified from official sources; placeholder content with basic name + description for now.)

### Schema changes

**`village` enum** in pariwisata, irigasi, kesehatan, umkm schemas:
- Current: `['Sugian', 'Labuhan Pandan', 'lainnya']`
- New: `['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']`

**`tentangPageSchema`:**
- `sectionDesaKicker`: "02 — DESA BINAAN" → "02 — DESA & KELURAHAN"
- `sectionDesaTitle`: "Desa Binaan" → "Desa & Kelurahan"
- `sectionDesaIntro`: "Desa-desa yang menjadi fokus program Melukis Sambelia" → "Desa-desa dan kelurahan yang ada di Kecamatan Sambelia."

### Tentang Sambelia page
- Remove "desa binaan" framing throughout
- Geography prose: remove "sebagai desa binaan program KKN-PPM UGM Melukis Sambelia"
- Stats section: update as per Section 1 stat card changes
- Footer note on geography: "Data geografi diperbarui berdasarkan informasi desa binaan" → "Data geografi berdasarkan profil Kecamatan Sambelia"

## Section 4: Homepage & Global Copy Reframe

### `_settings.md` changes

| Key | Current | New |
|-----|---------|-----|
| `heroTagline` | "Pemberdayaan pariwisata berkelanjutan & pengembangan kawasan agropolitan di Sambelia, Lombok Timur" | "Jelajahi Kecamatan Sambelia — pariwisata, data, dan potensi daerah di Lombok Timur" |
| `stats.desaBinaan` | "2" | "7" |
| `stats.tahunProgram` | "2026" | remove this key (replace with `stats.kabupaten: "Lombok Timur"`) |
| `pages.home.heroIntro` | "Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan." | "Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — pariwisata, pertanian, dan warisan budaya Sasak." |
| `pages.home.seoDescription` | "Portal komunitas KKN-PPM UGM Melukis Sambelia..." | "Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa." |
| `pages.tentang.seoDescription` | "...desa binaan, dan fokus program Melukis Sambelia" | "...geografi, demografi, desa, dan potensi daerah" |
| `pages.tentang.sectionDesaKicker` | "02 — DESA BINAAN" | "02 — DESA & KELURAHAN" |
| `pages.tentang.sectionDesaTitle` | "Desa Binaan" | "Desa & Kelurahan" |
| `pages.tentang.sectionDesaIntro` | "Desa-desa yang menjadi fokus program Melukis Sambelia." | "Desa-desa dan kelurahan yang ada di Kecamatan Sambelia." |
| `pages.cerita.*` | All references to "Cerita" and "tim Melukis Sambelia" | Updated to "Kegiatan" and kecamatan voice |
| `pages.wisataIntro` | "Destinasi wisata unggulan di Desa Sugian dan Labuhan Pandan." | "Destinasi wisata unggulan di Kecamatan Sambelia." |
| `footer.tagline` | "Profil Desa Sambelia — KKN-PPM UGM 2026" | "Portal Kecamatan Sambelia, Lombok Timur" |
| `footer.copyright` | "© 2026 KKN-PPM UGM Melukis Sambelia" | "© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia" |
| `emptyStates.*` | "Tim akan menambahkan segera" | "Data akan ditambahkan segera" |
| `emptyStates.cerita` | "Belum ada cerita..." | "Belum ada kegiatan. Informasi akan ditambahkan segera." |

### `_tentang.md` changes
- `geographyProse`: Remove "sebagai desa binaan program KKN-PPM UGM Melukis Sambelia"

## Section 5: Footer & Nav

### Footer (`components/Footer.tsx`)
- Logo alt: "Sambelia"
- Tagline: from settings (updated in Section 4)
- Nav link: "Cerita" → "Kegiatan", href `/kegiatan`
- Copyright: from settings (updated in Section 4)
- KKN-PPM UGM logo stays as small credit in social section

### Nav (`components/Nav.tsx`)
- `NAV_GROUPS` Profil dropdown: "Cerita" → "Kegiatan", href `/kegiatan`
- aria-label on home link: "Beranda Sambelia"

## Section 6: SEO & Schema

### All page metadata (in `_settings.md` and page components)
- Remove all "KKN-PPM UGM" and "Melukis Sambelia" references from descriptions
- "Portal komunitas KKN-PPM UGM Melukis Sambelia" → "Portal informasi Kecamatan Sambelia"
- "desa binaan" → "desa" or "desa/kelurahan"

### OG image (`scripts/generate-og.mjs`)
- Main text: "Melukis Sambelia" → "Sambelia"
- Subtitle: "KKN-PPM UGM · Sambelia, Lombok Timur" → "Kecamatan Sambelia, Lombok Timur"

### JSON-LD (`app/layout.tsx`)
- name: "Sambelia"
- publisher type: "GovernmentOrganization"
- publisher name: "Kecamatan Sambelia"
- description: updated kecamatan voice

### Sitemap
- `/cerita` entries → `/kegiatan`

## Section 7: Code Changes Summary

### Files to create
- `content/desa/sambelia.md`
- `content/desa/rarang.md`
- `content/desa/sambelia-rarang-selatan.md`
- `content/desa/tembayar.md`
- `content/desa/paok-motong.md`
- `app/kegiatan/page.tsx` (from `app/cerita/page.tsx`)
- `app/kegiatan/[slug]/page.tsx` (from `app/cerita/[slug]/page.tsx`)
- `app/kegiatan/loading.tsx` (from `app/cerita/loading.tsx`)
- `app/kegiatan/error.tsx` (from `app/cerita/error.tsx`)

### Files to modify
- `content/_settings.md` — all branding, copy, SEO descriptions
- `content/_tentang.md` — geography prose
- `lib/schemas.ts` — village enums, settings defaults, cerita→kegiatan, stats schema
- `lib/settings.ts` — default values
- `lib/content.ts` — collection name 'cerita' → 'kegiatan'
- `lib/jsonld.ts` — name, publisher, description
- `app/layout.tsx` — title, template, OG, JSON-LD
- `app/page.tsx` — hero tagline, stat cards, section refs
- `app/tentang-sambelia/page.tsx` — stat labels, section headers, "desa binaan" refs
- `app/sitemap.ts` — cerita → kegiatan URLs
- `app/not-found.tsx` — logo alt text
- `components/Footer.tsx` — nav link, copyright, logo alt
- `components/Nav.tsx` — nav link, aria-label
- `components/Logo.tsx` — alt text
- `components/KegiatanStats.tsx` (renamed from CeritaStats) — labels
- `components/EmptyState.tsx` — "Tim Melukis Sambelia" → kecamatan voice
- `scripts/generate-og.mjs` — text changes
- `scripts/build-gis-manifest.mjs` — credit text
- `next.config.mjs` — add redirects for `/cerita` → `/kegiatan`

### Files to delete (after migration)
- `content/cerita/` (moved to `content/kegiatan/`)
- `app/cerita/` (replaced by `app/kegiatan/`)

## Out of Scope
- Visual design changes (colors, typography, animations)
- Route structure changes beyond `/cerita` → `/kegiatan`
- New sections (Pemerintahan, Berita — Kegiatan covers this)
- Peta page changes (already kecamatan-level)
- Domain/URL changes