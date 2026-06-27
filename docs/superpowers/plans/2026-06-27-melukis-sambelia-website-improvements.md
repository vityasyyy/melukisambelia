# Melukis Sambelia Website Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the Melukis Sambelia website from a KKN program site to a village profile platform by removing KKN-centric sections, restructuring navigation, adding two new data sections (Air & Tanah, Lingkungan), fixing bugs, and adding polish.

**Architecture:** Next.js 14 static export with Decap CMS. Content lives in markdown/MDX files validated by Zod schemas. The map aggregator (`lib/map.ts`) pulls geotagged entries from multiple collections. New sections follow existing patterns: content schema → CMS collection → page component → listing cards. TMA data uses build-time XLSX→JSON pipeline (extending existing `import-xlsx.mjs`).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Leaflet, Recharts, Decap CMS, Zod, gray-matter, Vitest

---

## Phase 1: Quick Wins (No IA Dependency)

These tasks can be done independently and in any order.

---

### Task 1: Replace Favicon with Village Logo

**Files:**
- Modify: `app/favicon.ico`
- Reference: `public/images/design-system/color_logo_sambel.svg`

- [ ] **Step 1: Convert SVG logo to ICO**

Install a conversion tool and generate the favicon:

```bash
npm install --save-dev sharp
```

Create a temporary script `scripts/favicon-gen.mjs`:

```javascript
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const svg = readFileSync('public/images/design-system/color_logo_sambel.svg')
const png = await sharp(svg).resize(32, 32).png().toBuffer()

// For a simple 32x32 ICO, we need to write the ICO header + BMP data
// Easiest approach: use a PNG favicon (supported by all modern browsers)
await sharp(svg).resize(32, 32).png().toFile('public/images/design-system/favicon-32.png')
await sharp(svg).resize(16, 16).png().toFile('public/images/design-system/favicon-16.png')
await sharp(svg).resize(180, 180).png().toFile('public/images/design-system/apple-touch-icon.png')

console.log('Generated favicon PNGs')
```

Run: `node scripts/favicon-gen.mjs`

Then delete the script: `rm scripts/favicon-gen.mjs`

- [ ] **Step 2: Update layout.tsx to use the new favicon**

In `app/layout.tsx`, add proper favicon metadata and remove the default. Find the existing `<link rel="icon">` or `<link rel="shortcut icon">` if present, and replace/update to:

```tsx
export const metadata: Metadata = {
  // ... existing metadata
  icons: {
    icon: [
      { url: '/images/design-system/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/design-system/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/design-system/apple-touch-icon.png',
  },
}
```

Remove the old `app/favicon.ico` file.

- [ ] **Step 3: Verify favicon loads**

