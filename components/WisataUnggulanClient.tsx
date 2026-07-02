'use client'

import { useState } from 'react'
import { DataCard } from '@/components/DataCard'
import { AlternatingCardGrid } from '@/components/AlternatingCardGrid'
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
      <AlternatingCardGrid
        items={items}
        renderItem={(p: unknown, _i: number, featured: boolean) => {
          const item = p as Pariwisata & { slug: string }
          return (
            <DataCard
              image={item.cover}
              title={item.title}
              chips={[
                { label: item.category, tone: 'water' },
                { label: item.village, tone: 'green' },
              ]}
              desc={item.shortDesc}
              onDetailClick={() => openModal(item)}
              featured={featured}
              accent="#14A8E1"
            />
          )
        }}
      />
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
    </>
  )
}