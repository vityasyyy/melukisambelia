import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'

export default function PariwisataPage() {
  const items = getCollection('pariwisata')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="PARIWISATA"
        title="Potensi Wisata Sambelia"
        intro="Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan."
        tone="water"
      />
      {items.length === 0 ? (
        <EmptyState message="Belum ada data wisata. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <DataCard
              key={p.slug}
              href={`/pariwisata/${p.slug}`}
              image={p.cover}
              title={p.title}
              chips={[
                { label: p.category, color: '#14A8E1' },
                { label: p.village, color: '#99BA57' },
              ]}
              desc={p.shortDesc}
            />
          ))}
        </div>
      )}
      <MotifDivider className="mt-12" />
    </div>
  )
}
