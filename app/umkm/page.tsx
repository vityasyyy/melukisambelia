import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { UmkmListClient } from '@/components/UmkmListClient'

export const metadata: Metadata = {
  title: 'UMKM Lokal Sambelia',
  description: 'Produk kerajinan, kuliner, pertanian, dan UMKM lokal Kecamatan Sambelia, termasuk peyek mangrove.',
}

export default function UmkmPage() {
  const items = getCollection('umkm')
  return <UmkmListClient items={items} />
}
