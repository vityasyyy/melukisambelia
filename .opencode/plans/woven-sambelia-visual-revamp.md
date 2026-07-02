# Woven Sambelia Visual Revamp

**Date:** 2026-07-02  
**Status:** Draft  
**Scope:** All pages — card/grid system, section headers, timeline, bug fixes

---

## Problem

1. **Cards and grids are bland** — uniform white cards with left-border accents feel templated and generic. No personality or connection to Sambelia's cultural identity.
2. **Pariwisata header floaters are invisible** — the `MotifFloater` flowers and ring motif don't show up well against the light `bg-cream-warm/30` background, unlike Tentang Sambelia's darker section backgrounds where they're visible.
3. **Bug: Kabupaten shows "0"** — `CountUpStat` parses "Lombok Timur" as a number, gets `NaN`, renders `0`.
4. **Festival timeline is upside down** — user wants chronological (oldest top, newest bottom), but also wants it more creative with decorative connectors.
5. **Section headers missing on Pariwisata** — Tentang Sambelia has `SectionHeader` with kicker badge + title bar; Pariwisata jumps straight to the grid.

---

## Design Direction: "Woven Sambelia"

**Core idea:** The batik watermark and decorative motifs are already in the design but barely visible. Make them shine through frosted-glass cards that feel like gauze laid over a batik cloth — the pattern breathes through.

### Palette

The existing palette is strong and culturally grounded. No changes to color tokens — we use what's there, more intentionally:

- **Glass card:** `bg-white/70 backdrop-blur-md border border-white/50`
- **Glass card (hover):** `bg-white/80 backdrop-blur-lg border-white/70`
- **Section underlays:** Increase `section-watermark` opacity from `0.08` → `0.14`
- **MotifFloater:** Increase base opacity from `0.7` → `0.8`; on lighter sections, adjust color filters for more contrast
- **Card accent strip:** Each card gets a gradient top-edge strip in the section's tone color (replacing the current `border-l-[3px]`)

### Typography

No changes — existing `beautique` / `beautique-condensed` / `dmSans` stack is distinctive and working.

### Layout: Featured Card + Grid

For sections with 3+ cards, the first card spans 2 columns (on `lg:` breakpoint), creating visual rhythm:

```
Desktop (lg+):
+------------------------++----------+
|     Featured Card      ||  Card 2  |
|     (col-span-2)       ||          |
+------------------------++----------+
+----------++----------++----------+
|  Card 3  ||  Card 4  ||  Card 5  |
+----------++----------++----------+

Mobile:
All cards stack in single column, no featured layout.
```

For stat grids (4-column), keep uniform — featured layout doesn't apply to small stat cards.

### Card Components

#### DataCard (image cards — pariwisata, kesehatan, kegiatan, wisata unggulan)

- Replace `border-l-[3px]` + solid white bg with:
  - `bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl`
  - A 2px gradient top strip: `before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:rounded-t-2xl before:bg-gradient-to-r before:from-transparent before:via-{accent} before:to-transparent`
- Hover: `bg-white/80 backdrop-blur-lg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]`
- Image area: add a subtle gradient overlay that transitions into the glass card below

#### UmkmCard

Same glass treatment as DataCard, with terracotta accent strip.

#### StatCard / CountUpStat

- Glass treatment with `bg-white/60 backdrop-blur-md border border-white/40`
- Colored gradient strip at top (matches section tone)
- CountUpStat: detect purely-text values (like "Lombok Timur") and render them as a static label instead of trying to parse as number

#### ContentCard (generic wrapper)

Same glass background, accent top strip.

#### Inline cards (lingkungan, jejaki, kegiatan homepage)

Unify to use the same glass treatment. For the jejaki horizontal scroll cards, apply the same glass + accent strip.

### Section Headers

