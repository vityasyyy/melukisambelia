# CMS Reliability & Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CMS content pipeline 100% reliable, fix the card grid layout, update the village enum, and add a Profil Tim (team profile) page managed by CMS.

**Architecture:** Three interconnected changes: (1) fix the CMS pipeline so entries never silently disappear, (2) fix the card grid so small cards auto-size instead of stretching, (3) add a new CMS-managed Profil Tim page with team members grouped by year then cluster.

**Tech Stack:** Next.js 14 (App Router), DecapCMS, Zod, gray-matter, Vercel ISR, GitHub OAuth, Tailwind CSS

---

## Root Cause Analysis (CMS Pipeline)

When a CMS user creates/edits content and clicks "Save → Publish":

1. **DecapCMS commits to GitHub** → triggers Vercel rebuild (works fine)
2. **Vercel rebuilds** → reads content files, validates with Zod (problematic)
3. **Zod validation silently drops entries** → `console.error` + `continue` in `lib/content.ts:68-69` means invalid entries never appear, with zero user-facing feedback
4. **ISR caches for 5 minutes** → even valid entries take up to 5 minutes to appear
5. **No on-demand revalidation** → no `revalidatePath`/`revalidateTag` anywhere

### Village Enum Mismatch

The current `village` enum in schemas has 7 values + 'lainnya':
`['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']`

But the actual `content/desa/` directory has **11 villages** with different names:
Obel-Obel, Dara Kunci, Belanting, Sambelia, Madayin, Senanggalih, Labuhan Pandan, Sugian, Padak Guar, Dadap, Bagik Manis

Two desa files also have bugs: `padak-guar.md` has `name: Senanggalih` (should be Padak Guar) and `paok-motong.md` has `name: Bagik Manis` (inconsistent).

### Card Grid Layout Issue

In `AlternatingCardGrid.tsx`, the trio layout uses `flex-1 min-h-0` on small card wrappers, causing them to stretch to match the featured card's height. This creates unwanted bottom padding/margin on small cards. The fix: small cards should auto-size to their content height, and the featured card naturally becomes the tallest.

---

## Task 1: Update Village Enum to Match Real Desa Data

**Files:**
- Modify: `lib/schemas.ts`
- Modify: `content/desa/padak-guar.md`
- Modify: `content/desa/paok-motong.md`

**Why:** The village enum has wrong/outdated values. Need to match the actual 11 villages in Kecamatan Sambelia.

- [ ] **Step 1: Fix the two buggy desa content files**

In `content/desa/padak-guar.md`, change `name: Senanggalih` to `name: Padak Guar`
In `content/desa/paok-motong.md`, keep `name: Bagik Manis` (this is correct — Paok Motong is the desa name in older naming, Bagik Manis is the current name)

- [ ] **Step 2: Replace all village enums in `lib/schemas.ts`**

Replace the inline village enums in `pariwisataSchema`, `irigasiSchema`, `kesehatanSchema`, and `umkmSchema` with a shared preprocessed enum:

```ts
const villageEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Obel-Obel', 'Dara Kunci', 'Belanting', 'Sambelia', 'Madayin', 'Senanggalih', 'Labuhan Pandan', 'Sugian', 'Padak Guar', 'Dadap', 'Bagik Manis', 'lainnya'])
)
```

Use `villageEnum` in all 4 schemas that have a `village` field.

- [ ] **Step 3: Update CMS config to match**

In `public/admin/config.yml`, update all `village` select widget options to match the new enum. There are 4 collections with village fields (pariwisata, irigasi, kesehatan, umkm). Replace the options list with:

```yaml
options:
  [
    "Obel-Obel",
    "Dara Kunci",
    "Belanting",
    "Sambelia",
    "Madayin",
    "Senanggalih",
    "Labuhan Pandan",
    "Sugian",
    "Padak Guar",
    "Dadap",
    "Bagik Manis",
    "lainnya",
  ]
```

- [ ] **Step 4: Update existing content files that use the old village names**

