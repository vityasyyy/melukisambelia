'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform, useReducedMotion } from 'framer-motion'

function parseNumber(str: string): number {
  const num = parseInt(str.replace(/[^\d]/g, ''), 10)
  return isNaN(num) ? 0 : num
}

function hasDigits(str: string): boolean {
  return /\d/.test(str)
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
  const reducedMotion = useReducedMotion()

  if (!hasDigits(value)) {
    return (
      <div className="glass-card glass-accent-top group relative h-full flex flex-col min-w-0 p-5 sm:p-6 text-center" style={{ '--accent-color': '#F0AC6D' } as React.CSSProperties}>
        <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
          {value}
        </div>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-700" />
        <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{label}</div>
      </div>
    )
  }

  const numValue = parseNumber(value)
  const suffix = value.replace(/[\d,.±\s]/g, '').trim()
  const prefix = value.startsWith('±') ? '±' : ''

  return (
    <div className="glass-card glass-accent-top group relative h-full flex flex-col min-w-0 p-5 sm:p-6 text-center" style={{ '--accent-color': '#F0AC6D' } as React.CSSProperties}>
      <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
        {prefix}<AnimatedNumber value={numValue} reducedMotion={reducedMotion ?? false} />{suffix && <span className="ml-1 text-sm font-beautique-condensed text-ink/60">{suffix}</span>}
      </div>
      <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-700" />
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{label}</div>
    </div>
  )
}