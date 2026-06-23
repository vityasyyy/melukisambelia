'use client'

import { MapLayer } from '@/lib/map-types'
import { cn } from '@/lib/utils'

const LAYER_META: Record<MapLayer, { label: string; color: string }> = {
  pariwisata: { label: 'Pariwisata', color: '#14A8E1' },
  irigasi: { label: 'Irigasi', color: '#99BA57' },
  kesehatan: { label: 'Kesehatan', color: '#667F37' },
  umkm: { label: 'UMKM', color: '#F0AC6D' },
}

export function MapFilterChips({
  active,
  onToggle,
}: {
  active: Record<MapLayer, boolean>
  onToggle: (layer: MapLayer) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(LAYER_META) as MapLayer[]).map((layer) => {
        const meta = LAYER_META[layer]
        const isActive = active[layer]
        return (
          <button
            key={layer}
            onClick={() => onToggle(layer)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
              isActive
                ? 'border-transparent bg-cream-beige text-brown-900 shadow-sm'
                : 'border-tan-700/30 bg-page text-ink/60'
            )}
            aria-pressed={isActive}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: meta.color, opacity: isActive ? 1 : 0.4 }}
            />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
