'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'

type MotifConfig = {
  src: string
  alt: string
  width: number
  height: number
  className: string
  filter: string
  opacity: number
  rotateDuration: number
  rotateDir: number
  floatDuration?: number
  floatRange?: number
  delay: number
}

const RINGS: MotifConfig[] = [
  {
    src: '/images/design-system/cincin_sambel.svg',
    alt: '',
    width: 500,
    height: 500,
    className: 'absolute right-0 top-1/2 -translate-y-1/2 z-[2] w-[35vw] max-w-[500px]',
    filter: 'sepia(0.8) hue-rotate(-15deg) saturate(3)',
    opacity: 0.14,
    rotateDuration: 60,
    rotateDir: 1,
    delay: 0,
  },
  {
    src: '/images/design-system/cincin_sambel.svg',
    alt: '',
    width: 400,
    height: 400,
    className: 'absolute left-[-8vw] bottom-[5vh] z-[1] w-[28vw] max-w-[400px]',
    filter: 'sepia(0.6) hue-rotate(170deg) saturate(3)',
    opacity: 0.08,
    rotateDuration: 90,
    rotateDir: -1,
    delay: 0.5,
  },
  {
    src: '/images/design-system/cincin_sambel.svg',
    alt: '',
    width: 300,
    height: 300,
    className: 'absolute right-[10vw] top-[8vh] z-[1] w-[20vw] max-w-[300px]',
    filter: 'sepia(0.7) hue-rotate(60deg) saturate(2.5)',
    opacity: 0.06,
    rotateDuration: 75,
    rotateDir: 1,
    delay: 1,
  },
]

const FLOWERS: MotifConfig[] = [
  {
    src: '/images/design-system/bunga_sambel.svg',
    alt: '',
    width: 180,
    height: 180,
    className: 'absolute left-[8vw] top-[20vh] z-[2] w-[14vw] max-w-[180px]',
    filter: 'sepia(0.9) hue-rotate(-5deg) saturate(2.5)',
    opacity: 0.12,
    rotateDuration: 50,
    rotateDir: 1,
    floatDuration: 6,
    floatRange: 16,
    delay: 0.3,
  },
  {
    src: '/images/design-system/bunga_sambel.svg',
    alt: '',
    width: 140,
    height: 140,
    className: 'absolute right-[15vw] bottom-[18vh] z-[2] w-[11vw] max-w-[140px]',
    filter: 'sepia(0.7) hue-rotate(170deg) saturate(3)',
    opacity: 0.10,
    rotateDuration: 55,
    rotateDir: -1,
    floatDuration: 7,
    floatRange: 20,
    delay: 0.8,
  },
  {
    src: '/images/design-system/bunga_sambel.svg',
    alt: '',
    width: 120,
    height: 120,
    className: 'absolute left-[20vw] bottom-[12vh] z-[1] w-[9vw] max-w-[120px]',
    filter: 'sepia(0.8) hue-rotate(60deg) saturate(2.5)',
    opacity: 0.08,
    rotateDuration: 45,
    rotateDir: 1,
    floatDuration: 5,
    floatRange: 14,
    delay: 1.2,
  },
  {
    src: '/images/design-system/bunga_sambel.svg',
    alt: '',
    width: 100,
    height: 100,
    className: 'absolute right-[6vw] top-[25vh] z-[1] w-[8vw] max-w-[100px]',
    filter: 'sepia(0.9) saturate(2.5)',
    opacity: 0.07,
    rotateDuration: 40,
    rotateDir: -1,
    floatDuration: 8,
    floatRange: 18,
    delay: 1.5,
  },
  {
    src: '/images/design-system/bunga_sambel.svg',
    alt: '',
    width: 90,
    height: 90,
    className: 'absolute left-[40vw] top-[15vh] z-[1] w-[7vw] max-w-[90px]',
    filter: 'sepia(0.7) hue-rotate(-10deg) saturate(3)',
    opacity: 0.06,
    rotateDuration: 48,
    rotateDir: 1,
    floatDuration: 6.5,
    floatRange: 12,
    delay: 1.8,
  },
]

function Motif({ config, reduce }: { config: MotifConfig; reduce: boolean | null }) {
  return (
    <motion.div
      aria-hidden
      className={config.className}
      initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
      animate={reduce ? { opacity: config.opacity } : { opacity: config.opacity, scale: 1 }}
      transition={{ duration: 2, ease: 'easeOut', delay: config.delay }}
    >
      <motion.div
        className="relative w-full h-full motif-glow"
        animate={reduce ? undefined : { rotate: 360 * config.rotateDir }}
        transition={reduce ? undefined : { rotate: { duration: config.rotateDuration, repeat: Infinity, ease: 'linear' } }}
      >
        {config.floatDuration && !reduce && (
          <motion.div
            className="relative w-full h-full"
            animate={{ y: [0, -(config.floatRange ?? 16), 0] }}
            transition={{ duration: config.floatDuration, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src={config.src}
              alt={config.alt}
              width={config.width}
              height={config.height}
              className="w-full h-auto"
              style={{ filter: config.filter }}
              loading="lazy"
            />
          </motion.div>
        )}
        {(!config.floatDuration || reduce) && (
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            className="w-full h-auto"
            style={{ filter: config.filter }}
            loading="lazy"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

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
  const heroOpacity = useTransform(scrollY, [0, 400], reduce ? [1, 1] : [1, 0.3])
  const heroScale = useTransform(scrollY, [0, 600], reduce ? [1, 1] : [1, 1.08])

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
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity, willChange: 'transform,opacity' }}
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

      {RINGS.map((r, i) => (
        <Motif key={`ring-${i}`} config={r} reduce={reduce} />
      ))}
      {FLOWERS.map((f, i) => (
        <Motif key={`flower-${i}`} config={f} reduce={reduce} />
      ))}

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
          <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {tagline}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/peta"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-water-900 to-water-700 px-7 py-3.5 text-base font-semibold text-white shadow-[0_6px_24px_rgba(8,115,185,0.4)] transition-all hover:shadow-[0_8px_32px_rgba(8,115,185,0.5)] hover:scale-[1.02]"
            >
              <MapPin className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/50 bg-white/10 px-7 py-3.5 text-base font-medium text-gold-soft backdrop-blur-sm transition-all hover:border-gold-500/70 hover:bg-white/15 hover:text-gold-bright sm:w-auto"
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