Search all `.md` and `.mdx` files in `content/` for the old village values (`Rarang`, `Sambelia Rarang Selatan`, `Tembayar`, `Paok Motong`) and update them to the closest match in the new enum. Some may need to stay as 'lainnya' if there's no clear mapping.

- [ ] **Step 5: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add lib/schemas.ts content/desa/ public/admin/config.yml content/
git commit -m "fix: update village enum to match real desa data (11 villages)"
```

---

## Task 2: Make Zod Schemas Forgiving (Add Defaults + Trim Enums)

**Files:**
- Modify: `lib/schemas.ts`

**Why:** The #1 cause of missing content. Currently, 5 schemas have `body: z.string()` without `.default('')`. If a CMS user saves an entry without body text, the entry is silently dropped.

- [ ] **Step 1: Add `.default('')` to `body` fields that lack it**

Change in `lib/schemas.ts`:
- `pariwisataSchema`: `body: z.string()` → `body: z.string().default('')`
- `irigasiSchema`: `body: z.string()` → `body: z.string().default('')`
- `kesehatanSchema`: `body: z.string()` → `body: z.string().default('')`
- `kegiatanSchema`: `body: z.string()` → `body: z.string().default('')`
- `umkmSchema`: `body: z.string()` → `body: z.string().default('')`

- [ ] **Step 2: Add defaults for other required fields that CMS might leave empty**

Add sensible defaults:
- `pariwisataSchema`: `shortDesc: z.string().default('')`, `lat: z.number().min(-90).max(90).default(-8.6)`, `lng: z.number().min(-180).max(180).default(116.5)`
- `irigasiSchema`: `lengthM: z.number().nonnegative().default(0)`, `lat: z.number().min(-90).max(90).default(-8.6)`, `lng: z.number().min(-180).max(180).default(116.5)`
- `kesehatanSchema`: `lat: z.number().min(-90).max(90).default(-8.6)`, `lng: z.number().min(-180).max(180).default(116.5)`
- `kegiatanSchema`: `author: z.string().default('Tim Melukis Sambelia')`, `excerpt: z.string().default('')`
- `umkmSchema`: `contact: z.string().default('-')`, `lat: z.number().min(-90).max(90).default(-8.6)`, `lng: z.number().min(-180).max(180).default(116.5)`

- [ ] **Step 3: Add preprocess trim to category enums (from CMS reliability plan)**

Add these preprocessed enums at top of `lib/schemas.ts`:

```ts
const categoryPariwisataEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Pantai', 'Budaya', 'Desa Wisata', 'Air', 'Trekking'])
)
const conditionEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat'])
)
const flowStatusEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Mengalir', 'Kering', 'Mengalir Sebagian'])
)
const saluranTypeEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Primer', 'Sekunder', 'Tersier'])
)
const typeKesehatanEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Posyandu', 'Puskesmas', 'Bidan', 'Polides'])
)
const kategoriUmkmEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya'])
)
const categoryLingkunganEnum = z.preprocess(
  (v) => typeof v === 'string' ? v.trim() : v,
  z.enum(['Vegetasi', 'Erosi', 'Blue Carbon', 'Lainnya'])
)
```

Replace all inline `z.enum(...)` for these category/type fields with the preprocessed versions.

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add lib/schemas.ts
git commit -m "fix: make Zod schemas forgiving — add defaults and trim enums"
```

---

## Task 3: Fix Card Grid Layout (Small Cards Auto-Size)

**Files:**
- Modify: `components/AlternatingCardGrid.tsx`
- Modify: `components/DataCard.tsx` (if needed)

**Why:** In the trio layout (1 featured + 2 small), small cards use `flex-1 min-h-0` which stretches them to match the featured card's height. This creates a bottom white margin/padding effect. The fix: small cards should auto-size to their content height, and the trio row height should be determined by whichever is taller — the featured card or the stacked small cards.

- [ ] **Step 1: Modify `AlternatingCardGrid.tsx` — remove `flex-1 min-h-0` from small card wrappers**

