import { getCollection } from '@/lib/content'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { EmptyState } from '@/components/EmptyState'

export default function FestivalPage() {
  const events = getCollection('festival')
  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-terracotta-500 via-terracotta-500/80 to-brown-900/60"
      >
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')" }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-content px-4 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-page/70">FESTIVAL</p>
          <h1 className="mt-2 font-beautique text-4xl sm:text-5xl md:text-6xl text-page">Festival Pesona Sambelia</h1>
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