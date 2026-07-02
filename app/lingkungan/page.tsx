import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import Link from 'next/link'
import Image from 'next/image'
import { getGisManifest } from '@/lib/gis'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { FadeIn } from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

import { MotifDivider } from '@/components/MotifDivider'
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

      <section className="relative bg-cream-beige/50">
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10 scroll-mt-20">
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="olive" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="olive" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-left" color="water" size="sm" opacity={0.8} />

          <FadeIn>
            <SectionHeader
              kicker={ps.sectionKicker ?? 'LINGKUNGAN'}
              title={ps.sectionTitle ?? 'Analisis Lingkungan'}
              intro={ps.sectionIntro ?? 'Data analisis lingkungan dan peta tematik Kecamatan Sambelia.'}
              tone="green"
            />
          </FadeIn>

          {items.length > 0 ? (
            <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <StaggerItem key={item.slug} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : undefined}>
                  <div className="glass-card glass-accent-top group overflow-hidden" style={{ '--accent-color': '#99BA57' } as React.CSSProperties}>
                    <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-green-50">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes={i === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                      />
                    </div>
                    <div className="p-5">
                      <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-900">
                        {item.category}
                      </span>
                      <h3 className="mt-2 font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/60 line-clamp-3">{item.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <EmptyState message={empty.lingkungan} />
          )}

          <div className="mt-10 text-center">
            <Link
              href="/peta?tab=vegetasi"
              className="inline-block rounded-full bg-water-900 px-6 py-2.5 text-sm font-medium text-cream-light transition-colors hover:bg-water-700"
            >
              {ps.linkToPeta ?? 'Lihat di Peta Interaktif →'}
            </Link>
          </div>
        </div>
      </section>

      {vegetasiFiles.length > 0 && (
        <>
          <MotifDivider />
          <section className="relative bg-page">
            <div className="mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
              <FadeIn>
                <h2 className="mb-6 font-beautique text-display-lg text-brown-900">Peta Tematik GIS</h2>
              </FadeIn>
              <StaggerContainer stagger={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {vegetasiFiles.map((f) => (
                  <StaggerItem key={f.url}>
                    <Link
                      href="/peta?tab=vegetasi"
                      className="glass-card glass-accent-top group overflow-hidden"
                      style={{ '--accent-color': '#99BA57' } as React.CSSProperties}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-green-50">
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
                        {f.description && <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.description}</p>}
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </>
      )}
    </>
  )
}