import { describe, it, expect } from 'vitest'
import { getCollection, getEntry } from '@/lib/content'

describe('content loaders', () => {
  it('reads pariwisata and finds by slug', () => {
    const items = getCollection('pariwisata')
    expect(items.length).toBeGreaterThan(0)
    const first = items[0] as any
    const found = getEntry('pariwisata', first.slug)
    expect(found).toBeTruthy()
  })

  it('returns empty array for unknown collection', () => {
    expect(getCollection('doesnotexist' as any)).toEqual([])
  })

  it('reads lingkungan collection with required fields', () => {
    const items = getCollection('lingkungan')
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(item.slug).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.description).toBeTruthy()
    }
  })

  it('reads desa collection with order field', () => {
    const items = getCollection('desa')
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(typeof item.order).toBe('number')
      expect(item.name).toBeTruthy()
    }
  })

  it('getEntry finds lingkungan by slug', () => {
    const items = getCollection('lingkungan')
    if (items.length > 0) {
      const found = getEntry('lingkungan', items[0].slug)
      expect(found).toBeTruthy()
      expect(found!.slug).toBe(items[0].slug)
    }
  })

  it('sorts collection items stably by order then slug', () => {
    const items = getCollection('pariwisata')
    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1]
      const curr = items[i]
      if (prev.order === curr.order) {
        expect(prev.slug.localeCompare(curr.slug)).toBeLessThanOrEqual(0)
      } else {
        expect(prev.order).toBeLessThanOrEqual(curr.order)
      }
    }
  })

  it('all collections have consistent slug format', () => {
    const collections = ['pariwisata', 'irigasi', 'kesehatan', 'festival', 'kegiatan', 'umkm', 'lingkungan', 'desa'] as const
    for (const col of collections) {
      const items = getCollection(col)
      for (const item of items) {
        expect(item.slug).toMatch(/^[a-z0-9-]+$/)
      }
    }
  })
})