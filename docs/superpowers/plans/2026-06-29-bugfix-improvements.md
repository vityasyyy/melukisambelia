# Melukis Sambelia Bug Fixes & Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 5 reported bugs and implement comprehensive UX, performance, accessibility, SEO, and code quality improvements for the Melukis Sambelia website.

**Architecture:** Next.js 14 App Router site with MDX content, Decap CMS, Tailwind CSS, Framer Motion, and Radix UI. Bug fixes target specific component files; improvements add new files (loading states, error boundaries, validation scripts) and refactor shared patterns.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3, Framer Motion, Radix UI, Zod, Decap CMS, Vitest

---

## Task 1: Fix Tailwind ease warning + Define custom easing token

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `components/DataCard.tsx`
- Modify: `components/UmkmCard.tsx`
- Modify: `app/lingkungan/page.tsx`
- Modify: `app/tentang-sambelia/page.tsx`
- Modify: `components/Nav.tsx` (also uses the same easing in framer-motion)

- [ ] **Step 1: Add custom easing and shadow tokens to tailwind.config.ts**

Open `tailwind.config.ts` and add `transitionTimingFunction` and `boxShadow` extensions inside `theme.extend`:

```ts
transitionTimingFunction: {
  'sambel': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
},
boxShadow: {
  'terracotta': '0 8px 24px -12px rgba(116, 45, 27, 0.25)',
  'terracotta-hover': '0 16px 32px -12px rgba(116, 45, 27, 0.35)',
},
```

- [ ] **Step 2: Replace arbitrary ease values in DataCard.tsx**

In `components/DataCard.tsx`, change line 58:
```
ease-[cubic-bezier(0.25,0.46,0.45,0.94)]  →  ease-sambel
```

- [ ] **Step 3: Replace arbitrary ease values in UmkmCard.tsx**

In `components/UmkmCard.tsx`, change line 6:
```
ease-[cubic-bezier(0.25,0.46,0.45,0.94)]  →  ease-sambel
```

- [ ] **Step 4: Replace arbitrary ease values in lingkungan/page.tsx**

In `app/lingkungan/page.tsx`, find and replace:
```
ease-[cubic-bezier(0.25,0.46,0.45,0.94)]  →  ease-sambel
```

- [ ] **Step 5: Replace arbitrary ease values in tentang-sambelia/page.tsx**

In `app/tentang-sambelia/page.tsx`, find and replace:
```
ease-[cubic-bezier(0.25,0.46,0.45,0.94)]  →  ease-sambel
```

- [ ] **Step 6: Replace shadow-terracotta CSS utilities with Tailwind tokens**

