import Image from 'next/image'
import Link from 'next/link'
import { getCollection } from '@/lib/content'
import { getSettings } from '@/lib/settings'
import { FadeIn } from './FadeIn'
import { SectionHeader } from './SectionHeader'
import { CountUpStat } from './CountUpStat'

export function CeritaStats() {
  const cerita = getCollection('cerita').slice(0, 2)
  const s = getSettings()

  const statItems = [
    { label: 'Luas Wilayah', value: s.stats.luas },
    { label: 'Penduduk', value: s.stats.penduduk },
    { label: 'Desa Binaan', value: s.stats.desaBinaan },
    { label: 'Tahun Program', value: s.stats.tahunProgram },
  ]

  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <SectionHeader kicker="06 — CERITA & DATA" title="Cerita & Dampak" tone="gold" />
      </FadeIn>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Cerita teasers */}
        <div className="space-y-6">
          {cerita.map((c) => (
            <Link
              key={c.slug}
              href={`/cerita/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/40 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
            >
              <div className="grid sm:grid-cols-[200px,1fr]">
                <div className="relative aspect-[4/3] sm:aspect-auto overflow-hidden">
                  <Image src={c.cover} alt={c.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 200px" />
                </div>
                <div className="p-5">
                  <h3 className="font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{c.title}</h3>
                  <p className="mt-2 text-sm text-ink/70 line-clamp-2">{c.excerpt}</p>
                  <p className="mt-2 text-xs text-ink/60">{c.author} · {c.date}</p>
                </div>
              </div>
            </Link>
          ))}
          {cerita.length > 0 && (
            <Link href="/cerita" className="inline-block rounded-full border border-tan-700/30 px-5 py-2 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-beige">
              Baca semua cerita →
            </Link>
          )}
        </div>
        {/* Animated stats */}
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((stat) => (
            <CountUpStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </section>
  )
}