'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { DataCard } from '@/components/DataCard'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'
import type { Kesehatan } from '@/lib/schemas'

export function KesehatanListClient({ items, stats }: { items: (Kesehatan & { slug: string })[]; stats: { posyandu: number; puskesmas: number; cadres: number; stunting: number } }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    const chips: DetailModalData['chips'] = [
      { label: item.type, color: '#667F37' },
      { label: item.village, color: '#99BA57' },
    ]
    if (item.stuntingProgram) chips.push({ label: 'Stunting', color: '#E3795C' })

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
        kicker="KESEHATAN"
        title="Fasilitas & Program Kesehatan"
        intro="Posyandu, puskesmas, dan program stunting di Sambelia."
        tone="olive"
      />
      <div className="mx-auto max-w-content px-4 py-16">
        <FadeIn>
          <SectionHeader
            kicker="KESEHATAN"
            title="Fasilitas & Program Kesehatan"
            intro="Posyandu, puskesmas, dan program stunting di Sambelia."
            tone="olive"
          />
        </FadeIn>
        <StaggerContainer stagger={0.06} className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StaggerItem><StatCard label="Posyandu" value={String(stats.posyandu)} /></StaggerItem>
          <StaggerItem><StatCard label="Puskesmas" value={String(stats.puskesmas)} /></StaggerItem>
          <StaggerItem><StatCard label="Kader" value={String(stats.cadres)} /></StaggerItem>
          <StaggerItem><StatCard label="Program Stunting" value={String(stats.stunting)} /></StaggerItem>
        </StaggerContainer>
        {items.length === 0 ? (
          <EmptyState message="Belum ada data kesehatan. Tim akan menambahkan segera." />
        ) : (
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((k) => (
              <StaggerItem key={k.slug}>
                <DataCard
                  image={k.cover}
                  title={k.facilityName}
                  chips={[
                    { label: k.type, color: '#667F37' },
                    { label: k.village, color: '#99BA57' },
                    ...(k.stuntingProgram ? [{ label: 'Stunting', color: '#E3795C' }] : []),
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
    </>
  )
}