In `app/globals.css`, remove the `.shadow-terracotta` and `.shadow-terracotta-hover` utility classes (they're now in the Tailwind config as `shadow-terracotta` and `shadow-terracotta-hover`). The class names stay the same but are now theme tokens.

Remove these from `@layer utilities`:
```css
.shadow-terracotta {
  box-shadow: 0 8px 24px -12px rgba(116, 45, 27, 0.25);
}

.shadow-terracotta-hover {
  box-shadow: 0 16px 32px -12px rgba(116, 45, 27, 0.35);
}
```

- [ ] **Step 7: Run typecheck and verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: No Tailwind ease warnings, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "fix: replace arbitrary cubic-bezier easing with custom token, move shadow utilities to tailwind config"
```

---

## Task 2: Fix cerita frontmatter date parsing

**Files:**
- Modify: `lib/schemas.ts`
- Modify: `content/cerita/fidel.mdx`
- Modify: `content/cerita/persiapan-festival.mdx`

- [ ] **Step 1: Change ceritaSchema date field to coerce strings**

In `lib/schemas.ts`, change line 55 from:
```ts
date: z.string(),
```
to:
```ts
date: z.coerce.string(),
```

This automatically converts YAML Date objects to ISO strings, preventing future breakage.

- [ ] **Step 2: Quote the date in fidel.mdx**

In `content/cerita/fidel.mdx`, change line 4 from:
```yaml
date: 2026-06-29T16:27:00.000+08:00
```
to:
```yaml
date: '2026-06-29T16:27:00.000+08:00'
```

- [ ] **Step 3: Quote the date in persiapan-festival.mdx**

In `content/cerita/persiapan-festival.mdx`, change line 4 from:
```yaml
date: 2026-07-10
```
to:
```yaml
date: '2026-07-10'
```

- [ ] **Step 4: Verify content loads without errors**

Run: `npm run build`
Expected: No `[content] Invalid frontmatter` errors for cerita files.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "fix: quote cerita dates and coerce string type to prevent YAML Date parsing errors"
```

---

## Task 3: Fix admin page (local + production)

**Files:**
- Modify: `public/admin/config.yml`
- Modify: `public/admin/index.html`
- Modify: `next.config.mjs`

- [ ] **Step 1: Add local_backend to config.yml**

In `public/admin/config.yml`, add `local_backend: true` at the very top (before `backend:`):

```yaml
local_backend: true

backend:
  name: github
  ...
```

Note: Decap CMS ignores `local_backend` when the gateway isn't reachable, so this is safe for production.

- [ ] **Step 2: Rewrite admin/index.html with proper error handling**

Replace `public/admin/index.html` with a cleaner version that:
- Keeps gateway detection but makes it non-blocking
- Removes the fragile blob-patching approach (local_backend is now in config)
- Shows a dismissible warning banner instead of blocking the page
- Preserves the OAuth localStorage fallback logic
- Adds proper error handling and console logging

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager — Melukis Sambelia</title>
  <style>
    #cms-banner {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #fdfbf7;
      color: #3d2b1f;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 1rem 1.5rem;
      border-top: 2px solid #e3795c;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
    }
    #cms-banner p { margin: 0.25rem 0; font-size: 0.875rem; }
    #cms-banner code {
      background: #f0e6d6;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    #cms-banner button {
      margin-top: 0.5rem;
      padding: 0.4rem 1rem;
      border: 1px solid #af7e4f;
      border-radius: 6px;
      background: transparent;
      color: #3d2b1f;
      cursor: pointer;
      font-size: 0.8rem;
    }
    #cms-banner button:hover { background: #f0e6d6; }
  </style>
</head>
<body>
  <div id="cms-banner">
    <p><strong>Gateway lokal tidak terdeteksi.</strong> Jalankan <code>npm run cms</code> di terminal untuk mengaktifkan CMS lokal, atau <button onclick="this.parentElement.parentElement.style.display='none'">tutup pesan ini</button>.</p>
    <p style="font-size:0.75rem;color:#888;">Untuk deployment produksi (Vercel), login dengan GitHub — gateway lokal tidak diperlukan.</p>
  </div>
  <script>
    (function() {
      try {
        var stored = localStorage.getItem('decap_cms_user');
        if (stored) {
          var parsed = JSON.parse(stored);
          if (parsed && parsed.token && parsed.provider) {
            var existing = localStorage.getItem('decap-cms-user');
            if (!existing) {
              localStorage.setItem('decap-cms-user', JSON.stringify({ token: parsed.token, provider: parsed.provider }));
            }
          }
        }
      } catch(e) { console.warn('[CMS] localStorage restore failed:', e); }

      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        fetch('http://localhost:8081/api/v1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'info' }) })
          .then(function(r) {
            if (!r.ok && r.status !== 400) {
              document.getElementById('cms-banner').style.display = 'block';
            } else {
              console.log('[CMS] Local gateway detected on port 8081');
            }
          })
          .catch(function() {
            document.getElementById('cms-banner').style.display = 'block';
          });
      }
    })();
  </script>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

- [ ] **Step 3: Fix next.config.mjs rewrites to handle admin sub-paths**

In `next.config.mjs`, update the rewrites to handle all admin paths:

```js
async rewrites() {
  return [
    { source: '/admin', destination: '/admin/index.html' },
    { source: '/admin/', destination: '/admin/index.html' },
  ]
},
```

- [ ] **Step 4: Test locally**