**Add `SectionHeader` to every page section that's missing it.** Currently Pariwisata, UMKM, Kesehatan, Irigasi, Kegiatan, and Lingkungan pages jump from `PageHero` straight to the grid without a section header. Add a `SectionHeader` with kicker, title, and intro to each, matching the pattern from Tentang Sambelia.

This also means adding corresponding page settings fields (`sectionKicker`, `sectionTitle`, `sectionIntro`) to the content settings.

### Festival Timeline

**Order:** Sort by `schedule` date ascending (oldest first at top, newest at bottom). This is the current behavior — verify it's correct.

**Visual redesign — "Woven Thread" connector:**

Replace the simple vertical dot-line with an SVG ribbon that undulates between events:

```
    o---- Peresean (Jul 15)
   /
  /
  ~~~ decorative loop
  \
   o---- Pawai Dulangan (Jul 20)
    \
     ~~~ decorative loop
      o---- Gendang Beleq (Aug 1)
```

Implementation:
- Use a CSS pseudo-element or inline SVG with a wavy/curved path in terracotta gradient
- Each node point gets a circular marker with a small batik ornament inside (or a subtle gradient fill)
- The connecting "thread" uses `bg-gradient-to-b from-terracotta-500/40 via-gold-500/30 to-terracotta-500/20`
- Add decorative "loose string" curls at the start and end of the timeline

### Pariwisata Header Fix

Add a `SectionHeader` component between `PageHero` and the grid, with kicker "PARIWISATA", title "Destinasi Wisata Sambelia", and the intro text. Increase `MotifFloater` visibility on the light `bg-cream-warm/30` background by:
- Using darker color filters (more contrast)
- Increasing opacity to `0.85`

### Bug Fix: Kabupaten "0"

In `CountUpStat.tsx`, detect when the value has no digits and render as a static text label instead of an animated number:

```tsx
const hasDigits = /\d/.test(value)
const numValue = hasDigits ? parseNumber(value) : null
const suffix = hasDigits ? value.replace(/[\d,.±\s]/g, '').trim() : ''
const prefix = hasDigits && value.startsWith('±') ? '±' : ''

// If no digits, render as a text label
if (!hasDigits) {
  return <StatLabel label={label} value={value} />
}
// Otherwise, render animated counter as before
```

The text label uses `font-beautique text-2xl sm:text-3xl` styling (same sizing as the number, but without animation).

---

## Implementation Plan

### Phase 1: Bug Fixes (quick wins)

1. **Fix CountUpStat for text values** — Update `components/CountUpStat.tsx` to detect purely-text values and render them as static labels
2. **Fix festival timeline order** — Verify content ordering is chronological (oldest first); if not, sort by `schedule` date in the component

### Phase 2: Card System Revamp

3. **Create shared card CSS utilities in `globals.css`** — Add reusable glass card classes:
   - `.glass-card` — base glass treatment
   - `.glass-card-hover` — hover state
   - `.glass-accent-top` — gradient accent strip (parameterized by color)
   - `.glass-accent-left` — gradient accent strip for left (alternative)
4. **Update `DataCard.tsx`** — Apply glass card treatment with accent top strip
5. **Update `UmkmCard.tsx`** — Same glass treatment with terracotta accent
6. **Update `StatCard.tsx`** — Glass treatment with gold gradient strip
7. **Update `CountUpStat.tsx`** — Glass treatment with gold gradient strip + text value detection
8. **Update `ContentCard.tsx`** — Glass treatment
9. **Update inline cards** in:
   - `app/page.tsx` (jejaki cards, kegiatan cards)
   - `app/lingkungan/page.tsx` (environment cards, GIS cards)
   - `app/tentang-sambelia/page.tsx` (geography prose card, village cards, potensi cards)
   - `components/KegiatanStats.tsx` (kegiatan cards)
10. **Increase `section-watermark` opacity** from `0.08` to `0.14` in `globals.css`

### Phase 3: Grid Layout — Featured Card