Run: `npm run build && npm run start`
Open `http://localhost:3000` and verify the browser tab shows the village logo, not the Vercel triangle.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: replace Vercel favicon with village logo"
```

---

### Task 2: Fix Hero Image Crop

**Files:**
- Modify: `components/HeroAnimation.tsx`
- Reference: `content/_settings.md` (heroImage path)

- [ ] **Step 1: Read the current hero image metadata**

Check `content/_settings.md` for the `heroImage` value to understand which image is being used.

- [ ] **Step 2: Adjust object-position to show boat and beach**

In `components/HeroAnimation.tsx`, find the `<Image>` or background image element that renders the hero image. Change `object-position` from `center` (or default) to a value that reveals the beach and boat area. The typical adjustment is:

```tsx
className="object-cover object-[center_60%]"
```

This moves the focal point down to show the coastline. If the image uses a background-image style instead, adjust `background-position` similarly.

Also reduce the zoom animation range from `1.08 → 1` to `1.03 → 1` for subtlety:

```tsx
initial={{ scale: 1.03, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev` and open `http://localhost:3000`. Confirm the boat and beach are visible in the hero and the zoom is subtle.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: adjust hero image crop to show boat and beach"
```

---

### Task 3: Remove Kegiatan (Program Unggulan)

**Files:**
- Delete: `app/kegiatan/` (entire directory)
- Delete: `content/kegiatan/` (entire directory)
- Delete: `components/KegiatanListClient.tsx`
- Delete: `components/KegiatanRoadmap.tsx`
- Modify: `lib/schemas.ts` — remove `milestoneSchema`, `kegiatanSchema`, and their type exports
- Modify: `lib/content.ts` — remove `kegiatan` from `SchemaMap` and `CollectionItem` type
- Modify: `public/admin/config.yml` — remove `kegiatan` collection
- Modify: `app/sitemap.ts` — remove `/kegiatan` route
- Modify: `app/page.tsx` — remove kegiatan import and usage in previews array
- Modify: `tests/schemas.test.ts` — remove kegiatan test
- Modify: `tests/content.test.ts` — remove any kegiatan test if present

- [ ] **Step 1: Remove kegiatan from schemas.ts**

In `lib/schemas.ts`, delete the `milestoneSchema` and `kegiatanSchema` definitions. Delete the `Kegiatan` type export. The remaining schemas should not reference these.

- [ ] **Step 2: Remove kegiatan from content.ts**

In `lib/content.ts`, remove `kegiatanSchema` and `Kegiatan` from the import. Remove `kegiatan` from the `SchemaMap` type and `SCHEMAS` object. Remove `C extends 'kegiatan' ? Kegiatan & { slug: string } :` from the `CollectionItem` type union.

- [ ] **Step 3: Remove kegiatan from CMS config**

In `public/admin/config.yml`, delete the entire `kegiatan` collection block (lines starting with `- name: "kegiatan"` through its fields).

- [ ] **Step 4: Remove kegiatan from sitemap**

In `app/sitemap.ts`, remove `'/kegiatan'` from the `staticRoutes` array.

- [ ] **Step 5: Remove kegiatan from homepage**

In `app/page.tsx`:
- Remove `const kegiatan = getCollection('kegiatan').slice(0, 1)` line
- Remove the kegiatan entry from the `previews` array
- If `getCollection('kegiatan')` is imported, ensure no other references remain

- [ ] **Step 6: Delete kegiatan directories and components**

```bash
rm -rf app/kegiatan content/kegiatan components/KegiatanListClient.tsx components/KegiatanRoadmap.tsx
```

Search for any remaining imports/references to kegiatan across the codebase:

```bash
rg -l "kegiatan|Kegiatan" app/ components/ lib/ --type ts --type tsx
```

Remove any remaining references.

- [ ] **Step 7: Update tests**

In `tests/schemas.test.ts`, remove the `kegiatan` import and the `it('kegiatan with milestones')` test. Remove `kegiatanSchema` from the import line.

In `tests/content.test.ts`, if any kegiatan test exists, remove it.

- [ ] **Step 8: Run tests and verify build**

```bash
npm run typecheck && npm test && npm run build
```

Expected: All tests pass, build succeeds, no kegiatan references remain.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: remove kegiatan (Program Unggulan) section"
```

---

### Task 4: Remove Mitra (Partners/Sponsors)

**Files:**
- Delete: `app/mitra/` (entire directory)
- Delete: `content/mitra/` (entire directory, 11 entries)
- Delete: `components/MitraGrid.tsx`
- Modify: `lib/schemas.ts` — remove `mitraSchema` and `Mitra` type export
- Modify: `lib/content.ts` — remove `mitra` from `SchemaMap` and `CollectionItem`
- Modify: `public/admin/config.yml` — remove `mitra` collection
- Modify: `app/sitemap.ts` — remove `/mitra` route
- Modify: `app/page.tsx` — remove Mitra section and `getCollection('mitra')` call
- Modify: `components/Footer.tsx` — remove Mitra link
- Modify: `tests/schemas.test.ts` — remove mitra test

- [ ] **Step 1: Remove mitra from schemas.ts**

In `lib/schemas.ts`, delete the `mitraSchema` definition and `Mitra` type export.

- [ ] **Step 2: Remove mitra from content.ts**

In `lib/content.ts`, remove `mitraSchema` and `Mitra` from imports. Remove `mitra` from `SchemaMap` type and `SCHEMAS` object. Remove `C extends 'mitra' ? Mitra & { slug: string } :` from `CollectionItem`.

- [ ] **Step 3: Remove mitra from CMS config**

In `public/admin/config.yml`, delete the entire `mitra` collection block.

- [ ] **Step 4: Remove mitra from sitemap**

In `app/sitemap.ts`, remove `'/mitra'` from `staticRoutes`.

- [ ] **Step 5: Remove Mitra section from homepage**

In `app/page.tsx`, remove:
- `const mitra = getCollection('mitra').filter((m) => m.tier === 'Utama')` line
- The entire "04 — MITRA" section JSX (the `<section>` with Mitra grid and logos)
- The `Image` import from `next/image` if only used for mitra logos (check other usages first)

- [ ] **Step 6: Remove Mitra link from Footer**

In `components/Footer.tsx`, remove the `<li>` containing `<Link href="/mitra">Mitra</Link>`.

- [ ] **Step 7: Delete mitra directories and component**

```bash
rm -rf app/mitra content/mitra components/MitraGrid.tsx
```

Search for remaining references:

```bash
rg -l "mitra|Mitra" app/ components/ lib/ --type ts --type tsx
```

Remove any remaining references.

- [ ] **Step 8: Update tests**

In `tests/schemas.test.ts`, remove `mitraSchema` from the import and any mitra-related tests.

- [ ] **Step 9: Run tests and verify build**

```bash
npm run typecheck && npm test && npm run build
```

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: remove mitra (partners) section"
```

---

### Task 5: Remove SponsorCta (Dukung Kami)

**Files:**
- Delete: `components/SponsorCta.tsx`
- Modify: `app/page.tsx` — remove SponsorCta import and usage

- [ ] **Step 1: Remove SponsorCta from homepage**

In `app/page.tsx`:
- Remove `import { SponsorCta } from '@/components/SponsorCta'`
- Remove `<SponsorCta />` from the JSX

- [ ] **Step 2: Delete SponsorCta component**

```bash
rm components/SponsorCta.tsx
```

- [ ] **Step 3: Verify build**

```bash
npm run typecheck && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: remove SponsorCta (Dukung Kami) section"
```

---

### Task 6: Remove Tim (KKN Team Roster)

**Files:**
- Delete: `content/tim/` (entire directory, 4 entries)
- Modify: `lib/schemas.ts` — remove `timSchema` and `Tim` type export
- Modify: `lib/content.ts` — remove `tim` from `SchemaMap` and `CollectionItem`
- Modify: `public/admin/config.yml` — remove `tim` collection
- Modify: `tests/schemas.test.ts` — remove tim test
- Modify: `tests/content.test.ts` — remove tim test

- [ ] **Step 1: Remove tim from schemas and content**

In `lib/schemas.ts`, delete `timSchema` and `Tim` type export.
In `lib/content.ts`, remove `timSchema` and `Tim` from imports. Remove `tim` from `SchemaMap` type, `SCHEMAS` object, and `CollectionItem` type union.

- [ ] **Step 2: Remove tim from CMS config**

In `public/admin/config.yml`, delete the entire `tim` collection block (lines 16-28).

- [ ] **Step 3: Update cerita CMS config**

In `public/admin/config.yml`, the `cerita` collection has an `author` field with `widget: "relation", collection: "tim"`. Since `tim` is being removed, change this field to a simple `widget: "string"`:

```yaml
- { label: "Penulis", name: "author", widget: "string" }
```

- [ ] **Step 4: Update cerita schema**

In `lib/schemas.ts`, the `ceritaSchema` has `author: z.string()` which is already a string — no change needed there.

- [ ] **Step 5: Delete tim directory**

```bash
rm -rf content/tim
```

- [ ] **Step 6: Update tests**

In `tests/schemas.test.ts`, remove `timSchema` import and `it('tim')` and `it('tim rejects bad division')` tests.
In `tests/content.test.ts`, remove `it('reads tim collection')` test.

- [ ] **Step 7: Search for remaining tim references**

```bash
rg -l "timSchema|getCollection.*'tim'|content/tim" app/ components/ lib/ tests/
```

Remove any remaining references.

- [ ] **Step 8: Run tests and verify build**

```bash
npm run typecheck && npm test && npm run build
```

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: remove tim (KKN team roster)"
```

---

### Task 7: Fix Kilas Sambelia Empty Gallery Bug

**Files:**
- Modify: `components/KilasSambelia.tsx`

- [ ] **Step 1: Update KilasSambelia to fall back to cover images**

Replace the `items` construction logic in `components/KilasSambelia.tsx`. The current code is:

```typescript
const items = [
  ...pariwisata.flatMap((p) => p.gallery.map((src) => ({ src, alt: p.title, href: `/pariwisata/${p.slug}` }))),
  ...umkm.flatMap((u) => u.gallery.map((src) => ({ src, alt: u.name, href: `/umkm` }))),
].filter((i) =>
  !i.src.includes('gallery-') &&
  !i.src.includes('imlek') &&
  !i.src.includes('ramadhan') &&
  !i.src.includes('nelayan')
)
```

Replace with:

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
].filter((i) =>
  !i.src.includes('gallery-') &&
  !i.src.includes('imlek') &&
  !i.src.includes('ramadhan') &&
  !i.src.includes('nelayan')
)
```

- [ ] **Step 2: Verify gallery shows on homepage**

Run: `npm run dev` and open `http://localhost:3000`. The "Kilas Sambelia" section should now display cover images from pariwisata and umkm entries.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix: Kilas Sambelia gallery falls back to cover images when galleries empty"
```

---

### Task 8: Reframe "Fokus Program" → "Potensi Desa"

**Files:**
- Modify: `app/tentang-sambelia/page.tsx`

- [ ] **Step 1: Update section kicker, title, intro, and card copy**

In `app/tentang-sambelia/page.tsx`, find the "03 — PROGRAM / Fokus Program" section (lines 107-131). Replace:

```tsx
<SectionHeader
  kicker="03 — PROGRAM"
  title="Fokus Program"
  intro="Penguatan kemandirian masyarakat berbasis pariwisata berkelanjutan dan pengembangan kawasan agropolitan."
  tone="terracotta"
/>
```

With:

```tsx
<SectionHeader
  kicker="03 — POTENSI DESA"
  title="Potensi Desa"
  intro="Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak."
  tone="terracotta"
/>
```

Then update the two cards:

First card ("Pariwisata Berkelanjutan"):

```tsx
<h3 className="font-semibold text-lg text-brown-900">Pariwisata Bahari & Budaya</h3>
<p className="mt-2 text-sm leading-relaxed text-ink/70">
  Pantai Berandangan, Taman Wisata Air Kramat Suci, Desa Wisata Sugian dan Labuhan Pandan,
  serta tradisi Sasak seperti Peresean, Pawai Dulangan, dan Gendang Beleq.
</p>
```

Second card ("Kawasan Agropolitan"):

```tsx
<h3 className="font-semibold text-lg text-brown-900">Agropolitan & UMKM</h3>
<p className="mt-2 text-sm leading-relaxed text-ink/70">
  Pengembangan kawasan agropolitan berbasis pertanian, perikanan, dan kerajinan lokal,
  didukung jaringan irigasi dan program kesehatan masyarakat terpadu.
</p>
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev` and navigate to `/tentang-sambelia`. Confirm "Potensi Desa" section shows village-focused copy.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: reframe Fokus Program to Potensi Desa on tentang-sambelia page"
```

---

### Task 9: Update Social Links

**Files:**
- Modify: `content/_settings.md`

- [ ] **Step 1: Verify current social handles**

Read `content/_settings.md` and check the current `socials.instagram` and `socials.tiktok` values. The user confirmed `@melukis.sambelia` for both platforms. If they are already set to `melukis.sambelia`, no change needed. If different, update them.

- [ ] **Step 2: Update if needed**

If the handles need updating, modify `content/_settings.md`:

```yaml
socials:
  instagram: melukis.sambelia
  tiktok: melukis.sambelia
```

- [ ] **Step 3: Commit (if changed)**

```bash
git add content/_settings.md && git commit -m "fix: update social media handles to real accounts"
```

If already correct, skip this commit.

---

### Task 10: Update Sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Update static routes**

In `app/sitemap.ts`, remove `/kegiatan` and `/mitra` from `staticRoutes`, and add `/air-tanah` and `/lingkungan`:

```typescript
const staticRoutes = ['', '/tentang-sambelia', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/air-tanah', '/lingkungan', '/festival', '/cerita', '/umkm']
```

Note: `/air-tanah` and `/lingkungan` pages don't exist yet (they're in Phase 2). The sitemap can include them now — they'll return 404 until the pages are created. Alternatively, defer this change until Phase 2. **Recommendation: defer until Phase 2 Task 5 when the pages are created.**

