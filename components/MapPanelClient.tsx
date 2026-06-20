'use client'
import dynamic from 'next/dynamic'
import type { MapMarker } from '@/lib/map-types'

const MapPanel = dynamic(() => import('./MapPanel').then((m) => m.MapPanel), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full rounded-2xl bg-gold-100/40" />,
})

export function MapPanelClient({ markers, gis }: { markers: MapMarker[]; gis: { title: string; description: string; credit: string } }) {
  return <MapPanel markers={markers} gis={gis} />
}