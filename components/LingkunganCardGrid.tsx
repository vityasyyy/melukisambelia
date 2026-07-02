'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AlternatingCardGrid } from '@/components/AlternatingCardGrid'
import { MapLinkBadge } from '@/components/MapLinkBadge'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'

type LingkunganItem = {
  slug: string
  cover: string
  title: string
  category: string
  description: string
}

export type HubSection = {
  title: string
  description: string
  href: string
  petaHref?: string
  tone: 'green' | 'water' | 'terracotta' | 'olive' | 'gold'
  icon?: string
}

const TONE_BORDER: Record<string, string> = {
  green: 'border-green-500',
  water: 'border-water-500',
  terracotta: 'border-terracotta-500',
  olive: 'border-olive',
  gold: 'border-gold-500',
}

const TONE_BG: Record<string, string> = {
  green: 'bg-green-50',
  water: 'bg-water-50',
  terracotta: 'bg-terracotta-50',
  olive: 'bg-olive/10',
  gold: 'bg-gold-50',
}

const TONE_TEXT: Record<string, string> = {
  green: 'text-green-900',
  water: 'text-water-900',
  terracotta: 'text-terracotta-900',
  olive: 'text-olive-dark',
  gold: 'text-brown-900',
}

export function AnalysisList({ items }: { items: LingkunganItem[] }) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col divide-y divide-brown-200/60">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/peta?tab=${categoryToTab(item.category)}`}
          className="group flex items-start gap-4 py-4 transition-colors hover:bg-green-50/40 -mx-4 px-4 rounded-lg"
        >
          <span className={`mt-1 inline-flex h-2 w-2 shrink-0 rounded-full ${TONE_BG[item.category === 'Vegetasi' ? 'green' : item.category === 'Erosi' ? 'terracotta' : 'water']}`} />
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-900">
              {item.category}
            </span>
            <h3 className="mt-1 font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink/60 line-clamp-2">{item.description}</p>
          </div>
          <span className="mt-2 shrink-0 text-sm font-medium text-green-700 group-hover:text-green-500 transition-colors">
            Lihat di peta →
          </span>
        </Link>
      ))}
    </div>
  )
}

function categoryToTab(category: string): string {
  switch (category) {
    case 'Vegetasi': return 'vegetasi'
    case 'Erosi': return 'erosi'
    case 'Blue Carbon': return 'blue-carbon'
    default: return 'vegetasi'
  }
}

export function HubSectionList({ sections }: { sections: HubSection[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <div
          key={section.href}
          className={`group relative flex flex-col gap-2 rounded-2xl border-l-4 ${TONE_BORDER[section.tone]} bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
        >
          <Link href={section.href} className="absolute inset-0 z-10" aria-label={section.title} />
          <h3 className={`font-beautique text-lg ${TONE_TEXT[section.tone]}`}>
            {section.title}
          </h3>
          <p className="text-sm leading-relaxed text-ink/60">{section.description}</p>
          {section.petaHref && (
            <MapLinkBadge href={section.petaHref} label="Lihat di peta" tone={section.tone} />
          )}
        </div>
      ))}
    </div>
  )
}

type GisFile = {
  url: string
  name: string
  description?: string
  category: 'umum' | 'air' | 'irigasi' | 'vegetasi'
  type: string
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
            <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-white">
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
            <div className="p-4">
              <h3 className="font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{f.name}</h3>
              {f.description && <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.description}</p>}
            </div>
          </Link>
        )
      }}
    />
  )
}