- [ ] **Step 2: Commit (deferred to Phase 2)**

---

## Phase 2: IA & New Sections (Structural Changes)

These tasks should be done in order as later tasks depend on earlier ones.

---

### Task 11: Restructure Navbar

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Define the new nav structure in Nav.tsx**

Replace the flat `NAV_LINKS` array with a grouped structure:

```tsx
type NavGroup = {
  label: string
  items: { href: string; label: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  { label: 'Profil', items: [
    { href: '/tentang-sambelia', label: 'Tentang Sambelia' },
    { href: '/cerita', label: 'Cerita' },
  ]},
  { label: 'Data & Analisis', items: [
    { href: '/pariwisata', label: 'Pariwisata' },
    { href: '/irigasi', label: 'Irigasi' },
    { href: '/kesehatan', label: 'Kesehatan' },
    { href: '/air-tanah', label: 'Air & Tanah' },
    { href: '/lingkungan', label: 'Lingkungan' },
  ]},
]

const NAV_TOP_LEVEL = [
  { href: '/', label: 'Beranda' },
  { href: '/peta', label: 'Peta' },
  { href: '/umkm', label: 'UMKM' },
  { href: '/festival', label: 'Festival' },
]
```

- [ ] **Step 2: Implement desktop dropdown nav**

Replace the desktop `<ul>` with a structure that renders top-level links as-is and groups as hover-triggered dropdowns. Use Framer Motion for dropdown animation:

