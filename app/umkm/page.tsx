import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'

export default function UmkmPage() {
  const items = getCollection('umkm')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="UMKM" title="UMKM Lokal Sambelia" intro="Kerajinan, kuliner, dan produk lokal." />
      {items.length === 0 ? (
        <EmptyState message="Belum ada data UMKM. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => <UmkmCard key={u.slug} item={u} />)}
        </div>
      )}
    </div>
  )
}