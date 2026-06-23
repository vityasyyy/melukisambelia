import Image from 'next/image'
import type { Kegiatan } from '@/lib/schemas'
import { StatusBadge } from '@/components/StatusBadge'

export function KegiatanRoadmap({ items }: { items: (Kegiatan & { slug: string })[] }) {
  return (
    <div className="space-y-6">
      {items.map((k) => (
        <div
          key={k.slug}
          className="overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover md:flex"
        >
          <div className="relative aspect-video shrink-0 md:w-64 md:aspect-auto">
            <Image
              src={k.cover}
              alt={k.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-brown-900">{k.title}</h3>
              <StatusBadge status={k.status} />
            </div>
            <span className="text-xs text-ink/60">{k.category}</span>
            <p className="mt-2 text-sm text-ink/70">{k.summary}</p>
            {k.milestones.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {k.milestones.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span>{m.done ? '✓' : '○'}</span>
                    <span className={m.done ? 'line-through text-ink/40' : ''}>{m.label}</span>
                    <span className="text-xs text-ink/40">— {m.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
