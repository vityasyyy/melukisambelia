# Melukis Sambelia — Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the whole Melukis Sambelia website with a clean, modern, Figma-informed design system, replace off-theme images with on-brand illustrated placeholders, and add five unique static-friendly features.

**Architecture:** Keep the existing Next.js 14 static export + shadcn/ui + Tailwind stack. Extend the design-system tokens and reusable components first, then replace images/content references, then restyle pages top-to-bottom. All new features are component-level (countdown, filter chips, gallery, CTA, motif animation) with no backend changes.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, shadcn/ui, react-leaflet, vitest, Playwright.

---

## File Structure

### Design system files
- `app/globals.css` — extended palette variables, gradient-text utility, shadow utilities, motif animations.
- `tailwind.config.ts` — confirm first-class tokens for Figma-derived colors (`wine`, `cream`, `goldBright`, `goldSoft`, `olive`, `brownDark`) and add typography/shadow/animation extensions.

### New components (in `components/`)
- `components/Pill.tsx` — rounded badge/pill.
- `components/GradientText.tsx` — gold gradient display text wrapper.
- `components/CountdownStrip.tsx` — festival countdown (client).
- `components/MapFilterChips.tsx` — color-coded pill chips for `/peta` layers.
- `components/KilasSambelia.tsx` — masonry gallery from content collections.
- `components/SponsorCta.tsx` — Beranda bottom CTA section.

### Updated components
- `components/SectionHeader.tsx` — tone variant + pill kicker.
- `components/StatCard.tsx` — cream bg, gold underline, terracotta shadow.
- `components/DataCard.tsx` — warm cream, hover lift, accent border.
- `components/MotifDivider.tsx` — fade/scroll animation.
- `components/Nav.tsx` — pill active state.
- `components/Footer.tsx` — warm footer restyle.

### Illustrations (in `public/images/content/` and `public/images/placeholders/`)
New SVG placeholders generated from palette + motif. Old JPGs deleted.

### Pages (in `app/`)
Every public page gets a pass: `page.tsx`, `festival/page.tsx`, `peta/page.tsx`, `pariwisata/page.tsx`, `pariwisata/[slug]/page.tsx`, `irigasi/page.tsx`, `kesehatan/page.tsx`, `kegiatan/page.tsx`, `cerita/page.tsx`, `cerita/[slug]/page.tsx`, `umkm/page.tsx`, `mitra/page.tsx`, `profil-tim/page.tsx`, `tentang-sambelia/page.tsx`, `not-found.tsx`.

### Content (in `content/`)
Update `cover` frontmatter to point at new themed placeholders per type.

### Tests
- Keep `tests/content.test.ts`, `tests/map.test.ts`, `tests/schemas.test.ts` passing.
- Update `tests/e2e/smoke.spec.ts` only if selectors change.
- Final gate: `npm run lint && npm run typecheck && npm test && npm run build`.

---

# Phase 1: Design System Foundations

## Task 1: Audit and finalize Tailwind tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Read current tokens**

Read `app/globals.css` and `tailwind.config.ts`. Confirm these CSS variables already exist:
```css
--wine: #701414;
--wine-deep: #671919;
--cream-warm: #EFE3AB;
--cream-light: #FEFDD7;
--cream-beige: #F2EBD8;
--gold-bright: #F9E11F;
--gold-soft: #FEDF9F;
--olive: #68794A;
--brown-dark: #47230F;
```

- [ ] **Step 2: Verify Tailwind mapping is complete**

In `tailwind.config.ts`, ensure `colors` contains:
```ts
colors: {
  wine: { DEFAULT: 'var(--wine)', deep: 'var(--wine-deep)' },
  cream: { warm: 'var(--cream-warm)', light: 'var(--cream-light)', beige: 'var(--cream-beige)' },
  goldBright: 'var(--gold-bright)',
  goldSoft: 'var(--gold-soft)',
  olive: 'var(--olive)',
  brownDark: 'var(--brown-dark)',
  // existing tokens stay
}
```
If any are missing, add them. Also add a `fontSize` scale extension:
```ts
fontSize: {
  'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
  'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1' }],
}
```

- [ ] **Step 3: Add CSS utilities in `app/globals.css`**

Append inside `@layer utilities`:
```css
@layer utilities {
  .text-balance { text-wrap: balance; }

  .text-gradient-gold {
    background: linear-gradient(132deg, #FFCE07 17%, #FFE09A 50%, #FEFDD7 97%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #F0AC6D; /* solid fallback for accessibility / print */
  }

  .shadow-terracotta {
    box-shadow: 0 8px 24px -12px rgba(116, 45, 27, 0.25);
  }

  .shadow-terracotta-hover {
    box-shadow: 0 16px 32px -12px rgba(116, 45, 27, 0.35);
  }

  .hero-vignette {
    background: linear-gradient(180deg, rgba(116, 45, 27, 0) 0%, rgba(116, 45, 27, 0.85) 100%);
  }

  .section-watermark {
    background-image: url('/images/design-system/batik_sambel.svg');
    background-size: 1200px auto;
    opacity: 0.06;
  }

  .motif-fade {
    animation: motifFadeIn 1s ease-out both;
  }

  @keyframes motifFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 0.06; transform: translateY(0); }
  }
}
```

