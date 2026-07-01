'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function MotifDivider({
  motif = 'batik_sambel',
  className,
}: {
  motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'
  className?: string
}) {
  if (motif === 'batik_sambel') {
    return (
      <div className={cn('relative', className)}>
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
        <div aria-hidden className="batik-divider" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
      </div>
    )
  }

  return (
    <div className={cn('flex justify-center py-3', className)}>
      <Image
        src={`/images/design-system/${motif}.svg`}
        alt=""
        width={100}
        height={34}
        aria-hidden
        className="opacity-25"
      />
    </div>
  )
}