'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
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
        style={{ y: heroY }}
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

      {/* Warm duotone grade overlays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(43,28,21,0.45) 0%, rgba(120,52,40,0.18) 38%, rgba(43,28,21,0.20) 70%, rgba(26,17,13,0.78) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 30%, rgba(244,232,208,0.35) 0%, rgba(232,168,109,0.12) 40%, transparent 75%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: "url('/images/design-system/batik_sambel.svg')",
          backgroundSize: '1200px auto',
          backgroundPosition: 'center',
          opacity: 0.04,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ boxShadow: 'inset 0 -120px 160px -40px rgba(26,17,13,0.9), inset 0 0 220px 10px rgba(26,17,13,0.45)' }}
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-beautique text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] text-cream-light text-balance"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)' }}
          >
            <GradientText className="text-cream-light">Melukis</GradientText>{' '}
            <span className="text-cream-light">Sambelia</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-light/90 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {tagline}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/peta"
              className="w-full rounded-full bg-water-900 px-7 py-3.5 font-medium text-page shadow-lg transition-all hover:bg-water-500 hover:shadow-water-900/30 sm:w-auto"
            >
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="w-full rounded-full border border-cream-light/60 px-7 py-3.5 font-medium text-cream-light backdrop-blur-sm transition-all hover:bg-cream-light/10 sm:w-auto"
            >
              Festival Pesona
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}