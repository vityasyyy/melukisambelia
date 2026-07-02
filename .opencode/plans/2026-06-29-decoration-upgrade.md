# Decoration Upgrade Plan — Batik Everywhere + Floating Motifs

## Goal
1. Remove the cincin (ring) MotifDivider from homepage
2. Add batik watermark (`section-watermark`) to ALL page sections (not just tentang)
3. Add floating cincin/bunga/ornament decorations on every page with varied positions
4. Make every page feel rich and decorated, not cookie-cutter — vary positions per page

## Assets Available
- `batik_sambel.svg` — repeating tile pattern (used in `section-watermark` at 6% opacity)
- `cincin_sambel.svg` — ring/circle motif
- `bunga_sambel.svg` — flower motif
- `ornament-gold.png` — gold ornament image

## Part 1: Remove Ring Divider from Homepage

**File:** `app/page.tsx`
- Line 89: `{/* <MotifDivider motif="cincin_sambel" /> */}` — already commented out. Delete the comment entirely.
- Remove the `MotifDivider` import if no longer used on this page.

## Part 2: New `MotifFloater` Component

Create a new client component `components/MotifFloater.tsx` that renders a positioned decorative motif SVG. It should:

- Accept `motif` (cincin_sambel | bunga_sambel | ornament-gold), `position` (top-left, top-right, bottom-left, bottom-right, center-left, center-right), `opacity` (default 0.06-0.08), `size` (sm/md/lg), and `color` (terracotta/gold/water/olive/brown) for tinting
- Use absolute positioning within a relative parent
- Be `pointer-events-none` and `aria-hidden`
- Use subtle animation (slow float or pulse) respecting `prefers-reduced-motion`
- The SVGs are monochrome outlines, so we can apply CSS `filter: sepia() hue-rotate() saturate()` or use `mix-blend-mode` to tint them with warm colors

```tsx
// Position classes map
const POSITIONS = {
  'top-left': 'top-8 left-4 sm:left-8',
  'top-right': 'top-8 right-4 sm:right-8',
  'bottom-left': 'bottom-8 left-4 sm:left-8',
  'bottom-right': 'bottom-8 right-4 sm:right-8',
  'center-left': 'top-1/2 -translate-y-1/2 left-4 sm:left-8',
  'center-right': 'top-1/2 -translate-y-1/2 right-4 sm:right-8',
}

// Size classes map
const SIZES = {
  sm: 'w-16 h-16 sm:w-20 sm:h-20',
  md: 'w-24 h-24 sm:w-32 sm:h-32',
  lg: 'w-32 h-32 sm:w-40 sm:h-40',
}

// Color filter map (using CSS filters to tint SVGs)
const COLOR_FILTERS = {
  terracotta: 'sepia(0.6) hue-rotate(-10deg) saturate(2)',
  gold: 'sepia(0.8) hue-rotate(-5deg) saturate(1.5)',
  water: 'sepia(0.3) hue-rotate(170deg) saturate(2)',
  olive: 'sepia(0.5) hue-rotate(60deg) saturate(1.5)',
  brown: 'sepia(0.7) saturate(1.5)',
}
```

## Part 3: Add `section-watermark` to All Sections on Homepage

**File:** `app/page.tsx`

The tentang section (line 72) already has `<div className="absolute inset-0 -z-10 section-watermark" aria-hidden />`. Add this to ALL other sections:

- Section "Jejaki Sambelia" (line 91) — add watermark div
- Section "Wisata Unggulan" (line 106) — add watermark div  
- Section "Festival Terdekat" (line 144) — add watermark div
- Section "UMKM Spotlight" (line 172) — add watermark div
- CeritaStats section (line 199) — add watermark div

Each section needs:
1. `relative` class added to the section (some may already have it)
2. `<div className="absolute inset-0 -z-10 section-watermark" aria-hidden />` as first child

Also add it to the HeroAnimation component (see Part 5).

