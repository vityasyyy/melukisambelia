import { getCollection } from '@/lib/content'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'

export default function FestivalPage() {
  const events = getCollection('festival')
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(53,2,1,1) 0%, rgba(203,36,4,0.9) 68%, rgba(255,153,55,0.7) 89%, rgba(250,227,159,0.5) 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')" }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-content px-4 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-page/70">FESTIVAL</p>
          <h1
            className="mt-2 font-beautique-condensed text-4xl sm:text-5xl md:text-6xl text-page"
            style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          >
            Festival Pesona Sambelia
          </h1>
          <p className="mt-4 text-page/80 max-w-xl mx-auto text-sm sm:text-base">
            Peresean, Pawai Dulangan, Gendang Beleq — perayaan budaya Sasak di Kecamatan Sambelia.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 scroll-mt-20">
        {events.length === 0 ? (
          <EmptyState message="Jadwal festival akan diumumkan." />
        ) : (
          <FestivalTimeline events={events} />
        )}
      </section>
    </>
  )
}