import { getMapMarkers } from '@/lib/map'
import { getGisMap } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { MapPanelClient } from '@/components/MapPanelClient'

export default function PetaPage() {
  const markers = getMapMarkers()
  const gis = getGisMap()
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeader kicker="02 — PETA" title="Peta Sambelia" intro="Jelajahi titik wisata, irigasi, kesehatan, dan UMKM, atau buka peta GIS tim." tone="water" />
      <MapPanelClient markers={markers} gis={gis} />
    </div>
  )
}