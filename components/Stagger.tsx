'use client'

import { motion, useReducedMotion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

export function StaggerContainer({
  children,
  stagger = 0.1,
  className,
}: {
  children: ReactNode
  stagger?: number
  className?: string
}) {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.1,
      },
    },
  }
  return (
    <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
