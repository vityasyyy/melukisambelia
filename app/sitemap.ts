import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'
import { SITE_URL } from '@/lib/config'

const BASE = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/tentang-sambelia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/peta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/pariwisata`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/irigasi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/kesehatan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/umkm`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/festival`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/kegiatan`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/air-tanah`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/lingkungan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/changelog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
  ]

  const umkm = getCollection('umkm')
  const festival = getCollection('festival')
  const irigasi = getCollection('irigasi')
  const kesehatan = getCollection('kesehatan')
  const airTanah = getCollection('airTanah')
  const lingkungan = getCollection('lingkungan')

  const dynamic: MetadataRoute.Sitemap = [
    ...getCollection('pariwisata').map((p) => ({ url: `${BASE}/pariwisata/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...getCollection('kegiatan').map((c) => ({ url: `${BASE}/kegiatan/${c.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...umkm.map((u) => ({ url: `${BASE}/umkm/${u.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...festival.map((f) => ({ url: `${BASE}/festival/${f.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...irigasi.map((i) => ({ url: `${BASE}/irigasi/${i.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...kesehatan.map((k) => ({ url: `${BASE}/kesehatan/${k.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...airTanah.map((a) => ({ url: `${BASE}/air-tanah/${a.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...lingkungan.map((l) => ({ url: `${BASE}/lingkungan/${l.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]

  return [...staticRoutes, ...dynamic]
}