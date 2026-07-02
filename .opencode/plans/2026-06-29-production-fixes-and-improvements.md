# Production Fixes & Visual Improvements Design

Date: 2026-06-29

## Problem Summary

Four issues need to be addressed:

1. **CMS content not reflecting on production** after updates via Decap CMS
2. **Overflow/overlap issues** across components, pages, and cards
3. **Modal scrolling** only scrolls one section instead of the whole modal
4. **Visual quality audit** — responsiveness, pixel issues, content structure, mobile-first design

Plus three new features requested: image lightbox, breadcrumbs, and social share buttons.

---

## 1. CMS Content Freshness: Switch to ISR

### Root Cause

All content pages use `export const dynamic = 'force-dynamic'`, which forces server-side rendering on every request. On Vercel, the serverless function reads from the **deployed filesystem** — not the live GitHub repo. So when Decap CMS commits new content, it doesn't appear until Vercel rebuilds and deploys, even though the rebuild IS triggered by the commit. The `force-dynamic` setting adds unnecessary overhead without solving the freshness problem.

### Fix

Replace `export const dynamic = 'force-dynamic'` with `export const revalidate = 60` on all content pages. This enables ISR (Incremental Static Regeneration):

- Pages are statically generated at build time (faster, cheaper)
- Revalidated every 60 seconds in the background
- Immediately serves cached version while revalidating (no loading state)
- New content appears within 60 seconds after a Vercel rebuild

### Files to Change

| File | Change |
|------|--------|
| `app/page.tsx` | Replace `dynamic = 'force-dynamic'` with `revalidate = 60` |
| `app/cerita/page.tsx` | Same |
| `app/cerita/[slug]/page.tsx` | Same |
| `app/festival/page.tsx` | Same |
| `app/irigasi/page.tsx` | Same |
| `app/kesehatan/page.tsx` | Same |
| `app/lingkungan/page.tsx` | Same |
| `app/pariwisata/page.tsx` | Same |
| `app/pariwisata/[slug]/page.tsx` | Same |
| `app/peta/page.tsx` | Same |
| `app/tentang-sambelia/page.tsx` | Same |
| `app/umkm/page.tsx` | Same |
| `app/air-tanah/page.tsx` | Same |

### CMS Auth Redirect Loop Fix

The Decap CMS admin page redirects to login on every refresh. This happens because the token isn't being persisted properly in localStorage.

**Fix:**

1. In `public/admin/config.yml`, add `pkce: true` to the backend config (removes need for `client_secret` in production, simplifies auth)
2. In `public/admin/index.html`, ensure Decap CMS properly restores the auth token from localStorage
3. Remove the `auth_endpoint` and `base_url` from config if switching to PKCE, since Decap CMS handles PKCE natively with the GitHub backend

---

## 2. Overflow & Layout Fixes

### 2a. Duplicate SectionHeaders

**Pages affected:** `cerita/page.tsx`, `lingkungan/page.tsx`

Both pages render a `PageHero` (with kicker, title, intro) followed immediately by a `SectionHeader` that duplicates the exact same content.

**Fix:** Remove the duplicate `SectionHeader` from both pages. The `PageHero` already provides the section header.

### 2b. Modal Scrolling

**File:** `components/DetailModalClient.tsx`