Run `npm run dev` in one terminal and `npm run cms` in another. Navigate to `/admin`. Verify CMS loads and can read/write content.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "fix: admin CMS page — add local_backend to config, rewrite index.html with better error handling, fix rewrites"
```

---

## Task 4: Fix modal positioning on mobile + UMKM card overflow

**Files:**
- Modify: `components/DetailModalClient.tsx`
- Modify: `components/UmkmCard.tsx`

- [ ] **Step 1: Refactor DetailModalClient overlay positioning**

In `components/DetailModalClient.tsx`, replace the `DialogPrimitive.Content` positioning from `fixed left-1/2 top-1/2` to a flex-centered overlay approach.

Replace the `DialogPrimitive.Portal` and `DialogPrimitive.Content` block (lines 58-141) with:

```tsx
<DialogPrimitive.Portal>
  <DialogOverlay />
  <DialogPrimitive.Content
    className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-6 focus:outline-none"
  >
    <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">
      {/* Close button */}
      <DialogPrimitive.Close className="absolute right-2 top-2 z-[1002] flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/90 backdrop-blur-sm text-brown-900 transition-colors hover:bg-cream-light" aria-label="Tutup dialog">
        <X className="h-5 w-5" />
        <span className="sr-only">Tutup</span>
      </DialogPrimitive.Close>

      {/* Scrollable content */}
      <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl">
        {/* Image header with overlay */}
        {image ? (
          <button
            type="button"
            onClick={() => lightboxImages.length > 0 && setLightboxOpen(true)}
            className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer block"
          >
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light break-words" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{title}</DialogTitle>
              {description && <DialogDescription className="mt-1 text-sm text-cream-light/85 line-clamp-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{description}</DialogDescription>}
            </div>
          </button>
        ) : (
          <div className="relative bg-gradient-to-r from-terracotta-500 to-gold-500 px-4 pt-12 pb-4 sm:px-6 sm:pt-14 sm:pb-6">
            <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light break-words">{title}</DialogTitle>
            {description && <DialogDescription className="mt-1 text-sm text-cream-light/85">{description}</DialogDescription>}
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6">
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span
                  key={c.label}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={
                    c.color
                      ? { backgroundColor: c.color + '18', color: c.color, border: `1px solid ${c.color}30` }
                      : undefined
                  }
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {body && <div className={cn('prose prose-sm mt-4 max-w-none text-ink/80 prose-headings:text-brown-900 prose-p:text-ink/70 break-words', !image && 'mt-2')}>{body}</div>}

          {hasMap && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brown-900">
                <MapPin className="h-3.5 w-3.5" /> Lokasi
              </div>
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-water-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-water-700"
              >
                <MapPin className="h-4 w-4" />
                Buka di Google Maps
              </a>
            </div>
          )}

          {href && (
            <div className="mt-6 flex justify-end">
              <Link
                href={href}
                className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-medium text-page transition-colors hover:bg-wine"
              >
                {linkLabel ?? 'Lihat halaman lengkap →'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </DialogPrimitive.Content>
</DialogPrimitive.Portal>
```

Key changes:
- Outer container uses `fixed inset-0 flex items-center justify-center p-4` for robust centering
- Inner div is `relative mx-auto w-full max-w-lg rounded-2xl bg-white shadow-xl`
- Modal content scrolls within `max-h-[85vh]` container
- Added `text-shadow` for readability on dark overlays

- [ ] **Step 2: Fix UmkmCard overflow**

In `components/UmkmCard.tsx`, add `overflow-hidden` to the card container and ensure the button is full-width.

Change line 6-7 from:
```tsx
<div className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover">
  <button type="button" onClick={onDetailClick} className="flex min-w-0 flex-1 flex-col text-left">
```
to:
```tsx
<div className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover">
  <button type="button" onClick={onDetailClick} className="flex min-w-0 w-full flex-1 flex-col text-left overflow-hidden">
```

- [ ] **Step 3: Test locally**

Run `npm run dev` and test modal on mobile viewport sizes. Verify modal centers properly, doesn't shift right, and UmkmCard doesn't overflow.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: modal positioning on mobile, UMKM card overflow, and text readability in modals"
```

---

## Task 5: Fix 404 source map errors

**Files:**
- Modify: `next.config.mjs`
- Create: `public/.well-known/appspecific/com.chrome.devtools.json`

- [ ] **Step 1: Add productionBrowserSourceMaps to next.config.mjs**

In `next.config.mjs`, add `productionBrowserSourceMaps: false` to the config object:

```js
const nextConfig = {
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/', destination: '/admin/index.html' },
    ]
  },
}
```

- [ ] **Step 2: Create Chrome DevTools well-known file**

Create `public/.well-known/appspecific/com.chrome.devtools.json`:
```json
{}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix: suppress 404 source map errors and Chrome DevTools well-known requests"
```

---

## Task 6: Improve text readability (hero + modal + PageHero)

**Files:**
- Modify: `components/HeroAnimation.tsx`
- Modify: `components/PageHero.tsx`
- Modify: `components/DetailModalClient.tsx` (already done in Task 4)

- [ ] **Step 1: Improve HeroAnimation text contrast**

In `components/HeroAnimation.tsx`:

Change line 46 (kicker text) — the kicker is already `text-cream-light/70` but needs better contrast. However, looking at the code, the kicker is in `PageHero`, not in `HeroAnimation`. The HeroAnimation itself has:
- Line 87: `<GradientText className="text-cream-light">` — gold gradient text
- Line 91: `<span className="text-cream-light">` — plain cream text
- Line 93: `<motion.p ... className="... text-cream-light/90 ...">` — subtitle

These are already good. The main improvement is the text-shadow. Change line 88:
```tsx
style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
```
to:
```tsx
style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)' }}
```

Also add a stronger shadow to the subtitle. Change line 93:
```tsx
<motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-light/90 sm:text-lg md:text-xl">
```
to:
```tsx
<motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-light/90 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
```

- [ ] **Step 2: Improve PageHero text contrast**

In `components/PageHero.tsx`, add text-shadow to the title and improve kicker opacity.

Change line 45 (kicker):
```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-cream-light/70">{kicker}</p>
```
to:
```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-cream-light/80" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{kicker}</p>
```

Change line 46-51 (title):
```tsx
<h1
  className="mt-2 font-beautique text-display-lg break-words"
  style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
>
```
to:
```tsx
<h1
  className="mt-2 font-beautique text-display-lg break-words"
  style={{ textShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.2)' }}
>
```

Change line 53 (intro):
```tsx
{intro && (
  <p className="mx-auto mt-4 max-w-xl text-sm text-cream-light/80 sm:text-base">{intro}</p>
)}
```
to:
```tsx
{intro && (
  <p className="mx-auto mt-4 max-w-xl text-sm text-cream-light/85 sm:text-base" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{intro}</p>
)}
```

- [ ] **Step 3: Verify visually**

Run `npm run dev` and check:
- Homepage hero text is readable against the background image
- Each page's PageHero (pariwisata, umkm, etc.) has readable kicker, title, and intro
- Detail modals have readable text in both image-header and fallback-header states

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: improve text readability with stronger text-shadow and better contrast on hero, page hero, and modals"
```

---

## Task 7: Add loading states (skeleton UI)

**Files:**
- Create: `app/pariwisata/loading.tsx`
- Create: `app/umkm/loading.tsx`
- Create: `app/kesehatan/loading.tsx`
- Create: `app/irigasi/loading.tsx`
- Create: `app/festival/loading.tsx`
- Create: `app/cerita/loading.tsx`
- Create: `app/air-tanah/loading.tsx`
- Create: `app/lingkungan/loading.tsx`
- Create: `app/peta/loading.tsx`
- Create: `app/tentang-sambelia/loading.tsx`

- [ ] **Step 1: Create shared skeleton component**

Create `components/Skeleton.tsx`:

```tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-cream-beige ${className ?? ''}`} />
}

export function HeroSkeleton() {
  return (
    <section className="flex h-[100dvh] min-h-[600px] items-center justify-center">
      <Skeleton className="h-12 w-64" />
    </section>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create loading files for each page**

Each `loading.tsx` follows the same pattern. Here's `app/pariwisata/loading.tsx`:

```tsx
import { Skeleton, CardSkeleton } from '@/components/Skeleton'

export default function PariwisataLoading() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-water-900 via-water-700 to-brown-900 py-12 md:py-20 text-center text-cream-light">
        <Skeleton className="mx-auto h-6 w-24" />
        <Skeleton className="mx-auto mt-2 h-10 w-64" />
        <Skeleton className="mx-auto mt-4 h-4 w-96" />
      </section>
      <div className="mx-auto max-w-content px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </>
  )
}
```

Create similar files for umkm, kesehatan, irigasi, festival, cerita, air-tanah, lingkungan, peta, and tentang-sambelia. Each uses the matching hero gradient tone and appropriate skeleton count.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add skeleton loading states for all content pages"
```

---

## Task 8: Add error boundaries

**Files:**
- Create: `app/error.tsx`
- Create: `app/pariwisata/error.tsx`
- Create: `app/umkm/error.tsx`
- Create: `app/kesehatan/error.tsx`
- Create: `app/irigasi/error.tsx`
- Create: `app/festival/error.tsx`
- Create: `app/cerita/error.tsx`

- [ ] **Step 1: Create root error boundary**

Create `app/error.tsx`:

```tsx
'use client'

import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-beautique text-4xl text-brown-900">Terjadi Kesalahan</h1>
      <p className="mt-2 text-ink/70">Maaf, terjadi kesalahan saat memuat halaman ini.</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-water-900 px-6 py-3 font-medium text-page transition-colors hover:bg-water-500"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="rounded-full border border-tan-700/30 px-6 py-3 font-medium text-brown-900 transition-colors hover:bg-cream-beige"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create per-route error boundaries**

Each route-specific error boundary can use the same template. Create them for: pariwisata, umkm, kesehatan, irigasi, festival, cerita. They use the same component but are separate files for route-level isolation.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add styled error boundaries for all routes"
```

---

## Task 9: Add JSON-LD structured data

**Files:**
- Modify: `app/pariwisata/[slug]/page.tsx`
- Modify: `app/umkm/page.tsx`
- Modify: `app/festival/page.tsx`
- Modify: `app/cerita/[slug]/page.tsx`

- [ ] **Step 1: Add JSON-LD helper function**

Create `lib/jsonld.ts`:

```ts
const BASE_URL = 'https://melukis-sambelia.vercel.app'

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Melukis Sambelia',
    url: BASE_URL,
    description: 'Portal komunitas KKN-PPM UGM Melukis Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa binaan.',
  }
}

export function touristAttractionJsonLd(item: { title: string; slug: string; shortDesc: string; cover: string; lat: number; lng: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.shortDesc,
    url: `${BASE_URL}/pariwisata/${item.slug}`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: item.lat,
      longitude: item.lng,
    },
  }
}

export function localBusinessJsonLd(item: { name: string; slug: string; kategori: string; village: string; cover: string; lat: number; lng: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: item.name,
    description: `${item.kategori} di ${item.village}`,
    url: `${BASE_URL}/umkm`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: item.lat,
      longitude: item.lng,
    },
  }
}

export function eventJsonLd(item: { eventName: string; schedule: string; venue: string; description: string; cover: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: item.eventName,
    description: item.description,
    location: { '@type': 'Place', name: item.venue },
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
  }
}

export function articleJsonLd(item: { title: string; slug: string; author: string; date: string; excerpt: string; cover: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    author: { '@type': 'Person', name: item.author },
    datePublished: item.date,
    description: item.excerpt,
    url: `${BASE_URL}/cerita/${item.slug}`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
  }
}
```

- [ ] **Step 2: Add JSON-LD to pariwisata detail pages**

In `app/pariwisata/[slug]/page.tsx`, add structured data to the metadata or render a `<script type="application/ld+json">` with `touristAttractionJsonLd()`.

- [ ] **Step 3: Add JSON-LD to UMKM, festival, and cerita pages**

Follow the same pattern for each content type, using the appropriate JSON-LD helper.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add JSON-LD structured data for SEO (TouristAttraction, LocalBusiness, Event, Article)"
```

---

## Task 10: Content validation script

**Files:**
- Create: `scripts/validate-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create validation script**

Create `scripts/validate-content.mjs`:

```js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'content')

const COLLECTIONS = [
  { name: 'pariwisata', ext: '.mdx' },
  { name: 'irigasi', ext: '.md' },
  { name: 'kesehatan', ext: '.md' },
  { name: 'festival', ext: '.md' },
  { name: 'cerita', ext: '.mdx' },
  { name: 'umkm', ext: '.md' },
  { name: 'air-tanah', ext: '.md', dir: 'air-tanah' },
  { name: 'desa', ext: '.md' },
]

let errors = 0
let warnings = 0

for (const col of COLLECTIONS) {
  const dir = path.join(CONTENT_DIR, col.dir ?? col.name)
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  ${col.name}: directory not found, skipping`)
    warnings++
    continue
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith(col.ext))
  if (files.length === 0) {
    console.log(`⚠️  ${col.name}: no ${col.ext} files found`)
    warnings++
    continue
  }
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    if (!raw.trim().startsWith('---')) {
      console.error(`❌ ${col.name}/${file}: missing frontmatter delimiter`)
      errors++
      continue
    }
    const endMatch = raw.indexOf('---', 3)
    if (endMatch === -1) {
      console.error(`❌ ${col.name}/${file}: unclosed frontmatter`)
      errors++
      continue
    }
    const frontmatter = raw.slice(3, endMatch).trim()
    // Check for unquoted dates (common YAML gotcha)
    const dateLineMatch = frontmatter.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)
    if (dateLineMatch) {
      console.warn(`⚠️  ${col.name}/${file}: date value is unquoted — this may cause YAML to parse it as a Date object. Wrap in quotes: date: '${dateLineMatch[1]}'`)
      warnings++
    }
    // Check for unquoted datetime values
    const dateTimeMatch = frontmatter.match(/^date:\s*\d{4}-\d{2}-\d{2}T/m)
    if (dateTimeMatch) {
      console.warn(`⚠️  ${col.name}/${file}: datetime value is unquoted — wrap in quotes`)
      warnings++
    }
    console.log(`✅ ${col.name}/${file}`)
  }
}