## Part 4: Add `section-watermark` to All Subpage Sections

### tentang-sambelia/page.tsx
- Sections 02 (line 70) and 03 (line 102) — add watermark + `relative` class

### festival/page.tsx
- Sections at line 38 and 42 — add watermark + `relative`

### cerita/page.tsx
- Section at line 33 — add watermark + `relative`

### peta/page.tsx
- Section at line 44 — add watermark + `relative`

### lingkungan/page.tsx
- Section at line 37 — already inside the section, add watermark + `relative`

### air-tanah/AirTanahClient.tsx
- Main div at line 21 — add watermark + `relative`

### Client components (PariwisataListClient, UmkmListClient, KesehatanListClient, IrigasiListClient)
- Each has a PageHero (which already has watermark) and content sections below it
- Add watermark to their content sections

## Part 5: Add Batik Watermark to HeroAnimation

**File:** `components/HeroAnimation.tsx`

Add a batik watermark overlay layer between the gradient overlays and the inner shadow. Insert after line 66 (the radial gradient overlay) and before line 67 (the inner shadow):

```tsx
<div
  aria-hidden
  className="pointer-events-none absolute inset-0 z-[1]"
  style={{
    backgroundImage: "url('/images/design-system/batik_sambel.svg')",
    backgroundSize: '1200px auto',
    backgroundPosition: 'center',
    opacity: 0.04,
  }}
/>
```

## Part 6: Floating Motif Decorations Per Page

Each page gets 2-3 floating motifs with DIFFERENT positions and motifs so no two pages look identical.

### Homepage (app/page.tsx)
- tentang section: bunga_sambel, top-right, md, gold
- jejaki section: cincin_sambel, bottom-left, sm, terracotta
- wisata section: bunga_sambel, center-right, lg, water
- festival section: cincin_sambel, top-left, md, gold
- umkm section: bunga_sambel, bottom-right, sm, olive

### tentang-sambelia/page.tsx
- section 01 (geografi): cincin_sambel, top-right, md, terracotta
- section 02 (desa binaan): bunga_sambel, bottom-left, lg, gold
- section 03 (potensi): cincin_sambel, center-right, md, olive

### festival/page.tsx
- countdown section: bunga_sambel, top-left, md, gold
- timeline section: cincin_sambel, bottom-right, lg, terracotta

### cerita/page.tsx
- content section: bunga_sambel, top-right, md, brown, cincin_sambel bottom-left sm olive

### peta/page.tsx
- content section: cincin_sambel, top-right, md, water, bunga_sambel center-left sm gold

### lingkungan/page.tsx
- content section: bunga_sambel, bottom-right, md, green, cincin_sambel top-left sm olive

### air-tanah/AirTanahClient.tsx
- main section: cincin_sambel, top-left, md, water

### PariwisataListClient.tsx
- content section: bunga_sambel, top-right, md, water, cincin_sambel bottom-left sm terracotta

### UmkmListClient.tsx
- content section: cincin_sambel, center-right, md, gold, bunga_sambel bottom-left sm olive

### KesehatanListClient.tsx
- content section: bunga_sambel, top-left, md, olive, cincin_sambel bottom-right sm water

### IrigasiListClient.tsx
- content section: cincin_sambel, top-right, md, green, bunga_sambel bottom-left sm gold

## Part 7: Add Gold Accent Line to PageHero

**File:** `components/PageHero.tsx`

Add a subtle gold gradient line at the bottom of every PageHero for visual separation:

```tsx
<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" aria-hidden />
```

## Implementation Order

1. Create `MotifFloater` component
2. Add `section-watermark` to HeroAnimation
3. Add `section-watermark` to all homepage sections
4. Add `section-watermark` to all subpage sections
5. Add gold accent line to PageHero
6. Remove cincin MotifDivider comment from homepage
7. Add MotifFloater decorations to each page (homepage first, then each subpage)
8. Verify build passes