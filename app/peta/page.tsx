import type { Metadata } from 'next'
import { getMapMarkers } from '@/lib/map'
import { getGisMap } from '@/lib/settings'
import { getGisManifest } from '@/lib/gis'
import { SectionHeader } from '@/components/SectionHeader'
import { MapPanelClient } from '@/components/MapPanelClient'

export const metadata: Metadata = {
  title: 'Peta Sambelia',
  description: 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.',
}

export default function PetaPage() {
  const markers = getMapMarkers()
  const gis = getGisMap()
  const manifest = getGisManifest()
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader
        kicker="02 — PETA"
        title="Peta Sambelia"
        intro="Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, irigasi, vegetasi, erosi, dan blue carbon."
        tone="water"
      />
      <MapPanelClient markers={markers} gis={gis} gisFiles={manifest.files} />
    </div>
  )
}
