import { describe, it, expect } from 'vitest'
import {
  timSchema, pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, ceritaSchema, umkmSchema, mitraSchema,
  settingsSchema, gisMapSchema,
} from '@/lib/schemas'

describe('schemas validate good data', () => {
  it('tim', () => {
    const r = timSchema.safeParse({
      name: 'Siti', role: 'Ketua Pelaksana', division: 'Koor',
      photo: '/images/tim/siti.jpg', bio: 'Lulusan Sosiologi UGM.',
      instagram: 'sitiii', order: 1,
    })
    expect(r.success).toBe(true)
  })
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
  it('kegiatan with milestones', () => {
    const r = kegiatanSchema.safeParse({
      title: 'Ekowisata Mangrove', status: 'Aktif', category: 'Ekowisata',
      cover: '/images/kegiatan/mangrove.jpg', summary: 'Konservasi mangrove.',
      body: 'Detail.', milestones: [{ date: '2026-07-01', label: 'Survei awal', done: true }],
    })
    expect(r.success).toBe(true)
  })
  it('settings', () => {
    const r = settingsSchema.safeParse({
      heroImage: '/images/hero.jpg', heroTagline: 'Melukis Sambelia',
      stats: { luas: '1.742 km²', penduduk: '~150k', desaBinaan: '2', tahunProgram: '2026' },
      festivalDates: 'Juli - Agustus 2026',
      socials: { instagram: 'melukis.sambelia', tiktok: 'melukis.sambelia' },
      contact: { email: 'melukis.sambelia@ugm.ac.id', phone: '+62 812 0000 0000', address: 'Sambelia, Lombok Timur, NTB' },
    })
    expect(r.success).toBe(true)
  })
})

describe('schemas reject bad data', () => {
  it('tim rejects bad division', () => {
    const r = timSchema.safeParse({ name: 'x', role: 'x', division: 'TidakAda', photo: '', bio: '', instagram: '', order: 1 })
    expect(r.success).toBe(false)
  })
  it('pariwisata rejects out-of-range lat', () => {
    const r = pariwisataSchema.safeParse({
      title: 'x', category: 'Pantai', village: 'Sugian', cover: '', gallery: [],
      shortDesc: '', body: '', lat: 95, lng: 0, facilities: [], accessNotes: '',
    })
    expect(r.success).toBe(false)
  })
})