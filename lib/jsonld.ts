const BASE_URL = 'https://melukis-sambelia.vercel.app'

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Melukis Sambelia',
    url: BASE_URL,
    description: 'Portal komunitas KKN-PPM UGM Melukis Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa binaan.',
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
    url: `${BASE_URL}/cerita/${item.slug}`,
    image: item.cover.startsWith('/') ? `${BASE_URL}${item.cover}` : item.cover,
  }
}