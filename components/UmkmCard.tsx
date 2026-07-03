import Image from 'next/image'
import { ChipRow } from '@/components/Chip'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item, onDetailClick }: { item: Umkm & { slug: string }; onDetailClick?: () => void }) {
  return (
    <div
      className="glass-card glass-accent-top group relative h-full flex flex-col overflow-hidden"
      style={{ '--accent-color': '#E3795C' } as React.CSSProperties}
    >
      <button type="button" onClick={onDetailClick} className="flex min-w-0 w-full flex-1 flex-col text-left overflow-hidden">
        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <Image
            src={item.cover}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brown-950/20 to-transparent" />
        </div>
        <div className="min-w-0 flex-1 p-4">
          <h3 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{item.name}</h3>
          <p className="truncate text-sm text-ink/60">{item.owner}</p>
          <ChipRow
            className="mt-1.5"
            chips={[
              { label: item.kategori, tone: 'gold' },
              { label: item.village, tone: 'water' },
            ]}
          />
          {item.contact && <p className="mt-1.5 truncate text-xs text-ink/60">{item.contact}</p>}
        </div>
      </button>
    </div>
  )
}