11. **Update grid sections** to use featured card layout (first card `lg:col-span-2`):
    - `PariwisataListClient.tsx`
    - `KesehatanListClient.tsx`
    - `UmkmListClient.tsx`
    - `WisataUnggulanClient.tsx`
    - `app/kegiatan/page.tsx`
    - `app/lingkungan/page.tsx`
    - `app/tentang-sambelia/page.tsx` (potensi section)
    - `components/KegiatanStats.tsx`

### Phase 4: Section Headers

12. **Add `SectionHeader` to all page content sections** that are missing them:
    - `PariwisataListClient.tsx` — add SectionHeader
    - `IrigasiListClient.tsx` — add SectionHeader above stats
    - `KesehatanListClient.tsx` — add SectionHeader above stats
    - `UmkmListClient.tsx` — add SectionHeader with kategori filter
    - `app/kegiatan/page.tsx` — add SectionHeader
    - `app/lingkungan/page.tsx` — add SectionHeader
    - `components/KegiatanStats.tsx` — already has one
13. **Add section kicker/title/intro settings** to `_settings.md` for each page section that needs a header

### Phase 5: Festival Timeline Redesign

14. **Redesign `FestivalTimeline.tsx`** — Replace simple dot-line with:
    - Wavy SVG ribbon connector between events
    - Circular node markers with gradient fill
    - Decorative "loose string" curls at timeline start/end
    - Glass card treatment for event cards
    - Ensure chronological order (oldest top, newest bottom)

### Phase 6: MotifFloater Visibility

15. **Improve MotifFloater visibility on light backgrounds**:
    - Increase default opacity from `0.7` to `0.8`
    - For sections with light backgrounds (`bg-cream-warm/30`, `bg-cream-beige/50`, `bg-olive/5`), adjust MotifFloater color props to use darker/more saturated colors
    - Apply to: Pariwisata, UMKM, Kesehatan, Irigasi sections

### Phase 7: Verification

16. **Visual QA** — Run dev server, verify:
    - All cards have glass treatment with visible accent strips
    - Featured cards span 2 columns on desktop
    - Section headers appear on all pages
    - Kabupaten shows "Lombok Timur" instead of "0"
    - Festival timeline is chronological with decorative connectors
    - Batik watermark is visible through cards
    - MotifFloater flowers are visible on all section backgrounds
    - Mobile layouts still work (cards stack, featured card becomes full-width)

---

## Files to Modify

| File | Changes |
|------|---------|
| `app/globals.css` | Add glass card utilities, increase watermark opacity |
| `components/DataCard.tsx` | Glass card treatment + accent top strip |
| `components/UmkmCard.tsx` | Glass card treatment + terracotta accent |
| `components/StatCard.tsx` | Glass card treatment + gold accent |
| `components/CountUpStat.tsx` | Glass treatment + text value detection + gold accent |
| `components/ContentCard.tsx` | Glass card treatment |
| `components/FestivalTimeline.tsx` | Woven thread redesign + order fix |
| `components/PariwisataListClient.tsx` | SectionHeader + featured grid + glass cards |
| `components/IrigasiListClient.tsx` | SectionHeader + glass stats |
| `components/KesehatanListClient.tsx` | SectionHeader + featured grid + glass cards |
| `components/UmkmListClient.tsx` | SectionHeader + featured grid + glass cards |
| `components/WisataUnggulanClient.tsx` | Featured grid + glass cards |
| `components/KegiatanStats.tsx` | Glass cards + featured layout |
| `app/page.tsx` | Glass jejaki cards + glass kegiatan cards |
| `app/tentang-sambelia/page.tsx` | Glass stat cards + glass potensi cards |
| `app/kegiatan/page.tsx` | SectionHeader + featured grid + glass cards |
| `app/lingkungan/page.tsx` | SectionHeader + glass cards + featured grid |
| `app/festival/page.tsx` | Glass timeline cards |
| `content/_settings.md` | Add section header settings for each page |