import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { GalleryStrip } from '@/components/GalleryStrip'
import { MiniMapClient } from '@/components/MiniMapClient'
import { MotifDivider } from '@/components/MotifDivider'

export function generateStaticParams() {
  return getCollection('pariwisata').map((p) => ({ slug: p.slug }))
}

export default function PariwisataDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('pariwisata', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-content px-4 py-16">
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

      <SectionHeader kicker={item.category} title={item.title} intro={item.shortDesc} tone="water" />

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

      <div className="mt-8">
        <MiniMapClient lat={item.lat} lng={item.lng} title={item.title} />
      </div>

      <MotifDivider className="mt-12" />
    </article>
  )
}
