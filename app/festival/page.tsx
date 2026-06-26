import { getCollection } from '@/lib/content'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'
import { SectionHeader } from '@/components/SectionHeader'
import { CountdownStrip } from '@/components/CountdownStrip'
import { MotifDivider } from '@/components/MotifDivider'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

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
      <section className="relative overflow-hidden bg-gradient-to-br from-wine via-terracotta-500 to-gold-500 py-20 text-center text-cream-light">
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-4">
          <FadeIn>
            <SectionHeader
              kicker="FESTIVAL"
              title="Festival Pesona Sambelia"
              intro="Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia."
              tone="gold"
              centered
            />
          </FadeIn>
        </div>
      </section>

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

      <MotifDivider />
    </>
  )
}
