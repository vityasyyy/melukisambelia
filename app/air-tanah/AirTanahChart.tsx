'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { TmaMeasurement } from '@/lib/air-tanah-data'

export function AirTanahChart({ measurements }: { measurements: TmaMeasurement[] }) {
  const data = measurements.map((m) => ({
    name: m.location,
    tma: m.tmaMeters,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit=" m" />
        <Tooltip
          formatter={(value) => [`${value} m`, 'TMA']}
          contentStyle={{ borderRadius: 8, fontSize: 13 }}
        />
        <Bar dataKey="tma" fill="#14A8E1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}