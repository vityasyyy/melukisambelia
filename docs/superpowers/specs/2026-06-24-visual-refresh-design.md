# Melukis Sambelia — Visual Refresh Design Spec

**Date:** 2026-06-24
**Status:** Approved (verbal)
**Project:** Melukis Sambelia — whole-site visual refresh, clean/modern Figma-informed interpretation

## 1. Overview

Refresh the entire public-facing Melukis Sambelia website so it feels prettier, more cohesive, and faithful to the team's Figma design language — without literally copying the pitch-deck / social-media frames (which are dark, photo-blur heavy, and use Vivaldi script). The site stays a clean, modern, warm-cream KKN profile + data site, but borrows the Figma's stronger typographic hierarchy, gold gradient moments, pill-shaped badges, layered soft shadows, and motif usage.

The image set is also being cleaned up: off-theme photos (`imlek-1.jpg`, `ramadhan.jpg`, repeated `nelayan*`, `gallery-*`) are removed and replaced with on-brand illustrated/themed placeholder imagery generated from the existing Sasak motif SVGs and palette. No real photos are available yet, so all imagery is placeholder-grade but designed to feel native until the team supplies real photography via Decap.

## 2. Goals

- Stronger, more intentional visual hierarchy on every page (hero, section titles, cards, CTAs).
- A cohesive, Figma-aligned design-system layer: expanded tokens, gradient text, pill badges, soft shadows, motif watermarks.
- Remove every off-theme image and replace with on-brand illustrated placeholders + themed hero composition.
- Add a small set of unique, useful features: festival countdown, map filter chips, "Kilas Sambelia" gallery moment, "Dukung Kami" sponsor CTA, motif animations.
- Whole-site scope: every public page gets a visual pass.
- No Decap/content-schema changes. No new external runtime dependencies (illustrations are SVG/CSS, not a library).
- Keep static export, performance targets, accessibility (WCAG AA contrast on new text-on-color combos).

## 3. Non-goals

- i18n / EN locale.
- Real photography (team will supply later via Decap).
- Replacing the map library or content model.
- Dark-mode site theme (Figma is dark; site stays light warm-cream).
- Pitch-deck fidelity (no Vivaldi, no heavy blurred-photo heroes, no 100px pill nav).

## 4. Design System Changes

### 4.1 Color tokens

Keep the existing 15-color palette and the Figma-derived tokens already in `globals.css`. Promote the partial Figma tokens to first-class Tailwind tokens so components can use them directly:

- `wine` / `wine-deep` (`#701414` / `#671919`) — deep maroon for footer, dramatic section dividers, display text on light.
- `gold-bright` (`#F9E11F`) — bright gold accents, festival chips, glow.
- `gold-soft` (`#FEDF9F`) — soft gold for headline fills / gradient stops.
- `cream-warm` / `cream-light` / `cream-beige` (`#EFE3AB` / `#FEFDD7` / `#F2EBD8`) — warm card/section backgrounds, headline fills.
- `olive` (`#68794A`) — muted forest green accent (alternative to green-900).
- `brown-dark` (`#47230F`) — dark brown display text.

These already exist as CSS variables; ensure Tailwind `colors` maps them (several already are in `tailwind.config.ts`: `wine`, `cream`, `goldBright`, `goldSoft`, `olive`, `brownDark`). Verify naming consistency and add missing aliases.

### 4.2 Typography

- Keep **Gontserrat** (UI/body) and **Beautique Display** + **Beautique Display Condensed** (display).
- No Vivaldi.
- Add a stronger type scale utility (Tailwind `fontSize` extend or component classes):
  - Hero title: Beautique Display, ~`clamp(2.5rem, 6vw, 5rem)`, tight leading, `text-balance`.
  - Section title: Beautique Display Condensed Bold, `text-4xl md:text-5xl`, `text-brown-900` or gradient.
  - Kicker: Gontserrat Bold uppercase, `text-xs`, tracked `0.15em`, colored (water-900 / terracotta-500 / olive).
  - Body: Gontserrat Regular, base `1rem`/`1.6` leading, `text-ink/80`.
- Add a **gradient text utility** (`.text-gradient-gold`) using `background-clip: text` with the Figma gold→cream gradient (`#FFCE07 → #FFE09A → #FEFDD7`) for hero wordmark and key display moments — used sparingly.

### 4.3 Effects

- **Soft layered card shadow:** `0 8px 24px -12px rgba(116,45,27,0.25)` (terracotta-tinted, not pure black).
- **Hover lift:** `translateY(-4px)` + stronger shadow on cards/links.
- **Text shadow (subtle):** `0 2px 4px rgba(0,0,0,0.15)` on hero/section titles over imagery — lighter than Figma's 3-4 stacked shadows.
- **Gradient overlays:** warm maroon→transparent bottom vignettes on heroes (`linear-gradient(180deg, rgba(116,45,27,0) 0%, rgba(116,45,27,0.85) 100%)`) instead of full dark.
- **Motif watermark:** batik/bunga SVG at 5-8% opacity as section backgrounds, not dominant.

### 4.4 Components (new + updated)

