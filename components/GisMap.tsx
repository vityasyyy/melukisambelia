'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Image from 'next/image'

type GisFile = { type: 'geojson'; name: string; url: string } | { type: 'image'; name: string; url: string } | { type: 'pdf'; name: string; url: string }

type ManifestItem = { type: 'geojson' | 'image' | 'pdf'; name: string; url: string }

const GIS_DIR_MANIFEST = '/gis/manifest.json'

function classifyFile(name: string, url: string): GisFile {
  const ext = url.split('.').pop()?.toLowerCase()
  if (ext === 'geojson' || ext === 'json') return { type: 'geojson', name, url }
  if (ext === 'pdf') return { type: 'pdf', name, url }
  return { type: 'image', name, url }
}

export function GisMap({ title, description, credit }: { title: string; description: string; credit: string }) {
  const [files, setFiles] = useState<GisFile[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [geojsonData, setGeojsonData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    fetch(GIS_DIR_MANIFEST)
      .then((r) => (r.ok ? r.json() : []))
      .then((items: ManifestItem[]) => items.map((i) => classifyFile(i.name, i.url)))
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [])

  const activeFile = files.find((f) => f.name === active) ?? files[0] ?? null

  useEffect(() => {
    if (!activeFile || activeFile.type !== 'geojson') return
    if (geojsonData[activeFile.name]) return
    fetch(activeFile.url)
      .then((r) => r.json())
      .then((data) => setGeojsonData((prev) => ({ ...prev, [activeFile!.name]: data })))
      .catch(() => {})
  }, [activeFile, geojsonData])

  return (
    <div>
      <header className="mb-4">
        <h3 className="font-beautique text-2xl text-brown-900">{title}</h3>
        {description && <p className="text-sm text-ink/70">{description}</p>}
        {credit && <p className="text-xs text-ink/50"> oleh {credit}</p>}
      </header>

      {files.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tan-700/40 p-8 text-center text-ink/60">
          Peta GIS tim belum tersedia. Letakkan file GeoJSON atau gambar di folder <code>public/gis/</code>.
        </p>
      ) : (
        <div className="grid md:grid-cols-[200px,1fr] gap-4">
          <ul className="space-y-1 md:max-h-none max-h-[60vh] overflow-y-auto">
            {files.map((f) => (
              <li key={f.name}>
                <button
                  onClick={() => setActive(f.name)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${activeFile?.name === f.name ? 'bg-water-50 text-water-900' : 'hover:bg-white'}`}
                >
                  {f.name} <span className="text-xs text-ink/40">({f.type})</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-tan-700/30 overflow-hidden">
            {activeFile?.type === 'geojson' && geojsonData[activeFile.name] != null && (
              <MapContainer center={[-8.36, 116.85]} zoom={12} className="h-[60vh] w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <GeoJSON data={geojsonData[activeFile.name] as never} />
              </MapContainer>
            )}
            {activeFile?.type === 'geojson' && geojsonData[activeFile.name] == null && (
              <div className="flex h-[60vh] w-full items-center justify-center text-sm text-ink/50">Memuat GeoJSON…</div>
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