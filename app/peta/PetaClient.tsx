'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { LAYER_LABELS, LAYER_COLORS, type MapLayer } from '@/lib/map-types'
import type { GisFile } from '@/lib/gis-manifest'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { PetaSection } from '@/components/PetaSection'
import { EmptyState } from '@/components/EmptyState'
import { FadeIn } from '@/components/FadeIn'

type MarkerItem = {
  layer: MapLayer
  slug: string
  title: string
  lat: number
  lng: number
  href: string
  googleMapsUrl?: string
}

export function PetaClient({
  markers,
  gisDescription,
  gisFiles,
  dataSectionTitle,
  gisSectionTitle,
  emptyDataMessage,
  emptyGisMessage,
  mapEmbedUrl,
}: {
  markers: MarkerItem[]
  gisDescription: string
  gisFiles: GisFile[]
  dataSectionTitle: string
  gisSectionTitle: string
  emptyDataMessage: string
  emptyGisMessage: string
  mapEmbedUrl: string
}) {
  const searchParams = useSearchParams()
  const activeLayer = searchParams.get('layer') as MapLayer | null
  const latParam = searchParams.get('lat')
  const lngParam = searchParams.get('lng')
  const dataRef = useRef<HTMLDivElement>(null)

  const grouped = markers.reduce<Record<string, MarkerItem[]>>((acc, m) => {
    ;(acc[m.layer] ??= []).push(m)
    return acc
  }, {})

  const gisByCategory = (cat: string) => gisFiles.filter((f) => f.category === cat)

  const dynamicEmbedUrl = latParam && lngParam
    ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d63216.0!2d${lngParam}!3d${latParam}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1`
    : mapEmbedUrl

  useEffect(() => {
    if (activeLayer || latParam) {
      dataRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeLayer, latParam])

  return (
    <>
      <div className="mb-8 overflow-hidden rounded-2xl border border-tan-700/20 shadow-terracotta">
        <iframe
          src={dynamicEmbedUrl}
          className="w-full h-[60vh]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Sambelia"
        />
      </div>

      <div ref={dataRef}>
        <FadeIn>
          <h2 className="mb-6 font-beautique text-display-lg text-brown-900">{dataSectionTitle}</h2>
        </FadeIn>

        {markers.length === 0 ? (
          <EmptyState message={emptyDataMessage} />
        ) : (
          <div className="space-y-10">
            {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => {
              const items = grouped[layer]
              if (!items || items.length === 0) return null
              const isActive = !activeLayer || activeLayer === layer
              if (!isActive) return null
              return (
                <div key={layer}>
                  <FadeIn>
                    <h3 className="mb-4 font-beautique text-xl text-brown-900">
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full align-middle"
                        style={{ backgroundColor: LAYER_COLORS[layer] }}
                      />
                      {LAYER_LABELS[layer]}
                    </h3>
                  </FadeIn>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((m) => (
                      <FadeIn key={`${m.layer}-${m.slug}`}>
                        <div className="rounded-xl border border-tan-700/20 bg-cream-beige/40 p-4 shadow-terracotta transition-all hover:-translate-y-0.5 hover:shadow-terracotta-hover">
                          <div className="font-semibold text-brown-900">{m.title}</div>
                          <a
                            href={m.googleMapsUrl || `https://www.google.com/maps?q=${m.lat},${m.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-water-900 hover:text-water-500"
                          >
                            Buka di Google Maps →
                          </a>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-16">
        <FadeIn>
          <h2 className="mb-6 font-beautique text-display-lg text-brown-900">{gisSectionTitle}</h2>
        </FadeIn>
        <FadeIn>
          <p className="mb-6 text-ink/70">{gisDescription || 'Peta tematik Kecamatan Sambelia.'}</p>
        </FadeIn>
        {(Object.keys(GIS_CATEGORY_LABELS) as Array<keyof typeof GIS_CATEGORY_LABELS>).map((cat) => {
          const files = gisByCategory(cat)
          if (files.length === 0) return null
          return (
            <div key={cat} className="mb-10">
              <FadeIn>
                <h3 className="mb-4 font-beautique text-xl text-brown-900">{GIS_CATEGORY_LABELS[cat]}</h3>
              </FadeIn>
              <PetaSection files={files} />
            </div>
          )
        })}
        {gisFiles.length === 0 && (
          <EmptyState message={emptyGisMessage} />
        )}
      </div>
    </>
  )
}