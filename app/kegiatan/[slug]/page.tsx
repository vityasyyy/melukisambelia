import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCollection, getEntry } from '@/lib/content'
import { Pill } from '@/components/Pill'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ShareButtons } from '@/components/ShareButtons'

export const revalidate = 60

export function generateStaticParams() {
  return getCollection('kegiatan').map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getEntry('kegiatan', params.slug)
  if (!item) return {}
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: { images: [item.cover] },
  }
}

export default function KegiatanDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('kegiatan', params.slug)
  if (!item) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    author: { '@type': 'Person', name: item.author },
    datePublished: item.date,
    image: item.cover,
    description: item.excerpt,
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'Kegiatan', href: '/kegiatan' },
          { label: item.title },
        ]}
      />
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/kegiatan" className="text-sm text-water-900 transition-colors hover:text-terracotta-500">
        ← Kembali
      </Link>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-2xl shadow-terracotta">
        <Image src={item.cover} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      <div className="mt-6">
        <Pill variant="terracotta" className="mb-3">{item.date}</Pill>
        <h1 className="font-beautique text-display-lg text-brown-900">{item.title}</h1>
        <p className="mt-3 text-ink/70 leading-relaxed">Oleh {item.author}</p>
      </div>

      <div className="prose prose-lg max-w-none text-ink/80">{item.body}</div>

      <ShareButtons title={item.title} className="mt-8" />

    </article>
    </>
  )
}