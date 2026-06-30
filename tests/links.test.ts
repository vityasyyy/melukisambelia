import { describe, it, expect } from 'vitest'
import { petaLink } from '@/lib/links'

describe('petaLink', () => {
  it('returns /peta with no params', () => {
    expect(petaLink({})).toBe('/peta')
  })

  it('returns /peta?layer=X with layer', () => {
    const result = petaLink({ layer: 'pariwisata' })
    expect(result).toBe('/peta?layer=pariwisata')
  })

  it('returns /peta?layer=X&lat=Y&lng=Z with all params', () => {
    const result = petaLink({ layer: 'irigasi', lat: -8.35, lng: 116.84 })
    expect(result).toBe('/peta?layer=irigasi&lat=-8.35&lng=116.84')
  })

  it('returns /peta?lat=Y&lng=Z with only coordinates', () => {
    const result = petaLink({ lat: -8.36, lng: 116.85 })
    expect(result).toBe('/peta?lat=-8.36&lng=116.85')
  })

  it('returns /peta?tab=X&layer=Y with tab and layer', () => {
    const result = petaLink({ tab: 'data', layer: 'kesehatan' })
    expect(result).toBe('/peta?tab=data&layer=kesehatan')
  })
})