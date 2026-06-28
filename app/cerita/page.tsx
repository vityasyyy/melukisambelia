import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

export const metadata: Metadata = {
  title: 'Cerita dari Sambelia',
  description: 'Catatan lapangan, refleksi, dan kisah tim KKN-PPM UGM Melukis Sambelia dari Desa Sugian dan Labuhan Pandan.',
}

export const dynamic = 'force-dynamic'

export default function CeritaPage() {
  const items = getCollection('cerita')
  return (
    <>
      <PageHero
        kicker="CERITA"
        title="Cerita dari Sambelia"
        intro="Catatan lapangan, refleksi, dan kisah tim Melukis Sambelia."
        tone="brown"
      />
      <div className="mx-auto max-w-content px-4 py-16">
        <FadeIn>
          <SectionHeader
            kicker="CERITA"
            title="Cerita dari Sambelia"
            intro="Catatan lapangan tim Melukis Sambelia."
            tone="brown"
          />
        </FadeIn>
        {items.length === 0 ? (
          <EmptyState message="Belum ada cerita. Tim akan menulis segera." />
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
