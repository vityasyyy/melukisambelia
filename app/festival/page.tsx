import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'
import { CountdownStrip } from '@/components/CountdownStrip'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { PageHero } from '@/components/PageHero'
import { MotifFloater } from '@/components/MotifFloater'
import { MotifDivider } from '@/components/MotifDivider'
import { REVALIDATE_SECONDS } from '@/lib/config'

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const festival = getPageSettings('festival')
  return {
    title: festival.seoTitle ?? 'Festival Pesona Sambelia',
    description: festival.seoDescription ?? 'Jadwal dan informasi Festival Pesona Sambelia: Peresean, Pawai Dulangan, Gendang Beleq, dan warisan budaya Sasak lainnya.',
  }
}

export default function FestivalPage() {
  const events = getCollection('festival')
  const ps = getPageSettings('festival')
  const empty = getEmptyStates()
  const festivalData = events.map((f) => ({
    eventName: f.eventName,
    schedule: f.schedule,
    venue: f.venue,
    description: f.description,
    cover: f.cover,
    registrationUrl: f.registrationUrl,
    body: f.body,
    order: f.order,
  }))

  return (
    <>
      <PageHero kicker={ps.heroKicker ?? 'FESTIVAL'} title={ps.heroTitle ?? 'Festival Pesona Sambelia'} intro={ps.heroIntro ?? 'Pereseen, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.'} tone="gold" />

      <section className="relative bg-terracotta-500/[0.06]">
        <div className="mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="top-left" size="md" color="gold" />
          {events.length > 0 ? <CountdownStrip festivals={festivalData} /> : <EmptyState message={empty.festival} />}
        </div>
      </section>

      <MotifDivider />

      <section className="relative bg-page">
        <div className="mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="cincin_sambel" position="bottom-right" size="md" color="terracotta" />
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" />
          {events.length === 0 ? (
            <EmptyState message={empty.festival} />
          ) : (
            <StaggerContainer stagger={0.1}>
              <StaggerItem>
                <FestivalTimeline events={events} />
              </StaggerItem>
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  )
}