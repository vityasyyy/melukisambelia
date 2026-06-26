'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'
import type { Umkm } from '@/lib/schemas'

export function UmkmListClient({ items }: { items: (Umkm & { slug: string })[] }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    const chips: DetailModalData['chips'] = [
      { label: item.product, color: '#F0AC6D' },
      { label: item.village, color: '#14A8E1' },
    ]
    if (item.contact) chips.push({ label: item.contact, color: '#667F37' })

    setModalData({
      title: item.name,
      image: item.cover,
      description: item.owner,
      body: item.body,
      href: petaLink({ layer: 'umkm', lat: item.lat, lng: item.lng }),
      linkLabel: 'Lihat di peta →',
      lat: item.lat,
      lng: item.lng,
      mapTitle: item.name,
      chips,
    })
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <SectionHeader
          kicker="UMKM"
          title="UMKM Lokal Sambelia"
          intro="Kerajinan, kuliner, dan produk lokal."
          tone="terracotta"
        />
      </FadeIn>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data UMKM. Tim akan menambahkan segera." />
      ) : (
        <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => (
            <StaggerItem key={u.slug}>
              <UmkmCard item={u} onDetailClick={() => openModal(u)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      <MotifDivider className="mt-12" />
    </div>
  )
}
