import { describe, it, expect } from 'vitest'
import {
  pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, umkmSchema,
  settingsSchema, gisMapSchema,
  lingkunganSchema, desaSchema, petaPageSchema, lingkunganPageSchema,
} from '@/lib/schemas'

describe('schemas validate good data', () => {
  it('pariwisata with lat/lng and optional googleMapsUrl', () => {
    const r = pariwisataSchema.safeParse({
      title: 'Pantai Berandangan', category: 'Pantai', village: 'Sugian',
      cover: '/images/pariwisata/berandangan.jpg', gallery: [],
      shortDesc: 'Pantai pasir putih.', body: 'MDX here', lat: -8.36, lng: 116.85,
      facilities: ['Toilet', 'Parkir'], accessNotes: '30 menit dari Sembalun',
      googleMapsUrl: 'https://maps.google.com/?q=-8.36,116.85',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.googleMapsUrl).toBe('https://maps.google.com/?q=-8.36,116.85')
      expect(r.data.order).toBe(0)
    }
  })
  it('pariwisata without googleMapsUrl defaults to undefined', () => {
    const r = pariwisataSchema.safeParse({
      title: 'Pantai Berandangan', category: 'Pantai', village: 'Sugian',
      cover: '/images/pariwisata/berandangan.jpg', gallery: [],
      shortDesc: 'Pantai pasir putih.', body: 'MDX here', lat: -8.36, lng: 116.85,
      facilities: [], accessNotes: '',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.googleMapsUrl).toBeUndefined()
      expect(r.data.order).toBe(0)
    }
  })
  it('irigasi with order and googleMapsUrl', () => {
    const r = irigasiSchema.safeParse({
      name: 'Saluran Sugian', saluranType: 'Primer', village: 'Sugian',
      condition: 'Baik', lengthM: 1200, flowStatus: 'Mengalir',
      cover: '/images/irigasi/sugian.jpg', body: 'Detail saluran.', lat: -8.35, lng: 116.84,
      order: 2, googleMapsUrl: 'https://maps.google.com/test',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.order).toBe(2)
      expect(r.data.googleMapsUrl).toBe('https://maps.google.com/test')
    }
  })
  it('festival with order default', () => {
    const r = festivalSchema.safeParse({
      eventName: 'Peresean', schedule: '2026-07-15', venue: 'Lapangan Sambelia',
      description: 'Pertunjukan tradisional.', cover: '/images/festival/pereseen.jpg',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.order).toBe(0)
    }
  })
  it('kegiatan with order', () => {
    const r = kegiatanSchema.safeParse({
      title: 'Survei Irigasi', author: 'Tim KKN', date: '2026-06-20',
      cover: '/images/kegiatan/survei.jpg', excerpt: 'Survei saluran irigasi.',
      body: 'Detail kegiatan.',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.order).toBe(0)
    }
  })
  it('umkm with kategori, order, and googleMapsUrl', () => {
    const r = umkmSchema.safeParse({
      name: 'Peyek Mangrove', owner: 'Muadz', kategori: 'Kuliner',
      village: 'Labuhan Pandan', contact: '', cover: '/images/peyek.jpg',
      gallery: [], body: 'Camilan khas.', lat: -8.34, lng: 116.86,
      order: 3, googleMapsUrl: 'https://maps.google.com/peyek',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.order).toBe(3)
      expect(r.data.googleMapsUrl).toBe('https://maps.google.com/peyek')
    }
  })
  it('lingkungan validates with all fields', () => {
    const r = lingkunganSchema.safeParse({
      title: 'Peta NDVI', category: 'Vegetasi',
      cover: '/images/content/kegiatan-ekowisata.svg',
      description: 'Analisis indeks vegetasi Sambelia.', body: 'Detail NDVI.',
      order: 1,
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.category).toBe('Vegetasi')
      expect(r.data.order).toBe(1)
    }
  })
  it('lingkungan rejects invalid category', () => {
    const r = lingkunganSchema.safeParse({
      title: 'Test', category: 'InvalidCategory',
      cover: '/images/test.jpg', description: 'Test desc.',
    })
    expect(r.success).toBe(false)
  })
  it('desa validates with order', () => {
    const r = desaSchema.safeParse({
      name: 'Sugian', description: 'Desa binaan.', image: '/images/sugian.jpg',
      order: 5,
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.order).toBe(5)
    }
  })
  it('petaPageSchema includes dataSectionTitle and gisSectionTitle', () => {
    const r = petaPageSchema.safeParse({
      heroKicker: 'PETA', heroTitle: 'Peta Sambelia',
      heroIntro: 'Jelajahi peta.', seoTitle: 'Peta', seoDescription: 'Peta interaktif.',
      dataSectionTitle: 'Lokasi Titik Data', gisSectionTitle: 'Peta Tematik GIS',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.dataSectionTitle).toBe('Lokasi Titik Data')
      expect(r.data.gisSectionTitle).toBe('Peta Tematik GIS')
    }
  })
  it('lingkunganPageSchema includes dataSectionTitle and linkToPeta', () => {
    const r = lingkunganPageSchema.safeParse({
      heroKicker: 'LINGKUNGAN', heroTitle: 'Vegetasi, Erosi & Blue Carbon',
      heroIntro: 'Analisis lingkungan.', seoTitle: 'Lingkungan', seoDescription: 'Peta lingkungan.',
      dataSectionTitle: 'Analisis Lingkungan', linkToPeta: 'Lihat di Peta Interaktif →',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.dataSectionTitle).toBe('Analisis Lingkungan')
      expect(r.data.linkToPeta).toBe('Lihat di Peta Interaktif →')
    }
  })
  it('settings validates with extended homepageIntros and emptyStates', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Jelajahi Sambelia',
      stats: { luas: '125 km²', penduduk: '~20.000', desaKelurahan: '7', kabupaten: 'Lombok Timur' },
      festivalDates: 'Juli 2026',
      socials: { instagram: '', tiktok: '' },
      contact: { email: 'test@test.com', phone: '', address: 'Sambelia' },
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.homepageIntros.aboutKicker).toBeTruthy()
      expect(r.data.homepageIntros.aboutTitle).toBeTruthy()
      expect(r.data.homepageIntros.aboutIntro).toBeTruthy()
      expect(r.data.homepageIntros.scrollPrompt).toBeTruthy()
      expect(r.data.emptyStates.petaDataEmpty).toBeTruthy()
      expect(r.data.emptyStates.petaGisEmpty).toBeTruthy()
      expect(r.data.emptyStates.airTanahDataEmpty).toBeTruthy()
    }
  })
  it('settings defaults fill in all homepageIntros fields', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Test',
      stats: { luas: '1', penduduk: '1', desaKelurahan: '1', kabupaten: 'Test' },
      festivalDates: '2026',
      socials: { instagram: '', tiktok: '' },
      contact: { email: 'test@test.com', phone: '', address: 'Test' },
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.homepageIntros.aboutKicker).toBe('01 — TENTANG')
      expect(r.data.homepageIntros.scrollPrompt).toBe('Gulir untuk menjelajah')
    }
  })
  it('settings defaults fill in all emptyStates fields', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Test',
      stats: { luas: '1', penduduk: '1', desaKelurahan: '1', kabupaten: 'Test' },
      festivalDates: '2026',
      socials: { instagram: '', tiktok: '' },
      contact: { email: 'test@test.com', phone: '', address: 'Test' },
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.emptyStates.pariwisata).toBeTruthy()
      expect(r.data.emptyStates.petaDataEmpty).toBeTruthy()
      expect(r.data.emptyStates.airTanahDataEmpty).toBeTruthy()
    }
  })
})

describe('schemas reject bad data', () => {
  it('pariwisata rejects out-of-range lat', () => {
    const r = pariwisataSchema.safeParse({
      title: 'x', category: 'Pantai', village: 'Sugian', cover: '', gallery: [],
      shortDesc: '', body: '', lat: 95, lng: 0, facilities: [], accessNotes: '',
    })
    expect(r.success).toBe(false)
  })
  it('umkm defaults missing lat/lng', () => {
    const r = umkmSchema.safeParse({
      name: 'Test', owner: 'Test', kategori: 'Kuliner',
      village: 'Sugian', contact: '', cover: '/images/test.jpg',
      gallery: [], body: 'Test',
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.lat).toBe(-8.6)
      expect(r.data.lng).toBe(116.5)
    }
  })
  it('lingkungan rejects missing required fields', () => {
    const r = lingkunganSchema.safeParse({
      title: 'Test',
    })
    expect(r.success).toBe(false)
  })
  it('desa rejects missing name', () => {
    const r = desaSchema.safeParse({
      description: 'Test', image: '/images/test.jpg',
    })
    expect(r.success).toBe(false)
  })
})