'use client'

import Link from 'next/link'
import { StatCard } from '@/components/StatCard'
import { FadeIn } from '@/components/FadeIn'

import { petaLink } from '@/lib/links'
import { AirTanahChart } from './AirTanahChart'
import type { AirTanah } from '@/lib/schemas'
import type { AirTanahData } from '@/lib/air-tanah-data'

export function AirTanahClient({
  meta,
  data,
}: {
  meta: (AirTanah & { slug: string }) | null
  data: AirTanahData | null
}) {
  const credit = meta?.credit ?? ''

  return (
    <div className="relative mx-auto max-w-content overflow-hidden px-4 py-10">


      {data === null ? (
        <FadeIn>
          <div className="rounded-2xl border border-tan-700/12 bg-white p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
            <p className="text-ink/60">Data TMA dari cluster air tanah akan diunggah.</p>
            <Link
              href={petaLink({ tab: 'air' })}
              className="mt-3 inline-block text-sm font-medium text-water-900 hover:text-water-500"
            >
              Lihat peta air →
            </Link>
          </div>
        </FadeIn>
      ) : (
        <>
          <FadeIn>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="Lokasi" value={String(new Set(data.measurements.map((m) => m.location)).size)} />
              <StatCard label="Pengukuran" value={String(data.measurements.length)} />
              <StatCard label="Rata-rata TMA" value={data.measurements.length ? (data.measurements.reduce((s, m) => s + m.tmaMeters, 0) / data.measurements.length).toFixed(2) : '—'} unit="m" />
              <StatCard label="Rata-rata DHL" value={data.measurements.length ? (data.measurements.reduce((s, m) => s + m.dhlMsiemens, 0) / data.measurements.length).toFixed(1) : '—'} unit="mS" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-tan-700/12 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-tan-700/20 text-left text-xs uppercase tracking-widest text-ink/60">
                    <th className="py-3 pr-4">Lokasi</th>
                    <th className="py-3 pr-4">Tanggal</th>
                    <th className="py-3 pr-4 text-right">TMA (m)</th>
                    <th className="py-3 text-right">DHL (mS)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.measurements.map((m, i) => (
                    <tr key={i} className="border-b border-tan-700/10 last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-brown-900">{m.location}</td>
                      <td className="py-2.5 pr-4 text-ink/60">{m.date}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{m.tmaMeters}</td>
                      <td className="py-2.5 text-right tabular-nums">{m.dhlMsiemens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 rounded-2xl border border-tan-700/12 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <h2 className="mb-4 font-beautique text-lg text-brown-900">Grafik TMA per Lokasi</h2>
              <AirTanahChart measurements={data.measurements} />
            </div>
          </FadeIn>
        </>
      )}

      {credit && (
        <p className="mt-8 text-center text-xs text-ink/70">{credit}</p>
      )}

    </div>
  )
}