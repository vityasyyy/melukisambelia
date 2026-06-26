import Image from 'next/image'
import type { Mitra } from '@/lib/schemas'
import { MotifDivider } from './MotifDivider'

export function MitraGrid({ items }: { items: (Mitra & { slug: string })[] }) {
  const tiers = ['Utama', 'Pendukung', 'Media'] as const
  const tierSize: Record<(typeof tiers)[number], { w: number; h: number }> = {
    Utama: { w: 180, h: 80 },
    Pendukung: { w: 160, h: 70 },
    Media: { w: 140, h: 60 },
  }
  return (
    <div className="space-y-16">
      {tiers.map((tier) => {
        const tierItems = items.filter((m) => m.tier === tier)
        if (tierItems.length === 0) return null
        const { w, h } = tierSize[tier]
        return (
          <div key={tier}>
            <h3 className="mb-6 text-center font-beautique text-2xl text-brown-900 md:text-left">Mitra {tier}</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
              {tierItems.map((m) => (
                <a
                  key={m.slug}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-24 w-40 items-center justify-center rounded-2xl border border-tan-700/20 bg-cream-beige/50 p-4 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
                >
                  <Image src={m.logo} alt={m.name} width={w} height={h} className="max-h-full max-w-full object-contain opacity-80 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0" />
                </a>
              ))}
            </div>
          </div>
        )
      })}
      <MotifDivider className="mt-12" />
    </div>
  )
}
