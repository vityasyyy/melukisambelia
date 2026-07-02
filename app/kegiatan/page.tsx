import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { EmptyState } from '@/components/EmptyState'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { KegiatanCardGrid } from '@/components/KegiatanCardGrid'
import { PageHero } from '@/components/PageHero'
import { MotifFloater } from '@/components/MotifFloater'

export async function generateMetadata(): Promise<Metadata> {
  const kegiatan = getPageSettings('kegiatan')
  return {
    title: kegiatan.seoTitle ?? 'Kegiatan Sambelia',
    description: kegiatan.seoDescription ?? 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.',
  }
}

export const revalidate = REVALIDATE_SECONDS

export default function KegiatanPage() {
  const items = getCollection('kegiatan')
  const ps = getPageSettings('kegiatan')
  const empty = getEmptyStates()
  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'KEGIATAN'}
        title={ps.heroTitle ?? 'Kegiatan Sambelia'}
        intro={ps.heroIntro ?? 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.'}
        tone="brown"
      />

      <section className="relative bg-cream-beige/50">
        <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="terracotta" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="gold" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-right" color="terracotta" size="sm" opacity={0.8} />
          <MotifFloater motif="bunga_sambel" position="top-right" color="gold" size="md" opacity={0.7} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" color="terracotta" size="md" opacity={0.7} />

          <FadeIn>
            <SectionHeader
              kicker={ps.sectionKicker ?? 'KEGIATAN'}
              title={ps.sectionTitle ?? 'Kegiatan Sambelia'}
              intro={ps.sectionIntro ?? 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.'}
              tone="brown"
            />
          </FadeIn>

          {items.length === 0 ? (
            <EmptyState message={empty.kegiatan} />
          ) : (
            <KegiatanCardGrid items={items} />
          )}
        </div>
      </section>
    </>
  )
}