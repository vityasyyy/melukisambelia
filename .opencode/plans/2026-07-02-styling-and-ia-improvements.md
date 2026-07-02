# Styling & Information Architecture Improvements

**Date**: 2026-07-02
**Branch**: main (target)
**Scope**: 6 styling fixes + IA improvements for cross-page linking and Lingkungan hub

---

## Problem Statement

1. The card grid layout is too large and the alternating pattern doesn't follow a clear visual rhythm
2. MotifFloater decorative elements never render (broken `<Image fill>` parent)
3. CSS animations are unreliable on mobile Safari
4. PageHero rings are too visually dominant and overlap text
5. Lingkungan analysis cards have unnecessary glass-card treatment
6. Lingkungan image containers show green backgrounds where images don't fill
7. Data pages (Kesehatan, Irigasi, Lingkungan, Air & Tanah) don't visually link to the Peta page
8. The Lingkungan page's purpose is unclear — it should be a hub for all environment-related content

---

## 1. Grid Layout — Compact Alternating Pattern

### Current behavior
- `AlternatingCardGrid` renders cards in a `max-w-content` (1200px) container with a 5-column grid at `lg`
- Cards have `gap-5` spacing and `p-5` internal padding
- The alternating logic groups items in 3+2 patterns

### New behavior
Reduce the grid container to `max-w-4xl` (896px) for better proportions. Implement the following layout pattern:

| Item count | Layout description |
|---|---|
| 1 | Single full-width big card |
| 2 | 2 equal columns side-by-side |
| 3 | 1 big (3/5 width) + 2 small stacked (2/5 width), big on left for group 0 |
| 4 | Row 1: 1 big + 2 small, Row 2: 1 big full-width |
| 5 | Row 1: 1 big left + 2 small right, Row 2: 2 small left + 1 big right |
| 6 | Row 1: 1 big left + 2 small right, Row 2: 2 small left + 1 big right |
| 7+ | Continue alternating 3-item and 2-item groups |

### Implementation
- In `AlternatingCardGrid.tsx`: Change outer container to use `max-w-4xl` class (pass via className prop from parent pages)
- Reduce `gap-5` to `gap-4`
- Keep the 5-column grid pattern (`grid-cols-5` at `lg`, `grid-cols-2` at `sm`, `grid-cols-1` at mobile)
- The existing grouping logic is mostly correct; just needs to handle the 2-item group case (big card full-width) and ensure proper alternating
- Card padding: reduce from `p-5` to `p-4` in `DataCard`, `LingkunganCardGrid`, and other card components

---

## 2. MotifFloater — Fix Image Rendering

### Root cause
`MotifFloater.tsx` uses `<Image fill>` from Next.js, which requires:
1. The parent element to have `position: relative`
2. The parent element to have explicit width and height

Currently:
- The outer `motion.div` has `absolute` positioning and size classes (`w-40 h-40` etc.)
- The inner `div.motif-glow` has animation classes but no `position: relative`
- The `div.motif-float` (for flowers) also has animation but no `position: relative`
- Result: Next.js reports "parent element with invalid position — provided static" and "height value of 0"

### Fix
In `MotifFloater.tsx`:
- Add `relative` to the `div` with `motif-glow` class (the direct parent of non-flower images)
- Add `relative` to the `div` with `motif-float` class (the direct parent of flower images)
- Ensure the outer `motion.div` size classes (`w-40 h-40` etc.) are applied so the `<Image fill>` has dimensions to fill

---

## 3. Safari Animation Fix

### Root cause
Safari on iOS has known issues with:
1. CSS animations + `backdrop-filter` (used in `glass-card`)
2. `will-change: transform` on elements inside `overflow-hidden` containers
3. Framer Motion's `useReducedMotion()` potentially suppressing animations

### Fix
- In `globals.css`: Add `-webkit-transform: translate3d(0,0,0)` to the `motif-rotate` and `motif-rotate-reverse` keyframes (already partially done via inline styles, but the CSS keyframes themselves need it)
- Add a `@media (prefers-reduced-motion: no-preference)` wrapper for animation declarations (keep the existing reduced-motion override that disables animations)
- In `glass-card` hover transition: separate `transform` and `backdrop-filter` into different transition properties to avoid Safari compositing conflicts. Change the hover transform to only apply on `@media (hover: hover)` devices to avoid sticky hover on touch
- In `MotifFloater.tsx`: The `useReducedMotion()` check already suppresses Framer Motion animations when reduced motion is preferred. Keep this but add a fallback: when reduced motion is detected, still render the floaters but without animation (static, with opacity 0.7)

