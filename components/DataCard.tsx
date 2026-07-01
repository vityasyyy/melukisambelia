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
  onDetailClick,
}: {
  href?: string
  image: string
  title: string
  chips?: ChipData[]
  desc?: string
  accent?: string
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
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brown-950/20 to-transparent" />
      </div>
      <div className="min-w-0 flex-1 p-5">
        <h3 className="truncate font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{title}</h3>
        {chips.length > 0 && <ChipRow chips={chips} className="mt-1.5" />}
        {desc && <p className="mt-2.5 text-sm text-ink/60 leading-relaxed line-clamp-2">{desc}</p>}
      </div>
    </>
  )

  return (
    <div className="group relative h-full flex flex-col rounded-2xl border-l-[3px] bg-white overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-sambel hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]" style={{ borderLeftColor: accent }}>
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