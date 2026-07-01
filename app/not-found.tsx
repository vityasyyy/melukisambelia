'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Compass, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang dicari tidak ditemukan.',
}

const QUICK_LINKS = [
  { href: '/pariwisata', label: 'Pariwisata', desc: 'Destinasi wisata Sambelia', icon: MapPin },
  { href: '/peta', label: 'Peta', desc: 'Peta tematik interaktif', icon: Compass },
  { href: '/festival', label: 'Festival', desc: 'Festival Pesona Sambelia', icon: Sparkles },
]

export default function NotFound() {
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[calc(100dvh-63px)] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brown-950 via-wine to-terracotta-900" />
      <div aria-hidden className="absolute inset-0 section-watermark" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] max-w-[500px] opacity-[0.06]"
        initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <motion.div
          className="motif-glow"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { rotate: { duration: 80, repeat: Infinity, ease: 'linear' } }}
        >
          <Image
            src="/images/design-system/cincin_sambel.svg"
            alt=""
            width={500}
            height={500}
            className="w-full h-auto"
            style={{ filter: 'sepia(0.8) hue-rotate(-10deg) saturate(3)' }}
            loading="lazy"
          />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[5vw] top-[15vh] w-[12vw] max-w-[140px] opacity-[0.08]"
        initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }}
      >
        <motion.div
          animate={reduce ? undefined : { rotate: -360 }}
          transition={reduce ? undefined : { rotate: { duration: 50, repeat: Infinity, ease: 'linear' } }}
        >
          <Image
            src="/images/design-system/bunga_sambel.svg"
            alt=""
            width={160}
            height={160}
            className="w-full h-auto"
            style={{ filter: 'sepia(0.9) hue-rotate(-5deg) saturate(2.5)' }}
            loading="lazy"
          />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[6vw] bottom-[18vh] w-[10vw] max-w-[120px] opacity-[0.07]"
        initial={reduce ? undefined : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.07, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.7 }}
      >
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={reduce ? undefined : { rotate: { duration: 55, repeat: Infinity, ease: 'linear' } }}
        >
          <Image
            src="/images/design-system/bunga_sambel.svg"
            alt=""
            width={140}
            height={140}
            className="w-full h-auto"
            style={{ filter: 'sepia(0.7) hue-rotate(170deg) saturate(3)' }}
            loading="lazy"
          />
        </motion.div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(100% 70% at 50% 40%, rgba(244,232,208,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Image
            src="/images/design-system/bw_logo_sambel.svg"
            alt="Sambelia"
            width={140}
            height={42}
            className="brightness-0 invert opacity-90 mx-auto"
          />
        </motion.div>

        <motion.h1
          className="mt-8 font-beautique text-7xl sm:text-8xl text-white"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.p
          className="mt-3 text-lg text-white/85"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Kayaknya tersesat di Sambelia nih.
        </motion.p>
        <p className="mt-1 text-sm text-white/60">Halaman yang kamu cari tidak ditemukan.</p>

        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold-500/30 hover:-translate-y-0.5"
            >
              <Icon className="h-5 w-5 text-gold-soft transition-transform group-hover:scale-110" />
              <span className="font-beautique text-sm text-white">{label}</span>
              <span className="text-[10px] text-white/60">{desc}</span>
            </Link>
          ))}
        </motion.div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-brown-950 shadow-lg transition-all hover:bg-cream-warm hover:shadow-xl hover:scale-[1.02]"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}