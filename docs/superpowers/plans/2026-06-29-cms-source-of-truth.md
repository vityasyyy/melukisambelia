# CMS Source of Truth + Visual Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all hardcoded user-facing content into Decap CMS collections so admins can edit the entire site without a developer, then audit and fix all accessibility and visual issues.

**Architecture:** Extend the existing file-based CMS pattern (content/*.md + lib/content.ts + Decap config.yml). Add new collections (`tentang`, `desa`) and extend existing ones (`airtanah`, `settings`). Read all user-facing text from CMS. Audit a11y/visual issues with Playwright and fix in components.

**Tech Stack:** Next.js 14 App Router, Decap CMS, Zod schemas, gray-matter, react-leaflet, Tailwind CSS, Vitest, Playwright.

---

## Agent A: CMS Collections Migration

**Scope:** All schema, content, lib, page, and config files for CMS migration. Do NOT touch component files (components/*.tsx) — Agent B owns those for a11y fixes.

**Files owned:**
- `lib/schemas.ts`, `lib/content.ts`, `lib/settings.ts`, `lib/air-tanah-data.ts`
- `public/admin/config.yml`
- `content/_tentang.md` (new), `content/desa/sugian.md` (new), `content/desa/labuhan-pandan.md` (new)
- `content/air-tanah/air-tanah.md` (extend), `content/_settings.md` (extend)
- `app/tentang-sambelia/page.tsx`, `app/page.tsx`, `app/air-tanah/page.tsx`, `app/air-tanah/AirTanahClient.tsx`
- `docs/CONTENT_ADMIN_GUIDE.md`

### Task 1: Add `tentang` and `desa` schemas + content files

- [ ] **Step 1: Add schemas to `lib/schemas.ts`**

Add after `airTanahSchema`:

```typescript
export const desaSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
})

export const tentangSchema = z.object({
  geographyProse: z.string(),
  potensiDesa: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).default([]),
})

export type Desa = z.infer<typeof desaSchema>
export type Tentang = z.infer<typeof tentangSchema>
```

Extend `airTanahSchema` to include measurements:

```typescript
export const airTanahMeasurementSchema = z.object({
  location: z.string(),
  date: z.string(),
  tmaMeters: z.number(),
  dhlMsiemens: z.number(),
})

export const airTanahSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
  measurements: z.array(airTanahMeasurementSchema).default([]),
})
```

Extend `settingsSchema` to include homepage intros:

```typescript
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
  homepageIntros: z.object({
    jejakiKicker: z.string().default('02 — JEJAKI'),
    jejakiTitle: z.string().default('Jejaki Sambelia'),
    jejakiIntro: z.string().default(''),
    wisataKicker: z.string().default('03 — WISATA UNGGULAN'),
    wisataTitle: z.string().default('Destinasi Pilihan'),
    wisataIntro: z.string().default('Destinasi wisata unggulan di Desa Sugian dan Labuhan Pandan.'),
    festivalKicker: z.string().default('04 — FESTIVAL'),
    festivalTitle: z.string().default('Festival Pesona Sambelia'),
    festivalIntro: z.string().default('Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.'),
    umkmKicker: z.string().default('05 — UMKM'),
    umkmTitle: z.string().default('UMKM Spotlight'),
    umkmIntro: z.string().default('Kerajinan, kuliner, dan produk lokal andalan masyarakat Sambelia.'),
  }).default({}),
})
```

Add corresponding type exports:

```typescript
export type Desa = z.infer<typeof desaSchema>
export type Tentang = z.infer<typeof tentangSchema>
export type AirTanahMeasurement = z.infer<typeof airTanahMeasurementSchema>
```

- [ ] **Step 2: Add `tentang` and `desa` to `lib/content.ts` SCHEMAS map**

Add imports for `desaSchema, tentangSchema` and types `Desa, Tentang`. Extend `SchemaMap` and `SCHEMAS`:

```typescript
  desa: { schema: desaSchema, ext: 'md' }
  tentang: { schema: tentangSchema, ext: 'md' }
```

Add to `CollectionName` union and `CollectionItem` conditional type.

- [ ] **Step 3: Add `getTentang()` and `getDesa()` to `lib/settings.ts`**

```typescript
import { desaSchema, tentangSchema, type Desa, type Tentang } from '@/lib/schemas'

export function getDesa(): (Desa & { slug: string })[] {
  return getCollection('desa') as (Desa & { slug: string })[]
}

export function getTentang(): Tentang {
  const file = path.join(CONTENT_DIR, '_tentang.md')
  if (!fs.existsSync(file)) return { geographyProse: '', potensiDesa: [] }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return tentangSchema.parse(data)
}
```

Note: `getDesa()` can use the existing `getCollection` from `lib/content.ts` instead.

- [ ] **Step 4: Create content files**

`content/_tentang.md`:
```yaml
---
geographyProse: "Kecamatan Sambelia terletak di Kabupaten Lombok Timur, Provinsi Nusa Tenggara Barat. Wilayahnya mencakup area pesisir dengan potensi wisata bahari serta kawasan pertanian yang subur. Batas administrasi mencakup area desa Sugian dan Labuhan Pandan sebagai desa binaan program KKN-PPM UGM Melukis Sambelia."
potensiDesa:
  - title: "Pariwisata Bahari & Budaya"
    description: "Pantai Berandangan, Taman Wisata Air Kramat Suci, Desa Wisata Sugian dan Labuhan Pandan, serta tradisi Sasak seperti Peresean, Pawai Dulangan, dan Gendang Beleq."
  - title: "Agropolitan & UMKM"
    description: "Pengembangan kawasan agropolitan berbasis pertanian, perikanan, dan kerajinan lokal, didukung jaringan irigasi dan program kesehatan masyarakat terpadu."
---
```

`content/desa/sugian.md`:
```yaml
---
name: Sugian
description: Desa binaan dengan potensi wisata bahari, pertanian, dan kerajinan tangan khas Sasak.
image: /images/content/sugian-group44.png
---
```

`content/desa/labuhan-pandan.md`:
```yaml
---
name: Labuhan Pandan
description: Desa pesisir dengan wisata bahari, budaya Sasak, dan ekowisata mangrove.
image: /images/content/labuanpandan.webp
---
```

Extend `content/air-tanah/air-tanah.md` — add the measurements from `public/data/air-tanah.json` to the frontmatter:

```yaml
---
title: "Air & Tanah"
description: "Data Tinggi Muka Airtanah (TMA) dan Daya Hantar Listrik (DHL) di Kecamatan Sambelia."
credit: "Tim Air & Tanah — Melukis Sambelia"
measurements:
  - location: "Sumur Sugian 1"
    date: "2026-06-10"
    tmaMeters: 2.3
    dhlMsiemens: 450
  # ... (all 10 measurements from air-tanah.json)
---
```

Extend `content/_settings.md` — add the `homepageIntros` object with all the kicker/title/intro values currently hardcoded in `app/page.tsx`.

- [ ] **Step 5: Update `lib/air-tanah-data.ts` to read from markdown**

Replace the JSON-reading function with one that reads from the `airTanah` collection:

```typescript
import { getCollection } from '@/lib/content'

export type TmaMeasurement = {
  location: string
  date: string
  tmaMeters: number
  dhlMsiemens: number
}

export type AirTanahData = {
  title: string
  description: string
  credit: string
  measurements: TmaMeasurement[]
}

export function getAirTanahData(): AirTanahData | null {
  const items = getCollection('airTanah')
  if (items.length === 0) return null
  const item = items[0]
  return {
    title: item.title,
    description: item.description,
    credit: item.credit,
    measurements: item.measurements,
  }
}
```

- [ ] **Step 6: Update `app/tentang-sambelia/page.tsx`**

Replace the hardcoded `desa` array (line 26-29) and geography prose (line 58-63) and potensi desa cards (line 111-128) with CMS reads:

```typescript
import { getSettings, getDesa, getTentang } from '@/lib/settings'
// ...
const s = getSettings()
const desa = getDesa()
const tentang = getTentang()
```

Replace the hardcoded desa map with `desa.map(...)`, the geography prose `<p>` with `{tentang.geographyProse}`, and the potensi desa cards with `tentang.potensiDesa.map(...)`.

- [ ] **Step 7: Update `app/page.tsx` to read homepage intros from settings**

Replace hardcoded kicker/title/intro strings in sections 02-05 with values from `s.homepageIntros`:

```typescript
const s = getSettings()
const hi = s.homepageIntros
// Section 02:
<SectionHeader kicker={hi.jejakiKicker} title={hi.jejakiTitle} tone="gold" />
// Section 03:
<SectionHeader kicker={hi.wisataKicker} title={hi.wisataTitle} intro={hi.wisataIntro} tone="water" />
// etc.
```

- [ ] **Step 8: Update `public/admin/config.yml`**

Add `desa` and `tentang` collections:

```yaml
  - name: "desa"
    label: "Desa Binaan"
    folder: "content/desa"
    create: true
    extension: "md"
    format: "yaml-frontmatter"
    identifier_field: "name"
    slug: "{{slug}}"
    fields:
      - { label: "Nama Desa", name: "name", widget: "string" }
      - { label: "Deskripsi", name: "description", widget: "text" }
      - { label: "Gambar", name: "image", widget: "image" }

  - name: "tentang"
    label: "Tentang Sambelia"
    files:
      - label: "Konten Tentang"
        name: "_tentang"
        file: "content/_tentang.md"
        fields:
          - { label: "Prose Geografi", name: "geographyProse", widget: "text" }
          - label: "Potensi Desa"
            name: "potensiDesa"
            widget: "list"
            fields:
              - { label: "Judul", name: "title", widget: "string" }
              - { label: "Deskripsi", name: "description", widget: "text" }
```

Extend `airtanah` collection to include measurements list field:

```yaml
  - name: "airtanah"
    label: "Air & Tanah"
    files:
      - label: "Data Air & Tanah"
        name: "air_tanah"
        file: "content/air-tanah/air-tanah.md"
        fields:
          - { label: "Judul", name: "title", widget: "string", default: "Air & Tanah" }
          - { label: "Deskripsi", name: "description", widget: "text", required: false }
          - { label: "Kredit", name: "credit", widget: "string", required: false }
          - label: "Pengukuran TMA & DHL"
            name: "measurements"
            widget: "list"
            required: false
            fields:
              - { label: "Lokasi", name: "location", widget: "string" }
              - { label: "Tanggal", name: "date", widget: "datetime", date_only: true }
              - { label: "TMA (m)", name: "tmaMeters", widget: "number", value_type: "float" }
              - { label: "DHL (mS)", name: "dhlMsiemens", widget: "number", value_type: "float" }
```

Extend `settings` collection to include `homepageIntros` object.

- [ ] **Step 9: Update `docs/CONTENT_ADMIN_GUIDE.md`**

Add field-by-field docs for `Desa Binaan`, `Tentang Sambelia`, extended `Air & Tanah` (measurements), and extended `Pengaturan Situs` (homepageIntros). Update the master table.

- [ ] **Step 10: Run verification**

```bash
npm run typecheck
npm run lint
npm run test
```

All must pass. Fix any errors.

### Task 2: Verify CMS end-to-end

- [ ] **Step 1: Start `npm run cms` and `npm run dev` in separate terminals**
- [ ] **Step 2: Open `http://localhost:3000/admin`, click Login, verify all collections appear**
- [ ] **Step 3: Verify each collection has entries visible**
- [ ] **Step 4: Visit each page and verify content renders from CMS**
- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migrate hardcoded content to CMS collections (tentang, desa, air-tanah measurements, homepage intros)"
```

---

## Agent B: A11y + Visual Audit

**Scope:** Audit all 11 routes for accessibility and visual issues. Fix in component files and CSS only. Do NOT touch page files (`app/*/page.tsx`) or lib files — Agent A owns those.

**Files owned:**
- `components/*.tsx` (visual/a11y fixes)
- `app/globals.css`, `tailwind.config.ts`
- `app/air-tanah/AirTanahClient.tsx` (only if Agent A is done with it)

**Audit checklist per route:**
1. Color contrast (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
2. All images have alt text (non-empty, descriptive)
3. Interactive elements (links, buttons) have visible focus states
4. Heading hierarchy: h1→h2→h3 with no skipped levels, exactly one h1
5. Semantic HTML: use `<nav>`, `<main>`, `<section>`, `<article>` appropriately
6. ARIA labels where needed (icon-only buttons, form inputs)
7. Touch targets ≥44px on mobile
8. Responsive layout at 375px (no overflow, no tiny text)
9. Card alignment and spacing consistency across pages
10. Image aspect ratios consistent

**Approach:**
1. Use Playwright MCP to navigate each route, take screenshots at desktop (1280px) and mobile (375px)
2. Run axe-core accessibility scan (via `page.evaluate` with axe-core injected, or manual checks)
3. Check heading hierarchy via DOM inspection
4. Check alt text via `img` element audit
5. Check contrast via computed styles
6. Fix issues in component files
7. Re-verify with Playwright

**Key files to check:**
- `components/Nav.tsx` — focus states, ARIA labels for icon buttons, mobile menu
- `components/Footer.tsx` — semantic HTML, link labels
- `components/DataCard.tsx` — alt text, card link accessibility
- `components/UmkmCard.tsx` — alt text, modal trigger
- `components/DetailModalClient.tsx` — dialog ARIA, focus trap
- `components/InteractiveMap.tsx` — map keyboard accessibility
- `components/MapFilterChips.tsx` — button labels, active state
- `components/StatCard.tsx` — semantic HTML
- `components/SectionHeader.tsx` — heading level
- `components/PageHero.tsx` — heading level
- `components/HeroAnimation.tsx` — alt text, decorative image handling

**Return:** Summary of all issues found and fixes applied, organized by page.

---

## After Agents Complete

### Task 3: Visual Review (Interactive)

Use Playwright MCP to navigate each route with the user, take screenshots, and fix any remaining issues the user points out.

### Task 4: Commit and Push

```bash
git add -A
git commit -m "feat: CMS as source of truth + a11y/visual audit fixes"
git push origin main
```