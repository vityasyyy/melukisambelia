'use client'

import { useState } from 'react'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { MotifFloater } from '@/components/MotifFloater'
import { petaLink } from '@/lib/links'
import type { Pariwisata } from '@/lib/schemas'

export function PariwisataListClient({ items, pageSettings, emptyMessage }: { items: (Pariwisata & { slug: string })[]; pageSettings: Record<string, string>; emptyMessage: string }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    setModalData({
      title: item.title,
      image: item.cover,
      description: item.shortDesc,
      body: item.body,
      href: petaLink({ layer: 'pariwisata', lat: item.lat, lng: item.lng }),
      linkLabel: 'Lihat di Peta →',
      lat: item.lat,
      lng: item.lng,
      chips: [
        { label: item.category, color: '#14A8E1' },
        { label: item.village, color: '#99BA57' },
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
      <div className="relative mx-auto max-w-content overflow-hidden px-4 py-10">
        <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="water" />
        <MotifFloater motif="cincin_sambel" position="bottom-left" size="md" color="terracotta" />
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <StaggerItem key={p.slug}>
                <DataCard
                  image={p.cover}
                  title={p.title}
                  chips={[
                    { label: p.category, color: '#14A8E1' },
                    { label: p.village, color: '#99BA57' },
                  ]}
                  desc={p.shortDesc}
                  onDetailClick={() => openModal(p)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
        <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      </div>
    </>
  )
}