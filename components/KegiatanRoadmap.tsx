'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Info } from 'lucide-react'
import type { Kegiatan } from '@/lib/schemas'
import { StatusBadge } from '@/components/StatusBadge'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'

const CATEGORY_LINKS: Record<Kegiatan['category'], string> = {
  Ekowisata: '/pariwisata',
  Irigasi: '/irigasi',
  Kesehatan: '/kesehatan',
  Pariwisata: '/pariwisata',
  Ekonomi: '/umkm',
}

export function KegiatanRoadmap({ items }: { items: (Kegiatan & { slug: string })[] }) {
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
    <div className="space-y-6">
      {items.map((k) => (
        <div
          key={k.slug}
          className="group relative overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover md:flex"
        >
          <div className="relative aspect-video shrink-0 md:w-64 md:aspect-auto">
            <Image
              src={k.cover}
              alt={k.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-brown-900">{k.title}</h3>
              <StatusBadge status={k.status} />
            </div>
            <span className="text-xs text-ink/60">{k.category}</span>
            <p className="mt-2 text-sm text-ink/70">{k.summary}</p>
            {k.milestones.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {k.milestones.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span>{m.done ? '✓' : '○'}</span>
                    <span className={m.done ? 'line-through text-ink/40' : ''}>{m.label}</span>
                    <span className="text-xs text-ink/40">— {m.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => openModal(k)}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-cream-light/90 text-brown-900 opacity-0 shadow-sm transition-opacity hover:bg-cream-light group-hover:opacity-100 focus:opacity-100"
            aria-label={`Lihat detail ${k.title}`}
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      ))}
      <DetailModal open={open} onOpenChange={setOpen} data={modalData} />
    </div>
  )
}