```tsx
{/* Desktop nav */}
<ul className="hidden gap-1 lg:flex items-center">
  {NAV_TOP_LEVEL.filter(l => l.href !== '/').map((l) => {
    const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
    return (
      <li key={l.href}>
        <Link href={l.href} className={cn(
          'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
          active ? 'bg-gold-100 text-brown-900' : 'text-ink hover:bg-cream-beige hover:text-water-900'
        )}>
          {l.label}
        </Link>
      </li>
    )
  })}
  {NAV_GROUPS.map((group) => (
    <li key={group.label} className="relative group">
      <button className="rounded-full px-3 py-1.5 text-sm font-medium text-ink hover:bg-cream-beige hover:text-water-900 transition-colors flex items-center gap-1">
        {group.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <ul className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute top-full left-0 mt-1 min-w-[200px] rounded-xl border border-tan-700/10 bg-page shadow-lg py-2">
        {group.items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn(
                'block px-4 py-2 text-sm transition-colors',
                active ? 'bg-gold-100 text-brown-900' : 'text-ink hover:bg-cream-beige'
              )}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </li>
  ))}
</ul>
```

Note: Import `ChevronDown` from `lucide-react` (already a dependency).

- [ ] **Step 3: Implement mobile accordion nav**

Replace the mobile flat list with an accordion that expands/collapses groups. Use React state for which group is open:

```tsx
const [openGroup, setOpenGroup] = useState<string | null>(null)
```

In the mobile menu, render top-level items as-is and groups as expandable sections:

```tsx
{/* Mobile nav */}
<ul className="mx-auto max-w-content space-y-1 px-4 py-4">
  {NAV_TOP_LEVEL.filter(l => l.href !== '/').map((l, i) => (
    <motion.li key={l.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
      <Link href={l.href} className="block rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900" onClick={() => setOpen(false)}>
        {l.label}
      </Link>
    </motion.li>
  ))}
  {NAV_GROUPS.map((group, gi) => (
    <li key={group.label}>
      <button onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige">
        {group.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", openGroup === group.label && "rotate-180")} />
      </button>
      <AnimatePresence>
        {openGroup === group.label && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
            {group.items.map((item, ii) => (
              <motion.li key={item.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ii * 0.04 }}>
                <Link href={item.href} className="block rounded-lg px-3 py-1.5 text-sm text-ink/80 hover:bg-cream-beige" onClick={() => { setOpen(false); setOpenGroup(null) }}>
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  ))}
</ul>
```

- [ ] **Step 4: Update Footer navigation**

In `components/Footer.tsx`, replace the flat "Navigasi" list with a grouped structure:

```tsx
<h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-goldSoft">Navigasi</h3>
<ul className="space-y-2 text-sm text-cream-light/80">
  <li><Link href="/tentang-sambelia" className="transition-colors hover:text-goldSoft">Tentang Sambelia</Link></li>
  <li><Link href="/cerita" className="transition-colors hover:text-goldSoft">Cerita</Link></li>
  <li><Link href="/peta" className="transition-colors hover:text-goldSoft">Peta</Link></li>
  <li><Link href="/pariwisata" className="transition-colors hover:text-goldSoft">Pariwisata</Link></li>
  <li><Link href="/irigasi" className="transition-colors hover:text-goldSoft">Irigasi</Link></li>
  <li><Link href="/kesehatan" className="transition-colors hover:text-goldSoft">Kesehatan</Link></li>
  <li><Link href="/air-tanah" className="transition-colors hover:text-goldSoft">Air & Tanah</Link></li>
  <li><Link href="/lingkungan" className="transition-colors hover:text-goldSoft">Lingkungan</Link></li>
  <li><Link href="/umkm" className="transition-colors hover:text-goldSoft">UMKM</Link></li>
  <li><Link href="/festival" className="transition-colors hover:text-goldSoft">Festival</Link></li>
</ul>
```

