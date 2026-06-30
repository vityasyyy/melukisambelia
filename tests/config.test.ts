import { describe, it, expect } from 'vitest'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, REVALIDATE_SECONDS } from '@/lib/config'

describe('config', () => {
  it('SITE_URL is a valid URL string', () => {
    expect(SITE_URL).toMatch(/^https?:\/\//)
  })

  it('SITE_NAME is a non-empty string', () => {
    expect(SITE_NAME.length).toBeGreaterThan(0)
  })

  it('SITE_DESCRIPTION is a non-empty string', () => {
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0)
  })

  it('REVALIDATE_SECONDS is a positive integer', () => {
    expect(REVALIDATE_SECONDS).toBeGreaterThan(0)
    expect(Number.isInteger(REVALIDATE_SECONDS)).toBe(true)
  })
})