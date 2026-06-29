import { describe, it, expect } from 'vitest'
import {
  pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, umkmSchema,
  settingsSchema, gisMapSchema,
} from '@/lib/schemas'

describe('schemas validate good data', () => {
  it('pariwisata with lat/lng', () => {
    const r = pariwisataSchema.safeParse({
      title: 'Pantai Berandangan', category: 'Pantai', village: 'Sugian',
      cover: '/images/pariwisata/berandangan.jpg', gallery: [],
      shortDesc: 'Pantai pasir putih.', body: 'MDX here', lat: -8.36, lng: 116.85,
      facilities: ['Toilet', 'Parkir'], accessNotes: '30 menit dari Sembalun',
    })
    expect(r.success).toBe(true)
  })
  it('irigasi', () => {
    const r = irigasiSchema.safeParse({
      name: 'Saluran Sugian', saluranType: 'Primer', village: 'Sugian',
      condition: 'Baik', lengthM: 1200, flowStatus: 'Mengalir',
      cover: '/images/irigasi/sugian.jpg', body: 'Detail saluran.', lat: -8.35, lng: 116.84,
    })
    expect(r.success).toBe(true)
  })
  it('settings', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Jelajahi Kecamatan Sambelia',
      stats: { luas: '1.742 km²', penduduk: '~150k', desaKelurahan: '7', kabupaten: 'Lombok Timur' },
      festivalDates: 'Juli - Agustus 2026',
      socials: { instagram: 'melukis.sambelia', tiktok: 'melukis.sambelia' },
      contact: { email: 'melukis.sambelia@ugm.ac.id', phone: '+62 812 0000 0000', address: 'Sambelia, Lombok Timur, NTB' },
    })
    expect(r.success).toBe(true)
  })
  it('umkm with kategori and required lat/lng', () => {
    const r = umkmSchema.safeParse({
      name: 'Peyek Mangrove', owner: 'Muadz', kategori: 'Kuliner',
      village: 'Labuhan Pandan', contact: '', cover: '/images/peyek.jpg',
      gallery: [], body: 'Camilan khas.', lat: -8.34, lng: 116.86,
    })
    expect(r.success).toBe(true)
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
  it('umkm rejects missing lat/lng', () => {
    const r = umkmSchema.safeParse({
      name: 'Test', owner: 'Test', kategori: 'Kuliner',
      village: 'Sugian', contact: '', cover: '/images/test.jpg',
      gallery: [], body: 'Test',
    })
    expect(r.success).toBe(false)
  })
})