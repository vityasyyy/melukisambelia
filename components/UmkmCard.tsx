import Image from 'next/image'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item, onDetailClick }: { item: Umkm & { slug: string }; onDetailClick?: () => void }) {
  return (
    <div className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-terracotta-hover">
      <button type="button" onClick={onDetailClick} className="block h-full w-full text-left">
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 z-10 bg-terracotta-500 opacity-70 transition-opacity group-hover:opacity-100" />
          <Image
            src={item.cover}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex-1 p-5">
          <h3 className="font-semibold text-lg text-brown-900">{item.name}</h3>
          <p className="text-sm text-ink/70">{item.owner}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-medium">{item.kategori}</span>
            <span className="rounded-full bg-water-50 px-2.5 py-0.5 text-xs font-medium text-water-900">{item.village}</span>
          </div>
          {item.contact && <p className="mt-2 text-xs text-ink/70">{item.contact}</p>}
        </div>
      </button>
    </div>
  )
}