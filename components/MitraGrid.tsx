import Image from 'next/image'
import type { Mitra } from '@/lib/schemas'
import { MotifDivider } from './MotifDivider'

export function MitraGrid({ items }: { items: (Mitra & { slug: string })[] }) {
  const tiers = ['Utama', 'Pendukung', 'Media'] as const
  return (
    <div className="space-y-12">
      {tiers.map((tier) => {
        const tierItems = items.filter((m) => m.tier === tier)
        if (tierItems.length === 0) return null
        return (
          <div key={tier}>
            <h3 className="mb-4 font-beautique text-2xl text-brown-900">Mitra {tier}</h3>
            <div className="flex flex-wrap items-center gap-8">
              {tierItems.map((m) => (
                <a
                  key={m.slug}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 p-4 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
                >
                  <Image src={m.logo} alt={m.name} width={160} height={60} className="opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
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
