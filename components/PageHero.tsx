'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { GradientText } from '@/components/GradientText'
import { FadeIn } from '@/components/FadeIn'
import { cn } from '@/lib/utils'

type Tone = 'water' | 'terracotta' | 'green' | 'gold' | 'olive' | 'brown'

const GRADIENTS: Record<Tone, string> = {
  water: 'from-water-900 via-water-700 to-brown-900',
  terracotta: 'from-terracotta-900 via-terracotta-700 to-brown-900',
  green: 'from-green-900 via-olive to-brown-900',
  gold: 'from-gold-700 via-terracotta-700 to-brown-900',
  olive: 'from-olive via-olive-dark to-brown-900',
  brown: 'from-brown-900 via-brown-700 to-brown-950',
}

const BAND_CLASSES: Record<Tone, string> = {
  water: 'from-transparent via-water-500 to-transparent',
  terracotta: 'from-transparent via-terracotta-500 to-transparent',
  green: 'from-transparent via-green-500 to-transparent',
  gold: 'from-transparent via-gold-500 to-transparent',
  olive: 'from-transparent via-olive to-transparent',
  brown: 'from-transparent via-brown-700 to-transparent',
}

const RING_FILTERS: Record<Tone, string> = {
  water: 'sepia(0.5) hue-rotate(170deg) saturate(3)',
  terracotta: 'sepia(0.7) hue-rotate(-10deg) saturate(3)',
  green: 'sepia(0.7) hue-rotate(60deg) saturate(2.5)',
  gold: 'sepia(0.9) hue-rotate(-5deg) saturate(2.5)',
  olive: 'sepia(0.7) hue-rotate(60deg) saturate(2.5)',
  brown: 'sepia(0.9) saturate(2.5)',
}

export function PageHero({
  kicker,
  title,
  intro,
  tone = 'terracotta',
  className,
  headingId,
}: {
  kicker: string
  title: string
  intro?: string
  tone?: Tone
  className?: string
  headingId?: string
}) {
  return (
    <section
      className={cn(
        'relative -mt-[63px] overflow-hidden bg-gradient-to-br py-20 md:py-28 text-center text-white',
        GRADIENTS[tone],
        className
      )}
    >
      <div aria-hidden className="absolute inset-0 section-watermark" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 -80px 120px -30px rgba(26,17,13,0.6)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(244,232,208,0.18) 0%, transparent 70%)' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-[1] w-[30vw] max-w-[350px] motif-entrance"
      >
        <div className="motif-glow motif-rotate" style={{ animationDuration: '60s' }}>
          <Image
            src="/images/design-system/cincin_sambel.svg"
            alt=""
            width={500}
            height={500}
            className="w-full h-auto"
            style={{ filter: RING_FILTERS[tone], opacity: 0.38 }}
            loading="lazy"
          />
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[4vw] top-[18%] z-[1] w-[14vw] max-w-[160px] motif-entrance"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="motif-glow motif-rotate-reverse" style={{ animationDuration: '50s' }}>
          <div className="motif-float">
            <Image
              src="/images/design-system/bunga_sambel.svg"
              alt=""
              width={200}
              height={200}
              className="w-full h-auto"
              style={{ filter: RING_FILTERS[tone], opacity: 0.38 }}
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[6vw] bottom-[15%] z-[1] w-[11vw] max-w-[130px] motif-entrance"
        style={{ animationDelay: '0.7s' }}
      >
        <div className="motif-glow motif-rotate" style={{ animationDuration: '55s' }}>
          <div className="motif-float-slow">
            <Image
              src="/images/design-system/bunga_sambel.svg"
              alt=""
              width={160}
              height={160}
              className="w-full h-auto"
              style={{ filter: RING_FILTERS[tone], opacity: 0.35 }}
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      <div className={cn('absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r opacity-90 z-[2]', BAND_CLASSES[tone])} aria-hidden />
      <FadeIn className="relative z-10 mx-auto max-w-content px-4">
        <p className="font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{kicker}</p>
        <h1
          id={headingId}
          className="mt-2 font-beautique text-display-lg break-words"
          style={{ textShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.2)' }}
        >
          <GradientText className="text-white">{title}</GradientText>
        </h1>
        {intro && (
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{intro}</p>
        )}
      </FadeIn>
    </section>
  )
}