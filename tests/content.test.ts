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
})