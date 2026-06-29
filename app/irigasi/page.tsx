import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { IrigasiListClient } from '@/components/IrigasiListClient'

export async function generateMetadata(): Promise<Metadata> {
  const irigasi = getPageSettings('irigasi')
  return {
    title: irigasi.seoTitle ?? 'Data Irigasi Sambelia',
    description: irigasi.seoDescription ?? 'Data saluran irigasi, kondisi saluran, dan peta titik rawan kekeringan di Kecamatan Sambelia.',
  }
}

export const revalidate = 60

export default function IrigasiPage() {
  const items = getCollection('irigasi')
  const ps = getPageSettings('irigasi')
  const empty = getEmptyStates()
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
  return <IrigasiListClient items={items} stats={stats} pageSettings={ps} emptyMessage={empty.irigasi} />
}