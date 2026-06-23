import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCollection, getEntry } from '@/lib/content'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'

export function generateStaticParams() {
  return getCollection('cerita').map((c) => ({ slug: c.slug }))
}

export default function CeritaDetailPage({ params }: { params: { slug: string } }) {
  const item = getEntry('cerita', params.slug)
  if (!item) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/cerita" className="text-sm text-water-900 transition-colors hover:text-terracotta-500">
        ← Kembali
      </Link>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-2xl shadow-terracotta">
        <Image src={item.cover} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      <SectionHeader kicker={item.date} title={item.title} intro={`Oleh ${item.author}`} tone="brown" />

      <div className="prose prose-lg max-w-none text-ink/80">{item.body}</div>

      <MotifDivider className="mt-12" />
    </article>
  )
}
