import Image from 'next/image'
import { ChipRow } from '@/components/Chip'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item, onDetailClick }: { item: Umkm & { slug: string }; onDetailClick?: () => void }) {
  return (
    <div
      className="glass-card glass-accent-top group relative overflow-hidden"
      style={{ '--accent-color': '#E3795C' } as React.CSSProperties}
    >
      <button type="button" onClick={onDetailClick} className="block w-full text-left">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image
            src={item.cover}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h3 className="truncate font-semibold text-base sm:text-lg text-white drop-shadow-sm group-hover:text-goldSoft transition-colors">{item.name}</h3>
            <p className="truncate text-sm text-white/80">{item.owner}</p>
            <ChipRow
              className="mt-1"
              chips={[
                { label: item.kategori, tone: 'gold' },
                { label: item.village, tone: 'water' },
              ]}
            />
          </div>
        </div>
      </button>
    </div>
  )
}