In the trio layout sections, change the small card wrapper from:
```tsx
<div key={s.index} className="flex-1 min-h-0">
  {renderItem(s.item, s.index, false)}
</div>
```

To:
```tsx
<div key={s.index}>
  {renderItem(s.item, s.index, false)}
</div>
```

And change the small cards column from `flex flex-col gap-3` to just `flex flex-col gap-3` (keep gap but remove stretch):

The trio layout should use `items-start` on the grid so cards don't stretch vertically:
```tsx
<div key={gi} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
```

Wait — that would misalign the small cards column. The real issue is that `flex-1` makes small cards stretch. The correct fix is:

1. Change the outer grid to NOT use `items-start` (we want columns aligned)
2. Change the small cards column to use `items-stretch` only if small cards are shorter than featured card — but we want the opposite: featured card should be the tallest, small cards should NOT stretch.

The correct approach: The small cards column should NOT stretch its children. Instead, the featured card and small cards column should be side-by-side, with the row height being the max of the two columns. Small cards should take only their natural height.

Change the trio layout to use `items-start` on the grid:

```tsx
<div key={gi} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
```

And remove `flex-1 min-h-0` from individual small card items (they should just take their natural height):

```tsx
<div key={s.index}>
  {renderItem(s.item, s.index, false)}
</div>
```

But keep the small cards column as `flex flex-col gap-3` so they stack with gap.

Actually, re-reading the user's request: "the small one should adhere to the big one, it resizes based on the big one instead of the big one having a padding to overcome to the small ones." This means the user wants small cards to size naturally (their own content height), and the featured card should be the tallest naturally (because it has more content or a bigger image), NOT because of forced stretching.

The current code has `flex-1 min-h-0` which forces small cards to stretch. Removing `flex-1` from individual small card items and keeping `flex flex-col` (without stretch) on the column should make small cards auto-size:

For the trio layout, change both instances (featuredFirst=true and featuredFirst=false):

```tsx
// Small cards column — remove items-stretch, keep natural sizing
<div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
  {group.smalls.map((s) => (
    <div key={s.index}>  {/* was: className="flex-1 min-h-0" */}
      {renderItem(s.item, s.index, false)}
    </div>
  ))}
</div>
```

- [ ] **Step 2: Verify DataCard doesn't force height stretching**

Check `DataCard.tsx` — it already uses `h-full` on the outer div. Since we're removing `flex-1` from the wrapper, `h-full` will now refer to the card's own natural height (auto) since the parent div is no longer `flex-1 min-h-0`. Actually, `h-full` means "100% of parent height", so if the parent doesn't force a height, `h-full` becomes `height: auto` effectively.

Wait — the outer `div` in DataCard has `h-full` which means it tries to fill its parent. If we remove `flex-1` from the small card wrapper, the wrapper has no explicit height, so `h-full` in DataCard resolves to `height: 100%` of an auto-height container, which effectively becomes auto. This should be fine — the card will size to its content.

No changes needed to DataCard.

- [ ] **Step 3: Run typecheck and visual test**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/AlternatingCardGrid.tsx
git commit -m "fix: card grid — small cards auto-size instead of stretching to match featured"
```

---

## Task 4: Add Content Validation Logging and API Endpoints

**Files:**
- Modify: `lib/content.ts`
- Create: `app/api/validate-content/route.ts`
- Create: `app/api/revalidate/route.ts`

**Why:** Currently, validation failures are invisible (`console.error` only). We need accumulated error reporting, a validation API endpoint, and on-demand revalidation.

- [ ] **Step 1: Add validation error tracking to `lib/content.ts`**

Add at top of file, after imports:
```ts
let validationErrors: string[] = []

export function getValidationErrors(): string[] {
  return [...validationErrors]
}

