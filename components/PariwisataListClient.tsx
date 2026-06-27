'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'
import { FadeIn } from '@/components/FadeIn'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import type { Pariwisata } from '@/lib/schemas'

export function PariwisataListClient({ items }: { items: (Pariwisata & { slug: string })[] }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    setModalData({
      title: item.title,
      image: item.cover,
      description: item.shortDesc,
      body: item.body,
      href: `/pariwisata/${item.slug}`,
      linkLabel: 'Buka halaman wisata →',
      lat: item.lat,
      lng: item.lng,
      mapTitle: item.title,
      chips: [
        { label: item.category, color: '#14A8E1' },
        { label: item.village, color: '#99BA57' },
        ...item.facilities.map((f) => ({ label: f, color: '#E3795C' })),
      ],
    })
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <SectionHeader
          kicker="PARIWISATA"
          title="Potensi Wisata Sambelia"
          intro="Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan."
          tone="water"
        />
      </FadeIn>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data wisata. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <DataCard
              key={p.slug}
              href={`/pariwisata/${p.slug}`}
              image={p.cover}
              title={p.title}
              chips={[
                { label: p.category, color: '#14A8E1' },
                { label: p.village, color: '#99BA57' },
              ]}
              desc={p.shortDesc}
              onDetailClick={() => openModal(p)}
            />
          ))}
        </div>
      )}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      <MotifDivider className="mt-12" />
    </div>
  )
}
