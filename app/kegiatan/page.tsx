import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { KegiatanRoadmap } from '@/components/KegiatanRoadmap'
import { EmptyState } from '@/components/EmptyState'

export default function KegiatanPage() {
  const items = getCollection('kegiatan')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="KEGIATAN" title="Program Unggulan" intro="Roadmap program pemberdayaan Melukis Sambelia." tone="brown" />
      {items.length === 0 ? (
        <EmptyState message="Belum ada program. Tim akan menambahkan segera." />
      ) : (
        <KegiatanRoadmap items={items} />
      )}
    </div>
  )
}