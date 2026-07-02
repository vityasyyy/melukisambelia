import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'
import { CountdownStrip } from '@/components/CountdownStrip'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'

import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
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
  const rawEvents = getCollection('festival')
  const events = [...rawEvents].sort((a, b) => {
    const dateA = new Date(a.schedule)
    const dateB = new Date(b.schedule)
    return dateA.getTime() - dateB.getTime()
  })
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

      <section className="relative overflow-hidden bg-terracotta-500/[0.06]">
        <div className="mx-auto max-w-content px-4 py-8 md:py-10">

          {events.length > 0 ? <CountdownStrip festivals={festivalData} /> : <EmptyState message={empty.festival} />}
        </div>
      </section>

      <MotifDivider />

      <section className="relative overflow-hidden bg-page">
          <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="terracotta" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

          {events.length === 0 ? (
            <EmptyState message={empty.festival} />
          ) : (
            <FadeIn>
              <FestivalTimeline events={events} />
            </FadeIn>
          )}
        </div>
      </section>
    </>
  )
}