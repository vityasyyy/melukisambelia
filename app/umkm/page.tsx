import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { UmkmListClient } from '@/components/UmkmListClient'

export async function generateMetadata(): Promise<Metadata> {
  const umkm = getPageSettings('umkm')
  return {
    title: umkm.seoTitle ?? 'UMKM Lokal Sambelia',
    description: umkm.seoDescription ?? 'Produk kerajinan, kuliner, pertanian, dan UMKM lokal Kecamatan Sambelia, termasuk peyek mangrove.',
  }
}

export const revalidate = 60

export default function UmkmPage() {
  const items = getCollection('umkm')
  const ps = getPageSettings('umkm')
  const empty = getEmptyStates()
  return <UmkmListClient items={items} pageSettings={ps} emptyMessage={empty.umkm} />
}