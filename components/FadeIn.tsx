'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'
import { presetFade } from '@/lib/animation'

export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  y = 12,
  className,
  once = true,
  hover = false,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
  once?: boolean
  hover?: boolean
}) {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -2, transition: presetFade } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  )
}