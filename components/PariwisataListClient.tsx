'use client'

import { useState } from 'react'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { MotifFloater } from '@/components/MotifFloater'

import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'
import { getAlternatingSpan, isAlternatingFeatured } from '@/lib/utils'
import type { Pariwisata } from '@/lib/schemas'

export function PariwisataListClient({ items, pageSettings, emptyMessage }: { items: (Pariwisata & { slug: string })[]; pageSettings: Record<string, string>; emptyMessage: string }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    setModalData({
      title: item.title,
      image: item.cover,
      gallery: item.gallery.length > 0 ? item.gallery.map((src) => ({ src, alt: item.title })) : undefined,
      description: item.shortDesc,
      body: item.body,
      href: petaLink({ layer: 'pariwisata', lat: item.lat, lng: item.lng }),
      linkLabel: 'Lihat di peta →',
      lat: item.lat,
      lng: item.lng,
      googleMapsUrl: item.googleMapsUrl,
      mapTitle: item.title,
      chips: [
        { label: item.category, tone: 'water' },
        { label: item.village, tone: 'green' },
        ...item.facilities.map((f) => ({ label: f, tone: 'gold' as const })),
      ],
    })
    setOpen(true)
  }

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'PARIWISATA'}
        title={pageSettings.heroTitle ?? 'Potensi Wisata Sambelia'}
        intro={pageSettings.heroIntro ?? 'Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan.'}
        tone="water"
      />
      <section className="relative bg-cream-warm/30">
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="top-right" color="terracotta" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" color="gold" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-left" color="terracotta" size="sm" opacity={0.8} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="gold" size="md" opacity={0.7} />
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="terracotta" size="md" opacity={0.7} />

          <SectionHeader
            kicker={pageSettings.sectionKicker ?? 'PARIWISATA'}
            title={pageSettings.sectionTitle ?? 'Destinasi Wisata'}
            intro={pageSettings.sectionIntro ?? 'Jelajahi destinasi wisata unggulan di Kecamatan Sambelia.'}
            tone="water"
          />

          {items.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {items.map((p, i) => (
                <StaggerItem key={p.slug} className={getAlternatingSpan(i, items.length)}>
                  <DataCard
                    image={p.cover}
                    title={p.title}
                    chips={[
                      { label: p.category, tone: 'water' },
                      { label: p.village, tone: 'green' },
                    ]}
                    desc={p.shortDesc}
                    onDetailClick={() => openModal(p)}
                    featured={isAlternatingFeatured(i, items.length)}
                    accent="#14A8E1"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
          <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
        </div>
      </section>
    </>
  )
}