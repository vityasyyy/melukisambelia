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

import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
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
  const festival = [...getCollection('festival')].sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())
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

      <section id="tentang" aria-labelledby="tentang-heading" className="relative z-10 scroll-mt-16 overflow-hidden bg-page">
          <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="terracotta" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="olive" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

          <FadeIn>
            <SectionHeader
              kicker={hi.aboutKicker || '01 — TENTANG'}
              title={hi.aboutTitle || 'Tentang Sambelia'}
              intro={hi.aboutIntro || 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.'}
              tone="terracotta"
              headingId="tentang-heading"
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
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02] min-h-[44px]"
            >
              Selengkapnya →
            </Link>
          </div>
        </div>
      </section>

      <MotifDivider />

      <section aria-labelledby="jejaki-heading" className="relative overflow-hidden bg-cream-beige">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(240,172,109,0.06),transparent_70%)]" aria-hidden />
          <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="gold" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="water" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

          <FadeIn>
            <SectionHeader kicker={hi.jejakiKicker} title={hi.jejakiTitle} tone="gold" headingId="jejaki-heading" />
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
            {previews.map((p, i) => (
              <div key={p.href} className="snap-center shrink-0 w-[80vw] sm:w-[420px]">
                <a href={p.href} className="group block h-full">
                  <div className="glass-card glass-accent-left relative overflow-hidden h-full" style={{ '--accent-color': p.accent } as React.CSSProperties}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 80vw, 420px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-brown-950/20 to-transparent" />
                      <h3 className="absolute bottom-3 left-4 right-4 z-10 font-beautique text-2xl text-white group-hover:text-gold-bright transition-colors" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>{p.title}</h3>
                    </div>
                    {p.desc && (
                      <div className="px-5 pt-3 pb-4">
                        <span className="font-beautique-condensed text-[10px] tracking-[0.2em] uppercase text-ink/40">{String(i + 1).padStart(2, '0')}</span>
                        <p className="mt-1 text-sm leading-relaxed text-ink/60 line-clamp-2">{p.desc}</p>
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
        <section aria-labelledby="wisata-heading" className="relative overflow-hidden bg-page">
            <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="water" opacity={0.5} />
            <MotifFloater motif="cincin_sambel" position="bottom-left" size="md" color="gold" opacity={0.5} />
          <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

            <FadeIn>
              <SectionHeader
                kicker={hi.wisataKicker}
                title={hi.wisataTitle}
                intro={hi.wisataIntro}
                tone="water"
                headingId="wisata-heading"
              />
            </FadeIn>
            <WisataUnggulanClient items={wisataUnggulan} />
            <div className="mt-5 text-center">
                <Link
                  href="/pariwisata"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02] min-h-[44px]"
                >
                  Lihat semua wisata →
                </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      {festival.length > 0 && (
        <section aria-labelledby="festival-heading" className="relative overflow-hidden bg-terracotta-500/[0.08]">
            <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="terracotta" opacity={0.5} />
            <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" opacity={0.5} />
          <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

            <FadeIn>
              <SectionHeader
                kicker={hi.festivalKicker}
                title={hi.festivalTitle}
                intro={hi.festivalIntro}
                tone="gold"
                headingId="festival-heading"
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
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02] min-h-[44px]"
                >
                  Lihat semua festival →
                </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      {umkmSpotlight.length > 0 && (
        <section aria-labelledby="umkm-heading" className="relative overflow-hidden bg-cream-beige">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(240,172,109,0.06),transparent_70%)]" aria-hidden />
            <MotifFloater motif="bunga_sambel" position="top-left" size="md" color="terracotta" opacity={0.5} />
            <MotifFloater motif="cincin_sambel" position="bottom-right" size="sm" color="gold" opacity={0.5} />
          <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">

            <FadeIn>
              <SectionHeader
                kicker={hi.umkmKicker}
                title={hi.umkmTitle}
                intro={hi.umkmIntro}
                tone="gold"
                headingId="umkm-heading"
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
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brown-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02] min-h-[44px]"
              >
                Lihat semua UMKM →
              </Link>
            </div>
          </div>
        </section>
      )}

      <MotifDivider />

      <section aria-label="Statistik kegiatan" className="relative overflow-hidden bg-gold-50/40">
          <MotifFloater motif="cincin_sambel" position="top-left" size="sm" color="gold" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-right" size="md" color="terracotta" opacity={0.5} />
        <KegiatanStats />
      </section>
    </>
  )
}