**Current behavior:**
- Outer container: `max-h-[80vh] overflow-hidden` — clips content
- Body area: `overflow-y-auto max-h-[35vh]` — only 35% of viewport scrolls
- Image header is fixed (doesn't scroll with content)

**Fix:** Restructure the modal so the entire content scrolls as one unit:

1. Change outer container to `max-h-[85vh] overflow-y-auto` (scroll the whole modal)
2. Remove `overflow-hidden` from outer container
3. Remove `max-h-[35vh]` and `overflow-y-auto` from the inner body div
4. Keep the image as part of the normal scroll flow (not sticky)
5. Close button stays absolutely positioned within the scroll container, using `sticky top-0`

### 2c. CeritaStats Zero Values

**Files:** `components/CeritaStats.tsx`, `components/CountUpStat.tsx`

The `CountUpStat` animation uses `useInView` with `once: true`. If the component mounts before intersection observer is ready, or if `prefers-reduced-motion` is active, the animation may not trigger.

**Fix:**
1. Add `prefers-reduced-motion` support: skip animation, show final value immediately
2. Ensure `CountUpStat` shows the string value as fallback when animation hasn't started
3. Verify props are passed correctly from `CeritaStats`

### 2d. Frontend Quality & Responsiveness Audit

Systematically review all components for:

1. **Mobile overflow** — Check all cards, containers, and text elements for horizontal overflow on screens < 375px wide
2. **Touch targets** — Ensure all interactive elements are at least 44x44px
3. **Text truncation** — Add `line-clamp` or `overflow-hidden text-ellipsis` to card titles and descriptions
4. **Image aspect ratios** — Ensure consistent aspect ratios across all card types
5. **Spacing consistency** — Use consistent padding/margin patterns
6. **Long content handling** — Test with unusually long titles, descriptions, and chip labels
7. **Z-index conflicts** — Audit all `z-index` values for consistency
8. **`min-w-0`** on flex/grid children that contain text
9. **`break-words`** on long text in cards
10. **Modal width** — use `w-[calc(100vw-2rem)]` for better mobile control

**Components to audit:**

| Component | Focus Areas |
|-----------|-------------|
| `Nav.tsx` | Mobile menu overflow; touch dropdown support |
| `DataCard.tsx` | Long titles overflow; hover states on touch |
| `UmkmCard.tsx` | Contact info overflow on small screens |
| `DetailModalClient.tsx` | Scrolling fix (2b); close button overlap |
| `GalleryStrip.tsx` | Add scroll indicator; discoverability on mobile |
| `FestivalTimeline.tsx` | Timeline overflow on small screens |
| `PageHero.tsx` | Text overflow on small viewports |
| `StatCard.tsx` | Large number layout |
| `CeritaStats.tsx` | Zero values (2c) |
| `PetaSection.tsx` | Card responsive breakpoints |
| `HeroAnimation.tsx` | Parallax on mobile |

---

## 3. New Features

### 3a. Image Lightbox

**New component:** `components/Lightbox.tsx`

A fullscreen image overlay triggered by clicking images in:
- `GalleryStrip` (on pariwisata detail pages)
- Modal image headers (click to expand)

**Implementation:**
- Use Radix `Dialog` for overlay (consistent with existing modal pattern)
- Dark semi-transparent backdrop (`bg-black/90`)
- Centered image with `object-contain` for any aspect ratio
- Close on backdrop click, Escape key, or X button
- Arrow navigation between gallery images (Left/Right keys)
- Previous/Next buttons visible on hover
- Image counter (1/5, 2/5, etc.)

### 3b. Breadcrumbs

**Pages:** `/pariwisata/[slug]`, `/cerita/[slug]`

Breadcrumb pattern:
```
Beranda > Pariwisata > Pantai Sugian
Beranda > Cerita > Judul Cerita
```

**Implementation:**
- New `Breadcrumb` component using `<nav aria-label="Breadcrumb"><ol>` pattern
- `ChevronRight` icon separators from lucide-react
- Color: `text-ink/60` for links, `text-ink` for current page
- Responsive: show full path on tablet+, truncate middle on mobile
- Add `BreadcrumbList` JSON-LD structured data for SEO

### 3c. Social Share Buttons

**Pages:** `/pariwisata/[slug]`, `/cerita/[slug]`

Share buttons:
- **WhatsApp** (primary for Indonesian audience)
- **Twitter/X**
- **Copy link** (clipboard)

**Implementation:**
- New `ShareButtons` component
- Positioned below content on detail pages
- WhatsApp: `https://wa.me/?text={title}%20{url}`
- Twitter: `https://twitter.com/intent/tweet?text={title}&url={url}`
- Copy link: `navigator.clipboard.writeText(url)` with Sonner toast feedback
- Icons from lucide-react: `Share2`, `Link`

---

## 4. Deployment & Collaborator Setup

### Adding Collaborators

1. Go to GitHub repo **Settings > Collaborators**
2. Click **Add people** and enter collaborator's GitHub username
3. They receive an email invitation
4. Once accepted, they can:
   - Push code changes via Git
   - Use Decap CMS admin at `/admin` (log in with their GitHub account)
   - CMS writes to `main` branch
5. Each CMS commit triggers Vercel rebuild via GitHub integration

Security recommendations:
- Give **Write** access (not Admin) for collaborators
- Decap CMS config specifies `branch: main` — all edits go to main
- Consider branch protection rules for code review if needed

---

## Implementation Order

1. **ISR migration** (CMS freshness fix) — high priority, affects all content
2. **Modal scrolling fix** — high priority, affects UX across multiple pages
3. **Duplicate SectionHeader removal** — quick fix
4. **CeritaStats zero fix** — data display bug
5. **CMS auth redirect loop fix** — affects content editing workflow
6. **Frontend responsiveness audit** — systematic review and fixes
7. **Image lightbox** — new feature
8. **Breadcrumbs** — new feature
9. **Social share buttons** — new feature