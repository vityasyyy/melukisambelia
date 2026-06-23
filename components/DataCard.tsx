import Image from 'next/image'
import Link from 'next/link'

export function DataCard({
  href,
  image,
  title,
  chips = [],
  desc,
  accent = '#F0AC6D',
}: {
  href: string
  image: string
  title: string
  chips?: { label: string; color?: string }[]
  desc?: string
  accent?: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
    >
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
  )
}