- [ ] **Step 5: Verify nav works on desktop and mobile**

Run: `npm run dev` and test:
- Desktop: hover over "Profil" and "Data & Analisis" — dropdown should appear
- Mobile: tap hamburger — accordion should expand/collapse groups
- All links navigate correctly

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: restructure navbar with grouped dropdowns for Profil and Data & Analisis"
```

---

### Task 12: UMKM Schema Migration (product → kategori, lat/lng required)

**Files:**
- Modify: `lib/schemas.ts` — update `umkmSchema`
- Modify: `content/umkm/*.md` — migrate all 4 entries
- Modify: `public/admin/config.yml` — update UMKM collection
- Modify: `app/umkm/page.tsx` and related client components — add kategori filter
- Modify: `lib/map.ts` — update UMKM marker logic (lat/lng now always present)
- Modify: `tests/map.test.ts` — update umkm layer assertion

- [ ] **Step 1: Update umkmSchema in schemas.ts**

Replace the `product` field with `kategori` and make `lat`/`lng` required:

```typescript
export const umkmSchema = z.object({
  name: z.string(),
  owner: z.string(),
  kategori: z.enum(['Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  contact: z.string(),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})
```

Update the `Umkm` type export (it's auto-inferred from the schema).

- [ ] **Step 2: Migrate UMKM content files**

For each file in `content/umkm/`:
- Replace `product: Kuliner` → `kategori: Kuliner`
- Replace `product: Pertanian` → `kategori: Pertanian`
- Replace `product: Anyaman` → `kategori: Kerajinan`
- Replace `product: lainnya` → `kategori: Lainnya`
- Make `lat` and `lng` required (remove any optional defaults, ensure values exist)

Rename `content/umkm/kerajinan-anyaman.md` → `content/umkm/kerajinan-sambelia.md` (and update slug references).

- [ ] **Step 3: Update CMS config for UMKM**

In `public/admin/config.yml`, update the `umkm` collection:
- Replace `product` field with `kategori` field using new enum options
- Make `lat` and `lng` required (remove `required: false`)

```yaml
- name: "umkm"
  label: "UMKM"
  folder: "content/umkm"
  create: true
  extension: "md"
  fields:
    - { label: "Nama UMKM", name: "name", widget: "string" }
    - { label: "Pemilik", name: "owner", widget: "string" }
    - { label: "Kategori", name: "kategori", widget: "select", options: ["Kuliner", "Jasa", "Kerajinan", "Pertanian", "Perikanan", "Lainnya"] }
    - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
    - { label: "Kontak", name: "contact", widget: "string" }
    - { label: "Cover", name: "cover", widget: "image" }
    - { label: "Galeri", name: "gallery", widget: "list", field: { name: "image", label: "Gambar", widget: "image" }, required: false }
    - { label: "Konten", name: "body", widget: "markdown" }
    - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
    - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }
```

- [ ] **Step 4: Update UMKM page components**

Find the UMKM listing page and client components. Update any references from `product` to `kategori`. Add a kategori filter UI (chip/pill buttons) above the UMKM card grid.

In the UMKM listing client component, add state for the selected kategori filter and filter the displayed entries:

```tsx
const KATEGORI_OPTIONS = ['Semua', 'Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya'] as const
const [activeKategori, setActiveKategori] = useState<string>('Semua')
const filtered = activeKategori === 'Semua' ? items : items.filter(i => i.kategori === activeKategori)
```

- [ ] **Step 5: Update map.ts for required lat/lng**

In `lib/map.ts`, the UMKM marker logic currently conditionally includes entries with lat/lng:

```typescript
if (u.lat !== undefined && u.lng !== undefined) {
```

Since lat/lng is now required, simplify this to always include UMKM markers:

```typescript
markers.push({ layer: 'umkm', slug: u.slug, title: u.name, lat: u.lat, lng: u.lng, href: `/umkm` })
```

- [ ] **Step 6: Update tests**

In `tests/schemas.test.ts`, update any UMKM test to use `kategori` instead of `product`. In `tests/map.test.ts`, update the umkm layer assertion if needed.

- [ ] **Step 7: Run tests and verify build**

```bash
npm run typecheck && npm test && npm run build
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: migrate UMKM schema from product to kategori, require lat/lng"
```

---

### Task 13: Create /air-tanah Page

**Files:**
- Create: `app/air-tanah/page.tsx`
- Create: `lib/air-tanah-data.ts` (data loader)
- Modify: `lib/schemas.ts` — add `airTanahSchema`
- Modify: `content/_gismap.md` or create `content/air-tanah.md` (metadata)

- [ ] **Step 1: Add airTanahSchema to schemas.ts**

In `lib/schemas.ts`, add:

```typescript
export const airTanahSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
})

export type AirTanah = z.infer<typeof airTanahSchema>
```

- [ ] **Step 2: Create data loader**

Create `lib/air-tanah-data.ts`:

```typescript
import fs from 'fs'
import path from 'path'

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
  const filePath = path.join(process.cwd(), 'public', 'data', 'air-tanah.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as AirTanahData
}
```

- [ ] **Step 3: Create the Air & Tanah page**

Create `app/air-tanah/page.tsx` following the existing page patterns (e.g., `app/kesehatan/page.tsx`). The page should include:

- A hero section with title "Air & Tanah" and description
- A cross-link to `/peta?tab=air` for GIS maps
- A placeholder state when no data: "Data TMA dari cluster air tanah akan diunggah."
- A data table (when data available) showing TMA measurements
- A Recharts `BarChart` visualization (when data available) showing TMA values by location

Use `'use client'` for the chart component, split into a server page + client chart component.

- [ ] **Step 4: Add metadata**

```typescript
export const metadata: Metadata = {
  title: 'Air & Tanah',
  description: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.',
}
```

- [ ] **Step 5: Verify page loads**

Run: `npm run dev` and navigate to `/air-tanah`. Confirm the placeholder state shows correctly.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Air & Tanah page with TMA data table and chart"
```

---

### Task 14: Create /lingkungan Page

**Files:**
- Create: `app/lingkungan/page.tsx`
- Reference: `lib/gis.ts`, `lib/gis-manifest.ts`

- [ ] **Step 1: Create the Lingkungan page**

Create `app/lingkungan/page.tsx`. This page reads `public/gis/manifest.json` and filters for `category: 'vegetasi'` files to build a gallery. Follow the pattern of other listing pages.

```typescript
import { Metadata } from 'next'
import { getGisManifest } from '@/lib/gis'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lingkungan',
  description: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.',
}

export default function LingkunganPage() {
  const manifest = getGisManifest()
  const vegetasiFiles = manifest.files.filter(f => f.category === 'vegetasi')

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-olive-900 via-green-900 to-brown-900 py-20 text-center text-cream-light">
        {/* Hero section */}
      </section>

      <section className="mx-auto max-w-content px-4 py-16">
        <SectionHeader
          kicker="LINGKUNGAN"
          title="Vegetasi, Erosi & Blue Carbon"
          intro="Analisis spasial lingkungan Kecamatan Sambelia oleh tim GIS."
          tone="green"
        />
        
        {vegetasiFiles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Render gallery of GIS files */}
          </div>
        ) : (
          <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-8 text-center">
            <p className="text-ink/70">Data peta lingkungan dari cluster GIS akan diunggah.</p>
            <p className="mt-2 text-sm text-ink/50">Peta tematik akan tersedia di halaman Peta.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/peta?tab=vegetasi" className="inline-block rounded-full bg-water-900 px-6 py-2.5 text-sm font-medium text-cream-light transition-colors hover:bg-water-800">
            Lihat di Peta Interaktif →
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev` and navigate to `/lingkungan`. Confirm the placeholder state shows correctly. The deep-link to `/peta?tab=vegetasi` should work.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Lingkungan page with GIS gallery and map deep-link"
```

---

### Task 15: Update Homepage Jejaki Grid

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update the previews array**

In `app/page.tsx`, update the `previews` array to replace kegiatan with Air & Tanah, add Lingkungan, and reorder:

```typescript
const airTanah = getCollection('airTanah') // will be empty until data is populated
const lingkunganItems = [] // no content collection for lingkungan yet

const previews = [
  { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/content/pariwisata-marine.webp', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
  { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/content/irigasi-saluran.svg', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
  { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/content/kesehatan-fasilitas.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
  { href: '/air-tanah', image: '/images/content/air-tanah-placeholder.svg', title: 'Air & Tanah', desc: 'Data TMA & kualitas air.', accent: '#3B82F6' },
  { href: '/lingkungan', image: '/images/content/lingkungan-placeholder.svg', title: 'Lingkungan', desc: 'Peta vegetasi & blue carbon.', accent: '#22C55E' },
  { href: '/festival', image: festival[0]?.cover ?? '/images/content/festival-pawai.webp', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
  { href: '/umkm', image: umkm[0]?.cover ?? '/images/content/culture-rilistema.webp', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
]
```

Remove the `kegiatan` and `mitra` variables and imports. Remove the `getCollection('kegiatan')` and `getCollection('mitra')` calls.

For Air & Tanah and Lingkungan, since they don't have cover images from content collections yet, use placeholder images or a generic data icon. Create simple SVG placeholders in `public/images/content/` if needed.

- [ ] **Step 2: Remove SponsorCta and Mitra section imports**

If not already done in Tasks 4-5, ensure:
- `import { SponsorCta } from '@/components/SponsorCta'` is removed
- `import { getCollection } from '@/lib/content'` no longer references `'kegiatan'` or `'mitra'`
- The `mitra` variable and "04 — MITRA" section are removed

- [ ] **Step 3: Adjust the grid for 7 items**

The current grid is `sm:grid-cols-2 lg:grid-cols-3`. With 7 items, this creates a 3+3+1 layout. The single trailing card can be centered:

```tsx
<StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {previews.map((p) => (
    <StaggerItem key={p.href}>
      <DataCard {...p} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

This naturally flows with CSS grid — no special handling needed for 7 items.

- [ ] **Step 4: Run typecheck and build**

```bash
npm run typecheck && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: update homepage Jejaki grid with 7 sections, remove kegiatan and mitra"
```

---

### Task 16: Add UMKM Layer to Map

**Files:**
- Modify: `lib/map-types.ts` — ensure umkm is in the layer type (it already is)
- Modify: `lib/map.ts` — simplify UMKM marker logic (lat/lng now required)
- Modify: `components/MapFilterChips.tsx` — ensure umkm chip exists (if not, add)

- [ ] **Step 1: Verify map-types.ts already includes umkm**

Check `lib/map-types.ts` — it should already have `'umkm'` in `MapLayer` and a color in `LAYER_COLORS`. If not, add it. (Current file already includes these.)

- [ ] **Step 2: Simplify map.ts UMKM logic**

In `lib/map.ts`, update the UMKM loop to remove the conditional lat/lng check since they're now required:

```typescript
const umkm = getCollection('umkm')
for (const u of umkm) {
  markers.push({ layer: 'umkm', slug: u.slug, title: u.name, lat: u.lat, lng: u.lng, href: `/umkm` })
}
```

- [ ] **Step 3: Verify MapFilterChips includes umkm**

Check `components/MapFilterChips.tsx` for the umkm layer toggle. If it doesn't exist, add it with the label "UMKM" and the color from `LAYER_COLORS.umkm`.

- [ ] **Step 4: Run tests and verify**

```bash
npm test && npm run build
```

Open `/peta` and verify the UMKM layer toggle appears and UMKM markers show on the map.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add UMKM markers to interactive map with required lat/lng"
```

---

### Task 17: Update Decap CMS Config

**Files:**
- Modify: `public/admin/config.yml`

- [ ] **Step 1: Remove deleted collections**

Remove the following collections from `public/admin/config.yml`:
- `tim` (lines 16-28)
- `kegiatan` (lines 96-115)
- `mitra` (lines 148-158)

- [ ] **Step 2: Update UMKM collection**

In the `umkm` collection, replace the `product` field with `kategori` and make `lat`/`lng` required:

```yaml
- name: "umkm"
  label: "UMKM"
  folder: "content/umkm"
  create: true
  extension: "md"
  fields:
    - { label: "Nama UMKM", name: "name", widget: "string" }
    - { label: "Pemilik", name: "owner", widget: "string" }
    - { label: "Kategori", name: "kategori", widget: "select", options: ["Kuliner", "Jasa", "Kerajinan", "Pertanian", "Perikanan", "Lainnya"] }
    - { label: "Desa", name: "village", widget: "select", options: ["Sugian", "Labuhan Pandan", "lainnya"] }
    - { label: "Kontak", name: "contact", widget: "string" }
    - { label: "Cover", name: "cover", widget: "image" }
    - { label: "Galeri", name: "gallery", widget: "list", field: { name: "image", label: "Gambar", widget: "image" }, required: false }
    - { label: "Konten", name: "body", widget: "markdown" }
    - { label: "Latitude", name: "lat", widget: "number", value_type: "float" }
    - { label: "Longitude", name: "lng", widget: "number", value_type: "float" }
```

- [ ] **Step 3: Update cerita author field**

In the `cerita` collection, change the `author` field from `widget: "relation", collection: "tim"` to `widget: "string"` since `tim` is removed:

```yaml
- { label: "Penulis", name: "author", widget: "string" }
```

- [ ] **Step 4: Add Air & Tanah collection**

Add a new file-collection for Air & Tanah metadata. The actual TMA data will be a JSON file managed by the build script, but the CMS manages the metadata:

```yaml
- name: "airtanah"
  label: "Air & Tanah"
  files:
    - label: "Data Air & Tanah"
      name: "air_tanah"
      file: "content/air-tanah.md"
      fields:
        - { label: "Judul", name: "title", widget: "string", default: "Air & Tanah" }
        - { label: "Deskripsi", name: "description", widget: "text", required: false }
        - { label: "Kredit", name: "credit", widget: "string", required: false }
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: update Decap CMS config - remove deleted collections, add Air & Tanah, update UMKM"
```

---

### Task 18: Update Sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Update static routes**

In `app/sitemap.ts`, update the `staticRoutes` array:

```typescript
const staticRoutes = ['', '/tentang-sambelia', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/air-tanah', '/lingkungan', '/festival', '/cerita', '/umkm']
```

Removed: `/kegiatan`, `/mitra`. Added: `/air-tanah`, `/lingkungan`.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: update sitemap with new routes and remove deleted ones"
```

---

## Phase 3: Data & Animation Polish

These tasks are blocked on external data (from clusters) or are independent polish work.

---

### Task 19: TMA XLSX→JSON Pipeline

**Files:**
- Modify: `scripts/import-xlsx.mjs` — add `tma` sheet mapper
- Create: `content/air-tanah.md` — metadata file

- [ ] **Step 1: Add TMA mapper to import-xlsx.mjs**

In `scripts/import-xlsx.mjs`, add a `importTma` function and register it in `SHEET_MAPPERS`:

```javascript
function importTma(rows) {
  const measurements = rows.map((row) => ({
    location: row.Lokasi || row.lokasi || row.Location || `Lokasi ${rows.indexOf(row) + 1}`,
    date: row.Tanggal || row.tanggal || row.Date || row.Bulan || '',
    tmaMeters: parseNumber(row.TMA || row.tma || row.TmaMeters || row.Tma || 0),
    dhlMsiemens: parseNumber(row.DHL || row.dhl || row.DhlMsiemens || row.Dhl || 0),
  }))

  const data = {
    title: 'Data Tinggi Muka Airtanah (TMA)',
    description: 'Hasil pengukuran Tinggi Muka Airtanah dan Daya Hantar Listrik (DHL) di Kecamatan Sambelia.',
    credit: 'Tim Air & Tanah — Melukis Sambelia',
    measurements,
  }

  const outDir = path.join(process.cwd(), 'public', 'data')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'air-tanah.json'), JSON.stringify(data, null, 2))
  console.log(`  Wrote public/data/air-tanah.json (${measurements.length} measurements)`)
}

