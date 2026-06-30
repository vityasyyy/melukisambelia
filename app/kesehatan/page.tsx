import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { KesehatanListClient } from '@/components/KesehatanListClient'

export async function generateMetadata(): Promise<Metadata> {
  const kesehatan = getPageSettings('kesehatan')
  return {
    title: kesehatan.seoTitle ?? 'Kesehatan Sambelia',
    description: kesehatan.seoDescription ?? 'Fasilitas kesehatan, posyandu, puskesmas, bidan, dan program stunting di Kecamatan Sambelia.',
  }
}

export const revalidate = REVALIDATE_SECONDS

export default function KesehatanPage() {
  const items = getCollection('kesehatan')
  const ps = getPageSettings('kesehatan')
  const empty = getEmptyStates()
  const stats = {
    posyandu: items.filter((i) => i.type === 'Posyandu').length,
    puskesmas: items.filter((i) => i.type === 'Puskesmas').length,
    cadres: items.reduce((s, i) => s + i.cadresCount, 0),
    stunting: items.filter((i) => i.stuntingProgram).length,
  }
  return <KesehatanListClient items={items} stats={stats} pageSettings={ps} emptyMessage={empty.kesehatan} />
}