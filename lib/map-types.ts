export type MapLayer = 'pariwisata' | 'irigasi' | 'kesehatan' | 'umkm'

export type MapMarker = {
  layer: MapLayer
  slug: string
  title: string
  lat: number
  lng: number
  href: string
  googleMapsUrl?: string
}

export const LAYER_COLORS: Record<MapLayer, string> = {
  pariwisata: '#14A8E1',
  irigasi: '#99BA57',
  kesehatan: '#667F37',
  umkm: '#F0AC6D',
}

export const LAYER_LABELS: Record<MapLayer, string> = {
  pariwisata: 'Pariwisata',
  irigasi: 'Irigasi',
  kesehatan: 'Kesehatan',
  umkm: 'UMKM',
}