- [ ] **Step 4: Typecheck and build baseline**

Run: `npm run typecheck`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat(design-system): finalize Figma-derived tokens, gradient text, shadows, motif animation"
```

## Task 2: Create reusable Pill + GradientText components

**Files:**
- Create: `components/Pill.tsx`
- Create: `components/GradientText.tsx`

- [ ] **Step 1: Write `components/Pill.tsx`**

```tsx
import { cn } from '@/lib/utils'

export function Pill({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'green' | 'water' | 'terracotta' | 'outline'
  className?: string
}) {
  const variants = {
    default: 'bg-gold-100 text-brown-900',
    gold: 'bg-goldSoft text-brownDark',
    green: 'bg-green-50 text-green-900',
    water: 'bg-water-50 text-water-900',
    terracotta: 'bg-terracotta-500/15 text-wine',
    outline: 'border border-tan-700/40 bg-page text-ink/80',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide', variants[variant], className)}>
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Write `components/GradientText.tsx`**

```tsx
import { cn } from '@/lib/utils'

export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('text-gradient-gold', className)}>{children}</span>
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/Pill.tsx components/GradientText.tsx
git commit -m "feat(components): Pill and GradientText primitives"
```

## Task 3: Update SectionHeader, StatCard, DataCard, MotifDivider

**Files:**
- Modify: `components/SectionHeader.tsx`
- Modify: `components/StatCard.tsx`
- Modify: `components/DataCard.tsx`
- Modify: `components/MotifDivider.tsx`

- [ ] **Step 1: Update `SectionHeader.tsx`**

Replace file with:
```tsx
import { Pill } from './Pill'
import { cn } from '@/lib/utils'

export function SectionHeader({
  kicker,
  title,
  intro,
  tone = 'water',
  centered = false,
  className,
}: {
  kicker: string
  title: string
  intro?: string
  tone?: 'water' | 'green' | 'terracotta' | 'gold' | 'olive'
  centered?: boolean
  className?: string
}) {
  const toneMap = {
    water: 'bg-water-50 text-water-900',
    green: 'bg-green-50 text-green-900',
    terracotta: 'bg-terracotta-500/15 text-wine',
    gold: 'bg-goldSoft text-brownDark',
    olive: 'bg-cream-beige text-olive',
  }
  return (
    <header className={cn('mb-10', centered && 'text-center', className)}>
      <Pill variant={tone} className={cn('mb-3', toneMap[tone])}>{kicker}</Pill>
      <h2 className="font-beautique text-display-lg text-brown-900">{title}</h2>
      {intro && <p className={cn('mt-3 max-w-2xl text-ink/70 leading-relaxed', centered && 'mx-auto')}>{intro}</p>}
    </header>
  )
}
```

- [ ] **Step 2: Update `StatCard.tsx`**

Replace file with:
```tsx
export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/60 p-6 text-center shadow-terracotta transition-transform hover:-translate-y-1 hover:shadow-terracotta-hover">
      <div className="font-beautique text-3xl md:text-4xl text-water-900">
        {value}
        {unit && <span className="text-sm text-ink/60 ml-1">{unit}</span>}
      </div>
      <div className="mx-auto mt-2 h-0.5 w-10 bg-gold-500 rounded-full" />
      <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink/60">{label}</div>
    </div>
  )
}
```

- [ ] **Step 3: Update `DataCard.tsx`**

Replace file with:
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function DataCard({
  href,
  image,
  title,
  chips = [],
  desc,
  accent = '#F0AC6D',
}: {
  href: string
  image: string
  title: string
  chips?: { label: string; color?: string }[]
  desc?: string
  accent?: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{title}</h3>
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c.label}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={c.color ? { backgroundColor: c.color + '18', color: c.color, border: `1px solid ${c.color}30` } : undefined}
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
        {desc && <p className="mt-2 text-sm text-ink/70 line-clamp-2 leading-relaxed">{desc}</p>}
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Update `MotifDivider.tsx`**

Replace file with:
```tsx
'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function MotifDivider({
  motif = 'cincin_sambel',
  className,
  animate = true,
}: {
  motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'
  className?: string
  animate?: boolean
}) {
  return (
    <div className={cn('flex justify-center py-6', className)}>
      <Image
        src={`/images/design-system/${motif}.svg`}
        alt=""
        width={120}
        height={40}
        aria-hidden
        className={cn('opacity-20', animate && 'motif-fade')}
      />
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

Run: `npm run typecheck`
Run: `npm run build`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add components/SectionHeader.tsx components/StatCard.tsx components/DataCard.tsx components/MotifDivider.tsx
git commit -m "feat(components): restyle SectionHeader, StatCard, DataCard, MotifDivider"
```

---

# Phase 2: New Components and Features

## Task 4: Create CountdownStrip (festival countdown)

**Files:**
- Create: `components/CountdownStrip.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Festival } from '@/lib/schemas'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function getNextEvent(festivals: Festival[]) {
  const now = new Date().getTime()
  const future = festivals
    .map((f) => ({ f, time: new Date(f.schedule).getTime() }))
    .filter((x) => !isNaN(x.time) && x.time > now)
    .sort((a, b) => a.time - b.time)[0]
  return future ?? null
}

export function CountdownStrip({ festivals }: { festivals: Festival[] }) {
  const next = useMemo(() => getNextEvent(festivals), [festivals])
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!next) return
    const tick = () => {
      const diff = next.time - Date.now()
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [next])

  if (!next) return null

  return (
    <div className="rounded-2xl bg-gradient-to-r from-wine via-terracotta-500 to-gold-500 p-1 shadow-terracotta">
      <div className="rounded-xl bg-page px-6 py-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
          Menuju {next.f.eventName}
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 sm:gap-6">
          {[
            { label: 'Hari', value: left.days },
            { label: 'Jam', value: left.hours },
            { label: 'Menit', value: left.minutes },
            { label: 'Detik', value: left.seconds },
          ].map((u) => (
            <div key={u.label} className="text-center">
              <div className="font-beautique text-3xl sm:text-4xl text-brown-900">{pad(u.value)}</div>
              <div className="text-[10px] uppercase tracking-wide text-ink/60">{u.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink/70">{next.f.venue} · {next.f.schedule}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CountdownStrip.tsx
git commit -m "feat(components): add CountdownStrip for festival events"
```

## Task 5: Create MapFilterChips

**Files:**
- Create: `components/MapFilterChips.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { MapLayer } from '@/lib/map'
import { cn } from '@/lib/utils'

const LAYER_META: Record<MapLayer, { label: string; color: string }> = {
  pariwisata: { label: 'Pariwisata', color: '#14A8E1' },
  irigasi: { label: 'Irigasi', color: '#99BA57' },
  kesehatan: { label: 'Kesehatan', color: '#667F37' },
  umkm: { label: 'UMKM', color: '#F0AC6D' },
}

export function MapFilterChips({
  active,
  onToggle,
}: {
  active: Record<MapLayer, boolean>
  onToggle: (layer: MapLayer) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(LAYER_META) as MapLayer[]).map((layer) => {
        const meta = LAYER_META[layer]
        const isActive = active[layer]
        return (
          <button
            key={layer}
            onClick={() => onToggle(layer)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
              isActive
                ? 'border-transparent bg-cream-beige text-brown-900 shadow-sm'
                : 'border-tan-700/30 bg-page text-ink/60'
            )}
            aria-pressed={isActive}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: meta.color, opacity: isActive ? 1 : 0.4 }}
            />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/MapFilterChips.tsx
git commit -m "feat(components): add MapFilterChips for peta layer toggles"
```

## Task 6: Create KilasSambelia (masonry gallery)

**Files:**
- Create: `components/KilasSambelia.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Image from 'next/image'
import { getCollection } from '@/lib/content'

export function KilasSambelia() {
  const pariwisata = getCollection('pariwisata')
  const umkm = getCollection('umkm')

  const items = [
    ...pariwisata.flatMap((p) => p.gallery.map((src) => ({ src, alt: p.title, href: `/pariwisata/${p.slug}` }))),
    ...umkm.flatMap((u) => u.gallery.map((src) => ({ src, alt: u.name, href: `/umkm` }))),
  ].filter((i) => !i.src.includes('gallery-') && !i.src.includes('imlek') && !i.src.includes('ramadhan') && !i.src.includes('nelayan'))

  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <h2 className="mb-8 text-center font-beautique text-display-lg text-brown-900">Kilas Sambelia</h2>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.slice(0, 9).map((item, idx) => (
          <a
            key={`${item.src}-${idx}`}
            href={item.href}
            className="group mb-4 block break-inside-avoid rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-1 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src={item.src} alt={item.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/KilasSambelia.tsx
git commit -m "feat(components): add KilasSambelia masonry gallery"
```

## Task 7: Create SponsorCta

**Files:**
- Create: `components/SponsorCta.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Link from 'next/link'
import { Mail, Instagram } from 'lucide-react'
import { getSettings } from '@/lib/settings'

export function SponsorCta() {
  const s = getSettings()
  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-wine via-terracotta-500 to-gold-500 p-1 shadow-terracotta">
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative rounded-[1.75rem] bg-page/95 px-6 py-10 text-center sm:px-12 sm:py-14">
          <h2 className="font-beautique text-display-lg text-brown-900">Dukung Kami</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Jadilah bagian dari perjalanan Melukis Sambelia. Bersama mitra, kami mewujudkan dampak nyata di Kecamatan Sambelia.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/mitra"
              className="rounded-full bg-water-900 px-6 py-3 font-medium text-page shadow-sm transition-colors hover:bg-water-500"
            >
              Lihat Mitra Kami
            </Link>
            <a
              href={`mailto:${s.contact.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-tan-700/40 bg-cream-beige px-6 py-3 font-medium text-brown-900 transition-colors hover:bg-gold-100"
            >
              <Mail className="h-4 w-4" />
              {s.contact.email}
            </a>
          </div>
          {s.socials.instagram && (
            <a
              href={`https://instagram.com/${s.socials.instagram}`}
              className="mx-auto mt-4 inline-flex items-center gap-2 text-sm text-ink/70 hover:text-terracotta-500"
            >
              <Instagram className="h-4 w-4" />
              @{s.socials.instagram}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/SponsorCta.tsx
git commit -m "feat(components): add SponsorCta section"
```

---

# Phase 3: Illustrations and Content Image Cleanup

## Task 8: Create on-brand illustrated placeholders

**Files:**
- Create: `public/images/content/hero-sambelia.svg`
- Create: `public/images/content/pariwisata-beach.svg`
- Create: `public/images/content/pariwisata-desa.svg`
- Create: `public/images/content/pariwisata-budaya.svg`
- Create: `public/images/content/pariwisata-air.svg`
- Create: `public/images/content/irigasi-saluran.svg`
- Create: `public/images/content/kesehatan-fasilitas.svg`
- Create: `public/images/content/festival-peresean.svg`
- Create: `public/images/content/festival-gendang.svg`
- Create: `public/images/content/festival-pawai.svg`
- Create: `public/images/content/kegiatan-ekowisata.svg`
- Create: `public/images/content/kegiatan-program.svg`
- Create: `public/images/content/umkm-kerajinan.svg`
- Create: `public/images/content/umkm-kuliner.svg`
- Create: `public/images/content/umkm-pertanian.svg`
- Create: `public/images/content/cerita-placeholder.svg`
- Create: `public/images/placeholders/tim.svg`

- [ ] **Step 1: Create a reusable SVG generator script**

Create `scripts/make-placeholder.mjs`:
```js
import fs from 'fs'
import path from 'path'

function svg({ width = 1200, height = 675, palette = ['#FFFCF7', '#FFDFC0', '#F0AC6D'], motif = 'batik_sambel', label = '' }) {
  const [bg, mid, accent] = palette
  const gradientId = `g-${Math.random().toString(36).slice(2, 8)}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="55%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})"/>
  <rect width="100%" height="100%" fill="url(#motif)" opacity="0.08"/>
  <pattern id="motif" width="200" height="200" patternUnits="userSpaceOnUse">
    <image href="/images/design-system/${motif}.svg" width="200" height="200" opacity="0.5"/>
  </pattern>
  <circle cx="85%" cy="15%" r="120" fill="${accent}" opacity="0.25"/>
  <circle cx="15%" cy="85%" r="90" fill="${mid}" opacity="0.35"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Gontserrat, sans-serif" font-weight="700" font-size="72" fill="#742D1B" opacity="0.85">${label}</text>
</svg>`
}

const out = 'public/images/content'
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync('public/images/placeholders', { recursive: true })

const images = [
  { file: 'hero-sambelia.svg', palette: ['#FFFCF7', '#F2EBD8', '#E3795C'], label: 'Sambelia', motif: 'batik_sambel', width: 1920, height: 1080 },
  { file: 'pariwisata-beach.svg', palette: ['#FEFDD7', '#B3E7FB', '#14A8E1'], label: 'Pantai', motif: 'bunga_sambel' },
  { file: 'pariwisata-desa.svg', palette: ['#FEFDD7', '#DEF6AE', '#99BA57'], label: 'Desa Wisata', motif: 'cincin_sambel' },
  { file: 'pariwisata-budaya.svg', palette: ['#FEFDD7', '#FFE09A', '#E3795C'], label: 'Budaya', motif: 'batik_sambel' },
  { file: 'pariwisata-air.svg', palette: ['#FEFDD7', '#B3E7FB', '#0873B9'], label: 'Taman Air', motif: 'bunga_sambel' },
  { file: 'irigasi-saluran.svg', palette: ['#FFFCF7', '#DEF6AE', '#667F37'], label: 'Irigasi', motif: 'cincin_sambel' },
  { file: 'kesehatan-fasilitas.svg', palette: ['#FFFCF7', '#DEF6AE', '#68794A'], label: 'Kesehatan', motif: 'bunga_sambel' },
  { file: 'festival-peresean.svg', palette: ['#FEFDD7', '#FEDF9F', '#E3795C'], label: 'Peresean', motif: 'batik_sambel' },
  { file: 'festival-gendang.svg', palette: ['#FEFDD7', '#FCBB84', '#742D1B'], label: 'Gendang Beleq', motif: 'batik_sambel' },
  { file: 'festival-pawai.svg', palette: ['#FEFDD7', '#FFE09A', '#F0AC6D'], label: 'Pawai Dulangan', motif: 'batik_sambel' },
  { file: 'kegiatan-ekowisata.svg', palette: ['#FFFCF7', '#DEF6AE', '#99BA57'], label: 'Ekowisata', motif: 'cincin_sambel' },
  { file: 'kegiatan-program.svg', palette: ['#FFFCF7', '#FFE09A', '#F0AC6D'], label: 'Program', motif: 'bunga_sambel' },
  { file: 'umkm-kerajinan.svg', palette: ['#FEFDD7', '#FFE09A', '#AF7E4F'], label: 'Kerajinan', motif: 'cincin_sambel' },
  { file: 'umkm-kuliner.svg', palette: ['#FEFDD7', '#FCBB84', '#E3795C'], label: 'Kuliner', motif: 'bunga_sambel' },
  { file: 'umkm-pertanian.svg', palette: ['#FFFCF7', '#DEF6AE', '#667F37'], label: 'Pertanian', motif: 'cincin_sambel' },
  { file: 'cerita-placeholder.svg', palette: ['#FFFCF7', '#EFE3AB', '#AF7E4F'], label: 'Cerita', motif: 'batik_sambel' },
]

for (const img of images) {
  fs.writeFileSync(path.join(out, img.file), svg(img))
}

fs.writeFileSync('public/images/placeholders/tim.svg', svg({ palette: ['#FFFCF7', '#F2EBD8', '#742D1B'], label: 'Tim', motif: 'bunga_sambel' }))

console.log('placeholders created')
```

- [ ] **Step 2: Run the script**

Run:
```bash
node scripts/make-placeholder.mjs
```
Expected: console logs "placeholders created" and SVG files appear in `public/images/content/` and `public/images/placeholders/tim.svg`.

- [ ] **Step 3: Commit**

```bash
git add scripts/make-placeholder.mjs public/images/content/*.svg public/images/placeholders/tim.svg
git commit -m "feat(assets): generate on-brand illustrated placeholders"
```

## Task 9: Delete off-theme JPGs and update content references

**Files:**
- Delete: `public/images/content/imlek-1.jpg`, `ramadhan.jpg`, `nelayan.jpg`, `nelayan-landscape.jpg`, `gallery-1.jpg`…`gallery-4.jpg`, `hero-sambelia.jpg`
- Modify: all content `.md/.mdx` files referencing deleted images

- [ ] **Step 1: Delete off-theme images**

Run:
```bash
rm public/images/content/imlek-1.jpg public/images/content/ramadhan.jpg public/images/content/nelayan.jpg public/images/content/nelayan-landscape.jpg public/images/content/gallery-1.jpg public/images/content/gallery-2.jpg public/images/content/gallery-3.jpg public/images/content/gallery-4.jpg public/images/content/hero-sambelia.jpg
```

- [ ] **Step 2: Update `_settings.md`**

Edit `content/_settings.md`:
```yaml
heroImage: /images/content/hero-sambelia.svg
```

- [ ] **Step 3: Batch update content cover references**

Use the mapping below. For each file, replace the `cover:` line.

Mapping:
- `content/pariwisata/*.mdx` with `nelayan-landscape.jpg` or `ramadhan.jpg` → `/images/content/pariwisata-*.svg` based on category:
  - category `Pantai` → `pariwisata-beach.svg`
  - category `Desa Wisata` → `pariwisata-desa.svg`
  - category `Budaya` → `pariwisata-budaya.svg`
  - category `Air` → `pariwisata-air.svg`
  - default → `pariwisata-beach.svg`
- `content/irigasi/*.md` with `nelayan.jpg` → `/images/content/irigasi-saluran.svg`
- `content/kesehatan/*.md` with `imlek-1.jpg` → `/images/content/kesehatan-fasilitas.svg`
- `content/festival/*.md` with `ramadhan.jpg`:
  - `peresean.md` → `/images/content/festival-peresean.svg`
  - `gendang-beleq.md` → `/images/content/festival-gendang.svg`
  - `pawai-dulangan.md` → `/images/content/festival-pawai.svg`
- `content/kegiatan/*.md` with `gallery-3.jpg`:
  - `ekowisata-mangrove.md` → `/images/content/kegiatan-ekowisata.svg`
  - others → `/images/content/kegiatan-program.svg`
- `content/umkm/*.md` with `gallery-2.jpg`:
  - `kerajinan-anyaman.md` → `/images/content/umkm-kerajinan.svg`
  - `kuliner-tradisional.md` → `/images/content/umkm-kuliner.svg`
  - `pertanian-organik.md` → `/images/content/umkm-pertanian.svg`
  - default → `/images/content/umkm-kerajinan.svg`
- `content/cerita/*.mdx` with `gallery-1.jpg` → `/images/content/cerita-placeholder.svg`
- `content/tim/*.md` with `/images/placeholders/person.svg` → `/images/placeholders/tim.svg`

A shell loop is acceptable; after edits verify no remaining references:

Run:
```bash
rg 'imlek|ramadhan|nelayan|gallery-[1-4]|hero-sambelia\.jpg' content/
```
Expected: no matches (use `rg` if available; otherwise `grep -R`).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(content): remove off-theme JPGs, point covers at on-brand SVGs"
```

---

# Phase 4: Global Shell (Nav, Footer, Layout, 404)

## Task 10: Restyle Nav with pill active state

**Files:**
- Modify: `components/Nav.tsx`

- [ ] **Step 1: Read current Nav.tsx**

Read `components/Nav.tsx` to confirm current structure.

- [ ] **Step 2: Update Nav.tsx**

Use Next.js `usePathname` for active state. Keep the existing NAV_LINKS. Replace the link row with pill-style active links:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/profil-tim', label: 'Profil Tim' },
  { href: '/peta', label: 'Peta' },
  { href: '/pariwisata', label: 'Pariwisata' },
  { href: '/irigasi', label: 'Irigasi' },
  { href: '/kesehatan', label: 'Kesehatan' },
  { href: '/festival', label: 'Festival' },
  { href: '/cerita', label: 'Cerita' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur border-b border-tan-700/10">
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/"><Logo className="h-10 w-auto" /></Link>
        <ul className="hidden gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-gold-100 text-brown-900'
                      : 'text-ink hover:bg-cream-beige hover:text-water-900'
                  )}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat(nav): pill-style active states and hover"
```

## Task 11: Restyle Footer

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Update Footer.tsx**

Replace the existing brown-900 footer with a warm wine/deep-maroon footer using the Figma maroon palette, while keeping the same links and socials logic.

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'

export function Footer() {
  const s = getSettings()
  return (
    <footer className="relative overflow-hidden bg-wine text-cream-light">
      <div className="absolute inset-0 section-watermark" aria-hidden />
      <div className="relative mx-auto max-w-content px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image src="/images/design-system/bw_logo_sambel.svg" alt="Melukis Sambelia" width={180} height={54} className="brightness-110" />
            <p className="mt-4 text-sm text-cream-light/80">KKN-PPM UGM Melukis Sambelia 2026</p>
            <p className="text-sm text-cream-light/60">{s.contact.address}</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-goldSoft">Navigasi</h3>
            <ul className="space-y-2 text-sm text-cream-light/80">
              <li><Link href="/" className="hover:text-goldSoft transition-colors">Beranda</Link></li>
              <li><Link href="/profil-tim" className="hover:text-goldSoft transition-colors">Profil Tim</Link></li>
              <li><Link href="/peta" className="hover:text-goldSoft transition-colors">Peta</Link></li>
              <li><Link href="/pariwisata" className="hover:text-goldSoft transition-colors">Pariwisata</Link></li>
              <li><Link href="/cerita" className="hover:text-goldSoft transition-colors">Cerita</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-goldSoft">Sosial</h3>
            {s.socials.instagram && (
              <p>
                <a href={`https://instagram.com/${s.socials.instagram}`} className="text-sm text-cream-light/80 hover:text-goldSoft transition-colors">
                  @{s.socials.instagram}
                </a>
              </p>
            )}
            {s.socials.tiktok && (
              <p>
                <a href={`https://tiktok.com/@${s.socials.tiktok}`} className="text-sm text-cream-light/80 hover:text-goldSoft transition-colors">
                  @{s.socials.tiktok}
                </a>
              </p>
            )}
            <p className="mt-2 text-sm text-cream-light/60">{s.contact.email}</p>
            <div className="mt-5 flex gap-3">
              <Image src="/images/design-system/logo_kkn_ugm.svg" alt="KKN-PPM UGM" width={48} height={48} className="brightness-110" />
              <Image src="/images/design-system/logo_ugm_text.svg" alt="UGM" width={120} height={48} className="brightness-110" />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-cream-light/20 pt-6 text-center text-xs text-cream-light/50">
          © 2026 KKN-PPM UGM Melukis Sambelia
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npm run typecheck`
Run: `npm run build`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): warm wine footer with motif watermark"
```

## Task 12: Update 404

**Files:**
- Modify: `app/not-found.tsx`

- [ ] **Step 1: Update 404.tsx**

Style the existing 404 with a warm gradient card, bw logo, and motif.

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { MotifDivider } from '@/components/MotifDivider'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative w-full max-w-lg rounded-[2rem] border border-tan-700/20 bg-cream-beige/60 p-10 shadow-terracotta">
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
        <Image src="/images/design-system/bw_logo_sambel.svg" alt="Melukis Sambelia" width={160} height={48} className="mx-auto" />
        <MotifDivider className="my-6" animate={false} />
        <h1 className="font-beautique text-5xl text-brown-900">404</h1>
        <p className="mt-2 text-ink/70">Halaman tidak ditemukan.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-water-900 px-6 py-3 font-medium text-page transition-colors hover:bg-water-500"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat(404): warm card layout with motif"
```

---

# Phase 5: Page Restyles

## Task 13: Restyle Beranda

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page.tsx**

Compose the new Beranda:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'
import { GradientText } from '@/components/GradientText'
import { KilasSambelia } from '@/components/KilasSambelia'
import { SponsorCta } from '@/components/SponsorCta'

export default function Beranda() {
  const s = getSettings()
  const pariwisata = getCollection('pariwisata').slice(0, 1)
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival').slice(0, 1)
  const kegiatan = getCollection('kegiatan').slice(0, 1)
  const umkm = getCollection('umkm').slice(0, 1)
  const mitra = getCollection('mitra').filter((m) => m.tier === 'Utama')

  const previews = [
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/content/pariwisata-beach.svg', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/content/irigasi-saluran.svg', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/content/kesehatan-fasilitas.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/content/festival-peresean.svg', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/kegiatan', image: kegiatan[0]?.cover ?? '/images/content/kegiatan-program.svg', title: 'Kegiatan', desc: 'Program unggulan tim.', accent: '#742D1B' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/content/umkm-kerajinan.svg', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]

  return (
    <>
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden text-center sm:min-h-[75vh]">
        <Image src={s.heroImage} alt="Sambelia" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative z-10 max-w-3xl px-6 py-20">
          <h1 className="font-beautique text-display-xl text-cream-light text-balance" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
            <GradientText className="text-cream-light">Melukis</GradientText>{' '}
            <span className="text-cream-light">Sambelia</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream-light/90 sm:text-lg">
            {s.heroTagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/peta" className="rounded-full bg-water-900 px-6 py-3 font-medium text-page shadow-sm transition-colors hover:bg-water-500">
              Jelajahi Peta
            </Link>
            <Link href="/festival" className="rounded-full border border-cream-light/60 px-6 py-3 font-medium text-cream-light backdrop-blur-sm transition-colors hover:bg-cream-light/10">
              Festival Pesona
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-content px-4 py-16">
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
        <SectionHeader kicker="01 — TENTANG" title="Tentang Sambelia" intro="Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan." tone="terracotta" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Luas" value={s.stats.luas} />
          <StatCard label="Penduduk" value={s.stats.penduduk} />
          <StatCard label="Desa Binaan" value={s.stats.desaBinaan} />
          <StatCard label="Tahun Program" value={s.stats.tahunProgram} />
        </div>
      </section>

      <MotifDivider motif="cincin_sambel" />

      <section className="mx-auto max-w-content px-4 py-8">
        <SectionHeader kicker="02 — JEJAKI" title="Jejaki Sambelia" tone="gold" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => <DataCard key={p.href} {...p} />)}
        </div>
      </section>

      <KilasSambelia />

      <SponsorCta />

      <section className="mx-auto max-w-content px-4 py-12">
        <SectionHeader kicker="04 — MITRA" title="Bersama Mitra Kami" tone="olive" centered />
        <div className="flex flex-wrap items-center justify-center gap-8">
          {mitra.map((m) => (
            <Image key={m.slug} src={m.logo} alt={m.name} width={140} height={60} className="opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Build and test**

Run: `npm run typecheck`
Run: `npm run build`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(beranda): new hero, Kilas Sambelia, SponsorCta, themed cards"
```

## Task 14: Restyle Festival + integrate CountdownStrip

**Files:**
- Modify: `app/festival/page.tsx`

- [ ] **Step 1: Read current festival/page.tsx**

Read to understand structure.

- [ ] **Step 2: Update festival page**

Add terracotta/gold hero, `CountdownStrip`, and themed festival cards. Keep data loading from `getCollection('festival')`.

```tsx
import Image from 'next/image'
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { CountdownStrip } from '@/components/CountdownStrip'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'

export default function FestivalPage() {
  const festivals = getCollection('festival')
  const festivalData = festivals.map((f) => ({ eventName: f.eventName, schedule: f.schedule, venue: f.venue, description: f.description, cover: f.cover, registrationUrl: f.registrationUrl, body: f.body }))

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-wine via-terracotta-500 to-gold-500 py-20 text-center text-cream-light">
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-4">
          <SectionHeader kicker="FESTIVAL" title="Festival Pesona Sambelia" intro="Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia." tone="gold" centered />
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-10">
        {festivalData.length > 0 ? <CountdownStrip festivals={festivalData} /> : <EmptyState message="Jadwal festival akan segera diumumkan." />}
      </section>

      <section className="mx-auto max-w-content px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {festivals.map((f) => (
            <article key={f.slug} className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 p-5 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={f.cover} alt={f.eventName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="mt-4 font-beautique text-2xl text-brown-900">{f.eventName}</h3>
              <p className="mt-1 text-sm text-terracotta-500 font-medium">{f.venue} · {f.schedule}</p>
              <p className="mt-2 text-sm text-ink/70">{f.description}</p>
              {f.registrationUrl && (
                <a href={f.registrationUrl} className="mt-4 inline-block rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-page transition-colors hover:bg-wine">
                  Daftar / Info
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <MotifDivider />
    </>
  )
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck`
Run: `npm run build`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add app/festival/page.tsx
ngit commit -m "feat(festival): terracotta hero, CountdownStrip, themed cards"
```

> Note: correct `ngit` to `git` before running.

## Task 15: Restyle Peta + integrate MapFilterChips

**Files:**
- Modify: `app/peta/page.tsx`
- Modify: `components/MapPanel.tsx` (or `components/InteractiveMap.tsx`) depending on where layer toggles live.

- [ ] **Step 1: Read current peta and map components**

Read `app/peta/page.tsx`, `components/MapPanel.tsx`, and `components/InteractiveMap.tsx` to locate layer toggle UI.

- [ ] **Step 2: Update layer toggles to MapFilterChips**

If toggles are in `InteractiveMap.tsx`, replace the checkbox group with `MapFilterChips`. Keep state shape `Record<MapLayer, boolean>`. Example snippet:

```tsx
import { MapFilterChips } from './MapFilterChips'

// inside render:
<MapFilterChips active={activeLayers} onToggle={(layer) => setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))} />
```

Style the map panel wrapper with cream bg, rounded-2xl, terracotta shadow, and a section watermark.

- [ ] **Step 3: Update peta/page.tsx**

Add `SectionHeader` and warm wrapper.

```tsx
<section className="mx-auto max-w-content px-4 py-12">
  <SectionHeader kicker="PETA" title="Peta Sambelia" intro="Jelajahi titik pariwisata, irigasi, kesehatan, dan UMKM di Kecamatan Sambelia." tone="water" />
  <MapPanelClient />
</section>
```

- [ ] **Step 4: Typecheck + build**

Run: `npm run typecheck`
Run: `npm run build`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add app/peta/page.tsx components/MapPanel.tsx components/InteractiveMap.tsx
git commit -m "feat(peta): MapFilterChips and warm map panel styling"
```

## Task 16: Restyle content index/detail pages (Pariwisata, Irigasi, Kesehatan, Kegiatan, UMKM)

**Files:**
- Modify: `app/pariwisata/page.tsx`, `app/pariwisata/[slug]/page.tsx`
- Modify: `app/irigasi/page.tsx`
- Modify: `app/kesehatan/page.tsx`
- Modify: `app/kegiatan/page.tsx`
- Modify: `app/umkm/page.tsx`

- [ ] **Step 1: Apply consistent patterns to each page**

For each index page:
- Wrap with `mx-auto max-w-content px-4 py-12`.
- Use `SectionHeader` with appropriate `tone`.
- Use `DataCard` or a themed card component with cream bg, hover lift, terracotta shadow.
- Use the new themed `cover` values.

For each detail page:
- Use warm hero/cover section.
- Use `MotifDivider` between sections.
- Keep existing MDX body and mini-map.
- Add `rounded-2xl` and `shadow-terracotta` to cover image.

- [ ] **Step 2: Build and test after each page group**

After each file edit, run `npm run typecheck` and fix errors.

- [ ] **Step 3: Commit**

```bash
git add app/pariwisata/page.tsx app/pariwisata/[slug]/page.tsx app/irigasi/page.tsx app/kesehatan/page.tsx app/kegiatan/page.tsx app/umkm/page.tsx
git commit -m "feat(content-pages): restyle pariwisata, irigasi, kesehatan, kegiatan, umkm"
```

## Task 17: Restyle Cerita, Profil Tim, Tentang Sambelia, Mitra

**Files:**
- Modify: `app/cerita/page.tsx`, `app/cerita/[slug]/page.tsx`
- Modify: `app/profil-tim/page.tsx`
- Modify: `app/tentang-sambelia/page.tsx`
- Modify: `app/mitra/page.tsx`

- [ ] **Step 1: Apply consistent patterns**

- `SectionHeader` on each.
- Cards in cream/beige with hover lift.
- Themed covers/placeholders.
- `MotifDivider` transitions.

- [ ] **Step 2: Build and test**

Run: `npm run typecheck`
Run: `npm run build`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add app/cerita/page.tsx app/cerita/[slug]/page.tsx app/profil-tim/page.tsx app/tentang-sambelia/page.tsx app/mitra/page.tsx
git commit -m "feat(pages): restyle cerita, profil-tim, tentang-sambelia, mitra"
```

---

# Phase 6: Quality Gates

## Task 18: Run full verification

**Files:**
- All modified files

- [ ] **Step 1: Lint + typecheck + unit tests**

Run:
```bash
npm run lint && npm run typecheck && npm test
```
Expected: all pass.

- [ ] **Step 2: Static build**

Run:
```bash
npm run build
```
Expected: `out/` generated, no errors.

- [ ] **Step 3: E2E smoke test**

Run:
```bash
npm run test:e2e
```
Expected: pass. If selectors changed (e.g. nav active link), update `tests/e2e/smoke.spec.ts` minimally.

- [ ] **Step 4: Visual sanity check**

Serve `out/` locally:
```bash
npx serve out -p 3000
```
Open `http://localhost:3000` and click through Beranda, Festival, Peta, Pariwisata, and one detail page. Confirm:
- Hero renders.
- No broken images (404 in network tab).
- Cards lift on hover.
- Festival countdown counts.
- Map filter chips toggle layers.
- Mobile layout looks reasonable.

- [ ] **Step 5: Commit final fixes**

```bash
git add -A
git commit -m "fix(visual-refresh): lint, typecheck, tests, E2E, placeholder references"
```

---

# Self-Review Checklist

- [x] Spec coverage: each spec section maps to one or more tasks above.
- [x] Placeholder scan: no TBD/TODO/fill-in-later steps; all code snippets are concrete.
- [x] Type consistency: `MapLayer`, `Festival`, `activeLayers` shapes match between `MapFilterChips`, `CountdownStrip`, and existing types.
