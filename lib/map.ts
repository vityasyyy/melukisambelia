import { getCollection } from '@/lib/content'
import type { MapMarker } from '@/lib/map-types'

export type { MapLayer, MapMarker } from '@/lib/map-types'
export { LAYER_COLORS } from '@/lib/map-types'

export function getMapMarkers(): MapMarker[] {
  const markers: MapMarker[] = []

  const pariwisata = getCollection('pariwisata')
  for (const p of pariwisata) {
    markers.push({ layer: 'pariwisata', slug: p.slug, title: p.title, lat: p.lat, lng: p.lng, href: `/pariwisata/${p.slug}` })
  }

  const irigasi = getCollection('irigasi')
  for (const i of irigasi) {
    markers.push({ layer: 'irigasi', slug: i.slug, title: i.name, lat: i.lat, lng: i.lng, href: `/irigasi` })
  }

  const kesehatan = getCollection('kesehatan')
  for (const k of kesehatan) {
    markers.push({ layer: 'kesehatan', slug: k.slug, title: k.facilityName, lat: k.lat, lng: k.lng, href: `/kesehatan` })
  }

  const umkm = getCollection('umkm')
  for (const u of umkm) {
    if (u.lat !== undefined && u.lng !== undefined) {
      markers.push({ layer: 'umkm', slug: u.slug, title: u.name, lat: u.lat, lng: u.lng, href: `/umkm` })
    }
  }

  return markers
}