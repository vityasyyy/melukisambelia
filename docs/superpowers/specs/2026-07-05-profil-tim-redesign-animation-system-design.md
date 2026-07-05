# Profil-Tim Redesign + Site-Wide Animation System

## Overview

Redesign the `/profil-tim` page to use separate year routes with animated year cards, two photos per member (kluster vs subunit), and animated tab transitions. Build a reusable animation system that upgrades the entire site with page transitions, parallax, enhanced hovers, and consistent animation presets.

## 1. Route Structure

**Current:** Single page `/profil-tim` with all years stacked vertically.

**New:**
- `/profil-tim` — Landing page with animated year cards grid
- `/profil-tim/[year]` — Per-year page with pill year tabs at top, kluster/subunit toggle, member display

## 2. Data Model Changes

Add `photoSubunit` to ProfilTim schema in `lib/schemas.ts`:
```typescript
photoSubunit: z.string().default('/images/hero-placeholder.svg')
```

Each member now has:
- `photo` — displayed in kluster view
- `photoSubunit` — displayed in subunit view

Existing content files default to placeholder — no migration needed.

## 3. Profil-Tim Year Landing (`/profil-tim`)

- Animated grid of year cards with spring-physics hover lift + scale, stagger entrance on scroll
- Each card shows: year number, cluster count, member count, cluster-colored accent border
- Clicking navigates to `/profil-tim/[year]`
- PageHero with tone="gold" and floating motifs

## 4. Profil-Tim Year Page (`/profil-tim/[year]`)

- Year pill tabs at top — horizontal switcher with `layoutId`-driven sliding indicator
- Kluster/Subunit toggle with `AnimatePresence` crossfade transition
- Leader section with staggered entrance animation
- Kluster view: grid of MemberCards using `photo` field, staggered scroll reveal per cluster
- Subunit view: horizontal scroll cards using `photoSubunit` field, staggered scroll reveal per subunit
- Member detail modal with `AnimatePresence` enter/exit, spring entrance

## 5. Tab Transition Animation (Kluster ↔ Subunit)

- Active pill indicator slides via `layoutId` + spring transition
- Content crossfades: outgoing fades + slides left, incoming fades + slides right (or vice versa), using `AnimatePresence` with `mode="wait"`
- Cards in incoming view stagger in with delay cascade

## 6. Site-Wide Animation System

### 6a. PageTransitionProvider
- Wraps `{children}` in `layout.tsx` with `AnimatePresence`
- Uses `usePathname()` as key for route transitions
- Transition: fade (opacity) + subtle slide (y: 8px)
- Respects `useReducedMotion` — instant swap for reduced motion users

### 6b. AnimationPresets (`lib/animation.ts`)
- Named presets: `presetFade`, `presetSlideUp`, `presetSlideIn`, `presetSpring`, `presetCrossfade`
- Consistent timing: `duration: 0.3`, `ease: [0.25, 0.46, 0.45, 0.94]` (sambel curve)
- All animation components import from here

### 6c. Enhanced FadeIn
- Add optional `whileHover` (y: -2, shadow) and `whileTap` (scale: 0.98) via props
- Keep existing `whileInView` scroll-trigger

### 6d. ScrollParallax Hook (`hooks/useScrollParallax.ts`)
- `useScroll` + `useTransform` hook for parallax on motif floaters and hero backgrounds
- Configurable: `inputRange`, `outputRange`, `axis`
- Applied to `MotifFloater` and `PageHero` background elements

### 6e. Enhanced Skeleton
- Replace CSS `animate-pulse` with framer-motion shimmer (translating gradient sweep)
- Used in all `loading.tsx` files and `Suspense` fallbacks

### 6f. Card Hover Animations
- Add `whileHover` (lift + shadow) and `whileTap` (press) to card components
- Applied via shared `HoverableCard` wrapper component

## 7. Reduced Motion

All new animations respect `useReducedMotion()`:
- Page transitions: instant swap
- Parallax: disabled, elements static
- Hover/tap: no transforms
- Tab transitions: instant content swap
- Stagger: all items appear immediately