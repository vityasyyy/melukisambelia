import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { PariwisataListClient } from '@/components/PariwisataListClient'

export const metadata: Metadata = {
  title: 'Pariwisata Sambelia',
  description: 'Destinasi wisata unggulan di Desa Sugian dan Desa Labuhan Pandan, Kecamatan Sambelia, Lombok Timur.',
}

export const dynamic = 'force-dynamic'

export default function PariwisataPage() {
  const items = getCollection('pariwisata')
  return <PariwisataListClient items={items} />
}