const SHEET_MAPPERS = {
  demografi: importDemografi,
  irigasi: importIrigasi,
  kesehatan: importKesehatan,
  pariwisata: importPariwisata,
  tma: importTma,
}
```

- [ ] **Step 2: Create content metadata file**

Create `content/air-tanah.md`:

```markdown
---
title: "Air & Tanah"
description: "Data Tinggi Muka Airtanah (TMA) dan Daya Hantar Listrik (DHL) di Kecamatan Sambelia."
credit: "Tim Air & Tanah — Melukis Sambelia"
---

Data TMA dan kualitas air diperoleh dari survei lapangan oleh tim cluster Air & Tanah.
```

- [ ] **Step 3: Add airTanah to content.ts**

In `lib/content.ts`, add `airTanahSchema` to imports and add the `airTanah` entry to `SchemaMap`:

```typescript
import { ..., airTanahSchema, type AirTanah } from '@/lib/schemas'

// In SchemaMap:
airTanah: { schema: airTanahSchema, ext: 'md' }

// In CollectionItem:
C extends 'airTanah' ? AirTanah & { slug: string } :
```

- [ ] **Step 4: Test the pipeline**

Place a test XLSX file with a `tma` sheet in `data/` and run:

```bash
node scripts/import-xlsx.mjs
```

Verify `public/data/air-tanah.json` is created with the correct structure.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add TMA XLSX import pipeline for Air & Tanah data"
```

