import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { DataCard } from '@/components/DataCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'

export default function CeritaPage() {
  const items = getCollection('cerita')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="CERITA"
        title="Cerita dari Sambelia"
        intro="Catatan lapangan tim Melukis Sambelia."
        tone="brown"
      />
      {items.length === 0 ? (
        <EmptyState message="Belum ada cerita. Tim akan menulis segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <DataCard
              key={c.slug}
              href={`/cerita/${c.slug}`}
              image={c.cover}
              title={c.title}
              chips={[
                { label: c.author, color: '#742D1B' },
                { label: c.date, color: '#AF7E4F' },
              ]}
              desc={c.excerpt}
            />
          ))}
        </div>
      )}
      <MotifDivider className="mt-12" />
    </div>
  )
}
