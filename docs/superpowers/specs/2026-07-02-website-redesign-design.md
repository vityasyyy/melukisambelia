# Website Redesign: Cleaner, Tidier, WCAG-Compliant Sambelia Portal

**Date:** 2026-07-02  
**Approach:** Systematic sweep — tokens/fonts → layout primitives → section components → WCAG audit

---

## 1. Font System

### Current
- **Body:** Gontserrat (geometric rounded sans) — feels cold and generic
- **Display:** Beautique / BeautiqueCondensed — works well, keeping

### Change
- **Body:** Replace Gontserrat with **DM Sans** (Google Fonts, SIL license)
- **Display:** Keep Beautique / BeautiqueCondensed unchanged
- **Utility/label:** BeautiqueCondensed remains for kickers, chips, countdown labels

### Implementation
1. Replace `localFont` for Gontserrat in `app/layout.tsx` with `next/font/google` for DM Sans (`--font-dm-sans`)
2. Update `tailwind.config.ts`: `fontFamily.gontserrat` → `fontFamily.dmSans` with `var(--font-dm-sans)`
3. Update all `font-gontserrat` class references → `font-dm-sans` (body default in layout)
4. Remove Gontserrat font files from `public/fonts/gontserrat/`

---

## 2. Icon Library

### Current
- Some inline emoji, lucide-react already installed and used in Nav/Hero

### Change
- Standardize on **lucide-react** for all icons site-wide
- Remove all inline emoji, replace with appropriate lucide icons
- All decorative icons get `aria-hidden`, meaningful icons get `aria-label`

---

## 3. Animation Reduction

### Current
- Continuous ambient animations: `motif-rotate`, `motif-float`, `motif-float-slow`, `motif-pulse`, `colorSweep`, `shimmer`
- Stagger entrance animations on every section
- Hero image scale-in entrance
- MotifDivider entrance animation

### Change

**Remove entirely:**
- All CSS keyframe animations: `motif-rotate`, `motif-rotate-reverse`, `motif-float`, `motif-float-slow`, `motif-pulse`, `motif-entrance`
- `colorSweep` animation on `.text-gradient-festival` (keep gradient, remove animation)
- `shimmer-slow` utility (remove `shimmer` keyframe, keep `img-shimmer` for skeleton loading only)
- `batik-sweep` animation on `.batik-divider` (make static)
- `batik-drift` animation on `.section-watermark` (make static)
- All `motif-glow`, `motif-rotate`, `motif-float*` classes from MotifFloater, HeroAnimation, PageHero

**Keep but tone down:**
- `FadeIn`: reduce y-offset from 24→12px, duration from 0.5→0.3s
- `StaggerContainer/StaggerItem`: reduce stagger from 0.06–0.1→0.04s, item y from 20→10px, duration 0.5→0.3s
- Hero image entrance: keep subtle scale-in (1.01→1 instead of 1.03→1, duration 0.8s instead of 1.4s)
- MotifDivider: keep opacity entrance but remove scale/transform animations

**Keep unchanged:**
- `useReducedMotion` guards (already present, verified)
- `accordion-down/up` animations (functional, not decorative)

### Result
One orchestrated entrance (hero), then everything else arrives quietly via brief fades. No continuous ambient animation.

---

## 4. Ring & Flower Placement

### Current
- Rings (`cincin_sambel`) and flowers (`bunga_sambel`) appear in:
  - Hero section (3 decorations with rotate/float animations)
  - Every PageHero (3 decorations with rotate/float)
  - Scattered MotifFloater elements in sections (with rotate/float animations)

### Change
- **Remove all rings and flowers from the hero section** (`HeroAnimation.tsx`) — the hero image + text overlay is sufficient
- **Remove all MotifFloater calls** from `page.tsx`, `festival/page.tsx`, and other section backgrounds
- **Keep rings only in PageHero** — they frame the page title moment appropriately
- **PageHero flowers:** Replace absolute positioning with predictable CSS grid placement:
  - Container gets `overflow-hidden` and `relative`
  - Ring placed at `top-1/2 -translate-y-1/2 right-0` with `max-w-[350px]`
  - Flower placed at `top-[18%] left-[4vw]` with `max-w-[160px]`
  - Bottom flower at `right-[6vw] bottom-[15%]` with `max-w-[130px]`
  - All static (no animation classes)

---

## 5. Navbar Improvements

### 5a. Detached dropdown solid background
- Desktop dropdown menus (in `Nav.tsx` line 138): change `bg-brown-950/90 backdrop-blur-xl` → `bg-brown-950` (solid, no transparency)
- Transparent/glass effect stays only in attached mode (over hero)

### 5b. Side navbar (Sheet)
- When Sheet opens, hide the main `<header>` via state: pass `open` state up or use CSS `data-[state=open]:hidden`
- All text in Sheet: `text-cream-light` (verify all variants meet 4.5:1 against `bg-brown-950`)
- Close button: increase to `h-12 w-12` with explicit `text-cream-light`, add `aria-label="Tutup menu"`
- Sheet background: already `bg-brown-950` — keep as solid, no changes needed

