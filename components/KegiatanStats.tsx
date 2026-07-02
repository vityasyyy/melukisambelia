import Link from 'next/link'
import { getCollection } from '@/lib/content'
import { getSettings } from '@/lib/settings'
import { FadeIn } from './FadeIn'
import { SectionHeader } from './SectionHeader'
import { KegiatanCardGrid } from './KegiatanCardGrid'


export function KegiatanStats() {
  const kegiatan = getCollection('kegiatan').slice(0, 3)
  const empty = getSettings().emptyStates

  return (
    <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
      <FadeIn>
        <SectionHeader kicker="06 — KEGIATAN" title="Kegiatan Sambelia" tone="gold" />
      </FadeIn>
      {kegiatan.length > 0 ? (
        <div className="mt-6">
          <KegiatanCardGrid items={kegiatan} />
        </div>
      ) : (
        <p className="mt-6 text-center text-ink/70">{empty.kegiatan}</p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/kegiatan" className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-brown-950/20 bg-brown-950/5 px-5 py-2.5 text-sm font-beautique text-brown-900 transition-all hover:bg-brown-950/10 hover:border-brown-950/30 hover:scale-[1.02]">
          Lihat semua kegiatan →
        </Link>
        <Link href="/tentang-sambelia" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-5 py-2.5 text-sm font-beautique text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02] min-h-[44px]">
          Tentang Sambelia →
        </Link>
      </div>
    </div>
  )
}