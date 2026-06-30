import { describe, it, expect } from 'vitest'
import { getSettings, getPageSettings, getEmptyStates, getJejakiCards, getFooter } from '@/lib/settings'

describe('getSettings', () => {
  it('returns all top-level fields', () => {
    const s = getSettings()
    expect(s.heroImage).toBeTruthy()
    expect(s.heroTagline).toBeTruthy()
    expect(s.stats).toBeDefined()
    expect(s.stats.luas).toBeTruthy()
    expect(s.stats.penduduk).toBeTruthy()
    expect(s.stats.desaKelurahan).toBeTruthy()
    expect(s.stats.kabupaten).toBeTruthy()
    expect(s.festivalDates).toBeTruthy()
    expect(s.socials).toBeDefined()
    expect(s.contact).toBeDefined()
    expect(s.contact.email).toBeTruthy()
  })

  it('returns homepageIntros with new fields', () => {
    const s = getSettings()
    const hi = s.homepageIntros
    expect(hi.aboutKicker).toBeTruthy()
    expect(hi.aboutTitle).toBeTruthy()
    expect(hi.aboutIntro).toBeTruthy()
    expect(hi.scrollPrompt).toBeTruthy()
    expect(hi.jejakiKicker).toBeTruthy()
  })

  it('returns emptyStates with all keys', () => {
    const s = getSettings()
    const e = s.emptyStates
    expect(e.pariwisata).toBeTruthy()
    expect(e.irigasi).toBeTruthy()
    expect(e.kesehatan).toBeTruthy()
    expect(e.umkm).toBeTruthy()
    expect(e.kegiatan).toBeTruthy()
    expect(e.festival).toBeTruthy()
    expect(e.lingkungan).toBeTruthy()
    expect(e.airTanah).toBeTruthy()
    expect(e.petaDataEmpty).toBeTruthy()
    expect(e.petaGisEmpty).toBeTruthy()
    expect(e.airTanahDataEmpty).toBeTruthy()
  })
})

describe('getPageSettings', () => {
  it('returns default home page settings', () => {
    const ps = getPageSettings('home')
    expect(ps.heroKicker).toBeTruthy()
    expect(ps.heroTitle).toBeTruthy()
    expect(ps.seoTitle).toBeTruthy()
    expect(ps.seoDescription).toBeTruthy()
  })

  it('returns peta page settings with extra fields', () => {
    const ps = getPageSettings('peta')
    expect(ps.heroKicker).toBeTruthy()
    expect(ps.dataSectionTitle).toBeTruthy()
    expect(ps.gisSectionTitle).toBeTruthy()
  })

  it('returns lingkungan page settings with extra fields', () => {
    const ps = getPageSettings('lingkungan')
    expect(ps.heroKicker).toBeTruthy()
    expect(ps.dataSectionTitle).toBeTruthy()
    expect(ps.linkToPeta).toBeTruthy()
  })

  it('returns tentang page settings with section fields', () => {
    const ps = getPageSettings('tentang')
    expect(ps.sectionGeografiKicker).toBeTruthy()
    expect(ps.sectionGeografiTitle).toBeTruthy()
    expect(ps.sectionDesaKicker).toBeTruthy()
    expect(ps.sectionPotensiKicker).toBeTruthy()
  })

  it('returns settings for all page names', () => {
    const pages = ['home', 'tentang', 'pariwisata', 'irigasi', 'kesehatan', 'umkm', 'peta', 'lingkungan', 'airTanah', 'festival', 'kegiatan'] as const
    for (const page of pages) {
      const ps = getPageSettings(page)
      expect(ps.heroTitle).toBeTruthy()
    }
  })
})

describe('getEmptyStates', () => {
  it('returns all 11 empty state keys', () => {
    const e = getEmptyStates()
    expect(Object.keys(e)).toHaveLength(11)
    expect(e.pariwisata).toBeTruthy()
    expect(e.petaDataEmpty).toBeTruthy()
    expect(e.airTanahDataEmpty).toBeTruthy()
  })
})

describe('getJejakiCards', () => {
  it('returns array with href, title, desc, accent', () => {
    const cards = getJejakiCards()
    expect(cards.length).toBeGreaterThanOrEqual(5)
    for (const card of cards) {
      expect(card.href).toMatch(/^\//)
      expect(card.title).toBeTruthy()
      expect(card.desc).toBeTruthy()
      expect(card.accent).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('getFooter', () => {
  it('returns tagline and copyright', () => {
    const f = getFooter()
    expect(f.tagline).toBeTruthy()
    expect(f.copyright).toBeTruthy()
  })
})