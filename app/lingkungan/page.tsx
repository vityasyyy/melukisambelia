import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import Link from 'next/link'
import { getGisManifest } from '@/lib/gis'
import { getCollection } from '@/lib/content'
import { getPageSettings, getEmptyStates } from '@/lib/settings'
import { FadeIn } from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { PageHero } from '@/components/PageHero'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import { EmptyState } from '@/components/EmptyState'
import { LingkunganCardGrid, GisCardGrid } from '@/components/LingkunganCardGrid'

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
          <MotifFloater motif="bunga_sambel" position="bottom-right" color="terracotta" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="top-left" color="gold" size="lg" opacity={0.85} />
          <MotifFloater motif="bunga_sambel" position="center-left" color="terracotta" size="sm" opacity={0.8} />
          <MotifFloater motif="bunga_sambel" position="top-right" color="gold" size="md" opacity={0.7} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" color="terracotta" size="md" opacity={0.7} />

          <FadeIn>
            <SectionHeader
              kicker={ps.sectionKicker ?? 'LINGKUNGAN'}
              title={ps.sectionTitle ?? 'Analisis Lingkungan'}
              intro={ps.sectionIntro ?? 'Data analisis lingkungan dan peta tematik Kecamatan Sambelia.'}
              tone="green"
            />
          </FadeIn>

          {items.length > 0 ? (
            <LingkunganCardGrid items={items} />
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
              <GisCardGrid items={vegetasiFiles} />
            </div>
          </section>
        </>
      )}
    </>
  )
}