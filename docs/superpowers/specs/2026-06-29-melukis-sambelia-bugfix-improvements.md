# Melukis Sambelia — Bug Fixes & Ambitious Improvements

**Date**: 2026-06-29
**Scope**: 5 reported bugs + comprehensive UX, performance, accessibility, SEO, and code quality improvements

---

## A. Bug Fixes

### A1. Admin page inaccessible locally and in production

**Problem**: `/admin` shows a blank page with JS errors. The Decap CMS `index.html` dynamically patches `local_backend: true` into the config via a fetch-then-blob approach, which has race conditions. The Next.js rewrite only handles `/admin` exactly, not `/admin/` or `/admin/index.html`.

**Fix**:
1. Add `local_backend: true` directly to `public/admin/config.yml` — Decap ignores it when the gateway isn't reachable
2. Rewrite `public/admin/index.html`:
   - Remove the fragile dynamic blob-patching logic
   - Keep gateway detection but make it non-blocking — show a dismissible banner instead of blocking CMS load
   - Improve error handling with console logging
3. Update `next.config.mjs` rewrites to handle `/admin`, `/admin/`, and sub-paths
4. Verify OAuth flow works for production (the `/api/auth` route already exists)
5. Test both local (`npm run cms` + `npm run dev`) and production (Vercel + GitHub OAuth)

### A2. Tailwind ease warning + cerita frontmatter errors

**Problem**: `ease-[cubic-bezier(0.25,0.46,0.45,0.94)]` is ambiguous in Tailwind v3 (commas in arbitrary values). Two cerita MDX files have unquoted dates that YAML parses as Date objects, but the schema expects `z.string()`.

**Fix**:
1. Add `transitionTimingFunction.sambel` to `tailwind.config.ts`: `'cubic-bezier(0.25, 0.46, 0.45, 0.94)'`
2. Replace all 4 instances of `ease-[cubic-bezier(0.25,0.46,0.45,0.94)]` with `ease-sambel`
3. Quote dates in `content/cerita/fidel.mdx`: `date: '2026-06-29T16:27:00.000+08:00'`
4. Quote dates in `content/cerita/persiapan-festival.mdx`: `date: '2026-07-10'`
5. Change `ceritaSchema.date` from `z.string()` to `z.coerce.string()` to prevent future breakage from unquoted YAML dates

### A3. Modal cards shifted right on mobile + UMKM card overflow

**Problem**: `DetailModalClient` uses `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` which is fragile on mobile. UmkmCard's button lacks overflow constraints, causing horizontal overflow on small screens.

**Fix**:
1. Refactor `DetailModalClient` overlay to use `fixed inset-0` with flex centering instead of `left-1/2 -translate-x-1/2`
2. Add `overflow-hidden` to UmkmCard container and `w-full` to the inner button
3. Add `min-w-0` to modal content wrapper and card containers
4. Ensure Radix Dialog's modal prop properly prevents background scroll
5. Add `max-h-[90dvh]` to the modal scroll container with proper overflow handling

### A4. 404 source map errors

**Problem**: Chrome DevTools auto-requests `LayoutGroupContext.mjs.map` (framer-motion) and `/.well-known/appspecific/com.chrome.devtools.json`, generating 404s.

**Fix**:
1. Add `productionBrowserSourceMaps: false` to `next.config.mjs`
2. Create `public/.well-known/appspecific/com.chrome.devtools.json` with `{}`
3. Optionally add a Next.js middleware to silently 404 `*.map` requests in production

### A5. Text readability (hero + modal)

**Problem**: Text colors on dark gradient backgrounds (hero, PageHero, modal image overlay) lack sufficient contrast. Some areas use `text-ink` (black) or low-opacity variants over dark backgrounds.

**Fix**:
1. **Hero**: Increase text-shadow intensity, change kicker from `text-cream-light/70` to `text-cream-light/80`, verify CTA button contrast
2. **PageHero**: Same kicker contrast fix, add text-shadow to title
3. **DetailModalClient**: Add text-shadow to modal image overlay title/description, ensure no-image fallback has sufficient contrast
4. **General audit**: Check all instances of `text-ink`, `text-brown-900`, and `text-cream-light` for contrast against their backgrounds

---

## B. Performance & Core Web Vitals

1. **Remove `images.unoptimized: true`** from `next.config.mjs` and configure proper image optimization for Vercel deployment
2. **Add `loading.tsx`** skeleton components for each route group (pariwisata, umkm, kesehatan, irigasi, festival, cerita, air-tanah, lingkungan, peta, tentang-sambelia)
3. **Add `error.tsx`** styled error boundaries for each route group
4. **Font optimization**: Add `<link rel="preload">` for critical fonts in layout.tsx
5. **Add `@next/bundle-analyzer`** to devDependencies

---

## C. Accessibility (WCAG AA)

1. **Contrast audit**: Fix all color combinations failing WCAG AA ratios
2. **`aria-live="polite"`** on filter sections (UMKM kategori, etc.)
3. **Verify skip navigation** works correctly
4. **Add `aria-label`** to icon-only buttons (nav hamburger, back-to-top)
5. **Focus management**: Verify Radix Dialog moves focus correctly

---

## D. Mobile UX Overhaul

1. **Bottom sheet for mobile modals**: On screens < 640px, render DetailModal as a bottom sheet (slides up, rounded top corners, max-height 85dvh)
2. **Touch targets audit**: Ensure all interactive elements ≥ 44x44px
3. **Backdrop overlay**: Add backdrop behind mobile nav menu
4. **Swipe-to-close** for mobile bottom sheet modal
5. **Mobile nav improvements**: Smoother group expand/collapse transitions

---

## E. SEO & Metadata

1. **Dynamic sitemap**: Add UMKM slugs to `app/sitemap.ts`
2. **JSON-LD structured data**: Add `TouristAttraction`, `LocalBusiness`, `Event`, `Article` schemas to respective pages
3. **OG images**: Verify `scripts/generate-og.mjs` works correctly
4. **Theme color per page**: Add `<meta name="theme-color">` matching hero tone
5. **Canonical URLs**: Add `canonical` to each page's metadata

---

## F. Code Quality & DX

1. **Error boundaries**: `app/error.tsx` and per-route-group error boundaries with styled fallback UI
2. **Loading states**: Skeleton loading components for each page type
3. **Content validation script**: `npm run validate` that checks all MDX/MD frontmatter against schemas
4. **Pre-commit hooks**: Husky + lint-staged for lint and typecheck
5. **ESLint**: Already using `next/core-web-vitals` — no changes needed

---

## G. Design System Polish

1. **Standardize easing**: `ease-sambel` custom token in Tailwind config (from A2)
2. **Move shadow utilities**: Add `boxShadow` theme extension for `shadow-terracotta` and `shadow-terracotta-hover` to `tailwind.config.ts`
3. **Extract shared card pattern**: Create base `ContentCard` component reducing duplication between `DataCard` and `UmkmCard`
4. **Standardize mobile spacing**: Audit all sections for consistent `px-4 py-16` mobile padding
5. **Move CSS utilities to Tailwind config**: `.shadow-terracotta`, `.shadow-terracotta-hover`, `.hero-vignette`, `.section-watermark`, `.img-shimmer` → theme extensions
6. **Consistent `overflow-hidden`** on all sections with decorative elements (MotifFloater)