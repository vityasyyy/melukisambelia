import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'
import { CountdownStrip } from '@/components/CountdownStrip'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Festival Pesona Sambelia',
  description: 'Jadwal dan informasi Festival Pesona Sambelia: Peresean, Pawai Dulangan, Gendang Beleq, dan warisan budaya Sasak lainnya.',
}

export const dynamic = 'force-dynamic'

export default function FestivalPage() {
  const events = getCollection('festival')
  const festivalData = events.map((f) => ({
    eventName: f.eventName,
    schedule: f.schedule,
    venue: f.venue,
    description: f.description,
    cover: f.cover,
    registrationUrl: f.registrationUrl,
    body: f.body,
  }))

  return (
    <>
      <PageHero kicker="FESTIVAL" title="Festival Pesona Sambelia" intro="Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia." tone="gold" />

      <section className="mx-auto max-w-content px-4 py-10">
        {events.length > 0 ? <CountdownStrip festivals={festivalData} /> : <EmptyState message="Jadwal festival akan segera diumumkan." />}
      </section>

      <section className="mx-auto max-w-content px-4 py-8">
        {events.length === 0 ? (
          <EmptyState message="Belum ada data festival." />
        ) : (
          <StaggerContainer stagger={0.1}>
            <StaggerItem>
              <FestivalTimeline events={events} />
            </StaggerItem>
          </StaggerContainer>
        )}
      </section>

    </>
  )
}
