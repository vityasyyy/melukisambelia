'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cardHoverVariants } from '@/lib/animation'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function HoverableCard({
  children,
  className,
  accentColor = '#F0AC6D',
  as = 'div',
  onClick,
}: {
  children: ReactNode
  className?: string
  accentColor?: string
  as?: 'div' | 'button' | 'a'
  onClick?: () => void
}) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    const El = as
    return (
      <El
        className={cn('glass-card glass-accent-top group relative overflow-hidden', className)}
        style={{ '--accent-color': accentColor } as React.CSSProperties}
        onClick={onClick}
      >
        {children}
      </El>
    )
  }

  return (
    <motion.div
      className={cn('glass-card glass-accent-top group relative overflow-hidden', className)}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}