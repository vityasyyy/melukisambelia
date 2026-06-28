'use client'

import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import type { Pariwisata } from '@/lib/schemas'

export function PariwisataListClient({ items }: { items: (Pariwisata & { slug: string })[] }) {
  return (
    <>
      <PageHero
        kicker="PARIWISATA"
        title="Potensi Wisata Sambelia"
        intro="Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan."
        tone="water"
      />
      <div className="mx-auto max-w-content px-4 py-16">
        <FadeIn>
          <SectionHeader
            kicker="PARIWISATA"
            title="Potensi Wisata Sambelia"
            intro="Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan."
            tone="water"
          />
        </FadeIn>
        {items.length === 0 ? (
          <EmptyState message="Belum ada data wisata. Tim akan menambahkan segera." />
        ) : (
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <StaggerItem key={p.slug}>
                <DataCard
                  href={`/pariwisata/${p.slug}`}
                  image={p.cover}
                  title={p.title}
                  chips={[
                    { label: p.category, color: '#14A8E1' },
                    { label: p.village, color: '#99BA57' },
                  ]}
                  desc={p.shortDesc}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </>
  )
}
