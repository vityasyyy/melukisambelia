import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { Suspense } from 'react'
import { getMapMarkers } from '@/lib/map'
import { getPageSettings, getEmptyStates, getGisMap } from '@/lib/settings'
import { getGisManifest } from '@/lib/gis'
import { PageHero } from '@/components/PageHero'
import { PetaClient } from './PetaClient'
import { MapSkeleton } from '@/components/Skeleton'
import { MotifFloater } from '@/components/MotifFloater'

export const revalidate = REVALIDATE_SECONDS

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
  const empty = getEmptyStates()

  const petaPageData = ps as Record<string, string>

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'PETA'}
        title={ps.heroTitle ?? 'Peta Sambelia'}
        intro={ps.heroIntro ?? 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.'}
        tone="water"
      />

      <section className="relative bg-page">
        <div className="mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="cincin_sambel" position="top-right" size="md" color="water" />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" />
          <Suspense fallback={<MapSkeleton />}>
            <PetaClient
              markers={markers.map((m) => ({ ...m, googleMapsUrl: m.googleMapsUrl }))}
              gisDescription={gis.description}
              gisFiles={manifest.files}
              dataSectionTitle={petaPageData.dataSectionTitle ?? 'Lokasi Titik Data'}
              gisSectionTitle={petaPageData.gisSectionTitle ?? 'Peta Tematik GIS'}
              emptyDataMessage={empty.petaDataEmpty ?? 'Belum ada data lokasi. Tim akan menambahkan segera.'}
              emptyGisMessage={empty.petaGisEmpty ?? 'Peta GIS belum tersedia.'}
              mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d63216.0!2d116.845!3d-8.355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1"
            />
          </Suspense>
        </div>
      </section>
    </>
  )
}