'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { LatLngBoundsExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { LAYER_COLORS, type MapLayer, type MapMarker } from '@/lib/map-types'
import { MapFilterChips } from './MapFilterChips'

const ALL_LAYERS: MapLayer[] = ['pariwisata', 'irigasi', 'kesehatan', 'umkm']
const LAYER_LABELS: Record<MapLayer, string> = {
  pariwisata: 'Pariwisata',
  irigasi: 'Irigasi',
  kesehatan: 'Kesehatan',
  umkm: 'UMKM',
}

const DEFAULT_CENTER: [number, number] = [-8.355, 116.845]

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap()
  useEffect(() => {
    if (!bounds) return
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [bounds, map])
  return null
}

function QueryView() {
  const map = useMap()
  const search = useSearchParams()
  useEffect(() => {
    const lat = Number(search.get('lat'))
    const lng = Number(search.get('lng'))
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      map.setView([lat, lng], 16)
    }
  }, [search, map])
  return null
}

function MapContents({ markers }: { markers: MapMarker[] }) {
  const [enabled, setEnabled] = useState<Record<MapLayer, boolean>>(() => {
    if (typeof window === 'undefined') {
      return { pariwisata: true, irigasi: true, kesehatan: true, umkm: true }
    }
    const layer = new URLSearchParams(window.location.search).get('layer') as MapLayer | null
    if (layer && ALL_LAYERS.includes(layer)) {
      return { pariwisata: false, irigasi: false, kesehatan: false, umkm: false, [layer]: true }
    }
    return { pariwisata: true, irigasi: true, kesehatan: true, umkm: true }
  })

  const visible = useMemo(() => markers.filter((m) => enabled[m.layer]), [markers, enabled])

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (visible.length === 0) return null
    return visible.map((m) => [m.lat, m.lng]) as LatLngBoundsExpression
  }, [visible])

  const toggle = (layer: MapLayer) => {
    setEnabled((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr,200px]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={14}
        scrollWheelZoom={false}
        className="h-[60vh] w-full rounded-2xl"
      >
        <FitBounds bounds={bounds} />
        <QueryView />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        {visible.map((m) => (
          <CircleMarker
            key={`${m.layer}-${m.slug}`}
            center={[m.lat, m.lng]}
            radius={8}
            pathOptions={{ color: LAYER_COLORS[m.layer], fillColor: LAYER_COLORS[m.layer], fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{m.title}</strong>
              <br />
              <span style={{ color: LAYER_COLORS[m.layer] }}>{LAYER_LABELS[m.layer]}</span>
              <br />
              <Link href={m.href}>Lihat detail</Link>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <aside className="max-h-[60vh] space-y-4 overflow-y-auto rounded-2xl border border-tan-700/20 bg-cream-beige/50 p-4 shadow-terracotta md:max-h-none">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-brown-900">Lapisan</h3>
        <MapFilterChips active={enabled} onToggle={toggle} />
        <div className="space-y-2 pt-2">
          {ALL_LAYERS.map((layer) => {
            const count = markers.filter((m) => m.layer === layer).length
            return (
              <div key={layer} className="flex items-center justify-between text-sm text-ink/70">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LAYER_COLORS[layer] }} />
                  {LAYER_LABELS[layer]}
                </span>
                <span className="text-xs">{count}</span>
              </div>
            )
          })}
        </div>
        {visible.length === 0 && <p className="text-xs text-ink/50">Tidak ada titik pada lapisan aktif.</p>}
      </aside>
    </div>
  )
}

export function InteractiveMap({ markers }: { markers: MapMarker[] }) {
  return (
    <Suspense fallback={<div className="h-[60vh] w-full rounded-2xl bg-gold-100/40" />}>
      <MapContents markers={markers} />
    </Suspense>
  )
}