export function clearValidationErrors(): void {
  validationErrors = []
}
```

Replace the existing error handling block in `getCollection`:
```ts
if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((i) => `  ${i.path.join('.')}: ${i.message}`)
    .join('\n')
  const msg = `[content] ${name}/${file}:\n${formatted}`
  validationErrors.push(msg)
  console.error(msg)
  continue
}
```

- [ ] **Step 2: Create `app/api/validate-content/route.ts`**

(See full code in original plan Task 2, Step 2 — identical implementation)

- [ ] **Step 3: Create `app/api/revalidate/route.ts`**

(See full code in original plan Task 2, Step 3 — identical implementation)

- [ ] **Step 4: Add `REVALIDATION_SECRET` to `.env.example`**

Add: `REVALIDATION_SECRET=your_revalidation_secret_here`

- [ ] **Step 5: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts app/api/validate-content/route.ts app/api/revalidate/route.ts .env.example
git commit -m "feat: content validation endpoint + on-demand revalidation API"
```

---

## Task 5: Add GitHub Actions Revalidation Workflow

**Files:**
- Create: `.github/workflows/revalidate.yml`

(See original plan Task 3 — identical implementation)

- [ ] **Step 1: Create `.github/workflows/revalidate.yml`**

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/revalidate.yml
git commit -m "feat: add GitHub Actions workflow for on-demand revalidation"
```

---

## Task 6: Add CMS Save Notification and Validation Feedback

**Files:**
- Modify: `public/admin/index.html`

(See original plan Task 4 — identical implementation, adding post-save notification + validation badge)

- [ ] **Step 1: Add CMS notification and validation status widget**

- [ ] **Step 2: Commit**

```bash
git add public/admin/index.html
git commit -m "feat: add save notification and validation feedback to CMS admin"
```

---

## Task 7: Enhance Build-Time Content Validation

**Files:**
- Modify: `scripts/validate-content.mjs`

(See original plan Task 5 — identical implementation)

- [ ] **Step 1: Rewrite validation script with detailed reporting**

- [ ] **Step 2: Run and verify**

Run: `node scripts/validate-content.mjs`
Expected: All content files pass

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-content.mjs
git commit -m "feat: enhance build-time content validation with detailed reporting"
```

---

## Task 8: Fix OAuth CSRF State Verification

**Files:**
- Modify: `app/api/auth/route.ts`

(See original plan Task 6 — identical implementation)

- [ ] **Step 1: Add state parameter verification using cookies**

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/route.ts
git commit -m "fix: add OAuth state parameter verification for CSRF protection"
```

---

## Task 9: Add Profil Tim (Team Profile) Page — CMS Schema & Content

**Files:**
- Modify: `lib/schemas.ts`
- Modify: `lib/content.ts`
- Modify: `lib/settings.ts`
- Modify: `public/admin/config.yml`
- Create: `content/profil-tim/` directory with sample content files

**Why:** New CMS-managed page for team profiles. Members are grouped by year, then by cluster (Saintek, Soshum, Agro, Medika), with individual descriptions.

### Data Model

Each team member has:
- `name` (string)
- `role` (string, e.g. "Koordinator", "Anggota Divisi Pariwisata")
- `cluster` (enum: "Saintek", "Soshum", "Agro", "Medika")
- `year` (string, e.g. "2026")
- `photo` (string, image path)
- `description` (string, optional, default '')
- `order` (number, default 0)

Content is stored as multi-file collection in `content/profil-tim/` (one `.md` per member).

The page groups members by year first, then by cluster within each year.

- [ ] **Step 1: Add `profilTimSchema` to `lib/schemas.ts`**

```ts
export const profilTimSchema = z.object({
  name: z.string(),
  role: z.string().default(''),
  cluster: z.preprocess(
    (v) => typeof v === 'string' ? v.trim() : v,
    z.enum(['Saintek', 'Soshum', 'Agro', 'Medika'])
  ),
  year: z.string().default('2026'),
  photo: z.string().default('/images/hero-placeholder.svg'),
  description: z.string().default(''),
  order: z.number().int().default(0),
})

export type ProfilTim = z.infer<typeof profilTimSchema>
```

- [ ] **Step 2: Add `profilTim` to the SchemaMap in `lib/content.ts`**

```ts
import { /* existing imports */, profilTimSchema, type ProfilTim } from '@/lib/schemas'

