'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { MotifFloater } from '@/components/MotifFloater'

import { petaLink } from '@/lib/links'
import { cn } from '@/lib/utils'
import { getAlternatingSpan } from '@/lib/utils'
import type { Umkm } from '@/lib/schemas'

const KATEGORI_OPTIONS = ['Semua', 'Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya'] as const

export function UmkmListClient({ items, pageSettings, emptyMessage }: { items: (Umkm & { slug: string })[]; pageSettings: Record<string, string>; emptyMessage: string }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)
  const [activeKategori, setActiveKategori] = useState<string>('Semua')
  const filtered = activeKategori === 'Semua' ? items : items.filter(i => i.kategori === activeKategori)

  const openModal = (item: (typeof items)[number]) => {
    const chips: DetailModalData['chips'] = [
      { label: item.kategori, tone: 'gold' },
      { label: item.village, tone: 'water' },
    ]
    if (item.contact) chips.push({ label: item.contact, tone: 'olive' })

    setModalData({
      title: item.name,
      image: item.cover,
      description: item.owner,
      body: item.body,
      href: petaLink({ layer: 'umkm', lat: item.lat, lng: item.lng }),
      linkLabel: 'Lihat di peta →',
      lat: item.lat,
      lng: item.lng,
      mapTitle: item.name,
      chips,
    })
    setOpen(true)
  }

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'UMKM'}
        title={pageSettings.heroTitle ?? 'UMKM Lokal Sambelia'}
        intro={pageSettings.heroIntro ?? 'Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia.'}
        tone="terracotta"
      />
      <section className="relative bg-cream-warm/30">
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="top-right" color="terracotta" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" color="gold" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-right" color="terracotta" size="sm" opacity={0.8} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="gold" size="md" opacity={0.7} />
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="terracotta" size="md" opacity={0.7} />

          <SectionHeader
            kicker={pageSettings.sectionKicker ?? 'UMKM'}
            title={pageSettings.sectionTitle ?? 'UMKM Lokal Sambelia'}
            intro={pageSettings.sectionIntro ?? 'Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia.'}
            tone="terracotta"
          />

        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {KATEGORI_OPTIONS.map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveKategori(k)}
                  className={cn(
                    'relative inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
                    activeKategori === k
                      ? 'border-transparent text-brown-900'
                      : 'border-tan-700/30 bg-page text-ink/70 hover:text-ink'
                  )}
                  aria-pressed={activeKategori === k}
                >
                  {activeKategori === k && (
                    <motion.span
                      layoutId="umkm-kategori-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-cream-beige shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {k}
                </button>
              ))}
            </div>
            <div role="region" aria-live="polite" aria-label={`Menampilkan ${filtered.length} UMKM`}>
            <StaggerContainer
              key={activeKategori}
              stagger={0.08}
              mode="mount"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((u, i) => (
                <StaggerItem key={u.slug} className={getAlternatingSpan(i, filtered.length)}>
                  <UmkmCard item={u} onDetailClick={() => openModal(u)} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            </div>
          </>
        )}
        <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
        </div>
      </section>
    </>
  )
}