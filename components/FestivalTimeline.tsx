import Image from 'next/image'
import type { Festival } from '@/lib/schemas'

export function FestivalTimeline({ events }: { events: (Festival & { slug: string })[] }) {
  return (
    <>
      <div className="relative">
        <div aria-hidden className="absolute left-0 right-0 top-[0.75rem] h-[2px] bg-terracotta-500/25" />
        <div className="relative flex gap-6 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {events.map((e) => (
            <div key={e.slug} className="snap-center shrink-0 w-[300px] sm:w-[340px]">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden className="relative z-10 flex h-3.5 w-3.5 rounded-full bg-terracotta-500 ring-[3px] ring-page" />
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-tan-700/12 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-sambel hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]">
                <div className="relative aspect-[3/2] overflow-hidden rounded-t-2xl">
                  <Image
                    src={e.cover}
                    alt={e.eventName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 300px, 340px"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-beautique text-lg text-brown-900">{e.eventName}</h2>
                  <p className="mt-1 font-beautique-condensed text-xs tracking-wide text-terracotta-500">{e.schedule} · {e.venue}</p>
                  <p className="mt-2 text-sm text-ink/60 line-clamp-2 leading-relaxed">{e.description}</p>
                  {e.registrationUrl && (
                    <a
                      href={e.registrationUrl}
                      className="mt-3 inline-block rounded-full bg-terracotta-500 px-3.5 py-1.5 text-xs font-medium text-page transition-colors hover:bg-wine"
                    >
                      Daftar
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {events.length > 1 && (
        <p className="mt-2 text-center text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
      )}
    </>
  )
}