| Component | Change |
|---|---|
| `SectionHeader` | Add optional `tone` (water/green/terracotta/gold/olive) coloring kicker + a small pill background behind the kicker. |
| `StatCard` | Warm cream bg, terracotta-tinted shadow, gold underline accent under the value. |
| `DataCard` | Cream/beige bg, hairline tan border, soft shadow, hover lift, accent top-border colored by section. |
| `StatusBadge` | Pill shape (already), keep. |
| `MotifDivider` | Add subtle fade-in / parallax on scroll (CSS only, no JS lib). |
| **NEW** `Pill` | Reusable pill badge: `rounded-full`, warm fill, small — used for kickers, tags, map filter chips. |
| **NEW** `GradientText` | Span wrapper applying `.text-gradient-gold`. |
| **NEW** `CountdownStrip` | Festival page: days/hours/min/sec to next festival event from frontmatter `schedule`. |
| **NEW** `MapFilterChips` | Replace peta layer checkbox group with color-coded pill chips (Figma pill style). |
| **NEW** `KilasSambelia` | Beranda curated masonry gallery pulling from content `gallery[]` arrays. |
| **NEW** `SponsorCta` | Beranda bottom "Dukung Kami" section reusing Figma sponsorship visual language (clean). |

## 5. Image Strategy

### 5.1 Removals
Delete from `public/images/content/`:
- `imlek-1.jpg`, `ramadhan.jpg` (religious-holiday, off-theme)
- `nelayan.jpg`, `nelayan-landscape.jpg` (repeated, not Sambelia-specific)
- `gallery-1.jpg` … `gallery-4.jpg` (generic stock)
- `hero-sambelia.jpg` (replace with composed hero)

### 5.2 Replacements (illustrated, on-brand)
Create a new set of SVG/PNG placeholders in `public/images/content/` generated from the existing motif SVGs + palette. One per content type, themed:

- `hero-sambelia.svg` — composed warm Sambelia scene (coast + terracotta/gold gradient + batik watermark), used as hero bg.
- `pariwisata-beach.svg`, `pariwisata-desa.svg`, `pariwisata-budaya.svg`, `pariwisata-air.svg` — themed per category.
- `irigasi-saluran.svg` — water/green themed.
- `kesehatan-fasilitas.svg` — green/olive themed.
- `festival-peresean.svg`, `festival-gendang.svg`, `festival-pawai.svg` — terracotta/gold themed.
- `kegiatan-*.svg` — by category.
- `umkm-*.svg` — by product.
- `cerita-*.svg` — parchment/cream themed.
- `tim-placeholder.svg` — person placeholder (replace current `bunga` copy).

These are deterministic CSS/SVG compositions (gradient fields + motif overlays + a simple icon), not AI photos. They feel native because they use the exact palette and motifs.

### 5.3 Content frontmatter updates
Update every content file's `cover` field to point at the new themed placeholder for its type. Map (old → new) listed in implementation plan. The existing `gallery[]` arrays stay empty or point at the same themed set.

### 5.4 Placeholder fallback
`DataCard` / `MiniMap` / detail pages already fall back to placeholders; ensure the fallback points at the new themed set, not the deleted JPGs.

## 6. Page-by-Page Scope

Every public page gets a pass. Priorities:

1. **Beranda** — new composed hero with gradient text wordmark, restyled stats, "Kilas Sambelia" gallery moment, themed preview cards, "Dukung Kami" sponsor CTA, animated motif dividers.
2. **Festival** — `CountdownStrip`, terracotta/gold themed hero, per-event cards with themed covers.
3. **Peta** — `MapFilterChips` pill chips with color dots, restyled map panel.
4. **Pariwisata / Irigasi / Kesehatan / Kegiatan / UMKM** — restyled cards, themed covers, stronger section headers, motif watermarks.
5. **Cerita** — article typography refresh, themed covers, author card.
6. **Profil Tim / Tentang Sambelia** — member cards, stat grid, themed imagery.
7. **Mitra** — tiered logo grid restyle.
8. **404 / layout (Nav/Footer)** — pill-style nav active state, warm footer.

## 7. Unique Features (new)

1. **Festival Countdown** — `CountdownStrip` component on `/festival`, computes from nearest future `schedule` frontmatter.
2. **Map Filter Chips** — `MapFilterChips` replaces checkbox group on `/peta`, color-coded pills with layer dots.
3. **Kilas Sambelia** — `KilasSambelia` masonry gallery on Beranda pulling `gallery[]` from pariwisata/umkm.
4. **Dukung Kami CTA** — `SponsorCta` section on Beranda bottom, Figma sponsorship visual language (clean): gold gradient header, pill CTA buttons, contact pills.
5. **Motif animations** — subtle CSS scroll/parallax on `MotifDivider` and section watermarks.

All features are static-friendly (no backend), use existing content, and degrade gracefully when data is empty.

## 8. Accessibility

- Verify WCAG AA contrast on new gradient-text usage (ensure gradient stops keep sufficient contrast against bg; provide solid fallback color).
- Pill chips are keyboard-focusable (Radix/Link based).
- Countdown is decorative; schedule text remains in DOM for SR.
- Themed SVG placeholders include `<title>` / `alt`.

## 9. Performance

- New imagery is SVG (tiny) → improves LCP vs current JPGs.
- No new JS runtime deps.
- Motif animations are CSS `transform`/`opacity` only.
- Keep `next/image` `unoptimized` (static export).

## 10. Testing

- Existing vitest content/map/schema tests must still pass.
- Update Playwright smoke E2E if selectors change (banner role etc.).
- `npm run lint && npm run typecheck && npm test && npm run build` gate before done.
- Manual visual check of each page on mobile + desktop.

## 11. Out of scope / future

- Real photography (team supplies via Decap).
- EN locale.
- Search (Pagefind).
- PWA.