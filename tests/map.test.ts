import { describe, it, expect } from 'vitest'
import { getMapMarkers } from '@/lib/map'

describe('getMapMarkers', () => {
  it('aggregates markers from content collections', () => {
    const markers = getMapMarkers()
    expect(markers.length).toBeGreaterThan(0)
    const layers = new Set(markers.map((m) => m.layer))
    expect(layers.has('pariwisata')).toBe(true)
  })
  it('each marker has lat/lng/slug/title/layer', () => {
    const markers = getMapMarkers()
    for (const m of markers) {
      expect(typeof m.lat).toBe('number')
      expect(typeof m.lng).toBe('number')
      expect(typeof m.slug).toBe('string')
      expect(typeof m.title).toBe('string')
      expect(['pariwisata', 'irigasi', 'kesehatan', 'umkm']).toContain(m.layer)
    }
  })
})