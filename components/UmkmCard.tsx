import Image from 'next/image'
import { Info } from 'lucide-react'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item, onDetailClick }: { item: Umkm & { slug: string }; onDetailClick?: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover">
      <div className="relative aspect-video">
        <Image
          src={item.cover}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-brown-900">{item.name}</h3>
        <p className="text-sm text-ink/70">{item.owner}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-medium">{item.kategori}</span>
          <span className="rounded-full bg-water-50 px-2.5 py-0.5 text-xs font-medium text-water-900">{item.village}</span>
        </div>
        {item.contact && <p className="mt-2 text-xs text-ink/60">{item.contact}</p>}
      </div>
      {onDetailClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDetailClick()
          }}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-cream-light/90 text-brown-900 opacity-0 shadow-sm transition-opacity hover:bg-cream-light group-hover:opacity-100 focus:opacity-100"
          aria-label={`Lihat detail ${item.name}`}
        >
          <Info className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
