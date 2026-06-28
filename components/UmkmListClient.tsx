'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/SectionHeader'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { PageHero } from '@/components/PageHero'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'
import { petaLink } from '@/lib/links'
import { cn } from '@/lib/utils'
import type { Umkm } from '@/lib/schemas'

const KATEGORI_OPTIONS = ['Semua', 'Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya'] as const

export function UmkmListClient({ items }: { items: (Umkm & { slug: string })[] }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [open, setOpen] = useState(false)
  const [activeKategori, setActiveKategori] = useState<string>('Semua')
  const filtered = activeKategori === 'Semua' ? items : items.filter(i => i.kategori === activeKategori)

  const openModal = (item: (typeof items)[number]) => {
    const chips: DetailModalData['chips'] = [
      { label: item.kategori, color: '#F0AC6D' },
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
    <>
      <PageHero
        kicker="UMKM"
        title="UMKM Lokal Sambelia"
        intro="Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia."
        tone="terracotta"
      />
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
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {KATEGORI_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => setActiveKategori(k)}
                className={cn(
                  'relative inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
                  activeKategori === k
                    ? 'border-transparent text-brown-900'
                    : 'border-tan-700/30 bg-page text-ink/70 hover:text-ink'
                )}
                aria-pressed={activeKategori === k}
              >
                {activeKategori === k && (
                  <motion.span
                    layoutId="umkm-kategori-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-cream-beige shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                {k}
              </button>
            ))}
          </div>
          <StaggerContainer
            key={activeKategori}
            stagger={0.08}
            mode="mount"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((u) => (
              <StaggerItem key={u.slug}>
                <UmkmCard item={u} onDetailClick={() => openModal(u)} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
      </div>
    </>
  )
}
