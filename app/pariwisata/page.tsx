import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { PariwisataListClient } from '@/components/PariwisataListClient'

export async function generateMetadata(): Promise<Metadata> {
  const pariwisata = getPageSettings('pariwisata')
  return {
    title: pariwisata.seoTitle ?? 'Pariwisata Sambelia',
    description: pariwisata.seoDescription ?? 'Destinasi wisata unggulan di Desa Sugian dan Desa Labuhan Pandan, Kecamatan Sambelia, Lombok Timur.',
  }
}

export const revalidate = REVALIDATE_SECONDS

export default function PariwisataPage() {
  const items = getCollection('pariwisata')
  const ps = getPageSettings('pariwisata')
  const empty = getEmptyStates()
  return <PariwisataListClient items={items} pageSettings={ps} emptyMessage={empty.pariwisata} />
}