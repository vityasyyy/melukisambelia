'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'

export function HeroAnimation({
  src,
  tagline,
}: {
  src?: string
  tagline: string
}) {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: reduce ? 0 : 0.15 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  }

  return (
    <>
      <motion.div
        initial={reduce ? undefined : { scale: 1.01, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0"
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

      <div
        aria-hidden
        className="pointer-events-none absolute left-[4vw] top-[18vh] sm:top-[20vh] z-[2] w-[22vw] sm:w-[14vw] max-w-[180px] motif-entrance"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="motif-glow motif-rotate-reverse" style={{ animationDuration: '50s' }}>
          <div className="motif-float">
            <Image
              src="/images/design-system/bunga_sambel.svg"
              alt=""
              width={180}
              height={180}
              className="w-full h-auto"
              style={{ filter: 'sepia(0.9) hue-rotate(-5deg) saturate(2.5)', opacity: 0.38 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-[6vw] bottom-[15vh] sm:bottom-[18vh] z-[2] w-[18vw] sm:w-[11vw] max-w-[140px] motif-entrance"
        style={{ animationDelay: '0.7s' }}
      >
        <div className="motif-glow motif-rotate" style={{ animationDuration: '55s' }}>
          <div className="motif-float-slow">
            <Image
              src="/images/design-system/bunga_sambel.svg"
              alt=""
              width={140}
              height={140}
              className="w-full h-auto"
              style={{ filter: 'sepia(0.7) hue-rotate(170deg) saturate(3)', opacity: 0.35 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-4 sm:px-6">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-beautique text-[clamp(2.25rem,8vw,6.5rem)] leading-[0.95] text-white text-balance"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.3)' }}
          >
            <span className="text-white">Melukis</span>{' '}
            <span className="text-gradient-festival">Sambelia</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {tagline}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/peta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brown-950 shadow-lg transition-all hover:bg-cream-warm hover:shadow-xl hover:scale-[1.02] min-h-[48px]"
            >
              <MapPin className="h-4 w-4" />
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-base font-medium text-white transition-all hover:bg-white/20 hover:border-white/60 min-h-[48px]"
            >
              <Sparkles className="h-4 w-4" />
              Festival Pesona
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-water-900 via-gold-bright to-terracotta-500 opacity-90" />

      <a
        href="#tentang"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-white/70 transition-colors hover:text-white"
        aria-label="Gulir untuk menjelajah"
      >
        <span className="font-beautique-condensed text-[10px] font-semibold uppercase tracking-[0.2em]">Gulir untuk menjelajah</span>
        <svg className="mt-1 h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </>
  )
}