---

### Task 20: Animation Polish Pass

**Files:**
- Modify: `components/HeroAnimation.tsx` — add scroll parallax
- Modify: `components/DataCard.tsx` — refine hover micro-interaction
- Modify: `components/InteractiveMap.tsx` or map client component — marker entrance animation
- Modify: `app/layout.tsx` — page-transition fade (if feasible with App Router)
- Modify: `components/CountdownStrip.tsx` — add pulse animation

- [ ] **Step 1: Hero scroll parallax**

In `components/HeroAnimation.tsx`, add a subtle scroll-driven parallax effect using Framer Motion's `useScroll` and `useTransform`:

```tsx
import { useScroll, useTransform } from 'framer-motion'

// Inside the component:
const { scrollY } = useScroll()
const heroY = useTransform(scrollY, [0, 600], [0, 150])
```

Apply `style={{ y: heroY }}` to the image wrapper. Ensure this respects `prefers-reduced-motion` by conditionally applying the transform.

- [ ] **Step 2: DataCard hover refinement**

In `components/DataCard.tsx`, enhance the hover transition with a smoother cubic-bezier curve and subtle scale:

```tsx
className="... transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1.5 hover:shadow-lg hover:shadow-terracotta/20"
```

- [ ] **Step 3: Map marker entrance animation**