// Add to SchemaMap type:
profilTim: { schema: typeof profilTimSchema; ext: string; dir?: string }

// Add to SCHEMAS const:
profilTim: { schema: profilTimSchema, ext: 'md' },

// Add to CollectionItem type:
C extends 'profilTim' ? ProfilTim & { slug: string } :
```

- [ ] **Step 3: Add `profilTim` page settings to `lib/settings.ts`**

Add `'profilTim'` to the `PageName` type union.
Add defaults for `profilTim` in `getPageSettings()`:

```ts
profilTim: {
  heroKicker: 'PROFIL TIM',
  heroTitle: 'Tim Melukis Sambelia',
  heroIntro: 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.',
  seoTitle: 'Profil Tim',
  seoDescription: 'Tim KKN-PPM UGM Melukis Sambelia — anggota, peran, dan cerita di balik layanan.',
  sectionKicker: 'TIM',
  sectionTitle: 'Anggota Tim',
  sectionIntro: 'Kenali wajah-wajah di balik KKN-PPM UGM Melukis Sambelia.',
},
```

- [ ] **Step 4: Add Profil Tim collection to `public/admin/config.yml`**

Add after the last collection:

```yaml
  - name: "profil-tim"
    label: "Profil Tim"
    folder: "content/profil-tim"
    create: true
    identifier_field: "name"
    slug: "{{slug}}"
    extension: "md"
    format: "yaml-frontmatter"
    fields:
      - { label: "Nama", name: "name", widget: "string" }
      - { label: "Peran", name: "role", widget: "string", required: false, hint: "Jabatan atau divisi, misalnya 'Koordinator', 'Anggota Divisi Pariwisata'" }
      - { label: "Klaster", name: "cluster", widget: "select", options: ["Saintek", "Soshum", "Agro", "Medika"] }
      - { label: "Tahun", name: "year", widget: "string", default: "2026" }
      - { label: "Foto", name: "photo", widget: "image", required: false }
      - { label: "Deskripsi", name: "description", widget: "text", required: false }
      - { label: "Urutan", name: "order", widget: "number", required: false, hint: "Angka lebih kecil tampil lebih dulu" }
```

- [ ] **Step 5: Create sample content files**

Create `content/profil-tim/` directory and add a placeholder file:

`content/profil-tim/contoh-anggota.md`:
```markdown
---
name: Contoh Anggota
role: Koordinator
cluster: Saintek
year: "2026"
photo: /images/hero-placeholder.svg
description: Contoh deskripsi anggota tim.
order: 0
---
```

- [ ] **Step 6: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add lib/schemas.ts lib/content.ts lib/settings.ts public/admin/config.yml content/profil-tim/
git commit -m "feat: add Profil Tim schema, CMS collection, and content structure"
```

---

## Task 10: Add Profil Tim Page UI (Horizontally Scrollable Cards)

**Files:**
- Create: `app/profil-tim/page.tsx`
- Create: `app/profil-tim/loading.tsx`
- Modify: `components/Nav.tsx`
- Modify: `components/Footer.tsx`

**Why:** Create the actual page that displays team members grouped by year and cluster. Each cluster is displayed as a **horizontally scrollable row** of member cards (same pattern as the Desa section on `/tentang-sambelia`), NOT a grid.

### Page Layout

```
PageHero (tone: "gold")
├── SectionHeader — "Anggota Tim"
├── Year Group: 2026
│   ├── Cluster: Saintek — horizontal scroll row of cards
│   ├── Cluster: Soshum — horizontal scroll row of cards
│   ├── Cluster: Agro — horizontal scroll row of cards
│   └── Cluster: Medika — horizontal scroll row of cards
│   (each row has "Geser horizontal untuk menjelajah →" hint)
└── (future year groups)
```

Each member card: Circular photo + Name + Role + Description, following the `glass-card` pattern. Cards are horizontally scrollable with `overflow-x-auto scrollbar-none snap-x snap-mandatory`, same as the Desa section.

