import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { IrigasiListClient } from '@/components/IrigasiListClient'

export const metadata: Metadata = {
  title: 'Data Irigasi Sambelia',
  description: 'Data saluran irigasi, kondisi saluran, dan peta titik rawan kekeringan di Kecamatan Sambelia.',
}

export default function IrigasiPage() {
  const items = getCollection('irigasi')
  const conditionCounts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.condition] = (acc[i.condition] ?? 0) + 1
    return acc
  }, {})
  const stats = {
    total: items.length,
    totalLength: items.reduce((sum, i) => sum + i.lengthM, 0),
    good: conditionCounts['Baik'] ?? 0,
    damaged: (conditionCounts['Rusak Ringan'] ?? 0) + (conditionCounts['Rusak Berat'] ?? 0),
  }
  return <IrigasiListClient items={items} stats={stats} />
}
