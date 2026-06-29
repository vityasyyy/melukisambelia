import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'

import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifFloater } from '@/components/MotifFloater'

import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

export async function generateMetadata(): Promise<Metadata> {
  const kegiatan = getPageSettings('kegiatan')
  return {
    title: kegiatan.seoTitle ?? 'Kegiatan Sambelia',
    description: kegiatan.seoDescription ?? 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.',
  }
}

export const revalidate = 60

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
      <div className="relative mx-auto max-w-content overflow-hidden px-4 py-16">
        <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="brown" />
        <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="olive" />

        {items.length === 0 ? (
          <EmptyState message={empty.kegiatan} />
        ) : (
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <StaggerItem key={c.slug}>
                <DataCard
                  href={`/kegiatan/${c.slug}`}
                  image={c.cover}
                  title={c.title}
                  chips={[
                    { label: c.author, color: '#742D1B' },
                    { label: c.date, color: '#AF7E4F' },
                  ]}
                  desc={c.excerpt}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

      </div>
    </>
  )
}