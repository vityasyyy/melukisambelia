'use client'

import Image from 'next/image'
import type { GisFile } from '@/lib/gis-manifest'

export function PetaSection({ files }: { files: GisFile[] }) {
  if (files.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink/70 text-sm sm:text-base">Peta untuk kategori ini belum tersedia.</p>
        <p className="mt-2 text-xs text-ink/70">Tim GIS akan menambahkan segera.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((f) => (
        <div
          key={`${f.category}-${f.name}`}
          className="overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
        >
          {f.type === 'image' && (
            <div className="relative aspect-[4/3] w-full">
              <Image src={f.url} alt={f.name} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          )}
          {f.type === 'pdf' && (
            <div className="relative aspect-[4/3] w-full bg-gold-50">
              <iframe src={f.url} title={f.name} className="h-full w-full" />
            </div>
          )}
          {f.type === 'geojson' && (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-gold-50 text-sm text-ink/70">
              GeoJSON (ditampilkan di peta interaktif)
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-brown-900">{f.name}</h3>
            {f.description && <p className="mt-1 text-xs text-ink/70">{f.description}</p>}
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs font-medium text-water-900 hover:text-water-500"
            >
              Buka file →
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}