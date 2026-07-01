'use client'

import { useState } from 'react'
import { DataCard } from '@/components/DataCard'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'
import type { Pariwisata } from '@/lib/schemas'

export function WisataUnggulanClient({ items }: { items: (Pariwisata & { slug: string })[] }) {
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
      <StaggerContainer stagger={0.1} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <StaggerItem key={p.slug}>
            <DataCard
              image={p.cover}
              title={p.title}
              chips={[
                { label: p.category, tone: 'water' },
                { label: p.village, tone: 'green' },
              ]}
              desc={p.shortDesc}
              onDetailClick={() => openModal(p)}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
    </>
  )
}