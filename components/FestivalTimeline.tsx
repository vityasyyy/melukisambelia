import Image from 'next/image'
import type { Festival } from '@/lib/schemas'

export function FestivalTimeline({ events }: { events: (Festival & { slug: string })[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-terracotta-500 pl-6">
      {events.map((e) => (
        <li key={e.slug} className="relative">
          <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-terracotta-500" />
          <div className="overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover">
            <div className="relative aspect-video">
              <Image
                src={e.cover}
                alt={e.eventName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-5">
              <h3 className="font-beautique text-2xl text-brown-900">{e.eventName}</h3>
              <p className="text-sm text-terracotta-500 font-medium">{e.schedule} · {e.venue}</p>
              <p className="mt-2 text-sm text-ink/70">{e.description}</p>
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
