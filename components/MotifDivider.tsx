'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export function MotifDivider({
  motif = 'cincin_sambel',
  className,
  animate = true,
}: {
  motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'
  className?: string
  animate?: boolean
}) {
  return (
    <div className={cn('flex justify-center py-6', className)}>
      <Image
        src={`/images/design-system/${motif}.svg`}
        alt=""
        width={120}
        height={40}
        aria-hidden
        className={cn('opacity-20', animate && 'motif-fade')}
      />
    </div>
  )
}
