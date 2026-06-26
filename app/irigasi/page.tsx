'use client'

import { useState } from 'react'
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MotifDivider } from '@/components/MotifDivider'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'

export default function IrigasiPage() {
  const items = getCollection('irigasi')
  const totalLength = items.reduce((sum, i) => sum + i.lengthM, 0)
  const conditionCounts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.condition] = (acc[i.condition] ?? 0) + 1
    return acc
  }, {})

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
        { label: item.saluranType, color: '#99BA57' },
        { label: item.village, color: '#14A8E1' },
        { label: item.condition, color: item.condition === 'Baik' ? '#667F37' : '#E3795C' },
      ],
    })
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="IRIGASI"
        title="Data Saluran Irigasi"
        intro="Saluran irigasi di Kecamatan Sambelia."
        tone="green"
      />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Saluran" value={String(items.length)} />
        <StatCard label="Total Panjang" value={String(totalLength)} unit="m" />
        <StatCard label="Kondisi Baik" value={String(conditionCounts['Baik'] ?? 0)} />
        <StatCard label="Rusak" value={String((conditionCounts['Rusak Ringan'] ?? 0) + (conditionCounts['Rusak Berat'] ?? 0))} />
      </div>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data irigasi. Tim akan menambahkan segera." />
      ) : (
        <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-4 shadow-terracotta">
          <Accordion type="single" collapsible>
            {items.map((i) => (
              <AccordionItem key={i.slug} value={i.slug}>
                <AccordionTrigger>
                  <span className="font-semibold text-brown-900">{i.name}</span>
                  <span className="ml-3 text-xs text-ink/60">{i.saluranType} · {i.village} · {i.condition}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-ink/70">Panjang: {i.lengthM} m · Status aliran: {i.flowStatus}</p>
                  <p className="mt-2 text-sm">{i.body}</p>
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
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      <MotifDivider className="mt-12" />
    </div>
  )
}
