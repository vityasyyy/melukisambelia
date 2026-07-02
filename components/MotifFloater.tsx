'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

type Motif = 'cincin_sambel' | 'bunga_sambel' | 'ornament-gold'
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right'
type Size = 'sm' | 'md' | 'lg'
type MotifColor = 'terracotta' | 'gold' | 'water' | 'olive' | 'brown'

const POSITION_CLASSES: Record<Position, string> = {
  'top-left': 'top-4 left-2 sm:left-6',
  'top-right': 'top-4 right-2 sm:right-6',
  'bottom-left': 'bottom-4 left-2 sm:left-6',
  'bottom-right': 'bottom-4 right-2 sm:right-6',
  'center-left': 'top-1/2 -translate-y-1/2 left-2 sm:left-6',
  'center-right': 'top-1/2 -translate-y-1/2 right-2 sm:right-6',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'w-20 h-20 sm:w-28 sm:h-28',
  md: 'w-28 h-28 sm:w-36 sm:h-36',
  lg: 'w-36 h-36 sm:w-48 sm:h-48',
}

const COLOR_FILTERS: Record<MotifColor, string> = {
  terracotta: 'sepia(0.7) hue-rotate(-10deg) saturate(3)',
  gold: 'sepia(0.9) hue-rotate(-5deg) saturate(2.5)',
  water: 'sepia(0.5) hue-rotate(170deg) saturate(3)',
  olive: 'sepia(0.7) hue-rotate(60deg) saturate(2.5)',
  brown: 'sepia(0.9) saturate(2.5)',
}

export function MotifFloater({
  motif = 'bunga_sambel',
  position = 'top-right',
  size = 'md',
  color = 'gold',
  opacity = 0.55,
}: {
  motif?: Motif
  position?: Position
  size?: Size
  color?: MotifColor
  opacity?: number
}) {
  const reduce = useReducedMotion()
  const isImage = motif === 'ornament-gold'
  const isFlower = motif === 'bunga_sambel'

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute z-0 ${POSITION_CLASSES[position]} ${SIZE_CLASSES[size]} motif-entrance`}
      initial={reduce ? undefined : { opacity: 0, scale: 0.85, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className={`relative w-full h-full motif-glow ${isFlower ? 'motif-rotate-reverse' : 'motif-rotate'}`} style={{ animationDuration: isFlower ? '50s' : '60s' }}>
        {isFlower && (
          <div className="motif-float">
            <Image
              src={`/images/design-system/${motif}.svg`}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 80px, 144px"
              style={{ filter: COLOR_FILTERS[color], opacity }}
            />
          </div>
        )}
        {!isFlower && (
          <Image
            src={isImage ? '/images/design-system/ornament-gold.png' : `/images/design-system/${motif}.svg`}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 80px, 144px"
            style={{ filter: COLOR_FILTERS[color], opacity }}
          />
        )}
      </div>
    </motion.div>
  )
}