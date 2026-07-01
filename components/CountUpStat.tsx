'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform, useReducedMotion } from 'framer-motion'

function parseNumber(str: string): number {
  const num = parseInt(str.replace(/[^\d]/g, ''), 10)
  return isNaN(num) ? 0 : num
}

function AnimatedNumber({ value, reducedMotion }: { value: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const spring = useSpring(reducedMotion ? value : 0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (v) => Math.round(v))

  useEffect(() => {
    if (inView || reducedMotion) spring.set(value)
  }, [inView, spring, value, reducedMotion])

  if (reducedMotion) {
    return <span ref={ref}>{value}</span>
  }

  return <motion.span ref={ref}>{display}</motion.span>
}

export function CountUpStat({ label, value }: { label: string; value: string }) {
  const numValue = parseNumber(value)
  const suffix = value.replace(/[\d,.±\s]/g, '').trim()
  const prefix = value.startsWith('±') ? '±' : ''
  const reducedMotion = useReducedMotion()

  return (
    <div className="h-full flex flex-col min-w-0 rounded-2xl border border-tan-700/20 bg-cream-beige/60 p-4 sm:p-6 text-center shadow-terracotta transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(240,172,109,0.15)]">
      <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
        {prefix}<AnimatedNumber value={numValue} reducedMotion={reducedMotion ?? false} />{suffix && <span className="ml-1 text-sm font-beautique-condensed text-ink/70">{suffix}</span>}
      </div>
      <div className="mx-auto mt-2 h-0.5 w-10 bg-gold-500 rounded-full" />
      <div className="mt-2 font-beautique-condensed text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/70">{label}</div>
    </div>
  )
}