// Validate settings file
const settingsPath = path.join(CONTENT_DIR, '_settings.md')
if (fs.existsSync(settingsPath)) {
  console.log(`✅ settings/_settings.md exists`)
} else {
  console.error(`❌ _settings.md not found`)
  errors++
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`)
if (errors > 0) process.exit(1)
```

- [ ] **Step 2: Add script to package.json**

In `package.json`, add to scripts:
```json
"validate": "node scripts/validate-content.mjs",
```

- [ ] **Step 3: Run validation**

Run: `node scripts/validate-content.mjs`
Expected: All files pass, warnings for unquoted dates.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add content validation script for frontmatter checking"
```

---

## Task 11: Add UMKM slugs to sitemap + canonical URLs

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add UMKM and other dynamic routes to sitemap**

In `app/sitemap.ts`, add UMKM entries to the dynamic section and add canonical URL support. Update the file to:

```ts
import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'

const BASE = 'https://melukis-sambelia.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/tentang-sambelia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/peta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/pariwisata`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/irigasi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/kesehatan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/umkm`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/festival`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/cerita`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/air-tanah`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/lingkungan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
  const dynamic: MetadataRoute.Sitemap = [
    ...getCollection('pariwisata').map((p) => ({ url: `${BASE}/pariwisata/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...getCollection('cerita').map((c) => ({ url: `${BASE}/cerita/${c.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...getCollection('umkm').map((u) => ({ url: `${BASE}/umkm`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...getCollection('festival').map((f) => ({ url: `${BASE}/festival`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 })),
  ]
  return [...staticRoutes, ...dynamic]
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add UMKM and festival entries to sitemap"
```

---

## Task 12: Mobile bottom sheet modal + swipe-to-close

**Files:**
- Modify: `components/DetailModalClient.tsx`

- [ ] **Step 1: Add mobile bottom sheet behavior to DetailModalClient**

In `components/DetailModalClient.tsx`, add mobile-responsive behavior. On screens < 640px, the modal should appear as a bottom sheet (anchored to bottom, rounded top corners, swipe down to close).

Add a `useEffect` that detects screen size and adjusts the modal positioning. The key CSS changes:
- On mobile: `fixed bottom-0 left-0 right-0 rounded-t-2xl` with `max-h-[85dvh]`
- On desktop: `fixed inset-0 flex items-center justify-center` with `max-w-lg`

Update the `DialogPrimitive.Content` className to be responsive:

```tsx
className="fixed inset-0 z-[1001] flex items-center justify-center p-0 sm:p-4 focus:outline-none"
```

And the inner modal div:
```tsx
className="relative w-full max-w-lg rounded-none sm:rounded-2xl bg-white shadow-xl max-h-[85dvh] sm:max-h-[85vh] overflow-hidden fixed bottom-0 sm:relative rounded-t-2xl sm:rounded-none"
```

Actually, the cleaner approach is to make the overlay handle both cases:

```tsx
<DialogPrimitive.Portal>
  <DialogOverlay />
  <DialogPrimitive.Content className="fixed z-[1001] flex flex-col items-stretch sm:items-center sm:justify-center inset-0 sm:p-4 focus:outline-none">
    <div className="relative mx-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl max-h-[85dvh] overflow-hidden mt-auto sm:mt-0">
      ...
    </div>
  </DialogPrimitive.Content>
</DialogPrimitive.Portal>
```

This positions the modal at the bottom on mobile and centered on desktop.

- [ ] **Step 2: Add swipe-down-to-close gesture**

Add touch event handlers for swipe-to-close on mobile. Import `useRef` and add gesture handling:

```tsx
const touchStartY = useRef(0)
const touchCurrentY = useRef(0)
const modalRef = useRef<HTMLDivElement>(null)

const handleTouchStart = (e: React.TouchEvent) => {
  touchStartY.current = e.touches[0].clientY
}

const handleTouchMove = (e: React.TouchEvent) => {
  touchCurrentY.current = e.touches[0].clientY
  const diff = touchCurrentY.current - touchStartY.current
  if (diff > 0 && modalRef.current) {
    modalRef.current.style.transform = `translateY(${diff}px)`
  }
}

const handleTouchEnd = () => {
  const diff = touchCurrentY.current - touchStartY.current
  if (diff > 100) {
    onOpenChange(false)
  }
  if (modalRef.current) {
    modalRef.current.style.transform = ''
  }
}
```

Add these handlers to the inner modal div: `onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}`

- [ ] **Step 3: Test on mobile viewport**

Run `npm run dev` and test:
- On mobile viewport (< 640px): modal appears as bottom sheet
- On desktop: modal appears centered
- Swipe down > 100px closes the modal on mobile

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: mobile bottom sheet modal with swipe-to-close gesture"
```

---

## Task 13: Accessibility improvements

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `components/BackToTop.tsx`
- Modify: `components/UmkmListClient.tsx`
- Modify: `components/PariwisataListClient.tsx`
- Modify: `components/KesehatanListClient.tsx`
- Modify: `components/IrigasiListClient.tsx`

- [ ] **Step 1: Add aria-label to BackToTop icon button**

Read `components/BackToTop.tsx` and ensure the button has an `aria-label` like "Kembali ke atas".

- [ ] **Step 2: Add aria-live to filter sections**

In `components/UmkmListClient.tsx`, add `aria-live="polite"` to the grid container that shows filtered results:

```tsx
<StaggerContainer
  key={activeKategori}
  stagger={0.08}
  mode="mount"
  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
  role="region"
  aria-live="polite"
  aria-label={`Menampilkan ${filtered.length} UMKM`}
>
```

Apply similar `aria-live` to `PariwisataListClient.tsx`, `KesehatanListClient.tsx`, and `IrigasiListClient.tsx` where applicable.

- [ ] **Step 3: Verify skip-link works**

The skip link exists in `app/layout.tsx`. Verify it's functional by keyboard-navigating the site.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add aria-live to filter sections and verify accessibility"
```

---

## Task 14: Image optimization — remove unoptimized flag

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Configure image optimization**

In `next.config.mjs`, replace `images: { unoptimized: true }` with proper image domain configuration:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**' },
  ],
},
```

This allows Next.js image optimization to work with any remote images while optimizing local ones. Using `hostname: '**'` is appropriate since this is a community site with user-uploaded content.

- [ ] **Step 2: Verify build and images work**

Run: `npm run build`
Check that all images render correctly and are optimized.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: enable Next.js image optimization, remove unoptimized flag"
```

---

## Task 15: Mobile nav backdrop + improved transitions

**Files:**
- Modify: `components/Nav.tsx`

- [ ] **Step 1: Add backdrop overlay to mobile nav**

In `components/Nav.tsx`, add a backdrop overlay behind the mobile menu. After the `<AnimatePresence>` block that renders the mobile menu, add a backdrop that appears when `open` is true:

Actually, looking at the code, the mobile menu already has `border-t` and `bg-page`. Add a backdrop overlay before the menu `<motion.div>`:

```tsx
{open && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm lg:hidden"
    onClick={() => setOpen(false)}
    aria-hidden
  />
)}
```

Place this right before the mobile menu `<motion.div>` inside the `<AnimatePresence>`.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add backdrop overlay to mobile navigation menu"
```

---

## Task 16: Design system polish — extract ContentCard, standardize spacing, overflow-hidden audit

**Files:**
- Create: `components/ContentCard.tsx`
- Modify: `components/DataCard.tsx`
- Modify: `components/UmkmCard.tsx`
- Modify: `components/FestivalTimeline.tsx`
- Modify: `app/page.tsx`
- Modify: `app/lingkungan/page.tsx`
- Modify: `app/tentang-sambelia/page.tsx`

- [ ] **Step 1: Create ContentCard base component**

Create `components/ContentCard.tsx` that extracts the shared card pattern from DataCard and UmkmCard:

```tsx
import { cn } from '@/lib/utils'

export function ContentCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover',
        className
      )}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Refactor DataCard to use ContentCard**

Update `DataCard.tsx` to use `ContentCard` as the wrapper, removing the duplicated class string.

- [ ] **Step 3: Refactor UmkmCard to use ContentCard**

Update `UmkmCard.tsx` to use `ContentCard` as the wrapper.

- [ ] **Step 4: Add overflow-hidden to sections with MotifFloater**

Audit all pages that use `MotifFloater` and ensure their container divs have `overflow-hidden`. Check `PariwisataListClient`, `UmkmListClient`, `KesehatanListClient`, `IrigasiListClient`, and the homepage sections.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "refactor: extract ContentCard base component, standardize card patterns, add overflow-hidden to sections"
```

---

## Task 17: Add pre-commit hooks (Husky + lint-staged)

**Files:**
- Modify: `package.json`
- Create: `.husky/pre-commit`
- Create: `.husky/_/husky.sh` (auto-generated by husky)

- [ ] **Step 1: Install husky and lint-staged**

Run: `npm install --save-dev husky lint-staged`

- [ ] **Step 2: Initialize husky**

Run: `npx husky init`

- [ ] **Step 3: Configure lint-staged in package.json**

Add to `package.json`:
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{md,mdx}": ["prettier --write"]
}
```

- [ ] **Step 4: Update husky pre-commit hook**

Update `.husky/pre-commit`:
```sh
npx lint-staged
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: add husky pre-commit hooks with lint-staged"
```

---

## Task 18: Final verification

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No linting errors

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds without Tailwind ease warnings or cerita frontmatter errors

- [ ] **Step 4: Run content validation**

Run: `node scripts/validate-content.mjs`
Expected: All content files pass

- [ ] **Step 5: Visual verification with dev server**

Run: `npm run dev` and check:
- `/admin` loads CMS correctly
- `/umkm` page: cards are centered, no overflow, modal works on mobile
- `/pariwisata` page: modal works on mobile
- Hero text is readable
- Page hero text is readable
- No Tailwind ease warnings in console
- No 404 errors for LayoutGroupContext source maps