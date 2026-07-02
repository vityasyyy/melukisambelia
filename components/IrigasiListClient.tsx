'use client'

import { useState } from 'react'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { MotifFloater } from '@/components/MotifFloater'

import { petaLink } from '@/lib/links'
import type { Irigasi } from '@/lib/schemas'
import Link from 'next/link'

export function IrigasiListClient({ items, stats, pageSettings, emptyMessage }: { items: (Irigasi & { slug: string })[]; stats: { total: number; totalLength: number; good: number; damaged: number }; pageSettings: Record<string, string>; emptyMessage: string }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    setModalData({
      title: item.name,
      image: item.cover,
      description: `${item.saluranType} · ${item.village} · ${item.condition}`,
      body: `Panjang: ${item.lengthM} m. Status aliran: ${item.flowStatus}.\n\n${item.body}`,
      href: petaLink({ tab: 'irigasi' }),
      linkLabel: 'Buka peta irigasi →',
      lat: item.lat,
      lng: item.lng,
      mapTitle: item.name,
      chips: [
        { label: item.saluranType, tone: 'green' },
        { label: item.village, tone: 'water' },
        { label: item.condition, tone: item.condition === 'Baik' ? 'olive' : 'terracotta' },
      ],
    })
    setOpen(true)
  }

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'IRIGASI'}
        title={pageSettings.heroTitle ?? 'Data Saluran Irigasi'}
        intro={pageSettings.heroIntro ?? 'Saluran irigasi di Kecamatan Sambelia dan kondisinya.'}
        tone="green"
      />
      <section className="relative overflow-hidden bg-cream-beige/50">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="olive" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

          <SectionHeader
            kicker={pageSettings.sectionKicker ?? 'IRIGASI'}
            title={pageSettings.sectionTitle ?? 'Data Saluran Irigasi'}
            intro={pageSettings.sectionIntro ?? 'Saluran irigasi di Kecamatan Sambelia dan kondisinya.'}
            tone="green"
          />

          <StaggerContainer stagger={0.06} className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StaggerItem><StatCard label="Total Saluran" value={String(stats.total)} accentColor="#99BA57" /></StaggerItem>
            <StaggerItem><StatCard label="Total Panjang" value={String(stats.totalLength)} unit="m" accentColor="#99BA57" /></StaggerItem>
            <StaggerItem><StatCard label="Kondisi Baik" value={String(stats.good)} accentColor="#99BA57" /></StaggerItem>
            <StaggerItem><StatCard label="Rusak" value={String(stats.damaged)} accentColor="#99BA57" /></StaggerItem>
          </StaggerContainer>
          {items.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <div className="glass-card glass-accent-top overflow-hidden p-3 sm:p-4" style={{ '--accent-color': '#99BA57' } as React.CSSProperties}>
              <Accordion type="single" collapsible>
                {items.map((i) => (
                  <AccordionItem key={i.slug} value={i.slug}>
                    <AccordionTrigger className="min-w-0">
                      <span className="truncate font-semibold text-brown-900">{i.name}</span>
                      <span className="ml-3 shrink-0 text-xs text-ink/60">{i.saluranType} · {i.village} · {i.condition}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-ink/60 break-words">Panjang: {i.lengthM} m · Status aliran: {i.flowStatus}</p>
                      <p className="mt-2 text-sm break-words">{i.body}</p>
                      <button
                        type="button"
                        onClick={() => openModal(i)}
                        className="mt-3 text-sm font-medium text-water-900 hover:text-water-500"
                      >
                        Lihat detail →
                      </button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          <div className="mt-8 text-center">
            <Link
              href="/peta?layer=irigasi"
              className="inline-block rounded-full bg-green-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-900"
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