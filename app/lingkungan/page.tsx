import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getGisManifest } from '@/lib/gis'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

export const metadata: Metadata = {
  title: 'Lingkungan',
  description: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.',
}

export default function LingkunganPage() {
  const manifest = getGisManifest()
  const vegetasiFiles = manifest.files.filter((f) => f.category === 'vegetasi')

  return (
    <>
      <PageHero
        kicker="LINGKUNGAN"
        title="Vegetasi, Erosi & Blue Carbon"
        intro="Analisis lingkungan Kecamatan Sambelia: indeks vegetasi, tingkat erosi, dan sebaran blue carbon di wilayah pesisir dan daratan."
        tone="green"
      />

      <section className="mx-auto max-w-content px-4 py-16 scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="LINGKUNGAN"
            title="Vegetasi, Erosi & Blue Carbon"
            intro="Peta tematik lingkungan dari cluster GIS: indeks vegetasi (NDVI), tingkat erosi, dan sebaran blue carbon di Kecamatan Sambelia."
            tone="green"
          />
        </FadeIn>

        <FadeIn>
          {vegetasiFiles.length > 0 ? (
            <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vegetasiFiles.map((f) => (
                <StaggerItem key={f.url}>
                  <Link
                    href="/peta?tab=vegetasi"
                    className="group overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-terracotta-hover"
                  >
                    <div className="relative aspect-video overflow-hidden bg-green-50">
                      {f.type === 'image' && (
                        <Image
                          src={f.url}
                          alt={f.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                        />
                      )}
                      {f.type !== 'image' && (
                        <div className="flex h-full items-center justify-center text-green-900">
                          <span className="text-sm font-medium">{GIS_CATEGORY_LABELS[f.category]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{f.name}</h3>
                      {f.description && <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.description}</p>}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-8 text-center">
              <p className="text-ink/70">Data peta lingkungan dari cluster GIS akan diunggah.</p>
              <p className="mt-2 text-sm text-ink/50">Peta tematik akan tersedia di halaman Peta.</p>
            </div>
          )}
        </FadeIn>

        <div className="mt-10 text-center">
          <Link
            href="/peta?tab=vegetasi"
            className="inline-block rounded-full bg-water-900 px-6 py-2.5 text-sm font-medium text-cream-light transition-colors hover:bg-water-700"
          >
            Lihat di Peta Interaktif →
          </Link>
        </div>
      </section>
    </>
  )
}