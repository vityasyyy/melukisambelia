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
      <div className="relative">
        {/* Decorative loose string curl at top */}
        <div aria-hidden className="flex justify-center mb-4">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-terracotta-500/40">
            <path d="M20 24C20 24 8 18 4 10C0 2 10 0 20 8C30 0 40 2 36 10C32 18 20 24 20 24Z" fill="currentColor" />
          </svg>
        </div>

        <ol className="relative">
          {events.map((e, i) => (
            <li key={e.slug} className="group relative pb-8 sm:pb-10 last:pb-0">
              {/* Woven thread connector */}
              {i < events.length - 1 && (
                <div aria-hidden className="absolute left-[15px] sm:left-[19px] top-[40px] sm:top-[44px] bottom-0 w-[2px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-terracotta-500/40 via-gold-500/25 to-terracotta-500/15" />
                  {/* Small decorative loop on the thread */}
                  <svg
                    className="absolute left-[-4px] top-[50%] -translate-y-1/2"
                    width="12" height="16" viewBox="0 0 12 16" fill="none"
                  >
                    <path d="M6 0C6 0 0 4 0 8C0 12 6 16 6 16C6 16 12 12 12 8C12 4 6 0 6 0Z" fill="url(#thread-gradient)" opacity="0.3" />
                    <defs>
                      <linearGradient id="thread-gradient" x1="0" y1="0" x2="0" y2="16">
                        <stop offset="0%" stopColor="#E3795C" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#F0AC6D" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              {/* Node marker with gradient */}
              <span aria-hidden className="absolute left-0 sm:left-1 z-10 flex h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-gold-500 shadow-[0_0_12px_rgba(227,121,92,0.3)]">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-white" />
              </span>

              {/* Glass event card */}
              <button
                type="button"
                onClick={() => openDetail(e)}
                className="ml-10 sm:ml-14 block w-[calc(100%-2.5rem)] sm:w-[calc(100%-3.5rem)] text-left group/card"
              >
                <div className="glass-card glass-accent-top overflow-hidden" style={{ '--accent-color': '#E3795C' } as React.CSSProperties}>
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-56 sm:min-w-[14rem] shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl">
                      <Image
                        src={e.cover}
                        alt={e.eventName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 100vw, 224px"
                      />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0 p-4 sm:p-5">
                      <div>
                        <span className="font-beautique-condensed text-[10px] tracking-[0.2em] uppercase text-terracotta-500">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-0.5 font-semibold text-lg text-brown-900 group-hover/card:text-terracotta-500 transition-colors">{e.eventName}</h3>
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
                </div>
              </button>
            </li>
          ))}
        </ol>

        {/* Decorative loose string curl at bottom */}
        <div aria-hidden className="flex justify-center mt-2">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-terracotta-500/30">
            <path d="M20 0C20 0 32 6 36 14C40 22 30 20 20 12C10 20 0 22 4 14C8 6 20 0 20 0Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <DetailModal open={modalOpen} onOpenChange={setModalOpen} data={modalData} />
    </>
  )
}