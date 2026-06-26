'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { KegiatanRoadmap } from '@/components/KegiatanRoadmap'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import type { Kegiatan } from '@/lib/schemas'

const CATEGORY_LINKS: Record<Kegiatan['category'], string> = {
  Ekowisata: '/pariwisata',
  Irigasi: '/irigasi',
  Kesehatan: '/kesehatan',
  Pariwisata: '/pariwisata',
  Ekonomi: '/umkm',
}

export function KegiatanListClient({ items }: { items: (Kegiatan & { slug: string })[] }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)

  const openModal = (item: (typeof items)[number]) => {
    setModalData({
      title: item.title,
      image: item.cover,
      description: item.summary,
      body: item.body,
      href: CATEGORY_LINKS[item.category],
      linkLabel: `Jelajahi ${item.category.toLowerCase()} →`,
      chips: [
        { label: item.category, color: '#742D1B' },
        { label: item.status, color: item.status === 'Aktif' ? '#667F37' : item.status === 'Berkembang' ? '#F0AC6D' : '#14A8E1' },
      ],
    })
    setOpen(true)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="KEGIATAN"
        title="Program Unggulan"
        intro="Roadmap program pemberdayaan Melukis Sambelia."
        tone="brown"
      />
      {items.length === 0 ? (
        <EmptyState message="Belum ada program. Tim akan menambahkan segera." />
      ) : (
        <KegiatanRoadmap items={items} onItemClick={openModal} />
      )}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      <MotifDivider className="mt-12" />
    </div>
  )
}
