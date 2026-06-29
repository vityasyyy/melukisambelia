'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { GisFile } from '@/lib/gis-manifest'

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

  const activeFile = files.find((f) => f.name === active) ?? files[0] ?? null

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
            {activeFile?.type === 'geojson' && (
              <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-ink/70">File GeoJSON tersedia untuk diunduh</p>
                <a
                  href={activeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-water-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-water-700"
                >
                  Unduh GeoJSON
                </a>
              </div>
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