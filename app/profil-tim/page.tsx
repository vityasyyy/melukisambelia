import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { MemberCard } from '@/components/MemberCard'

export default function ProfilTimPage() {
  const members = getCollection('tim')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="PROFIL TIM" title="Tim Melukis Sambelia" intro="Mahasiswa Universitas Gadjah Mada periode 2026." tone="water" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => <MemberCard key={m.slug} member={m} />)}
      </div>
    </div>
  )
}