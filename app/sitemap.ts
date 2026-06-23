import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'

const BASE = 'https://melukis-sambelia.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/tentang-sambelia', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/kegiatan', '/cerita', '/umkm', '/mitra']
  const dynamic: MetadataRoute.Sitemap = [
    ...getCollection('pariwisata').map((p) => ({ url: `${BASE}/pariwisata/${p.slug}`, lastModified: new Date() })),
    ...getCollection('cerita').map((c) => ({ url: `${BASE}/cerita/${c.slug}`, lastModified: new Date() })),
  ]
  return [...staticRoutes.map((r) => ({ url: `${BASE}${r}`, lastModified: new Date() })), ...dynamic]
}