'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

function parseNumber(str: string): number {
  const num = parseInt(str.replace(/[^\d]/g, ''), 10)
  return isNaN(num) ? 0 : num
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (v) => Math.round(v))

  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, spring, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

export function CountUpStat({ label, value }: { label: string; value: string }) {
  const numValue = parseNumber(value)
  const suffix = value.replace(/[\d,.±\s]/g, '').trim()
  const prefix = value.startsWith('±') ? '±' : ''

  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/60 p-6 text-center shadow-terracotta transition-transform hover:-translate-y-1 hover:shadow-terracotta-hover">
      <div className="font-beautique text-3xl md:text-4xl text-water-900">
        {prefix}<AnimatedNumber value={numValue} />{suffix && <span className="text-sm text-ink/70 ml-1">{suffix}</span>}
      </div>
      <div className="mx-auto mt-2 h-0.5 w-10 bg-gold-500 rounded-full" />
      <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink/70">{label}</div>
    </div>
  )
}