Reference: The Desa section in `app/tentang-sambelia/page.tsx` (lines 92-117) uses:
```tsx
<div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
  {desa.map((d, i) => (
    <div key={d.slug} className="snap-center shrink-0 w-[80vw] sm:w-[420px]">
      {/* card content */}
    </div>
  ))}
</div>
<p className="mt-3 text-center text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
```

- [ ] **Step 1: Create `app/profil-tim/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings } from '@/lib/settings'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import Image from 'next/image'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const ps = getPageSettings('profilTim')
  return {
    title: ps.seoTitle ?? 'Profil Tim',
    description: ps.seoDescription ?? 'Tim KKN-PPM UGM Melukis Sambelia.',
  }
}

const CLUSTER_ORDER = ['Saintek', 'Soshum', 'Agro', 'Medika'] as const
const CLUSTER_ACCENTS: Record<string, string> = {
  Saintek: '#3B82F6',
  Soshum: '#E3795C',
  Agro: '#99BA57',
  Medika: '#14A8E1',
}
const CLUSTER_LABELS: Record<string, string> = {
  Saintek: 'Sains & Teknologi',
  Soshum: 'Sosial & Humaniora',
  Agro: 'Agrokultur',
  Medika: 'Kesehatan',
}

export default function ProfilTimPage() {
  const ps = getPageSettings('profilTim')
  const members = getCollection('profilTim') as ProfilTimItem[]

  const grouped = members.reduce<Record<string, Record<string, ProfilTimItem[]>>>((acc, m) => {
    const year = m.year || '2026'
    const cluster = m.cluster || 'Saintek'
    if (!acc[year]) acc[year] = {}
    if (!acc[year][cluster]) acc[year][cluster] = []
    acc[year][cluster].push(m)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'PROFIL TIM'}
        title={ps.heroTitle ?? 'Tim Melukis Sambelia'}
        intro={ps.heroIntro ?? 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.'}
        tone="gold"
      />

      {years.map((year, yearIdx) => (
        <section key={year} className="relative overflow-hidden bg-page">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" opacity={0.4} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.4} />
          <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">
            <FadeIn>
              <SectionHeader
                kicker={`KKN ${year}`}
                title={`Tim ${year}`}
                intro={`Anggota KKN-PPM UGM Melukis Sambelia ${year}.`}
                tone="gold"
              />
            </FadeIn>

            {CLUSTER_ORDER.map((cluster) => {
              const clusterMembers = grouped[year]?.[cluster]
              if (!clusterMembers?.length) return null
              return (
                <div key={cluster} className="mt-8">
                  <h3
                    className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em]"
                    style={{ color: CLUSTER_ACCENTS[cluster] }}
                  >
                    {CLUSTER_LABELS[cluster]}
                  </h3>
                  <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
                    {clusterMembers.map((m) => (
                      <div key={m.slug} className="snap-center shrink-0 w-[75vw] sm:w-[280px]">
                        <div
                          className="glass-card glass-accent-top group relative h-full flex flex-col overflow-hidden"
                          style={{ '--accent-color': CLUSTER_ACCENTS[cluster] } as React.CSSProperties}
                        >
                          <div className="relative mx-auto mt-5 h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
                            <Image
                              src={m.photo}
                              alt={m.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="96px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 p-4 text-center">
                            <h4 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{m.name}</h4>
                            {m.role && <p className="mt-0.5 text-sm font-medium" style={{ color: CLUSTER_ACCENTS[cluster] }}>{m.role}</p>}
                            {m.description && <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-3">{m.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
                </div>
              )
            })}
          </div>
          {yearIdx < years.length - 1 && <MotifDivider />}
        </section>
      ))}

      {members.length === 0 && (
        <section className="relative overflow-hidden bg-page">
          <div className="relative mx-auto max-w-content px-4 py-16 text-center">
            <p className="text-ink/50">Belum ada data anggota tim. Data akan ditambahkan segera.</p>
          </div>
        </section>
      )}
    </>
  )
}
```

