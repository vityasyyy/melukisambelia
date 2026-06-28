'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'
import type { GisFile } from '@/lib/gis-manifest'

const DEFAULT_CENTER: [number, number] = [-8.355, 116.845]

function FitGeoJson({ data }: { data: GeoJsonObject | null }) {
  const map = useMap()
  useEffect(() => {
    if (!data) return
    try {
      const layer = L.geoJSON(data)
      const bounds = layer.getBounds()
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
    } catch {
      // ignore invalid bounds
    }
  }, [data, map])
  return null
}

export function GisMap({
  title,
  description,
  credit,
  files,
}: {
  title: string
  description: string
  credit: string
  files: GisFile[]
}) {
  const [active, setActive] = useState<string | null>(null)
  const [geojsonData, setGeojsonData] = useState<Record<string, GeoJsonObject>>({})

  const activeFile = files.find((f) => f.name === active) ?? files[0] ?? null

  useEffect(() => {
    if (!activeFile || activeFile.type !== 'geojson') return
    if (geojsonData[activeFile.name]) return
    fetch(activeFile.url)
      .then((r) => r.json())
      .then((data) => setGeojsonData((prev) => ({ ...prev, [activeFile!.name]: data as GeoJsonObject })))
      .catch(() => {})
  }, [activeFile, geojsonData])

  return (
    <div>
      <header className="mb-4">
        <h2 className="font-beautique text-2xl text-brown-900">{title}</h2>
        {description && <p className="text-sm text-ink/70">{description}</p>}
        {credit && <p className="text-xs text-ink/60"> oleh {credit}</p>}
      </header>

      {files.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink/70 text-sm sm:text-base">Peta GIS tim belum tersedia.</p>
          <p className="mt-2 text-xs text-ink/60">Letakkan file GeoJSON atau gambar di folder <code>public/gis/umum/</code>.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[200px,1fr] gap-4">
          <ul className="space-y-1 md:max-h-none max-h-[60vh] overflow-y-auto" aria-label="Daftar lapisan GIS">
            {files.map((f) => (
              <li key={f.name}>
                <button
                  onClick={() => setActive(f.name)}
                  aria-pressed={activeFile?.name === f.name}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${activeFile?.name === f.name ? 'bg-water-50 text-water-900' : 'hover:bg-white'}`}
                >
                  {f.name} <span className="text-xs text-ink/60">({f.type})</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-tan-700/30 overflow-hidden">
            {activeFile?.type === 'geojson' && geojsonData[activeFile.name] != null && (
              <MapContainer center={DEFAULT_CENTER} zoom={13} className="h-[60vh] w-full">
                <FitGeoJson data={geojsonData[activeFile.name]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <GeoJSON data={geojsonData[activeFile.name] as never} />
              </MapContainer>
            )}
            {activeFile?.type === 'geojson' && geojsonData[activeFile.name] == null && (
              <div className="flex h-[60vh] w-full items-center justify-center text-sm text-ink/60">Memuat GeoJSON…</div>
            )}
            {activeFile?.type === 'image' && (
              <div className="relative h-[60vh] w-full">
                <Image src={activeFile.url} alt={activeFile.name} fill className="object-contain" sizes="100vw" />
              </div>
            )}
            {activeFile?.type === 'pdf' && (
              <iframe src={activeFile.url} title={activeFile.name} className="h-[60vh] w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
