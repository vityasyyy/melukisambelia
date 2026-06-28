# CMS Source of Truth + Visual Audit — Design Spec

**Date:** 2026-06-29
**Status:** Approved
**Project:** Melukis Sambelia

## Overview

Migrate all hardcoded user-facing content into Decap CMS collections so non-technical admins can edit the entire site without a developer. Then audit and fix all accessibility and visual issues across all 11 routes.

## Background

The site already reads most content from `content/*.md(x)` files via `lib/content.ts`, and Decap CMS edits those files. However, several sections remain hardcoded:

- `/tentang-sambelia`: desa descriptions, "Letak Geografis" prose, "Potensi Desa" cards
- `lib/air-tanah-data.ts`: TMA/DHL measurement data in `public/data/air-tanah.json` (developer-only)
- `app/page.tsx`: homepage section intros/kickers and "Jejaki Sambelia" card descriptions

## Work Streams

### 1. CMS Collections Migration

**New collections:**

- **`tentang`** (single-file): Holds "Letak Geografis" prose and "Potensi Desa" cards (as a list of {title, description} objects). File: `content/_tentang.md`.
- **`desa`** (folder-based): Each desa (Sugian, Labuhan Pandan) becomes an editable entry with name, description, image. Folder: `content/desa/`. Replaces the hardcoded `desa` array in `app/tentang-sambelia/page.tsx`.

**Extended collections:**

- **`airtanah`**: Add a `measurements` list field (location, date, tmaMeters, dhlMsiemens) to the existing single-file collection. `getAirTanahData()` reads from markdown frontmatter instead of `public/data/air-tanah.json`.
- **`settings`**: Add a `homepageIntros` object with editable text for "Jejaki Sambelia" section (kicker, title, intro) and the 7 preview card descriptions.

**Files touched:**
- `public/admin/config.yml` — add new collections + extend existing
- `lib/schemas.ts` — add `tentangSchema`, `desaSchema`; extend `airTanahSchema`, `settingsSchema`
- `lib/content.ts` — add `tentang`, `desa` to `SCHEMAS` map
- `lib/settings.ts` — add `getTentang()`, `getDesa()`
- `lib/air-tanah-data.ts` — read from markdown frontmatter instead of JSON
- `app/tentang-sambelia/page.tsx` — read from CMS instead of hardcoded arrays
- `app/page.tsx` — read homepage intros from settings
- `content/_tentang.md` — new file with default content
- `content/desa/sugian.md`, `content/desa/labuhan-pandan.md` — new files with default content
- `content/air-tanah/air-tanah.md` — extend frontmatter with measurements array
- `content/_settings.md` — extend frontmatter with homepageIntros
- `docs/CONTENT_ADMIN_GUIDE.md` — update master table + add field docs for new collections

**Verification:**
- `npm run dev` + `npm run cms` → all collections visible in `/admin`
- Each collection's entries render correctly on its page
- `npm run typecheck` + `npm run lint` + `npm run test` all pass

### 2. A11y + Visual Audit

Audit all 11 routes (`/`, `/tentang-sambelia`, `/peta`, `/pariwisata`, `/irigasi`, `/kesehatan`, `/umkm`, `/festival`, `/cerita`, `/air-tanah`, `/lingkungan`) for:

- **Accessibility:** color contrast (WCAG AA), missing alt text, focus states, semantic HTML, ARIA labels, heading hierarchy (h1→h2→h3, no skips), button/link distinguishability
- **Visual consistency:** spacing, font sizes, color usage across pages, card alignment, image aspect ratios
- **Responsive:** mobile layout at 375px, tablet at 768px

Fix what's found directly. Do not introduce new design patterns — follow the existing visual language (see `docs/superpowers/specs/2026-06-20-melukis-sambelia-design.md` §3 Visual Language).

### 3. Visual Review (Interactive)

After agents complete, use Playwright MCP to navigate each route, take screenshots, and review with the user. Fix any issues the user points out.

### 4. Commit & Push

Stage all changes, commit with a descriptive message, push to `origin/main`.

## Non-goals

- No new pages or features
- No design system overhaul (use existing tokens/palette)
- No i18n (ID-only, per original spec)
- No backend/database changes (content stays in Git via Decap)

## Implementation Strategy

Two parallel agents (independent work streams):

- **Agent A — CMS Migration**: schemas, config.yml, lib functions, page updates, content files, docs
- **Agent B — A11y + Visual Audit**: audit all pages, fix issues, verify with Playwright

After both complete, do the interactive visual review, then commit and push.