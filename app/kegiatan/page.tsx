import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'

import { PageHero } from '@/components/PageHero'
import { MotifFloater } from '@/components/MotifFloater'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

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
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="gold" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="olive" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-right" color="terracotta" size="sm" opacity={0.8} />

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
            <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => (
                <StaggerItem key={c.slug} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : undefined}>
                  <DataCard
                    href={`/kegiatan/${c.slug}`}
                    image={c.cover}
                    title={c.title}
                    chips={[
                      { label: c.author, tone: 'brown' },
                      { label: c.date, tone: 'gold' },
                    ]}
                    desc={c.excerpt}
                    featured={i === 0}
                    accent="#5A3A28"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  )
}