import Image from 'next/image'
import Link from 'next/link'
import { Info } from 'lucide-react'

export function DataCard({
  href,
  image,
  title,
  chips = [],
  desc,
  accent = '#F0AC6D',
  onDetailClick,
}: {
  href: string
  image: string
  title: string
  chips?: { label: string; color?: string }[]
  desc?: string
  accent?: string
  onDetailClick?: () => void
}) {
  return (
    <div className="group relative block rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden shadow-terracotta transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-lg hover:shadow-terracotta/20">
      <Link href={href} className="block">
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 z-10" style={{ backgroundColor: accent }} />
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{title}</h3>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span
                  key={c.label}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={
                    c.color
                      ? { backgroundColor: c.color + '18', color: c.color, border: `1px solid ${c.color}30` }
                      : undefined
                  }
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}
          {desc && <p className="mt-2 text-sm text-ink/70 line-clamp-2 leading-relaxed">{desc}</p>}
        </div>
      </Link>
      {onDetailClick && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDetailClick()
          }}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-cream-light/90 text-brown-900 opacity-0 shadow-sm transition-opacity hover:bg-cream-light group-hover:opacity-100 focus:opacity-100"
          aria-label={`Lihat detail ${title}`}
        >
          <Info className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
