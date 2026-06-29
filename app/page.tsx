import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { KegiatanStats } from '@/components/KegiatanStats'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { HeroAnimation } from '@/components/HeroAnimation'
import { CountdownStrip } from '@/components/CountdownStrip'
import { FestivalTimeline } from '@/components/FestivalTimeline'
import { UmkmCard } from '@/components/UmkmCard'
import { MotifFloater } from '@/components/MotifFloater'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa.',
}

export const revalidate = 60

export default function Beranda() {
  const s = getSettings()
  const hi = s.homepageIntros
  const pariwisata = getCollection('pariwisata')
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival')
  const umkm = getCollection('umkm')

  const previews = [
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/content/pariwisata-marine.webp', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/content/irigasi-saluran.svg', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/content/kesehatan-fasilitas.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/air-tanah', image: '/images/content/pariwisata-marine.webp', title: 'Air & Tanah', desc: 'Data sumber daya air & tanah.', accent: '#3B82F6' },
    { href: '/lingkungan', image: '/images/content/kegiatan-ekowisata.svg', title: 'Lingkungan', desc: 'Kelestarian lingkungan Sambelia.', accent: '#22C55E' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/content/festival-pawai.webp', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/content/culture-rilistema.webp', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]

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
  }))

  return (
    <>
      <section className="relative flex h-[100dvh] min-h-[600px] items-center justify-center overflow-hidden text-center">
        <HeroAnimation src={s.heroImage} tagline={s.heroTagline} />

        <a
          href="#tentang"
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-cream-light/70 transition-colors hover:text-cream-light"
          aria-label="Gulir ke bawah"
        >
          <span className="mb-1 text-[10px] font-medium uppercase tracking-widest">Gulir untuk menjelajah</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      <section id="tentang" className="relative mx-auto max-w-content overflow-hidden px-4 py-16">
        <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="gold" />
        <FadeIn>
          <SectionHeader
            kicker="01 — TENTANG"
            title="Tentang Sambelia"
            intro="Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan."
            tone="terracotta"
          />
        </FadeIn>
        <StaggerContainer stagger={0.08} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StaggerItem><StatCard label="Luas" value={s.stats.luas} /></StaggerItem>
          <StaggerItem><StatCard label="Penduduk" value={s.stats.penduduk} /></StaggerItem>
          <StaggerItem><StatCard label="Desa/Kelurahan" value={s.stats.desaKelurahan} /></StaggerItem>
          <StaggerItem><StatCard label="Kabupaten" value={s.stats.kabupaten} /></StaggerItem>
        </StaggerContainer>
        <div className="mt-6 text-center">
          <Link
            href="/tentang-sambelia"
            className="inline-block rounded-full border border-tan-700/30 px-5 py-2.5 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-beige"
          >
            Selengkapnya →
          </Link>
        </div>
      </section>

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-8">
        <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="terracotta" />
        <FadeIn>
          <SectionHeader kicker={hi.jejakiKicker} title={hi.jejakiTitle} tone="gold" />
        </FadeIn>
        <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => (
            <StaggerItem key={p.href}>
              <DataCard {...p} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Wisata Unggulan */}
      {wisataUnggulan.length > 0 && (
        <section className="relative mx-auto max-w-content overflow-hidden px-4 py-12">
          <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="water" />
          <MotifFloater motif="cincin_sambel" position="bottom-left" size="sm" color="water" />
          <FadeIn>
            <SectionHeader
              kicker={hi.wisataKicker}
              title={hi.wisataTitle}
              intro={hi.wisataIntro}
              tone="water"
            />
          </FadeIn>
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wisataUnggulan.map((p) => (
              <StaggerItem key={p.slug}>
                <DataCard
                  href={`/pariwisata/${p.slug}`}
                  image={p.cover}
                  title={p.title}
                  chips={[
                    { label: p.category, color: '#14A8E1' },
                    { label: p.village, color: '#99BA57' },
                  ]}
                  desc={p.shortDesc}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-6 text-center">
            <Link
              href="/pariwisata"
              className="inline-block rounded-full border border-tan-700/30 px-5 py-2 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-beige"
            >
              Lihat semua wisata →
            </Link>
          </div>
        </section>
      )}

      {/* Festival Terdekat */}
      {festival.length > 0 && (
        <section className="relative mx-auto max-w-content overflow-hidden px-4 py-12">
          <MotifFloater motif="cincin_sambel" position="top-left" size="md" color="gold" />
          <MotifFloater motif="bunga_sambel" position="bottom-right" size="sm" color="terracotta" />
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
          <FadeIn delay={0.1} className="mt-8">
            <FestivalTimeline events={festival.slice(0, 2)} />
          </FadeIn>
          <div className="mt-6 text-center">
            <Link
              href="/festival"
              className="inline-block rounded-full border border-tan-700/30 px-5 py-2 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-beige"
            >
              Lihat semua festival →
            </Link>
          </div>
        </section>
      )}

      {/* UMKM Spotlight */}
      {umkmSpotlight.length > 0 && (
        <section className="relative mx-auto max-w-content overflow-hidden px-4 py-12">
          <MotifFloater motif="bunga_sambel" position="bottom-right" size="md" color="olive" />
          <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="terracotta" />
          <FadeIn>
            <SectionHeader
              kicker={hi.umkmKicker}
              title={hi.umkmTitle}
              intro={hi.umkmIntro}
              tone="terracotta"
            />
          </FadeIn>
          <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {umkmSpotlight.map((u) => (
              <StaggerItem key={u.slug}>
                <UmkmCard item={u} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-6 text-center">
            <Link
              href="/umkm"
              className="inline-block rounded-full border border-tan-700/30 px-5 py-2 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-beige"
            >
              Lihat semua UMKM →
            </Link>
          </div>
        </section>
      )}

      <KegiatanStats />
    </>
  )
}