'use client'
import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { LAYER_COLORS, type MapLayer, type MapMarker } from '@/lib/map-types'

const ALL_LAYERS: MapLayer[] = ['pariwisata', 'irigasi', 'kesehatan', 'umkm']
const LAYER_LABELS: Record<MapLayer, string> = {
  pariwisata: 'Pariwisata',
  irigasi: 'Irigasi',
  kesehatan: 'Kesehatan',
  umkm: 'UMKM',
}

export function InteractiveMap({ markers }: { markers: MapMarker[] }) {
  const [enabled, setEnabled] = useState<Set<MapLayer>>(new Set(ALL_LAYERS))

  const visible = useMemo(
    () => markers.filter((m) => enabled.has(m.layer)),
    [markers, enabled],
  )

  const toggle = (layer: MapLayer) => {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(layer)) next.delete(layer)
      else next.add(layer)
      return next
    })
  }

  return (
    <div className="grid md:grid-cols-[1fr,200px] gap-4">
      <MapContainer center={[-8.36, 116.85]} zoom={12} scrollWheelZoom={false} className="h-[60vh] w-full rounded-2xl">
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

      <aside className="space-y-2">
        <h3 className="font-semibold text-sm">Lapisan</h3>
        {ALL_LAYERS.map((layer) => {
          const count = markers.filter((m) => m.layer === layer).length
          const isEnabled = enabled.has(layer)
          return (
            <button
              key={layer}
              onClick={() => toggle(layer)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${isEnabled ? 'border-tan-700/40 bg-white' : 'border-tan-700/10 bg-white/40 opacity-50'}`}
            >
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: LAYER_COLORS[layer] }} />
                {LAYER_LABELS[layer]}
              </span>
              <span className="text-xs text-ink/60">{count}</span>
            </button>
          )
        })}
        {visible.length === 0 && <p className="text-xs text-ink/50">Tidak ada titik pada lapisan aktif.</p>}
      </aside>
    </div>
  )
}