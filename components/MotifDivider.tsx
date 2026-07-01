'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MotifDivider({
  motif = 'batik_sambel',
  className,
  animate = true,
}: {
  motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'
  className?: string
  animate?: boolean
}) {
  const reduce = useReducedMotion()

  if (motif === 'batik_sambel') {
    return (
      <motion.div
        className={cn('relative', className)}
        initial={reduce || !animate ? undefined : { opacity: 0, scaleY: 0.8 }}
        whileInView={reduce || !animate ? undefined : { opacity: 1, scaleY: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div aria-hidden className="batik-divider" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
      </motion.div>
    )
  }

  return (
    <div className={cn('flex justify-center py-3', className)}>
      <motion.div
        initial={reduce || !animate ? undefined : { opacity: 0, scale: 0.85, y: 8 }}
        whileInView={reduce || !animate ? undefined : { opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ opacity: reduce ? 0.15 : undefined }}
      >
        <Image
          src={`/images/design-system/${motif}.svg`}
          alt=""
          width={100}
          height={34}
          aria-hidden
          className="opacity-15"
        />
      </motion.div>
    </div>
  )
}