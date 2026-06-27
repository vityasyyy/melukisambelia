import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'
import { KilasSambelia } from '@/components/KilasSambelia'
import { FadeIn } from '@/components/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { HeroAnimation } from '@/components/HeroAnimation'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Portal komunitas KKN-PPM UGM Melukis Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa binaan.',
}

export default function Beranda() {
  const s = getSettings()
  const pariwisata = getCollection('pariwisata').slice(0, 1)
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival').slice(0, 1)
  const umkm = getCollection('umkm').slice(0, 1)

  const previews = [
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/content/pariwisata-marine.webp', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/content/irigasi-saluran.svg', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/content/kesehatan-fasilitas.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/content/festival-pawai.webp', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/content/culture-rilistema.webp', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]

  return (
    <>
      <section className="relative flex h-[100dvh] min-h-[600px] items-center justify-center overflow-hidden text-center">
        <HeroAnimation src={s.heroImage} tagline={s.heroTagline} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brown-900/40 via-brown-900/20 to-brown-900/70" />
        <div className="absolute inset-0 -z-10 hero-vignette" />
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />

        <a
          href="#tentang"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-cream-light/80 transition-colors hover:text-cream-light"
          aria-label="Gulir ke bawah"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </a>
      </section>

      <section id="tentang" className="relative mx-auto max-w-content px-4 py-16">
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
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
          <StaggerItem><StatCard label="Desa Binaan" value={s.stats.desaBinaan} /></StaggerItem>
          <StaggerItem><StatCard label="Tahun Program" value={s.stats.tahunProgram} /></StaggerItem>
        </StaggerContainer>
      </section>

      <MotifDivider motif="cincin_sambel" />

      <section className="mx-auto max-w-content px-4 py-8">
        <FadeIn>
          <SectionHeader kicker="02 — JEJAKI" title="Jejaki Sambelia" tone="gold" />
        </FadeIn>
        <StaggerContainer stagger={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => (
            <StaggerItem key={p.href}>
              <DataCard {...p} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <KilasSambelia />
    </>
  )
}
