'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Festival } from '@/lib/schemas'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function getNextEvent(festivals: Festival[]) {
  const now = new Date().getTime()
  const future = festivals
    .map((f) => ({ f, time: new Date(f.schedule).getTime() }))
    .filter((x) => !isNaN(x.time) && x.time > now)
    .sort((a, b) => a.time - b.time)[0]
  return future ?? null
}

export function CountdownStrip({ festivals }: { festivals: Festival[] }) {
  const reduce = useReducedMotion()
  const next = useMemo(() => getNextEvent(festivals), [festivals])
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!next) return
    const tick = () => {
      const diff = next.time - Date.now()
      if (diff <= 0) {
        setLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [next])

  if (!next) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-terracotta-700 via-gold-bright to-water-700 p-1 shadow-[0_8px_24px_-8px_rgba(227,121,92,0.3)]">
        <div className="rounded-xl bg-page px-6 py-5 text-center">
          <p className="font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">
            Festival Pesona Sambelia 2026
          </p>
          <p className="mt-3 font-beautique text-2xl text-brown-900">Segera diumumkan</p>
          <p className="mt-2 text-sm text-ink/70">Jadwal festival segera diumumkan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-terracotta-700 via-gold-bright to-water-700 p-1 shadow-[0_8px_24px_-8px_rgba(227,121,92,0.3)]">
      <div className="rounded-xl bg-page px-6 py-5 text-center">
        <p className="font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Menuju {next.f.eventName}</p>
        <div className="mt-3 flex items-center justify-center gap-3 sm:gap-6">
          {[
            { label: 'Hari', value: left.days },
            { label: 'Jam', value: left.hours },
            { label: 'Menit', value: left.minutes },
            { label: 'Detik', value: left.seconds },
          ].map((u) => (
            <div key={u.label} className="text-center">
              <motion.div
                className="font-beautique text-3xl sm:text-4xl text-brown-900"
                animate={reduce ? undefined : { scale: [1, 1.02, 1] }}
                transition={reduce ? undefined : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                {pad(u.value)}
              </motion.div>
              <div className="font-beautique-condensed text-[10px] uppercase tracking-[0.15em] text-ink/70">{u.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink/70 break-words">{next.f.venue} · {next.f.schedule}</p>
      </div>
    </div>
  )
}