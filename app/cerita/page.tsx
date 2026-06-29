import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

export async function generateMetadata(): Promise<Metadata> {
  const cerita = getPageSettings('cerita')
  return {
    title: cerita.seoTitle ?? 'Cerita dari Sambelia',
    description: cerita.seoDescription ?? 'Catatan lapangan, refleksi, dan kisah tim KKN-PPM UGM Melukis Sambelia dari Desa Sugian dan Labuhan Pandan.',
  }
}

export const dynamic = 'force-dynamic'

export default function CeritaPage() {
  const items = getCollection('cerita')
  const ps = getPageSettings('cerita')
  const empty = getEmptyStates()
  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'CERITA'}
        title={ps.heroTitle ?? 'Cerita dari Sambelia'}
        intro={ps.heroIntro ?? 'Catatan lapangan, refleksi, dan kisah tim Melukis Sambelia.'}
        tone="brown"
      />
      <div className="mx-auto max-w-content px-4 py-16">
        <FadeIn>
          <SectionHeader
            kicker={ps.heroKicker ?? 'CERITA'}
            title={ps.heroTitle ?? 'Cerita dari Sambelia'}
            intro="Catatan lapangan tim Melukis Sambelia."
            tone="brown"
          />
        </FadeIn>
        {items.length === 0 ? (
          <EmptyState message={empty.cerita} />
        ) : (
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <StaggerItem key={c.slug}>
                <DataCard
                  href={`/cerita/${c.slug}`}
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