import Image from 'next/image'
import type { Festival } from '@/lib/schemas'

export function FestivalTimeline({ events }: { events: (Festival & { slug: string })[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-terracotta-500 pl-6 sm:pl-8">
      {events.map((e) => (
        <li key={e.slug} className="group relative">
          <span className="absolute left-0 top-1 h-4 w-4 -translate-x-1/2 rounded-full bg-terracotta-500 ring-4 ring-terracotta-500/20" />
          <div className="relative overflow-hidden rounded-2xl border border-tan-700/20 border-l-[3px] border-l-gold-500 bg-cream-beige/50 shadow-[0_6px_24px_-8px_rgba(116,45,27,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(227,121,92,0.3)] hover:border-terracotta-500/30">
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={e.cover}
                alt={e.eventName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brown-950/20 to-transparent" />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="font-beautique text-xl sm:text-2xl text-brown-900">{e.eventName}</h2>
              <p className="font-beautique-condensed text-sm text-terracotta-500 tracking-wide">{e.schedule} · {e.venue}</p>
              <p className="mt-2 text-sm text-ink/70 line-clamp-3">{e.description}</p>
              {e.registrationUrl && (
                <a
                  href={e.registrationUrl}
                  className="mt-4 inline-block rounded-full bg-terracotta-500 px-4 py-2 text-sm font-medium text-page transition-colors hover:bg-wine"
                >
                  Daftar
                </a>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}