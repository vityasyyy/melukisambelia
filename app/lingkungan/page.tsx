import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import Link from 'next/link'
import { getGisManifest } from '@/lib/gis'
import { getCollection } from '@/lib/content'
import { getPageSettings } from '@/lib/settings'
import { FadeIn } from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { PageHero } from '@/components/PageHero'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import { HubSectionList, AnalysisList, GisCardGrid } from '@/components/LingkunganCardGrid'
import type { HubSection } from '@/components/LingkunganCardGrid'

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
  const vegetasiFiles = manifest.files.filter((f) => f.category === 'vegetasi')

  const hubSections: HubSection[] = [
    {
      title: 'Air & Tanah',
      description: 'Data kualitas air, tingkat muka air tanah, dan peta Iso-DHL.',
      href: '/air-tanah',
      petaHref: '/peta?tab=air',
      tone: 'water',
    },
    {
      title: 'Vegetasi',
      description: 'Peta indeks vegetasi (NDVI) dan analisis sebaran hijauan.',
      href: '/peta?tab=vegetasi',
      tone: 'green',
    },
    {
      title: 'Erosi',
      description: 'Analisis erosi pesisir dan peta kerentanan erosi.',
      href: '/peta?tab=erosi',
      tone: 'terracotta',
    },
    {
      title: 'Blue Carbon',
      description: 'Distribusi blue carbon mangrove dan potensi karbon pesisir.',
      href: '/peta?tab=blue-carbon',
      tone: 'water',
    },
    {
      title: 'Irigasi & Kekeringan',
      description: 'Jaringan irigasi, saluran tersier, dan peta rawan kekeringan.',
      href: '/irigasi',
      tone: 'olive',
    },
  ]

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'LINGKUNGAN'}
        title={ps.heroTitle ?? 'Hijau, Biru, Lestari'}
        intro={ps.heroIntro ?? 'Menjaga keseimbangan alam untuk generasi mendatang.'}
        tone="green"
      />

      <section className="relative overflow-hidden bg-cream-beige/50">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">

          <FadeIn>
            <SectionHeader
              kicker={ps.sectionKicker ?? 'LINGKUNGAN'}
              title={ps.sectionTitle ?? 'Data & Analisis Lingkungan'}
              intro={ps.sectionIntro ?? 'Jelajahi data lingkungan Kecamatan Sambelia: air, vegetasi, erosi, dan lainnya.'}
              tone="green"
            />
          </FadeIn>

          <FadeIn>
            <HubSectionList sections={hubSections} />
          </FadeIn>

          {items.length > 0 && (
            <FadeIn className="mt-10">
              <h2 className="mb-4 font-beautique text-display-lg text-brown-900">Analisis Lingkungan</h2>
              <AnalysisList items={items} />
            </FadeIn>
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
          <section className="relative overflow-hidden bg-page">
              <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="water" opacity={0.5} />
              <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" opacity={0.5} />
            <div className="mx-auto max-w-content px-4 py-8 md:py-10">
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