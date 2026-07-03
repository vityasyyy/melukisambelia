import Image from 'next/image'
import Link from 'next/link'
import { ChipRow, type ChipData } from '@/components/Chip'

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
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <h3 className="truncate font-semibold text-base sm:text-lg text-white drop-shadow-sm group-hover:text-goldSoft transition-colors">{title}</h3>
        {featured && chips.length > 0 && (
          <div className="mt-1">
            <ChipRow chips={chips} className="mt-1" />
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