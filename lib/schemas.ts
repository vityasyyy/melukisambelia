import { z } from 'zod'

export const timSchema = z.object({
  name: z.string(),
  role: z.string(),
  division: z.enum(['Koor', 'Pariwisata', 'Irigasi', 'Kesehatan', 'Publikasi', 'Media', 'Dana', 'Logistik']),
  photo: z.string(),
  bio: z.string(),
  instagram: z.string().optional().default(''),
  order: z.number().int(),
})

export const pariwisataSchema = z.object({
  title: z.string(),
  category: z.enum(['Pantai', 'Budaya', 'Desa Wisata', 'Air', 'Trekking']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  shortDesc: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  facilities: z.array(z.string()).default([]),
  accessNotes: z.string().default(''),
})

export const irigasiSchema = z.object({
  name: z.string(),
  saluranType: z.enum(['Primer', 'Sekunder', 'Tersier']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  condition: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat']),
  lengthM: z.number().nonnegative(),
  flowStatus: z.enum(['Mengalir', 'Kering', 'Mengalir Sebagian']),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const kesehatanSchema = z.object({
  facilityName: z.string(),
  type: z.enum(['Posyandu', 'Puskesmas', 'Bidan', 'Polides']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cadresCount: z.number().int().nonnegative().default(0),
  stuntingProgram: z.boolean().default(false),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const festivalSchema = z.object({
  eventName: z.string(),
  schedule: z.string(),
  venue: z.string(),
  description: z.string(),
  cover: z.string(),
  registrationUrl: z.string().url().optional(),
  body: z.string().default(''),
})

export const milestoneSchema = z.object({
  date: z.string(),
  label: z.string(),
  done: z.boolean().default(false),
})

export const kegiatanSchema = z.object({
  title: z.string(),
  status: z.enum(['Aktif', 'Berkembang', 'Persiapan']),
  category: z.enum(['Ekowisata', 'Irigasi', 'Kesehatan', 'Pariwisata', 'Ekonomi']),
  cover: z.string(),
  summary: z.string(),
  body: z.string(),
  milestones: z.array(milestoneSchema).default([]),
})

export const ceritaSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  cover: z.string(),
  excerpt: z.string(),
  body: z.string(),
})

export const umkmSchema = z.object({
  name: z.string(),
  owner: z.string(),
  product: z.enum(['Kerajinan', 'Kuliner', 'Pertanian', 'Anyaman', 'lainnya']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  contact: z.string(),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  body: z.string(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
})

export const mitraSchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string().url(),
  tier: z.enum(['Utama', 'Pendukung', 'Media']),
  order: z.number().int(),
})

export const settingsSchema = z.object({
  heroImage: z.string(),
  heroTagline: z.string(),
  stats: z.object({
    luas: z.string(),
    penduduk: z.string(),
    desaBinaan: z.string(),
    tahunProgram: z.string(),
  }),
  festivalDates: z.string(),
  socials: z.object({
    instagram: z.string().optional().default(''),
    tiktok: z.string().optional().default(''),
  }),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
})

export const gisMapSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
})

export type Tim = z.infer<typeof timSchema>
export type Pariwisata = z.infer<typeof pariwisataSchema>
export type Irigasi = z.infer<typeof irigasiSchema>
export type Kesehatan = z.infer<typeof kesehatanSchema>
export type Festival = z.infer<typeof festivalSchema>
export type Kegiatan = z.infer<typeof kegiatanSchema>
export type Cerita = z.infer<typeof ceritaSchema>
export type Umkm = z.infer<typeof umkmSchema>
export type Mitra = z.infer<typeof mitraSchema>
export type Settings = z.infer<typeof settingsSchema>
export type GisMap = z.infer<typeof gisMapSchema>