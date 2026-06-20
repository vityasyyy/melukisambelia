import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { EmptyState } from '@/components/EmptyState'
import { DataCard } from '@/components/DataCard'

export default function KesehatanPage() {
  const items = getCollection('kesehatan')
  const posyandu = items.filter((i) => i.type === 'Posyandu').length
  const puskesmas = items.filter((i) => i.type === 'Puskesmas').length
  const cadres = items.reduce((s, i) => s + i.cadresCount, 0)
  const stunting = items.filter((i) => i.stuntingProgram).length

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="KESEHATAN" title="Fasilitas & Program Kesehatan" intro="Posyandu, puskesmas, dan program stunting di Sambelia." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Posyandu" value={String(posyandu)} />
        <StatCard label="Puskesmas" value={String(puskesmas)} />
        <StatCard label="Kader" value={String(cadres)} />
        <StatCard label="Program Stunting" value={String(stunting)} />
      </div>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data kesehatan. Tim akan menambahkan segera." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((k) => (
            <DataCard
              key={k.slug}
              href="/kesehatan"
              image={k.cover}
              title={k.facilityName}
              chips={[{ label: k.type, color: '#667F37' }, { label: k.village, color: '#99BA57' }, ...(k.stuntingProgram ? [{ label: 'Stunting', color: '#E3795C' }] : [])]}
              desc={`Kader: ${k.cadresCount}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}