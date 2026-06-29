import type { MetadataRoute } from 'next'
import { getCollection } from '@/lib/content'

const BASE = 'https://melukis-sambelia.vercel.app'

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
    { url: `${BASE}/cerita`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/air-tanah`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/lingkungan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
  const dynamic: MetadataRoute.Sitemap = [
    ...getCollection('pariwisata').map((p) => ({ url: `${BASE}/pariwisata/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...getCollection('cerita').map((c) => ({ url: `${BASE}/cerita/${c.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...getCollection('umkm').map(() => ({ url: `${BASE}/umkm`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...getCollection('festival').map(() => ({ url: `${BASE}/festival`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 })),
  ]
  return [...staticRoutes, ...dynamic]
}