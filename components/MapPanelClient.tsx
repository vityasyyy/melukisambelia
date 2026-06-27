'use client'
import dynamic from 'next/dynamic'
import type { MapMarker } from '@/lib/map-types'
import type { GisFile } from '@/lib/gis-manifest'

const MapPanel = dynamic(() => import('./MapPanel').then((m) => m.MapPanel), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full rounded-2xl bg-gold-100/40" />,
})

export function MapPanelClient({
  markers,
  gis,
  gisFiles,
}: {
  markers: MapMarker[]
  gis: { title: string; description: string; credit: string }
  gisFiles?: GisFile[]
}) {
  return <MapPanel markers={markers} gis={gis} gisFiles={gisFiles ?? []} />
}
