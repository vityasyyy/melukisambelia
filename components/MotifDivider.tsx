'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduce = useReducedMotion()
  return (
    <div className={cn('flex justify-center py-6', className)}>
      <motion.div
        initial={reduce || !animate ? undefined : { opacity: 0, scale: 0.8, y: 8 }}
        whileInView={reduce || !animate ? undefined : { opacity: 0.22, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ opacity: reduce ? 0.2 : undefined }}
      >
        <Image
          src={`/images/design-system/${motif}.svg`}
          alt=""
          width={120}
          height={40}
          aria-hidden
          className="motif-fade"
        />
      </motion.div>
    </div>
  )
}