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

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-beautique text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] text-white text-balance"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.3)' }}
          >
            <GradientText>Melukis</GradientText>{' '}
            <span className="text-white">Sambelia</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {tagline}
          </motion.p>
          <motion.div variants={item} className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/peta"
              className="w-full rounded-full bg-water-900 px-7 py-3.5 font-medium text-white shadow-lg shadow-water-900/30 transition-all hover:bg-water-500 hover:shadow-water-900/40 sm:w-auto"
            >
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="w-full rounded-full border border-white/50 px-7 py-3.5 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/15 sm:w-auto"
            >
              Festival Pesona
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}