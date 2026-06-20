import Image from 'next/image'
import type { Mitra } from '@/lib/schemas'

export function MitraGrid({ items }: { items: (Mitra & { slug: string })[] }) {
  const tiers = ['Utama', 'Pendukung', 'Media'] as const
  return (
    <div className="space-y-12">
      {tiers.map((tier) => {
        const tierItems = items.filter((m) => m.tier === tier)
        if (tierItems.length === 0) return null
        return (
          <div key={tier}>
            <h3 className="font-beautique text-2xl text-brown-900 mb-4">Mitra {tier}</h3>
            <div className="flex flex-wrap gap-8 items-center">
              {tierItems.map((m) => (
                <a key={m.slug} href={m.url} target="_blank" rel="noopener noreferrer">
                  <Image src={m.logo} alt={m.name} width={160} height={60} className="opacity-70 hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}