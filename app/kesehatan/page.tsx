import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { KesehatanListClient } from '@/components/KesehatanListClient'

export const metadata: Metadata = {
  title: 'Kesehatan Sambelia',
  description: 'Fasilitas kesehatan, posyandu, puskesmas, bidan, dan program stunting di Kecamatan Sambelia.',
}

export default function KesehatanPage() {
  const items = getCollection('kesehatan')
  const stats = {
    posyandu: items.filter((i) => i.type === 'Posyandu').length,
    puskesmas: items.filter((i) => i.type === 'Puskesmas').length,
    cadres: items.reduce((s, i) => s + i.cadresCount, 0),
    stunting: items.filter((i) => i.stuntingProgram).length,
  }
  return <KesehatanListClient items={items} stats={stats} />
}
