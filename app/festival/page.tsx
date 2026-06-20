import { getCollection } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'

export default function FestivalPage() {
  const events = getCollection('festival')
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="FESTIVAL" title="Festival Pesona Sambelia" intro="Peresean, Pawai Dulangan, Gendang Beleq — perayaan budaya Sasak." />
      {events.length === 0 ? (
        <EmptyState message="Jadwal festival akan diumumkan." />
      ) : (
        <FestivalTimeline events={events} />
      )}
    </div>
  )
}