- [ ] **Step 2: Create `app/profil-tim/loading.tsx`**

Create a simple loading skeleton:

```tsx
import { SectionHeader } from '@/components/SectionHeader'

export default function Loading() {
  return (
    <>
      <div className="relative bg-gradient-to-b from-brown-950 to-brown-900 pt-32 pb-16 text-center">
        <div className="mx-auto max-w-content px-4">
          <div className="h-6 w-24 mx-auto mb-4 animate-pulse rounded bg-brown-800" />
          <div className="h-10 w-64 mx-auto mb-4 animate-pulse rounded bg-brown-800" />
          <div className="h-5 w-96 mx-auto animate-pulse rounded bg-brown-800" />
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-8">
        <SectionHeader kicker="..." title="..." intro="" tone="gold" />
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[280px] glass-card animate-pulse h-64" />
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Add Profil Tim to navigation in `components/Nav.tsx`**

Add `{ href: '/profil-tim', label: 'Profil Tim' }` to the "Profil" NAV_GROUPS items:

```ts
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Profil',
    items: [
      { href: '/tentang-sambelia', label: 'Tentang Sambelia' },
      { href: '/kegiatan', label: 'Kegiatan' },
      { href: '/profil-tim', label: 'Profil Tim' },
    ],
  },
  // ... rest unchanged
]
```

- [ ] **Step 4: Add Profil Tim to footer in `components/Footer.tsx`**

Add a link after "Kegiatan":

```tsx
<li><Link href="/kegiatan" className="transition-colors hover:text-goldSoft">Kegiatan</Link></li>
<li><Link href="/profil-tim" className="transition-colors hover:text-goldSoft">Profil Tim</Link></li>
```

- [ ] **Step 5: Add empty state message for profilTim in `lib/settings.ts`**

In `getEmptyStates()`, add:
```ts
profilTim: 'Belum ada data anggota tim. Data akan ditambahkan segera.',
```

In the `settingsSchema`, add to `emptyStates`:
```ts
profilTim: z.string().default('Belum ada data anggota tim. Data akan ditambahkan segera.'),
```

- [ ] **Step 6: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add app/profil-tim/ components/Nav.tsx components/Footer.tsx lib/settings.ts
git commit -m "feat: add Profil Tim page with scrollable cards per cluster"
```

---

## Task 11: End-to-End Verification

**Files:**
- No file changes — verification only

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Run unit tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 4: Run content validation**

Run: `node scripts/validate-content.mjs`
Expected: All content files pass

- [ ] **Step 5: Build the project**

Run: `npm run build`
Expected: Build succeeds without content validation errors

- [ ] **Step 6: Verify the Profil Tim page renders**

Start dev server and navigate to `/profil-tim` — should show the team member page with cluster grouping.

- [ ] **Step 7: Verify the card grid fix**

Navigate to `/kegiatan` and `/pariwisata` — small cards should no longer stretch to match the featured card's height.

- [ ] **Step 8: Verify the village enum**

Navigate to `/tentang-sambelia` — all 11 desa should display correctly with the new village names.

---

## Summary of All Changes

| Task | What | Why |
|------|------|-----|
| 1 | Update village enum to 11 real village names | Fix wrong/outdated enum values |
| 2 | Make Zod schemas forgiving (defaults + trim) | **Root cause fix** for missing CMS entries |
| 3 | Fix card grid — small cards auto-size | Visual layout fix |
| 4 | Validation API + revalidation API + error tracking | **Observability + instant cache busting** |
| 5 | GitHub Actions revalidation workflow | **Speed** — content appears instantly |
| 6 | CMS save notification + validation badge | **User feedback** in admin |
| 7 | Enhanced build-time validation script | **Safety net** — build fails on bad content |
| 8 | OAuth CSRF state verification | **Security** fix |
| 9 | Profil Tim schema + CMS collection | New CMS-managed content type |
| 10 | Profil Tim page UI (horizontally scrollable cards per cluster) + navigation | New team profile page |
| 11 | End-to-end verification | **Confidence** — everything works together |