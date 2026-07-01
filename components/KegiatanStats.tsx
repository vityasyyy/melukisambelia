import Image from 'next/image'
import Link from 'next/link'
import { getCollection } from '@/lib/content'
import { getSettings } from '@/lib/settings'
import { FadeIn } from './FadeIn'
import { SectionHeader } from './SectionHeader'
import { MotifFloater } from './MotifFloater'

export function KegiatanStats() {
  const kegiatan = getCollection('kegiatan').slice(0, 3)
  const empty = getSettings().emptyStates

  return (
    <div className="mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
      <MotifFloater motif="bunga_sambel" position="top-right" size="lg" color="gold" />
      <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="terracotta" />
      <FadeIn>
        <SectionHeader kicker="06 — KEGIATAN" title="Kegiatan Sambelia" tone="gold" />
      </FadeIn>
      {kegiatan.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kegiatan.map((c) => (
            <Link
              key={c.slug}
              href={`/kegiatan/${c.slug}`}
              className="group overflow-hidden rounded-2xl border-l-[3px] border-l-gold-500 bg-white/70 backdrop-blur-sm shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover hover:bg-white/90"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image src={c.cover} alt={c.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brown-950/20 to-transparent" />
              </div>
              <div className="min-w-0 p-4">
                <h3 className="truncate font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{c.title}</h3>
                <p className="mt-2 text-sm text-ink/70 line-clamp-2">{c.excerpt}</p>
                <p className="mt-2 font-beautique-condensed text-[10px] tracking-widest uppercase text-ink/60">{c.author} · {c.date}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-ink/70">{empty.kegiatan}</p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/kegiatan" className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-brown-950/20 bg-brown-950/5 px-5 py-2.5 text-sm font-beautique text-brown-900 transition-all hover:bg-brown-950/10 hover:border-brown-950/30 hover:scale-[1.02]">
          Lihat semua kegiatan →
        </Link>
        <Link href="/tentang-sambelia" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-5 py-2.5 text-sm font-beautique text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02]">
          Tentang Sambelia →
        </Link>
      </div>
    </div>
  )
}