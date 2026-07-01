'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { GradientText } from './GradientText'

export function HeroAnimation({
  src,
  tagline,
}: {
  src?: string
  tagline: string
}) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, 150])

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.2 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
  }

  return (
    <>
      <motion.div
        initial={reduce ? undefined : { scale: 1.03, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0"
        style={{ y: heroY, willChange: 'transform' }}
      >
        <Image
          src={src ?? '/images/content/personstanding.webp'}
          alt="Pemandangan Kecamatan Sambelia"
          fill
          className="object-cover object-[center_60%]"
          priority
          sizes="100vw"
        />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,8,5,0.62) 0%, rgba(80,32,18,0.22) 35%, rgba(30,18,12,0.18) 65%, rgba(15,8,5,0.88) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(110% 80% at 50% 35%, rgba(244,232,208,0.28) 0%, rgba(232,168,109,0.08) 45%, transparent 80%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ boxShadow: 'inset 0 -100px 140px -30px rgba(15,8,5,0.95)' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-[2] w-[45vw] max-w-[500px] opacity-[0.08]"
        initial={reduce ? undefined : { opacity: 0, x: 100 }}
        animate={{ opacity: 0.08, x: 0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <Image
          src="/images/design-system/cincin_sambel.svg"
          alt=""
          width={500}
          height={500}
          className="w-full h-auto"
          style={{ filter: 'sepia(0.6) hue-rotate(-10deg) saturate(2.5)' }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center opacity-[0.03]"
        initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <Image
          src="/images/design-system/cincin_sambel.svg"
          alt=""
          width={600}
          height={600}
          className="h-[50vh] w-auto"
          style={{ filter: 'sepia(0.9) hue-rotate(-5deg) saturate(2)' }}
        />
      </motion.div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-beautique text-[clamp(2.25rem,8vw,6.5rem)] leading-[0.95] text-white text-balance"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.3)' }}
          >
            <GradientText>Melukis</GradientText>{' '}
            <span className="text-white">Sambelia</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {tagline}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/peta"
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-water-900 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-water-900/30 transition-all hover:bg-water-500 hover:shadow-water-900/50 hover:scale-[1.02] sm:w-auto"
            >
              <MapPin className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-base font-medium text-white/90 backdrop-blur-sm transition-all hover:border-gold-500/50 hover:bg-white/15 hover:text-gold-soft sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Festival Pesona
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden className="relative z-10 mt-auto flex w-full justify-center pb-2">
        <div className="h-8 w-[240px] opacity-[0.08] sm:w-[380px] md:w-[520px] batik-strip shimmer-slow" />
      </div>
    </>
  )
}