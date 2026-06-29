import type { Metadata } from 'next'
import { getMapMarkers } from '@/lib/map'
import { LAYER_LABELS, type MapLayer } from '@/lib/map-types'
import { getGisMap, getPageSettings } from '@/lib/settings'
import { getGisManifest } from '@/lib/gis'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { PageHero } from '@/components/PageHero'
import { PetaSection } from '@/components/PetaSection'
import { FadeIn } from '@/components/FadeIn'
import { EmptyState } from '@/components/EmptyState'
import { MotifFloater } from '@/components/MotifFloater'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const ps = getPageSettings('peta')
  return {
    title: ps.seoTitle ?? 'Peta Sambelia',
    description: ps.seoDescription ?? 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.',
  }
}

export default function PetaPage() {
  const markers = getMapMarkers()
  const gis = getGisMap()
  const manifest = getGisManifest()
  const ps = getPageSettings('peta')

  const grouped = markers.reduce<Record<string, typeof markers>>((acc, m) => {
    ;(acc[m.layer] ??= []).push(m)
    return acc
  }, {})

  const gisByCategory = (cat: string) => manifest.files.filter((f) => f.category === cat)

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'PETA'}
        title={ps.heroTitle ?? 'Peta Sambelia'}
        intro={ps.heroIntro ?? 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.'}
        tone="water"
      />

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-16">
        <MotifFloater motif="cincin_sambel" position="top-right" size="md" color="water" />
        <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" />
        <div className="mb-8 overflow-hidden rounded-2xl border border-tan-700/20 shadow-terracotta">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d63216.0!2d116.845!3d-8.355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1"
            className="w-full h-[60vh]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Sambelia"
          />
        </div>

        <FadeIn>
          <h2 className="mb-6 font-beautique text-display-lg text-brown-900">Lokasi Titik Data</h2>
        </FadeIn>

        {markers.length === 0 ? (
          <EmptyState message="Belum ada data lokasi. Tim akan menambahkan segera." />
        ) : (
          <div className="space-y-10">
            {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => {
              const items = grouped[layer]
              if (!items || items.length === 0) return null
              return (
                <div key={layer}>
                  <FadeIn>
                    <h3 className="mb-4 font-beautique text-xl text-brown-900">
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full align-middle"
                        style={{ backgroundColor: layer === 'pariwisata' ? '#14A8E1' : layer === 'irigasi' ? '#99BA57' : layer === 'kesehatan' ? '#667F37' : '#F0AC6D' }}
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
                            href={`https://www.google.com/maps?q=${m.lat},${m.lng}`}
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

        <div className="mt-16">
          <FadeIn>
            <h2 className="mb-6 font-beautique text-display-lg text-brown-900">Peta Tematik GIS</h2>
          </FadeIn>
          <FadeIn>
            <p className="mb-6 text-ink/70">{gis.description || 'Peta tematik Kecamatan Sambelia.'}</p>
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
          {manifest.files.length === 0 && (
            <EmptyState message="Peta GIS belum tersedia." />
          )}
        </div>
      </section>
    </>
  )
}