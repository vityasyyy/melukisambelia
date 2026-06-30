import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'
import { getGisManifest } from '@/lib/gis'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { MotifFloater } from '@/components/MotifFloater'
import { EmptyState } from '@/components/EmptyState'

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const lingkungan = getPageSettings('lingkungan')
  return {
    title: lingkungan.seoTitle ?? 'Lingkungan',
    description: lingkungan.seoDescription ?? 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.',
  }
}

export default function LingkunganPage() {
  const items = getCollection('lingkungan')
  const manifest = getGisManifest()
  const ps = getPageSettings('lingkungan')
  const empty = getEmptyStates()
  const vegetasiFiles = manifest.files.filter((f) => f.category === 'vegetasi')

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'LINGKUNGAN'}
        title={ps.heroTitle ?? 'Vegetasi, Erosi & Blue Carbon'}
        intro={ps.heroIntro ?? 'Analisis lingkungan Kecamatan Sambelia: indeks vegetasi, tingkat erosi, dan sebaran blue carbon di wilayah pesisir dan daratan.'}
        tone="green"
      />

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-16 scroll-mt-20">
        <MotifFloater motif="bunga_sambel" position="bottom-right" size="md" color="olive" />
        <MotifFloater motif="cincin_sambel" position="top-left" size="sm" color="olive" />

        <FadeIn>
          <h2 className="mb-6 font-beautique text-display-lg text-brown-900">
            {ps.dataSectionTitle ?? 'Analisis Lingkungan'}
          </h2>
        </FadeIn>

        {items.length > 0 ? (
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <StaggerItem key={item.slug}>
                <div className="group overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover">
                  <div className="relative aspect-video overflow-hidden bg-green-50">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-900">
                      {item.category}
                    </span>
                    <h3 className="mt-2 font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-3">{item.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <EmptyState message={empty.lingkungan} />
        )}

        {vegetasiFiles.length > 0 && (
          <div className="mt-16">
            <FadeIn>
              <h2 className="mb-6 font-beautique text-display-lg text-brown-900">Peta Tematik GIS</h2>
            </FadeIn>
            <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vegetasiFiles.map((f) => (
                <StaggerItem key={f.url}>
                  <Link
                    href="/peta?tab=vegetasi"
                    className="group overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover"
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
                        <div className="absolute inset-0 flex items-center justify-center text-green-900">
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
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/peta?tab=vegetasi"
            className="inline-block rounded-full bg-water-900 px-6 py-2.5 text-sm font-medium text-cream-light transition-colors hover:bg-water-700"
          >
            {ps.linkToPeta ?? 'Lihat di Peta Interaktif →'}
          </Link>
        </div>
      </section>
    </>
  )
}