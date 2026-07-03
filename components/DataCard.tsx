import Image from 'next/image'
import Link from 'next/link'
import { ChipRow, type ChipData } from '@/components/Chip'

export function DataCard({
  href,
  image,
  title,
  chips = [],
  desc,
  accent = '#F0AC6D',
  featured = false,
  onDetailClick,
}: {
  href?: string
  image: string
  title: string
  chips?: ChipData[]
  desc?: string
  accent?: string
  featured?: boolean
  onDetailClick?: () => void
}) {
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brown-950/20 to-transparent" />
      </div>
      <div className="min-w-0 flex-1 p-4">
        <h3 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{title}</h3>
        {chips.length > 0 && <ChipRow chips={chips} className="mt-1.5" />}
        {desc && <p className="mt-2.5 text-sm text-ink/60 leading-relaxed line-clamp-2">{desc}</p>}
      </div>
    </>
  )

  return (
    <div
      className="glass-card glass-accent-top group relative h-full flex flex-col overflow-hidden"
      style={{ '--accent-color': accent } as React.CSSProperties}
    >
      {onDetailClick ? (
        <button type="button" onClick={onDetailClick} className="block min-w-0 h-full w-full text-left">
          {inner}
        </button>
      ) : (
        <Link href={href ?? '#'} className="block min-w-0 h-full">
          {inner}
        </Link>
      )}
    </div>
  )
}