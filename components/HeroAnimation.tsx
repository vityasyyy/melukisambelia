'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { GradientText } from './GradientText'

export function HeroAnimation({ src, tagline }: { src: string; tagline: string }) {
  const reduce = useReducedMotion()

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
      >
        <Image src={src} alt="Sambelia" fill className="object-cover object-[center_60%]" priority sizes="100vw" />
      </motion.div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 py-24">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-beautique text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] text-cream-light text-balance"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            <GradientText className="text-cream-light">Melukis</GradientText>{' '}
            <span className="text-cream-light">Sambelia</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-light/90 sm:text-lg md:text-xl">
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
