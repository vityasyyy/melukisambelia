import Image from 'next/image'
import type { Umkm } from '@/lib/schemas'
import { HoverableCard } from '@/components/HoverableCard'

export function UmkmCard({ item, onDetailClick }: { item: Umkm & { slug: string }; onDetailClick?: () => void }) {
  return (
    <HoverableCard accentColor="#E3795C" onClick={onDetailClick}>
      <button type="button" onClick={onDetailClick} className="block w-full text-left">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image
            src={item.cover}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <h3 className="truncate font-semibold text-base sm:text-lg text-white group-hover:text-goldSoft transition-colors" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{item.name}</h3>
            <p className="truncate text-sm text-white/80">{item.owner}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm">
                {item.kategori}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm">
                {item.village}
              </span>
            </div>
          </div>
        </div>
      </button>
    </HoverableCard>
  )
}