### 5c. Nav link contrast
- Inactive links: `text-white/85` → `text-white` (4.5:1+ against `bg-brown-950`)
- Hover: `hover:bg-white/10 hover:text-white` — fine
- Active links: `text-gold-bright` — verify meets 3:1 against `bg-brown-950` (it does: #F9E11F on #1A0F0A ≈ 12:1)

---

## 6. Festival Horizontal Timeline

### Current
- `FestivalTimeline` renders `<ol>` with vertical layout, large cards, `border-l-2 border-terracotta-500`, full aspect-video images

### Change
Redesign as a **horizontal scrollable timeline**:

```
  ●────────●────────●────────
  │ Event  │ Event  │ Event
  │ Small  │ Small  │ Small
  │ Image  │ Image  │ Image
  │ Title  │ Title  │ Title
  │ Date   │ Date   │ Date
```

**Structure:**
- Outer: `overflow-x-auto scrollbar-none` container
- Timeline line: `h-[2px] bg-terracotta-500/30` running horizontally at top
- Nodes: `w-3 h-3 rounded-full bg-terracotta-500` positioned on the line at each event
- Cards: compact, `w-[300px] sm:w-[340px] shrink-0 snap-center`
  - Image: `aspect-[3/2]` instead of `aspect-video`
  - Title: `font-beautique text-lg text-brown-900`
  - Meta: `font-beautique-condensed text-xs tracking-wide text-terracotta-500`
  - Description: `text-sm text-ink/60 line-clamp-2`
  - Registration button: same style but smaller (`px-3 py-1.5 text-xs`)
- Mobile fallback: `flex-col` layout with vertical timeline line

---

## 7. Card System Overhaul

### Current Style
```
rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta
hover:-translate-y-1 hover:shadow-terracotta-hover
Plus gradient overlay reveal on hover
```

### New Style

**Background:** `bg-white` (or `bg-white/95 backdrop-blur-sm` for glass feel)
**Border:** `border border-tan-700/12` (more subtle)
**Shadow:** `shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]` — refined, not terracotta-tinted
**Hover shadow:** `hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]`
**Hover lift:** `hover:-translate-y-0.5` (subtle, not 4px)
**Remove:** The `pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 opacity-0 hover:opacity-100` overlay effect

### Typography Hierarchy in Cards
- **Title:** `font-beautique text-lg text-brown-900` (keep)
- **Meta/subtitle:** `font-beautique-condensed text-xs tracking-wide text-terracotta-500` (keep)
- **Description:** `text-sm text-ink/60 leading-relaxed` (was `text-ink/70`)
- **Spacing:** `p-5` for card body, `mt-2.5` between title and description (was `mt-2`)

### Numbering/Labeling (Jejaki Cards)
**Replace** the circled number overlay on images with a small accent bar on the card and a subtle number above the title:

```css
/* Card left border accent */
border-l-[3px] border-l-gold-500  /* keep existing accent bar */

/* Number: placed above title, subtle */
font-beautique-condensed text-[10px] tracking-[0.2em] text-ink/40 uppercase
```

The number moves from the image overlay to the card body, above the title, as a small kicker — similar to how SectionHeader uses a kicker. This creates a consistent visual language.

---

## 8. WCAG AA Compliance

### 8a. Color Contrast Audit
| Element | Current | Required | Fix |
|---------|---------|----------|-----|
| Nav inactive links | `text-white/85` ≈ 4.2:1 | 4.5:1 | → `text-white` |
| Card description | `text-ink/70` ≈ 4.5:1 on `bg-white` | 4.5:1 | → `text-ink/60` on `bg-white` ≈ 5.4:1 ✓ |
| Chip text on chip bg | Various | 4.5:1 | Audit each chip class |
| Section intros | `text-ink/80` | 4.5:1 | Verify on `bg-page` (#FFFCF7) |
| Kicker text in SectionHeader | `text-white/80` on gradient | 4.5:1 | → `text-white` on gradient bg |

### 8b. Focus Indicators
- Current: `focus-visible { outline: 2px solid var(--water-500); outline-offset: 2px; }` — good
- Verify all interactive elements (links, buttons, accordion triggers) have visible focus
- Add `:focus-visible` styles to all card links and timeline items

### 8c. ARIA & Semantics
- All `<section>` elements need `aria-labelledby` pointing to their heading
- Hero skip link: already present, verify it works
- Sheet: already has `SheetTitle`, verify it's not empty
- Images: all `alt` text must be meaningful (audit `<Image>` components)
- Heading hierarchy: single `<h1>` per page, proper `<h2>`/`<h3>` nesting

### 8d. Keyboard Navigation
- Verify tab order is logical through all pages
- Mobile menu: already uses Sheet with keyboard trap, verify close button is focusable
- Festival timeline horizontal scroll: add `tabIndex` and arrow-key navigation for accessibility
- All external links: add visual indicator or `aria-label` noting external destination

### 8e. Reduced Motion
- Already using `useReducedMotion()` in FadeIn, StaggerContainer, StaggerItem, HeroAnimation, CountdownStrip, MotifDivider, MotifFloater
- Verify remaining animations (hero scale, hover transforms) also respect reduced motion
- Add global CSS: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

---

## Implementation Order

1. **Font system** — replace Gontserrat with DM Sans, update all references
2. **Remove animations** — strip ambient CSS keyframes, tone down entrances
3. **Remove ring/flower from hero** — clean up HeroAnimation
4. **Fix MotifFloater placement** — constrain to PageHero only, static positioning
5. **Navbar fixes** — solid dropdown, Sheet improvements, contrast fixes
6. **Card system overhaul** — new card styles, typography hierarchy, numbering
7. **Festival horizontal timeline** — redesign component
8. **Icon standardization** — replace emoji with lucide-react
9. **WCAG AA audit** — contrast, focus, ARIA, keyboard, reduced motion

Each step should be testable independently.
