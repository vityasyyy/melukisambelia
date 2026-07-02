'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AlternatingCardGrid } from '@/components/AlternatingCardGrid'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'

type LingkunganItem = {
  slug: string
  cover: string
  title: string
  category: string
  description: string
}

type GisFile = {
  url: string
  name: string
  description?: string
  category: 'umum' | 'air' | 'irigasi' | 'vegetasi'
  type: string
}

export function LingkunganCardGrid({ items }: { items: LingkunganItem[] }) {
  return (
    <AlternatingCardGrid
      items={items}
      renderItem={(it: unknown, _i: number, featured: boolean) => {
        const item = it as LingkunganItem
        return (
          <div className="glass-card glass-accent-top group overflow-hidden" style={{ '--accent-color': '#99BA57' } as React.CSSProperties}>
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-green-50">
              <Image
                src={item.cover}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, 33vw'}
              />
            </div>
            <div className="p-5">
              <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-900">
                {item.category}
              </span>
              <h3 className="mt-2 font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60 line-clamp-3">{item.description}</p>
            </div>
          </div>
        )
      }}
    />
  )
}

export function GisCardGrid({ items }: { items: GisFile[] }) {
  return (
    <AlternatingCardGrid
      items={items}
      renderItem={(it: unknown, _i: number, featured: boolean) => {
        const f = it as GisFile
        return (
          <Link
            href="/peta?tab=vegetasi"
            className="glass-card glass-accent-top group overflow-hidden"
            style={{ '--accent-color': '#99BA57' } as React.CSSProperties}
          >
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-green-50">
              {f.type === 'image' && (
                <Image
                  src={f.url}
                  alt={f.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, 33vw'}
                  unoptimized
                />
              )}
              {f.type !== 'image' && (
                <div className="absolute inset-0 flex items-center justify-center text-green-900">
                  <span className="text-sm font-medium">{GIS_CATEGORY_LABELS[f.category]}</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{f.name}</h3>
              {f.description && <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.description}</p>}
            </div>
          </Link>
        )
      }}
    />
  )
}