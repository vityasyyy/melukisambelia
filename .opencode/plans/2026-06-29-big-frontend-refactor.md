# Big Frontend Refactor Plan

## Issues to Fix

### 1. Next.js Image Warnings
- **`bw_logo_sambel.svg` warning**: Logo.tsx uses `width={160} height={48}` with `className` that can change size. Add `style={{ width: 'auto' }}` or use `sizes` prop.
- **`bunga_sambel.svg` warning**: MotifFloater uses `width={120} height={120}` but applies `h-full w-full` class which overrides dimensions. Remove fixed width/height, use `fill` with `sizes` prop, or add `style={{ width: 'auto', height: 'auto' }}`.
- **Apple meta tag**: `apple-mobile-web-app-capable` is deprecated. Replace with `mobile-web-app-capable` in layout.tsx `metadata.other`.

### 2. UMKM Page Overflow
The UmkmListClient has a structural issue: the `<div className="relative mx-auto max-w-content px-4 py-16">` wraps everything including the `<MotifFloater>` and the `<EmptyState>`/grid, but the closing `</div>` is misaligned. Looking at the code, the `MotifFloater` is placed before the conditional content, but the entire content area doesn't have `overflow-hidden`. The real overflow issue is likely the category pill filter wrapping on mobile — need `overflow-hidden` on the container and ensure pills wrap correctly. Also the UmkmCard `button` has `h-full w-full` which can cause overflow if the card content exceeds the button bounds.

**Fix**: Add `overflow-hidden` to the UmkmCard outer div (already has it), but also ensure the content wrapper in UmkmListClient has proper overflow handling. The `relative` container needs `overflow-hidden` to prevent floaters from bleeding out.

### 3. CeritaStats — Remove "Dampak" Stats, Keep Cerita Only
The homepage CeritaStats section shows both cerita teasers AND duplicate stats (Luas, Penduduk, Desa Binaan, Tahun Program) that are already shown in the "Tentang" section. User says to remove the stats part and keep only the cerita, linking to the tentang-sambelia page for "dampak" info.

**Changes to CeritaStats**:
- Remove the 4 stat items (they duplicate the tentang section)
- Remove the `CountUpStat` import
- Remove the `getSettings` import (only needed for stats)
- Change the grid from 2-column to full-width cerita list
- Add a link to the tentang-sambelia page
- Rename section header from "Cerita & Dampak" to just "Cerita" or "Cerita dari Sambelia"

### 4. Festival Section on Homepage — Spacing is Weird
The festival section on the homepage has the CountdownStrip followed immediately by FestivalTimeline with minimal spacing. The `<section>` has `py-12` but between the countdown and timeline there's only the default FadeIn delay, which creates visual cramping.

**Fix**: Add `space-y-8` or explicit spacing between the countdown and timeline subsections. Also the countdown strip should have bottom margin, and the timeline should have top margin.

### 5. MotifFloater — Make More Visible, Add More Floaters
Current opacity is `0.07` which is very subtle. User wants them more visible.

**Changes**:
- Default opacity: `0.07` → `0.12` (more visible but still decorative)
- Increase sizes: sm `w-16 h-16 sm:w-20 sm:h-20` → `w-20 h-20 sm:w-28 sm:h-28`, md `w-24 h-24 sm:w-32 sm:h-32` → `w-28 h-28 sm:w-36 sm:h-36`, lg `w-32 h-32 sm:w-40 sm:h-40` → `w-36 h-36 sm:w-48 sm:h-48`
- Add more floaters per page — 2-3 per section instead of 1-2
- Fix the `bunga_sambel.svg` Next.js Image warning by switching to `fill` with proper `sizes`
- Add a gentle floating animation (not just fade-in) — a subtle y-axis oscillation

### 6. Floaters Can Overflow on Mobile
Position classes like `right-4 sm:right-8` can cause floaters to overflow on small screens. Need to add `overflow-hidden` to all sections that have floaters, OR reduce the right/left offsets for mobile.

**Fix**: Change position offsets: `left-4 sm:left-8` → `left-2 sm:left-6`, `right-4 sm:right-8` → `right-2 sm:right-6`. Also ensure all sections with floaters have `overflow-hidden`.

### 7. Add "Tentang Sambelia" Link from Homepage
The homepage "Tentang" section should have a link/button to the dedicated tentang-sambelia page, not just show stats.

**Fix**: Add a "Selengkapnya →" link button at the bottom of the tentang section, linking to `/tentang-sambelia`.

### 8. Mobile/Desktop Responsiveness Issues
- UmkmCard: The button wrapping can cause overflow. Need `overflow-hidden` on the button element and ensure text truncation works.
- DataCard: Similar overflow potential with chips on mobile.
- FestivalTimeline: On mobile, the timeline border-left + card can overflow. Need to ensure padding accommodates.
- Nav: Mobile menu should have proper max-height and scrolling.
- PageHero: Text might be too large on very small screens. Already uses `text-display-lg` which uses `clamp()`.

