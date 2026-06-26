import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { KegiatanListClient } from '@/components/KegiatanListClient'

export const metadata: Metadata = {
  title: 'Program Unggulan',
  description: 'Roadmap kegiatan pemberdayaan Melukis Sambelia: ekowisata mangrove, desa wisata, program stunting, irigasi, dan ekonomi lokal.',
}

export default function KegiatanPage() {
  const items = getCollection('kegiatan')
  return <KegiatanListClient items={items} />
}
