import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { MitraGrid } from '@/components/MitraGrid'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'

export default function MitraPage() {
  const items = getCollection('mitra')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <SectionHeader
          kicker="MITRA"
          title="Mitra Kami"
          intro="Mitra program Melukis Sambelia."
          tone="brown"
        />
      </FadeIn>
      {items.length === 0 ? <EmptyState message="Belum ada mitra." /> : <MitraGrid items={items} />}
    </div>
  )
}
