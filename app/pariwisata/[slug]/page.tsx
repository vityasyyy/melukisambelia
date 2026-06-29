import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCollection, getEntry } from '@/lib/content'
import { GalleryStrip } from '@/components/GalleryStrip'
import { MiniMapClient } from '@/components/MiniMapClient'
import { petaLink } from '@/lib/links'

export function generateStaticParams() {
  return getCollection('pariwisata').map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getEntry('pariwisata', params.slug)
  if (!item) return {}
  return {
    title: item.title,
    description: item.shortDesc,
    openGraph: {
      title: item.title,
      description: item.shortDesc,
      images: [{ url: item.cover, width: 1200, height: 630 }],
      type: 'article',
    },
    alternates: { canonical: `/pariwisata/${params.slug}` },
  }
}

export default function PariwisataDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('pariwisata', params.slug)
  if (!item) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: item.title,
    description: item.shortDesc,
    image: item.cover,
    geo: { '@type': 'GeoCoordinates', latitude: item.lat, longitude: item.lng },
    address: { '@type': 'PostalAddress', addressLocality: `${item.village}, Sambelia`, addressRegion: 'Lombok Timur, NTB', addressCountry: 'ID' },
  }

  return (
    <article className="mx-auto max-w-content px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/pariwisata" className="text-sm text-water-900 transition-colors hover:text-terracotta-500">
        ← Kembali
      </Link>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-2xl shadow-terracotta">
        <Image
          src={item.cover}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-cream-light/80">{item.category}</p>
          <h1 className="font-beautique text-3xl text-cream-light sm:text-4xl">{item.title}</h1>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm leading-relaxed text-ink/70">{item.shortDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-water-50 px-3 py-1 font-medium text-water-900">{item.village}</span>
        {item.facilities.map((f) => (
          <span key={f} className="rounded-full bg-gold-100 px-3 py-1 font-medium text-brown-900">
            {f}
          </span>
        ))}
      </div>

      <div className="prose prose-lg mt-6 max-w-none text-ink/80">{item.body}</div>

      <GalleryStrip images={item.gallery} altPrefix={item.title} />

      <div className="relative isolate mt-8">
        <MiniMapClient lat={item.lat} lng={item.lng} title={item.title} />
      </div>

      <Link
        href={petaLink({ layer: 'pariwisata', lat: item.lat, lng: item.lng })}
        className="mt-4 inline-block text-sm font-medium text-water-900 hover:text-water-500"
      >
        Lihat di peta →
      </Link>

    </article>
  )
}
