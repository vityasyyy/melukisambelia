'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

type Motif = 'cincin_sambel' | 'bunga_sambel' | 'ornament-gold'
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right'
type Size = 'sm' | 'md' | 'lg' | 'xl'
type MotifColor = 'terracotta' | 'gold' | 'water' | 'olive' | 'brown'

const POSITION_CLASSES: Record<Position, string> = {
  'top-left': 'top-4 left-4 sm:top-8 sm:left-8',
  'top-right': 'top-4 right-4 sm:top-8 sm:right-8',
  'bottom-left': 'bottom-4 left-4 sm:bottom-8 sm:left-8',
  'bottom-right': 'bottom-4 right-4 sm:bottom-8 sm:right-8',
  'center-left': 'top-1/2 -translate-y-1/2 left-4 sm:left-8',
  'center-right': 'top-1/2 -translate-y-1/2 right-4 sm:right-8',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52',
  md: 'w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64',
  lg: 'w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80',
  xl: 'w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96',
}

const COLOR_FILTERS: Record<MotifColor, string> = {
  terracotta: 'sepia(0.9) hue-rotate(-10deg) saturate(4) brightness(1.3)',
  gold: 'sepia(0.95) hue-rotate(-5deg) saturate(3.5) brightness(1.3)',
  water: 'sepia(0.7) hue-rotate(170deg) saturate(4) brightness(1.3)',
  olive: 'sepia(0.85) hue-rotate(55deg) saturate(3.5) brightness(1.2)',
  brown: 'sepia(0.9) hue-rotate(10deg) saturate(3.5) brightness(1.2)',
}

export function MotifFloater({
  motif = 'bunga_sambel',
  position = 'top-right',
  size = 'md',
  color = 'gold',
  opacity = 0.9,
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
      className={`pointer-events-none absolute z-0 ${POSITION_CLASSES[position]} ${SIZE_CLASSES[size]}`}
      initial={reduce ? undefined : { opacity: 0, scale: 0.85, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      style={reduce ? { opacity: 0.7 } : undefined}
    >
      <div className={`relative w-full h-full motif-glow ${isFlower ? 'motif-rotate-reverse' : 'motif-rotate'}`} style={{ animationDuration: isFlower ? '50s' : '60s', transform: 'translate3d(0,0,0)' }}>
        {isFlower && (
          <div className="relative w-full h-full motif-float" style={{ transform: 'translate3d(0,0,0)' }}>
            <Image
              src={`/images/design-system/${motif}.svg`}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 192px, 256px"
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
            sizes="(max-width: 640px) 192px, 256px"
            style={{ filter: COLOR_FILTERS[color], opacity }}
          />
        )}
      </div>
    </motion.div>
  )
}