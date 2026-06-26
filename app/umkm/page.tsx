import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { UmkmCard } from '@/components/UmkmCard'
import { EmptyState } from '@/components/EmptyState'
import { MotifDivider } from '@/components/MotifDivider'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

export default function UmkmPage() {
  const items = getCollection('umkm')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <SectionHeader
          kicker="UMKM"
          title="UMKM Lokal Sambelia"
          intro="Kerajinan, kuliner, dan produk lokal."
          tone="terracotta"
        />
      </FadeIn>
      {items.length === 0 ? (
        <EmptyState message="Belum ada data UMKM. Tim akan menambahkan segera." />
      ) : (
        <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((u) => (
            <StaggerItem key={u.slug}>
              <UmkmCard item={u} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
      <MotifDivider className="mt-12" />
    </div>
  )
}
