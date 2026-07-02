'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Festival } from '@/lib/schemas'
import { DetailModal, type DetailModalData } from '@/components/DetailModal'

export function FestivalTimeline({ events }: { events: (Festival & { slug: string })[] }) {
  const [modalData, setModalData] = useState<DetailModalData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function openDetail(e: Festival & { slug: string }) {
    setModalData({
      title: e.eventName,
      image: e.cover,
      description: `${e.schedule} · ${e.venue}`,
      body: e.body ? <div dangerouslySetInnerHTML={{ __html: e.body }} /> : undefined,
      chips: [
        { label: e.schedule, tone: 'terracotta' as const },
        { label: e.venue, tone: 'water' as const },
      ],
    })
    setModalOpen(true)
  }

  return (
    <>
      <ol className="relative space-y-8 overflow-hidden">
        {events.map((e, i) => (
          <li key={e.slug} className="group relative">
            <div aria-hidden className="absolute left-[11px] top-3 bottom-0 w-px bg-gradient-to-b from-terracotta-500/60 via-terracotta-500/30 to-transparent" />
            <span aria-hidden className="absolute left-0 top-2 z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border-[3px] border-page bg-terracotta-500">
              <span className="h-2 w-2 rounded-full bg-page" />
            </span>
            <button
              type="button"
              onClick={() => openDetail(e)}
              className="ml-8 w-full text-left group/card"
            >
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 rounded-2xl border border-tan-700/12 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-sambel hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 overflow-hidden">
                <div className="relative w-full sm:w-56 sm:min-w-[14rem] sm:h-auto aspect-[16/10] sm:aspect-auto overflow-hidden flex-shrink-0">
                  <Image
                    src={e.cover}
                    alt={e.eventName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105 sm:h-full"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 min-w-0">
                  <div>
                    <span className="font-beautique-condensed text-[10px] tracking-[0.2em] uppercase text-terracotta-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-0.5 font-beautique text-lg text-brown-900 group-hover/card:text-terracotta-500 transition-colors">{e.eventName}</h3>
                    <p className="mt-1 font-beautique-condensed text-xs tracking-wide text-ink/60">{e.schedule} · {e.venue}</p>
                    <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-2">{e.description}</p>
                  </div>
                  {e.registrationUrl && (
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-terracotta-500 px-3.5 py-1.5 text-xs font-medium text-page transition-colors group-hover/card:bg-wine">
                        Daftar
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
            {i < events.length - 1 && (
              <div aria-hidden className="absolute left-[11px] bottom-0 h-4 w-px bg-terracotta-500/20" />
            )}
          </li>
        ))}
      </ol>
      <DetailModal open={modalOpen} onOpenChange={setModalOpen} data={modalData} />
    </>
  )
}