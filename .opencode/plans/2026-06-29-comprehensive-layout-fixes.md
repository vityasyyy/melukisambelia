# Final Implementation Plan: All Fixes + Decorations

Date: 2026-06-29 (Updated)

## Overview

Three categories of work:
1. **Layout/overflow fixes** — Fix all 56 issues from the audit
2. **Remove "ring" from hero** — The cincin_sambel.svg (ring) MotifDivider on the homepage
3. **Propagate batik motif** — Add batik watermark to hero section and all subpage sections, add MotifDividers between sections on all pages

## 1. Layout & Overflow Fixes

### DetailModalClient.tsx
- Add `overflow-hidden` to outer `DialogPrimitive.Content` className
- Change close button z-index from `z-30` to `z-[1002]`
- Change Maps link `py-2` to `py-2.5`

### BackToTop.tsx
- Change `z-40` to `z-[1001]`

### StatCard.tsx
- Add `h-full flex flex-col` to outer div

### CountUpStat.tsx
- Add `h-full flex flex-col` to outer div

### PetaSection.tsx
- Add `h-full flex flex-col` to card wrapper
- Change `min-w-0 p-4` to `min-w-0 flex-1 p-4` on content area
- Add `overflow-hidden` to iframe/pdf container

### CeritaStats.tsx
- Add `h-full flex flex-col` to the Link card
- Add `h-full` to the inner grid div
- Remove `sm:aspect-auto` from image div
- Change `min-w-0 p-5` to `min-w-0 flex-1 p-5` on text area

### Nav.tsx
- Change `aria-expanded={undefined}` to `aria-expanded={groupActive}`
- Change `max-sm:left-0 max-sm:-translate-x-0` to `max-lg:left-0 max-lg:-translate-x-0`

### globals.css
- Add `overflow-wrap: break-word; word-break: break-word;` to body
- Add `scrollbar-width: none;` to `.scrollbar-none`
- Change skip-link `z-index: 100` to `z-index: 1001`

### SectionHeader.tsx
- Add `break-words` to title h2

### FestivalTimeline.tsx
- Change dot from `-left-[33px] sm:-left-[35px]` to `left-0 -translate-x-1/2`
- Add `break-words` to event name h2

### CountdownStrip.tsx
- Add `break-words` to event name paragraph

### ShareButtons.tsx
- Change `py-2` to `py-2.5` on all buttons for touch targets

### Breadcrumb.tsx
- Add `max-w-[200px] truncate` to current page span
- Add `max-w-[160px] sm:max-w-none truncate sm:truncate-none` to link items

### lingkungan/page.tsx
- Change `flex h-full items-center justify-center` to `absolute inset-0 flex items-center justify-center` for non-image placeholders

## 2. Remove "Ring" from Hero

The `MotifDivider motif="cincin_sambel"` on the homepage (app/page.tsx line 89) uses the `cincin_sambel.svg` which is literally a ring shape. The user wants this removed.

**Action:** Change `<MotifDivider motif="cincin_sambel" />` to `<MotifDivider motif="batik_sambel" />` on the homepage, or remove it entirely if the user prefers.

Actually, re-reading the user's request: "remove the ring from the hero page" — this likely means remove the cincin_sambel divider that appears between sections on the homepage. The cincin_sambel SVG is a literal ring/circle shape that may look odd.

**Decision:** Replace `motif="cincin_sambel"` with `motif="bunga_sambel"` (flower motif) on the homepage, as it's more decorative and less ring-like.

## 3. Propagate Batik Motif

### Current state:
- Homepage hero (`HeroAnimation`) — NO batik watermark, only gradient overlays
- Homepage tentang section (line 72) — HAS batik watermark via `section-watermark`
- All `PageHero` components — HAS batik watermark via `section-watermark` (line 37)
- All other page sections — NO batik watermark

### What the user wants:
- The batik motif should extend through the hero section (not just one section)
- The batik motif should be visible on subpages too (it already is on PageHero sections)
- Add more decorative motifs throughout pages

### Actions:

#### A. Add batik watermark to HeroAnimation
In `HeroAnimation.tsx`, add the batik watermark as one of the overlay layers. Currently there are 3 overlay divs (gradient, radial, shadow). Add a 4th overlay for the batik watermark:

```tsx
<div
  aria-hidden
  className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
  style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')", backgroundSize: '1200px auto' }}
/>
```

This should go BEFORE the inner shadow overlay (z-[2]) so the watermark is visible through it.

#### B. Add MotifDividers between sections on ALL pages
Add `MotifDivider` between major sections on each page. Rotate between motifs:
- `batik_sambel` — repeating pattern, good for section breaks
- `bunga_sambel` — flower motif, good for decorative breaks
- `cincin_sambel` — ring motif (the user may not want this one, but it can be used sparingly)

**Pages to add dividers:**

- `app/tentang-sambelia/page.tsx` — Add between section 01 and 02, between 02 and 03
- `app/festival/page.tsx` — Add between countdown and timeline sections
- `app/cerita/page.tsx` — Add after hero, before cards
- `app/pariwisata/page.tsx` — not needed (delegates to PariwisataListClient)
- `app/umkm/page.tsx` — not needed (delegates to UmkmListClient)
- `app/kesehatan/page.tsx` — not needed (delegates to KesehatanListClient)
- `app/irigasi/page.tsx` — not needed (delegates to IrigasiListClient)
- `app/peta/page.tsx` — Add between map and sections
- `app/air-tanah/page.tsx` — Add between hero and content
- `app/lingkungan/page.tsx` — Add between hero and content

**Homepage (app/page.tsx):** Change `motif="cincin_sambel"` to `motif="bunga_sambel"` on the existing divider.

#### C. Add batik watermark to section backgrounds on key pages
For pages that have multiple sections (tentang-sambelia, festival), add `section-watermark` class to section containers that don't already have it.

For tentang-sambelia: The section at line 71 already has `section-watermark`. Add it to sections 02 and 03 as well.

#### D. Add subtle decoration to PageHero
The PageHero already has `section-watermark`. Consider adding a subtle bottom border decoration — perhaps a thin gold gradient line at the bottom of the hero, or a small motif SVG.

Add a bottom decoration to PageHero:
```tsx
<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" aria-hidden />
```

This adds a subtle gold line at the bottom of every page hero, creating visual separation and decoration.

## 4. Additional Decorations

### Add MotifDivider to CeritaStats section on homepage
The homepage's section 06 (Cerita & Data) doesn't have a divider before it. Add one.

### Add bottom gold accent to cards
In DataCard and UmkmCard, the accent bar at the top is good. Consider adding a very subtle bottom border that echoes the accent color, creating a framed look. This is optional — the current design is clean.

### Add scroll-triggered animations
The `FadeIn` and `StaggerContainer`/`StaggerItem` components already handle this. No changes needed.

## Implementation Priority
1. Layout fixes (most important)
2. Hero batik watermark + remove ring
3. MotifDividers across pages
4. PageHero decorations