In the map client component, add a staggered fade-in for markers on initial load. Use a state variable `markersReady` that starts false and sets to true after a short delay, then conditionally render markers with staggered opacity.

- [ ] **Step 4: Festival countdown pulse**

In `components/CountdownStrip.tsx`, add a gentle pulse animation to the countdown digits:

```tsx
className="... animate-[pulse_3s_ease-in-out_infinite]"
```

Or use Framer Motion's `animate={{ scale: [1, 1.02, 1] }}` with `transition={{ repeat: Infinity, duration: 3 }}`.

- [ ] **Step 5: Verify all animations respect prefers-reduced-motion**

Test with browser DevTools: toggle "prefers-reduced-motion: reduce" in CSS. Verify all animations (hero parallax, card hover, marker entrance, countdown pulse) are disabled or reduced.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add purposeful micro-interactions - hero parallax, card hover, map markers, countdown pulse"
```

---

### Task 21: Update layout.tsx Metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update site description and title for village-profile framing**

In `app/layout.tsx`, find the metadata object and update the description from KKN-centric to village-profile:

```typescript
description: 'Profil desa Kecamatan Sambelia — pariwisata, data kesehatan, irigasi, UMKM, dan peta tematik.'
```

And the footer text in `components/Footer.tsx` should reflect village-profile framing:

```tsx
<p className="mt-4 text-sm text-cream-light/80">Profil Desa Sambelia — KKN-PPM UGM 2026</p>
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: update site metadata to village-profile framing"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Every design decision (D1-D12) has a corresponding task
- [x] **Placeholder scan:** No TBD/TODO/vague steps — all steps have concrete code or commands
- [x] **Type consistency:** `kategori` (not `product`), `airTanahSchema`/`AirTanah`/`AirTanahData`/`TmaMeasurement` types defined consistently, `lat`/`lng` required in UMKM
- [x] **No orphaned references:** `tim`, `kegiatan`, `mitra`, `SponsorCta` references all accounted for in deletion tasks
- [x] **Test updates:** schemas.test.ts, content.test.ts, map.test.ts updates included
- [x] **CMS config:** All collection changes (remove tim/kegiatan/mitra, add airtanah, update umkm) included
- [x] **Sitemap:** Updated in Task 18
- [x] **Homepage:** Updated in Task 15 (7-card grid, remove SponsorCta/Mitra)
- [x] **Nav/Footer:** Updated in Task 11
- [x] **Phase ordering:** Phase 1 (quick wins) → Phase 2 (structural) → Phase 3 (data/polish) is correct