---

## 4. PageHero — Subdue Decorative Rings

### Current behavior
- Ring wrapper: `z-[1]`, flower wrappers: `z-[1]`
- Text content: `z-10`
- Gradient overlay: `z-[2]` (but with only `rgba(26,17,13,0.6)` inset shadow)
- Ring opacity: 0.7, flower opacity: 0.75/0.65

### Fix
- Ring wrapper: change from `z-[1]` to `z-0`
- Flower wrappers: change from `z-[1]` to `z-0`
- Gradient overlay div: change from `z-[1]` to `z-[2]`
- Bottom accent band: keep at `z-[2]`
- Text content: keep at `z-10`
- Ring opacity: reduce from 0.7 to 0.35
- Left flower opacity: reduce from 0.75 to 0.4
- Top-right flower opacity: reduce from 0.65 to 0.3
- Add an additional gradient overlay above the motifs: a radial gradient from transparent center to semi-opaque edges, ensuring text readability over any motif placement

---

## 5. Lingkungan — Remove Card Treatment from Analysis Items

### Current behavior
All items in `LingkunganCardGrid` render as `glass-card glass-accent-top` with `aspect-video` image containers, category badges, titles, and descriptions.

### New behavior
Analysis items (the 3 items from `content/lingkungan/`) should render as a simple linked list — not image cards. Only the GIS/Peta Tematik items should retain the glass-card treatment.

### Implementation
Create two distinct rendering paths in the Lingkungan page:

**Analysis section** — A clean list of analysis items:
- Each item: category chip + title + short description + "Lihat analisis →" link
- No image, no glass-card treatment
- Compact, scannable layout (like a table of contents)
- Layout: vertical stack with subtle dividers

**Peta Tematik GIS section** — Keep the existing `GisCardGrid` with glass-card treatment, since these are addable/viewable map files that benefit from image previews.

The `LingkunganCardGrid` component should be refactored:
- `AnalysisList` — New component for the simple linked list
- `GisCardGrid` — Keep existing card grid for GIS files

---

## 6. Lingkungan — Fix Green Background on Image Containers

### Current behavior
`LingkunganCardGrid.tsx:32` sets `bg-green-50` on the `aspect-video` image container.

### Fix
Change `bg-green-50` to `bg-white` (or `bg-cream-light` using the CSS variable `var(--cream-light)`) to match the page background. This ensures that when an image doesn't fully fill the container, the visible background is neutral rather than tinted green.

Note: Since we're removing the glass-card treatment from analysis items entirely (issue 5), this fix only applies to `GisCardGrid` image containers. Change the `bg-green-50` in `GisCardGrid` to `bg-white`.

---

## 7. Cross-Page Peta Linking

### Current behavior
Only the Lingkungan page links to the Peta page (via `/peta?tab=vegetasi`). Kesehatan and Irigasi pages have geolocated data that appears on the Peta map but don't show any connection.

### New behavior
Add visual Peta linking to all data pages that have map presence:

**Per-item badge**: Items that appear on the Peta map get a small badge using `lucide-react`'s `MapPin` icon:
- Kesehatan items: each card shows a `MapPin` icon chip with "Di peta" label
- Irigasi items: each card shows a `MapPin` icon chip with "Di peta" label
- Pariwisata items: already link to detail pages, add the same badge

**Section-level CTA**: Each section page gets a "Lihat di Peta Interaktif →" button at the bottom, linking to the relevant map tab:
- `/kesehatan` → `/peta?layer=kesehatan`
- `/irigasi` → `/peta?layer=irigasi`
- `/lingkungan` → `/peta?tab=vegetasi` (already exists)
- `/air-tanah` → `/peta?tab=air`

**Badge implementation**: Create a `MapLinkBadge` component using `lucide-react` `MapPin` icon, styled as a small inline badge with the tone color of the page.

---

## 8. Lingkungan Hub Page — Information Architecture

