import { SITE_URL } from './config'

const BASE_URL = SITE_URL

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sambelia',
    url: BASE_URL,
    description: 'Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa.',
  }
}

export function touristAttractionJsonLd(item: { title: string; slug: string; shortDesc: string; cover: string; lat: number; lng: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.shortDesc,
    url: `${BASE_URL}/pariwisata/${item.slug}`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: item.lat,
      longitude: item.lng,
    },
  }
}

export function localBusinessJsonLd(item: { name: string; slug: string; kategori: string; village: string; cover: string; lat: number; lng: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: item.name,
    description: `${item.kategori} di ${item.village}`,
    url: `${BASE_URL}/umkm`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: item.lat,
      longitude: item.lng,
    },
  }
}

export function eventJsonLd(item: { eventName: string; schedule: string; venue: string; description: string; cover: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: item.eventName,
    description: item.description,
    location: { '@type': 'Place', name: item.venue },
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
  }
}

export function articleJsonLd(item: { title: string; slug: string; author: string; date: string; excerpt: string; cover: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    author: { '@type': 'Person', name: item.author },
    datePublished: item.date,
    description: item.excerpt,
    url: `${BASE_URL}/kegiatan/${item.slug}`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
  }
}