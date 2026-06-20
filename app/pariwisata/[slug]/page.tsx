import { notFound } from 'next/navigation'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { GalleryStrip } from '@/components/GalleryStrip'
import { MiniMapClient } from '@/components/MiniMapClient'
import Link from 'next/link'

export function generateStaticParams() {
  return getCollection('pariwisata').map((p) => ({ slug: p.slug }))
}

export default function PariwisataDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('pariwisata', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-content px-4 py-16">
      <Link href="/pariwisata" className="text-sm text-water-900 hover:underline">← Kembali</Link>
      <SectionHeader kicker={item.category} title={item.title} intro={item.shortDesc} />
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-water-50 px-3 py-1 text-water-900">{item.village}</span>
        {item.facilities.map((f) => <span key={f} className="rounded-full bg-gold-100 px-3 py-1">{f}</span>)}
      </div>
      <div className="prose mt-6 max-w-none whitespace-pre-wrap">{item.body}</div>
      <GalleryStrip images={item.gallery} altPrefix={item.title} />
      <div className="mt-8">
        <MiniMapClient lat={item.lat} lng={item.lng} title={item.title} />
      </div>
    </article>
  )
}