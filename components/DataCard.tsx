import Image from 'next/image'
import Link from 'next/link'

export function DataCard({
  href, image, title, chips = [], desc,
}: {
  href: string
  image: string
  title: string
  chips?: { label: string; color?: string }[]
  desc?: string
}) {
  return (
    <Link href={href} className="group block rounded-2xl border border-tan-700/30 bg-gold-100/40 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-brown-900 group-hover:text-terracotta-500">{title}</h3>
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {chips.map((c) => (
              <span key={c.label} className="rounded-full px-2 py-0.5 text-xs" style={c.color ? { backgroundColor: c.color + '22', color: c.color } : undefined}>
                {c.label}
              </span>
            ))}
          </div>
        )}
        {desc && <p className="mt-2 text-sm text-ink/70 line-clamp-2">{desc}</p>}
      </div>
    </Link>
  )
}