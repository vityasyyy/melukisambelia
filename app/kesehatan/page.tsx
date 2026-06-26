'use client'

import { useState } from 'react'
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { DataCard } from '@/components/DataCard'
import { MotifDivider } from '@/components/MotifDivider'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'

export default function KesehatanPage() {
  const items = getCollection('kesehatan')
  const posyandu = items.filter((i) => i.type === 'Posyandu').length
  const puskesmas = items.filter((i) => i.type === 'Puskesmas').length
  const cadres = items.reduce((s, i) => s + i.cadresCount, 0)
  const stunting = items.filter((i) => i.stuntingProgram).length

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
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="KESEHATAN"
        title="Fasilitas & Program Kesehatan"
        intro="Posyandu, puskesmas, dan program stunting di Sambelia."
        tone="olive"
      />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Posyandu" value={String(posyandu)} />
        <StatCard label="Puskesmas" value={String(puskesmas)} />
        <StatCard label="Kader" value={String(cadres)} />
        <StatCard label="Program Stunting" value={String(stunting)} />
      </div>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data kesehatan. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((k) => (
            <DataCard
              key={k.slug}
              href="/kesehatan"
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
          ))}
        </div>
      )}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      <MotifDivider className="mt-12" />
    </div>
  )
}
