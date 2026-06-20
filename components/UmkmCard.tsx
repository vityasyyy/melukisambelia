import Image from 'next/image'
import type { Umkm } from '@/lib/schemas'

export function UmkmCard({ item }: { item: Umkm & { slug: string } }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-gold-100/40 overflow-hidden">
      <div className="relative aspect-video">
        <Image src={item.cover} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brown-900">{item.name}</h3>
        <p className="text-sm text-ink/70">{item.owner}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs">{item.product}</span>
          <span className="rounded-full bg-water-50 px-2 py-0.5 text-xs text-water-900">{item.village}</span>
        </div>
        {item.contact && <p className="mt-2 text-xs text-ink/60">{item.contact}</p>}
      </div>
    </div>
  )
}