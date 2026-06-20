import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'

export function generateStaticParams() {
  return getCollection('cerita').map((c) => ({ slug: c.slug }))
}

export default function CeritaDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('cerita', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/cerita" className="text-sm text-water-900 hover:underline">← Kembali</Link>
      <SectionHeader kicker={item.date} title={item.title} intro={`Oleh ${item.author}`} />
      <div className="prose mt-6 max-w-none whitespace-pre-wrap">{item.body}</div>
    </article>
  )
}