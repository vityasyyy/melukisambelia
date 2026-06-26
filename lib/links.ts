import type { MapLayer } from './map-types'

export type PetaLinkOptions = {
  layer?: MapLayer
  tab?: string
  lat?: number
  lng?: number
}

export function petaLink({ layer, tab, lat, lng }: PetaLinkOptions): string {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (layer) params.set('layer', layer)
  if (typeof lat === 'number') params.set('lat', String(lat))
  if (typeof lng === 'number') params.set('lng', String(lng))
  const query = params.toString()
  return query ? `/peta?${query}` : '/peta'
}