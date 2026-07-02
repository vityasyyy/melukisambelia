# Bold & Vivid — Melukis Sambelia Frontend Revamp

**Date**: 2025-07-01
**Direction**: Bold & Vivid — festival-at-dusk energy, multi-color sweeps, strong contrasts, structural color accents

## Overview

A visual revamp of the Melukis Sambelia portal that intensifies the existing warm Lombok palette with bolder contrasts, multi-color gradient animations, structural accent borders, enhanced batik motifs, and gradient-framed modals. The goal: make every component feel more crafted, more alive, and more celebratory of Sambelia's festival culture.

## Design Decisions

- **Hero text animation**: Multi-color sweep (gold → cream → terracotta → gold cycling)
- **Navbar**: Strong gold border (2px), terracotta-tinted shadow
- **Cards**: Left accent border (3px, tone-colored) replacing top accent bars
- **Modals**: Gradient border frame (terracotta → gold → water)
- **Batik motifs**: Double opacity + sepia/gold tint, slow 60s rotation, opacity pulse, warm glow
- **Section headers**: Gradient-filled kicker pills, thicker gradient accent bars

## Files Modified

| File | Change Summary |
|------|---------------|
| `app/globals.css` | New utilities: `.text-gradient-festival`, enhanced batik classes, motif glow keyframes |
| `tailwind.config.ts` | New animation keyframes: `color-sweep`, `motif-pulse`, `motif-spin` |
| `components/Nav.tsx` | Gold border, stronger shadow, brighter active states |
| `components/HeroAnimation.tsx` | Multi-color sweep on title, enhanced CTA, stronger color band, higher motif opacity |
| `components/PageHero.tsx` | Centering fix, gradient color band, enhanced watermark, stronger gradient overlays |
| `components/DataCard.tsx` | Left accent border, enhanced shadows, inner glow |
| `components/UmkmCard.tsx` | Left accent border (terracotta), enhanced shadows |
| `components/StatCard.tsx` | Left accent border (gold), enhanced shadow |
| `components/FestivalTimeline.tsx` | Card left accent border (gold) |
| `components/DetailModalClient.tsx` | Gradient border frame, enhanced close button |
| `components/SectionHeader.tsx` | Gradient kickers, thicker gradient accent bar |
| `components/MotifFloater.tsx` | Slow rotation (60s), opacity pulse, warm glow shadow, increased base opacity |
| `components/MotifDivider.tsx` | Higher opacity, sepia tint, taller divider, gradient lines above/below |
| `components/Footer.tsx` | Thicker gradient band, higher batik opacity |
| `components/BackToTop.tsx` | Gold accent border, warm shadow |
| `components/CountdownStrip.tsx` | Enhanced gradient border |
| `components/KegiatanStats.tsx` | Cards get left accent borders |
| `app/tentang-sambelia/page.tsx` | Desa cards get left accent borders |