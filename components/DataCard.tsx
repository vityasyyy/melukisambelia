import Image from 'next/image'
import Link from 'next/link'
import type { ChipData } from '@/components/Chip'

export function DataCard({
  href,
  image,
  title,
  chips = [],
  // desc is accepted but not rendered (overlay layout)
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
    <div className="relative aspect-video overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
      />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <h3
          className={`truncate font-semibold text-white group-hover:text-goldSoft transition-colors ${featured ? 'font-beautique text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
        >
          {title}
        </h3>
        {featured && chips.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm"
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      className="glass-card glass-accent-top group relative overflow-hidden"
      style={{ '--accent-color': accent } as React.CSSProperties}
    >
      {onDetailClick ? (
        <button type="button" onClick={onDetailClick} className="block w-full text-left">
          {inner}
        </button>
      ) : (
        <Link href={href ?? '#'} className="block">
          {inner}
        </Link>
      )}
    </div>
  )
}