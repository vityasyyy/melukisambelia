import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getJejakiCards, getPageSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { SITE_URL, REVALIDATE_SECONDS } from '@/lib/config'
import { CountUpStat } from '@/components/CountUpStat'
import { SectionHeader } from '@/components/SectionHeader'
import { KegiatanStats } from '@/components/KegiatanStats'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { HeroAnimation } from '@/components/HeroAnimation'
import { CountdownStrip } from '@/components/CountdownStrip'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { UmkmCard } from '@/components/UmkmCard'
import { WisataUnggulanClient } from '@/components/WisataUnggulanClient'
import { MotifFloater } from '@/components/MotifFloater'
import { MotifDivider } from '@/components/MotifDivider'
import Link from 'next/link'

const pageSettings = getPageSettings('home')

export const metadata: Metadata = {
  title: pageSettings.seoTitle || 'Beranda',
  description: pageSettings.seoDescription || 'Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa.',
  alternates: { canonical: '/' },
  openGraph: {
    title: pageSettings.seoTitle || 'Sambelia',
    description: pageSettings.seoDescription || 'Portal informasi Kecamatan Sambelia',
    url: SITE_URL,
    siteName: 'Sambelia',
    type: 'website',
  },
}

export const revalidate = REVALIDATE_SECONDS

export default function Beranda() {
  const s = getSettings()
  const hi = s.homepageIntros
  const jejaki = getJejakiCards()
  const pariwisata = getCollection('pariwisata')
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival')
  const umkm = getCollection('umkm')

  const previews = jejaki.map((card) => {
    const imageMap: Record<string, string | undefined> = {
      '/pariwisata': pariwisata[0]?.cover,
      '/irigasi': irigasi[0]?.cover,
      '/kesehatan': kesehatan[0]?.cover,
      '/festival': festival[0]?.cover,
      '/umkm': umkm[0]?.cover,
    }
    return {
      ...card,
      image: card.image || imageMap[card.href] || '/images/content/pariwisata-marine.webp',
    }
  })

  const wisataUnggulan = pariwisata.slice(0, 3)
  const umkmSpotlight = umkm.slice(0, 3)
  const festivalData = festival.map((f) => ({
    eventName: f.eventName,
    schedule: f.schedule,
    venue: f.venue,
    description: f.description,
    cover: f.cover,
    registrationUrl: f.registrationUrl,
    body: f.body,
    order: f.order,
  }))

  return (
    <>
      <section className="relative z-0 -mt-[63px] flex h-[100dvh] min-h-[600px] items-center justify-center overflow-hidden text-center">
        <HeroAnimation src={s.heroImage} tagline={s.heroTagline} />
      </section>

      <section id="tentang" className="relative z-10 scroll-mt-16 overflow-hidden bg-page">
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="gold" />
          <FadeIn>
            <SectionHeader
              kicker={hi.aboutKicker || '01 — TENTANG'}
              title={hi.aboutTitle || 'Tentang Sambelia'}
              intro={hi.aboutIntro || 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.'}
              tone="terracotta"
            />
          </FadeIn>
          <StaggerContainer stagger={0.08} className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StaggerItem><CountUpStat label="Luas" value={s.stats.luas} /></StaggerItem>
            <StaggerItem><CountUpStat label="Penduduk" value={s.stats.penduduk} /></StaggerItem>
            <StaggerItem><CountUpStat label="Desa/Kelurahan" value={s.stats.desaKelurahan} /></StaggerItem>
            <StaggerItem><CountUpStat label="Kabupaten" value={s.stats.kabupaten} /></StaggerItem>
          </StaggerContainer>
          <div className="mt-5 text-center">
            <Link
              href="/tentang-sambelia"
              className="inline-flex items-center gap-1.5 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brown-700 hover:scale-[1.02]"
            >
              Selengkapnya
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      <MotifDivider />

      <section className="relative bg-cream-beige">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(240,172,109,0.06),transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
          <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="terracotta" />
          <FadeIn>
            <SectionHeader kicker={hi.jejakiKicker} title={hi.jejakiTitle} tone="gold" />
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
            {previews.map((p, i) => (
              <div key={p.href} className="snap-center shrink-0 w-[80vw] sm:w-[420px]">
                <a href={p.href} className="group block h-full">
                  <div className="relative overflow-hidden rounded-2xl border border-tan-700/15 border-l-[3px] bg-card shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover hover:border-terracotta-500/25 h-full" style={{ borderLeftColor: p.accent }}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 80vw, 420px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent" />
                      <div aria-hidden className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brown-950/60 font-beautique-condensed text-sm font-bold text-gold-bright ring-1 ring-white/15 backdrop-blur-sm">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="absolute bottom-3 left-4 right-4 z-10 font-beautique text-2xl text-white group-hover:text-gold-bright transition-colors" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{p.title}</h3>
                    </div>
                    {p.desc && (
                      <div className="p-4">
                        <p className="text-sm leading-relaxed text-ink/70 line-clamp-2">{p.desc}</p>
                      </div>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
        </div>
      </section>

      <MotifDivider />

      {wisataUnggulan.length > 0 && (
        <section className="relative bg-page">
          <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
            <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="water" />
            <FadeIn>
              <SectionHeader
                kicker={hi.wisataKicker}
                title={hi.wisataTitle}
                intro={hi.wisataIntro}
                tone="water"
              />
            </FadeIn>
            <WisataUnggulanClient items={wisataUnggulan} />
            <div className="mt-5 text-center">
              <Link
                href="/pariwisata"
                className="inline-flex items-center gap-1.5 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brown-700 hover:scale-[1.02]"
              >
                Lihat semua wisata
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      {festival.length > 0 && (
        <section className="relative bg-terracotta-500/[0.08]">
          <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
            <MotifFloater motif="cincin_sambel" position="top-left" size="md" color="gold" />
            <FadeIn>
              <SectionHeader
                kicker={hi.festivalKicker}
                title={hi.festivalTitle}
                intro={hi.festivalIntro}
                tone="gold"
              />
            </FadeIn>
            <FadeIn>
              <CountdownStrip festivals={festivalData} />
            </FadeIn>
            <FadeIn delay={0.1} className="mt-6">
              <FestivalTimeline events={festival.slice(0, 2)} />
            </FadeIn>
            <div className="mt-5 text-center">
              <Link
                href="/festival"
                className="inline-flex items-center gap-1.5 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brown-700 hover:scale-[1.02]"
              >
                Lihat semua festival
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      {umkmSpotlight.length > 0 && (
        <section className="relative bg-cream-beige">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(240,172,109,0.06),transparent_70%)]" aria-hidden />
          <div className="relative mx-auto max-w-content overflow-hidden px-4 py-8 md:py-10">
            <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="gold" />
            <FadeIn>
              <SectionHeader
                kicker={hi.umkmKicker}
                title={hi.umkmTitle}
                intro={hi.umkmIntro}
                tone="gold"
              />
            </FadeIn>
            <StaggerContainer stagger={0.1} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {umkmSpotlight.map((u) => (
                <StaggerItem key={u.slug}>
                  <UmkmCard item={u} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="mt-5 text-center">
              <Link
                href="/umkm"
                className="inline-flex items-center gap-1.5 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brown-700 hover:scale-[1.02]"
              >
                Lihat semua UMKM
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      <section className="relative bg-gold-50/40">
        <KegiatanStats />
      </section>
    </>
  )
}