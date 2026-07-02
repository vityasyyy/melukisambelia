'use client'

import { useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { DataCard } from '@/components/DataCard'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { MotifFloater } from '@/components/MotifFloater'

import { petaLink } from '@/lib/links'
import type { Kesehatan } from '@/lib/schemas'

export function KesehatanListClient({ items, stats, pageSettings, emptyMessage }: { items: (Kesehatan & { slug: string })[]; stats: { posyandu: number; puskesmas: number; cadres: number; stunting: number }; pageSettings: Record<string, string>; emptyMessage: string }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    const chips: DetailModalData['chips'] = [
      { label: item.type, tone: 'olive' },
      { label: item.village, tone: 'green' },
    ]
    if (item.stuntingProgram) chips.push({ label: 'Stunting', tone: 'terracotta' })

    setModalData({
      title: item.facilityName,
      image: item.cover,
      description: `Kader: ${item.cadresCount}`,
      body: item.body,
      href: petaLink({ layer: 'kesehatan', lat: item.lat, lng: item.lng }),
      linkLabel: 'Lihat di peta →',
      lat: item.lat,
      lng: item.lng,
      mapTitle: item.facilityName,
      chips,
    })
    setOpen(true)
  }

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'KESEHATAN'}
        title={pageSettings.heroTitle ?? 'Fasilitas & Program Kesehatan'}
        intro={pageSettings.heroIntro ?? 'Posyandu, puskesmas, dan program stunting di Sambelia.'}
        tone="olive"
      />
      <section className="relative bg-olive/5">
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="top-right" color="olive" size="md" opacity={0.25} />

          <StaggerContainer stagger={0.06} className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StaggerItem><StatCard label="Posyandu" value={String(stats.posyandu)} /></StaggerItem>
            <StaggerItem><StatCard label="Puskesmas" value={String(stats.puskesmas)} /></StaggerItem>
            <StaggerItem><StatCard label="Kader" value={String(stats.cadres)} /></StaggerItem>
            <StaggerItem><StatCard label="Program Stunting" value={String(stats.stunting)} /></StaggerItem>
          </StaggerContainer>
          {items.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((k) => (
                <StaggerItem key={k.slug}>
                  <DataCard
                    image={k.cover}
                    title={k.facilityName}
                    chips={[
                      { label: k.type, tone: 'olive' },
                      { label: k.village, tone: 'green' },
                      ...(k.stuntingProgram ? [{ label: 'Stunting', tone: 'terracotta' as const }] : []),
                    ]}
                    desc={`Kader: ${k.cadresCount}`}
                    onDetailClick={() => openModal(k)}
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