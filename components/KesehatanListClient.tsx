'use client'

import { useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { AlternatingCardGrid } from '@/components/AlternatingCardGrid'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { MotifFloater } from '@/components/MotifFloater'

import Link from 'next/link'
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
      <section className="relative overflow-hidden bg-olive/5">
          <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="gold" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="olive" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

          <SectionHeader
            kicker={pageSettings.sectionKicker ?? 'KESEHATAN'}
            title={pageSettings.sectionTitle ?? 'Fasilitas & Program Kesehatan'}
            intro={pageSettings.sectionIntro ?? 'Posyandu, puskesmas, dan program stunting di Sambelia.'}
            tone="olive"
          />

          <StaggerContainer stagger={0.06} className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StaggerItem><StatCard label="Posyandu" value={String(stats.posyandu)} accentColor="#68794A" /></StaggerItem>
            <StaggerItem><StatCard label="Puskesmas" value={String(stats.puskesmas)} accentColor="#68794A" /></StaggerItem>
            <StaggerItem><StatCard label="Kader" value={String(stats.cadres)} accentColor="#68794A" /></StaggerItem>
            <StaggerItem><StatCard label="Program Stunting" value={String(stats.stunting)} accentColor="#68794A" /></StaggerItem>
          </StaggerContainer>
          {items.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <AlternatingCardGrid
              items={items}
              renderItem={(k: unknown, _i: number, featured: boolean) => {
                const item = k as Kesehatan & { slug: string }
                return (
                  <DataCard
                    image={item.cover}
                    title={item.facilityName}
                    chips={[
                      { label: item.type, tone: 'olive' },
                      { label: item.village, tone: 'green' },
                      ...(item.stuntingProgram ? [{ label: 'Stunting', tone: 'terracotta' as const }] : []),
                    ]}
                    desc={`Kader: ${item.cadresCount}`}
                    onDetailClick={() => openModal(item)}
                    featured={featured}
                    accent="#68794A"
                  />
                )
              }}
            />
          )}
          <div className="mt-8 text-center">
            <Link
              href="/peta?layer=kesehatan"
              className="inline-block rounded-full bg-olive px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-olive-dark"
            >
              Lihat semua di Peta Interaktif →
            </Link>
          </div>
          <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
        </div>
      </section>
    </>
  )
}