### Current behavior
`/lingkungan` shows only 3 analysis cards (Vegetasi, Erosi, Blue Carbon) and a GIS section. It's unclear what this page is for and how it connects to other environment data.

### New behavior
Transform `/lingkungan` into an environment hub page with sub-sections, each linking to its detail:

| Hub Section | Content | Links To |
|---|---|---|
| **Air & Tanah** | Water quality + groundwater level data | `/air-tanah` + `/peta?tab=air` |
| **Vegetasi** | Vegetation index analysis | `/peta?tab=vegetasi` |
| **Erosi** | Coastal erosion analysis | `/peta?tab=erosi` |
| **Blue Carbon** | Mangrove carbon analysis | `/peta?tab=blue-carbon` |
| **Irigasi & Kekeringan** | Irrigation network + drought data | `/irigasi` |
| **Peta Tematik GIS** | Interactive map files | GIS file cards (existing) |

### Implementation
Refactor `/lingkungan/page.tsx`:
- Remove `LingkunganCardGrid` import (replaced by `AnalysisList`)
- Add a hub layout with 6 sub-sections
- Each sub-section is a compact row or card with: icon/badge, title, 1-line description, and link CTA
- The "Air & Tanah" section links to `/air-tanah`
- The "Irigasi & Kekeringan" section links to `/irigasi`
- The Vegetasi/Erosi/Blue Carbon sections link to `/peta?tab=...`
- Keep the existing "Peta Tematik GIS" section with `GisCardGrid`

### CMS alignment
The content table the team wants maps to these routes:

| Content | Website Section | Route | Format |
|---|---|---|---|
| Tourist attraction geotagging | Pariwisata | `/pariwisata` | GIS, coordinates |
| Community health statistics | Kesehatan | `/kesehatan` | Table |
| Water quality + GWL data | Air & Tanah | `/air-tanah` | Table, chart |
| Iso-DHL & GWL maps | Lingkungan → Air & Tanah | `/air-tanah` + `/peta?tab=air` | GIS, PDF, image |
| Irrigation network map | Irigasi | `/irigasi` | PDF, image |
| Drought-prone area map | Irigasi | `/irigasi` | PDF, image |
| Vegetation index map | Lingkungan | `/lingkungan` + `/peta?tab=vegetasi` | GIS |
| Erosion susceptibility map | Lingkungan | `/lingkungan` + `/peta?tab=erosi` | GIS |
| Blue carbon map | Lingkungan | `/lingkungan` + `/peta?tab=blue-carbon` | GIS |
| Mangrove cracker MSME | UMKM | `/umkm` | Text, images |
| Digital village profile | Tentang Sambelia | `/tentang-sambelia` | Text, images |
| Local products promotion | UMKM | `/umkm` | Text, images |

This is already mostly aligned with the current CMS structure. The main changes are:
- Content files stay in their current directories (no folder restructuring)
- Routes stay top-level (no nesting under `/lingkungan`)
- Lingkungan becomes a hub that links outward
- Air & Tanah page gets a "Lihat di Peta" link for water/GWL maps
- GIS manifest categories may need `air` and `erosi` tabs in addition to existing `vegetasi`

---

## File Change Summary

| File | Change |
|---|---|
| `components/AlternatingCardGrid.tsx` | Rewrite grid pattern, add `max-w-4xl` support, reduce gaps |
| `components/MotifFloater.tsx` | Add `relative` to inner divs for `<Image fill>`, reduced motion fallback |
| `components/PageHero.tsx` | Lower z-index of decorative elements, reduce opacity, add overlay gradient |
| `components/LingkunganCardGrid.tsx` | Split into `AnalysisList` + `GisCardGrid`, fix `bg-green-50` → `bg-white` |
| `app/lingkungan/page.tsx` | Refactor as hub page with sub-sections, add cross-links |
| `components/DataCard.tsx` | Reduce padding `p-5` → `p-4` |
| `components/MapLinkBadge.tsx` | New component — small badge with MapPin icon for "Di peta" indicator |
| `components/KesehatanListClient.tsx` | Add MapLinkBadge to each card + section CTA |
| `components/IrigasiListClient.tsx` | Add MapLinkBadge to each card + section CTA |
| `app/air-tanah/AirTanahClient.tsx` | Add "Lihat di Peta" CTA |
| `app/globals.css` | Safari animation fixes, glass-card hover separation |