### 9. Performance Issues
- MotifFloater uses `whileInView` with margin `'-60px'`. This triggers animations early. Should use `'-20px'` for better perceived performance.
- Multiple `getCollection` and `getSettings` calls on homepage. These are already cached by Next.js ISR so not a real issue.
- The `motion.div` wrapper for each floater adds JS overhead. Could use CSS-only animations for the float effect.

### 10. Comprehensive Floater Assignment
Every page needs floaters with varied positions. Current assignment:

**Homepage**: tentang(top-right,bunga,md,gold), jejaki(bottom-left,cincin,sm,terracotta), wisata(top-right,bunga,md,water), festival(top-left,cincin,md,gold), umkm(bottom-right,bunga,sm,olive)
**Tentang**: section01(top-right,cincin,md,terracotta), section02(bottom-left,bunga,md,gold), section03(top-right,cincin,sm,olive)
**Festival**: countdown(top-left,bunga,md,gold), timeline(bottom-right,cincin,md,terracotta)
**Cerita**: content(top-right,bunga,md,brown + bottom-left,cincin,sm,olive)
**Peta**: content(top-right,cincin,md,water + bottom-left,bunga,sm,gold)
**Lingkungan**: content(bottom-right,bunga,md,olive + top-left,cincin,sm,olive)
**AirTanah**: content(top-left,cincin,md,water)
**Pariwisata**: content(top-right,bunga,md,water + bottom-left,cincin,sm,terracotta)
**UMKM**: content(bottom-right,bunga,sm,olive) — removed center-right
**Kesehatan**: content(top-left,bunga,md,olive + bottom-right,cincin,sm,water)
**Irigasi**: content(top-right,cincin,md,olive + bottom-left,bunga,sm,gold)

**Add more floaters**: Add a 3rd floater to longer sections, add floaters to PageHero components as corner decorations, add floaters to the footer area.

### 11. PageHero Floaters
Add subtle corner floaters to PageHero itself — small decorative motifs in the corners of the gradient background. This makes each subpage hero feel unique.

**Implementation**: Add 2 small floaters (sm size) inside PageHero, positioned at top-left and bottom-right, with colors matching the tone. This requires making PageHero a client component OR passing floater config as props.

**Simpler approach**: Since PageHero is a server component, add the floaters directly in each page's JSX after the PageHero component, using absolute positioning relative to the hero section. But PageHero doesn't have `overflow-hidden` currently — need to add it.

Actually, better approach: Add `overflow-hidden` to PageHero (already has it) and make the floaters part of PageHero by adding optional `floaterMotif` and `floaterColor` props, then render the MotifFloater inside PageHero.

But this would make PageHero a client component (since MotifFloater is a client component). Better to keep it simple: just add floaters in each page template after PageHero, positioned with negative margins or absolute positioning.

**Simplest approach**: Keep floaters in page-level sections only. Don't add floaters inside PageHero to avoid the client/server component boundary issue.

## Implementation Plan

### Step 1: Fix MotifFloater
- Increase default opacity to `0.12`
- Increase all sizes (sm/md/lg)
- Add subtle floating animation (CSS keyframe y-oscillation)
- Fix Image warning by using `fill` + `sizes` instead of width/height
- Reduce position offsets for mobile
- Add `overflow-hidden` to all parent sections

### Step 2: Fix Logo.tsx Image Warning
- Add `style={{ width: 'auto' }}` to prevent dimension mismatch warning

### Step 3: Fix apple-mobile-web-app-capable
- Replace `apple-mobile-web-app-capable` with `mobile-web-app-capable` in layout.tsx metadata.other

### Step 4: Fix UmkmListClient Overflow
- Add `overflow-hidden` to the content wrapper div
- Ensure category pill container has proper wrapping
- Fix UmkmCard button to prevent overflow

### Step 5: Refactor CeritaStats — Remove Stats, Keep Cerita Only
- Remove stat items and CountUpStat/getSettings imports
- Change layout to single-column cerita list
- Add link to tentang-sambelia page
- Update section header

### Step 6: Fix Festival Section Spacing on Homepage
- Add proper spacing between CountdownStrip and FestivalTimeline

### Step 7: Add "Selengkapnya" Link to Homepage Tentang Section
- Link to /tentang-sambelia

### Step 8: Add More Floaters Per Section
- Add 3rd floater to longer sections
- Add floaters to homepage CeritaStats section
- Ensure varied positions across pages

### Step 9: Fix Mobile Responsiveness
- Ensure all sections with floaters have `overflow-hidden`
- Fix any card overflow issues on mobile
- Verify Nav mobile menu scrolling

### Step 10: Build & Verify