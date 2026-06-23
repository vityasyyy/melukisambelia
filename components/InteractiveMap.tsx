'use client'

import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { LAYER_COLORS, type MapLayer, type MapMarker } from '@/lib/map-types'
import { MapFilterChips } from './MapFilterChips'

const ALL_LAYERS: MapLayer[] = ['pariwisata', 'irigasi', 'kesehatan', 'umkm']
const LAYER_LABELS: Record<MapLayer, string> = {
  pariwisata: 'Pariwisata',
  irigasi: 'Irigasi',
  kesehatan: 'Kesehatan',
  umkm: 'UMKM',
}

export function InteractiveMap({ markers }: { markers: MapMarker[] }) {
  const [enabled, setEnabled] = useState<Record<MapLayer, boolean>>({
    pariwisata: true,
    irigasi: true,
    kesehatan: true,
    umkm: true,
  })

  const visible = useMemo(() => markers.filter((m) => enabled[m.layer]), [markers, enabled])

  const toggle = (layer: MapLayer) => {
    setEnabled((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr,200px]">
      <MapContainer
        center={[-8.36, 116.85]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-[60vh] w-full rounded-2xl"
      >
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
