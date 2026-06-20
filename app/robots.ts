import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/', disallow: ['/admin'] },
    sitemap: 'https://melukis-sambelia.vercel.app/sitemap.xml',
  }
}